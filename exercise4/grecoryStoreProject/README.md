# Grocery Store Management System

## Overview
This project is a management system designed for a neighborhood grocery store. It includes both a **supplier interface** and a **store owner interface**, allowing for order placement, tracking, and automatic stock replenishment.

## Features
- **Supplier interface**:
  - Registration and login for suppliers.
  - View and confirm store orders.
  - Update order status.

- **Store Owner interface**:
  - Place orders with suppliers.
  - View and update the status of orders.

- **Bonus Feature (Automatic Stock Replenishment)**:
  - The system tracks stock levels.
  - When a product's stock falls below the minimum threshold, an automatic order is placed with the supplier offering the best price for that product.

## Technologies Used
- **Backend**: Node.js (`groceryStoreServer`)
- **Frontend**: React (`grocery-store-client`)
- **Database**: MongoDB
- **API**: RESTful API for communication between client and server.

## How It Works
- **Supplier Login**: Suppliers can register and log in to the system to manage their orders.
- **Order Management**: Store owners can place orders, view statuses, and confirm deliveries.
- **Automatic Ordering**: When stock reaches a low threshold, the system automatically places an order with the supplier who offers the best price for that product.

## Setup Instructions

### Backend (Node.js - groceryStoreServer)
1. Clone the repository.
2. Navigate to the `groceryStoreServer` directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the server.

### Frontend (React - grocery-store-client)
1. Navigate to the `grocery-store-client` directory.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the frontend.

## Conclusion
The system streamlines grocery store management by automating order placement, inventory tracking, and stock replenishment, making it easier for store owners to maintain their operations efficiently.
