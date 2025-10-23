import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import FilterBar from "@/components/FilterBar";
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

  const products = [
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Product Catalog</h1>
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
          {products.map((product, index) => (
            <ProductCard 
              key={index}
              {...product}
              onAddToRequest={() => console.log('Added:', product.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
