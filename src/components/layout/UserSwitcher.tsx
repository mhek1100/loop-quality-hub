import { Check, ChevronDown, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { roles } from "@/lib/mock/data";

export function UserSwitcher() {
  const { currentUser, setCurrentUser, userRoles, availableUsers, isAuthorizedSubmitter } = useUser();
  
  const initials = currentUser.name.split(" ").map((n) => n[0]).join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-3 h-auto py-2 px-3">
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{userRoles[0]?.name}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Switch Simulated User
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availableUsers.map((user) => {
          const userRolesList = roles.filter((r) => user.roleIds.includes(r.id));
          const isSelected = user.id === currentUser.id;
          
          return (
            <DropdownMenuItem
              key={user.id}
              onClick={() => setCurrentUser(user)}
              className="flex items-start gap-3 py-2 cursor-pointer"
            >
              <Avatar className="h-8 w-8 mt-0.5">
                <AvatarFallback className="bg-muted text-sm">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{user.name}</span>
                  {isSelected && <Check className="h-3 w-3 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userRolesList.map((role) => (
                    <Badge
                      key={role.id}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        
        <div className="px-2 py-2">
          <p className="text-xs text-muted-foreground mb-2">Current GPMS Headers</p>
          <div className="space-y-1 text-xs font-mono bg-muted/50 p-2 rounded">
            <p>
              <span className="text-muted-foreground">X-User-Email:</span>{" "}
              <span className="text-foreground">{currentUser.email || "—"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">X-Federated-Id:</span>{" "}
              <span className="text-foreground">{currentUser.federatedId || "—"}</span>
            </p>
          </div>
          {isAuthorizedSubmitter && (
            <Badge variant="default" className="mt-2 text-xs">
              <Check className="h-3 w-3 mr-1" />
              Authorized Submitter
            </Badge>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
