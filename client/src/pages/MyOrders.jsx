import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { format } from 'date-fns';
import { Package, ArrowRight, Utensils, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        // Sort orders by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-light)' }}>Loading your orders...</div>
    </div>
  );
  
  if (error) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {error}
    </div>
  );

  return (
    <div style={{ background: 'var(--background)', minHeight: 'calc(100vh - 4.5rem)', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'rgba(255,107,0,0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <ShoppingBag size={28} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>My Orders</h1>
        </div>
        
        {orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ background: 'var(--background)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--border)' }}>
              <Package size={40} style={{ color: 'var(--text-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>Looks like you haven't placed any orders with us yet.</p>
            <Link to="/menu" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', borderRadius: '9999px' }}>
              Explore Menu
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order._id} className="card animate-fade-in" style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontWeight: '700', fontSize: '1.25rem', margin: 0 }}>Order #{order.orderId}</h3>
                      <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: 0 }}>
                      {format(new Date(order.createdAt), 'MMMM dd, yyyy • hh:mm a')}
                    </p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--background)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        {order.orderType}
                      </span>
                      {order.tableNumber && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--background)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                          Table {order.tableNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Total Amount</p>
                    <p style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary-color)', margin: 0 }}>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-light)' }}>
                    <Utensils size={18} />
                    <span style={{ fontWeight: '500' }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {order.items.slice(0, 2).map(i => i.name).join(', ')}
                      {order.items.length > 2 ? ` + ${order.items.length - 2} more` : ''}
                    </span>
                  </div>
                  
                  <Link to={`/order/${order._id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '9999px' }}>
                    Track Order <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
