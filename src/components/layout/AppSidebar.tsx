import { 
  BarChart3, 
  FileText, 
  Database, 
  Users, 
  History, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import loopLogo from "@/assets/loop-logo.png";

const navItems = [
  { title: "Submissions", url: "/", icon: FileText },
  { title: "KPI Dashboard", url: "/kpi", icon: BarChart3 },
  { title: "CIS Data Pipeline", url: "/pipeline", icon: Database },
  { title: "Users & Roles", url: "/users", icon: Users },
  { title: "Audit Log", url: "/audit", icon: History },
  { title: "Conformance", url: "/conformance", icon: Shield },
  { title: "Help & Resources", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      className="border-r-0 bg-sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src={loopLogo} 
            alt="Loop" 
            className="h-8 w-auto"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xs text-sidebar-foreground/60 uppercase tracking-wider">
                NQIP Submissions
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="h-11">
                <RouterNavLink
                  to={item.url}
                  end={item.url === "/"}
                  className={({ isActive }) =>
                    cn(
                      "sidebar-nav-item w-full",
                      isActive && "sidebar-nav-item-active"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </RouterNavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarTrigger className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}
