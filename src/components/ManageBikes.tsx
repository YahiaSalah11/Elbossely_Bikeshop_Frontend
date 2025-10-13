import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Trash2, Eye, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Bike } from "../lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ManageBikesProps {
  bikes: Bike[];
  onDeleteBike: (id: string) => Promise<void>;
  onViewBike: (id: string) => void;
}

export function ManageBikes({ bikes, onDeleteBike, onViewBike }: ManageBikesProps) {
  const [bikeTypeFilter, setBikeTypeFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      if (bikeTypeFilter !== "all" && bike.bikeType !== bikeTypeFilter) {
        return false;
      }
      if (conditionFilter !== "all" && bike.newOrUsed !== conditionFilter) {
        return false;
      }
      return true;
    });
  }, [bikes, bikeTypeFilter, conditionFilter]);

  const handleDeleteClick = (id: string) => {
    setBikeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (bikeToDelete !== null) {
      setDeletingId(bikeToDelete);
      try {
        await onDeleteBike(bikeToDelete);
      } finally {
        setDeleteDialogOpen(false);
        setBikeToDelete(null);
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Motorcycles</CardTitle>
          <CardDescription>
            View, filter, and delete motorcycles from your inventory
          </CardDescription>
          
          <div className="flex gap-4 mt-4">
            <Select value={bikeTypeFilter} onValueChange={setBikeTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-muted-foreground">
              {filteredBikes.length} motorcycle{filteredBikes.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBikes.map((bike) => {
                  const displayImage = bike.pictures && bike.pictures.length > 0 
                    ? bike.pictures[0] 
                    : 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=200';

                  return (
                    <TableRow key={bike._id}>
                      <TableCell>
                        <ImageWithFallback 
                          src={displayImage} 
                          alt={bike.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {bike.name || `${bike.year} ${bike.manufacturer} ${bike.model}`}
                      </TableCell>
                      <TableCell>{bike.manufacturer}</TableCell>
                      <TableCell>{bike.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{bike.bikeType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{bike.newOrUsed}</Badge>
                      </TableCell>
                      <TableCell>
                        {bike.isFeatured && <Badge className="bg-yellow-500 text-black">Featured</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewBike(bike._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(bike._id)}
                            disabled={deletingId === bike._id}
                          >
                            {deletingId === bike._id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredBikes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No motorcycles found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the motorcycle from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
