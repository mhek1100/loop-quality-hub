import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FacilityLinkProps {
  facilityId: string;
  facilityName: string;
  className?: string;
}

export function FacilityLink({ facilityId, facilityName, className }: FacilityLinkProps) {
  return (
    <Link 
      to={`/care-minutes/facilities?id=${facilityId}`}
      className={cn(
        "font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors",
        className
      )}
    >
      {facilityName}
    </Link>
  );
}

// Hook for navigating to facility drill-down
export function useFacilityNavigation() {
  const navigate = useNavigate();
  
  const navigateToFacility = (facilityId: string) => {
    navigate(`/care-minutes/facilities?id=${facilityId}`);
  };
  
  return { navigateToFacility };
}
