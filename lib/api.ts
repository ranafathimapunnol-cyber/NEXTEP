const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

function getRefreshToken() {
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

    const data = await response.json();

    localStorage.setItem(
      "access_token",
      data.access
    );

    document.cookie =
      `access_token=${data.access}; path=/; SameSite=Lax`;

    return data.access;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let accessToken = getAccessToken();

  async function makeRequest(token: string | null) {
    return fetch(`${API_URL}${endpoint}`, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    });
  }

  let response = await makeRequest(accessToken);

  /*
   * If the access token expired,
   * try to get a new one using the refresh token.
   */

  if (response.status === 401) {
    accessToken = await refreshAccessToken();

    if (accessToken) {
      response = await makeRequest(accessToken);
    }
  }

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        "Something went wrong with the API request."
    );
  }

  return data;
}