import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ProductCardProps {
  image: string;
  name: string;
  specs: string;
  turnaround: string;
  minQuantity: number;
  onAddToRequest?: () => void;
}

export default function ProductCard({ 
  image, 
  name, 
  specs, 
  turnaround, 
  minQuantity,
  onAddToRequest 
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200 group" data-testid={`card-product-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-sm font-body text-muted-foreground">{specs}</p>
        </div>

        <div className="flex items-center gap-4 text-sm font-body">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{turnaround}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            MOQ {minQuantity}
          </Badge>
        </div>

        <Button 
          className="w-full" 
          variant="outline"
          onClick={onAddToRequest}
          data-testid={`button-add-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          Add to Request
        </Button>
      </div>
    </Card>
  );
}
