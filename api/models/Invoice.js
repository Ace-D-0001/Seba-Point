import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  taxRate: { type: Number, default: 0 }, // Individual line item tax %
  discount: { type: Number, default: 0 }, // Individual line item discount %
  amount: { type: Number, required: true, default: 0 } // Computed line item subtotal
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  paymentTerms: { type: String, default: 'Due on Receipt' },
  currency: { type: String, default: 'BDT' },
  accentColor: { type: String, default: '#2563eb' }, // Dynamically style PDFs
  
  sender: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    logoUrl: { type: String, default: '' }, // Data URI for base64 logos
    taxId: { type: String, default: '' }
  },
  
  client: {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    taxId: { type: String, default: '' }
  },
  
  items: [lineItemSchema],
  
  // Global Taxes, Discounts, Shipping
  globalDiscountRate: { type: Number, default: 0 }, // %
  globalTaxRate: { type: Number, default: 0 }, // %
  taxName: { type: String, default: 'Tax' },
  shippingFee: { type: Number, default: 0 },
  
  // Summaries
  subtotal: { type: Number, required: true, default: 0 },
  discountTotal: { type: Number, default: 0 },
  taxTotal: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, required: true, default: 0 },
  
  status: { 
    type: String, 
    enum: ['Paid', 'Unpaid', 'Overdue', 'Draft'], 
    default: 'Unpaid' 
  },
  notes: { type: String, default: '' },
  terms: { type: String, default: '' }
}, {
  timestamps: true
});

// Auto-adjust status to Overdue if unpaid and past due date
invoiceSchema.pre('save', function(next) {
  if (this.status === 'Unpaid' && this.dueDate && new Date(this.dueDate) < new Date()) {
    this.status = 'Overdue';
  }
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
