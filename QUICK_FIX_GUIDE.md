# 🚀 Quick Fix for Razorpay Payment Error

## The Problem
You're getting this error:
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
```

**Cause**: Your deployed website is trying to connect to `localhost:3001`, which doesn't exist in production.

---

## 🎯 Quick Solution (5 Minutes)

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (run from project root)
vercel --prod
```

### Step 2: Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these:

| Name | Value |
|------|-------|
| `RAZORPAY_KEY_ID` | `rzp_live_Ra9dMWDeDR9sxr` |
| `RAZORPAY_KEY_SECRET` | `z3hbpqpvKC2XyWolIPkSSKJ9` |

5. Click **Save**
6. **Redeploy** your project

### Step 3: Update CORS

Open `server/server.js` and add your deployed URL:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://your-actual-domain.vercel.app', // ← Add your URL here
];
```

### Step 4: Redeploy

```bash
vercel --prod
```

---

## ✅ Verify It's Working

### Test 1: Check Backend Health
Open this URL in your browser:
```
https://your-domain.vercel.app/api/health
```

You should see:
```json
{"ok":true,"mode":"live"}
```

### Test 2: Check Public Key
```
https://your-domain.vercel.app/api/razorpay/public-key
```

You should see:
```json
{"keyId":"rzp_live_Ra9dMWDeDR9sxr"}
```

### Test 3: Try a Payment
Go to your payment page and try to make a payment. It should now work!

---

## 🎉 That's It!

Your payments should now work in production. The configuration automatically detects:
- **Local**: Uses `localhost:3001`
- **Production**: Uses your deployed URL

---

## 🔧 Alternative: If Vercel Doesn't Work

### Deploy Backend to Railway.app

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
6. Get your deployment URL (e.g., `https://your-app.railway.app`)

Then update `js/config.js`:

```javascript
orderEndpoint: 'https://your-app.railway.app/api/razorpay/create-order',
verifyEndpoint: 'https://your-app.railway.app/api/razorpay/verify-payment'
```

---

## 🆘 Still Having Issues?

### Check Browser Console (F12)
Look for error messages like:
- `Failed to fetch` → Backend not accessible
- `CORS error` → Update CORS configuration
- `Invalid Key ID` → Check Razorpay keys

### Check Vercel Logs
1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click on the latest deployment
5. Check the **Logs** tab

### Common Fixes

**Error: "Cannot reach backend"**
- Make sure backend is deployed
- Check if `/api/health` endpoint works
- Verify URL in config.js

**Error: "Invalid Key ID"**
- Check if environment variables are set in Vercel
- Verify Razorpay keys are correct
- Check if keys are for the right mode (test vs live)

**Error: "CORS blocked"**
- Add your domain to `allowedOrigins` in `server/server.js`
- Redeploy after changing CORS settings

---

## 📞 Need More Help?

Check these files:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `RAZORPAY_SETUP_GUIDE.md` - Razorpay configuration guide
- `server/server.js` - Backend API code
- `js/config.js` - Frontend configuration

---

## Summary of Changes Made

✅ **Fixed `js/config.js`**: Now automatically detects local vs production
✅ **Updated `server/server.js`**: Added environment variables and CORS
✅ **Created deployment guides**: Step-by-step instructions

**Next Steps:**
1. Deploy to Vercel
2. Add environment variables
3. Test the payment flow

That's it! Your Razorpay integration will work in production. 🎉

