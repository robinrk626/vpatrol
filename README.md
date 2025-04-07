# VPatrol - E-commerce Backend API

VPatrol is a robust e-commerce backend API built with Node.js, Express, and MongoDB. It provides a comprehensive set of features for managing products, orders, and user authentication with role-based access control.

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Vendor/Customer/Admin)
- Secure password hashing using bcrypt

### Product Management
- Create, read, update, and delete products
- Product categorization
- Low stock alerts and monitoring
- Soft delete functionality for products

### Order Management
- Place new orders with multiple products
- Order status tracking (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- Automatic stock management
- Order history and details retrieval

### Sales Analytics
- Daily sales reports
- Customer spending analysis
- Top selling products
- Sales statistics within date ranges

### Security Features
- Input validation using Zod
- MongoDB injection protection

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Zod** - Schema validation
- **Bcrypt** - Password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vpatrol
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the application:
   - Copy the example config file:
     ```bash
     cp config/example.config.json config/development.config.json
     ```
   - Update `config/development.config.json` with your configuration:
     ```json
     {
       "PORT": 4000,
       "database": {
         "username": "<your_mongodb_username>",
         "password": "<your_mongodb_password>",
         "databaseName": "<your_database_name>"
       },
       "redisConnection": {
         "port": 6379,
         "hostname": "localhost"
       },
       "jwt": {
         "secret": "<your_jwt_secret>"
       }
     }
     ```

## Running the Application

1. Start Redis server:
   ```bash
   redis-server
   ```

2. Run the initial setup (creates default vendor and categories):
   ```bash
   npm run setup
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on the configured port (default: 4000).

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - User login

### Products (Protected - Vendor Only)
- `POST /auth/products` - Create a new product
- `GET /auth/products/:productId` - Get product details
- `PATCH /auth/products/:productId` - Update product
- `DELETE /auth/products/:productId` - Delete product
- `GET /auth/products/low-stock` - Get low stock products

### Orders
- `POST /auth/orders` - Place a new order (Customer)
- `GET /auth/orders` - Get all orders
- `GET /auth/orders/:orderId` - Get order details
- `PATCH /auth/orders/:orderId` - Update order status (Vendor)

### Sales Analytics (Protected - Vendor Only)
- `GET /auth/sales-analytics/daily-sales` - Get daily sales
### Sales Analytics (Protected - Admin Only)
- `GET /auth/sales-analytics/vendor-revenue` - Get Vendor wise revenue 
- `GET /auth/sales-analytics/top-products` - Get Vendor wise revenue 
- `GET /auth/sales-analytics/average-order-value` - Get Average order value of last 30 days 
