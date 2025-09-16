import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CheckoutPage from './components/CheckoutPage';
import ConfirmationPage from './components/ConfirmationPage';
import AuthPage from './components/AuthPage';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import MyOrders from './components/MyOrders';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
        //  THEME LOGIC 
        const [theme, setTheme] = useState(() => {
                return localStorage.getItem('theme') || 'light';
        });

        useEffect(() => {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
        }, [theme]);

        const toggleTheme = () => {
                setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        };


        const [currentPage, setCurrentPage] = useState('home');
        const [userInfo, setUserInfo] = useState(null);
        const [selectedService, setSelectedService] = useState(null);
        const [confirmedOrder, setConfirmedOrder] = useState(null);

        useEffect(() => {
                const storedUserInfo = localStorage.getItem('userInfo');
                if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
                const path = window.location.pathname;
                if (path === '/admin') setCurrentPage('admin');
        }, []);

        const handleLoginSuccess = (userData) => {
                localStorage.setItem('userInfo', JSON.stringify(userData));
                setUserInfo(userData);
                setCurrentPage('home');
        };
        const handleLogout = () => {
                localStorage.removeItem('userInfo');
                setUserInfo(null);
                setCurrentPage('home');
        };


        const navigateTo = (page) => {
                if ((page === 'checkout' || page === 'my-orders') && !userInfo) {
                        setCurrentPage('auth');
                } else {
                        setCurrentPage(page);
                }
                window.scrollTo(0, 0);
        };


        const handleServiceSelect = (service) => { setSelectedService(service); navigateTo('checkout'); };
        const handleOrderSuccess = (orderDetails) => { setConfirmedOrder(orderDetails); navigateTo('confirmation'); };
        const handleBackToHome = () => {
                setSelectedService(null);
                setConfirmedOrder(null);
                if (window.location.pathname === '/admin') {
                        window.history.pushState({}, '', '/');
                }
                navigateTo('home');
        };


        const renderPage = () => {
                switch (currentPage) {
                        case 'auth': return <AuthPage onLoginSuccess={handleLoginSuccess} />;
                        case 'checkout':
                                if (!userInfo) return <AuthPage onLoginSuccess={handleLoginSuccess} />;
                                return <CheckoutPage userInfo={userInfo} selectedService={selectedService} onBack={handleBackToHome} onSuccess={handleOrderSuccess} />;
                        case 'confirmation': return <ConfirmationPage orderDetails={confirmedOrder} onGoHome={handleBackToHome} />;
                        case 'admin': return <AdminPage />;

                        case 'my-orders':
                                if (!userInfo) return <AuthPage onLoginSuccess={handleLoginSuccess} />;

                                return <MyOrders userInfo={userInfo} navigateTo={navigateTo} />;
                        default: return <HomePage onServiceSelect={handleServiceSelect} />;
                }
        };


        return (
                <div className="app-container">

                        <Header
                                userInfo={userInfo}
                                onLogout={handleLogout}
                                onLoginClick={() => navigateTo('auth')}
                                onLogoClick={handleBackToHome}

                                onMyOrdersClick={() => navigateTo('my-orders')}
                                theme={theme}
                                toggleTheme={toggleTheme}
                        />

                        <main className="main-content">
                                {renderPage()}
                        </main>
                        <Footer />
                        <Chatbot userInfo={userInfo} />
                </div>
        );
}

export default App;

