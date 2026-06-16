import React, { useState } from 'react';
import { Search, Edit, Trash2, Download, Eye } from 'lucide-react';
import html2pdf from 'html2pdf.js';

function InvoiceHistory({ invoices, onEdit, onDelete, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadPDF = async (invoice) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h1 style="color: #6366f1; margin-bottom: 8px;">INVOICE</h1>
            <p style="color: #64748b;">${invoice.invoiceNumber}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin-bottom: 8px;">${invoice.sender.name}</h3>
            <p style="color: #64748b; font-size: 14px;">${invoice.sender.email}</p>
            <p style="color: #64748b; font-size: 14px;">${invoice.sender.address}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <p style="font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Bill To:</p>
          <h4 style="margin-bottom: 4px;">${invoice.client.name}</h4>
          <p style="color: #64748b; font-size: 14px;">${invoice.client.email}</p>
          <p style="color: #64748b; font-size: 14px;">${invoice.client.address}</p>
        </div>
        
        <div style="display: flex; gap: 20px; margin-bottom: 30px;">
          <div>
            <p style="font-size: 12px; text-transform: uppercase; color: #64748b;">Invoice Date</p>
            <p style="font-weight: 600;">${new Date(invoice.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p style="font-size: 12px; text-transform: uppercase; color: #64748b;">Due Date</p>
            <p style="font-weight: 600;">${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p style="font-size: 12px; text-transform: uppercase; color: #64748b;">Status</p>
            <p style="font-weight: 600; color: ${invoice.status === 'Paid' ? '#10b981' : invoice.status === 'Overdue' ? '#ef4444' : '#f59e0b'};">${invoice.status}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Description</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.description}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">$${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 250px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #64748b;">Subtotal:</span>
              <span>$${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #64748b;">Tax (${invoice.taxRate}%):</span>
              <span>$${invoice.totalTax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #64748b;">Discount (${invoice.discountRate}%):</span>
              <span>-$${invoice.totalDiscount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #64748b;">Shipping:</span>
              <span>$${invoice.shippingFee.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #6366f1; margin-top: 8px; font-weight: 700; font-size: 18px;">
              <span>Total:</span>
              <span>$${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Invoice History
          </h2>
          <p style={{ color: '#94a3b8' }}>
            Manage and track all your invoices
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }} 
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by invoice number or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        {filteredInvoices.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Invoice #</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Client</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Date</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Due Date</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px', color: '#94a3b8', fontWeight: '500', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice._id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px', color: '#f1f5f9', fontWeight: '500' }}>
                    {invoice.invoiceNumber}
                  </td>
                  <td style={{ padding: '12px', color: '#f1f5f9' }}>{invoice.client.name}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', color: '#f1f5f9', fontWeight: '500' }}>
                    ${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`status-badge status-${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => onEdit(invoice)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px' }}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px' }}
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      <select
                        className="form-input"
                        value={invoice.status}
                        onChange={(e) => onUpdateStatus(invoice._id, e.target.value)}
                        style={{ padding: '6px 8px', fontSize: '12px' }}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
                            onDelete(invoice._id);
                          }
                        }}
                        className="btn btn-danger"
                        style={{ padding: '6px 10px' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <FileText size={48} style={{ color: '#334155', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No invoices found
            </h3>
            <p style={{ color: '#94a3b8' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first invoice to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple FileText icon component for the empty state
const FileText = ({ size, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default InvoiceHistory;
