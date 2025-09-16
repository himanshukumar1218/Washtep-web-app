// WashTep-Frontend/src/components/Header.jsx

import React, { useState } from 'react';
import './Header.css';
import ThemeToggleButton from './ThemeToggleButton';

// --- ICONS (No changes here) ---
const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="orders-icon">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
// --- ADDED: Close Icon ---
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


const Header = ({ userInfo, onLogout, onLoginClick, onLogoClick, onMyOrdersClick, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <div className="logo" onClick={onLogoClick}>
            <img src="/images/logo.png" alt="WashTep Logo" />
          </div>

          <button className="mobile-nav-toggle" onClick={toggleMobileMenu}>
            <HamburgerIcon />
          </button>

          {/* This nav is for desktop */}
          <nav className="main-nav desktop-nav">
             {userInfo ? (
              <>
                <button className="nav-button orders-button" onClick={onMyOrdersClick}>
                  <OrdersIcon />
                  <span>My Orders</span>
                </button>
                <div className="profile-icon">{userInfo.name.charAt(0)}</div>
                <button onClick={onLogout} className="nav-button logout-button">Logout</button>
              </>
            ) : (
              <button className="nav-button login-button" onClick={onLoginClick}>Login</button>
            )}
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          </nav>
        </div>
      </header>

      {/* --- ADDED: Overlay and Mobile-Specific Nav --- */}
      <div className={`nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
      
      <nav className={`main-nav mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <button className="nav-close-button" onClick={toggleMobileMenu}>
          <CloseIcon />
        </button>
        {userInfo ? (
          <>
            <button className="nav-button orders-button" onClick={onMyOrdersClick}>
              <OrdersIcon />
              <span>My Orders</span>
            </button>
            <div className="profile-icon">{userInfo.name.charAt(0)}</div>
            <button onClick={onLogout} className="nav-button logout-button">Logout</button>
          </>
        ) : (
          <button className="nav-button login-button" onClick={onLoginClick}>Login</button>
        )}
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </nav>
    </>
  );
};

export default Header;