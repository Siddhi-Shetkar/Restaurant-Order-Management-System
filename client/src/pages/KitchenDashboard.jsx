import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';
import { Clock, ChefHat, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('newOrder', (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      // UI updates automatically via socket, but we can do optimistic update
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', height: 'calc(100vh - 4.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-light)' }}>Loading kitchen dashboard...</div>
    </div>
  );
  if (error) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)', height: 'calc(100vh - 4.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {error}
    </div>
  );

  const STATUSES = ['Pending', 'Preparing', 'Ready', 'Delivered'];

  const getActionForStatus = (status) => {
    if (status === 'Pending') return { label: 'Start Preparing', next: 'Preparing' };
    if (status === 'Preparing') return { label: 'Mark Ready', next: 'Ready' };
    if (status === 'Ready') return { label: 'Mark Delivered', next: 'Delivered' };
    return null;
  };

  return (
    <div style={{ padding: '2.5rem', height: 'calc(100vh - 4.5rem)', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,107,0,0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
          <ChefHat size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Kitchen Order Management</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Live order tracking and preparation queue</p>
        </div>
      </div>
      
      <div className="kanban-board" style={{ flex: 1, height: '100%' }}>
        {STATUSES.map(status => (
          <div key={status} className="kanban-column" style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: status === 'Pending' ? 'var(--warning)' : 
                             status === 'Preparing' ? '#6366f1' : 
                             status === 'Ready' ? 'var(--success)' : 'var(--text-muted)'
                }}></div>
                <h3 style={{ fontWeight: '700', fontSize: '1.2rem', margin: 0 }}>{status}</h3>
              </div>
              <span className="badge" style={{ backgroundColor: 'var(--surface-light)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                {orders.filter(o => o.status === status).length}
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {orders.filter(o => o.status === status).map(order => {
                const action = getActionForStatus(order.status);
                
                return (
                  <div key={order._id} className="kanban-card animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>#{order.orderId}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)' }}>
                        {order.orderType}
                      </span>
                    </div>
                    
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> 
                      <span style={{ fontWeight: '500' }}>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
                      {order.items.map(item => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                          <span style={{ color: 'var(--text-main)' }}><span style={{ color: 'var(--primary-color)', marginRight: '0.4rem' }}>{item.quantity}x</span> {item.name}</span>
                        </div>
                      ))}
                      
                      {order.specialInstructions && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border)', color: 'var(--warning)', fontSize: '0.85rem', display: 'flex', gap: '0.3rem', alignItems: 'flex-start', fontStyle: 'italic' }}>
                          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{order.specialInstructions}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-light)' }}>
                      {order.orderType === 'Dine-in' && (
                        <div><span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Table:</span> {order.tableNumber}</div>
                      )}
                      
                      {order.orderType === 'Takeaway' && (
                        <div><span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Customer:</span> {order.customerName}</div>
                      )}
                    </div>

                    {action && (
                      <button 
                        className={`btn ${status === 'Pending' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ 
                          width: '100%', 
                          padding: '0.6rem',
                          ...(status !== 'Pending' ? {
                            color: status === 'Preparing' ? 'var(--success)' : 'var(--text-main)',
                            borderColor: status === 'Preparing' ? 'var(--success)' : 'var(--border)'
                          } : {})
                        }}
                        onClick={() => handleStatusChange(order._id, action.next)}
                      >
                        {action.label}
                      </button>
                    )}
                  </div>
                );
              })}
              
              {orders.filter(o => o.status === status).length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                  No orders
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDashboard;
