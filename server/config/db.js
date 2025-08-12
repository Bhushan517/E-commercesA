const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce_db', 'root', 'bhushan098', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, 
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true, 
    underscored: false,
    freezeTableName: true 
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully with Sequelize');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Sync database (create tables)
const syncDatabase = async () => {
  try {
    // Import all models to register them
    require('../models/User');
    require('../models/Product');
    require('../models/Order');
    require('../models/OrderItem');

    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection, syncDatabase };
