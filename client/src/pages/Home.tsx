import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ProductShowcase from "@/components/ProductShowcase";
import CTAShowcase from "@/components/CTAShowcase";

import teeImage from "@assets/generated_images/White_oversized_tee_flat_lay_bc01806a.png";
import hoodieImage from "@assets/generated_images/Navy_hoodie_hanging_shot_04240cfe.png";
import capImage from "@assets/generated_images/Gray_baseball_cap_studio_shot_7cfa9cf5.png";
import toteImage from "@assets/generated_images/Beige_tote_bag_flat_lay_92c6a31f.png";

export default function Home() {
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
        <CTAShowcase />
      </HorizontalScrollSection>
    </div>
  );
}
