import { useState, useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  doOnAuthStateChange,
} from "../../services/AuthService";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const unsub = doOnAuthStateChange((user) => {
      setAuthState(user ? "authenticated" : "unauthenticated");
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  if (authState === "loading") {
    return <div className="article-status">Loading...</div>;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
