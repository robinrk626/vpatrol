
## Features
- **getCustomerSpending(customerId!)**: Retrieve the total spending of a customer by their ID.
- **getTopSellingProducts(limit!, pageNumber)**: Fetch the top-selling products with pagination support. (Default: `pageNumber = 1`)
- **getSalesAnalytics(startDate!, endDate!)**: Get sales statistics within a given time range.
- **getCustomerOrders(customerId!, limit!, pageNumber)**: Fetch all orders placed by a customer with pagination support. (Default: `pageNumber = 1`)
- **createOrder([products])**: Create a new order and reduce stock for ordered product items.

## Installation
1. Install dependencies:
   ```
   npm install
   ```
2. Set up configuration:
   - Copy the example config file:
     ```
     cp config/example.config.json config/development.config.json
     ```
   - Update `config/development.config.json` with your configuration values:
     ```json
     {
       "PORT": 4000,
       "database": {
         "username": "<your_database_username>",
         "password": "<your_database_password>",
         "databaseName": "<databaseName>"
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
## Running the Server
To start the server, use the following command:
```
npm run start
```

---
