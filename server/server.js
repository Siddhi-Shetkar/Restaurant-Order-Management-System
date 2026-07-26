const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { errorHandler, notFound } = require('./middleware/error');

const connectDB = require('./config/db');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const importData = require('./seeder-logic'); // We'll extract seeder logic to a function

dotenv.config();

const app = express();
const server = http.createServer(app);

// Helper to start memory server and seed
const startMemoryServer = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`Connected to In-Memory MongoDB: ${uri}`);
  console.log('Seeding demo data into memory server...');
  await importData();
  console.log('Demo data seeded successfully!');
};

// Connect to Database
const initializeApp = async () => {
  try {
    // Try to connect to normal MongoDB first
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB not found. Starting In-Memory Database...`);
    await startMemoryServer();
  }
};

// Middleware
app.use(cors({
  origin: '*', // For development, allow all origins. Configure properly for production.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Join a room based on user ID or role to receive specific notifications
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible to our router
app.set('io', io);

const PORT = process.env.PORT || 5000;

initializeApp().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
