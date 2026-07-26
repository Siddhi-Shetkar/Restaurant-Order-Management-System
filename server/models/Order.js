const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  specialInstructions: { type: String },
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // we assume all users must be registered, or it could be optional for walk-ins? Prompt says "Customers should be able to... register/login", we'll enforce User relation.
    },
    orderType: {
      type: String,
      enum: ['Dine-in', 'Takeaway'],
      required: true,
    },
    tableNumber: {
      type: Number, // Only for Dine-in
    },
    customerName: {
      type: String, // For takeaway
    },
    contactNumber: {
      type: String, // For takeaway
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Delivered'],
      default: 'Pending',
    },
    timeline: [timelineSchema],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
