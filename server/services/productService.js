const { Product } = require('../models');
const { Op } = require('sequelize');

class ProductService {
  // Get all products
  static async getAllProducts() {
    try {
      const products = await Product.findAll({
        order: [['id', 'DESC']]
      });
      return products;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid product ID');
      }

      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  // Create new product
  static async createProduct(productData) {
    try {
      // Sequelize will handle validation based on model definition
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  // Update product
  static async updateProduct(id, productData) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid product ID');
      }

      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }

      // Update product (Sequelize will handle validation)
      await product.update(productData);
      return product;
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid product ID');
      }

      const product = await Product.findByPk(id);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.destroy();
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  // Get products by category
  static async getProductsByCategory(category) {
    try {
      if (!category) {
        throw new Error('Category is required');
      }

      const products = await Product.findAll({
        where: { category },
        order: [['id', 'DESC']]
      });

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }
  }

  // Search products
  static async searchProducts(searchTerm) {
    try {
      if (!searchTerm) {
        throw new Error('Search term is required');
      }

      const products = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        order: [['id', 'DESC']]
      });

      return products;
    } catch (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }
}

module.exports = ProductService;
