"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth-context";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (tab === "register") {
        await register({ name, email, password });
        toast.success(`Conta criada com sucesso. Bem-vindo(a)!`);
      } else {
        await login({ email, password });
        toast.success(`Bem-vindo(a) de volta!`);
      }
      
      // Se a Promise resolver sem erros, o token já está salvo e podemos navegar
      router.push("/dashboard");
    } catch (error: any) {
      // Captura o erro do Axios (ou erro genérico)
      const errorMessage = 
        error.response?.data?.message || 
        "Ocorreu um erro inesperado. Tente novamente.";
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função auxiliar para trocar de aba e limpar os campos
  const handleTabChange = (newTab: "login" | "register") => {
    setTab(newTab);
    setName("");
    setEmail("");
    setPassword("");
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
            onClick={() => handleTabChange(t)}
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
              placeholder="Ex: João da Silva"
              disabled={isLoading}
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
            disabled={isLoading}
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
            placeholder="••••••••"
            disabled={isLoading}
            required
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aguarde...
            </>
          ) : tab === "login" ? (
            "Entrar"
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </div>
  );
}