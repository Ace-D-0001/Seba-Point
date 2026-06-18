import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoiceHistory from './components/InvoiceHistory';
import { Wifi, WifiOff } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('service-detail-')) return 'service-detail';
    const validViews = ['homepage', 'about', 'contact', 'dashboard', 'editor', 'history'];
    return validViews.includes(hash) ? hash : 'homepage';
  });
  const [selectedServiceId, setSelectedServiceId] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('service-detail-')) {
      return hash.replace('service-detail-', '');
    }
    return null;
  });
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Invoice object for editing
  const [dbState, setDbState] = useState('connecting'); // 'connecting', 'connected', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Sync hash changes from browser (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('service-detail-')) {
        setSelectedServiceId(hash.replace('service-detail-', ''));
        setCurrentView('service-detail');
      } else {
        const validViews = ['homepage', 'about', 'contact', 'dashboard', 'editor', 'history'];
        if (validViews.includes(hash)) {
          setCurrentView(hash);
        } else if (!hash) {
          setCurrentView('homepage');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when view changes
  useEffect(() => {
    if (currentView === 'service-detail' && selectedServiceId) {
      window.history.replaceState(null, '', `#service-detail-${selectedServiceId}`);
    } else {
      window.history.replaceState(null, '', `#${currentView}`);
    }
  }, [currentView, selectedServiceId]);

  // Fetch all invoices from backend
  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInvoices(data);
      setDbState('connected');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setDbState('error');
      setErrorMessage('Could not connect to MongoDB backend. Running in offline/demo mode.');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle switching views
  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view !== 'editor') {
      setSelectedInvoice(null);
    }
  };

  // Handle starting a new invoice
  const handleCreateNewInvoice = () => {
    setSelectedInvoice(null);
    setCurrentView('editor');
  };

  // Handle opening an invoice for editing
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('editor');
  };

  // Handle successful save/create/update of an invoice
  const handleInvoiceSaved = () => {
    fetchInvoices();
    setCurrentView('history');
  };

  const isSebaPointSite = ['homepage', 'about', 'contact', 'service-detail'].includes(currentView);

  if (isSebaPointSite) {
    return (
      <div className="seba-site-container">
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
        <main>
          {currentView === 'homepage' && (
            <Homepage 
              onSelectService={(serviceId) => {
                setSelectedServiceId(serviceId);
                handleNavigate('service-detail');
              }} 
              onNavigate={handleNavigate}
            />
          )}
          {currentView === 'about' && <AboutPage />}
          {currentView === 'contact' && <ContactPage />}
          {currentView === 'service-detail' && (
            <ServiceDetailPage 
              serviceId={selectedServiceId} 
              onNavigate={handleNavigate}
            />
          )}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onCreateInvoice={handleCreateNewInvoice} 
      />

      {/* Main Body Area */}
      <div className="main-content">
        
        {/* DB Status Banner */}
        {dbState === 'error' && (
          <div className="no-print" style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 500
          }}>
            <WifiOff size={18} />
            <span>{errorMessage} (Check MONGODB_URI in Vercel env settings)</span>
          </div>
        )}
        
        {dbState === 'connected' && (
          <div className="no-print" style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #dcfce7',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            zIndex: 1000
          }}>
            <Wifi size={14} />
            <span>Database Live</span>
          </div>
        )}

        {/* View Router */}
        {currentView === 'dashboard' && (
          <Dashboard 
            invoices={invoices} 
            onCreateInvoice={handleCreateNewInvoice}
            onEditInvoice={handleEditInvoice}
            dbState={dbState}
          />
        )}

        {currentView === 'editor' && (
          <InvoiceForm 
            invoice={selectedInvoice} 
            onSave={handleInvoiceSaved}
            onCancel={() => handleNavigate('history')}
            invoices={invoices}
          />
        )}

        {currentView === 'history' && (
          <InvoiceHistory 
            invoices={invoices} 
            onEditInvoice={handleEditInvoice}
            onRefresh={fetchInvoices}
          />
        )}
      </div>
    </div>
  );
}

export default App;
