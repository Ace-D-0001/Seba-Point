import express from 'express';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices: ' + error.message });
  }
});

// GET a single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice: ' + error.message });
  }
});

// POST create a new invoice
router.post('/', async (req, res) => {
  try {
    const { invoiceNumber } = req.body;
    
    // Check if invoice number already exists
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ 
        error: `Invoice number "${invoiceNumber}" already exists. Please choose a different number.` 
      });
    }

    const newInvoice = new Invoice(req.body);
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice: ' + error.message });
  }
});

// PUT update an invoice
router.put('/:id', async (req, res) => {
  try {
    const { invoiceNumber } = req.body;
    
    // Check if invoice number is being changed and is already taken by another invoice
    if (invoiceNumber) {
      const dupeInvoice = await Invoice.findOne({ 
        invoiceNumber, 
        _id: { $ne: req.params.id } 
      });
      if (dupeInvoice) {
        return res.status(400).json({ 
          error: `Invoice number "${invoiceNumber}" is already in use by another invoice.` 
        });
      }
    }

    // Update the invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice: ' + error.message });
  }
});

// DELETE an invoice
router.delete('/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice: ' + error.message });
  }
});

export default router;
