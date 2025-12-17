import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuintileStarsProps {
  value: number;
  size?: "sm" | "md";
}

export const QuintileStars = ({ value, size = "sm" }: QuintileStarsProps) => {
  const dimensions = size === "md" ? "h-4 w-4" : "h-3 w-3";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(index => (
        <Star
          key={index}
          className={cn(
            dimensions,
            index <= value ? "text-amber-400 fill-amber-300" : "text-muted-foreground"
          )}
          fill="currentColor"
        />
      ))}
    </div>
  );
};

