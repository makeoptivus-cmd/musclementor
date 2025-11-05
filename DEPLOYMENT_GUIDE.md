# Deployment Guide - Fixing Razorpay Payment Issues

## Problem
You're getting a **400 Bad Request** error from Razorpay when trying to make payments on your deployed website. This happens because your frontend is trying to connect to `localhost:3001`, which doesn't exist in production.

## Solution Overview
You need to deploy your backend server and update the configuration to use the correct URLs.

---

## Step-by-Step Solution

### ✅ Step 1: Deploy Your Backend to Vercel

Your project already has a `vercel.json` file configured. Here's how to deploy:

#### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Navigate to your project directory**:
```bash
cd "D:\client-muscle mentors\client-muscle mentors"
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy your project**:
```bash
vercel
```

5. **For production deployment**:
```bash
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/
2. Click "Add New Project"
3. Import your GitHub repository (or upload your project)
4. Vercel will automatically detect the configuration
5. Click "Deploy"

---

### ✅ Step 2: Add Environment Variables (IMPORTANT!)

After deployment, you need to add your Razorpay keys as environment variables:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add these variables:

```
RAZORPAY_KEY_ID = rzp_live_Ra9dMWDeDR9sxr
RAZORPAY_KEY_SECRET = z3hbpqpvKC2XyWolIPkSSKJ9
```

⚠️ **IMPORTANT**: Remove the hardcoded keys from `server/server.js` after adding environment variables!

---

### ✅ Step 3: Update server.js to Use Environment Variables

Replace the hardcoded keys in `server/server.js`:

**BEFORE:**
```javascript
const keyId = 'rzp_live_Ra9dMWDeDR9sxr';
const keySecret = 'z3hbpqpvKC2XyWolIPkSSKJ9';
```

**AFTER:**
```javascript
const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_Ra9dMWDeDR9sxr';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'z3hbpqpvKC2XyWolIPkSSKJ9';
```

---

### ✅ Step 4: Update CORS Configuration

Open `server/server.js` and update the `allowedOrigins` array with your deployed URL:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://your-actual-website.vercel.app', // ← Add your deployed URL here
];
```

---

### ✅ Step 5: Test Your Deployment

1. **Get your deployed URL** from Vercel (e.g., `https://your-project.vercel.app`)

2. **Update the CORS configuration** in `server/server.js` with your actual URL

3. **Redeploy** your changes:
```bash
vercel --prod
```

4. **Test the payment** on your live website

---

## Troubleshooting

### Issue 1: Still Getting 400 Error

**Possible Causes:**
- Backend not deployed properly
- Environment variables not set
- CORS blocking the requests

**Solution:**
1. Check if your backend is running:
   - Visit: `https://your-domain.vercel.app/api/health`
   - You should see: `{"ok":true,"mode":"live"}`

2. Check browser console for CORS errors
3. Verify environment variables in Vercel dashboard

---

### Issue 2: "Payment gateway not configured"

**Cause:** Frontend can't reach the backend

**Solution:**
1. Open browser console (F12)
2. Check for failed network requests
3. Verify the URLs in `js/config.js` are correct
4. The URLs should automatically use your deployed domain

---

### Issue 3: Razorpay Checkout Not Opening

**Possible Causes:**
- Invalid Razorpay Key ID
- Backend order creation failing

**Solution:**
1. Check browser console for errors
2. Test the order creation endpoint:
```bash
curl -X POST https://your-domain.vercel.app/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":10000,"currency":"INR"}'
```

3. You should get a response with an `order_id`

---

## Alternative: Deploy Backend Separately

If you want to deploy your backend on a different platform:

### Option 1: Render.com

1. Go to https://render.com/
2. Create a new "Web Service"
3. Connect your repository
4. Set build command: `cd server && npm install`
5. Set start command: `node server/server.js`
6. Add environment variables
7. Deploy

### Option 2: Railway.app

1. Go to https://railway.app/
2. Create a new project
3. Deploy from GitHub
4. Add environment variables
5. Get your deployment URL

### Option 3: Heroku

1. Go to https://heroku.com/
2. Create a new app
3. Deploy via Git or GitHub
4. Add environment variables in Settings
5. Use the Heroku URL in your frontend

---

## Configuration After Deployment

Once deployed, your configuration in `js/config.js` will automatically work because it now uses:

```javascript
orderEndpoint: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api/razorpay/create-order'
    : window.location.origin + '/api/razorpay/create-order'
```

This means:
- **Locally**: Uses `http://localhost:3001/api/razorpay/create-order`
- **Production**: Uses `https://your-domain.vercel.app/api/razorpay/create-order`

---

## Security Checklist

Before going live:

- [ ] Environment variables set in Vercel/hosting platform
- [ ] Remove hardcoded API keys from code
- [ ] Update CORS to only allow your domain
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Test all payment flows
- [ ] Set up Razorpay webhooks for production
- [ ] Enable Razorpay account (complete KYC if needed)

---

## Quick Test Commands

### Test Backend Health
```bash
curl https://your-domain.vercel.app/api/health
```

### Test Order Creation
```bash
curl -X POST https://your-domain.vercel.app/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":10000,"currency":"INR"}'
```

### Test Payment Verification
```bash
curl -X POST https://your-domain.vercel.app/api/razorpay/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id":"order_123",
    "razorpay_payment_id":"pay_123",
    "razorpay_signature":"signature_123"
  }'
```

---

## Need Help?

If you're still facing issues:

1. **Check Vercel Logs**: Go to your Vercel project → "Deployments" → Click on your deployment → "Logs"
2. **Check Browser Console**: Press F12 in your browser and look for errors
3. **Check Razorpay Dashboard**: Go to https://dashboard.razorpay.com/ and check for any account issues
4. **Test with Test Keys First**: Before using live keys, test with `rzp_test_` keys

---

## Summary

✅ **What we fixed:**
1. Updated `js/config.js` to automatically detect production vs local environment
2. Added proper CORS configuration in `server/server.js`
3. Configured deployment via Vercel

✅ **What you need to do:**
1. Deploy your project to Vercel
2. Add environment variables (Razorpay keys)
3. Update CORS with your deployed URL
4. Test the payment flow

Once deployed, your payments will work perfectly! 🎉

