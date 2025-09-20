 import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from '../../config';   

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`, {
        // withCredentials: true, // important if you use cookies for auth
      });
      setOrders(res.data); 
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // ✅ Search Orders
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return fetchOrders(); // reset to all if empty

    try {
      const res = await axios.get(
        `${API_URL}/api/orders/search?searchTerm=${searchTerm}`,
        { /* withCredentials: true */ }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error searching orders", err);
      setOrders([]);
    }
  };

  // ✅ Delete an order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${API_URL}/api/orders/${id}`, {
        // withCredentials: true,
      });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error("Error deleting order", err);
    }
  };

// Helper to format date
const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // e.g., "8/22/2025, 6:41:59 PM"
};

return (
    <div className="order-manager">
        <h2>📦 Order Manager</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                placeholder="Search by ID, name, phone, or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
            <button type="button" onClick={fetchOrders}>
                Reset
            </button>
        </form>

        {/* Orders Table */}
        <table className="orders-table">
            <thead>
                <tr>
                    <th>Created At</th>
                    <th>Bike</th>
                    <th>User</th>
                    <th>Contact Info</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan="5">No orders found</td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order._id}>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{order.bike ? order.bike.name : "N/A"}</td>
                            <td>{order.user ? order.user.username : "Guest"}</td>
                            <td>
                                {order.contactInfo?.name} <br />
                                {order.contactInfo?.phone} <br />
                                {order.contactInfo?.email}
                            </td>
                            <td>
                                <button onClick={() => handleDelete(order._id)}>❌ Delete</button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);
};

export default OrderManager;
