import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, getCartItem } = useCart();
  const cartItem = getCartItem(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addToCart(product, 1);
  };

  return (
    <div className="card overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="flex-grow flex flex-col">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="h-40 sm:h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          />
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex-grow flex flex-col">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-600">
              ${product.price}
            </span>

            {product.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 self-start sm:self-auto">
                {product.category}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="mb-3">
            {product.stock > 0 ? (
              <span className="text-xs sm:text-sm text-green-600">
                ✅ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-red-600">
                ❌ Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-3 sm:p-4 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : cartItem
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'btn-primary'
          }`}
        >
          {product.stock === 0
            ? 'Out of Stock'
            : cartItem
            ? `In Cart (${cartItem.quantity})`
            : 'Add to Cart'
          }
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
