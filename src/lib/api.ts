// API Configuration
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : 'http://localhost:5000/api';

// Types matching backend models
export interface Bike {
  _id: string;
  name: string;
  manufacturer: string;
  model: string;
  year: number;
  newOrUsed: 'new' | 'used';
  specs: string;
  isFeatured: boolean;
  pictures: string[];
  bikeType: 'chinese' | 'indian' | 'electric' | 'japanese';
}

export interface Order {
  _id: string;
  bike: string | Bike; // Can be populated or just ID
  user?: string;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Bike API calls
export const bikeAPI = {
  // Add a new bike with pictures
  async addBike(bikeData: FormData): Promise<Bike> {
    const response = await fetch(`${API_BASE_URL}/bikes/add`, {
      method: 'POST',
      body: bikeData,
    });
    if (!response.ok) {
      throw new Error('Failed to add bike');
    }
    return response.json();
  },

  // Get featured bikes
  async getFeatured(): Promise<Bike[]> {
    const response = await fetch(`${API_BASE_URL}/bikes/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured bikes');
    }
    return response.json();
  },

  // Search bikes
  async searchBikes(filters: {
    manufacturer?: string;
    model?: string;
    year?: number;
    bikeType?: string;
    newOrUsed?: string;
  }): Promise<Bike[]> {
    const response = await fetch(`${API_BASE_URL}/bikes/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    if (!response.ok) {
      throw new Error('Failed to search bikes');
    }
    return response.json();
  },

  // Get bikes by type
  async getBikesByType(bikeType: string): Promise<Bike[]> {
    const response = await fetch(`${API_BASE_URL}/bikes/bikesbytype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bikeType }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch bikes by type');
    }
    return response.json();
  },

  // Get manufacturers
  async getManufacturers(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/bikes/manufacturers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch manufacturers');
    }
    return response.json();
  },

  // Get models
  async getModels(manufacturer?: string): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/bikes/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ manufacturer }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    return response.json();
  },

  // Get years
  async getYears(): Promise<number[]> {
    const response = await fetch(`${API_BASE_URL}/bikes/years`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch years');
    }
    return response.json();
  },

  // Delete a bike
  async deleteBike(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bikes/deletebike/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete bike');
    }
  },

  // Delete all bikes
  async deleteAllBikes(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bikes/deleteallbikes`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete all bikes');
    }
  },
};

// Order API calls
export const orderAPI = {
  // Create a new order
  async createOrder(orderData: {
    bike: string;
    contactInfo: {
      name: string;
      phone: string;
      email?: string;
    };
  }): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Failed to create order' );
    }
    return response.json();
  },

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  // Search orders
  async searchOrders(searchTerm: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error('Failed to search orders');
    }
    return response.json();
  },

  // Delete an order
  async deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete order');
    }
  },
};