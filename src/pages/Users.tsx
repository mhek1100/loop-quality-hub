import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { users, roles } from "@/lib/mock/data";

interface UsersProps {
  showHeader?: boolean;
}

const Users = ({ showHeader = true }: UsersProps) => (
  <div className="space-y-6 animate-fade-in">
    {showHeader && (
      <div><h1 className="text-2xl font-semibold">Users & Roles</h1><p className="text-muted-foreground">Manage user access and permissions</p></div>
    )}
    <Card>
      <CardHeader><CardTitle className="text-lg">Users</CardTitle></CardHeader>
      <CardContent>
        <table className="w-full">
          <thead><tr className="border-b"><th className="text-left py-2 text-sm text-muted-foreground">Name</th><th className="text-left py-2 text-sm text-muted-foreground">Email</th><th className="text-left py-2 text-sm text-muted-foreground">Roles</th><th className="text-left py-2 text-sm text-muted-foreground">Status</th></tr></thead>
          <tbody>
            {users.map(user => {
              const userRoles = roles.filter(r => user.roleIds.includes(r.id));
              return (
                <tr key={user.id} className="border-b border-border/50">
                  <td className="py-3 font-medium">{user.name}</td>
                  <td className="py-3 text-muted-foreground">{user.email}</td>
                  <td className="py-3"><div className="flex flex-wrap gap-1">{userRoles.map(r => <Badge key={r.id} variant="secondary" className="text-xs">{r.name}</Badge>)}</div></td>
                  <td className="py-3"><Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

export default Users;
