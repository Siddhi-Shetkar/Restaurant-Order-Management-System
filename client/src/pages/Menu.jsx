import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import { Search, Plus, Star, Clock, Heart } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const fallbackImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
  return (
    <img 
      src={imgSrc || fallbackImg} 
      alt={alt} 
      className={className}
      onError={() => setImgSrc(fallbackImg)}
      loading="lazy"
    />
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category') || 'All';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryQuery);
  const [dietFilter, setDietFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Recommended');

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get('/menu');
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load menu items');
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Sync state when URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const categories = [
    'All', 'Breakfast', 'Starters', 'North Indian', 'Biryani', 'Burgers', 'Pizza', 
    'Fast Food', 'Rolls & Wraps', 'Chinese', 'Evening Snacks', 'Desserts', 'Hot Beverages', 
    'Beverages', 'Milkshakes', 'Mocktails'
  ];

  // Apply filters
  let filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Exact category match
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    const matchesDiet = dietFilter === 'All' || 
                      (dietFilter === 'Veg' && item.isVegetarian) || 
                      (dietFilter === 'Non-Veg' && !item.isVegetarian) ||
                      (dietFilter === 'Bestseller' && item.isBestseller);
    
    return matchesSearch && matchesCategory && matchesDiet;
  });

  // Apply sorting
  if (sortOrder === 'PriceLowHigh') {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'PriceHighLow') {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'Rating') {
    filteredItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortOrder === 'PrepTime') {
    filteredItems.sort((a, b) => (a.preparationTime || 0) - (b.preparationTime || 0));
  } else {
    // Recommended (Bestsellers first)
    filteredItems.sort((a, b) => (b.isBestseller === true ? 1 : 0) - (a.isBestseller === true ? 1 : 0));
  }

  // Group by Category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Predefined order of categories
  const categoryOrder = [
    'Breakfast', 'Starters', 'North Indian', 'Biryani', 'Chinese', 'Burgers', 'Pizza', 
    'Fast Food', 'Rolls & Wraps', 'Evening Snacks', 'Desserts', 'Hot Beverages', 
    'Beverages', 'Milkshakes', 'Mocktails'
  ];

  // Sort groups based on predefined order
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading delicious menu...</div>;
  if (error) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ paddingBottom: '4rem', background: 'var(--background)' }}>
      {/* Header Section */}
      <div style={{ background: 'var(--surface)', padding: '4rem 0', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Explore Our Menu</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Freshly prepared favourites, made just for you.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        {/* Controls Bar */}
        <div style={{ backgroundColor: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', marginBottom: '3rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="Search for dishes..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  style={{ paddingLeft: '3rem', borderRadius: '9999px', background: 'var(--background)' }}
                />
              </div>
            </div>
            
            <select value={dietFilter} onChange={(e) => setDietFilter(e.target.value)} className="input-group" style={{ margin: 0, padding: '0.75rem 1rem', borderRadius: '9999px', background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <option value="All">All Diets</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-Vegetarian</option>
              <option value="Bestseller">Bestseller</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-group" style={{ margin: 0, padding: '0.75rem 1rem', borderRadius: '9999px', background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <option value="Recommended">Recommended</option>
              <option value="PriceLowHigh">Price: Low to High</option>
              <option value="PriceHighLow">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
              <option value="PrepTime">Preparation Time</option>
            </select>
          </div>

          {/* Categories */}
          <div className="chips-container" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {categories.map(category => (
              <button 
                key={category} 
                onClick={() => handleCategoryChange(category)}
                className={`chip ${activeCategory === category ? 'chip-active' : ''}`}
                style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {sortedCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
            <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>No items found</h3>
            <p style={{ marginTop: '0.5rem' }}>Try adjusting your filters or search term.</p>
            <button onClick={() => { setSearchTerm(''); handleCategoryChange('All'); setDietFilter('All'); }} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div>
            {sortedCategories.map(category => (
              <div key={category} style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '2rem', letterSpacing: '-0.02em', margin: 0 }}>{category}</h2>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '1.5rem' }}></div>
                </div>
                <div className="menu-grid">
                  {groupedItems[category].map(item => <MenuItemCard key={item._id} item={item} onAdd={addToCart} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItemCard = ({ item, onAdd }) => {
  return (
    <div className="card menu-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <ImageWithFallback src={item.imageUrl} alt={item.name} className="menu-img" />
        
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {item.isBestseller && (
            <span className="badge" style={{ backgroundColor: 'var(--primary-color)', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
              Bestseller
            </span>
          )}
        </div>
        
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <button style={{ background: 'rgba(28, 32, 40, 0.8)', backdropFilter: 'blur(4px)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', transition: 'color 0.2s' }} className="wishlist-btn">
            <Heart size={18} />
          </button>
        </div>
      </div>
      
      <div className="menu-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ border: `2px solid ${item.isVegetarian ? 'var(--success)' : 'var(--danger)'}`, width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.isVegetarian ? 'var(--success)' : 'var(--danger)' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-light)', textTransform: 'uppercase' }}>
            {item.isVegetarian ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.3', marginBottom: '0.5rem' }}>{item.name}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '600' }}>
          <Star size={16} fill="var(--warning)" color="var(--warning)" />
          {item.rating || 4.5} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({item.reviewCount || 0})</span>
        </div>

        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>
          {item.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
              <Clock size={12} /> {item.preparationTime} min
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{item.price}</span>
          </div>
          <button 
            onClick={() => {
              if (item.isAvailable !== false) onAdd(item);
            }} 
            className={`btn ${item.isAvailable !== false ? 'btn-primary' : 'btn-secondary'}`}
            disabled={item.isAvailable === false}
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', borderRadius: '9999px' }}
          >
            {item.isAvailable !== false ? <><Plus size={16} style={{ marginRight: '0.25rem' }} /> Add</> : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
