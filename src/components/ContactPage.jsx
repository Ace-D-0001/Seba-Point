import React, { useState } from 'react';
import { SERVICES_DATA } from '../servicesData';
import { Phone, Mail, MapPin, Facebook, MessageCircle, Send, Sparkles, ExternalLink } from 'lucide-react';

function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'new-license',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert('Please provide at least a name and phone number.');
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="contact-page" style={{ paddingTop: '5.5rem' }}>
      
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #fed7aa'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: '#0f172a', marginBottom: '1rem' }}>
            Contact SebaPoint
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.6' }}>
            Get in touch with our document processing desk for swift trade license solutions.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          
          {/* Info Details */}
          <div>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Office & Support Desk
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
              Our support desk handles Zoning applications, NBR BIN (VAT) registrations, holding taxes, and corporate filings. You can call us, email us, or visit our desk in Dhaka.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Call Broker Support</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>01813-884475 / +880 1813-884475</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>sebapoint01@gmail.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Office Address</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <a 
                  href="https://www.facebook.com/sebapoint" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#16a34a',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                  className="facebook-link-hover"
                >
                  <Facebook size={22} fill="#16a34a" />
                  <span>Visit Our Facebook Page</span>
                  <ExternalLink size={14} />
                </a>

                <a 
                  href="https://wa.me/8801813884475" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#16a34a',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                  className="facebook-link-hover"
                >
                  <MessageCircle size={22} fill="#16a34a" color="#ffffff" style={{ strokeWidth: 1.5 }} />
                  <span>Chat on WhatsApp (+880 1813-884475)</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
              Inquire About Service
            </h3>

            {formSubmitted ? (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                color: '#14532d',
                textAlign: 'center'
              }}>
                <Sparkles size={36} style={{ color: '#16a34a', marginBottom: '1rem' }} />
                <h4 style={{ marginBottom: '0.5rem', color: '#14532d' }}>Inquiry Received!</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Thank you for contacting SebaPoint. One of our trade license specialists will review your details and contact you via phone within 2 hours.
                </p>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setFormSubmitted(false)}
                  style={{ marginTop: '1.25rem' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Abul Kalam" 
                    value={contactForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="01712XXXXXX" 
                      value={contactForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email (Optional)</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="kalam@gmail.com" 
                      value={contactForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Required Service</label>
                  <select 
                    className="form-control"
                    value={contactForm.service}
                    onChange={(e) => handleFormChange('service', e.target.value)}
                  >
                    {SERVICES_DATA.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Message / Business Details</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Tell us about your business type and location..."
                    value={contactForm.message}
                    onChange={(e) => handleFormChange('message', e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn" 
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    boxShadow: '0 4px 10px 0 rgba(22, 163, 74, 0.2)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                >
                  <Send size={16} />
                  <span>Send Inquiry Request</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

export default ContactPage;
