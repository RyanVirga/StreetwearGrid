import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import WizardProgress from "@/components/WizardProgress";
import FileUploadZone from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

export default function RequestWizard() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [quantity, setQuantity] = useState(50);
  const [budget, setBudget] = useState("");

  const steps = [
    { number: 1, title: 'Basics', completed: currentStep > 1, current: currentStep === 1 },
    { number: 2, title: 'Customization', completed: currentStep > 2, current: currentStep === 2 },
    { number: 3, title: 'Uploads', completed: currentStep > 3, current: currentStep === 3 },
    { number: 4, title: 'Review', completed: false, current: currentStep === 4 },
  ];

  const products = [
    { id: 'tee', label: 'T-Shirt' },
    { id: 'hoodie', label: 'Hoodie' },
    { id: 'crewneck', label: 'Crewneck' },
    { id: 'hat', label: 'Hat' },
    { id: 'tote', label: 'Tote' },
  ];

  const printMethods = [
    { id: 'screen', label: 'Screen Print' },
    { id: 'dtg', label: 'DTG' },
    { id: 'embroidery', label: 'Embroidery' },
    { id: 'dtf', label: 'DTF' },
  ];

  const isRushOrder = dueDate && differenceInDays(dueDate, new Date()) < 3;
  const isBelowMOQ = quantity < 50;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      console.log('Next step:', currentStep + 1);
    } else {
      console.log('Submit request');
      setLocation('/thank-you');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      console.log('Previous step:', currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WizardProgress steps={steps} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Let's start with the basics</h2>
                <p className="font-body text-muted-foreground">
                  Tell us what you need and when you need it
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">Select Products *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className={`p-4 cursor-pointer transition-all hover-elevate ${
                          selectedProducts.includes(product.id) ? 'border-primary' : ''
                        }`}
                        onClick={() => {
                          if (selectedProducts.includes(product.id)) {
                            setSelectedProducts(selectedProducts.filter(p => p !== product.id));
                          } else {
                            setSelectedProducts([...selectedProducts, product.id]);
                          }
                          console.log('Selected products:', product.id);
                        }}
                        data-testid={`card-product-${product.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => {}}
                          />
                          <span className="font-medium">{product.label}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-base">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="mt-2"
                    data-testid="input-quantity"
                  />
                  {isBelowMOQ && (
                    <div className="flex items-start gap-2 mt-2 p-3 bg-primary/10 rounded-md border border-primary/20">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-sm font-body">
                        <p className="font-medium text-primary mb-1">Below minimum order quantity</p>
                        <p className="text-muted-foreground">
                          Our standard MOQ is 50 pieces. Consider our sample pack for smaller orders.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base">Due Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-2"
                        data-testid="button-date-picker"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {isRushOrder && (
                    <div className="flex items-start gap-2 mt-2 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="text-sm font-body">
                        <p className="font-medium text-destructive mb-1">Rush order required</p>
                        <p className="text-muted-foreground">
                          Orders due in less than 3 days require rush fees. We'll include this in your quote.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="zip" className="text-base">ZIP Code *</Label>
                  <Input
                    id="zip"
                    type="text"
                    placeholder="94110"
                    className="mt-2"
                    data-testid="input-zip"
                  />
                </div>

                <div>
                  <Label className="text-base">Budget Range *</Label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger className="mt-2" data-testid="select-budget">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-500">Under $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="over-10000">Over $10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Customization details</h2>
                <p className="font-body text-muted-foreground">
                  How should we prepare your order?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">Print Methods *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {printMethods.map((method) => (
                      <Card
                        key={method.id}
                        className="p-4 cursor-pointer transition-all hover-elevate"
                        onClick={() => console.log('Method:', method.id)}
                        data-testid={`card-method-${method.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox />
                          <span className="font-medium">{method.label}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Print Locations</Label>
                  <div className="flex flex-wrap gap-3">
                    {['Front', 'Back', 'Left Chest', 'Sleeve'].map((location) => (
                      <Badge
                        key={location}
                        variant="outline"
                        className="px-4 py-2 cursor-pointer hover-elevate"
                        onClick={() => console.log('Location:', location)}
                        data-testid={`badge-location-${location.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-base">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Streetwear vibe, big type, minimal graphic..."
                    className="mt-2 min-h-32"
                    data-testid="textarea-notes"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Upload your artwork</h2>
                <p className="font-body text-muted-foreground">
                  Share your logos, designs, and moodboards
                </p>
              </div>

              <FileUploadZone />

              <div>
                <Label htmlFor="links" className="text-base">
                  Optional Links
                </Label>
                <Input
                  id="links"
                  type="url"
                  placeholder="Pinterest, Google Drive, Dropbox..."
                  className="mt-2"
                  data-testid="input-links"
                />
                <p className="text-sm font-body text-muted-foreground mt-2">
                  Share inspiration boards or additional files
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Almost there!</h2>
                <p className="font-body text-muted-foreground">
                  Just need your contact information
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-base">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      className="mt-2"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-base">Company *</Label>
                    <Input
                      id="company"
                      type="text"
                      className="mt-2"
                      data-testid="input-company"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-base">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-2"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="mt-2"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <Card className="p-6 bg-muted/50">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2 font-body text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Products:</span>
                      <span>{selectedProducts.length || 0} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span>{quantity} pieces</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{dueDate ? format(dueDate, 'PPP') : 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span>{budget ? budget.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Not set'}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              data-testid="button-previous"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              data-testid="button-next"
            >
              {currentStep === 4 ? 'Send My Request' : 'Next Step'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
