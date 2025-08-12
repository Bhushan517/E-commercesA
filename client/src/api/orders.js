import api from './config';

// Order API functions
export const orderAPI = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch orders');
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch order');
    }
  },

  // Get orders by user ID
  getOrdersByUserId: async (userId) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user orders');
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create order');
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update order status');
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete order');
    }
  }
};
