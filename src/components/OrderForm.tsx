import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Bike as BikeIcon, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Bike } from "../lib/api";

interface OrderFormProps {
  selectedBike?: Bike | null;
  onSubmit: (order: { 
    bikeId: string;
    customerName: string; 
    phoneNumber: string;
    email?: string;
  }) => Promise<any>;
}

export function OrderForm({ selectedBike, onSubmit }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bikeName, setBikeName] = useState("");
  const [bikeId, setBikeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedBike) {
      setBikeName(selectedBike.name || `${selectedBike.manufacturer} ${selectedBike.model} ${selectedBike.year}`);
      setBikeId(selectedBike._id);
    }
  }, [selectedBike]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !bikeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call parent submit handler
      await onSubmit({
        bikeId,
        customerName: name,
        phoneNumber: phone,
        email: email || undefined
      });

      // Show success message
      toast.success("Order placed successfully! We'll contact you soon.");
      
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setBikeName("");
      setBikeId("");
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BikeIcon className="h-6 w-6" />
          <CardTitle>Place Your Order</CardTitle>
        </div>
        <CardDescription>
          Fill in your details and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
            <div className="space-y-2">
            <Label htmlFor="bike">Selected Motorcycle *</Label>
            <Input 
              id="bike"
              placeholder="Click 'Order Now' on a bike to select"
              value={bikeName}
              onChange={(e) => setBikeName(e.target.value)}
              required
              disabled
              className="text-black"
            />
            </div>
          
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !bikeId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Order'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
