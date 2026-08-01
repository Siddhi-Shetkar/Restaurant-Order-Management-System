# 🍽️ Restaurant Management System (MERN Stack)

A production-style **Restaurant Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The application provides a complete restaurant operations platform with role-based authentication, menu management, customer ordering, kitchen workflow, table management, analytics, and real-time order tracking.

---

# 📌 Project Overview

The Restaurant Management System streamlines restaurant operations by allowing customers to place dine-in or takeaway orders while enabling kitchen staff and managers to efficiently process, monitor, and analyze restaurant activities.

The application follows a strict **forward-only order workflow**:

```
Pending → Preparing → Ready → Delivered
```

Orders can never move backward or skip stages.

---

# ✨ Features

## Customer Features

- User Registration
- Secure Login & Logout
- JWT Authentication
- User Profile
- Browse Restaurant Menu
- Search Food Items
- Category Filters
- Vegetarian / Non-Vegetarian Filters
- Price Sorting
- Bestseller Section
- Food Details Page
- Shopping Cart
- Quantity Management
- Special Instructions
- Dine-In Ordering
- Takeaway Ordering
- Order Confirmation
- Order Tracking
- Order History
- Reorder Previous Orders
- In-App Notifications

---

## Kitchen Staff Features

- Secure Login
- Kitchen Dashboard
- Kanban Order Board
- Pending Orders
- Preparing Orders
- Ready Orders
- Delivered Orders
- Update Order Status
- Elapsed Time Monitoring
- Search Orders
- Filter Orders
- Priority Indicators
- Order Details Modal
- Waiting Time Alerts

---

## Manager/Admin Features

- Dashboard Overview
- Revenue Analytics
- Sales Reports
- Menu Management
- Table Management
- User Management
- Role Assignment
- Restaurant Analytics
- CSV Report Export
- Historical Reports
- Restaurant Settings
- Notification Management

---

# 🔐 Authentication

The application implements:

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Authorization
- Persistent Login Sessions

Supported Roles:

- Customer
- Kitchen Staff
- Manager/Admin

---

# 👥 Demo Login Credentials

## Manager

```
Email:
manager@restaurant.com

Password:
Manager@123
```

---

## Kitchen Staff

```
Email:
kitchen@restaurant.com

Password:
Kitchen@123
```

---

## Customer

```
Email:
customer@restaurant.com

Password:
Customer@123
```

---

# 🍕 Menu Features

Each menu item contains:

- Food Image
- Name
- Description
- Category
- Price
- Vegetarian Indicator
- Non-Vegetarian Indicator
- Availability Status
- Bestseller Badge
- Preparation Time

Supported Categories:

- Starters
- Main Course
- Biryani
- Burgers
- Pizza
- Desserts
- Beverages

Customers can:

- Search
- Filter
- Sort
- View Details
- Add to Cart

Unavailable items cannot be ordered.

---

# 🛒 Shopping Cart

Features include:

- Add Item
- Remove Item
- Increase Quantity
- Decrease Quantity
- Clear Cart
- Subtotal
- Taxes
- Final Total
- Special Instructions
- Persistent Cart

---

# 🧾 Ordering System

Customers can place:

## Dine-In Orders

Includes:

- Table Selection
- Food Items
- Quantity
- Notes

---

## Takeaway Orders

Includes:

- Customer Name
- Contact Number
- Food Items
- Notes

Each order contains:

- Unique Order ID
- Order Type
- Ordered Items
- Quantities
- Total Amount
- Order Date & Time
- Timeline
- Current Status

---

# 🔄 Order Workflow

The application strictly enforces the following workflow:

```
Pending
      │
      ▼
Preparing
      │
      ▼
Ready
      │
      ▼
Delivered
```

Allowed Transitions:

```
Pending → Preparing

Preparing → Ready

Ready → Delivered
```

Blocked Transitions:

```
Preparing → Pending

Ready → Pending

Ready → Preparing

Pending → Ready

Delivered → Any Status
```

Business Rules:

- All new orders begin as Pending.
- Orders cannot move backward.
- Orders cannot skip stages.
- Delivered orders cannot be modified.
- Backend validates every transition.
- Invalid transitions return proper API errors.

---

# 👨‍🍳 Kitchen Dashboard

The kitchen interface includes:

- Kanban Layout
- Pending Column
- Preparing Column
- Ready Column
- Delivered Column

Each order card displays:

- Order ID
- Order Type
- Table Number
- Customer Name
- Ordered Items
- Quantity
- Notes
- Status
- Order Time
- Elapsed Time

Only the next valid action button is displayed.

Examples:

```
Pending
↓

Start Preparing
```

```
Preparing
↓

Mark Ready
```

```
Ready
↓

Mark Delivered
```

Additional Features:

- Search
- Filter
- Sort
- Priority Labels
- Waiting Time Alerts

---

# 📊 Manager Dashboard

Dashboard Cards:

- Orders Today
- Pending Orders
- Preparing Orders
- Ready Orders
- Delivered Orders
- Revenue Today
- Average Order Value
- Dine-In Orders
- Takeaway Orders
- Most Popular Item

Charts:

- Daily Revenue
- Orders Per Day
- Orders by Status
- Dine-In vs Takeaway
- Top Selling Items

Date Filters:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- Custom Range

---

# 🍽️ Menu Management

Managers can:

- Add Menu Item
- Edit Menu Item
- Delete Menu Item
- Toggle Availability

Each item includes:

- Name
- Description
- Price
- Category
- Image URL
- Veg / Non-Veg
- Preparation Time
- Availability
- Bestseller

Deletion includes confirmation dialogs.

---

# 🪑 Table Management

Managers can:

- Add Tables
- Edit Tables
- Delete Tables
- Set Capacity
- View Status

Table Status:

- Available
- Occupied
- Reserved

Rules:

- Dine-in orders occupy tables.
- Delivered orders release tables.

Visual grid layout included.

---

# 📜 Order History

Customers can:

- View Previous Orders
- Search Orders
- Filter Orders
- View Details
- Reorder

Managers can:

- View All Orders
- Search
- Filter
- Export

---

# 📡 Real-Time Updates

Socket.IO is used for:

- Live Order Status
- Live Dashboard Counts
- Live Kitchen Updates
- Live Customer Tracking

Application gracefully falls back to polling if WebSockets are unavailable.

---

# 🚚 Customer Order Tracking

Progress Tracker:

```
✔ Order Placed

↓

✔ Preparing

↓

✔ Ready

↓

✔ Delivered
```

Displays:

- Order Status
- Timeline
- Estimated Time
- Order Items
- Total Amount
- Completed Stage Timestamps

---

# 🔔 Notifications

In-App Notifications:

- Order Placed
- Preparing
- Ready
- Delivered
- Menu Item Unavailable

Features:

- Notification Dropdown
- Unread Counter
- Mark as Read

---

# 📈 Restaurant Analytics

Managers can monitor:

- Revenue Trends
- Order Trends
- Peak Ordering Hours
- Popular Food Items
- Least Popular Items
- Average Preparation Time
- Average Completion Time
- Dine-In vs Takeaway

---

# 🎨 User Interface

Features:

- Responsive Design
- Desktop Dashboard
- Mobile Ordering
- Sidebar Navigation
- Top Navbar
- Toast Notifications
- Skeleton Loading
- Empty States
- Error States
- Smooth Animations
- Confirmation Dialogs
- Dark Mode
- Modern Restaurant Theme

Landing Page Includes:

- Hero Section
- Featured Menu
- About Restaurant
- Ordering Process
- Login/Register CTA

---

# ⚙️ Technology Stack

## Frontend

- React.js
- React Router
- Axios
- Context API
- Socket.IO Client
- Chart.js / Recharts
- CSS / Tailwind CSS (optional)

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- Express Validator

---

# 📁 Project Structure

```
restaurant-management-system/

│
├── client/
│   ├── public/
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── seed/
│   └── server.js
│
├── package.json
├── README.md
├── .env.example
└── .gitignore
```

---

# 🗄️ Database Models

- User
- MenuItem
- Order
- Table
- Notification

---

# 🔌 REST APIs

Authentication

```
POST   /api/auth/register

POST   /api/auth/login

GET    /api/auth/profile

PUT    /api/auth/change-password
```

Users

```
GET    /api/users

PUT    /api/users/:id

DELETE /api/users/:id
```

Menu

```
GET    /api/menu

POST   /api/menu

PUT    /api/menu/:id

DELETE /api/menu/:id
```

Orders

```
POST   /api/orders

GET    /api/orders

GET    /api/orders/:id

PATCH  /api/orders/:id/status
```

Tables

```
GET

POST

PUT

DELETE
```

Notifications

```
GET

PATCH
```

Analytics

```
GET /api/analytics

GET /api/reports

GET /api/reports/export
```

---

# 🔒 Business Rules

The backend enforces:

- Orders always start as Pending.
- Forward-only workflow.
- No skipped stages.
- No backward transitions.
- Delivered orders are immutable.
- Only kitchen staff can update statuses.
- Customers see only their own orders.
- Managers access all data.
- Revenue counts only Delivered orders.
- Every status update records timestamps.

---

# 🌱 Seed Data

The application ships with demo data including:

- 15+ Menu Items
- 3 User Roles
- Restaurant Tables
- Active Orders
- Completed Orders
- Historical Orders
- Notifications
- Analytics Data

---

# 📦 Prerequisites

Install:

- Node.js (18+)
- npm
- MongoDB

---

# 🚀 Installation

Clone repository

```bash
git clone https://github.com/yourusername/restaurant-management-system.git
```

Navigate

```bash
cd restaurant-management-system
```

Install root dependencies

```bash
npm install
```

Install frontend

```bash
cd client

npm install
```

Install backend

```bash
cd ../server

npm install
```

---

# 🔧 Environment Variables

Create a `.env` file inside `server/`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `client/`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🌱 Seed Database

```bash
cd server

npm run seed
```

---

# ▶️ Run Development

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

Run both

```bash
npm run start:dev
```

---

# 📦 Build

```bash
npm run build
```

---

# 📄 CSV Reports

Managers can export:

- Revenue Reports
- Sales Reports
- Order Reports

CSV files are generated from delivered orders only.

---

# 🖨️ Print Features

- Printable Receipt
- Printable Sales Report

---

# 🧪 Testing Checklist

✔ Customer Registration

✔ Customer Login

✔ Browse Menu

✔ Search & Filter

✔ Add to Cart

✔ Dine-In Order

✔ Takeaway Order

✔ Kitchen Dashboard

✔ Pending → Preparing

✔ Preparing → Ready

✔ Ready → Delivered

✔ Invalid Transition Prevention

✔ Customer Tracking

✔ Menu CRUD

✔ Table Management

✔ Analytics Dashboard

✔ Sales Reports

✔ Notifications

✔ Order History

✔ Role-Based Access

✔ Responsive Design

---

# 🚀 Deployment

Frontend:

- Vercel

Backend:

- Vercel Serverless Functions or Node-compatible deployment

Database:

- MongoDB Atlas

Environment variables should be configured on the deployment platform.

No Docker, Redis, Kubernetes, Firebase, or Supabase are required.

---

# 🛠️ Troubleshooting

### MongoDB Connection Failed

- Verify MongoDB Atlas connection string.
- Check IP whitelist.
- Ensure database user credentials are correct.

---

### JWT Authentication Issues

- Confirm `JWT_SECRET` is configured.
- Clear expired tokens.
- Log in again.

---

### Socket.IO Not Connecting

- Verify backend URL.
- Check CORS configuration.
- Application will gracefully fall back to polling.

---

### API Requests Failing

- Verify `VITE_API_URL`.
- Ensure backend server is running.
- Confirm API routes are correctly configured.

---

# 📜 License

This project is intended for educational and portfolio purposes.

---

# 👨‍💻 Author

**Restaurant Management System**

Built using the MERN Stack with a production-oriented architecture emphasizing scalability, maintainability, responsive design, and real-world restaurant workflow management.
## Contributor
- Updated README by Sahasthra