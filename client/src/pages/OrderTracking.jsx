import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { io } from 'socket.io-client';
import { Check, ChefHat, Clock, CheckCircle, PackageSearch, MapPin, ReceiptText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Order not found or you are not authorized to view it.');
        setLoading(false);
      }
    };
    fetchOrder();

    // Socket connection
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    if (order && order.customer) {
        socket.emit('join', order.customer._id);
    }
    
    socket.on('myOrderStatusUpdated', (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    });
    
    socket.on('orderStatusUpdated', (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    });

    return () => socket.disconnect();
  }, [id, order?.customer]);

  if (loading) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-light)' }}>Loading order details...</div>
    </div>
  );
  if (error) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {error}
    </div>
  );

  const statuses = ['Pending', 'Preparing', 'Ready', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div style={{ background: 'var(--background)', minHeight: 'calc(100vh - 4.5rem)', padding: '2rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/my-orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontWeight: '500' }} className="hover:text-primary">
            <ArrowLeft size={18} /> Back to Orders
          </Link>
        </div>

        <div className="card animate-fade-in" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ background: 'rgba(255,107,0,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-color)' }}>
              <PackageSearch size={30} />
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Order #{order.orderId}</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
              Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy • hh:mm a')}
            </p>
          </div>

          {/* Stepper */}
          <div className="tracker-stepper" style={{ marginBottom: '4rem' }}>
            {statuses.map((status, index) => {
              const isCompleted = index < currentStatusIndex;
              const isActive = index === currentStatusIndex;
              
              let Icon = Clock;
              if (status === 'Preparing') Icon = ChefHat;
              if (status === 'Ready') Icon = Check;
              if (status === 'Delivered') Icon = CheckCircle;

              return (
                <div key={status} className={`tracker-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="tracker-icon" style={{ zIndex: 10 }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontWeight: isActive ? '700' : '500', color: isCompleted || isActive ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                    {status}
                  </span>
                  {order.timeline.find(t => t.status === status) && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                      {format(new Date(order.timeline.find(t => t.status === status).timestamp), 'hh:mm a')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
            
            {/* Left Column: Order Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <MapPin size={20} color="var(--primary-color)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Order Details</h3>
              </div>
              
              <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Order Type</p>
                  <p style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-main)' }}>{order.orderType}</p>
                </div>
                
                {order.orderType === 'Dine-in' && (
                  <div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Table Number</p>
                    <p style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-main)' }}>Table {order.tableNumber}</p>
                  </div>
                )}
                
                {order.orderType === 'Takeaway' && (
                  <>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Customer Name</p>
                      <p style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-main)' }}>{order.customerName}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Contact Number</p>
                      <p style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-main)' }}>{order.contactNumber}</p>
                    </div>
                  </>
                )}

                {order.specialInstructions && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border)' }}>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Special Instructions</p>
                    <p style={{ fontWeight: '500', fontSize: '1rem', color: 'var(--warning)', fontStyle: 'italic' }}>"{order.specialInstructions}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Receipt */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <ReceiptText size={20} color="var(--primary-color)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Order Summary</h3>
              </div>

              <div style={{ backgroundColor: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {order.items.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--primary-color)', background: 'rgba(255,107,0,0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          {item.quantity}x
                        </span>
                        <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--text-light)' }}>
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.95rem', color: 'var(--text-light)' }}>
                    <span>Taxes & Fees</span>
                    <span>₹{order.taxes.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>Total Amount</span>
                    <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary-color)' }}>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
