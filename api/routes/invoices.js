import express from 'express';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// POST create new invoice
router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Generate invoice number if not provided
    if (!invoiceData.invoiceNumber) {
      const count = await Invoice.countDocuments() + 1;
      invoiceData.invoiceNumber = `INV-${String(count).padStart(4, '0')}`;
    }
    
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Invoice number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  }
});

// PUT update invoice
router.put('/:id', async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    
    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
