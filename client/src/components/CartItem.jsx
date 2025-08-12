import React from 'react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border">
      {/* Product Image and Details */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-grow">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
            alt={item.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow min-w-0">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
            {item.name}
          </h3>

          {item.category && (
            <p className="text-xs sm:text-sm text-gray-600">
              Category: {item.category}
            </p>
          )}

          <p className="text-base sm:text-lg font-semibold text-primary-600 mt-1">
            ${item.price}
          </p>
        </div>
      </div>

      {/* Quantity Controls and Actions */}
      <div className="flex items-center justify-between sm:justify-end space-x-4">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
            {item.quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors p-2"
          title="Remove from cart"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
