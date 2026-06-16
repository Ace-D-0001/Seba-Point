import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

const invoiceSchema = new mongoose.Schema({
  // Invoice basics
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  paymentTerms: { type: String, default: 'Net 30' },
  
  // Sender details
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, default: '' }
  },
  
  // Client details
  client: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  
  // Line items
  items: [lineItemSchema],
  
  // Global settings
  taxRate: { type: Number, default: 0 },
  discountRate: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  currency: { type: String, default: '$' },
  
  // Calculations
  subtotal: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  
  // Status
  status: { 
    type: String, 
    enum: ['Paid', 'Unpaid', 'Overdue'], 
    default: 'Unpaid' 
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update calculations
invoiceSchema.pre('save', function(next) {
  if (!this.items || this.items.length === 0) {
    this.subtotal = 0;
    this.totalTax = 0;
    this.totalDiscount = 0;
    this.total = 0;
    this.balanceDue = this.status === 'Paid' ? 0 : this.total;
    next();
    return;
  }

  // Calculate item totals and subtotal
  let subtotal = 0;
  this.items.forEach(item => {
    const itemTotal = (item.quantity * item.unitPrice);
    const itemTax = itemTotal * (item.tax / 100);
    const itemDiscount = itemTotal * (item.discount / 100);
    item.total = itemTotal + itemTax - itemDiscount;
    subtotal += item.total;
  });

  this.subtotal = subtotal;

  // Apply global tax and discount
  this.totalTax = subtotal * (this.taxRate / 100);
  this.totalDiscount = subtotal * (this.discountRate / 100);
  
  // Calculate final total
  this.total = subtotal + this.totalTax - this.totalDiscount + this.shippingFee;
  
  // Update balance based on status
  this.balanceDue = this.status === 'Paid' ? 0 : this.total;
  
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Invoice', invoiceSchema);
