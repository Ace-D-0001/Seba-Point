import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Invoice from './models/Invoice.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://23303156_db_user:IKA12UtLBton4q00@ork.lguixt1.mongodb.net/sebainvoice?retryWrites=true&w=majority&appName=ork';
const DB_FILE = path.join(process.cwd(), 'local-db.json');

const clientsPool = [
  { name: 'Tech Solutions Inc', email: 'billing@techsol.com', address: '120 Innovation Way, Silicon Valley, CA 94025', phone: '+1 (555) 019-2834', taxId: 'TX-99887766' },
  { name: 'Global Logistics Ltd', email: 'accounts@globallog.com', address: '456 Shipping Blvd, Harbour Front, Singapore', phone: '+65 6789 0123', taxId: 'SG-88271635' },
  { name: 'Daraz Bangladesh Ltd', email: 'finance@daraz.com.bd', address: 'Asfia Tower, House 76, Road 11, Banani, Dhaka-1213', phone: '+880 1711 000111', taxId: 'TIN-4827163548' },
  { name: 'Pathao Bangladesh Ltd', email: 'billing@pathao.com', address: 'House 56, Road 2A, Dhanmondi, Dhaka-1209', phone: '+880 1819 222333', taxId: 'TIN-9918273645' },
  { name: 'Banglalink Digital', email: 'accounts@banglalink.net', address: 'Tiger\'s Den, House 4, SW(H), Bir Uttam Mir Shawkat Sharak, Gulshan-1, Dhaka-1212', phone: '+880 1911 333444', taxId: 'TIN-7738291048' },
  { name: 'Apex Footwear Ltd', email: 'finance@apexfootwear.com', address: 'House 6, Road 137, Gulshan-1, Dhaka-1212', phone: '+880 1730 444555', taxId: 'TIN-5548291047' },
  { name: 'Walton Hi-Tech Industries', email: 'billing@waltonbd.com', address: 'Chandra, Kaliakair, Gazipur, Bangladesh', phone: '+880 1678 555666', taxId: 'TIN-3329104827' },
  { name: 'Grameenphone Ltd', email: 'billing@grameenphone.com', address: 'GPHOUSE, Basundhara, Baridhara, Dhaka-1229', phone: '+880 1711 555777', taxId: 'TIN-1129304827' },
  { name: 'bKash Limited', email: 'finance@bkash.com', address: 'Sh স্বাধীনতা Bhaban, 8 Motijheel C/A, Dhaka-1000', phone: '+880 1841 888999', taxId: 'TIN-4482910384' },
  { name: 'Shajgoj Limited', email: 'billing@shajgoj.com', address: 'House 14, Road 6, Sector 3, Uttara, Dhaka-1230', phone: '+880 1612 999111', taxId: 'TIN-8849201934' },
  { name: 'ShopUp Ltd', email: 'finance@shopup.com.bd', address: 'SKS Tower, Level 8, Mohakhali, Dhaka-1212', phone: '+880 1755 666777', taxId: 'TIN-2283940193' },
  { name: 'Brain Station 23', email: 'billing@brainstation23.com', address: '8th Floor, Bir Uttam Mir Shawkat Sarak, Dhaka-1212', phone: '+880 1844 111222', taxId: 'TIN-6639201938' },
  { name: 'Chaldal Inc', email: 'accounts@chaldal.com', address: 'House 22, Road 4, Sector 4, Uttara, Dhaka-1230', phone: '+880 1713 000222', taxId: 'TIN-1192038472' },
  { name: 'Sheba XYZ', email: 'finance@sheba.xyz', address: 'House 11, Road 2, Gulshan-1, Dhaka-1212', phone: '+880 1681 444333', taxId: 'TIN-7739201837' },
  { name: 'Paperfly Ltd', email: 'billing@paperfly.com', address: 'House 43, Road 11, Sector 6, Uttara, Dhaka-1230', phone: '+880 1912 666888', taxId: 'TIN-9938201948' }
];

const serviceItemsPool = [
  { desc: 'Trade License Filing & Processing', priceMin: 2000, priceMax: 8000 },
  { desc: 'Zoning & Holding Tax Registration', priceMin: 3000, priceMax: 10000 },
  { desc: 'VAT/BIN Certificate Application', priceMin: 1500, priceMax: 5000 },
  { desc: 'RJSC Company Name Clearance', priceMin: 1000, priceMax: 3000 },
  { desc: 'Memorandum of Association Drafting', priceMin: 5000, priceMax: 15000 },
  { desc: 'IRC/ERC Import/Export License Audits', priceMin: 4500, priceMax: 20000 },
  { desc: 'Fire License Registration Support', priceMin: 3500, priceMax: 12000 },
  { desc: 'Environmental Clearance Certificate', priceMin: 8000, priceMax: 30000 },
  { desc: 'Corporate Tax Assessment Consulting', priceMin: 5000, priceMax: 25000 },
  { desc: 'Trademark Registration Filing', priceMin: 4000, priceMax: 15000 },
  { desc: 'Customs Bonded Warehouse License Consultancy', priceMin: 15000, priceMax: 60000 },
  { desc: 'Local Government Approvals & Brokerage', priceMin: 3000, priceMax: 15000 }
];

const accentColors = ['#16a34a', '#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#ea580c'];
const paymentTermsPool = ['Due on Receipt', 'Net 14', 'Net 30', 'Net 60'];
const notesPool = [
  'Thank you for your business. Please make payments via Bank Transfer to Seba Point account.',
  'We appreciate your business! Please pay within the due date to avoid government fines or renewal delays.',
  'This is a computer-generated invoice. No signature is required. Contact hello@sebapoint.com for details.',
  'Special corporate discount applied as per annual SLA agreement. Thank you.',
  'Please reference the invoice number on your wire transfer detail. Thank you.'
];

function generateRealisticInvoices() {
  const invoices = [];
  const startYear = 2024;
  const startMonth = 9; // October (0-indexed 9)
  const endYear = 2026;
  const endMonth = 5; // June (0-indexed 5)

  let counter = 1001;

  for (let year = startYear; year <= endYear; year++) {
    const minM = (year === startYear) ? startMonth : 0;
    const maxM = (year === endYear) ? endMonth : 11;

    for (let month = minM; month <= maxM; month++) {
      // 5 to 10 invoices per month
      const count = Math.floor(Math.random() * 6) + 5; 
      
      for (let i = 0; i < count; i++) {
        // Generate issueDate inside that specific month
        const day = Math.floor(Math.random() * 28) + 1;
        const issueDate = new Date(year, month, day, 12, 0, 0);

        // Due date usually 14 or 30 days after
        const termDays = Math.random() > 0.5 ? 14 : 30;
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + termDays);

        // Status logic
        const now = new Date(2026, 5, 27, 23, 0, 0); // Mock current local time
        let status = 'Paid';
        if (dueDate > now) {
          const rand = Math.random();
          if (rand < 0.05) status = 'Draft';
          else if (rand < 0.3) status = 'Unpaid';
          else status = 'Paid';
        } else {
          const rand = Math.random();
          if (rand < 0.03) status = 'Draft';
          else if (rand < 0.12) status = 'Overdue';
          else if (rand < 0.05) status = 'Unpaid'; 
          else status = 'Paid';
        }

        const client = clientsPool[Math.floor(Math.random() * clientsPool.length)];
        const currency = 'BDT';
        
        // 2 to 8 line items
        const itemsCount = Math.floor(Math.random() * 7) + 2; 
        const items = [];
        let subtotal = 0;

        const selectedServices = [...serviceItemsPool].sort(() => 0.5 - Math.random()).slice(0, itemsCount);

        for (let j = 0; j < itemsCount; j++) {
          const svc = selectedServices[j];
          const qty = Math.floor(Math.random() * 4) + 1; // 1 to 4
          let price = Math.floor(Math.random() * (svc.priceMax - svc.priceMin + 1)) + svc.priceMin;

          // Individual item tax / discount
          const discountPct = Math.random() > 0.8 ? 5 : 0;
          const taxPct = Math.random() > 0.85 ? 5 : 0;

          const base = qty * price;
          const discVal = base * (discountPct / 100);
          const afterDiscount = base - discVal;
          const taxVal = afterDiscount * (taxPct / 100);
          const finalAmount = Math.round((afterDiscount + taxVal) * 100) / 100;

          subtotal += base; // raw subtotal

          items.push({
            description: svc.desc,
            quantity: qty,
            unitPrice: price,
            taxRate: taxPct,
            discount: discountPct,
            amount: finalAmount
          });
        }

        // Global values
        const globalDiscountRate = Math.random() > 0.85 ? 5 : 0;
        const globalTaxRate = Math.random() > 0.75 ? 5 : 0;
        const shippingFee = Math.random() > 0.8 ? 500 : 0;

        const globalDiscount = subtotal * (globalDiscountRate / 100);
        const afterGlobalDiscount = subtotal - globalDiscount;
        const globalTax = afterGlobalDiscount * (globalTaxRate / 100);
        const grandTotal = Math.round((afterGlobalDiscount + globalTax + shippingFee) * 100) / 100;

        let amountPaid = 0;
        if (status === 'Paid') {
          amountPaid = grandTotal;
        } else if (status === 'Draft') {
          amountPaid = 0;
        } else {
          // Unpaid/Overdue: occasionally partially paid
          amountPaid = Math.random() > 0.7 ? Math.round((grandTotal * 0.3) * 100) / 100 : 0;
        }

        const balanceDue = Math.round((grandTotal - amountPaid) * 100) / 100;

        const invoice = {
          invoiceNumber: `INV-${year}${String(month + 1).padStart(2, '0')}-${String(counter++).padStart(4, '0')}`,
          issueDate: issueDate.toISOString(),
          dueDate: dueDate.toISOString(),
          paymentTerms: paymentTermsPool[Math.floor(Math.random() * paymentTermsPool.length)],
          currency: currency,
          accentColor: accentColors[Math.floor(Math.random() * accentColors.length)],
          sender: {
            name: 'Seba Point',
            email: 'hello@sebapoint.com',
            address: 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh',
            phone: '+880 1813-884475',
            logoUrl: '/logo.png',
            taxId: 'TIN-88392019485'
          },
          client: client,
          items: items,
          globalDiscountRate: globalDiscountRate,
          globalTaxRate: globalTaxRate,
          taxName: 'VAT',
          shippingFee: shippingFee,
          subtotal: Math.round(subtotal * 100) / 100,
          discountTotal: Math.round(globalDiscount * 100) / 100,
          taxTotal: Math.round(globalTax * 100) / 100,
          total: grandTotal,
          amountPaid: amountPaid,
          balanceDue: balanceDue,
          status: status,
          notes: notesPool[Math.floor(Math.random() * notesPool.length)],
          terms: 'Payment is due within invoice due date terms. High interest rate applies to overdue invoices.',
          createdAt: issueDate.toISOString(),
          updatedAt: issueDate.toISOString()
        };

        invoices.push(invoice);
      }
    }
  }

  return invoices;
}

async function seedDatabase() {
  const generated = generateRealisticInvoices();
  
  // Sort by issue date descending
  generated.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

  // 1. Seed MongoDB
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Clearing old invoices...');
    await Invoice.deleteMany({});
    console.log('Cleared MongoDB collection. Inserting new realistic invoices...');
    
    for (let i = 0; i < generated.length; i += 50) {
      const batch = generated.slice(i, i + 50);
      await Invoice.insertMany(batch);
    }
    console.log(`Successfully seeded ${generated.length} invoices in MongoDB.`);
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }

  // 2. Seed local-db.json
  try {
    console.log(`Writing to local JSON DB file: ${DB_FILE}`);
    let db = { users: [], services: [], websettings: [], invoices: [] };
    if (fs.existsSync(DB_FILE)) {
      try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      } catch (e) {
        console.error('Failed to parse existing local-db.json, resetting.');
      }
    }
    
    const localInvoices = generated.map(inv => {
      const copy = JSON.parse(JSON.stringify(inv));
      copy._id = Math.random().toString(36).substring(2, 11);
      return copy;
    });

    db.invoices = localInvoices;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    console.log(`Successfully seeded ${localInvoices.length} invoices in local-db.json.`);
    
    // Analyze distribution
    const distribution = {};
    generated.forEach(inv => {
      const d = new Date(inv.issueDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      distribution[key] = (distribution[key] || 0) + 1;
    });

    console.log('\n--- DATA VERIFICATION SUMMARY ---');
    console.log(`Total Invoices Created: ${generated.length}`);
    console.log(`Date Range: October 2024 -> June 2026`);
    console.log('Monthly Breakdown:');
    Object.keys(distribution).sort().forEach(month => {
      console.log(` - ${month}: ${distribution[month]} invoices`);
    });
    console.log('---------------------------------\n');

  } catch (error) {
    console.error('Error seeding local-db.json:', error);
  }
}

seedDatabase();
