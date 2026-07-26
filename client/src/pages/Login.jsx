import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UtensilsCrossed } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'Manager') navigate('/manager');
      else if (user.role === 'Kitchen Staff') navigate('/kitchen');
      else navigate('/menu');
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <div className="auth-container">
      <div 
        className="auth-image" 
        style={{ backgroundImage: 'linear-gradient(rgba(15, 17, 21, 0.4), rgba(15, 17, 21, 0.8)), url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1934&auto=format&fit=crop)' }}
      >
        <div style={{ padding: '4rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Experience<br/>Culinary Excellence.</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '400px' }}>Join Sizzle & Serve to discover authentic flavours and seamless dining.</p>
        </div>
      </div>
      
      <div className="auth-form-wrapper animate-fade-in">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(255, 107, 0, 0.1)', borderRadius: '50%', color: 'var(--primary-color)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-glow)' }}>
              <UtensilsCrossed size={32} />
            </Link>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Login to your Sizzle & Serve account</p>
          </div>

          {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="manager@demo.com" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="password123" />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', fontSize: '1rem', borderRadius: '9999px' }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-light)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', transition: 'color 0.2s' }} className="hover:text-primary-hover">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
