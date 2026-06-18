import React, { useState, useEffect } from 'react';
import { SERVICES_DATA } from '../servicesData';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const SLIDES = [
  '/slide1.png',
  '/slide2.png',
  '/slide3.png'
];

const FAQS = [
  {
    question: 'How long does it take to get a Trade License with Seba Point?',
    answer: 'We deliver all types of licenses in just 3 days! Our fast-track processing coordinates directly with City Corporation officers to ensure swift delivery.'
  },
  {
    question: 'What documents do I need for a new Trade License?',
    answer: 'Typically, you need a copy of your National ID (NID), 3 recent passport-sized photos, a rental agreement of your commercial space, and a holding tax receipt from the landlord.'
  },
  {
    question: 'Do you handle Dhaka North City Corporation (DNCC) licenses?',
    answer: 'Yes! We specialize in processing licenses across Dhaka North and Dhaka South City Corporations. We manage everything including fee calculation, bank challans, and inspector visits.'
  },
  {
    question: 'Where is the Seba Point office located?',
    answer: 'Our main office is located at NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh. You can also reach us via phone at 01813-884475 or email at sebapoint01@gmail.com.'
  }
];

function Homepage({ onSelectService, onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  return (
    <div className="homepage-section">
      
      {/* Hero Banner with Slider */}
      <section className="landing-hero" style={{
        position: 'relative',
        padding: '10rem 2rem 8rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #86efac',
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Slider */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          overflow: 'hidden'
        }}>
          {SLIDES.map((slide, index) => (
            <img 
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                zIndex: 0
              }} 
            />
          ))}
          {/* Light Overlay to ensure text readability */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            zIndex: 1
          }} />
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#14532d',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '1px solid #86efac'
            }}>
              YOUR ONE STOP SERVICE HUB
            </span>
            <span style={{
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '1px solid #fca5a5'
            }}>
              ৩ দিনে আপনার সব ধরনের লাইসেন্স রেডি!
            </span>
          </div>
          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: 1.15,
            fontWeight: 850,
            fontFamily: 'var(--font-display)',
            color: '#0f172a',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Get Your Trade License <br/>
            <span style={{ color: '#ef4444' }}>Ready in 3 Days!</span>
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#475569',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            "Our main purpose is to provide you with the best service." We handle new trade license registrations, renewals, NBR VAT (BIN) certificates, and company filings directly with government offices.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn" 
              onClick={() => {
                const el = document.getElementById('services-grid-title');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                boxShadow: '0 4px 14px 0 rgba(22, 163, 74, 0.3)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              <span>Explore Services</span>
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => onNavigate('contact')}
              style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
            >
              <span>Talk to Broker</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Bubbles */}
        <div className="hero-bubble" style={{ top: '15%', left: '8%' }}></div>
        <div className="hero-bubble" style={{ bottom: '20%', right: '10%' }}></div>
      </section>

      {/* Services Grid Section */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div id="services-grid-title" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            Our Professional Services
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Select a card to view detailed government fees, document checklists, and timelines on a separate details page.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {SERVICES_DATA.map((service) => (
            <div 
              key={service.id} 
              className="service-card"
              onClick={() => onSelectService(service.id)}
              style={{ padding: '0', overflow: 'hidden' }}
            >
              {/* Card Image Block */}
              <div className="card-image-box" style={{
                height: '180px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid var(--border-color)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.4s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>

              {/* Card Content Block */}
              <div style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', flex: 1, marginBottom: '1.25rem' }}>
                  {service.shortDescription}
                </p>
                <span className="card-arrow-link" style={{ color: '#16a34a', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                  <span>View Requirements & Pricing</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #dcfce7' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Everything you need to know about our brokerage services.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #dcfce7',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0f172a',
                    fontWeight: 600,
                    fontSize: '1.05rem'
                  }}
                >
                  {faq.question}
                  {openFaqIndex === index ? (
                    <ChevronUp size={20} color="#16a34a" />
                  ) : (
                    <ChevronDown size={20} color="#64748b" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    color: '#475569',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Homepage;
