import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { userAPI } from '../api/users';
import { cartAPI } from '../api/cart';
import { orderAPI } from '../api/orders';
import { useToast } from '../context/ToastContext';
import PhotoUpload from '../components/PhotoUpload';

const Profile = () => {
  const { success: showSuccess, error: showError } = useToast();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [stats, setStats] = useState({ orders: 0, cartItems: 0, wishlist: 0 });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    bio: '',
    avatar: '',
    preferences: {
      theme: 'light',
      notifications: true,
      newsletter: false,
      language: 'en'
    }
  });

  useEffect(() => {
    loadUserData();
    loadUserStats();

    // Check URL parameters for tab
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['personal', 'orders', 'history', 'security', 'preferences'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'history') {
      loadUserOrders();
    }
  }, [activeTab]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = userAPI.getCurrentUser();
      setUser(currentUser);

      // Load saved profile data from localStorage first
      const savedProfile = userAPI.getUserProfile();

      // Load profile data from backend
      const response = await fetch('http://localhost:4000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      let profileData = null;
      if (response.ok) {
        const backendProfile = await response.json();
        profileData = backendProfile.data;
      }

      // Merge saved profile data with backend data (prioritize saved data for avatar)
      const mergedProfile = {
        firstName: profileData?.firstName || savedProfile?.firstName || '',
        lastName: profileData?.lastName || savedProfile?.lastName || '',
        phone: profileData?.phone || savedProfile?.phone || '',
        address: profileData?.address || savedProfile?.address || '',
        dateOfBirth: profileData?.dateOfBirth || savedProfile?.dateOfBirth || '',
        bio: profileData?.bio || savedProfile?.bio || '',
        avatar: savedProfile?.avatar || profileData?.avatar || '', // Prioritize saved avatar
        preferences: profileData?.preferences || savedProfile?.preferences || {
          theme: 'light',
          notifications: true,
          newsletter: false,
          language: 'en'
        }
      };

      setProfile(mergedProfile);
      setFormData(mergedProfile);
    } catch (error) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const currentUser = userAPI.getCurrentUser();
      if (!currentUser) return;

      // Load cart stats
      const cartResponse = await cartAPI.getCartSummary();

      // Load orders count
      let ordersCount = 0;
      try {
        const ordersResponse = await orderAPI.getOrdersByUserId(currentUser.id);
        ordersCount = ordersResponse.count || 0;
      } catch (error) {
        console.error('Failed to load orders count:', error);
      }

      setStats(prev => ({
        ...prev,
        orders: ordersCount,
        cartItems: cartResponse.data.totalItems || 0
      }));
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const currentUser = userAPI.getCurrentUser();
      if (!currentUser) return;

      const response = await orderAPI.getOrdersByUserId(currentUser.id);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showError('Failed to load your orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Clean the form data before sending
      const cleanedFormData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
        phone: formData.phone || '',
        address: formData.address || '',
        bio: formData.bio || ''
      };

      const response = await fetch('http://localhost:4000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cleanedFormData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile.data);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        showSuccess('Your profile has been updated successfully!');

        // Save profile data locally for avatar display
        userAPI.saveUserProfile(formData);

        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Profile save error:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message);
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset form data
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '',
        preferences: profile.preferences || {
          theme: 'light',
          notifications: true,
          newsletter: false,
          language: 'en'
        }
      });
    }
  };

  const handlePhotoChange = async (photoData) => {
    // Update form data
    const updatedFormData = {
      ...formData,
      avatar: photoData
    };
    setFormData(updatedFormData);

    // If not in editing mode (i.e., first time upload), save immediately
    if (!isEditing) {
      try {
        setSaving(true);
        setError(null);

        // Clean the data before sending
        const cleanedData = {
          firstName: updatedFormData.firstName || '',
          lastName: updatedFormData.lastName || '',
          phone: updatedFormData.phone || '',
          address: updatedFormData.address || '',
          dateOfBirth: updatedFormData.dateOfBirth || null,
          bio: updatedFormData.bio || '',
          avatar: updatedFormData.avatar || null,
          preferences: updatedFormData.preferences || {
            theme: 'light',
            notifications: true,
            newsletter: false,
            language: 'en'
          }
        };

        // Remove empty strings and replace with null for optional fields
        if (!cleanedData.dateOfBirth || cleanedData.dateOfBirth === '') {
          cleanedData.dateOfBirth = null;
        }
        if (!cleanedData.phone || cleanedData.phone === '') {
          cleanedData.phone = '';
        }

        console.log('Sending profile data:', cleanedData);

        const response = await fetch('http://localhost:4000/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(cleanedData)
        });

        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile.data);

          // Save profile data locally for avatar display
          userAPI.saveUserProfile(updatedFormData);

          showSuccess('Profile photo uploaded successfully!');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Profile update error:', errorData);
          console.error('Validation details:', errorData.details);
          throw new Error(errorData.error || 'Failed to save profile photo');
        }
      } catch (error) {
        setError(error.message);
        showError(error.message);
        // Revert the photo change on error
        setFormData(prev => ({
          ...prev,
          avatar: formData.avatar
        }));
      } finally {
        setSaving(false);
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <PhotoUpload
                  currentPhoto={formData.avatar}
                  onPhotoChange={handlePhotoChange}
                  isEditing={isEditing || !formData.avatar} // Allow upload if no photo exists
                  autoSave={!isEditing && !formData.avatar} // Auto-save when uploading first photo
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {formData.firstName && formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}` 
                    : user?.name || 'User'}
                </h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                {formData.bio && (
                  <p className="text-gray-700 mt-2 max-w-md">{formData.bio}</p>
                )}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.cartItems}</div>
                    <div className="text-sm text-gray-600">Cart Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.orders}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{stats.wishlist}</div>
                    <div className="text-sm text-gray-600">Wishlist</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'personal', name: 'Personal Info', icon: 'user' },
                { id: 'orders', name: 'My Orders', icon: 'shopping-bag' },
                { id: 'history', name: 'Order History', icon: 'clock' },
                { id: 'security', name: 'Security', icon: 'shield' },
                { id: 'preferences', name: 'Preferences', icon: 'cog' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.firstName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.lastName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-field"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.address || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
                      placeholder="Tell us about yourself"
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{formData.bio || 'Not provided'}</p>
                  )}
                  {isEditing && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                    </div>
                    <button className="btn-secondary">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <button className="btn-primary">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Login Sessions</h4>
                      <p className="text-sm text-gray-600">Manage your active sessions</p>
                    </div>
                    <button className="btn-secondary">
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                  <p className="text-sm text-gray-600">
                    {stats.orders} total order{stats.orders !== 1 ? 's' : ''}
                  </p>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                    <p className="text-gray-600 mb-6">When you place orders, they'll appear here.</p>
                    <button
                      onClick={() => window.location.href = '/products'}
                      className="btn-primary"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.filter(order => order.status === 'pending' || order.status === 'shipped').map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${parseFloat(order.totalPrice).toFixed(2)}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="space-y-2">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3">
                                {item.product?.image && (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.product?.name || 'Product'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity} × ${parseFloat(item.product?.price || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                  <p className="text-sm text-gray-600">
                    All your past orders
                  </p>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No order history</h4>
                    <p className="text-gray-600 mb-6">Your completed orders will appear here.</p>
                    <button
                      onClick={() => window.location.href = '/products'}
                      className="btn-primary"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${parseFloat(order.totalPrice).toFixed(2)}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Items ({order.orderItems.length}):
                            </p>
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded p-2">
                                {item.product?.image && (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.product?.name || 'Product'}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Quantity: {item.quantity} × ${parseFloat(item.product?.price || 0).toFixed(2)} = ${(item.quantity * parseFloat(item.product?.price || 0)).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about your orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={formData.preferences.notifications}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Newsletter</h4>
                      <p className="text-sm text-gray-600">Get the latest news and offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.newsletter"
                        checked={formData.preferences.newsletter}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    {isEditing ? (
                      <select
                        name="preferences.theme"
                        value={formData.preferences.theme}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2 capitalize">{formData.preferences.theme}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    {isEditing ? (
                      <select
                        name="preferences.language"
                        value={formData.preferences.language}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">
                        {formData.preferences.language === 'en' && 'English'}
                        {formData.preferences.language === 'es' && 'Spanish'}
                        {formData.preferences.language === 'fr' && 'French'}
                        {formData.preferences.language === 'de' && 'German'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
