import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { UserSwitcher } from "./UserSwitcher";
import { useSubmissionsStore } from "@/contexts/SubmissionsStoreContext";
import { getBreadcrumbs } from "@/lib/nav-config";

export function AppHeader() {
  const location = useLocation();
  const { getCreatedById } = useSubmissionsStore();

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbs(location.pathname, { getCreatedById });
  }, [location.pathname, getCreatedById]);

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      <nav className="flex items-center gap-1 min-w-0" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <div key={index} className="flex items-center gap-1 min-w-0">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span
                className={
                  isLast
                    ? "text-base font-semibold text-foreground truncate"
                    : "text-sm text-muted-foreground truncate"
                }
              >
                {crumb.label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <UserSwitcher />
      </div>
    </header>
  );
}
