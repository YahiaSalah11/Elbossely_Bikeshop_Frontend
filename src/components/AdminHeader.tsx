import { Bike, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
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
            <span className="text-xl">El Bossely Bikes - Admin</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#add-bike" onClick={(e) => { e.preventDefault(); scrollToSection('add-bike'); }} className="hover:text-primary transition-colors">Add Bike</a>
            <a href="#manage-bikes" onClick={(e) => { e.preventDefault(); scrollToSection('manage-bikes'); }} className="hover:text-primary transition-colors">Manage Bikes</a>
            <a href="#manage-orders" onClick={(e) => { e.preventDefault(); scrollToSection('manage-orders'); }} className="hover:text-primary transition-colors">Orders</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
