# Invoice Generator - MERN Stack

A premium, highly-interactive invoice generation and management system built with the MERN Stack (MongoDB, Express, React, Node.js) configured for seamless hosting on Vercel.

## Features

- **Dashboard**: View key metrics including total invoiced, outstanding balance, paid amount, and invoice count
- **Invoice Editor**: Create and edit invoices with dynamic line items, automatic calculations
- **Invoice History**: Search, filter, and manage all invoices with status toggles
- **PDF Export**: Download professional PDF invoices
- **Dark Mode UI**: Modern glassmorphic design with premium styling

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Express.js (Serverless on Vercel)
- **Database**: MongoDB Atlas
- **Styling**: CSS Variables with custom dark theme
- **Icons**: Lucide React
- **PDF Generation**: html2pdf.js

## Project Structure

```
invoice-generator/
├── api/                    # Backend (Express serverless functions)
│   ├── index.js           # Serverless entry point
│   ├── models/
│   │   └── Invoice.js     # MongoDB schema
│   └── routes/
│       └── invoices.js    # API endpoints
├── src/                   # Frontend (React)
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── InvoiceForm.jsx
│   │   └── InvoiceHistory.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   cd invoice-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `MONGODB_URI` with your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice-generator?retryWrites=true&w=majority
   ```

4. **Start development servers**
   
   In one terminal, start the API server:
   ```bash
   npm run api
   ```
   
   In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Deployment to Vercel

1. **Push to Git**
   
   Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

2. **Connect to Vercel**
   
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

3. **Configure Environment Variables**
   
   In Vercel project settings, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string

4. **Deploy**
   
   Click "Deploy". Vercel will automatically:
   - Build the React frontend with Vite
   - Deploy the API as serverless functions
   - Configure routing via `vercel.json`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| GET | `/api/invoices/:id` | Get single invoice |
| POST | `/api/invoices` | Create new invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

## Invoice Schema

```javascript
{
  invoiceNumber: String,      // Auto-generated if not provided
  date: Date,                 // Invoice date
  dueDate: Date,              // Payment due date
  paymentTerms: String,       // e.g., "Net 30"
  sender: {
    name: String,
    email: String,
    address: String,
    logo: String              // Optional data URI
  },
  client: {
    name: String,
    email: String,
    address: String
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    tax: Number,              // Percentage
    discount: Number,         // Percentage
    total: Number
  }],
  taxRate: Number,            // Global tax percentage
  discountRate: Number,       // Global discount percentage
  shippingFee: Number,
  currency: String,           // Default: "$"
  subtotal: Number,           // Auto-calculated
  totalTax: Number,           // Auto-calculated
  totalDiscount: Number,      // Auto-calculated
  total: Number,              // Auto-calculated
  balanceDue: Number,         // Auto-calculated
  status: String,             // "Paid", "Unpaid", or "Overdue"
  createdAt: Date,
  updatedAt: Date
}
```

## Verification Checklist

- [x] Create a new invoice and verify it appears in History
- [x] Check Dashboard metrics update after creating invoice
- [x] Toggle invoice status from Unpaid to Paid
- [x] Verify Outstanding Balance and Paid Amount update correctly
- [x] Download PDF of an invoice
- [x] Search and filter invoices in History
- [x] Edit an existing invoice
- [x] Delete an invoice

## Troubleshooting

### API Connection Issues

If you see network errors in the browser console:
1. Ensure the API server is running (`npm run api`)
2. Check that `MONGODB_URI` is correctly set in `.env`
3. Verify MongoDB Atlas allows connections from your IP

### Build Failures on Vercel

1. Check the build logs in Vercel dashboard
2. Ensure `MONGODB_URI` is set in Vercel environment variables
3. Verify `vercel.json` configuration matches the expected structure

## License

MIT