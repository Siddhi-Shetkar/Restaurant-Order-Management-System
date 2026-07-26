const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const Notification = require('../models/Notification');
const crypto = require('crypto');

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

const STATUS_FLOW = {
  'Pending': 'Preparing',
  'Preparing': 'Ready',
  'Ready': 'Delivered',
  'Delivered': null
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
  try {
    const { orderType, tableNumber, customerName, contactNumber, items, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify all items are available
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dbItem = await MenuItem.findById(item.menuItem);
      if (!dbItem) {
        return res.status(404).json({ message: `Menu item not found` });
      }
      if (!dbItem.isAvailable) {
        return res.status(400).json({ message: `Item ${dbItem.name} is currently unavailable` });
      }
      const itemTotal = dbItem.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        quantity: item.quantity,
        price: dbItem.price,
        specialInstructions: item.specialInstructions || specialInstructions
      });
    }

    const taxes = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + taxes;

    const order = new Order({
      orderId: generateOrderId(),
      customer: req.user._id,
      orderType,
      tableNumber,
      customerName,
      contactNumber,
      items: orderItems,
      subtotal,
      taxes,
      totalAmount,
      status: 'Pending',
      timeline: [{ status: 'Pending', timestamp: new Date() }]
    });

    const createdOrder = await order.save();

    // If dine-in, update table status
    if (orderType === 'Dine-in' && tableNumber) {
      const table = await Table.findOne({ tableNumber });
      if (table) {
        table.status = 'Occupied';
        table.currentOrder = createdOrder._id;
        await table.save();
      }
    }

    // Notify kitchen
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', createdOrder);
    }
    
    // Create Notification
    await Notification.create({
      targetRole: 'Kitchen Staff',
      title: 'New Order',
      message: `New ${orderType} order ${createdOrder.orderId} placed.`,
      type: 'ORDER_UPDATE'
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');

    if (order) {
      // Access control: customer can only see their own order, managers/staff can see all
      if (req.user.role === 'Customer' && order.customer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Kitchen Staff / Manager)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Enforce strictly forward transition
    const validNextStatus = STATUS_FLOW[order.status];
    if (status !== validNextStatus) {
      return res.status(400).json({ 
        message: `Invalid status transition. Cannot move from ${order.status} to ${status}. Expected ${validNextStatus}.` 
      });
    }

    order.status = status;
    order.timeline.push({ status, timestamp: new Date() });

    const updatedOrder = await order.save();

    // If delivered and Dine-in, free the table
    if (status === 'Delivered' && order.orderType === 'Dine-in' && order.tableNumber) {
      const table = await Table.findOne({ tableNumber: order.tableNumber });
      if (table) {
        table.status = 'Available';
        table.currentOrder = null;
        await table.save();
      }
    }

    // Real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdated', updatedOrder);
      // specific user notification
      io.to(order.customer.toString()).emit('myOrderStatusUpdated', updatedOrder);
    }

    // Create Notification for Customer
    await Notification.create({
      user: order.customer,
      title: 'Order Update',
      message: `Your order ${order.orderId} is now ${status}.`,
      type: 'ORDER_UPDATE'
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (with filters)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let query = {};

    // Customer can only see their own orders
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    } else {
      if (req.query.status) query.status = req.query.status;
      if (req.query.orderType) query.orderType = req.query.orderType;
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrders
};
