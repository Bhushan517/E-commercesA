const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, syncDatabase } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userDataRoutes = require('./routes/userDataRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Security middleware
const { securityHeaders, sanitizeInput, logFailedAuth } = require('./middleware/security');

// Import models to register relationships
require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(securityHeaders);
app.use(logFailedAuth);

// CORS configuration - Allow all methods and headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  if (req.method === 'PUT' && req.path === '/api/profile') {
    console.log('PUT /api/profile request body:', req.body);
    console.log('Authorization header:', req.headers.authorization);
  }
  next();
});

// Input sanitization
app.use(sanitizeInput);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user-data', userDataRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/cart', cartRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'E-commerce API is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Starting E-commerce API server...');

    // Test database connection
    await testConnection();

    // Sync database models (create/update tables)
    await syncDatabase();

    // Seed sample data if tables are empty
    await seedSampleData();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Documentation: Check README.md for endpoints`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Seed sample data
const seedSampleData = async () => {
  try {
    const { User, Product } = require('./models');

    // Check if data already exists
    const userCount = await User.count();
    const productCount = await Product.count();

    if (userCount === 0) {
      console.log('📝 Seeding sample users...');
      await User.bulkCreate([
        { name: 'Demo User', email: 'demo@example.com', password: 'demo123' },
        { name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' }
      ]);
    }

    if (productCount === 0) {
      console.log('📝 Seeding sample products...');
      await Product.bulkCreate([
        {
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 99.99,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          stock: 50
        },
        {
          name: 'Smartphone',
          description: 'Latest smartphone with advanced camera and long battery life',
          price: 699.99,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
          stock: 25
        },
        {
          name: 'Running Shoes',
          description: 'Comfortable running shoes for daily exercise',
          price: 79.99,
          category: 'Sports',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
          stock: 100
        },
        {
          name: 'Coffee Maker',
          description: 'Automatic coffee maker with programmable timer',
          price: 149.99,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
          stock: 30
        },
        {
          name: 'Backpack',
          description: 'Durable backpack perfect for travel and daily use',
          price: 49.99,
          category: 'Fashion',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
          stock: 75
        },
        {
          name: 'Desk Lamp',
          description: 'Modern LED desk lamp with adjustable brightness',
          price: 39.99,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          stock: 60
        }
      ]);
    }

    console.log('✅ Sample data ready');
  } catch (error) {
    console.error('⚠️ Failed to seed sample data:', error.message);
    // Don't exit - server can still run without sample data
  }
};

startServer();
