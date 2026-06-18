import React from 'react';
import { Facebook } from 'lucide-react';

function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      padding: '3rem 2rem',
      color: '#94a3b8',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.9rem'
    }} className="no-print">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Footer Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>
            <img 
              src="/logo.png" 
              alt="SebaPoint Logo" 
              style={{ height: '32px', filter: 'brightness(0) invert(1)', objectFit: 'contain' }} 
            />
          </div>
          <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: '1.5' }}>
            SebaPoint - Trade License Broker & Consulting Agency.<br />
            Office: NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh.<br />
            Email: sebapoint01@gmail.com | Phone: 01813-884475
          </p>
        </div>

        {/* Footer Navigation Link Lists */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a 
            href="#homepage" 
            onClick={(e) => { e.preventDefault(); onNavigate('homepage'); }} 
            style={{ color: '#94a3b8', textDecoration: 'none' }}
            onMouseOver={(e) => e.target.style.color = '#16a34a'}
            onMouseOut={(e) => e.target.style.color = '#94a3b8'}
          >
            Homepage
          </a>
          <a 
            href="#about" 
            onClick={(e) => { e.preventDefault(); onNavigate('about'); }} 
            style={{ color: '#94a3b8', textDecoration: 'none' }}
            onMouseOver={(e) => e.target.style.color = '#16a34a'}
            onMouseOut={(e) => e.target.style.color = '#94a3b8'}
          >
            About Us
          </a>
          <a 
            href="#contact" 
            onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} 
            style={{ color: '#94a3b8', textDecoration: 'none' }}
            onMouseOver={(e) => e.target.style.color = '#16a34a'}
            onMouseOut={(e) => e.target.style.color = '#94a3b8'}
          >
            Contacts
          </a>
          <a 
            href="https://www.facebook.com/sebapoint" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            onMouseOver={(e) => e.target.style.color = '#16a34a'}
            onMouseOut={(e) => e.target.style.color = '#94a3b8'}
          >
            <Facebook size={16} />
            <span>Facebook</span>
          </a>
        </div>

      </div>
      <div style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#475569' }}>
        © 2026 SebaPoint. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
