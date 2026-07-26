import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { ChevronRight, Star, Clock, Zap, ShieldCheck, Smartphone, UtensilsCrossed } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, style }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallbackImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
  return (
    <img 
      src={imgSrc || fallbackImg} 
      alt={alt} 
      className={className}
      style={{ ...style, objectFit: 'cover' }}
      onError={() => setImgSrc(fallbackImg)}
      loading="lazy"
    />
  );
};

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get('/menu');
        const specials = data.filter(item => item.isBestseller).slice(0, 4);
        setBestsellers(specials);
      } catch (err) {
        console.error('Failed to load menu items', err);
      }
    };
    fetchMenu();
  }, []);

  const quickCategories = [
    { name: 'Breakfast', img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80' },
    { name: 'Starters', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80' },
    { name: 'North Indian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80' },
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80' },
    { name: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80' },
    { name: 'Beverages', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      {/* 1. HERO SECTION */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-main)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Good Food.<br/>
              <span style={{ color: 'var(--primary-color)' }}>Great Moments.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
              Discover delicious meals, order your favourites, and enjoy a seamless dining experience with Sizzle & Serve.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2.5rem' }}>
                Explore Menu
              </Link>
              <a href="#specials" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '0.8rem 2.5rem' }}>
                View Specials
              </a>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="animate-fade-in hide-mobile">
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)', zIndex: -1 }}></div>
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
              alt="Delicious Food" 
              style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            />
            {/* Floating Badges */}
            <div style={{ position: 'absolute', top: '20px', right: '-20px', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--success)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star color="white" fill="white" size={20} />
              </div>
              <div>
                <p style={{ fontWeight: '700', margin: 0 }}>4.9/5</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>Top Rated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK CATEGORIES */}
      <section style={{ padding: '4rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', letterSpacing: '-0.02em' }}>Quick Categories</h2>
            <Link to="/menu" style={{ color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center' }}>View All <ChevronRight size={18} /></Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
            {quickCategories.map((cat, idx) => (
              <div key={idx} className="card" onClick={() => navigate(`/menu?category=${encodeURIComponent(cat.name)}`)} style={{ cursor: 'pointer', textAlign: 'center', background: 'var(--background)' }}>
                <ImageWithFallback src={cat.img} alt={cat.name} style={{ width: '100%', height: '120px' }} />
                <div style={{ padding: '1rem 0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TODAY'S SPECIALS */}
      <section id="specials" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Today's Specials</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Hand-picked delicacies specially curated by our master chefs for your ultimate dining pleasure.</p>
          </div>
          
          <div className="menu-grid">
            {bestsellers.map(item => (
              <div key={item._id} className="card menu-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ position: 'relative' }}>
                  <ImageWithFallback src={item.imageUrl} alt={item.name} className="menu-img" />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.3rem 0.75rem' }}>Bestseller</span>
                  </div>
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(28, 32, 40, 0.8)', backdropFilter: 'blur(4px)', color: item.isVegetarian ? 'var(--success)' : 'var(--danger)', border: `2px solid ${item.isVegetarian ? 'var(--success)' : 'var(--danger)'}`, width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', padding: 0 }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.isVegetarian ? 'var(--success)' : 'var(--danger)' }}></div>
                    </span>
                  </div>
                </div>
                
                <div className="menu-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>{item.name}</h3>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{item.price}</span>
                  </div>
                  
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
                    {item.description}
                  </p>
          
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Star size={18} fill="var(--warning)" color="var(--warning)" />
                    {item.rating || 4.5} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({item.reviewCount || 0})</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500' }}>
                      <Clock size={16} /> {item.preparationTime} min
                    </span>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="btn btn-primary"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section style={{ padding: '5rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Why Choose Sizzle & Serve</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Zap size={32} />, title: 'Fast Service', desc: 'Quick preparation and efficient order processing.' },
              { icon: <UtensilsCrossed size={32} />, title: 'Fresh Food', desc: 'Quality ingredients prepared fresh for every order.' },
              { icon: <Smartphone size={32} />, title: 'Easy Ordering', desc: 'Browse, customize, and order with just a few clicks.' },
              { icon: <ShieldCheck size={32} />, title: 'Seamless Dining', desc: 'Enjoy a smooth dining experience from order to table.' }
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', background: 'var(--background)' }}>
                <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,107,0,0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', transition: 'all 0.3s' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3.5rem', letterSpacing: '-0.02em' }}>What Our Customers Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Rahul Sharma', review: 'The Butter Chicken here is out of this world! Fast service and amazing ambiance.', rating: 5 },
              { name: 'Priya Desai', review: 'I love how easy it is to order online. The packaging is premium and the food is always hot.', rating: 5 },
              { name: 'Amit Kumar', review: 'Best Biryani in town. Sizzle & Serve never disappoints with their quality.', rating: 4 }
            ].map((test, i) => (
              <div key={i} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--warning)', marginBottom: '1rem' }}>
                  {[...Array(test.rating)].map((_, idx) => <Star key={idx} size={18} fill="currentColor" />)}
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '2rem', flex: 1 }}>"{test.review}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {test.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: '600' }}>{test.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, rgba(23,26,33,1) 0%, rgba(28,32,40,1) 100%)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Ready to satisfy your cravings?</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '2.5rem' }}>Explore our menu and order your favourite dishes today. Experience the best dining right at your fingertips.</p>
          <Link to="/menu" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 3rem', borderRadius: '9999px' }}>
            Explore Menu Now
          </Link>
        </div>
      </section>
      
      {/* 7. FOOTER */}
      <footer style={{ backgroundColor: '#0a0b0d', padding: '4rem 0 2rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif", marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UtensilsCrossed size={20} color="#fff" />
                </div>
                <span>Sizzle<span style={{ color: 'var(--primary-color)' }}>&</span>Serve</span>
              </Link>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>Good Food. Great Moments.<br/>Delivering happiness, one meal at a time.</p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/menu" className="nav-link">Menu</Link>
                <Link to="/login" className="nav-link">Staff Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Contact Us</h4>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>123 Food Street, Culinary Ave</p>
              <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>contact@sizzleandserve.com</p>
              <p style={{ color: 'var(--text-light)' }}>+91 98765 43210</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            <p>© 2026 Sizzle & Serve. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
