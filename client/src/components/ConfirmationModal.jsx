import React, { useEffect } from 'react';
import { useConfirmation } from '../context/ConfirmationContext';

const ConfirmationModal = () => {
  const { confirmation, hideConfirmation } = useConfirmation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && confirmation) {
        confirmation.onCancel();
      }
    };

    if (confirmation) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [confirmation]);

  if (!confirmation) return null;

  const getIcon = () => {
    const iconClass = "w-12 h-12 mx-auto mb-4";
    
    switch (confirmation.type) {
      case 'danger':
        return (
          <div className={`${iconClass} bg-red-100 rounded-full flex items-center justify-center`}>
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className={`${iconClass} bg-yellow-100 rounded-full flex items-center justify-center`}>
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className={`${iconClass} bg-blue-100 rounded-full flex items-center justify-center`}>
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getButtonStyles = () => {
    switch (confirmation.type) {
      case 'danger':
        return {
          confirm: "bg-red-600 hover:bg-red-700 text-white",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-800"
        };
      case 'warning':
        return {
          confirm: "bg-yellow-600 hover:bg-yellow-700 text-white",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-800"
        };
      case 'info':
      default:
        return {
          confirm: "bg-primary-600 hover:bg-primary-700 text-white",
          cancel: "bg-gray-200 hover:bg-gray-300 text-gray-800"
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={confirmation.onCancel}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* Close button */}
          <button
            onClick={confirmation.onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            {getIcon()}
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {confirmation.title || 'Confirm Action'}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {confirmation.message || 'Are you sure you want to proceed?'}
            </p>

            {/* Buttons */}
            <div className="flex space-x-3 justify-center">
              <button
                onClick={confirmation.onCancel}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonStyles.cancel}`}
              >
                {confirmation.cancelText || 'Cancel'}
              </button>
              <button
                onClick={confirmation.onConfirm}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${buttonStyles.confirm}`}
              >
                {confirmation.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
