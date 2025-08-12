// Import all models
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const UserData = require('./UserData');
const UserProfile = require('./UserProfile');
const Cart = require('./Cart');

// Define model relationships

// User and Order relationships
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Order and OrderItem relationships
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Product and OrderItem relationships
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// User and UserProfile relationships (One-to-One)
User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onDelete: 'CASCADE'
});

UserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User and UserData relationships (One-to-Many)
User.hasMany(UserData, {
  foreignKey: 'userId',
  as: 'userData',
  onDelete: 'CASCADE'
});

UserData.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User and Cart relationships (One-to-Many)
User.hasMany(Cart, {
  foreignKey: 'userId',
  as: 'cartItems',
  onDelete: 'CASCADE'
});

Cart.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Product and Cart relationships (One-to-Many)
Product.hasMany(Cart, {
  foreignKey: 'productId',
  as: 'cartItems',
  onDelete: 'CASCADE'
});

Cart.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Export all models
module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  UserData,
  UserProfile,
  Cart
};
