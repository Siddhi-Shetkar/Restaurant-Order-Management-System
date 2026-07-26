const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Table.deleteMany();
    await MenuItem.deleteMany();
    await User.deleteMany();
    await Notification.deleteMany();

    // Users
    const createdUsers = await User.insertMany([
      { name: 'Admin Manager', email: 'manager@demo.com', password: 'password123', role: 'Manager' },
      { name: 'Kitchen Staff', email: 'kitchen@demo.com', password: 'password123', role: 'Kitchen Staff' },
      { name: 'John Customer', email: 'customer@demo.com', password: 'password123', role: 'Customer' },
    ]);
    
    const customerId = createdUsers[2]._id;

    // Menu Items
    const sampleItems = [
      { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 250, category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1599487405251-5b77ff0a0bb0?w=500&q=80', isVegetarian: true, preparationTime: 15, isBestseller: true },
      { name: 'Chicken 65', description: 'Spicy, deep-fried chicken', price: 300, category: 'Starters', imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&q=80', isVegetarian: false, preparationTime: 20 },
      { name: 'Butter Chicken', description: 'Chicken in a mildly spiced tomato sauce', price: 450, category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80', isVegetarian: false, preparationTime: 30, isBestseller: true },
      { name: 'Dal Makhani', description: 'Creamy black lentils', price: 280, category: 'Main Course', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80', isVegetarian: true, preparationTime: 25 },
      { name: 'Chicken Biryani', description: 'Aromatic rice with marinated chicken', price: 350, category: 'Biryani', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=500&q=80', isVegetarian: false, preparationTime: 40, isBestseller: true },
      { name: 'Veg Biryani', description: 'Mixed vegetables and aromatic rice', price: 250, category: 'Biryani', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80', isVegetarian: true, preparationTime: 35 },
      { name: 'Classic Burger', description: 'Juicy beef patty with lettuce and cheese', price: 200, category: 'Burgers', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', isVegetarian: false, preparationTime: 15 },
      { name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza', price: 350, category: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&q=80', isVegetarian: true, preparationTime: 20 },
      { name: 'Gulab Jamun', description: 'Sweet fried dumplings in syrup', price: 100, category: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1592534575825-1e4df6a9484f?w=500&q=80', isVegetarian: true, preparationTime: 5 },
      { name: 'Mango Lassi', description: 'Yogurt-based mango drink', price: 80, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1626359516645-560935105aeb?w=500&q=80', isVegetarian: true, preparationTime: 5, isBestseller: true }
    ];
    
    const createdItems = await MenuItem.insertMany(sampleItems);

    // Tables
    const sampleTables = [
      { tableNumber: 1, capacity: 2 },
      { tableNumber: 2, capacity: 4 },
      { tableNumber: 3, capacity: 4 },
      { tableNumber: 4, capacity: 6 },
      { tableNumber: 5, capacity: 8 }
    ];
    
    await Table.insertMany(sampleTables);

    // Orders
    // We will place a couple of orders for demo
    const item1 = createdItems[0];
    const item2 = createdItems[2];

    const order1 = new Order({
      orderId: 'ORD-1A2B3C',
      customer: customerId,
      orderType: 'Takeaway',
      customerName: 'John',
      contactNumber: '1234567890',
      items: [
        { menuItem: item1._id, name: item1.name, quantity: 2, price: item1.price },
        { menuItem: item2._id, name: item2.name, quantity: 1, price: item2.price }
      ],
      subtotal: 950,
      taxes: 95,
      totalAmount: 1045,
      status: 'Pending',
      timeline: [{ status: 'Pending', timestamp: new Date() }]
    });

    await order1.save();

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
