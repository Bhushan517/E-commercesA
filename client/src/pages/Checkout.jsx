import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { userAPI } from '../api/users';
import { orderAPI } from '../api/orders';

const Checkout = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const currentUser = userAPI.getCurrentUser();
  const isLoggedIn = userAPI.isLoggedIn();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });

  // Payment form state (simulation)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const shippingCost = getTotalPrice() >= 50 ? 0 : 9.99;
  const tax = getTotalPrice() * 0.08;
  const totalAmount = getTotalPrice() + shippingCost + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const requiredShipping = ['fullName', 'email', 'address', 'city', 'zipCode'];
    const requiredPayment = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];

    for (const field of requiredShipping) {
      if (!shippingInfo[field].trim()) {
        throw new Error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
      }
    }

    for (const field of requiredPayment) {
      if (!paymentInfo[field].trim()) {
        throw new Error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      throw new Error('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setError('Please login to place an order');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate form
      validateForm();

      // Prepare order data
      const orderData = {
        user_id: currentUser.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      // Create order
      const response = await orderAPI.createOrder(orderData);
      
      if (response.success) {
        setSuccess(true);
        clearCart();
        
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login to Checkout
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to place an order.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="btn-secondary"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart before checking out.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  // Success message
  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h2>
          
          <p className="text-gray-600 mb-8">
            Thank you for your order. You will receive a confirmation email shortly.
            <br />
            Redirecting to home page in 3 seconds...
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-6 lg:space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Shipping Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="input-field text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment Information</h2>
              <p className="text-sm text-gray-600 mb-4">
                💡 This is a demo - use any test values
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    className="input-field text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    className="input-field text-base"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-grow min-w-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={item.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="min-w-0 flex-grow">
                        <p className="font-medium text-xs sm:text-sm truncate">{item.name}</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-sm sm:text-base ml-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="mb-4" />

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {loading ? 'Processing...' : `Place Order - $${totalAmount.toFixed(2)}`}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By placing this order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
