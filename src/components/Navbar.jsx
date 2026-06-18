import React, { useState, useEffect } from 'react';
import { ExternalLink, Shield, Menu, X } from 'lucide-react';

function Navbar({ currentView, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'homepage', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contacts' }
  ];

  return (
    <header className="landing-header no-print" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(22, 163, 74, 0.1)' : '1px solid #e2e8f0',
      padding: isScrolled ? '0.5rem 0' : '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* Logo */}
        <div 
          onClick={() => { setMobileMenuOpen(false); onNavigate('homepage'); }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <img 
            src="/logo.png" 
            alt="SebaPoint Logo" 
            style={{ 
              height: isScrolled ? '50px' : '65px', 
              transition: 'height 0.3s ease',
              objectFit: 'contain' 
            }} 
          />
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          <div style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
                style={{
                  textDecoration: 'none',
                  color: currentView === link.id ? '#16a34a' : '#475569',
                  fontWeight: currentView === link.id ? 700 : 500,
                  fontSize: '1rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => { if (currentView !== link.id) e.target.style.color = '#ef4444'; }}
                onMouseOut={(e) => { if (currentView !== link.id) e.target.style.color = '#475569'; }}
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Billing portal CTA */}
          <button 
            onClick={() => onNavigate('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
            }}
          >
            <Shield size={16} />
            <span>Billing Portal</span>
            <ExternalLink size={14} />
          </button>
        </nav>

        {/* Mobile Menu Toggle (Simplified placeholder for responsivness) */}
        <div className="mobile-toggle" style={{ display: 'none' }}>
           <Menu size={28} color="#16a34a" cursor="pointer" />
        </div>

      </div>
      
      {/* Basic responsive styles via injected style block to hide desktop nav on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
