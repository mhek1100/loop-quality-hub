import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Settings, Database, Users, Shield, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  { title: "API Variables", url: "/settings/api-variables", icon: Building2 },
  { title: "CIS Data Pipeline", url: "/settings/pipeline", icon: Database },
  { title: "Users & Roles", url: "/settings/users", icon: Users },
  { title: "Conformance", url: "/settings/conformance", icon: Shield },
];

export default function SettingsLayout() {
  const location = useLocation();
  
  // Redirect to first sub-page if on /settings directly
  const isSettingsRoot = location.pathname === "/settings";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage system configuration and preferences</p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {settingsNav.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </div>

      {/* Sub-page content */}
      <div>
        {isSettingsRoot ? (
          <div className="text-center py-12 text-muted-foreground">
            Select a settings category above
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
