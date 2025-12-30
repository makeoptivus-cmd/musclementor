// Load environment variables from .env file (for local development)
// In cPanel, environment variables are set in Node.js App settings
require('dotenv').config();

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// ===== PATH CONSTANTS FOR cPanel =====
// Your cPanel structure: /home/muscleme/backend/ and /home/muscleme/public_html/
// All files (HTML, CSS, JS) are directly in public_html (no subfolders)
const PATHS = {
  // Backend directory (where server.js is located)
  // On cPanel: /home/muscleme/backend
  backend: __dirname,
  
  // Public HTML directory (all files directly here - no css/ or js/ folders)
  // On cPanel: /home/muscleme/public_html
  publicHtml: path.join(__dirname, '..', 'public_html'),
};

// Log paths on startup (for debugging)
console.log('📁 Paths initialized:');
console.log('   Backend:', PATHS.backend);
console.log('   Public HTML:', PATHS.publicHtml);

// CORS Configuration - Allow requests from your deployed website
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      // Your cPanel domain
      'https://musclementorsacademy.com',
      'http://musclementorsacademy.com',
      'https://www.musclementorsacademy.com',
      'http://www.musclementorsacademy.com',
    ];
    
    // Allow all origins in development (remove in production for better security)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For now, allow all origins (CHANGE THIS IN PRODUCTION!)
      // Remove this line and uncomment the error below for production
      callback(null, true);
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Explicitly handle OPTIONS requests for CORS preflight
app.options('*', cors(corsOptions));

// ===== RAZORPAY CONFIGURATION =====
// Environment variables are loaded from:
// 1. .env file (for local development) - Create server/.env file
// 2. cPanel Node.js App → Environment Variables (for production)
// 3. System environment variables
// 
// Fallback to hardcoded values for local development only
const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_Ra9dMWDeDR9sxr';       // Your Key ID (test or live)
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'z3hbpqpvKC2XyWolIPkSSKJ9'; // Your Key Secret (keep secure!)

if (!keyId || !keySecret || keyId.includes('YOUR_') || keySecret.includes('your_')) {
  console.error('[Razorpay] Invalid API keys. Please update keyId and keySecret in server.js');
  process.exit(1);
}

const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mode: keyId && keyId.startsWith('rzp_test_') ? 'test' : 'live' });
});

// Public endpoint to expose ONLY the Key ID for the browser
app.get('/api/razorpay/public-key', (req, res) => {
  res.json({ keyId });
});

// Friendly root route to avoid 404 on '/'
app.get('/', (req, res) => {
  res.type('text').send('Razorpay API is running. Try /api/health or POST /api/razorpay/create-order');
});

// Handle all methods for /api/razorpay/create-order to debug 405 errors
app.all('/api/razorpay/create-order', (req, res, next) => {
  if (req.method !== 'POST') {
    console.warn(`Method ${req.method} not allowed for /api/razorpay/create-order. Only POST is supported.`);
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: `Only POST method is allowed. Received: ${req.method}`,
      allowedMethods: ['POST']
    });
  }
  next();
});

// Create order (amount in paise)
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', notes = {} } = req.body || {};
    
    // Validate amount
    if (!Number.isFinite(amount) || amount < 100) {
      console.error('Invalid amount received:', amount);
      return res.status(400).json({ 
        error: 'Invalid amount (min ₹1.00, send in paise)',
        received: amount,
        expected: 'Amount in paise (e.g., 990000 for ₹9,900.00)'
      });
    }
    
    // Log order creation attempt
    console.log('Creating Razorpay order:', { amount, currency, notes });
    
    const receipt = `rcpt_${Date.now()}`;
    const order = await razorpay.orders.create({ amount, currency, receipt, notes });
    
    console.log('Order created successfully:', order.id);
    return res.json(order); // contains id: order_...
  } catch (err) {
    console.error('Order create error:', err);
    const errorMessage = err?.error?.description || err?.message || 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to create order', 
      message: errorMessage,
      details: err?.error || err
    });
  }
});

// Verify payment signature
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ verified: false, error: 'Missing fields' });
    }
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const verified = expected === razorpay_signature;
    return res.json({ verified });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ verified: false, error: 'Verify failed', message: err?.message });
  }
});

const PORT = process.env.PORT || 3001;

// Only start server if not in serverless environment (Vercel/Netlify/etc)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✅ Razorpay API running on http://localhost:${PORT}`);
    console.log(`📌 Mode: ${keyId.startsWith('rzp_test_') ? 'TEST' : 'LIVE'}`);
    console.log(`🔑 Key ID: ${keyId}\n`);
  });
}

// Export for serverless platforms (Vercel, Netlify Functions, etc)
module.exports = app;


