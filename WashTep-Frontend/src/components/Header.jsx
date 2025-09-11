import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import ThemeToggleButton from './ThemeToggleButton';

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="orders-icon">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

// --- UPDATED ---
// Added onMyOrdersClick to the list of props the component accepts
const Header = ({ userInfo, onLogout, onLoginClick, onLogoClick, onMyOrdersClick, theme, toggleTheme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // The local handleMyOrders function is no longer needed

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo" onClick={onLogoClick}>
          <img src="/images/logo.png" alt="WashTep Logo" />
        </div>
        <nav className="main-nav">
          {userInfo ? (
            <> {/* Use a fragment to group multiple elements */}
              {/* --- UPDATED --- 
                  This button now correctly calls the onMyOrdersClick function from App.jsx */}
              <button className="nav-button orders-button" onClick={onMyOrdersClick}>
                <OrdersIcon />
                <span>My Orders</span>
              </button>

              <div className="profile-menu-container" ref={dropdownRef}>
                <button className="profile-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {userInfo.name.charAt(0)}
                </button>
                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{userInfo.name}</div>
                      <div className="dropdown-user-email">{userInfo.email}</div>
                    </div>
                    <button onClick={onLogout} className="dropdown-item logout-button">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="nav-button login-button" onClick={onLoginClick}>Login</button>
          )}
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </nav>
      </div>
    </header>
  );
};

export default Header;

