import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight" data-testid="link-home">
            MERCH
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-catalog">
              Catalog
            </Link>
            <Link href="/gallery" className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-gallery">
              Gallery
            </Link>
            <Link href="/request" data-testid="link-request">
              <Button>Start a Request</Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
