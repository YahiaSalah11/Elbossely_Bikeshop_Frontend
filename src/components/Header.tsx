import { Car, Heart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  favoritesCount: number;
  onFavoritesClick: () => void;
}

export function Header({ favoritesCount, onFavoritesClick }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8" />
            <span className="text-xl">AutoMarket</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="hover:text-primary transition-colors">Buy</a>
            <a href="#" className="hover:text-primary transition-colors">Sell</a>
            <a href="#" className="hover:text-primary transition-colors">Finance</a>
            <a href="#" className="hover:text-primary transition-colors">About</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onFavoritesClick}
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {favoritesCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="hidden md:inline-flex">Sell Your Car</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
