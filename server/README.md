# Razorpay Minimal API (Test/Live)

## Setup

1. Install Node 18+
2. Open `server.js` and update the Razorpay keys (lines 13-14):
   ```js
   const keyId = 'rzp_live_Ra9dMWDeDR9sxr';       // Your Key ID
   const keySecret = 'z3hbpqpvKC2XyWolIPkSSKJ9'; // Your Key Secret
   ```
3. Install and run:
```
cd server
npm i
npm start
```

## Endpoints

- GET /api/health → { ok: true, mode: 'test'|'live' }
- POST /api/razorpay/create-order → Create order (expects amount in paise)
- POST /api/razorpay/verify-payment → Verify signature after success

## Frontend config

In `js/config.js` set:
```
CONFIG.RAZORPAY.orderEndpoint = 'http://localhost:3001/api/razorpay/create-order';
CONFIG.RAZORPAY.verifyEndpoint = 'http://localhost:3001/api/razorpay/verify-payment';
```

For test mode, set the Checkout key to your test key (or add `?rk=rzp_test_xxx` in the URL).
