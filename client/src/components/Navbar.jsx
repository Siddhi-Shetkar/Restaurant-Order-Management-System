import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Utensils, ShoppingCart, User, LogOut, Bell, LayoutDashboard, Search, Menu as MenuIcon, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, toggleCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* LEFT: Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>
          <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <Utensils size={24} color="#fff" />
          </div>
          <span>Sizzle<span style={{ color: 'var(--primary-color)' }}>&</span>Serve</span>
        </Link>
        
        {/* CENTER: Navigation Links (Desktop) */}
        <div className="nav-links hide-mobile" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
          
          {user && user.role === 'Customer' && (
            <Link to="/my-orders" className={`nav-link ${isActive('/my-orders') ? 'active' : ''}`}>My Orders</Link>
          )}
          
          {user && user.role === 'Kitchen Staff' && (
            <Link to="/kitchen" className={`nav-link ${isActive('/kitchen') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <LayoutDashboard size={18} /> Kitchen
            </Link>
          )}
          
          {user && user.role === 'Manager' && (
            <Link to="/manager" className={`nav-link ${isActive('/manager') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="nav-link hide-mobile" onClick={() => navigate('/menu')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Search size={22} />
          </button>
          
          {(!user || user.role === 'Customer') && (
            <button className="nav-link" onClick={toggleCart} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="animate-fade-in" style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary-color)', color: 'white', fontSize: '0.7rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(255,107,0,0.5)' }}>
                  {cartItems.length}
                </span>
              )}
            </button>
          )}

          {user ? (
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  <User size={18} color="var(--primary-color)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', lineHeight: '1' }}>{user.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>{user.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }} title="Logout">
                <LogOut size={20} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-only" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--shadow-lg)', zIndex: 40 }} className="animate-fade-in">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '500' }}>Home</Link>
          <Link to="/menu" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '500' }}>Menu</Link>
          
          {user && user.role === 'Customer' && (
            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '500' }}>My Orders</Link>
          )}
          {user && user.role === 'Kitchen Staff' && (
            <Link to="/kitchen" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '500' }}>Kitchen Dashboard</Link>
          )}
          {user && user.role === 'Manager' && (
            <Link to="/manager" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '500' }}>Manager Dashboard</Link>
          )}
          
          <hr style={{ borderColor: 'var(--border)', margin: '0.5rem 0' }} />
          
          {user ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={20} color="var(--primary-color)" />
                <span style={{ fontWeight: '500' }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
