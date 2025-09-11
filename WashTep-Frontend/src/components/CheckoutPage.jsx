import React, { useState } from 'react';
import './CheckoutPage.css';
import { API_BASE } from "../config";

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
// 1. Add 'onSuccess' to the component's props
const CheckoutPage = ({ selectedService, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    garments: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 

    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      setIsSubmitting(false); 
      return;
    }
    if (formData.pincode.length !== 6 || !/^\d{6}$/.test(formData.pincode)) {
      alert('Please enter a valid 6-digit pincode.');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      service: {
        name: selectedService.name,
        price: selectedService.price,
      },
      ...formData,
    };
    
    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // --- THIS IS THE KEY CHANGE ---
        // Instead of alerting and going back, we now call the new 'onSuccess' function
        // and pass it the details needed for the confirmation page.
        onSuccess({
          orderId: result.order._id.slice(-6).toUpperCase(),
          fullName: result.order.fullName,
          serviceName: result.order.serviceName,
          phone: result.order.phone,
        });
      } else {
        alert(`Submission failed: ${result.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Could not connect to the server. Please make sure it is running and try again.');
    } finally {
      setIsSubmitting(false); 
    }
  };

  // The entire return statement (your form's JSX) remains exactly as you wrote it.
  return (
    <div className="checkout-container">
      <button className="back-button" onClick={onBack}>
        &larr; Back to Services
      </button>

      <div className="checkout-header">
        <h2>Schedule a Pickup</h2>
        <p>
          You've selected: <strong>{selectedService.name}</strong>
        </p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Contact Details</h4>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
              pattern="[0-9]{10}"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Pickup Address</h4>
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, Apt 4B"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Anytown"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g., 123456"
                required
                pattern="[0-9]{6}"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="garments">Approx. Number of Garments</label>
            <input
              type="number"
              id="garments"
              name="garments"
              value={formData.garments}
              onChange={handleChange}
              placeholder="e.g., 15"
              min="1"
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Payment Method</h4>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange}
              />
              <span> Cash on Delivery</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === 'online'}
                onChange={handleChange}
              />
              <span> Pay Online (UPI/Cards)</span>
            </label>
          </div>
        </div>
        
        <p className="final-price-note">
          Final price will be calculated at pickup based on weight.
        </p>
        
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Scheduling...' : 'Confirm Pickup'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;

