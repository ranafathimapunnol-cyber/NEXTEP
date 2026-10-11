
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: { access?: string } = await response.json();

    if (!data.access) {
      return null;
    }

    localStorage.setItem("access_token", data.access);

    // Keep the cookie synchronized for Next.js middleware/proxy.
    document.cookie =
      `access_token=${encodeURIComponent(data.access)}; path=/; SameSite=Lax`;

    return data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let accessToken = getAccessToken();

  async function makeRequest(token: string | null): Promise<Response> {
    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  }

  let response = await makeRequest(accessToken);

  // Retry once if the access token has expired.
  if (response.status === 401 && accessToken) {
    accessToken = await refreshAccessToken();

    if (accessToken) {
      response = await makeRequest(accessToken);
    }
  }

  // Read the response body safely, including validation errors.
  const contentType = response.headers.get("content-type");

  let data: any = null;

  if (contentType?.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    console.error("API request failed:", {
      endpoint,
      status: response.status,
      details: data,
    });

    let message = "Something went wrong with the API request.";

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object") {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (typeof data.message === "string") {
        message = data.message;
      } else {
        message = Object.entries(data)
          .map(([field, errors]) => {
            const errorMessage = Array.isArray(errors)
              ? errors.join(", ")
              : typeof errors === "string"
                ? errors
                : JSON.stringify(errors);

            return `${field}: ${errorMessage}`;
          })
          .join("\n");
      }
    }

    throw new Error(message);
  }

  return data as T;
}