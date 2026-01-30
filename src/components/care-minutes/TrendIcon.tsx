import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrendDirection } from "@/lib/care-minutes/types";

interface TrendIconProps {
  direction: TrendDirection;
  className?: string;
}

export function TrendIcon({ direction, className }: TrendIconProps) {
  if (direction === "up") {
    return <TrendingUp className={cn("h-4 w-4 text-emerald-600", className)} />;
  }
  if (direction === "down") {
    return <TrendingDown className={cn("h-4 w-4 text-red-600", className)} />;
  }
  return <Minus className={cn("h-4 w-4 text-amber-600", className)} />;
}
