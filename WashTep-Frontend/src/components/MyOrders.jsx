import React, { useState, useEffect } from 'react';
import { API_BASE } from "../config";

// --- STYLE INJECTION COMPONENT ---
const MyOrdersStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .my-orders-container { max-width: 1200px; margin-left: auto; margin-right: auto; padding: 1rem 2rem; }
      .my-orders-title { font-size: 1.875rem; font-weight: 700; color: var(--text-dark); margin-bottom: 1.5rem; }
      .orders-list { display: flex; flex-direction: column; gap: 1.5rem; }
      .order-card { background-color: var(--bg-light); border-radius: 0.5rem; border: 1px solid var(--border-color); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 1.5rem; transition: box-shadow 0.3s ease; }
      .order-card:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07); }
      .order-card-header { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem; }
      @media (min-width: 768px) { .order-card-header { grid-template-columns: repeat(4, 1fr); } }
      .info-block-label { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
      .info-block-value { font-weight: 600; color: var(--text-dark); }
      .order-status-value { font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; display: inline-block; }
      .status-Scheduled { background-color: #DBEAFE; color: #1E40AF; }
      .status-Picked-Up, .status-Washing, .status-Out-for-Delivery { background-color: #FEF3C7; color: #92400E; }
      .status-Delivered { background-color: #D1FAE5; color: #065F46; }
      .status-Cancelled { background-color: #FEE2E2; color: #991B1B; }
      .centered-feedback { text-align: center; padding: 3rem; background-color: var(--bg-light); border-radius: 0.5rem; border: 1px solid var(--border-color); }
      .centered-feedback h3 { font-size: 1.5rem; margin-bottom: 1rem; }
      .centered-feedback p { color: #6b7280; margin-bottom: 1.5rem; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

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
        setOrders(data.orders || []); // ✅ fixed line
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
    <>
      <MyOrdersStyles />
      <div className="my-orders-container">
        <h1 className="my-orders-title">My Order History</h1>
        {renderContent()}
      </div>
    </>
  );
};

export default MyOrders;
