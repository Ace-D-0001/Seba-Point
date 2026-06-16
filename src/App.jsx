import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoiceHistory from './components/InvoiceHistory';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setCurrentView('editor');
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('editor');
  };

  const handleDeleteInvoice = async (id) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleUpdateInvoiceStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      const url = selectedInvoice 
        ? `/api/invoices/${selectedInvoice._id}`
        : '/api/invoices';
      
      const method = selectedInvoice ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });
      
      if (response.ok) {
        fetchInvoices();
        setCurrentView('dashboard');
        setSelectedInvoice(null);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            invoices={invoices}
            onCreateInvoice={handleCreateInvoice}
          />
        );
      case 'editor':
        return (
          <InvoiceForm 
            invoice={selectedInvoice}
            onSave={handleSaveInvoice}
            onCancel={() => setCurrentView('dashboard')}
          />
        );
      case 'history':
        return (
          <InvoiceHistory 
            invoices={invoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onUpdateStatus={handleUpdateInvoiceStatus}
          />
        );
      default:
        return <Dashboard invoices={invoices} onCreateInvoice={handleCreateInvoice} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main style={{ flex: 1, padding: '24px' }}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
