import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../api/cart';
import { userAPI } from '../api/users';

// Cart context
const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_AUTH_STATUS: 'SET_AUTH_STATUS'
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  isLoggedIn: false,
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case CART_ACTIONS.SET_AUTH_STATUS:
      return { ...state, isLoggedIn: action.payload };

    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          error: null
        };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
        error: null
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload || [],
        loading: false,
        error: null
      };
    }
    
    default:
      return state;
  }
};



// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Check authentication status
  const checkAuthStatus = () => {
    const isLoggedIn = userAPI.isLoggedIn();
    dispatch({ type: CART_ACTIONS.SET_AUTH_STATUS, payload: isLoggedIn });
    return isLoggedIn;
  };

  // Load cart from localStorage (guests) or backend (logged-in users)
  const loadCart = async () => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const isLoggedIn = checkAuthStatus();

      if (isLoggedIn) {
        // Load from backend for logged-in users
        const response = await cartAPI.getCart();
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: response.data });
      } else {
        // Load from localStorage for guests
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
        } else {
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: [] });
        }
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });

      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
        } catch (parseError) {
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: [] });
        }
      } else {
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: [] });
      }
    }
  };

  // Sync cart from localStorage to backend (on login)
  const syncCartOnLogin = async () => {
    try {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const cartItems = JSON.parse(localCart);
        if (cartItems.length > 0) {
          await cartAPI.syncCart(cartItems);
          localStorage.removeItem('cart');
        }
      }
      await loadCart();
    } catch (error) {
      await loadCart();
    }
  };

  // Cart actions
  const addToCart = async (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const isLoggedIn = checkAuthStatus();

      if (isLoggedIn) {
        // Add to backend for logged-in users
        const response = await cartAPI.addToCart(product.id, quantity);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: response.data });
      } else {
        // Add to local state for guests
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      // Fallback to local state
      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
    }
  };

  const removeFromCart = async (productId) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const isLoggedIn = checkAuthStatus();

      if (isLoggedIn) {
        // Remove from backend for logged-in users
        const response = await cartAPI.removeFromCart(productId);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: response.data });
      } else {
        // Remove from local state for guests
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      // Fallback to local state
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const isLoggedIn = checkAuthStatus();

      if (isLoggedIn) {
        // Update in backend for logged-in users
        const response = await cartAPI.updateCartItem(productId, quantity);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: response.data });
      } else {
        // Update local state for guests
        dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      // Fallback to local state
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
    }
  };

  const clearCart = async () => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const isLoggedIn = checkAuthStatus();

      if (isLoggedIn) {
        // Clear backend cart for logged-in users
        await cartAPI.clearCart();
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
      } else {
        // Clear local state for guests
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
      }
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      // Fallback to local state
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  };

  // Cart calculations
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItem = (productId) => {
    return state.items.find(item => item.id === productId);
  };



  // Initialize cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save to localStorage for guests when cart changes
  useEffect(() => {
    if (!state.loading && !state.isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, state.loading, state.isLoggedIn]);

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    isLoggedIn: state.isLoggedIn,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    syncCartOnLogin,
    getTotalItems,
    getTotalPrice,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
