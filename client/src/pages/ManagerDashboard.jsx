import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { DollarSign, ShoppingBag, Utensils, TrendingUp, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/analytics/stats'),
          api.get('/orders')
        ]);
        
        setStats(statsRes.data);
        // Sort orders to show newest first
        const sortedOrders = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(sortedOrders.slice(0, 10)); // Just show recent 10
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', minHeight: 'calc(100vh - 4.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-light)' }}>Loading dashboard insights...</div>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)', minHeight: 'calc(100vh - 4.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AlertCircle style={{ marginRight: '0.5rem' }} /> {error}
    </div>
  );

  return (
    <div style={{ padding: '2.5rem 0 4rem 0', minHeight: 'calc(100vh - 4.5rem)', background: 'var(--background)' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(255,107,0,0.1)', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                <BarChart3 size={24} />
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Manager Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-light)', margin: 0, paddingLeft: '3.25rem' }}>Real-time business insights and operations overview.</p>
          </div>
          
          <div style={{ background: 'var(--surface)', padding: '0.6rem 1.25rem', borderRadius: '9999px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}>
            <Clock size={16} />
            <span style={{ fontWeight: '500' }}>{format(new Date(), 'EEEE, MMMM dd, yyyy')}</span>
          </div>
        </div>
        
        <div className="dashboard-stats">
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0s' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(79, 70, 229, 0.15)', color: '#818cf8', borderRadius: 'var(--radius-lg)', marginRight: '1.25rem', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
              <DollarSign size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '500' }}>Today's Revenue</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>₹{stats.revenueToday.toFixed(2)}</h3>
            </div>
          </div>
          
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: 'var(--radius-lg)', marginRight: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <ShoppingBag size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '500' }}>Total Orders</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{stats.totalOrdersToday}</h3>
            </div>
          </div>
          
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderRadius: 'var(--radius-lg)', marginRight: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Utensils size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '500' }}>Dine-in / Takeaway</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{stats.dineInCount} <span style={{ color: 'var(--text-muted)', fontSize: '1.25rem', margin: '0 0.2rem' }}>/</span> {stats.takeawayCount}</h3>
            </div>
          </div>
          
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', borderRadius: 'var(--radius-lg)', marginRight: '1.25rem', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '500' }}>Avg Order Value</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>₹{stats.avgOrderValue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          
          {/* Order Status Overview */}
          <div className="card animate-fade-in" style={{ padding: '1.5rem 2rem', animationDelay: '0.4s' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Order Status Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }}></div>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Pending</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>{stats.pending}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#4f46e5', boxShadow: '0 0 8px rgba(79,70,229,0.5)' }}></div>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Preparing</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>{stats.preparing}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}></div>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Ready</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>{stats.ready}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6b7280', boxShadow: '0 0 8px rgba(107,114,128,0.5)' }}></div>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Delivered</span>
                </div>
                <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>{stats.delivered}</span>
              </div>
            </div>
          </div>
          
          {/* Recent Orders Table */}
          <div className="card animate-fade-in" style={{ padding: '1.5rem 2rem', gridColumn: 'span 2', animationDelay: '0.5s', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Orders</h3>
              <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Showing last 10 orders</span>
            </div>
            
            <div style={{ minWidth: '600px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem 0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Order ID</th>
                    <th style={{ padding: '1rem 0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Type</th>
                    <th style={{ padding: '1rem 0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Time</th>
                    <th style={{ padding: '1rem 0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Status</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: '600', fontSize: '0.9rem' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map(order => (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="hover:bg-gray-800">
                        <td style={{ padding: '1.25rem 0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>#{order.orderId}</td>
                        <td style={{ padding: '1.25rem 0.5rem' }}>
                          <span style={{ padding: '0.25rem 0.75rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                            {order.orderType}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 0.5rem', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                          {format(new Date(order.createdAt), 'hh:mm a')}
                        </td>
                        <td style={{ padding: '1.25rem 0.5rem' }}>
                          <span className={`badge badge-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 0.5rem', textAlign: 'right', fontWeight: '700', color: 'var(--primary-color)' }}>
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
