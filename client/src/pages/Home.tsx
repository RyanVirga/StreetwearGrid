import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import teeImage from "@assets/generated_images/White_oversized_tee_flat_lay_bc01806a.png";
import hoodieImage from "@assets/generated_images/Navy_hoodie_hanging_shot_04240cfe.png";
import crewneckImage from "@assets/generated_images/Black_crewneck_on_concrete_f71dd725.png";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
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
            <Link href="/catalog" data-testid="link-view-catalog">
              <Button variant="outline" className="hidden sm:flex gap-2">
                View Full Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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

          <div className="mt-8 sm:hidden">
            <Link href="/catalog" data-testid="link-view-catalog-mobile">
              <Button variant="outline" className="w-full gap-2">
                View Full Catalog
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
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
