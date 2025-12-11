import { Check, ChevronDown, User, Users } from "lucide-react";
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
import { users, roles } from "@/lib/mock/data";

export function UserSelector() {
  const { currentUser, setCurrentUser, userRoles } = useUser();
  const initials = currentUser.name.split(" ").map(n => n[0]).join("");

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
          <Users className="h-4 w-4" />
          Switch User (Simulation)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {users.filter(u => u.isActive).map(user => {
          const userRoleNames = roles
            .filter(r => user.roleIds.includes(r.id))
            .map(r => r.name);
          const isSelected = user.id === currentUser.id;
          
          return (
            <DropdownMenuItem 
              key={user.id}
              onClick={() => setCurrentUser(user)}
              className="flex items-start gap-3 py-2 cursor-pointer"
            >
              <Avatar className="h-8 w-8 bg-muted">
                <AvatarFallback className="text-xs">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{user.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {userRoleNames.map(roleName => (
                    <Badge key={roleName} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {roleName}
                    </Badge>
                  ))}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <div className="px-2 py-2 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Current Session</p>
          <p>Email: {currentUser.email}</p>
          <p>Roles: {userRoles.map(r => r.name).join(", ")}</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
