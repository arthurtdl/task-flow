import { CheckCircle2, LogOut, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user_types";

interface TopbarProps {
  user: User;
  onLogout: () => void;
}

export function Topbar({ user, onLogout }: TopbarProps) {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <h1 className="font-semibold tracking-tight">Task Manager</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <UserIcon className="h-3 w-3" />
            {user.name}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}