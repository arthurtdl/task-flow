"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Redirect if already logged
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard"); 
    }
  }, [currentUser, router]);

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Branding Pannel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 text-primary-foreground overflow-hidden bg-linear-to-br from-primary via-chart-1 to-chart-5">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-chart-3/30 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/15 backdrop-blur grid place-items-center ring-1 ring-white/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight">
            Gestão de tarefas,
            <br />
            <span className="text-white/60">sem esforço.</span>
          </h1>
          <p className="text-base xl:text-lg text-white/80 max-w-md leading-relaxed">
            Organize, priorize e acompanhe o trabalho da sua equipe com a
            clareza que a sua rotina merece.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/60">
          <span className="h-px w-10 bg-white/40" />
          © 2026 TaskFlow Labs
        </div>
      </aside>

      {/* Login Form */}
      <section className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md lg:hidden flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">TaskFlow</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}