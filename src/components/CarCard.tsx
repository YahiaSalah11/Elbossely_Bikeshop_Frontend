import { useState } from "react";
import { Heart, Gauge, Calendar, Fuel } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CarCardProps {
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
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export function CarCard({ 
  id,
  make, 
  model, 
  year, 
  price, 
  mileage, 
  fuelType, 
  image, 
  condition = "Excellent",
  featured = false,
  isFavorite,
  onToggleFavorite,
  onViewDetails
}: CarCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ImageWithFallback 
          src={image} 
          alt={`${year} ${make} ${model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${isFavorite ? 'text-red-500' : ''}`}
          onClick={() => onToggleFavorite(id)}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        {featured && (
          <Badge className="absolute top-3 left-3 bg-primary">Featured</Badge>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="mb-1">{year} {make} {model}</h3>
          <p className="text-primary">${price.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4" />
            <span className="text-sm">{mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span className="text-sm">{fuelType}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{condition}</Badge>
        </div>
        
        <Button className="w-full mt-4" onClick={() => onViewDetails(id)}>View Details</Button>
      </CardContent>
    </Card>
  );
}
