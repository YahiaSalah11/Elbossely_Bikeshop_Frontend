import { Bike, User } from "lucide-react";
import { Button } from "./ui/button";

export function BikeHeader() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="h-8 w-8" />
            <span className="text-l">El Bossely Bikes</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="hover:text-primary transition-colors">Home</a>
            <a href="#featured" onClick={(e) => { e.preventDefault(); scrollToSection('featured'); }} className="hover:text-primary transition-colors">Featured</a>
            <a href="#categories" onClick={(e) => { e.preventDefault(); scrollToSection('categories'); }} className="hover:text-primary transition-colors">Categories</a>
            <a href="#search" onClick={(e) => { e.preventDefault(); scrollToSection('search'); }} className="hover:text-primary transition-colors">Search</a>
            <a href="#order" onClick={(e) => { e.preventDefault(); scrollToSection('order'); }} className="hover:text-primary transition-colors">Order</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
