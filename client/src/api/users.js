import api from './config';

// User API functions
export const userAPI = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user');
    }
  },

  // Register new user
  registerUser: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
      }

      return response.data;
    } catch (error) {
      // Handle detailed validation errors from backend
      if (error.response?.data?.details) {
        const validationErrors = error.response.data.details.map(detail => detail.msg).join(', ');
        throw new Error(validationErrors);
      }
      throw new Error(error.response?.data?.error || 'Failed to register user');
    }
  },

  // Login user
  loginUser: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
      }

      return response.data;
    } catch (error) {
      // Handle detailed validation errors from backend
      if (error.response?.data?.details) {
        const validationErrors = error.response.data.details.map(detail => detail.msg).join(', ');
        throw new Error(validationErrors);
      }
      throw new Error(error.response?.data?.error || 'Failed to login');
    }
  },

  // Logout user
  logoutUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get user profile data
  getUserProfile: () => {
    try {
      const profileData = localStorage.getItem('userProfile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      return null;
    }
  },

  // Save user profile data
  saveUserProfile: (profileData) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
    } catch (error) {
      console.error('Failed to save profile data:', error);
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      
      const currentUser = userAPI.getCurrentUser();
      if (currentUser && currentUser.id === parseInt(id)) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }
};
