import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import invoiceRouter from './routes/invoices.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 encoded logos

// Connection Caching for serverless environments
let cachedDb = null;

// Add error listener to connection to prevent unhandled error event crashes
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sebainvoice';
  
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(dbUri);
  cachedDb = conn;
  return cachedDb;
}

// Middleware to ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed: ' + error.message });
  }
});

// Register API Routes
app.use('/api/invoices', invoiceRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    databaseState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// Fallback for local development running standard Express server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

export default app;
