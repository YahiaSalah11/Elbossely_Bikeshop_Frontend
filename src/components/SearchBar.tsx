import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SearchBarProps {
  filters: {
    make: string;
    model: string;
    priceRange: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearch: () => void;
}

export function SearchBar({ filters, onFilterChange, onSearch }: SearchBarProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={filters.make} onValueChange={(value) => onFilterChange('make', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            <SelectItem value="toyota">Toyota</SelectItem>
            <SelectItem value="honda">Honda</SelectItem>
            <SelectItem value="ford">Ford</SelectItem>
            <SelectItem value="bmw">BMW</SelectItem>
            <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
            <SelectItem value="tesla">Tesla</SelectItem>
            <SelectItem value="audi">Audi</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.model} onValueChange={(value) => onFilterChange('model', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="truck">Truck</SelectItem>
            <SelectItem value="coupe">Coupe</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.priceRange} onValueChange={(value) => onFilterChange('priceRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-30000">Under $30,000</SelectItem>
            <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
            <SelectItem value="50000-70000">$50,000 - $70,000</SelectItem>
            <SelectItem value="70000+">$70,000+</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
