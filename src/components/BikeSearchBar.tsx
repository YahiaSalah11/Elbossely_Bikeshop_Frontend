import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Bike } from "../lib/api";

interface BikeSearchBarProps {
  filters: {
    manufacturer: string;
    bikeType: string;
    newOrUsed: string;
  };
  bikes: Bike[];
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
}

export function BikeSearchBar({ filters, bikes, onFilterChange, onSearch }: BikeSearchBarProps) {
  // Extract unique manufacturers from bikes
  const manufacturers = Array.from(new Set(bikes.map(bike => bike.manufacturer))).sort();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <h3 className="mb-4">Search for Your Perfect Bike</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={filters.manufacturer} onValueChange={(value) => onFilterChange('manufacturer', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {manufacturers.map(manufacturer => (
              <SelectItem key={manufacturer} value={manufacturer.toLowerCase()}>
                {manufacturer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.bikeType} onValueChange={(value) => onFilterChange('bikeType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Bike Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.newOrUsed} onValueChange={(value) => onFilterChange('newOrUsed', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="w-full" onClick={onSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
