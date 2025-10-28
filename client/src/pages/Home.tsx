import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ProductShowcase from "@/components/ProductShowcase";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import teeImage from "@assets/generated_images/White_oversized_tee_flat_lay_bc01806a.png";
import hoodieImage from "@assets/generated_images/Navy_hoodie_hanging_shot_04240cfe.png";
import crewneckImage from "@assets/generated_images/Black_crewneck_on_concrete_f71dd725.png";
import capImage from "@assets/generated_images/Gray_baseball_cap_studio_shot_7cfa9cf5.png";
import toteImage from "@assets/generated_images/Beige_tote_bag_flat_lay_92c6a31f.png";

export default function Home() {
  const [activeFilters, setActiveFilters] = useState<Array<{ id: string; label: string; category: string }>>([]);

  // Force scroll to top on mount to prevent initial downward scroll
  useEffect(() => {
    // Save the previous scroll restoration setting
    const previousScrollRestoration = window.history.scrollRestoration;
    
    // Disable browser's scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    
    // Additional requestAnimationFrame to ensure it happens after any browser restoration
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    
    return () => {
      cancelAnimationFrame(rafId);
      // Restore previous scroll restoration setting on unmount
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  const showcaseProducts = [
    {
      name: "Premium T-Shirt",
      price: "59.00",
      image: teeImage,
      type: "tshirt" as const,
      modelColor: "#F5F5DC",
      marqueeText: "CUSTOM SCREEN PRINTING // PREMIUM COTTON",
    },
    {
      name: "Heavyweight Hoodie",
      price: "89.00",
      image: hoodieImage,
      type: "hoodie" as const,
      modelColor: "#1E3A5F",
      marqueeText: "3D EMBROIDERY // FLEECE BLEND",
    },
    {
      name: "Baseball Cap",
      price: "28.00",
      image: capImage,
      type: "cap" as const,
      modelColor: "#90C9A8",
      marqueeText: "PREMIUM HEADWEAR // CUSTOM EMBROIDERY",
    },
    {
      name: "Canvas Tote",
      price: "49.00",
      image: toteImage,
      type: "tote" as const,
      modelColor: "#F5F5DC",
      marqueeText: "HEAVY CANVAS // SUSTAINABLE MATERIALS",
    },
  ];

  const featuredProducts = [
    {
      image: teeImage,
      name: "Premium T-Shirt",
      specs: "100% cotton, screen print ready",
      turnaround: "5-7 days",
      minQuantity: 50,
    },
    {
      image: hoodieImage,
      name: "Heavyweight Hoodie",
      specs: "Fleece blend, embroidery ready",
      turnaround: "7-10 days",
      minQuantity: 50,
    },
    {
      image: crewneckImage,
      name: "Classic Crewneck",
      specs: "Premium cotton blend, DTG ready",
      turnaround: "5-7 days",
      minQuantity: 50,
    },
  ];

  const allProducts = [
    {
      image: teeImage,
      name: "Premium T-Shirt",
      specs: "100% cotton, screen print ready",
      turnaround: "5-7 days",
      minQuantity: 50,
    },
    {
      image: hoodieImage,
      name: "Heavyweight Hoodie",
      specs: "Fleece blend, embroidery ready",
      turnaround: "7-10 days",
      minQuantity: 50,
    },
    {
      image: crewneckImage,
      name: "Classic Crewneck",
      specs: "Premium cotton blend, DTG ready",
      turnaround: "5-7 days",
      minQuantity: 50,
    },
    {
      image: capImage,
      name: "Baseball Cap",
      specs: "6-panel, embroidery ready",
      turnaround: "7-10 days",
      minQuantity: 50,
    },
    {
      image: toteImage,
      name: "Canvas Tote",
      specs: "Heavy canvas, screen print ready",
      turnaround: "5-7 days",
      minQuantity: 50,
    },
    {
      image: teeImage,
      name: "Long Sleeve Tee",
      specs: "100% cotton, DTG ready",
      turnaround: "5-7 days",
      minQuantity: 50,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <HorizontalScrollSection>
        {showcaseProducts.map((product, index) => (
          <ProductShowcase
            key={index}
            {...product}
          />
        ))}
      </HorizontalScrollSection>
      
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Featured Products
              </h2>
              <p className="text-lg font-body text-muted-foreground">
                Our most popular items for custom printing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={index}
                {...product}
                onAddToRequest={() => console.log('Added:', product.name)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Full Catalog</h2>
            <p className="text-lg font-body text-muted-foreground">
              Browse our complete selection of custom merchandise
            </p>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Select onValueChange={(value) => console.log('Product type:', value)}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-product-type">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tee">T-Shirts</SelectItem>
                <SelectItem value="hoodie">Hoodies</SelectItem>
                <SelectItem value="hat">Hats</SelectItem>
                <SelectItem value="tote">Totes</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => console.log('Print method:', value)}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-print-method">
                <SelectValue placeholder="Print Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="screen">Screen Print</SelectItem>
                <SelectItem value="dtg">DTG</SelectItem>
                <SelectItem value="embroidery">Embroidery</SelectItem>
                <SelectItem value="dtf">DTF</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => console.log('Turnaround:', value)}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-turnaround">
                <SelectValue placeholder="Turnaround" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">5-7 days</SelectItem>
                <SelectItem value="extended">7-10 days</SelectItem>
                <SelectItem value="rush">2-3 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FilterBar 
            activeFilters={activeFilters}
            onRemoveFilter={(id) => setActiveFilters(activeFilters.filter(f => f.id !== id))}
            onClearAll={() => setActiveFilters([])}
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product, index) => (
              <ProductCard 
                key={index}
                {...product}
                onAddToRequest={() => console.log('Added:', product.name)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your artwork, select your products, and we'll handle the rest. 
            Minimum order of 50 pieces.
          </p>
          <Link href="/request" data-testid="button-cta-request">
            <Button size="lg">
              Start Your Request
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
