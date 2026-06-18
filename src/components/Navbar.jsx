import React from 'react';
import { Sparkles, ExternalLink, Shield } from 'lucide-react';

function Navbar({ currentView, onNavigate }) {
  return (
    <header className="landing-header no-print">
      <div className="landing-nav-container">
        
        {/* Logo and Tagline */}
        <div 
          className="landing-brand" 
          onClick={() => onNavigate('homepage')}
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="SebaPoint Logo" 
            style={{ height: '40px', marginRight: '0.25rem', objectFit: 'contain' }} 
          />
        </div>

        {/* Navigation Links */}
        <nav className="landing-nav-links">
          <a 
            href="#homepage" 
            className={currentView === 'homepage' ? 'active-link' : ''} 
            onClick={(e) => { e.preventDefault(); onNavigate('homepage'); }}
            style={currentView === 'homepage' ? { color: '#16a34a', fontWeight: 700 } : {}}
          >
            Homepage
          </a>
          <a 
            href="#about" 
            className={currentView === 'about' ? 'active-link' : ''} 
            onClick={(e) => { e.preventDefault(); onNavigate('about'); }}
            style={currentView === 'about' ? { color: '#16a34a', fontWeight: 700 } : {}}
          >
            About Us
          </a>
          <a 
            href="#contact" 
            className={currentView === 'contact' ? 'active-link' : ''} 
            onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
            style={currentView === 'contact' ? { color: '#16a34a', fontWeight: 700 } : {}}
          >
            Contacts
          </a>
          
          {/* Billing portal CTA */}
          <button className="invoicing-portal-btn" onClick={() => onNavigate('dashboard')}>
            <Shield size={14} />
            <span>Billing Portal</span>
            <ExternalLink size={12} />
          </button>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;
