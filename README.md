# E-Commerce Website

A complete full-stack e-commerce application built with React (Vite) frontend and Node.js (Express) + MySQL backend.

## 🚀 Features

### Frontend (React + Vite)
- **Product Catalog**: Browse and search products with category filtering
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add/remove items, update quantities with persistent storage
- **User Authentication**: Register and login functionality
- **Checkout Process**: Complete order placement simulation
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for products, users, and orders
- **MySQL Database**: Structured data storage with proper relationships
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 📁 Project Structure

```
ecommerce/
├── client/                 # React Vite frontend
│   ├── src/
│   │   ├── api/           # API functions
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Cart)
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # HTTP request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── package.json
│   └── index.js         # Server entry point
└── database/
    └── setup.sql        # Database setup script
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Database Setup
1. Install and start MySQL
2. Create a new database:
   ```sql
   CREATE DATABASE ecommerce_db;
   ```
3. Run the setup script:
   ```bash
   mysql -u root -p ecommerce_db < database/setup.sql
   ```

### 2. Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update database credentials in `config/db.js`:
   ```javascript
   const dbConfig = {
     host: 'localhost',
     user: 'root',
     password: 'your_mysql_password', // Update this
     database: 'ecommerce_db',
     // ... other config
   };
   ```

4. Start the server:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   Server will run on http://localhost:4000

### 3. Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on http://localhost:3000

## 🔗 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:term` - Search products

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/user/:userId` - Get orders by user
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## 🧪 Testing the Application

### Demo Credentials
- **Email**: demo@example.com
- **Password**: demo123

### Test Flow
1. Start both backend and frontend servers
2. Visit http://localhost:3000
3. Browse products on the home page
4. Add products to cart
5. Register a new account or login with demo credentials
6. Complete the checkout process

## 🔧 Development Notes

### Backend Architecture
- **Models**: Handle database operations with SQL queries
- **Services**: Contain business logic and validation
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Map endpoints to controller methods

### Frontend Architecture
- **Context API**: Used for cart state management
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework

### Security Notes
⚠️ **Important**: This is a demo application. For production use:
- Implement proper password hashing (bcrypt)
- Add JWT authentication
- Implement input sanitization
- Add rate limiting
- Use HTTPS
- Validate and sanitize all inputs
- Add proper error logging

## 📝 License

This project is for educational purposes. Feel free to use and modify as needed.
