"use client";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token"); // or "access_token" if backend passes it in query
    if (token) {
      localStorage.setItem("access_token", token);
      // Remove query from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return <>{children}</>;
}
