import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import KitchenDashboard from './pages/KitchenDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="main-layout" style={{ flexDirection: 'column' }}>
            <Navbar />
            <Cart />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/order/:id" element={<OrderTracking />} />
                
                {/* Customer Routes */}
                <Route path="/my-orders" element={
                  <ProtectedRoute allowedRoles={['Customer', 'Manager', 'Kitchen Staff']}>
                    <MyOrders />
                  </ProtectedRoute>
                } />
                
                {/* Kitchen Routes */}
                <Route path="/kitchen" element={
                  <ProtectedRoute allowedRoles={['Kitchen Staff', 'Manager']}>
                    <KitchenDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Manager Routes */}
                <Route path="/manager" element={
                  <ProtectedRoute allowedRoles={['Manager']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
