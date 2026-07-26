const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // If user is null, it might be a broadcast notification for a role like 'Manager'
    },
    targetRole: {
      type: String,
      enum: ['Customer', 'Kitchen Staff', 'Manager', 'All'],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String, // e.g., 'ORDER_UPDATE', 'SYSTEM'
      default: 'SYSTEM',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Optional URL to navigate when clicked
    }
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
