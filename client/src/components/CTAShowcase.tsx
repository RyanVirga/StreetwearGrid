import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface CTAShowcaseProps {
  scrollProgress?: any;
  productIndex?: number;
  totalProducts?: number;
}

export default function CTAShowcase({
  scrollProgress,
  productIndex = 0,
  totalProducts = 1,
}: CTAShowcaseProps) {
  return (
    <div className="w-screen h-[calc(100vh-4rem)] flex-shrink-0 flex items-center justify-center bg-background">
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
    </div>
  );
}

