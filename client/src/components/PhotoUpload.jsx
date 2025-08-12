import React, { useState, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../api/users';

const PhotoUpload = ({ currentPhoto, onPhotoChange, isEditing = false, autoSave = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentPhoto);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { success, error } = useToast();

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return false;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      error('Image size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for storage (in a real app, you'd upload to a server)
      const base64 = await convertToBase64(file);
      
      // Call parent component's handler
      onPhotoChange(base64);

      // Only show success toast if not auto-saving (parent will handle the message)
      if (!autoSave) {
        success('Profile photo updated successfully!');
      }
    } catch (err) {
      error('Failed to upload photo. Please try again.');
      console.error('Photo upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!isEditing) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    success('Profile photo removed successfully!');
  };

  const getInitials = () => {
    const currentUser = userAPI.getCurrentUser();
    const name = currentUser?.name || 'User';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo Display/Upload Area */}
      <div
        className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Main Photo Container */}
        <div
          className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
            dragActive && isEditing
              ? 'border-primary-500 border-dashed bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          } ${uploading ? 'opacity-50' : ''}`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        {isEditing && (
          <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-300 ${
            !preview ? 'opacity-70 group-hover:opacity-90' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className="text-center text-white">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              ) : (
                <>
                  <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xs font-medium">
                    {preview ? 'Change' : 'Add Photo'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Drag & Drop Indicator */}
        {dragActive && isEditing && (
          <div className="absolute inset-0 bg-primary-500 bg-opacity-20 rounded-full border-2 border-primary-500 border-dashed flex items-center justify-center">
            <div className="text-center text-primary-700">
              <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs font-medium">Drop photo here</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex space-x-2">
          <button
            onClick={handleClick}
            disabled={uploading}
            className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
          >
            {preview ? 'Change Photo' : 'Upload Photo'}
          </button>
          {preview && (
            <button
              onClick={handleRemovePhoto}
              disabled={uploading}
              className="text-red-600 hover:text-red-700 text-sm px-3 py-1 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {/* Upload Instructions */}
      {isEditing && !uploading && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {preview ? 'Drag & drop or click to change' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-400">
            JPEG, PNG, WebP • Max 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
