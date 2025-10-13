import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AddBikeForm } from "./AddBikeForm";
import { ManageBikes } from "./ManageBikes";
import { ManageOrders } from "./ManageOrders";
import { BikeDetailsModal } from "./BikeDetailsModal";
import { Toaster } from "./ui/sonner";
import { Bike, Order } from "../lib/api";

interface AdminPageProps {
  bikes: Bike[];
  orders: Order[];
  onLogout: () => void;
  onAddBike: (formData: FormData) => Promise<void>;
  onDeleteBike: (id: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
  onAddOrder: (order: { 
    bikeId: string;
    customerName: string; 
    phoneNumber: string;
    email?: string;
  }) => Promise<void>;
}

export function AdminPage({ 
  bikes, 
  orders, 
  onLogout, 
  onAddBike, 
  onDeleteBike, 
  onDeleteOrder,
  onAddOrder 
}: AdminPageProps) {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewBike = (id: string) => {
    const bike = bikes.find(b => b._id === id);
    if (bike) {
      setSelectedBike(bike);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={onLogout} />
      <Toaster />
      
      {/* Add Bike Section */}
      <section id="add-bike" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AddBikeForm onAddBike={onAddBike} />
          </div>
        </div>
      </section>
      
      {/* Manage Bikes Section */}
      <section id="manage-bikes" className="py-16">
        <div className="container mx-auto px-4">
          <ManageBikes 
            bikes={bikes} 
            onDeleteBike={onDeleteBike}
            onViewBike={handleViewBike}
          />
        </div>
      </section>
      
      {/* Manage Orders Section */}
      <section id="manage-orders" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ManageOrders 
            orders={orders}
            bikes={bikes}
            onDeleteOrder={onDeleteOrder}
            onAddOrder={onAddOrder}
          />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 El Bossely Bikes - Admin Panel. All rights reserved.</p>
        </div>
      </footer>

      {/* Bike Details Modal */}
      <BikeDetailsModal 
        bike={selectedBike}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderNow={() => {}}
      />
    </div>
  );
}
