import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmationProvider } from './context/ConfirmationContext';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import ConfirmationModal from './components/ConfirmationModal';

// Import pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

function App() {
  return (
    <ToastProvider>
      <ConfirmationProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Components */}
            <ToastContainer />
            <ConfirmationModal />
          </div>
        </CartProvider>
      </ConfirmationProvider>
    </ToastProvider>
  );
}

export default App;
