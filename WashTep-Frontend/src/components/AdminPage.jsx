import React, { useState, useEffect } from 'react';
import { API_BASE } from "../config";

// --- STYLES ---

const adminPageStyles = `
  .admin-container {
    padding: 2rem 0;
  }
  .admin-container h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  .admin-message {
    text-align: center;
    font-size: 1.2rem;
    color: #6c757d;
    padding: 2rem;
  }
  .admin-message.error {
    color: #dc3545;
  }
  .orders-table-container {
    overflow-x: auto;
    background-color: #fff;
    border-radius: 8px; /* Using a fixed value from your theme */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Using a fixed value from your theme */
  }
  .orders-table {
    width: 100%;
    border-collapse: collapse;
  }
  .orders-table th,
  .orders-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6; /* Using a fixed value from your theme */
  }
  .orders-table th {
    background-color: #f8f9fa;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }
  .orders-table td span {
    font-size: 0.85rem;
    color: #6c757d;
  }
  .status-badge {
    padding: 0.25rem 0.6rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: #fff;
    text-transform: capitalize;
  }
  .status-scheduled { background-color: #007bff; }
  .status-picked.up { background-color: #ffc107; color: #212529; }
  .status-in.progress { background-color: #17a2b8; }
  .status-completed { background-color: #28a745; }
  .status-cancelled { background-color: #6c757d; }
  .status-select {
    padding: 0.5rem;
    border: 1px solid #dee2e6; /* Using a fixed value */
    border-radius: 8px; /* Using a fixed value */
    background-color: #fff;
  }

  @media (max-width: 768px) {
    .orders-table thead { display: none; }
    .orders-table, .orders-table tbody, .orders-table tr, .orders-table td { display: block; width: 100%; }
    .orders-table tr { margin-bottom: 1rem; border: 1px solid #dee2e6; border-radius: 8px; }
    .orders-table td { text-align: right; padding-left: 50%; position: relative; border-bottom: 1px solid #f1f1f1; }
    .orders-table td:last-child { border-bottom: none; }
    .orders-table td::before { content: attr(data-label); position: absolute; left: 1rem; width: calc(50% - 2rem); padding-right: 1rem; font-weight: 500; text-align: left; }
  }
`;


const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Error updating status.');
    }
  };
  
  if (loading) return <p className="admin-message">Loading orders...</p>;
  if (error) return <p className="admin-message error">Error: {error}</p>;

  return (
    <>
      <style>{adminPageStyles}</style>
      <div className="admin-container">
        <h2>Admin Dashboard - All Orders</h2>
        {orders.length === 0 ? (
          <p className="admin-message">No orders have been placed yet.</p>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td data-label="Order ID">#{order._id.slice(-6).toUpperCase()}</td>
                    <td data-label="Customer">{order.fullName}<br/><span>{order.phone}</span></td>
                    <td data-label="Service">{order.serviceName}</td>
                    <td data-label="Address">{order.address}, {order.city}</td>
                    <td data-label="Date">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td data-label="Status">
                      <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '.')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPage;

