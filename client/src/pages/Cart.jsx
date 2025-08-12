import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart ({getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''})
        </h1>
        
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-24">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({getTotalItems()})</span>
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {getTotalPrice() >= 50 ? 'Free' : '$9.99'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">
                  ${(
                    getTotalPrice() + 
                    (getTotalPrice() >= 50 ? 0 : 9.99) + 
                    (getTotalPrice() * 0.08)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {getTotalPrice() < 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  💡 Add ${(50 - getTotalPrice()).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3 text-lg"
              >
                Proceed to Checkout
              </button>
              
              <Link
                to="/products"
                className="block w-full text-center btn-secondary py-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
