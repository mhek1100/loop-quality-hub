import { cn } from "@/lib/utils";
import { IndicatorCategory } from "@/lib/types";

interface IndicatorChipProps {
  category: IndicatorCategory;
}

export function IndicatorChip({ category }: IndicatorChipProps) {
  const getCategoryStyles = () => {
    switch (category) {
      case "Clinical":
        return "indicator-clinical";
      case "Experience":
        return "indicator-experience";
      case "Workforce":
        return "indicator-workforce";
      default:
        return "indicator-clinical";
    }
  };

  return (
    <span className={cn("indicator-chip", getCategoryStyles())}>
      {category}
    </span>
  );
}
