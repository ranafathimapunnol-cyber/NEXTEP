"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BackGuard() {
  const router = useRouter();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    function handlePopState() {
      window.history.pushState(null, "", window.location.href);
      router.replace("/dashboard");
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return null;
}