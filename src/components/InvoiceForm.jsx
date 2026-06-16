import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';

function InvoiceForm({ invoice, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'Net 30',
    sender: {
      name: '',
      email: '',
      address: '',
      logo: ''
    },
    client: {
      name: '',
      email: '',
      address: ''
    },
    items: [{
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      discount: 0,
      total: 0
    }],
    taxRate: 0,
    discountRate: 0,
    shippingFee: 0,
    currency: '$',
    status: 'Unpaid'
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        date: invoice.date ? invoice.date.split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : ''
      });
    }
  }, [invoice]);

  const updateField = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0,
        discount: 0,
        total: 0
      }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: parseFloat(value) || 0 };
          // Calculate item total
          const itemTotal = updatedItem.quantity * updatedItem.unitPrice;
          const itemTax = itemTotal * (updatedItem.tax / 100);
          const itemDiscount = itemTotal * (updatedItem.discount / 100);
          updatedItem.total = itemTotal + itemTax - itemDiscount;
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const totalTax = subtotal * (formData.taxRate / 100);
    const totalDiscount = subtotal * (formData.discountRate / 100);
    const total = subtotal + totalTax - totalDiscount + formData.shippingFee;
    
    return { subtotal, totalTax, totalDiscount, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const totals = calculateTotals();
    const invoiceData = {
      ...formData,
      ...totals,
      balanceDue: formData.status === 'Paid' ? 0 : totals.total
    };
    
    onSave(invoiceData);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700' }}>
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} className="btn btn-secondary">
            <X size={18} />
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            <Save size={18} />
            Save Invoice
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column - Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Invoice Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Invoice Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.invoiceNumber}
                onChange={(e) => updateField(null, 'invoiceNumber', e.target.value)}
                placeholder="INV-0001"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => updateField(null, 'dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Terms</label>
            <select
              className="form-input"
              value={formData.paymentTerms}
              onChange={(e) => updateField(null, 'paymentTerms', e.target.value)}
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '24px 0 16px' }}>
            Sender Information
          </h4>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.sender.name}
              onChange={(e) => updateField('sender', 'name', e.target.value)}
              placeholder="Your Company"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.sender.email}
              onChange={(e) => updateField('sender', 'email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-input"
              rows="2"
              value={formData.sender.address}
              onChange={(e) => updateField('sender', 'address', e.target.value)}
              placeholder="123 Business St, City, State 12345"
            />
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '24px 0 16px' }}>
            Client Information
          </h4>
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.client.name}
              onChange={(e) => updateField('client', 'name', e.target.value)}
              placeholder="Client Company"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.client.email}
              onChange={(e) => updateField('client', 'email', e.target.value)}
              placeholder="client@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-input"
              rows="2"
              value={formData.client.address}
              onChange={(e) => updateField('client', 'address', e.target.value)}
              placeholder="456 Client Ave, City, State 67890"
            />
          </div>
        </div>

        {/* Right Column - Line Items & Preview */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Line Items
          </h3>

          {formData.items.map((item, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(51, 65, 85, 0.5)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Item {index + 1}</span>
                {formData.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Qty</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Total</label>
                  <div className="form-input" style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none' }}>
                    ${item.total.toFixed(2)}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Tax %</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.tax}
                    onChange={(e) => updateItem(index, 'tax', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '12px' }}>Discount %</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.discount}
                    onChange={(e) => updateItem(index, 'discount', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          ))}

          <button onClick={addItem} className="btn btn-secondary" style={{ width: '100%', marginBottom: '24px' }}>
            <Plus size={18} />
            Add Line Item
          </button>

          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Global Settings
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Tax Rate %</label>
              <input
                type="number"
                className="form-input"
                value={formData.taxRate}
                onChange={(e) => updateField(null, 'taxRate', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Discount %</label>
              <input
                type="number"
                className="form-input"
                value={formData.discountRate}
                onChange={(e) => updateField(null, 'discountRate', e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Shipping</label>
              <input
                type="number"
                className="form-input"
                value={formData.shippingFee}
                onChange={(e) => updateField(null, 'shippingFee', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Summary */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '8px'
          }}>
            {(() => {
              const { subtotal, totalTax, totalDiscount, total } = calculateTotals();
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Tax ({formData.taxRate}%):</span>
                    <span>${totalTax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Discount ({formData.discountRate}%):</span>
                    <span>-${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Shipping:</span>
                    <span>${formData.shippingFee.toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(99, 102, 241, 0.3)',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;
