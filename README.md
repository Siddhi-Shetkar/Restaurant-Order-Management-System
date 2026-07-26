# Sizzle & Serve - Restaurant Management System

A full-stack, production-ready Restaurant Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides interfaces for customers to place orders, kitchen staff to manage preparation, and managers to monitor performance.

## Features

* **Role-based Authentication**: Secure access for Customers, Kitchen Staff, and Managers using JWT.
* **Customer Interface**: Browse a dynamic menu, filter by category/dietary preference, and manage a shopping cart.
* **Order Workflow**: Strict forward-only state machine (Pending → Preparing → Ready → Delivered).
* **Real-time Updates**: Live order tracking and kitchen dashboard updates using Socket.IO.
* **Kitchen Dashboard**: Kanban-style interface for managing active orders efficiently.
* **Manager Dashboard**: Analytics, revenue tracking, and order overview.
* **Responsive UI**: Modern, clean aesthetics built with vanilla CSS prioritizing visual excellence.

## Technology Stack

* **Frontend**: React (Vite), React Router, Axios, Lucide React, Socket.IO Client.
* **Backend**: Node.js, Express.js, Mongoose, Socket.IO, JSONWebToken, Bcrypt.js.
* **Database**: MongoDB

## Folder Structure

```
restaurant-management-system/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── pages/          # Application views
│   │   └── utils/          # API helpers
├── server/                 # Node.js Backend
│   ├── config/             # DB Connection
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth & Error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── seeder.js           # Demo data script
└── package.json            # Root configuration for concurrent execution
```

## Prerequisites

* Node.js (v16 or higher)
* MongoDB running locally (default: `mongodb://127.0.0.1:27017/restaurant-management`) or a MongoDB Atlas URI.

## Installation & Setup

1. **Clone the repository and install dependencies:**
   From the root folder, run:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Variables:**
   Ensure `server/.env` is configured correctly. A sample `.env.example` is provided.
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/restaurant-management
   JWT_SECRET=supersecretjwtkey123
   NODE_ENV=development
   ```

3. **Seed Demo Data:**
   Populate the database with sample users, menu items, tables, and orders.
   ```bash
   npm run data:import
   ```

4. **Run the Application Locally:**
   Start both the backend server and frontend client concurrently:
   ```bash
   npm run dev
   ```

   The app will be accessible at `http://localhost:5173`.

## Demo Accounts

Use these credentials to test the application's role-based features:

* **Manager**: `manager@demo.com`
* **Kitchen Staff**: `kitchen@demo.com`
* **Customer**: `customer@demo.com`

*Password for all accounts:* `password123`

## Order Workflow & Business Logic

The core logic of the application enforces a strict, one-way state progression for all orders:
1. **Pending**: New orders are automatically placed in this state.
2. **Preparing**: Kitchen staff acknowledges and begins cooking.
3. **Ready**: Food is cooked and ready for pickup or serving.
4. **Delivered**: Order is completed.

The backend `orderController.js` validates these transitions and will reject any attempt to skip steps or move an order backward.

## Deployment Notes

* The application is designed to be deployment-friendly. 
* Configure `VITE_API_URL` in the frontend `.env` when deploying to production (e.g., Vercel or Netlify).
* The backend can be deployed to services like Render, Heroku, or DigitalOcean, ensuring CORS and Environment variables are appropriately configured.
