import { Package, Calendar, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Bike } from "../lib/api";
import API_URL from "../config";

interface BikeCardProps {
  bike: Bike;
  onViewDetails: (id: string) => void;
}



export function BikeCard({ bike, onViewDetails }: BikeCardProps) {
  const displayImage =
    Array.isArray(bike.pictures) && bike.pictures.length > 0
      ? `${API_URL}/../${bike.pictures[0]}`
      : "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800";


  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer" onClick={() => onViewDetails(bike._id)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ImageWithFallback 
          src={displayImage} 
          alt={bike.name || `${bike.year} ${bike.manufacturer} ${bike.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {bike.bikeType && (
          <Badge className="absolute top-3 left-3 bg-primary capitalize">{bike.bikeType}</Badge>
        )}
        {bike.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-yellow-500 text-black">Featured</Badge>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="mb-1">{bike.name || `${bike.year} ${bike.manufacturer} ${bike.model}`}</h3>
          <p className="text-sm text-muted-foreground">{bike.manufacturer} {bike.model}</p>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{bike.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            <span className="text-sm capitalize">{bike.newOrUsed}</span>
          </div>
          {bike.specs && (
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span className="text-sm truncate" title={bike.specs}>Specs</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="capitalize">{bike.newOrUsed}</Badge>
        </div>
        
        <Button className="w-full" onClick={(e) => { e.stopPropagation(); onViewDetails(bike._id); }}>View Details</Button>
      </CardContent>
    </Card>
  );
}
