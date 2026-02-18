import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  Clock,
  BarChart3,
  CalendarDays,
  Heart,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Circle,
  Users,
  LifeBuoy,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Key,
  ArrowRight,
  Sparkles,
  Activity,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Product card data ───────────────────────────────────────────────────────

interface Product {
  name: string;
  description: string;
  route: string;
  Icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  accentIcon: React.ElementType;
}

const products: Product[] = [
  {
    name: "Care Minutes",
    description:
      "Track and report mandatory care minute requirements for residential aged care facilities across all staff categories.",
    route: "/care-minutes/overview",
    Icon: Clock,
    gradientFrom: "from-lavender",
    gradientTo: "to-mauve",
    iconBg: "bg-primary/10",
    accentIcon: Activity,
  },
  {
    name: "NQIP",
    description:
      "Submit and manage National Quality Indicator Programme data for quality benchmarking and continuous improvement.",
    route: "/nqip/kpi",
    Icon: BarChart3,
    gradientFrom: "from-[hsl(215,98%,87%)]",
    gradientTo: "to-[hsl(245,90%,82%)]",
    iconBg: "bg-info/20",
    accentIcon: TrendingUp,
  },
  {
    name: "Annual Leave",
    description:
      "Manage staff annual leave requests, approvals, and calendars with real-time visibility across your organisation.",
    route: "/annual-leave/overview",
    Icon: CalendarDays,
    gradientFrom: "from-[hsl(142,60%,85%)]",
    gradientTo: "to-[hsl(160,70%,78%)]",
    iconBg: "bg-success/10",
    accentIcon: Sparkles,
  },
  {
    name: "RN 24/7",
    description:
      "Monitor and report Registered Nurse 24/7 presence compliance to meet mandatory aged care requirements.",
    route: "/rn247/overview",
    Icon: Heart,
    gradientFrom: "from-thistle",
    gradientTo: "to-[hsl(215,98%,82%)]",
    iconBg: "bg-accent/30",
    accentIcon: ShieldCheck,
  },
];

// ─── Action items ─────────────────────────────────────────────────────────────

const actionItems = [
  {
    label: "Care Minutes submission for Q1 is due",
    urgency: "5 days",
    urgencyVariant: "destructive" as const,
    cta: "Submit Now",
    route: "/care-minutes/submission",
  },
  {
    label: "Your PRODA device will expire",
    urgency: "12 days",
    urgencyVariant: "secondary" as const,
    cta: "Renew Device",
    route: "/settings/api-variables",
  },
];

// ─── Setup checklist ─────────────────────────────────────────────────────────

const setupItems = [
  { label: "PRODA Setup", done: true },
  { label: "B2G Credentials", done: false },
];

const setupProgress = Math.round(
  (setupItems.filter((i) => i.done).length / setupItems.length) * 100
);

// ─── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { Icon, accentIcon: AccentIcon } = product;

  return (
    <Card className="overflow-hidden border-border/60 hover:shadow-elegant hover:border-primary/20 transition-all duration-300 group cursor-pointer flex flex-col">
      {/* Illustration area */}
      <div
        className={cn(
          "relative h-36 bg-gradient-to-br flex items-center justify-center overflow-hidden",
          product.gradientFrom,
          product.gradientTo
        )}
      >
        {/* Background decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/10" />
        {/* Main icon */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <AccentIcon className="w-3.5 h-3.5 text-primary/80" />
            <span className="text-xs font-medium text-primary/80">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="mt-auto">
          <Button
            size="sm"
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200"
            onClick={() => navigate(product.route)}
          >
            Go to {product.name} Dashboard
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

const Home = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        {/* ── LEFT / MAIN COLUMN ── */}
        <div className="space-y-6 min-w-0">

          {/* Welcome header */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening across your organisation today.
            </p>
          </div>

          {/* System alert banner */}
          <Card className="border-warning/40 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Scheduled Maintenance
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    The system will be undergoing scheduled maintenance on{" "}
                    <strong>Saturday, 22 Feb 2026 from 11:00 PM – 1:00 AM AEST</strong>.
                    Please complete any submissions before this window.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action items */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Action Items
              </h2>
            </div>
            {actionItems.map((item) => (
              <Card
                key={item.label}
                className="border-border/60 hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-warning shrink-0" />
                      <p className="text-sm text-foreground">
                        {item.label}{" "}
                        <Badge variant={item.urgencyVariant} className="ml-1 text-xs">
                          in {item.urgency}
                        </Badge>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 text-xs h-8"
                      onClick={() => navigate(item.route)}
                    >
                      {item.cta}
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Your Products */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Your Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR PANEL ── */}
        <div className="space-y-4">

          {/* Complete your setup */}
          <Card className="border-border/60">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Complete your setup</CardTitle>
              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{setupItems.filter((i) => i.done).length} of {setupItems.length} complete</span>
                  <span>{setupProgress}%</span>
                </div>
                <Progress value={setupProgress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 space-y-2">
              {setupItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      item.done
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  {!item.done && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-7 text-xs px-2 text-primary"
                      onClick={() => navigate("/settings/api-variables")}
                    >
                      Set up
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Invite team members */}
          <Card className="border-border/60 bg-gradient-to-br from-secondary/40 to-accent/10">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Invite team members
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Collaborate with your team by inviting them to Loop.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 h-8 text-xs"
                    onClick={() => navigate("/settings/users")}
                  >
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Manage Users
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-semibold">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 space-y-1">
              {[
                {
                  label: "Submit a support ticket",
                  icon: LifeBuoy,
                  route: "/help",
                },
                {
                  label: "View documentation",
                  icon: BookOpen,
                  route: "/help",
                },
                {
                  label: "Share feedback",
                  icon: MessageSquare,
                  route: "/help",
                },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.route)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/60 transition-colors group"
                >
                  <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Home;
