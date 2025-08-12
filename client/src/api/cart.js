import api from './config';

// Cart API functions
export const cartAPI = {
  // Get user's cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch cart');
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add item to cart');
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put('/cart/update', { productId, quantity });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update cart item');
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const response = await api.delete('/cart/remove', { data: { productId } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove item from cart');
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to clear cart');
    }
  },

  // Get cart summary
  getCartSummary: async () => {
    try {
      const response = await api.get('/cart/summary');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get cart summary');
    }
  },

  // Sync cart from localStorage
  syncCart: async (cartItems) => {
    try {
      const response = await api.post('/cart/sync', { cartItems });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to sync cart');
    }
  }
};
