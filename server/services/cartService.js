const { Cart, Product, User } = require('../models');

class CartService {
  // Get user's cart items
  static async getCartItems(userId) {
    try {
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'image', 'stock', 'category']
          }
        ],
        order: [['addedAt', 'DESC']]
      });

      // Transform to match frontend cart format
      return cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        image: item.product.image,
        stock: item.product.stock,
        category: item.product.category,
        quantity: item.quantity,
        addedAt: item.addedAt
      }));
    } catch (error) {
      throw new Error(`Failed to fetch cart items: ${error.message}`);
    }
  }

  // Add item to cart
  static async addToCart(userId, productId, quantity = 1) {
    try {
      // Validate product exists and has stock
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock. Only ${product.stock} items available`);
      }

      // Check if item already exists in cart
      const existingCartItem = await Cart.findOne({
        where: { userId, productId }
      });

      if (existingCartItem) {
        // Update quantity
        const newQuantity = existingCartItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          throw new Error(`Cannot add ${quantity} more items. Only ${product.stock - existingCartItem.quantity} more available`);
        }

        await existingCartItem.update({ 
          quantity: newQuantity,
          addedAt: new Date()
        });

        return await this.getCartItems(userId);
      } else {
        // Create new cart item
        await Cart.create({
          userId,
          productId,
          quantity
        });

        return await this.getCartItems(userId);
      }
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  // Update cart item quantity
  static async updateCartItem(userId, productId, quantity) {
    try {
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      // Validate product stock
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock. Only ${product.stock} items available`);
      }

      // Find cart item
      const cartItem = await Cart.findOne({
        where: { userId, productId }
      });

      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      // Update quantity
      await cartItem.update({ 
        quantity,
        addedAt: new Date()
      });

      return await this.getCartItems(userId);
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error.message}`);
    }
  }

  // Remove item from cart
  static async removeFromCart(userId, productId) {
    try {
      const cartItem = await Cart.findOne({
        where: { userId, productId }
      });

      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      await cartItem.destroy();
      return await this.getCartItems(userId);
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
  }

  // Clear entire cart
  static async clearCart(userId) {
    try {
      await Cart.destroy({
        where: { userId }
      });

      return { message: 'Cart cleared successfully' };
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  // Get cart summary (total items, total price)
  static async getCartSummary(userId) {
    try {
      const cartItems = await this.getCartItems(userId);
      
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        totalItems,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        itemCount: cartItems.length
      };
    } catch (error) {
      throw new Error(`Failed to get cart summary: ${error.message}`);
    }
  }

  // Sync cart from localStorage data (for login)
  static async syncCartFromLocalStorage(userId, localCartItems) {
    try {
      if (!localCartItems || localCartItems.length === 0) {
        return await this.getCartItems(userId);
      }

      // Get existing cart items
      const existingCartItems = await this.getCartItems(userId);
      const existingProductIds = existingCartItems.map(item => item.id);

      // Add items from localStorage that don't exist in database
      for (const localItem of localCartItems) {
        const existingItem = existingCartItems.find(item => item.id === localItem.id);
        
        if (existingItem) {
          // Update quantity to the higher value
          const maxQuantity = Math.max(existingItem.quantity, localItem.quantity);
          await this.updateCartItem(userId, localItem.id, maxQuantity);
        } else {
          // Add new item
          await this.addToCart(userId, localItem.id, localItem.quantity);
        }
      }

      return await this.getCartItems(userId);
    } catch (error) {
      // Return existing cart if sync fails
      return await this.getCartItems(userId);
    }
  }
}

module.exports = CartService;
