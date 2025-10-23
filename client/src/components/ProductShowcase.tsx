import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Product3DModel from "@/components/Product3DModel";
import DiagonalStripedBackground from "@/components/DiagonalStripedBackground";

interface ProductShowcaseProps {
  name: string;
  price: string;
  image: string;
  type?: "tshirt" | "hoodie" | "cap" | "tote" | "crewneck" | "longsleeve";
  modelColor?: string;
}

export default function ProductShowcase({
  name,
  price,
  image,
  type = "tshirt",
  modelColor = "#2F6BFF",
}: ProductShowcaseProps) {
  return (
    <div className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center">
      <DiagonalStripedBackground />
      
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full max-w-7xl">
          <div className="flex items-center justify-center h-[50vh] lg:h-full">
            <div className="w-full h-full max-w-lg">
              <Product3DModel type={type} color={modelColor} />
            </div>
          </div>

          <div className="flex items-center justify-center h-[50vh] lg:h-full relative">
            <div className="relative w-full h-full max-w-xl">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover rounded-sm"
              />
              
              <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-sm border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{name}</h3>
                    <p className="text-xs text-muted-foreground">USD {price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="opacity-40"
          >
            <circle cx="12" cy="12" r="2" fill="currentColor" className="text-muted-foreground" />
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-muted-foreground"
            />
            <line
              x1="12"
              y1="16"
              x2="12"
              y2="24"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-muted-foreground"
            />
            <line
              x1="0"
              y1="12"
              x2="8"
              y2="12"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-muted-foreground"
            />
            <line
              x1="16"
              y1="12"
              x2="24"
              y2="12"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-muted-foreground"
            />
          </svg>
        </div>
      </div>

      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 max-w-xs">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">{name}</h2>
        <p className="text-lg text-muted-foreground mb-4">${price}</p>
        <Button variant="outline" size="default" data-testid={`button-quick-view-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          QUICK VIEW
        </Button>
      </div>
    </div>
  );
}
