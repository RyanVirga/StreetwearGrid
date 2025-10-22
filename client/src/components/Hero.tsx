import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, CheckCircle } from "lucide-react";
import heroImage from "@assets/generated_images/Streetwear_collection_hero_shot_3db7c410.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Custom streetwear collection" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Custom streetwear, on your timeline.
          </h1>
          
          <p className="text-lg sm:text-xl font-body text-muted-foreground mb-8 leading-relaxed">
            Tell us what you need, drop your art, and we'll craft a clean, on-brand look.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/request">
              <a data-testid="button-start-request">
                <Button size="lg" className="w-full sm:w-auto">
                  Start a Request
                </Button>
              </a>
            </Link>
            <Link href="/gallery">
              <a data-testid="button-see-work">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-background/40 backdrop-blur-sm"
                >
                  See Past Work
                </Button>
              </a>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-card-border">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-body font-medium">3-5 Day Standard</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-card-border">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-body font-medium">Rush Available</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card/50 backdrop-blur-sm border border-card-border">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-body font-medium">500+ Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
