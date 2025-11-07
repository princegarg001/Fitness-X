"use client";
import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";

export default function AuthWrapper({ children }: { children: ReactNode }) {
return <AuthProvider>{children}</AuthProvider>;
}
