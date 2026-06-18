import React, { useState, useEffect } from 'react';
import InvoicePreview from './InvoicePreview';
import { 
  Trash2, Plus, Save, X, Calendar, DollarSign, Settings2, FileText, Building2, User 
} from 'lucide-react';

const DEFAULT_SENDER_KEY = 'seba_invoice_default_sender';
const DRAFT_KEY = 'seba_invoice_form_draft';

function InvoiceForm({ invoice, onSave, onCancel, invoices }) {
  // Try to load initial state:
  // 1. If we are editing an existing invoice, use it.
  // 2. If not, check if there's a draft in localStorage.
  // 3. Otherwise, use fresh defaults.
  const getInitialState = () => {
    if (invoice) {
      // Format dates properly for input fields (YYYY-MM-DD)
      return {
        ...invoice,
        issueDate: invoice.issueDate ? invoice.issueDate.split('T')[0] : '',
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : ''
      };
    }

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error('Failed to parse draft, resetting defaults', e);
      }
    }

    // Default sender info from history or empty
    const savedDefaultSender = localStorage.getItem(DEFAULT_SENDER_KEY);
    const defaultSender = savedDefaultSender ? JSON.parse(savedDefaultSender) : {
      name: '',
      email: '',
      address: '',
      phone: '',
      logoUrl: '',
      taxId: ''
    };

    // Calculate a safe default invoice number
    const count = invoices.length + 1;
    const pad = (num, size) => {
      let s = "0000" + num;
      return s.substring(s.length - size);
    };
    const suggestedNum = `INV-${pad(count, 4)}`;

    const today = new Date().toISOString().split('T')[0];
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      invoiceNumber: suggestedNum,
      issueDate: today,
      dueDate: twoWeeksLater,
      paymentTerms: 'Net 14',
      currency: 'USD',
      accentColor: '#16a34a',
      sender: defaultSender,
      client: {
        name: '',
        email: '',
        address: '',
        phone: '',
        taxId: ''
      },
      items: [
        { description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, amount: 0 }
      ],
      globalDiscountRate: 0,
      globalTaxRate: 0,
      taxName: 'Tax',
      shippingFee: 0,
      subtotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      total: 0,
      amountPaid: 0,
      balanceDue: 0,
      status: 'Unpaid',
      notes: '',
      terms: ''
    };
  };

  const [invoiceData, setInvoiceData] = useState(getInitialState);
  const [logoInput, setLogoInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save draft in localStorage (only if not editing an existing invoice)
  useEffect(() => {
    if (!invoice) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(invoiceData));
    }
  }, [invoiceData, invoice]);

  // Recalculate totals whenever invoice items, discounts, taxes or fees change
  useEffect(() => {
    const calculatedItems = invoiceData.items.map(item => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const discountPct = parseFloat(item.discount) || 0;
      const taxPct = parseFloat(item.taxRate) || 0;

      // Base total for item
      let base = qty * price;
      // Item discount
      let discVal = base * (discountPct / 100);
      let afterDiscount = base - discVal;
      // Item tax
      let taxVal = afterDiscount * (taxPct / 100);
      let finalAmount = afterDiscount + taxVal;

      return {
        ...item,
        amount: Math.round(finalAmount * 100) / 100
      };
    });

    const subtotal = calculatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Apply global discount
    const globalDiscount = subtotal * ((parseFloat(invoiceData.globalDiscountRate) || 0) / 100);
    const afterGlobalDiscount = subtotal - globalDiscount;
    
    // Apply global tax
    const globalTax = afterGlobalDiscount * ((parseFloat(invoiceData.globalTaxRate) || 0) / 100);
    
    const shipping = parseFloat(invoiceData.shippingFee) || 0;
    const grandTotal = afterGlobalDiscount + globalTax + shipping;
    
    const total = Math.round(grandTotal * 100) / 100;
    const amountPaid = parseFloat(invoiceData.amountPaid) || 0;
    const balanceDue = Math.max(0, Math.round((total - amountPaid) * 100) / 100);

    // Update state without causing infinite loop
    setInvoiceData(prev => ({
      ...prev,
      items: calculatedItems.map((item, idx) => ({
        ...item,
        amount: calculatedItems[idx].amount
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(globalDiscount * 100) / 100,
      taxTotal: Math.round(globalTax * 100) / 100,
      total,
      balanceDue
    }));
  }, [
    invoiceData.items.map(item => `${item.quantity}-${item.unitPrice}-${item.discount}-${item.taxRate}`).join(','),
    invoiceData.globalDiscountRate,
    invoiceData.globalTaxRate,
    invoiceData.shippingFee,
    invoiceData.amountPaid
  ]);

  // Handle nested object input changes (sender, client)
  const handleNestedChange = (section, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle item input updates
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  // Add line item row
  const handleAddItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, amount: 0 }
      ]
    }));
  };

  // Remove line item row
  const handleRemoveItem = (index) => {
    if (invoiceData.items.length === 1) return; // Keep at least one row
    const newItems = invoiceData.items.filter((_, idx) => idx !== index);
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  // Logo upload processing
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image is too large. Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      handleNestedChange('sender', 'logoUrl', uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded logo
  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    handleNestedChange('sender', 'logoUrl', '');
  };

  // Save to Database
  const handleSaveInvoice = async () => {
    if (!invoiceData.invoiceNumber.trim()) {
      setErrorMsg('Invoice number is required.');
      return;
    }
    if (!invoiceData.client.name.trim()) {
      setErrorMsg('Client name is required.');
      return;
    }
    if (invoiceData.items.some(item => !item.description.trim())) {
      setErrorMsg('Please describe all line items.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      // Save sender as default for next time
      localStorage.setItem(DEFAULT_SENDER_KEY, JSON.stringify(invoiceData.sender));

      const method = invoice ? 'PUT' : 'POST';
      const url = invoice ? `/api/invoices/${invoice._id}` : '/api/invoices';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save invoice');
      }

      // Success - remove local draft cache
      localStorage.removeItem(DRAFT_KEY);
      onSave();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server connection failed. Could not save to database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="invoice-editor-view">
      {/* Header */}
      <div className="page-header no-print">
        <div className="page-title">
          <h1>{invoice ? `Edit Invoice ${invoice.invoiceNumber}` : 'Create New Invoice'}</h1>
          <p>Configure layouts, calculations, client details, and generate PDFs.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSaveInvoice}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Invoice'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="no-print" style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          color: '#ef4444',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 500
        }}>
          {errorMsg}
        </div>
      )}

      {/* Grid: Form on Left, Live Preview on Right */}
      <div className="invoice-grid">
        
        {/* Left Side: Editor Form */}
        <div className="form-card no-print" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section: Logo & Layout */}
          <div>
            <div className="form-section-title">
              <Settings2 size={16} />
              <span>Branding & General Options</span>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Upload Logo</label>
                <div className="logo-uploader" onClick={() => document.getElementById('logo-file-input').click()}>
                  <input 
                    type="file" 
                    id="logo-file-input" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    style={{ display: 'none' }}
                  />
                  {invoiceData.sender.logoUrl ? (
                    <div className="logo-preview-container">
                      <img src={invoiceData.sender.logoUrl} alt="Logo preview" />
                      <button type="button" onClick={handleRemoveLogo}>✕</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Click to upload (JPG, PNG, max 2MB)
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Theme Accent Color</label>
                <input 
                  type="color" 
                  className="form-control" 
                  value={invoiceData.accentColor} 
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, accentColor: e.target.value }))}
                  style={{ height: '44px', padding: '4px', cursor: 'pointer' }}
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select 
                  className="form-control" 
                  value={invoiceData.currency}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, currency: e.target.value }))}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="SGD">SGD ($)</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Invoice Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. INV-1001" 
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Payment Terms</label>
                <select 
                  className="form-control" 
                  value={invoiceData.paymentTerms}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 7">Net 7</option>
                  <option value="Net 14">Net 14</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={invoiceData.issueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, issueDate: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Section: Sender Info */}
          <div>
            <div className="form-section-title">
              <Building2 size={16} />
              <span>Bill From (Your Business)</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="ACME Corp" 
                  value={invoiceData.sender.name}
                  onChange={(e) => handleNestedChange('sender', 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="billing@acme.com" 
                  value={invoiceData.sender.email}
                  onChange={(e) => handleNestedChange('sender', 'email', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Address</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="123 Corporate St, Ste 100, Metropolis" 
                  value={invoiceData.sender.address}
                  onChange={(e) => handleNestedChange('sender', 'address', e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+1 (555) 019-2834" 
                  value={invoiceData.sender.phone}
                  onChange={(e) => handleNestedChange('sender', 'phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Tax ID / Registration</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="EIN-9928347" 
                  value={invoiceData.sender.taxId}
                  onChange={(e) => handleNestedChange('sender', 'taxId', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Client Info */}
          <div>
            <div className="form-section-title">
              <User size={16} />
              <span>Bill To (Client Details)</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name / Business *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Seba Global" 
                  value={invoiceData.client.name}
                  onChange={(e) => handleNestedChange('client', 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Client Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="billing@sebaglobal.com" 
                  value={invoiceData.client.email}
                  onChange={(e) => handleNestedChange('client', 'email', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Billing Address</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="456 Client Boulevard, Tower C, London" 
                  value={invoiceData.client.address}
                  onChange={(e) => handleNestedChange('client', 'address', e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Client Phone</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+44 20 7946 0958" 
                  value={invoiceData.client.phone}
                  onChange={(e) => handleNestedChange('client', 'phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Client Tax ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="VAT-GB1234567" 
                  value={invoiceData.client.taxId}
                  onChange={(e) => handleNestedChange('client', 'taxId', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Line Items */}
          <div>
            <div className="form-section-title">
              <FileText size={16} />
              <span>Line Items</span>
            </div>
            
            {invoiceData.items.map((item, index) => (
              <div 
                key={index} 
                className="form-row" 
                style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  paddingBottom: '1rem', 
                  marginBottom: '1rem',
                  gridTemplateColumns: '2fr 0.6fr 1fr 0.8fr'
                }}
              >
                <div className="form-group">
                  <label>Description *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Premium Web Development Service" 
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Qty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1"
                    step="any"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Unit Price</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Total</label>
                    <div style={{ 
                      padding: '0.75rem 0.5rem', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      textAlign: 'right',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem'
                    }}>
                      {item.amount.toFixed(2)}
                    </div>
                  </div>
                  {invoiceData.items.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => handleRemoveItem(index)}
                      style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', height: '44px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={handleAddItem}
              style={{ marginTop: '0.5rem' }}
            >
              <Plus size={14} />
              <span>Add Item</span>
            </button>
          </div>

          {/* Section: Global Settings & Subtotals */}
          <div>
            <div className="form-section-title">
              <DollarSign size={16} />
              <span>Taxes, Discounts & Payments</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Global Discount (%)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  max="100"
                  value={invoiceData.globalDiscountRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, globalDiscountRate: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Tax Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={invoiceData.taxName}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, taxName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Global Tax Rate (%)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  max="100"
                  value={invoiceData.globalTaxRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, globalTaxRate: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Shipping / Freight Fee</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  step="any"
                  value={invoiceData.shippingFee}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, shippingFee: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Amount Already Paid</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  step="any"
                  value={invoiceData.amountPaid}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, amountPaid: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-control" 
                  value={invoiceData.status}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label>Footer Notes / Terms</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Thank you for your business. Payment is due within 14 days." 
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Live A4 PDF Preview Container */}
        <div>
          <InvoicePreview invoiceData={invoiceData} />
        </div>

      </div>
    </div>
  );
}

export default InvoiceForm;
