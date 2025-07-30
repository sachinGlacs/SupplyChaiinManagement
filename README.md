# SIPP - Supply Chain Management System

A comprehensive full-stack supply chain management system built with React frontend and Node.js/Express backend, featuring real-time updates, automated order processing, and comprehensive analytics.

![SIPP Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-orange)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-red)

## 🚀 Features

### Core Functionality
- **🔐 Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- **📦 Inventory Management** - Add, edit, delete, and track inventory items with real-time updates
- **📋 Order Management** - Complete order lifecycle from creation to delivery
- **🤖 Automated Processing** - Auto-shipping and auto-delivery based on time and delivery dates
- **📊 Real-time Analytics** - Live dashboard with charts and KPIs
- **📈 History Tracking** - Comprehensive audit trail of all system actions

### Advanced Features
- **⚡ Real-time Updates** - Socket.IO integration for live data synchronization
- **📱 Responsive Design** - Modern dark theme with mobile-friendly interface
- **📊 Data Visualization** - Interactive charts using ECharts
- **🔄 Auto Status Updates** - Scheduled cron jobs for order processing
- **🔒 Data Security** - User-specific data isolation and protected routes

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks

### Frontend
- **React 18** - UI framework
- **React Router v7** - Client-side routing
- **ECharts** - Data visualization
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SIPP-Project
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### Root Dependencies
```bash
cd ..
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/supplychain

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (Linux/Mac)
sudo systemctl start mongod

# Or on Windows
net start MongoDB
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Application

```bash
cd frontend
npm start
```

The React application will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📖 Usage Guide

### 1. Authentication

#### Register a New Account
- Navigate to the signup page
- Enter your email and password
- Click "Sign Up" to create your account

#### Login
- Enter your registered email and password
- Click "Login" to access the dashboard

### 2. Dashboard

The dashboard provides an overview of your supply chain operations:

- **KPI Cards**: Total inventory, orders, delivered orders, and item count
- **Inventory Chart**: Visual representation of inventory levels
- **Order Status Chart**: Distribution of order statuses
- **Order Trends**: Line chart showing order patterns over time
- **Inventory Grid**: Visual cards showing all inventory items

### 3. Inventory Management

#### Adding Inventory Items
1. Navigate to the "Inventory" page
2. Fill in the form with:
   - **Name**: Product name
   - **Quantity**: Available stock
   - **Location**: Storage location
3. Click "Add Item"

#### Managing Inventory
- **Edit**: Click the edit button to modify item details
- **Delete**: Click the delete button to remove items
- **Status Indicators**: Visual indicators for stock levels (In Stock, Low Stock, Out of Stock)

### 4. Order Management

#### Creating Orders
1. Navigate to the "Orders" page
2. Fill in the order form:
   - **Product**: Select from available inventory
   - **Quantity**: Order quantity
   - **Customer Details**: Name, address, pin code, mobile
   - **Delivery Date**: Expected delivery date
3. Click "Add Order"

#### Order Status Tracking
Orders automatically progress through statuses:
- **Pending**: Newly created orders
- **Shipped**: Orders pending for >1 hour (auto-updated)
- **Delivered**: Orders with past delivery dates (auto-updated)

### 5. Analytics

The analytics page provides detailed insights into your supply chain performance with various charts and metrics.

### 6. History

View a comprehensive audit trail of all system actions including:
- Inventory changes
- Order modifications
- User actions
- Timestamps and details

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### History
- `GET /api/history` - Get activity history

## 📊 Data Models

### User
```javascript
{
  email: String (unique),
  password: String (hashed)
}
```

### Inventory
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  quantity: Number,
  location: String,
  dateAdded: Date
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  product: ObjectId (ref: Inventory),
  quantity: Number,
  status: ['pending', 'shipped', 'delivered'],
  customerName: String,
  address: String,
  pinCode: String,
  mobile: String,
  deliveryDate: Date,
  shippedAt: Date
}
```

### History
```javascript
{
  user: ObjectId (ref: User),
  type: String,
  name: String,
  action: String,
  details: String,
  date: Date
}
```

## 🔄 Automated Features

### Auto-Shipment
- Orders pending for more than 1 hour are automatically marked as "shipped"
- Runs every 10 minutes via cron job

### Auto-Delivery
- Orders with delivery dates in the past are automatically marked as "delivered"
- Runs every 10 minutes via cron job

### Real-time Updates
- Socket.IO integration provides live updates across all connected clients
- Inventory changes, order updates, and history modifications are broadcast in real-time

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **Protected Routes**: Middleware ensures only authenticated users access protected endpoints
- **User Isolation**: Each user can only access their own data
- **Input Validation**: Server-side validation for all inputs

## 🎨 UI/UX Features

- **Modern Dark Theme**: Professional dark interface with blue accents
- **Responsive Design**: Mobile-friendly layout
- **Interactive Charts**: ECharts integration for data visualization
- **Real-time Updates**: Live data synchronization
- **Intuitive Navigation**: Sidebar navigation with active state indicators

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB connection string
3. Set JWT secret for production
4. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update the backend URL in the frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 📞 Support

For support and questions:
- Check the documentation for common issues

## 🔮 Future Enhancements

- [ ] Multi-tenant support
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Integration with external APIs
- [ ] Advanced inventory forecasting
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Barcode scanning integration

---

**SIPP - Supply Chain Management System** - Streamlining your supply chain operations with modern technology and real-time insights.
