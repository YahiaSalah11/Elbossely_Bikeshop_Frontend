import { X, Heart, Gauge, Calendar, Fuel, MapPin, Cog } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  image: string;
  condition?: string;
  featured?: boolean;
}

interface CarDetailsModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export function CarDetailsModal({ car, isOpen, onClose, isFavorite, onToggleFavorite }: CarDetailsModalProps) {
  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car.year} {car.make} {car.model}</DialogTitle>
          <DialogDescription>
            View detailed information about this vehicle
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <ImageWithFallback 
              src={car.image} 
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${isFavorite ? 'text-red-500' : ''}`}
              onClick={() => onToggleFavorite(car.id)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Price and Badges */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary">${car.price.toLocaleString()}</p>
              <div className="flex gap-2 mt-2">
                {car.featured && <Badge className="bg-primary">Featured</Badge>}
                <Badge variant="secondary">{car.condition || "Excellent"}</Badge>
              </div>
            </div>
            <Button size="lg">Contact Seller</Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Gauge className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p>{car.mileage.toLocaleString()} mi</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p>{car.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Fuel className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p>{car.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Cog className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Transmission</p>
                <p>Automatic</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-2">Description</h4>
            <p className="text-muted-foreground">
              This {car.year} {car.make} {car.model} is in {car.condition?.toLowerCase()} condition. 
              It has been meticulously maintained and comes with a complete service history. 
              Perfect for those looking for a reliable and stylish vehicle.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="mb-3">Key Features</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">Leather Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">Navigation System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">Backup Camera</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">Bluetooth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">Sunroof</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">Alloy Wheels</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p>Los Angeles, CA</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1">Schedule Test Drive</Button>
            <Button size="lg" variant="outline" className="flex-1">Make an Offer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
