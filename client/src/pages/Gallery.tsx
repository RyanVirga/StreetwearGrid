import { useState } from "react";
import Navigation from "@/components/Navigation";
import GalleryItem from "@/components/GalleryItem";
import FilterBar from "@/components/FilterBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

import teeImage from "@assets/generated_images/White_oversized_tee_flat_lay_bc01806a.png";
import hoodieImage from "@assets/generated_images/Navy_hoodie_hanging_shot_04240cfe.png";
import crewneckImage from "@assets/generated_images/Black_crewneck_on_concrete_f71dd725.png";
import capImage from "@assets/generated_images/Gray_baseball_cap_studio_shot_7cfa9cf5.png";
import toteImage from "@assets/generated_images/Beige_tote_bag_flat_lay_92c6a31f.png";

interface CaseStudy {
  image: string;
  title: string;
  method: string;
  productType: string;
  description: string;
  turnaround: string;
}

export default function Gallery() {
  const [activeFilters, setActiveFilters] = useState<Array<{ id: string; label: string; category: string }>>([]);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  const caseStudies: CaseStudy[] = [
    {
      image: hoodieImage,
      title: "Minimalist Hoodie Collection",
      method: "Screen Print",
      productType: "Hoodie",
      description: "Clean typography and bold graphics for a streetwear brand launch. 200 pieces delivered in 7 days.",
      turnaround: "7 days",
    },
    {
      image: teeImage,
      title: "Festival Merch Bundle",
      method: "DTG",
      productType: "T-Shirt",
      description: "Vibrant full-color designs for music festival. Fast turnaround with premium quality.",
      turnaround: "5 days",
    },
    {
      image: crewneckImage,
      title: "Corporate Rebrand",
      method: "Embroidery",
      productType: "Crewneck",
      description: "Sophisticated branding for tech company. Premium embroidery on heavyweight blanks.",
      turnaround: "10 days",
    },
    {
      image: capImage,
      title: "Sports Team Caps",
      method: "Embroidery",
      productType: "Hat",
      description: "Custom embroidered team logos. Durable construction for active use.",
      turnaround: "8 days",
    },
    {
      image: toteImage,
      title: "Eco-Friendly Totes",
      method: "Screen Print",
      productType: "Tote",
      description: "Sustainable merchandise for retail brand. Water-based inks on organic cotton.",
      turnaround: "6 days",
    },
    {
      image: hoodieImage,
      title: "Limited Edition Drop",
      method: "Puffy Print",
      productType: "Hoodie",
      description: "Premium textured prints for exclusive streetwear collection.",
      turnaround: "9 days",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Past Work</h1>
          <p className="text-lg font-body text-muted-foreground">
            Browse our portfolio of custom merchandise projects
          </p>
        </div>

        <FilterBar 
          activeFilters={activeFilters}
          onRemoveFilter={(id) => setActiveFilters(activeFilters.filter(f => f.id !== id))}
          onClearAll={() => setActiveFilters([])}
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((item, index) => (
            <GalleryItem 
              key={index}
              {...item}
              onClick={() => setSelectedCase(item)}
            />
          ))}
        </div>
      </div>

      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCase.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <img 
                    src={selectedCase.image} 
                    alt={selectedCase.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedCase.method}</Badge>
                    <Badge variant="outline">{selectedCase.productType}</Badge>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{selectedCase.turnaround}</span>
                    </div>
                  </div>

                  <p className="font-body text-muted-foreground leading-relaxed">
                    {selectedCase.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
