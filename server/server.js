const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

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
      // Add your deployed website URL here (e.g., 'https://yourdomain.com')
      // Uncomment and update the line below with your actual domain
      // 'https://your-website.vercel.app',
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

// ===== RAZORPAY CONFIGURATION =====
// Prefer environment variables for security
// Set these in your hosting platform (Vercel, Railway, etc.)
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

// Create order (amount in paise)
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', notes = {} } = req.body || {};
    if (!Number.isFinite(amount) || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount (min ₹1.00, send in paise)' });
    }
    const receipt = `rcpt_${Date.now()}`;
    const order = await razorpay.orders.create({ amount, currency, receipt, notes });
    return res.json(order); // contains id: order_...
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ error: 'Failed to create order', message: err?.message });
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


