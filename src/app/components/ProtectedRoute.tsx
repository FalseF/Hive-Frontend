"use client";
import { ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles = [],
}: {
  children: ReactNode;
  roles?: string[];
}) {
  const { user, accessToken } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else if (roles.length > 0 && !roles.some((r) => user?.roles?.includes(r))) {
      router.push("/unauthorized");
    }
  }, [accessToken, user]);

  return <>{children}</>;
}
