# 🎯 START HERE - cPanel Hosting Solution

## Your Situation
- ✅ Using **cPanel hosting** for your website
- ❌ Getting **400 Bad Request** error when trying to pay
- 🎯 Need to fix Razorpay payment integration

---

## 📋 Simple 3-Step Solution

### STEP 1: Deploy Your Backend (10 minutes) ⚙️

Your cPanel can host the website (HTML/CSS/JS), but the Node.js backend needs to be hosted elsewhere.

**Choose one of these FREE platforms:**

#### 🚂 Railway.app (Recommended - Easiest)

1. **Go to:** https://railway.app/
2. **Click:** "Start a New Project"
3. **Sign in** with GitHub or email
4. **Click:** "Deploy from GitHub repo" 
   - OR "Empty Project" → "Deploy from local directory"
5. **If using GitHub:**
   - Connect your GitHub account
   - Push your code to GitHub
   - Select your repository
6. **If deploying manually:**
   - Click "Empty Project"
   - Click "GitHub Repo" or "Upload files"
   - Upload ONLY the `server` folder

7. **Configure Settings:**
   - Railway auto-detects Node.js
   - If asked for start command: `node server.js`
   
8. **Add Environment Variables:**
   - Click your project
   - Go to "Variables" tab
   - Add these:
     ```
     RAZORPAY_KEY_ID = rzp_live_Ra9dMWDeDR9sxr
     RAZORPAY_KEY_SECRET = z3hbpqpvKC2XyWolIPkSSKJ9
     ```

9. **Get Your URL:**
   - Click "Settings" → "Networking" → "Generate Domain"
   - You'll get: `https://your-app.up.railway.app`
   - **COPY THIS URL!** You'll need it in Step 2

10. **Test it works:**
    - Visit: `https://your-app.up.railway.app/api/health`
    - You should see: `{"ok":true,"mode":"live"}`
    - ✅ If you see this, backend is working!

---

### STEP 2: Update Your Configuration (2 minutes) 📝

1. **Open** `js/config.js` in your code editor
2. **Find** this line (around line 82):
   ```javascript
   BACKEND_URL: '', // Example: 'https://your-app.up.railway.app'
   ```

3. **Update** it with your Railway URL:
   ```javascript
   BACKEND_URL: 'https://your-app.up.railway.app', // ← Your actual URL here
   ```

4. **Save** the file

5. **Update CORS in backend:**
   - Open `server/server.js`
   - Find the `allowedOrigins` array (around line 15)
   - Add your cPanel domain:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'http://localhost:5500',
     'http://127.0.0.1:5500',
     'https://yourdomain.com',        // ← Your cPanel domain
     'http://yourdomain.com',         // ← Add both HTTP and HTTPS
     'https://www.yourdomain.com',    // ← With www too
   ];
   ```

6. **Redeploy backend** to Railway:
   - If connected to GitHub, just push changes
   - Railway will auto-deploy
   - OR re-upload via Railway dashboard

---

### STEP 3: Upload to cPanel (5 minutes) 📤

1. **Login to cPanel**
   - Go to your hosting provider's website
   - Login to cPanel

2. **Open File Manager**
   - Find and click "File Manager"
   - Navigate to `public_html` folder

3. **Upload Frontend Files**
   
   Upload ONLY these files/folders:
   ```
   ✅ index.html
   ✅ payment.html
   ✅ courses.html
   ✅ training-fees.html
   ✅ admin-template.html
   ✅ test-form.html
   ✅ css/ folder (entire folder)
   ✅ js/ folder (entire folder with updated config.js)
   ✅ All image files (.png, .jpg)
   ```

   **DO NOT upload:**
   ```
   ❌ server/ folder (already deployed to Railway)
   ❌ node_modules/
   ❌ .git/
   ❌ .env files
   ```

4. **Verify file structure:**
   Your `public_html` should look like:
   ```
   public_html/
   ├── index.html
   ├── payment.html
   ├── css/
   │   ├── styles.css
   │   └── payment.css
   ├── js/
   │   └── config.js (with updated BACKEND_URL)
   └── [images]
   ```

---

## ✅ Test Everything

### Test 1: Backend is Working
Open: `https://your-app.up.railway.app/api/health`

**Expected:** `{"ok":true,"mode":"live"}`

✅ If you see this → Backend is working!
❌ If error → Check Railway deployment logs

---

### Test 2: Website Loads
Open: `https://yourdomain.com`

**Expected:** Your website loads normally

✅ If loads → Frontend is working!
❌ If error → Check file upload in cPanel

---

### Test 3: Payment Works
1. Go to: `https://yourdomain.com/payment.html`
2. Fill in the form
3. Click "Pay with Razorpay"
4. **Expected:** Razorpay popup opens

✅ If popup opens → Everything works! 🎉
❌ If error → See troubleshooting below

---

## 🆘 Troubleshooting

### ❌ Error: "Failed to fetch" or Network Error

**Check:**
1. Is `BACKEND_URL` in `config.js` correct?
2. Is backend running? Test: `/api/health`
3. Did you add CORS in `server/server.js`?

**Fix:**
- Double-check Railway URL in `config.js`
- Add your domain to `allowedOrigins` in `server/server.js`
- Redeploy backend to Railway

---

### ❌ Error: "CORS policy blocked"

**Cause:** Your domain not in backend's allowed origins

**Fix:**
1. Open `server/server.js`
2. Add your domain to `allowedOrigins`:
   ```javascript
   'https://yourdomain.com',
   'https://www.yourdomain.com',
   ```
3. Redeploy to Railway

---

### ❌ Error: "Invalid Key ID"

**Cause:** Environment variables not set in Railway

**Fix:**
1. Go to Railway dashboard
2. Click your project
3. Go to "Variables" tab
4. Check both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are there
5. If missing, add them
6. Restart the service

---

### ❌ Backend health check fails

**Fix:**
1. Go to Railway dashboard
2. Check "Deployments" tab
3. Look for errors in logs
4. Make sure start command is: `node server.js`
5. Check if `package.json` is uploaded

---

## 📸 Visual Guide

```
┌─────────────────────────────────────┐
│  USER VISITS YOUR WEBSITE           │
│  (Hosted on cPanel)                 │
│  https://yourdomain.com             │
└──────────────┬──────────────────────┘
               │
               │ Clicks "Pay"
               │
               ↓
┌─────────────────────────────────────┐
│  FRONTEND (cPanel)                  │
│  Reads config.js                    │
│  BACKEND_URL set to Railway         │
└──────────────┬──────────────────────┘
               │
               │ Sends request to:
               │ https://your-app.railway.app/api
               │
               ↓
┌─────────────────────────────────────┐
│  BACKEND (Railway)                  │
│  Creates Razorpay order             │
│  Returns order_id                   │
└──────────────┬──────────────────────┘
               │
               │ Communicates with:
               │
               ↓
┌─────────────────────────────────────┐
│  RAZORPAY                           │
│  Processes payment                  │
│  Returns success/failure            │
└─────────────────────────────────────┘
```

---

## 🎯 Quick Checklist

**Backend (Railway):**
- [ ] Deployed to Railway.app
- [ ] Environment variables added (2 keys)
- [ ] `/api/health` returns success
- [ ] URL copied for next step

**Configuration:**
- [ ] `js/config.js` updated with Railway URL
- [ ] `server/server.js` CORS updated with domain
- [ ] Backend redeployed with CORS changes

**Frontend (cPanel):**
- [ ] All files uploaded to `public_html`
- [ ] Updated `config.js` included
- [ ] Website loads correctly
- [ ] Images showing properly

**Testing:**
- [ ] Backend health check passes
- [ ] Website loads on cPanel domain
- [ ] Payment page loads
- [ ] Razorpay popup opens
- [ ] Test payment completes

---

## 💡 Pro Tips

1. **Test with Test Keys First:**
   - Use `rzp_test_` keys before going live
   - Get test keys from Razorpay dashboard
   
2. **Keep Backend URL Handy:**
   - Save your Railway URL somewhere safe
   - You'll need it if you update config later

3. **Monitor Both Platforms:**
   - Railway dashboard for backend logs
   - cPanel for frontend file management
   - Razorpay dashboard for payment tracking

4. **Browser Console is Your Friend:**
   - Press F12 to open developer tools
   - Check Console tab for errors
   - Check Network tab for failed requests

---

## 📚 Need More Help?

**Detailed Guides:**
- `CPANEL_DEPLOYMENT_GUIDE.md` - Comprehensive cPanel guide
- `QUICK_FIX_GUIDE.md` - Alternative solutions
- `PAYMENT_ARCHITECTURE.md` - How everything works

**Check These Endpoints:**
- Backend health: `https://your-backend.railway.app/api/health`
- Public key: `https://your-backend.railway.app/api/razorpay/public-key`

**Railway Support:**
- Docs: https://docs.railway.app/
- Discord: https://discord.gg/railway
- Status: https://status.railway.app/

**Razorpay Support:**
- Dashboard: https://dashboard.razorpay.com/
- Docs: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

---

## 🎉 Summary

**What you're doing:**
1. 🚂 Backend → Railway (free Node.js hosting)
2. 🌐 Frontend → cPanel (your existing hosting)
3. 🔗 They communicate via API calls
4. 💳 Razorpay processes the payments

**Time needed:** ~15-20 minutes total

**Cost:** FREE (Railway has a generous free tier)

**Result:** Working payments on your cPanel-hosted website! ✨

---

## 🚀 Let's Get Started!

1. Start with **STEP 1** above
2. Follow each step carefully
3. Test after each step
4. Use troubleshooting if needed

**You got this! 💪**

Once completed, your Razorpay integration will work perfectly with cPanel hosting.

---

*For questions or issues, check the troubleshooting section or refer to the detailed guides.*

