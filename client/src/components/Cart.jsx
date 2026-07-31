import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingCart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ImageWithFallback = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallbackImg = '/images/placeholder.png';
  return (
    <img 
      src={imgSrc || fallbackImg} 
      alt={alt} 
      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
      onError={() => setImgSrc(fallbackImg)}
      loading="lazy"
    />
  );
};

const Cart = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, subtotal, taxes, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState('Takeaway');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [contactNumber, setContactNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      toggleCart();
      navigate('/login');
      return;
    }

    if (orderType === 'Dine-in' && !tableNumber) {
      setError('Please select a table number for Dine-in.');
      return;
    }

    if (orderType === 'Takeaway' && (!customerName || !contactNumber)) {
      setError('Please enter your name and contact number.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/orders', {
        orderType,
        tableNumber: orderType === 'Dine-in' ? Number(tableNumber) : undefined,
        customerName: orderType === 'Takeaway' ? customerName : undefined,
        contactNumber: orderType === 'Takeaway' ? contactNumber : undefined,
        items: cartItems,
        specialInstructions
      });
      
      setLoading(false);
      clearCart();
      toggleCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <>
      {isCartOpen && <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 90 }} onClick={toggleCart} className="animate-fade-in"></div>}
      
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Your Order</h2>
          <button onClick={toggleCart} style={{ color: 'var(--text-light)', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--text-main)'} onMouseOut={(e) => e.target.style.color='var(--text-light)'}>
            <X size={24} />
          </button>
        </div>
        
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <ShoppingCart size={48} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: '600' }}>Your cart is empty</h3>
              <p style={{ marginBottom: '1.5rem' }}>Looks like you haven't added anything yet.</p>
              <button onClick={() => { toggleCart(); navigate('/menu'); }} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '9999px' }}>Browse Menu</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map((item) => (
                  <div key={item.menuItem} style={{ display: 'flex', gap: '1rem', background: 'var(--background)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', alignItems: 'center' }}>
                    
                    <ImageWithFallback src={item.imageUrl} alt={item.name} />
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.2rem', lineHeight: '1.2' }}>{item.name}</h4>
                      <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600' }}>₹{item.price}</p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.menuItem, item.quantity - 1)} style={{ padding: '0.35rem', color: 'var(--text-main)' }} className="hover:bg-gray-800"><Minus size={14} /></button>
                        <span style={{ fontWeight: '600', width: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.menuItem, item.quantity + 1)} style={{ padding: '0.35rem', color: 'var(--text-main)' }} className="hover:bg-gray-800"><Plus size={14} /></button>
                      </div>
                    </div>
                    
                    <button onClick={() => removeFromCart(item.menuItem)} style={{ color: 'var(--danger)', padding: '0.25rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }} title="Remove item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <hr style={{ borderColor: 'var(--border)', margin: '0.5rem 0' }} />

              {/* Checkout Form embedded inside cart for quick ordering */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Order Details</h3>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <button 
                    onClick={() => setOrderType('Takeaway')} 
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '500', border: '1px solid', borderColor: orderType === 'Takeaway' ? 'var(--primary-color)' : 'var(--border)', background: orderType === 'Takeaway' ? 'rgba(255,107,0,0.1)' : 'var(--background)', color: orderType === 'Takeaway' ? 'var(--primary-color)' : 'var(--text-main)' }}
                  >
                    Takeaway
                  </button>
                  <button 
                    onClick={() => setOrderType('Dine-in')} 
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '500', border: '1px solid', borderColor: orderType === 'Dine-in' ? 'var(--primary-color)' : 'var(--border)', background: orderType === 'Dine-in' ? 'rgba(255,107,0,0.1)' : 'var(--background)', color: orderType === 'Dine-in' ? 'var(--primary-color)' : 'var(--text-main)' }}
                  >
                    Dine-in
                  </button>
                </div>

                {orderType === 'Dine-in' ? (
                  <div className="input-group">
                    <label>Table Number</label>
                    <select value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}>
                      <option value="">Select a table</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => (
                        <option key={t} value={t}>Table {t}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="input-group">
                      <label>Customer Name</label>
                      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" />
                    </div>
                    <div className="input-group">
                      <label>Contact Number</label>
                      <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Your Phone Number" />
                    </div>
                  </>
                )}
                
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Special Instructions (Optional)</label>
                  <textarea 
                    value={specialInstructions} 
                    onChange={(e) => setSpecialInstructions(e.target.value)} 
                    placeholder="e.g. Less spicy, extra napkins" 
                    rows="2"
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
                
                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <Info size={16} /> {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-main)' }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <span>Taxes (10%)</span>
              <span style={{ color: 'var(--text-main)' }}>₹{taxes.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.25rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary-color)' }}>₹{total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '0.9rem', borderRadius: 'var(--radius-lg)' }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
