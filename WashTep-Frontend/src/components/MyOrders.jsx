import React, { useState, useEffect } from 'react';
import { API_BASE } from "../config";
import "./MyOrders.css"; // ✅ Import external CSS

// --- Helper Components ---
const StatusIndicator = ({ status }) => {
  const statusClass = `status-${status.replace(/\s+/g, '-')}`;
  return <span className={`order-status-value ${statusClass}`}>{status}</span>;
};

const OrderCard = ({ order }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <div className="info-block-label">ORDER #</div>
          <div className="info-block-value">{order._id.slice(-6).toUpperCase()}</div>
        </div>
        <div>
          <div className="info-block-label">DATE PLACED</div>
          <div className="info-block-value">{formatDate(order.orderDate)}</div>
        </div>
        <div>
          <div className="info-block-label">SERVICE</div>
          <div className="info-block-value">{order.serviceName}</div>
        </div>
        <div>
          <div className="info-block-label">STATUS</div>
          <StatusIndicator status={order.status} />
        </div>
      </div>
      <div>
        <div className="info-block-label">DELIVER TO</div>
        <div className="info-block-value">
          {order.address}, {order.city}, {order.pincode}
        </div>
      </div>
    </div>
  );
};

// --- Main MyOrders Component ---
const MyOrders = ({ userInfo, navigateTo }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo || !userInfo.token) {
        setError('Authentication details are missing. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/orders/myorders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('userInfo');
          return;
        }

        if (!response.ok) {
          throw new Error('Something went wrong. We could not fetch your orders.');
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="centered-feedback">
          <h3>Loading your orders...</h3>
        </div>
      );
    }
    if (error) {
      return (
        <div className="centered-feedback">
          <h3>An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (orders.length === 0) {
      return (
        <div className="centered-feedback">
          <h3>No Orders Yet!</h3>
          <p>You haven't placed any orders with us. Let's change that!</p>
          <button onClick={() => navigateTo('home')} className="primary-button">
            Schedule a Pickup
          </button>
        </div>
      );
    }
    return (
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <div className="my-orders-container">
      <h1 className="my-orders-title">My Order History</h1>
      {renderContent()}
    </div>
  );
};

export default MyOrders;
