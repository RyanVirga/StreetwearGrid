import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Mail, Upload } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Request Received!</h1>
          <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
            Thanks for submitting your custom merch request. We're reviewing your details and will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Check Your Email</h3>
                <p className="text-sm font-body text-muted-foreground">
                  You'll receive a confirmation email within 15 minutes with your request details.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-md bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Need to Add Files?</h3>
                <p className="text-sm font-body text-muted-foreground mb-3">
                  Forgot to upload something? You can add more files anytime.
                </p>
                <Link href="/request" data-testid="link-upload-more">
                  <Button variant="outline" size="sm" data-testid="button-upload-more">
                    Upload More Files
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-muted/30 border-border">
          <h3 className="font-semibold mb-3">What Happens Next?</h3>
          <div className="space-y-3 font-body text-sm">
            <div className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                1
              </span>
              <p className="text-muted-foreground pt-0.5">
                Our team reviews your request and artwork within 24 hours
              </p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                2
              </span>
              <p className="text-muted-foreground pt-0.5">
                We'll send you a detailed quote via email with pricing and timeline
              </p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                3
              </span>
              <p className="text-muted-foreground pt-0.5">
                Once approved, we'll start production and keep you updated
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center mt-12">
          <p className="font-body text-muted-foreground mb-4">
            Questions about your order?
          </p>
          <Link href="/" data-testid="link-back-home">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
