import React, { use, useState } from 'react';
import './App.css';
import logo from '../src/assets/logo.svg'

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultHeader, setResultHeader] = useState('')
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const apiURL = process.env.REACT_APP_API_URL

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResultHeader(searchQuery)
    

    try {
      const response = await fetch(`${apiURL}/api/search?product=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="app">
      <header>
        <div className="container">
          <div className="logo-container">
            <img src={logo} alt="WealthWagon Logo" className="logo" />
            <h1>WealthWagon</h1>
          </div>
          <p className="tagline">Find the best deals, save more money</p>
        </div>
      </header>

      <div className="search-section">
        <div className="container">
          <form onSubmit={handleSearch}>
            <div className="search-box">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for any product..."
                className="search-input"
              />  
              <button type="submit" className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </form>
          
          
        </div>
      </div>

      <div className="results-section">
        <div className="container">
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Finding the best deals for you...</p>
            </div>
          )}
          
          {error && (
            <div className="error">
              <p>Oops! {error}</p>
              <p>Please try again later.</p>
            </div>
          )}

          {!loading && !error && hasSearched && products.length === 0 && (
            <div className="no-results">
              <p>No products found for {searchQuery}</p>
              <p>Try a different search term.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="results-header">
                <h2>Best deals for {resultHeader}</h2>
                {/* <p>{products.length} products found</p> */}
              </div>

              <div className="products-grid">
                {products.map((product, index) => (
                  <div key={index} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.title} />
                      <div className="product-rating">
                        {renderRatingStars(product.rating)}
                        <span>{product.rating}</span>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <div className="product-store">
                        <span>From</span>
                        <strong>{product.store}</strong>
                      </div>
                      <div className="product-price">₹{product.price}</div>
                      <a href={product.link} target="_blank" rel="noopener noreferrer" className="view-deal">
                        View Deal
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {!hasSearched && (
            <div className="welcome-message">
              <div className="welcome-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5c2d91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h2>Start saving with WealthWagon</h2>
              <p>Search for any product to find the best deals across multiple stores</p>
              <div className="popular-searches">
                <p>Popular searches:</p>
                <div className="popular-tags">
                  <button onClick={() => {setSearchQuery('laptop'); handleSearch(new Event('submit'))}}>Laptops</button>
                  <button onClick={() => {setSearchQuery('smartphone'); handleSearch(new Event('submit'))}}>Smartphones</button>
                  <button onClick={() => {setSearchQuery('headphones'); handleSearch(new Event('submit'))}}>Headphones</button>
                  <button onClick={() => {setSearchQuery('camera'); handleSearch(new Event('submit'))}}>Cameras</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={logo} alt="WealthWagon Logo" className="logo" />
              <h2>WealthWagon</h2>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h3><a href="aboutUs">About Us</a></h3>
                
              </div>
              <div className="footer-links-column">
                <h3><a href="contact">Contact Us</a></h3>
                
              </div>
              
            </div>
          </div>
          
        </div>
      </footer>
    </div>
  );
}

// Utility function to render rating stars
function renderRatingStars(rating) {
  const fullStars = Math.floor(parseFloat(rating));
  const decimalPart = parseFloat(rating) - fullStars;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Full star
      stars.push(
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="star full-star">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    } else if (i === fullStars && decimalPart > 0) {
      // Partial star with dynamic width
      stars.push(
        <div key={i} style={{ position: "relative", width: "16px", height: "16px", display: "inline-block" }}>
          {/* Empty Star (Background) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="star empty-star" style={{ position: "absolute" }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {/* Overlaying Partial Star */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="star partial-star" style={{ position: "absolute", clipPath: `inset(0 ${100 - decimalPart * 100}% 0 0)` }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      );
    } else {
      // Empty star
      stars.push(
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="star empty-star">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
  }

  return stars;
}


export default App;