import { useState, useEffect } from "react";
import { UserPage } from "./components/UserPage";
import { AdminPage } from "./components/AdminPage";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Bike as BikeIcon, Loader2 } from "lucide-react";
import { Bike, Order, bikeAPI, orderAPI } from "./lib/api";
import { toast } from "sonner@2.0.3";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"user" | "admin" | "login">("user");
  const [password, setPassword] = useState("");
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    if (currentPage === "admin") {
      fetchOrders();
    }
  }, [currentPage]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all bikes by searching with empty filters
      const allBikes = await bikeAPI.searchBikes({});
      setBikes(allBikes);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bikes';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const allOrders = await orderAPI.getAllOrders();
      setOrders(allOrders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      toast.error(message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, this would be server-side)
    if (password === "admin123") {
      setCurrentPage("admin");
      setPassword("");
    } else {
      toast.error("Incorrect password!");
    }
  };

  const handleLogout = () => {
    setCurrentPage("user");
  };

  const handleAddBike = async (formData: FormData) => {
    try {
      const newBike = await bikeAPI.addBike(formData);
      setBikes([...bikes, newBike]);
      toast.success("Bike added successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add bike';
      toast.error(message);
      throw err;
    }
  };

  const handleDeleteBike = async (id: string) => {
    try {
      await bikeAPI.deleteBike(id);
      setBikes(bikes.filter(bike => bike._id !== id));
      toast.success("Bike deleted successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete bike';
      toast.error(message);
    }
  };

  const handleSubmitOrder = async (orderData: { 
    bikeId: string;
    customerName: string; 
    phoneNumber: string; 
    email?: string;
  }) => {
    try {
      const newOrder = await orderAPI.createOrder({
        bike: orderData.bikeId,
        contactInfo: {
          name: orderData.customerName,
          phone: orderData.phoneNumber,
          email: orderData.email
        }
      });
      toast.success("Order placed successfully!");
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to place order';
      toast.error(message);
      throw err;
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await orderAPI.deleteOrder(id);
      setOrders(orders.filter(order => order._id !== id));
      toast.success("Order deleted successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      toast.error(message);
    }
  };

  const handleAddOrder = async (orderData: { 
    bikeId: string;
    customerName: string; 
    phoneNumber: string;
    email?: string;
  }) => {
    try {
      const newOrder = await orderAPI.createOrder({
        bike: orderData.bikeId,
        contactInfo: {
          name: orderData.customerName,
          phone: orderData.phoneNumber,
          email: orderData.email
        }
      });
      setOrders([...orders, newOrder]);
      toast.success("Order added successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add order';
      toast.error(message);
      throw err;
    }
  };

  // Login Page
  if (currentPage === "login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-2">
              <BikeIcon className="h-8 w-8" />
            </div>
            <CardTitle className="text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setCurrentPage("user")}
              >
                Back to User Page
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Demo password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading && bikes.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading bikes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && bikes.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Error</CardTitle>
            <CardDescription className="text-center">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchBikes} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render current page
  if (currentPage === "admin") {
    return (
      <AdminPage 
        bikes={bikes}
        orders={orders}
        onLogout={handleLogout}
        onAddBike={handleAddBike}
        onDeleteBike={handleDeleteBike}
        onDeleteOrder={handleDeleteOrder}
        onAddOrder={handleAddOrder}
      />
    );
  }

  // User Page with Admin Access Button
  return (
    <div className="relative">
      <UserPage bikes={bikes} onSubmitOrder={handleSubmitOrder} />
      <Button 
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setCurrentPage("login")}
      >
        Admin Access
      </Button>
    </div>
  );
}
