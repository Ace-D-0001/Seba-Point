import React, { useState } from 'react';
import { Search, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

function InvoiceHistory({ invoices, onEditInvoice, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState(null); // stores invoice ID during network updates

  // Helper to format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  // Toggle paid/unpaid status
  const handleToggleStatus = async (invoice) => {
    const nextStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid';
    const amountPaid = nextStatus === 'Paid' ? invoice.total : 0;
    const balanceDue = nextStatus === 'Paid' ? 0 : invoice.total;

    setIsUpdating(invoice._id);
    try {
      const response = await fetch(`/api/invoices/${invoice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: nextStatus,
          amountPaid,
          balanceDue
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update invoice status.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action is permanent.')) {
      return;
    }

    setIsUpdating(invoiceId);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete invoice.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Filtering Logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client.email && inv.client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="history-view">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Invoice History</h1>
          <p>Search, filter, edit, and manage all your historical invoice records.</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={onRefresh}
          disabled={isUpdating !== null}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          <RefreshCw size={16} className={isUpdating ? 'spin-animation' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ 
          position: 'relative', 
          flex: 1, 
          minWidth: '260px' 
        }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by invoice #, client, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)' 
          }} />
        </div>

        {/* Status Filter */}
        <div style={{ width: '180px' }}>
          <select 
            className="form-control" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* History Table Container */}
      <div className="table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Balance Due</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv._id} style={{ opacity: isUpdating === inv._id ? 0.6 : 1 }}>
                <td style={{ fontWeight: 700 }}>{inv.invoiceNumber}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{inv.client.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inv.client.email}</div>
                </td>
                <td>{formatDate(inv.issueDate)}</td>
                <td>{formatDate(inv.dueDate)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(inv.total, inv.currency)}</td>
                <td style={{ 
                  color: inv.balanceDue > 0 ? 'var(--warning)' : 'var(--text-muted)',
                  fontWeight: inv.balanceDue > 0 ? 600 : 500
                }}>
                  {formatCurrency(inv.balanceDue, inv.currency)}
                </td>
                <td>
                  <span className={`badge badge-${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditInvoice(inv)}
                      title="Edit Invoice"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleStatus(inv)}
                      title={inv.status === 'Paid' ? "Mark as Unpaid" : "Mark as Paid"}
                    >
                      {inv.status === 'Paid' ? (
                        <>
                          <XCircle size={14} style={{ color: 'var(--danger)' }} />
                          <span>Unpay</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                          <span>Pay</span>
                        </>
                      )}
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDeleteInvoice(inv._id)}
                      style={{ color: 'var(--danger)' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                  No matching invoice records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceHistory;
