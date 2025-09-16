import React from 'react';
import './ConfirmationPage.css';

// svg bhi lana hai yaad rhe laadle
const SuccessIcon = () => (
  <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="success-icon__circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="success-icon__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </svg>
);

const ConfirmationPage = ({ orderDetails, onGoHome }) => {
  if (!orderDetails) {
    // security ka bhi 
    return (
      <div className="confirmation-container">
        <h2>Something went wrong.</h2>
        <button onClick={onGoHome} className="go-home-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <SuccessIcon />
      <h2 className="confirmation-title">Pickup Scheduled!</h2>
      <p className="confirmation-subtitle">
        Thank you, <strong>{orderDetails.fullName}</strong>. Your order has been successfully placed.
      </p>

      <div className="order-summary">
        <p>
          <strong>Order ID:</strong> #{orderDetails.orderId}
        </p>
        <p>
          <strong>Service:</strong> {orderDetails.serviceName}
        </p>
        <p>
          Our team will contact you shortly at <strong>{orderDetails.phone}</strong> to confirm the pickup details.
        </p>
      </div>

      <button onClick={onGoHome} className="go-home-button">
        Place Another Order
      </button>
    </div>
  );
};

export default ConfirmationPage;
