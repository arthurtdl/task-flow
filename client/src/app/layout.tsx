import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/hooks/auth-context";
import { Toaster } from "@/components/ui/sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Acesse o painel de gestão de tarefas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Passing the provider and Toaster to the children */}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}