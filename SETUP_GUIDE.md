# 🚀 E-Commerce Setup Guide

Follow these steps to get your e-commerce application running locally.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL Service
Make sure MySQL is running on your system.

### 1.2 Create Database
Open MySQL command line or a GUI tool like MySQL Workbench and run:

```sql
CREATE DATABASE ecommerce_db;
```

### 1.3 Run Setup Script
Execute the database setup script:

```bash
# Option 1: Using MySQL command line
mysql -u root -p ecommerce_db < database/setup.sql

# Option 2: Copy and paste the contents of database/setup.sql into MySQL Workbench
```

This will create all necessary tables and insert sample data.

## ⚙️ Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd server
npm install
```

### 2.2 Configure Database Connection
Edit `server/config/db.js` and update your MySQL credentials:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'YOUR_MYSQL_PASSWORD', // Replace with your actual password
  database: 'ecommerce_db',
  // ... rest of config
};
```

### 2.3 Start Backend Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR production mode
npm start
```

The backend will run on **http://localhost:4000**

### 2.4 Test Backend
Visit http://localhost:4000/api/health to verify the server is running.

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd client
npm install
```

### 3.2 Start Frontend Server
```bash
npm run dev
```

The frontend will run on **http://localhost:3000**

## 🚀 Step 4: Quick Start (Both Servers)

From the root directory, you can start both servers simultaneously:

```bash
# Install all dependencies
npm run install-all

# Start both servers in development mode
npm run dev
```

## 🧪 Step 5: Test the Application

### 5.1 Demo Credentials
Use these credentials to test the login functionality:
- **Email**: demo@example.com
- **Password**: demo123

### 5.2 Test Flow
1. Visit http://localhost:3000
2. Browse products on the home page
3. Click on a product to view details
4. Add products to your cart
5. View your cart and update quantities
6. Register a new account or login with demo credentials
7. Complete the checkout process

## 🔧 Development Commands

### Backend (server/)
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Frontend (client/)
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Root Directory
```bash
npm run install-all  # Install dependencies for both client and server
npm run dev         # Start both servers in development mode
npm run server      # Start only backend server
npm run client      # Start only frontend server
```

## 📊 Database Schema

### Tables Created:
- **products**: Store product information
- **users**: Store user accounts
- **orders**: Store order information
- **order_items**: Store individual items in each order

### Sample Data Included:
- 8 sample products across different categories
- 3 demo users
- Sample orders and order items

## 🛡️ Security Notes

⚠️ **Important**: This is a demo application. For production use:

- Implement password hashing (bcrypt)
- Add JWT authentication
- Implement input validation and sanitization
- Add rate limiting
- Use HTTPS
- Add proper error logging
- Implement proper session management

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `server/config/db.js`
   - Ensure database `ecommerce_db` exists

2. **Port Already in Use**
   - Backend: Change port in `server/index.js` (default: 4000)
   - Frontend: Change port in `client/vite.config.js` (default: 3000)

3. **CORS Issues**
   - Ensure backend CORS is configured for frontend URL
   - Check proxy settings in `client/vite.config.js`

4. **Module Not Found**
   - Run `npm install` in both client and server directories
   - Clear node_modules and reinstall if needed

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure database is properly set up
4. Check that both servers are running

## 🎯 Next Steps

To extend this application, consider adding:
- User profile management
- Product reviews and ratings
- Order history and tracking
- Admin dashboard
- Payment gateway integration
- Email notifications
- Product categories management
- Inventory management
- Search filters and sorting
