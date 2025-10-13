import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Bike as BikeIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AddBikeFormProps {
  onAddBike: (formData: FormData) => Promise<void>;
}

export function AddBikeForm({ onAddBike }: AddBikeFormProps) {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [newOrUsed, setNewOrUsed] = useState<"new" | "used">("new");
  const [specs, setSpecs] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [bikeType, setBikeType] = useState<"chinese" | "indian" | "electric" | "japanese">("japanese");
  const [pictures, setPictures] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length + pictures.length > 6) {
        toast.error("Maximum 6 pictures allowed");
        return;
      }
      setPictures([...pictures, ...filesArray]);
    }
  };

  const handleRemovePicture = (index: number) => {
    setPictures(pictures.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !manufacturer || !model || !year || !specs) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (pictures.length === 0) {
      toast.error("Please upload at least one picture");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("manufacturer", manufacturer);
      formData.append("model", model);
      formData.append("year", year);
      formData.append("newOrUsed", newOrUsed);
      formData.append("specs", specs);
      formData.append("isFeatured", isFeatured.toString());
      formData.append("bikeType", bikeType);
      
      // Append all pictures
      pictures.forEach((file) => {
        formData.append("pictures", file);
      });

      await onAddBike(formData);

      // Reset form
      setName("");
      setManufacturer("");
      setModel("");
      setYear("");
      setNewOrUsed("new");
      setSpecs("");
      setIsFeatured(false);
      setBikeType("japanese");
      setPictures([]);

      toast.success("Motorcycle added successfully!");
    } catch (error) {
      // Error is handled in parent component
      console.error('Add bike error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BikeIcon className="h-6 w-6" />
          <CardTitle>Add New Motorcycle</CardTitle>
        </div>
        <CardDescription>
          Fill in the details to add a new motorcycle to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Bike Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Yamaha YZF-R1 Sport Bike"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                placeholder="e.g., Yamaha"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="e.g., YZF-R1"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="e.g., 2023"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newOrUsed">Condition *</Label>
              <Select value={newOrUsed} onValueChange={(val: "new" | "used") => setNewOrUsed(val)} disabled={isSubmitting}>
                <SelectTrigger id="newOrUsed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bikeType">Bike Type *</Label>
              <Select value={bikeType} onValueChange={(val: "chinese" | "indian" | "electric" | "japanese") => setBikeType(val)} disabled={isSubmitting}>
                <SelectTrigger id="bikeType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specs">Specifications *</Label>
            <Textarea
              id="specs"
              placeholder="Enter bike specifications (engine size, power, features, etc.)"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              required
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Mark as Featured
            </Label>
          </div>
          
            <div className="space-y-2">
              <Label htmlFor="pictures">Pictures * (Max 6)</Label>
              <Input
                id="pictures"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isSubmitting || pictures.length >= 6}
                onPaste={async (e) => {
                if (isSubmitting || pictures.length >= 6) return;
                const items = e.clipboardData.items;
                const imageItems = Array.from(items).filter(item => item.type.startsWith("image/"));
                if (imageItems.length === 0) return;
                let newFiles: File[] = [];
                for (const item of imageItems) {
                  const file = item.getAsFile();
                  if (file) newFiles.push(file);
                }
                if (newFiles.length + pictures.length > 6) {
                  toast.error("Maximum 6 pictures allowed");
                  return;
                }
                setPictures([...pictures, ...newFiles]);
                }}
              />
              {pictures.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {pictures.map((file, index) => (
                  <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                    <button
                    type="button"
                    onClick={() => handleRemovePicture(index)}
                    className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                    disabled={isSubmitting}
                    >
                    <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                </div>
              )}
            </div>
            
          
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Motorcycle...
              </>
            ) : (
              'Add Motorcycle'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
