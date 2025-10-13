import { useState, useMemo, useRef } from "react";
import { BikeHeader } from "./BikeHeader";
import { BikeCard } from "./BikeCard";
import { BikeDetailsModal } from "./BikeDetailsModal";
import { BikeSearchBar } from "./BikeSearchBar";
import { OrderForm } from "./OrderForm";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Toaster } from "./ui/sonner";
import { Bike } from "../lib/api";

interface UserPageProps {
  bikes: Bike[];
  onSubmitOrder: (order: { 
    bikeId: string;
    customerName: string; 
    phoneNumber: string;
    email?: string;
  }) => Promise<any>;
}

export function UserPage({ bikes, onSubmitOrder }: UserPageProps) {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBikeForOrder, setSelectedBikeForOrder] = useState<Bike | null>(null);
  const orderSectionRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState({
    manufacturer: "all",
    bikeType: "all",
    newOrUsed: "all"
  });

  // Get featured bikes
  const featuredBikes = bikes.filter(bike => bike.isFeatured).slice(0, 3);
  
  // If no featured bikes, show first 3
  const displayedFeatured = featuredBikes.length > 0 ? featuredBikes : bikes.slice(0, 3);
  
  // Get bikes by type
  const bikesByType = {
    chinese: bikes.filter(bike => bike.bikeType === "chinese"),
    indian: bikes.filter(bike => bike.bikeType === "indian"),
    electric: bikes.filter(bike => bike.bikeType === "electric"),
    japanese: bikes.filter(bike => bike.bikeType === "japanese")
  };

  // Filter Logic for Search
  const searchResults = useMemo(() => {
    return bikes.filter(bike => {
      if (filters.manufacturer !== "all" && bike.manufacturer.toLowerCase() !== filters.manufacturer.toLowerCase()) {
        return false;
      }
      if (filters.bikeType !== "all" && bike.bikeType !== filters.bikeType) {
        return false;
      }
      if (filters.newOrUsed !== "all" && bike.newOrUsed !== filters.newOrUsed) {
        return false;
      }
      return true;
    });
  }, [bikes, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const searchSection = document.getElementById('search-results');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = (id: string) => {
    const bike = bikes.find(b => b._id === id);
    if (bike) {
      setSelectedBike(bike);
      setIsModalOpen(true);
    }
  };

  const handleOrderNow = (bike: Bike) => {
    setSelectedBikeForOrder(bike);
    setTimeout(() => {
      orderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <BikeHeader />
      <Toaster />
      
      {/* Hero Section */}
      <section 
        id="home"
        className="relative bg-cover bg-center py-24"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1580451998766-238b1b3a92bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwc2hvd3Jvb218ZW58MXx8fHwxNzYwMTI0MjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      >
        <div className="container mx-auto px-9">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-4 text-white">Find Your Dream Motorcycle</h1>
            <p className="text-white/90 mb-8">
              Discover the best selection of quality motorcycles. From sport bikes to cruisers, we have it all.
            </p>
            <Button size="lg" onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Bikes
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Bikes Section */}
      <section id="featured" className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2">Featured Motorcycles</h2>
            <p className="text-muted-foreground">Our top picks for you</p>
          </div>
          
          {displayedFeatured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {displayedFeatured.map((bike) => (
                <BikeCard 
                  key={bike._id} 
                  bike={bike}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured bikes available</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      {/* <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2">Browse by Type</h2>
            <p className="text-muted-foreground">Explore our motorcycles collection</p>
          </div>
          
          {bikesByType.chinese.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6">Chinese Bikes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bikesByType.chinese.slice(0, 4).map((bike) => (
                  <BikeCard key={bike._id} bike={bike} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}
          
          {bikesByType.indian.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6">Indian Bikes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bikesByType.indian.slice(0, 4).map((bike) => (
                  <BikeCard key={bike._id} bike={bike} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}
          
          {bikesByType.electric.length > 0 && (
            <div className="mb-12">
              <h3 className="mb-6">Electric Bikes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bikesByType.electric.slice(0, 4).map((bike) => (
                  <BikeCard key={bike._id} bike={bike} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}
          
          {bikesByType.japanese.length > 0 && (
            <div>
              <h3 className="mb-6">Japanese Bikes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bikesByType.japanese.slice(0, 4).map((bike) => (
                  <BikeCard key={bike._id} bike={bike} onViewDetails={handleViewDetails} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
       */}


      {/* Search Section */}
      <section id="search" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <BikeSearchBar 
              filters={filters}
              bikes={bikes}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>
      
      {/* Search Results */}
      <section id="search-results" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="mb-2">Search Results</h2>
            <p className="text-muted-foreground">
              {searchResults.length} motorcycle{searchResults.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((bike) => (
                <BikeCard 
                  key={bike._id} 
                  bike={bike}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No motorcycles found matching your criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ manufacturer: "all", bikeType: "all", newOrUsed: "all" })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Order Section */}
      <section id="order" ref={orderSectionRef} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2">Place Your Order</h2>
            <p className="text-muted-foreground">Ready to ride? Fill out the form below</p>
          </div>
          
          <OrderForm selectedBike={selectedBikeForOrder} onSubmit={onSubmitOrder} />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="mb-4">El Bossely Bikes</h4>
              <p className="text-muted-foreground text-sm">
                Your trusted marketplace for quality motorcycles. Find your perfect ride today.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#categories" className="text-muted-foreground hover:text-foreground">Chinese Bikes</a></li>
                <li><a href="#categories" className="text-muted-foreground hover:text-foreground">Indian Bikes</a></li>
                <li><a href="#categories" className="text-muted-foreground hover:text-foreground">Electric Bikes</a></li>
                <li><a href="#categories" className="text-muted-foreground hover:text-foreground">Japanese Bikes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Warranty Info</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Test Ride</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 El Bossely Bikes. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <BikeDetailsModal 
        bike={selectedBike}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderNow={handleOrderNow}
      />
    </div>
  );
}
