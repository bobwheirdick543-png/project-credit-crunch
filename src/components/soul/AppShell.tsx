import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AppNav } from "./AppNav";
import { BackButton } from "./BackButton";

export function AppShell({ children, title, copy, back = true }: { children: ReactNode; title: string; copy?: string; back?: boolean }) {
  const { loading, user } = useAuth();
  if (loading) return <div className="aurora-bg flex min-h-svh items-center justify-center"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" search={{ next: location.pathname }} />;
  return <div className="aurora-bg min-h-svh"><AppNav /><main className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6">{back && <div className="mb-6"><BackButton /></div>}<header className="mb-8"><h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>{copy && <p className="mt-2 max-w-2xl text-muted-foreground">{copy}</p>}</header>{children}</main></div>;
}