import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState(null);

  const showConfirmation = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmation({
        ...options,
        onConfirm: () => {
          setConfirmation(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmation(null);
          resolve(false);
        }
      });
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  // Convenience methods for common confirmations
  const confirmDelete = useCallback((itemName = 'this item') => {
    return showConfirmation({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
  }, [showConfirmation]);

  const confirmLogout = useCallback(() => {
    return showConfirmation({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout? You will need to login again to access your account.',
      confirmText: 'Logout',
      cancelText: 'Stay Logged In',
      type: 'warning'
    });
  }, [showConfirmation]);

  const confirmClearCart = useCallback(() => {
    return showConfirmation({
      title: 'Clear Cart',
      message: 'Are you sure you want to remove all items from your cart? This action cannot be undone.',
      confirmText: 'Clear Cart',
      cancelText: 'Keep Items',
      type: 'warning'
    });
  }, [showConfirmation]);

  const value = {
    confirmation,
    showConfirmation,
    hideConfirmation,
    confirmDelete,
    confirmLogout,
    confirmClearCart
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
    </ConfirmationContext.Provider>
  );
};
