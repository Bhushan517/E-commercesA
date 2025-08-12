import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/orders';
import { userAPI } from '../api/users';
import { useToast } from '../context/ToastContext';

const Orders = () => {
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    // Check if user is logged in
    if (!userAPI.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const currentUser = userAPI.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      const response = await orderAPI.getOrdersByUserId(currentUser.id);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showError('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(order => order.status === 'pending' || order.status === 'shipped');
  const completedOrders = orders.filter(order => order.status === 'delivered');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'active', name: `Active Orders (${activeOrders.length})`, count: activeOrders.length },
              { id: 'completed', name: `Order History (${completedOrders.length})`, count: completedOrders.length }
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
          {/* Active Orders Tab */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {activeOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
                  <p className="text-gray-600 mb-6">When you place orders, they'll appear here.</p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${parseFloat(order.totalPrice).toFixed(2)}</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
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
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Items:</h4>
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 bg-white rounded p-3">
                              {item.product?.image && (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.product?.name || 'Product'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} × ${parseFloat(item.product?.price || 0).toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ${(item.quantity * parseFloat(item.product?.price || 0)).toFixed(2)}
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

          {/* Completed Orders Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              {completedOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed orders</h3>
                  <p className="text-gray-600 mb-6">Your delivered orders will appear here.</p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Delivered on {new Date(order.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${parseFloat(order.totalPrice).toFixed(2)}</p>
                          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                            Delivered
                          </span>
                        </div>
                      </div>
                      
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Items ({order.orderItems.length}):</h4>
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded p-3">
                              {item.product?.image && (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.product?.name || 'Product'}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} × ${parseFloat(item.product?.price || 0).toFixed(2)} = ${(item.quantity * parseFloat(item.product?.price || 0)).toFixed(2)}
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
        </div>
      </div>
    </div>
  );
};

export default Orders;
