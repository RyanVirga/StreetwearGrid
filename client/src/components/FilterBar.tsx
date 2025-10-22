import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Filter {
  id: string;
  label: string;
  category: string;
}

interface FilterBarProps {
  activeFilters: Filter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export default function FilterBar({ activeFilters, onRemoveFilter, onClearAll }: FilterBarProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-md border border-border">
      <span className="text-sm font-body font-medium text-muted-foreground">Filters:</span>
      {activeFilters.map((filter) => (
        <Badge 
          key={filter.id} 
          variant="secondary" 
          className="gap-1.5 hover-elevate cursor-pointer"
          onClick={() => onRemoveFilter(filter.id)}
          data-testid={`badge-filter-${filter.id}`}
        >
          {filter.label}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm font-body text-primary hover:underline ml-2"
        data-testid="button-clear-filters"
      >
        Clear all
      </button>
    </div>
  );
}
