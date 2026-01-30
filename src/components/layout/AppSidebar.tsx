import { useState } from "react";
import { 
  Home, 
  ShoppingBag, 
  Compass, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  Heart,
  Calendar
} from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import loopLogo from "@/assets/loop-logo-full.svg";

// Primary navigation items
const primaryNavItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingBag },
  { title: "Workspace", url: "/workspace", icon: Compass },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

// Product groups with children
const productGroups = [
  {
    title: "Care minutes",
    icon: Clock,
    children: [
      { title: "Overview", url: "/care-minutes/overview" },
      { title: "Facilities", url: "/care-minutes/facilities" },
      { title: "Submission", url: "/care-minutes/submission" },
      { title: "Past reports", url: "/care-minutes/past-reports" },
    ],
  },
  {
    title: "NQIP",
    icon: BarChart3,
    children: [
      { title: "KPI Dashboard", url: "/nqip/kpi" },
      { title: "Submissions", url: "/nqip/submissions" },
      { title: "NQIP Settings", url: "/nqip/settings" },
      { title: "NQIP Help", url: "/nqip/help" },
    ],
  },
  {
    title: "RN24/7",
    icon: Heart,
    children: [
      { title: "Overview", url: "/rn247/overview" },
      { title: "Reports", url: "/rn247/reports" },
    ],
  },
  {
    title: "Annual leave",
    icon: Calendar,
    children: [
      { title: "Overview", url: "/annual-leave/overview" },
      { title: "Requests", url: "/annual-leave/requests" },
      { title: "Calendar", url: "/annual-leave/calendar" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  
  // All product groups expanded by default
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Care minutes": false,
    "NQIP": false,
    "RN24/7": false,
    "Annual leave": false,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (url: string) => {
    if (url === "/settings") {
      return location.pathname.startsWith("/settings");
    }
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  const isGroupActive = (group: typeof productGroups[0]) => {
    return group.children.some(child => isActive(child.url));
  };

  return (
    <Sidebar 
      className="border-r border-border/40 bg-background"
      collapsible="icon"
    >
      {/* Logo Header */}
      <SidebarHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={loopLogo} 
              alt="Loop" 
              className="h-6 w-auto"
            />
          </div>
          {!isCollapsed && (
            <SidebarTrigger className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </SidebarTrigger>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-2 overflow-y-auto">
        {/* Primary Navigation */}
        <SidebarMenu className="space-y-0.5">
          {primaryNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="h-10">
                <RouterNavLink
                  to={item.url === "/settings" ? "/settings/account" : item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive(item.url)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </RouterNavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Products Section Divider */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 pt-6 pb-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Products
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Product Groups */}
        <div className="space-y-0.5 mt-1">
          {productGroups.map((group) => (
            <Collapsible
              key={group.title}
              open={!isCollapsed && expandedGroups[group.title]}
              onOpenChange={() => !isCollapsed && toggleGroup(group.title)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isGroupActive(group)
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <group.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{group.title}</span>
                      {expandedGroups[group.title] ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="ml-8 space-y-0.5 py-0.5">
                  {group.children.map((child) => (
                    <RouterNavLink
                      key={child.url}
                      to={child.url}
                      className={cn(
                        "block px-3 py-1.5 rounded-lg text-sm transition-all duration-150",
                        isActive(child.url)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {child.title}
                    </RouterNavLink>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </SidebarContent>
      
      {/* User Footer */}
      <SidebarFooter className="p-3 border-t border-border/40">
        {isCollapsed ? (
          <SidebarTrigger className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </SidebarTrigger>
        ) : (
          <div className="flex items-center gap-3 px-2 py-1">
            <Avatar className="h-8 w-8 bg-muted">
              <AvatarFallback className="text-xs font-medium text-muted-foreground bg-muted">
                L
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Lyster Espina</p>
              <p className="text-xs text-muted-foreground truncate">Dummy Provider</p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
