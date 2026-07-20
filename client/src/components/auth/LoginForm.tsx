"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth-context";
import type { UserRole } from "@/types/user_types";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("ana@example.com");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("user");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "register") {
      register(name, email, password);
      toast.success(`Conta criada. Bem-vindo(a), ${name || "novo usuário"}!`);
    } else {
      login(email, password, role);
      toast.success(`Bem-vindo(a), ${role === "admin" ? "Admin" : "Usuário"}!`);
    }
    
    // Navega para o dashboard após o login
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          {tab === "login" ? "Acesse sua conta" : "Crie sua conta"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {tab === "login"
            ? "Continue de onde parou suas tarefas."
            : "Comece a organizar seu trabalho em minutos."}
        </p>
      </div>

      {/* Abas */}
      <div className="grid grid-cols-2 rounded-lg bg-muted p-1 mb-6">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md py-2 text-sm font-medium transition-all",
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "login" ? "Login" : "Criar Conta"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {tab === "login" && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Entrar como (mock)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                  role === "user"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:bg-accent",
                )}
              >
                <UserIcon className="h-4 w-4" />
                Usuário
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                  role === "admin"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:bg-accent",
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </button>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg">
          {tab === "login" ? "Entrar" : "Criar conta"}
        </Button>
      </form>
    </div>
  );
}