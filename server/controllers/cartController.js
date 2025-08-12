const CartService = require('../services/cartService');

class CartController {
  // GET /api/cart - Get user's cart items
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      const cartItems = await CartService.getCartItems(userId);
      
      res.json({
        success: true,
        data: cartItems,
        count: cartItems.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /api/cart/add - Add item to cart
  static async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
      }

      const cartItems = await CartService.addToCart(userId, productId, quantity);
      
      res.json({
        success: true,
        data: cartItems,
        message: 'Item added to cart successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('stock') ? 400 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // PUT /api/cart/update - Update cart item quantity
  static async updateCartItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Product ID and quantity are required'
        });
      }

      const cartItems = await CartService.updateCartItem(userId, productId, quantity);
      
      res.json({
        success: true,
        data: cartItems,
        message: 'Cart item updated successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('stock') || error.message.includes('Quantity') ? 400 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/cart/remove - Remove item from cart
  static async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
      }

      const cartItems = await CartService.removeFromCart(userId, productId);
      
      res.json({
        success: true,
        data: cartItems,
        message: 'Item removed from cart successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  }

  // DELETE /api/cart/clear - Clear entire cart
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await CartService.clearCart(userId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // GET /api/cart/summary - Get cart summary
  static async getCartSummary(req, res) {
    try {
      const userId = req.user.id;
      const summary = await CartService.getCartSummary(userId);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // POST /api/cart/sync - Sync cart from localStorage
  static async syncCart(req, res) {
    try {
      const userId = req.user.id;
      const { cartItems } = req.body;

      const syncedCartItems = await CartService.syncCartFromLocalStorage(userId, cartItems);
      
      res.json({
        success: true,
        data: syncedCartItems,
        message: 'Cart synced successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CartController;
