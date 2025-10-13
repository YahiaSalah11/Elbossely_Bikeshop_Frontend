import { Package, Calendar, Zap, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Bike } from "../lib/api";
import { useState } from "react";
import API_URL from "../config";

interface BikeDetailsModalProps {
  bike: Bike | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: (bike: Bike) => void;
}

export function BikeDetailsModal({ bike, isOpen, onClose, onOrderNow }: BikeDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!bike) return null;

  const bikeName = bike.name || `${bike.year} ${bike.manufacturer} ${bike.model}`;

  const displayImages = bike.pictures && bike.pictures.length > 0
    ? bike.pictures.map(pic => `${API_URL}/../${pic}`)
    : ['https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800'];

    
  const handleOrderNow = () => {
    onOrderNow(bike);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bikeName}</DialogTitle>
          <DialogDescription>
            View detailed information about this motorcycle
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">

          {/* Image Gallery */}
          <div className="space-y-2">
            <div
              className="relative aspect-video overflow-hidden rounded-lg bg-muted select-none"
              onTouchStart={(e) => (window.touchStartX = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const diff = e.changedTouches[0].clientX - window.touchStartX;
                if (Math.abs(diff) > 50) {
                  // Swipe right → previous
                  if (diff > 0) {
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? displayImages.length - 1 : prev - 1
                    );
                  } else {
                    // Swipe left → next
                    setCurrentImageIndex((prev) =>
                      prev === displayImages.length - 1 ? 0 : prev + 1
                    );
                  }
                }
              }}
            >
              {/* Image */}
              <ImageWithFallback
                src={displayImages[currentImageIndex]}
                alt={bikeName}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Prev / Next Buttons */}
              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? displayImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white text-2xl font-bold rounded-full p-2 backdrop-blur-sm"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === displayImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white text-2xl font-bold rounded-full p-2 backdrop-blur-sm"
                  >
                    ›
                  </button>
                </>
              )}
            </div>


            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${bikeName} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {bike.bikeType && <Badge className="bg-primary capitalize">{bike.bikeType}</Badge>}
            <Badge variant="secondary" className="capitalize">{bike.newOrUsed}</Badge>
            {bike.isFeatured && <Badge className="bg-yellow-500 text-black">Featured</Badge>}
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p>{bike.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="capitalize">{bike.newOrUsed}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="capitalize">{bike.bikeType}</p>
              </div>
            </div>
          </div>

          {/* Manufacturer & Model */}
          <div>
            <h4 className="mb-2">Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p>{bike.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p>{bike.model}</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {bike.specs && (
            <div>
              <h4 className="mb-2">Specifications</h4>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{bike.specs}</p>
              </div>
            </div>
          )}

          {/* Order Now Button */}
          <Button size="lg" className="w-full" onClick={handleOrderNow}>
            Order Now
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
