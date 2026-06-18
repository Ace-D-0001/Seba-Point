import React from 'react';
import { Download, Printer } from 'lucide-react';

function InvoicePreview({ invoiceData }) {
  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoiceData.currency || 'USD'
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Keep date exact without timezone offset shifts
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Dynamic Styles based on Accent Color
  const textAccent = { color: invoiceData.accentColor };
  const bgAccent = { backgroundColor: invoiceData.accentColor, color: '#fff' };
  const borderAccent = { borderBottom: `2px solid ${invoiceData.accentColor}` };

  // Trigger A4 high-fidelity PDF download
  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-preview-capture');
    
    // Configure PDF settings
    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right in mm
      filename:     `Invoice_${invoiceData.invoiceNumber || 'Draft'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Call CDN library
    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    } else {
      alert('PDF generation engine is still loading. Please wait a second and try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ position: 'sticky', top: '2.5rem' }}>
      
      {/* Action Bar */}
      <div className="no-print" style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '0.75rem', 
        marginBottom: '1rem' 
      }}>
        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
          <Printer size={15} />
          <span>Print</span>
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleDownloadPDF}>
          <Download size={15} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Styled A4 Sheet */}
      <div className="preview-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div 
          id="invoice-preview-capture" 
          className="invoice-preview-container" 
          style={{ padding: '3.5rem', backgroundColor: '#fff', minHeight: '842px' }}
        >
          
          {/* Header */}
          <div className="preview-header">
            <div>
              {invoiceData.sender.logoUrl ? (
                <img 
                  src={invoiceData.sender.logoUrl} 
                  className="preview-logo-placeholder" 
                  alt="Company Logo" 
                />
              ) : (
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#f1f5f9', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  border: '1px dashed #cbd5e1'
                }}>
                  No Logo
                </div>
              )}
              
              {/* Sender Details */}
              <div style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  {invoiceData.sender.name || 'Your Business Name'}
                </div>
                {invoiceData.sender.address && <div style={{ whiteSpace: 'pre-line' }}>{invoiceData.sender.address}</div>}
                {invoiceData.sender.phone && <div>Tel: {invoiceData.sender.phone}</div>}
                {invoiceData.sender.email && <div>Email: {invoiceData.sender.email}</div>}
                {invoiceData.sender.taxId && <div>Tax ID: {invoiceData.sender.taxId}</div>}
              </div>
            </div>

            <div className="preview-header-meta">
              <h2 style={textAccent}>INVOICE</h2>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>
                #{invoiceData.invoiceNumber || 'DRAFT'}
              </div>

              <div className="preview-meta-row">
                <span style={{ color: '#64748b' }}>Date:</span>
                <span>{formatDate(invoiceData.issueDate)}</span>
              </div>
              <div className="preview-meta-row">
                <span style={{ color: '#64748b' }}>Due Date:</span>
                <span>{formatDate(invoiceData.dueDate)}</span>
              </div>
              <div className="preview-meta-row">
                <span style={{ color: '#64748b' }}>Terms:</span>
                <span>{invoiceData.paymentTerms}</span>
              </div>
            </div>
          </div>

          {/* Billing Info Grid */}
          <div className="preview-billing-grid">
            <div className="billing-col">
              <h4>Bill To</h4>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '0.25rem' }}>
                {invoiceData.client.name || 'Client Business Name'}
              </div>
              {invoiceData.client.address && <p style={{ color: '#475569' }}>{invoiceData.client.address}</p>}
              {invoiceData.client.phone && <p style={{ color: '#475569' }}>Tel: {invoiceData.client.phone}</p>}
              {invoiceData.client.email && <p style={{ color: '#475569' }}>Email: {invoiceData.client.email}</p>}
              {invoiceData.client.taxId && <p style={{ color: '#475569' }}>Tax ID: {invoiceData.client.taxId}</p>}
            </div>
          </div>

          {/* Items Table */}
          <table className="preview-items-table">
            <thead>
              <tr>
                <th style={{ ...borderAccent, width: '55%' }}>Description</th>
                <th style={{ ...borderAccent, width: '10%', textAlign: 'right' }}>Qty</th>
                <th style={{ ...borderAccent, width: '15%', textAlign: 'right' }}>Price</th>
                <th style={{ ...borderAccent, width: '20%', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500, padding: '0.85rem 0.5rem' }}>
                    {item.description || 'Line item description'}
                  </td>
                  <td style={{ textAlign: 'right', color: '#475569' }}>
                    {parseFloat(item.quantity) || 0}
                  </td>
                  <td style={{ textAlign: 'right', color: '#475569' }}>
                    {formatCurrency(parseFloat(item.unitPrice) || 0)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(item.amount || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="preview-totals-section">
            <table className="preview-totals-table">
              <tbody>
                <tr>
                  <td style={{ color: '#64748b' }}>Subtotal:</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(invoiceData.subtotal)}
                  </td>
                </tr>
                
                {parseFloat(invoiceData.globalDiscountRate) > 0 && (
                  <tr>
                    <td style={{ color: '#64748b' }}>Discount ({invoiceData.globalDiscountRate}%):</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: 600 }}>
                      -{formatCurrency(invoiceData.discountTotal)}
                    </td>
                  </tr>
                )}

                {parseFloat(invoiceData.globalTaxRate) > 0 && (
                  <tr>
                    <td style={{ color: '#64748b' }}>{invoiceData.taxName || 'Tax'} ({invoiceData.globalTaxRate}%):</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(invoiceData.taxTotal)}
                    </td>
                  </tr>
                )}

                {parseFloat(invoiceData.shippingFee) > 0 && (
                  <tr>
                    <td style={{ color: '#64748b' }}>Shipping / Freight:</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(parseFloat(invoiceData.shippingFee))}
                    </td>
                  </tr>
                )}

                <tr className="total-row">
                  <td style={{ paddingLeft: '0', fontWeight: 700 }}>Total:</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, ...textAccent }}>
                    {formatCurrency(invoiceData.total)}
                  </td>
                </tr>

                {parseFloat(invoiceData.amountPaid) > 0 && (
                  <>
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>Amount Paid:</td>
                      <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>
                        {formatCurrency(invoiceData.amountPaid)}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #e2e2e2' }}>
                      <td style={{ fontWeight: 700, paddingBottom: '0' }}>Balance Due:</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, paddingBottom: '0' }}>
                        {formatCurrency(invoiceData.balanceDue)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Notes */}
          {invoiceData.notes && (
            <div className="preview-footer">
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Notes / Terms</div>
              <p style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: '#475569', lineHeight: '1.6' }}>{invoiceData.notes}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;
