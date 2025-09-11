import React from 'react';
import './HomePage.css';

// --- Service Data ---
// You can easily add or remove services here.
const services = [
  { 
    id: 'wash-fold', 
    name: 'Wash & Fold', 
    description: 'Your everyday clothes are washed, dried, and neatly folded.',
    imgSrc: '/images/wash-fold.jpg' // Add your image path here, e.g., '/images/wash-fold.png'
  },
  { 
    id: 'wash-iron', 
    name: 'Wash & Iron', 
    description: 'A perfect wash followed by professional, crisp ironing.',
    imgSrc: '/images/wash-iron.jpg' 
  },
  { 
    id: 'dry-clean', 
    name: 'Dry Cleaning', 
    description: 'Specialized care for your delicate and valuable garments.',
    imgSrc: '/images/Dry-Cleaning.jpg' 
  },
  { 
    id: 'ironing', 
    name: 'Ironing Only', 
    description: 'Get rid of wrinkles and get fresh, ready-to-wear clothes.',
    imgSrc: '/images/iron.jpeg' 
  },
  { 
    id: 'premium', 
    name: 'Premium Laundry', 
    description: 'Top-tier service with special detergents and fabric softeners.',
    imgSrc: '/images/premium.jpg' 
  },
    { 
    id: 'shoe-cleaning', 
    name: 'Shoe Cleaning', 
    description: 'Revitalize your footwear with our professional cleaning.',
    imgSrc: '/images/shoe-clean.jpeg' 
  },
];

// The HomePage component receives a function `onServiceSelect` as a prop from App.jsx
const HomePage = ({ onServiceSelect }) => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src="/images/nowIn.png" alt="Now in Jaipur"  />
      </header>

      {/* This is the service menu, styled like an e-commerce grid */}
      <div className="service-grid">
        {services.map(service => (
          // When a card is clicked, it calls the function passed from App.jsx
          <div key={service.id} className="service-card" onClick={() => onServiceSelect(service)}>
            <div className="service-image-placeholder">
              {/* As a coder, you will put your image source in the imgSrc property above.
                The alt text is generated dynamically for accessibility.
              */}
              <img src={service.imgSrc} alt={`${service.name} illustration`} />
            </div>
            <div className="service-card-content">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
