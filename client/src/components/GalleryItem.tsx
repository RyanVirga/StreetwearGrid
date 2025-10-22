import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GalleryItemProps {
  image: string;
  title: string;
  method: string;
  productType: string;
  onClick?: () => void;
}

export default function GalleryItem({ image, title, method, productType, onClick }: GalleryItemProps) {
  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer transition-all duration-200 group" 
      onClick={onClick}
      data-testid={`card-gallery-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">{method}</Badge>
          <Badge variant="outline" className="text-xs">{productType}</Badge>
        </div>
      </div>
    </Card>
  );
}
