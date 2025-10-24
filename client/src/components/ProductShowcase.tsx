import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Product3DModel from "@/components/Product3DModel";
import DiagonalStripedBackground from "@/components/DiagonalStripedBackground";
import ScrollingMarquee from "@/components/ScrollingMarquee";

interface ProductShowcaseProps {
  name: string;
  price: string;
  image: string;
  type?: "tshirt" | "hoodie" | "cap" | "tote" | "crewneck" | "longsleeve";
  modelColor?: string;
  marqueeText?: string;
}

export default function ProductShowcase({
  name,
  price,
  image,
  type = "tshirt",
  modelColor = "#2F6BFF",
  marqueeText = "PREMIUM CUSTOM MERCH",
}: ProductShowcaseProps) {
  return (
    <div className="w-screen h-screen flex-shrink-0 cursor-crosshair">
      <div className="relative w-full h-full flex items-center justify-center">
      <ScrollingMarquee text={marqueeText} />
      
      <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left: 3D Model with Diagonal Stripes Background */}
        <div className="relative flex items-center justify-center bg-background overflow-hidden">
          <DiagonalStripedBackground />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8 lg:p-16">
            <div className="w-full h-full max-w-md">
              <Product3DModel type={type} color={modelColor} />
            </div>
          </div>
          
          {/* Product Info Overlay */}
          <div className="absolute left-6 lg:left-12 bottom-12 lg:bottom-16 z-20 max-w-xs">
            <h2 className="text-lg font-normal mb-1 text-foreground tracking-wide">{name}</h2>
            <p className="text-base text-foreground mb-4">${price}</p>
            <Button 
              variant="secondary" 
              size="default" 
              className="bg-white text-black font-medium uppercase text-xs tracking-wider px-6"
              data-testid={`button-quick-view-${name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              QUICK VIEW
            </Button>
          </div>
        </div>

        {/* Right: Lifestyle Photo */}
        <div className="relative flex items-center justify-center bg-muted/20">
          <div className="relative w-full h-full">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
            
            {/* Small Product Card Bottom Right */}
            <div className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-md p-3 rounded-md border border-border shadow-lg max-w-[180px]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 bg-muted">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] font-medium truncate leading-tight">{name}</h3>
                  <p className="text-[10px] text-muted-foreground">USD ${price}</p>
                </div>
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="flex-shrink-0 opacity-70"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Crosshair */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="opacity-20"
        >
          <circle cx="16" cy="16" r="2" fill="currentColor" className="text-foreground" />
          <line
            x1="16"
            y1="0"
            x2="16"
            y2="12"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,3"
            className="text-foreground"
          />
          <line
            x1="16"
            y1="20"
            x2="16"
            y2="32"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,3"
            className="text-foreground"
          />
          <line
            x1="0"
            y1="16"
            x2="12"
            y2="16"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,3"
            className="text-foreground"
          />
          <line
            x1="20"
            y1="16"
            x2="32"
            y2="16"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,3"
            className="text-foreground"
          />
        </svg>
      </div>
      </div>
    </div>
  );
}
