import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Trash2, Eye, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Order, Bike } from "../lib/api";
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

interface ManageOrdersProps {
  orders: Order[];
  bikes: Bike[];
  onDeleteOrder: (id: string) => Promise<void>;
  onAddOrder: (order: { 
    bikeId: string;
    customerName: string; 
    phoneNumber: string;
    email?: string;
  }) => Promise<void>;
}

export function ManageOrders({ orders, bikes, onDeleteOrder, onAddOrder }: ManageOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderPhone, setNewOrderPhone] = useState("");
  const [newOrderEmail, setNewOrderEmail] = useState("");
  const [newOrderBikeId, setNewOrderBikeId] = useState("");

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (orderToDelete !== null) {
      setDeletingId(orderToDelete);
      try {
        await onDeleteOrder(orderToDelete);
      } finally {
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
        setDeletingId(null);
      }
    }
  };

  const handleAddOrder = async () => {
    if (!newOrderName || !newOrderPhone || !newOrderBikeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAddingOrder(true);

    try {
      await onAddOrder({
        bikeId: newOrderBikeId,
        customerName: newOrderName,
        phoneNumber: newOrderPhone,
        email: newOrderEmail || undefined
      });

      setNewOrderName("");
      setNewOrderPhone("");
      setNewOrderEmail("");
      setNewOrderBikeId("");
      setAddDialogOpen(false);
      toast.success("Order added successfully!");
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsAddingOrder(false);
    }
  };

  // Helper function to get bike name from populated or unpopulated data
  const getBikeName = (order: Order): string => {
    if (typeof order.bike === 'object' && order.bike) {
      return order.bike.name || `${order.bike.year} ${order.bike.manufacturer} ${order.bike.model}`;
    }
    return 'Unknown Bike';
  };

  // Helper function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>
                View, add, and delete customer orders
              </CardDescription>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </p>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Motorcycle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">{order._id.slice(-6)}</TableCell>
                    <TableCell>{order.contactInfo.name}</TableCell>
                    <TableCell>{order.contactInfo.phone}</TableCell>
                    <TableCell>{order.contactInfo.email || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{getBikeName(order)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(order._id)}
                          disabled={deletingId === order._id}
                        >
                          {deletingId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete information about this order</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label>Order ID</Label>
                <p className="text-muted-foreground font-mono text-sm">{selectedOrder._id}</p>
              </div>
              <div>
                <Label>Customer Name</Label>
                <p className="text-muted-foreground">{selectedOrder.contactInfo.name}</p>
              </div>
              <div>
                <Label>Phone Number</Label>
                <p className="text-muted-foreground">{selectedOrder.contactInfo.phone}</p>
              </div>
              {selectedOrder.contactInfo.email && (
                <div>
                  <Label>Email</Label>
                  <p className="text-muted-foreground">{selectedOrder.contactInfo.email}</p>
                </div>
              )}
              <div>
                <Label>Motorcycle</Label>
                <p className="text-muted-foreground">{getBikeName(selectedOrder)}</p>
              </div>
              <div>
                <Label>Order Date</Label>
                <p className="text-muted-foreground">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
            <DialogDescription>Enter the order details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                value={newOrderName}
                onChange={(e) => setNewOrderName(e.target.value)}
                disabled={isAddingOrder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={newOrderPhone}
                onChange={(e) => setNewOrderPhone(e.target.value)}
                disabled={isAddingOrder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={newOrderEmail}
                onChange={(e) => setNewOrderEmail(e.target.value)}
                disabled={isAddingOrder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bike">Motorcycle *</Label>
              <Select value={newOrderBikeId} onValueChange={setNewOrderBikeId} disabled={isAddingOrder}>
                <SelectTrigger id="bike">
                  <SelectValue placeholder="Select a motorcycle" />
                </SelectTrigger>
                <SelectContent>
                  {bikes.map((bike) => (
                    <SelectItem key={bike._id} value={bike._id}>
                      {bike.name || `${bike.year} ${bike.manufacturer} ${bike.model}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddOrder} className="w-full" disabled={isAddingOrder}>
              {isAddingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Order...
                </>
              ) : (
                'Add Order'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order.
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
