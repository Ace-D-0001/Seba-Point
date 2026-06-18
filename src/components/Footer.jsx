import React from 'react';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';

function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      borderTop: '4px solid #16a34a',
      fontSize: '0.9rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }} className="no-print">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem'
      }}>
        
        {/* Column 1: Brand Info */}
        <div>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            <img 
              src="/logo.png" 
              alt="SebaPoint Logo" 
              style={{ height: '40px', objectFit: 'contain' }} 
            />
          </div>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Your One Stop Service Hub. We specialize in Trade Licenses, Company Registration, and Digital Business Solutions in Bangladesh.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="https://www.facebook.com/sebapoint" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)', color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#16a34a'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['homepage', 'about', 'contact'].map((page) => (
              <li key={page}>
                <a 
                  href={`#${page}`} 
                  onClick={(e) => { e.preventDefault(); onNavigate(page); }} 
                  style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s ease', textTransform: 'capitalize' }}
                  onMouseOver={(e) => e.target.style.color = '#16a34a'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  {page === 'homepage' ? 'Home' : page.replace('-', ' ')}
                </a>
              </li>
            ))}
            <li>
                <a 
                  href="#dashboard" 
                  onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} 
                  style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#ef4444'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  Client Billing Portal
                </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Contact Us</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#cbd5e1' }}>
              <MapPin size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: '1.5' }}>NE3, House-16, Road-10,<br/>Gulshan-1, Dhaka-1212,<br/>Bangladesh</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
              <Phone size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>01813-884475</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
              <Mail size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>sebapoint01@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Copyright Bar */}
      <div style={{ backgroundColor: '#020617', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#475569', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} SebaPoint. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
