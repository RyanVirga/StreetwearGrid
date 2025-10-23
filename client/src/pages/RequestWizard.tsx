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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, AlertCircle, Check, Plus, X } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

import screenPrintImage from "@assets/generated_images/Screen_print_example_closeup_9db12067.png";
import dtgImage from "@assets/generated_images/DTG_print_example_closeup_be25af20.png";
import embroideryImage from "@assets/generated_images/Embroidery_example_closeup_ee6959ef.png";
import dtfImage from "@assets/generated_images/DTF_print_example_closeup_d4ef97b9.png";

export default function RequestWizard() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [quantity, setQuantity] = useState(50);
  const [budget, setBudget] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColors, setCustomColors] = useState<Array<{ id: string; label: string; hex: string }>>([]);
  const [customColorDialogOpen, setCustomColorDialogOpen] = useState(false);
  const [customColorInput, setCustomColorInput] = useState("#000000");
  const [customColorLabel, setCustomColorLabel] = useState("");
  const [rgbR, setRgbR] = useState("0");
  const [rgbG, setRgbG] = useState("0");
  const [rgbB, setRgbB] = useState("0");

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
    { id: 'screen', label: 'Screen Print', image: screenPrintImage, description: 'Bold, durable prints' },
    { id: 'dtg', label: 'DTG', image: dtgImage, description: 'Full-color, detailed' },
    { id: 'embroidery', label: 'Embroidery', image: embroideryImage, description: 'Premium stitched logos' },
    { id: 'dtf', label: 'DTF', image: dtfImage, description: 'Vibrant transfers' },
  ];

  const colorways = [
    { id: 'black', label: 'Black', hex: '#000000' },
    { id: 'white', label: 'White', hex: '#FFFFFF' },
    { id: 'navy', label: 'Navy', hex: '#1E3A8A' },
    { id: 'gray', label: 'Gray', hex: '#6B7280' },
    { id: 'red', label: 'Red', hex: '#DC2626' },
    { id: 'green', label: 'Forest', hex: '#166534' },
    { id: 'brown', label: 'Sand', hex: '#92400E' },
    { id: 'blue', label: 'Sky', hex: '#0EA5E9' },
  ];

  const isRushOrder = dueDate && differenceInDays(dueDate, new Date()) < 3;
  const isBelowMOQ = quantity < 50;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const handleAddCustomColor = () => {
    if (!customColorLabel.trim()) {
      return;
    }
    
    const newColor = {
      id: `custom-${Date.now()}`,
      label: customColorLabel,
      hex: customColorInput
    };
    
    setCustomColors([...customColors, newColor]);
    setSelectedColors([...selectedColors, newColor.id]);
    setCustomColorLabel("");
    setCustomColorInput("#000000");
    setRgbR("0");
    setRgbG("0");
    setRgbB("0");
    setCustomColorDialogOpen(false);
  };

  const handleHexChange = (hex: string) => {
    setCustomColorInput(hex);
    const rgb = hexToRgb(hex);
    if (rgb) {
      setRgbR(rgb.r.toString());
      setRgbG(rgb.g.toString());
      setRgbB(rgb.b.toString());
    }
  };

  const handleRgbChange = (r: string, g: string, b: string) => {
    setRgbR(r);
    setRgbG(g);
    setRgbB(b);
    
    const rNum = parseInt(r) || 0;
    const gNum = parseInt(g) || 0;
    const bNum = parseInt(b) || 0;
    
    const hex = rgbToHex(
      Math.min(255, Math.max(0, rNum)),
      Math.min(255, Math.max(0, gNum)),
      Math.min(255, Math.max(0, bNum))
    );
    setCustomColorInput(hex);
  };

  const allColors = [...colorways, ...customColors];

  const removeCustomColor = (colorId: string) => {
    setCustomColors(customColors.filter(c => c.id !== colorId));
    setSelectedColors(selectedColors.filter(c => c !== colorId));
  };

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {printMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`overflow-hidden cursor-pointer transition-all hover-elevate ${
                          selectedMethods.includes(method.id) ? 'border-primary' : ''
                        }`}
                        onClick={() => {
                          if (selectedMethods.includes(method.id)) {
                            setSelectedMethods(selectedMethods.filter(m => m !== method.id));
                          } else {
                            setSelectedMethods([...selectedMethods, method.id]);
                          }
                          console.log('Method:', method.id);
                        }}
                        data-testid={`card-method-${method.id}`}
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-24 flex-shrink-0 bg-muted overflow-hidden">
                            <img 
                              src={method.image} 
                              alt={method.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4 pl-0 flex items-center justify-between">
                            <div>
                              <div className="font-semibold mb-1">{method.label}</div>
                              <p className="text-sm font-body text-muted-foreground">
                                {method.description}
                              </p>
                            </div>
                            <Checkbox 
                              checked={selectedMethods.includes(method.id)}
                              onCheckedChange={() => {}}
                              className="flex-shrink-0"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Colorways *</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {allColors.map((color) => (
                      <div key={color.id} className="relative">
                        <button
                          onClick={() => {
                            if (selectedColors.includes(color.id)) {
                              setSelectedColors(selectedColors.filter(c => c !== color.id));
                            } else {
                              setSelectedColors([...selectedColors, color.id]);
                            }
                            console.log('Color:', color.id);
                          }}
                          className={`relative aspect-square w-full rounded-md border-2 transition-all hover-elevate ${
                            selectedColors.includes(color.id) 
                              ? 'border-primary ring-2 ring-primary ring-offset-2' 
                              : 'border-border'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          data-testid={`button-color-${color.id}`}
                          aria-label={color.label}
                        >
                          {selectedColors.includes(color.id) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`rounded-full p-1 ${
                                color.hex === '#FFFFFF' ? 'bg-black' : 'bg-white'
                              }`}>
                                <Check className={`h-3 w-3 ${
                                  color.hex === '#FFFFFF' ? 'text-white' : 'text-black'
                                }`} />
                              </div>
                            </div>
                          )}
                        </button>
                        {color.id.startsWith('custom-') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomColor(color.id);
                            }}
                            className="absolute -top-2 -right-2 z-10 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover-elevate"
                            data-testid={`button-remove-${color.id}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <Dialog open={customColorDialogOpen} onOpenChange={setCustomColorDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="aspect-square w-full rounded-md border-2 border-dashed border-border flex items-center justify-center hover-elevate transition-all"
                          data-testid="button-add-custom-color"
                        >
                          <Plus className="h-6 w-6 text-muted-foreground" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Add Custom Color</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="color-label" className="text-base">Color Name *</Label>
                            <Input
                              id="color-label"
                              placeholder="e.g., Burgundy, Olive"
                              value={customColorLabel}
                              onChange={(e) => setCustomColorLabel(e.target.value)}
                              className="mt-2"
                              data-testid="input-color-label"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={customColorInput}
                                onChange={(e) => handleHexChange(e.target.value)}
                                className="h-32 w-full rounded-md cursor-pointer border-2 border-border"
                                data-testid="input-color-picker"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="hex-input" className="text-sm mb-1 block">Hex</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">#</span>
                                <Input
                                  id="hex-input"
                                  type="text"
                                  value={customColorInput.replace('#', '')}
                                  onChange={(e) => {
                                    let hex = e.target.value.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
                                    handleHexChange('#' + hex);
                                  }}
                                  placeholder="000000"
                                  className="font-mono"
                                  maxLength={6}
                                  data-testid="input-hex"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label htmlFor="rgb-r" className="text-sm mb-1 block">R</Label>
                              <Input
                                id="rgb-r"
                                type="number"
                                min="0"
                                max="255"
                                value={rgbR}
                                onChange={(e) => handleRgbChange(e.target.value, rgbG, rgbB)}
                                data-testid="input-rgb-r"
                              />
                            </div>
                            <div>
                              <Label htmlFor="rgb-g" className="text-sm mb-1 block">G</Label>
                              <Input
                                id="rgb-g"
                                type="number"
                                min="0"
                                max="255"
                                value={rgbG}
                                onChange={(e) => handleRgbChange(rgbR, e.target.value, rgbB)}
                                data-testid="input-rgb-g"
                              />
                            </div>
                            <div>
                              <Label htmlFor="rgb-b" className="text-sm mb-1 block">B</Label>
                              <Input
                                id="rgb-b"
                                type="number"
                                min="0"
                                max="255"
                                value={rgbB}
                                onChange={(e) => handleRgbChange(rgbR, rgbG, e.target.value)}
                                data-testid="input-rgb-b"
                              />
                            </div>
                          </div>

                          <Button 
                            onClick={handleAddCustomColor}
                            className="w-full"
                            disabled={!customColorLabel.trim()}
                            data-testid="button-save-custom-color"
                          >
                            Add Color
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedColors.map(colorId => {
                      const color = allColors.find(c => c.id === colorId);
                      return color ? (
                        <Badge key={colorId} variant="secondary">
                          {color.label}
                        </Badge>
                      ) : null;
                    })}
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
