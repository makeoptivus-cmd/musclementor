# 🎯 cPanel Deployment Guide for Razorpay Integration

## Your Hosting Setup: cPanel

Since you're using cPanel hosting, here's the specific solution for your platform.

---

## 🔍 Understanding Your Options

### Option 1: Frontend on cPanel + Backend Elsewhere (Recommended)
- ✅ Upload HTML/CSS/JS files to cPanel
- ✅ Deploy Node.js backend to a free platform (Railway/Render)
- ✅ Connect them together

### Option 2: Use cPanel Node.js App (If Available)
- ⚠️ Only if your cPanel has Node.js support
- More complex to set up
- May have limitations

**Recommendation:** Use Option 1 (it's simpler and more reliable)

---

## 🚀 SOLUTION 1: Frontend on cPanel + Backend on Railway (Recommended)

### Step 1: Deploy Your Backend to Railway.app (5 minutes)

1. **Go to https://railway.app/**
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"** (or "Deploy from local directory")
4. If using GitHub:
   - Connect your GitHub account
   - Select your repository
   - Railway will auto-detect the Node.js app

5. **Configure the deployment:**
   - **Root Directory:** Leave empty or set to `server`
   - **Start Command:** `node server.js` (or `cd server && node server.js` if root is project root)

6. **Add Environment Variables:**
   - Click on your project
   - Go to **"Variables"** tab
   - Click **"+ New Variable"**
   - Add:
     ```
     RAZORPAY_KEY_ID = rzp_live_Ra9dMWDeDR9sxr
     RAZORPAY_KEY_SECRET = z3hbpqpvKC2XyWolIPkSSKJ9
     PORT = 3001
     ```

7. **Get your deployment URL:**
   - Railway will provide a URL like: `https://your-app.up.railway.app`
   - **Copy this URL** - you'll need it!

---

### Step 2: Update Frontend Configuration

Open `js/config.js` and update the Razorpay endpoints:

```javascript
// Replace the RAZORPAY configuration with this:
RAZORPAY: {
    keyId: 'rzp_test_1234567890abcdef',
    keySecret: '',
    currency: 'INR',
    companyName: 'Muscle Mentors',
    description: 'Premium Gym Training Education',
    theme: {
        color: '#D4AF37'
    },
    paymentMethods: {
        card: true,
        upi: true,
        netbanking: true,
        wallet: true,
        emi: false
    },
    // Update these URLs with your Railway backend URL
    orderEndpoint: 'https://your-app.up.railway.app/api/razorpay/create-order',
    verifyEndpoint: 'https://your-app.up.railway.app/api/razorpay/verify-payment'
}
```

**Replace** `your-app.up.railway.app` with your actual Railway URL!

---

### Step 3: Update Backend CORS for Your cPanel Domain

Open `server/server.js` and add your cPanel domain:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://your-cpanel-domain.com',        // ← Your actual domain
  'http://your-cpanel-domain.com',         // ← Add both HTTP and HTTPS
  'https://www.your-cpanel-domain.com',    // ← With www
  'http://www.your-cpanel-domain.com',     // ← With www (HTTP)
];
```

After updating, **redeploy** to Railway (it usually redeploys automatically on code changes if connected to GitHub).

---

### Step 4: Upload Frontend to cPanel

1. **Login to cPanel**
2. Open **"File Manager"**
3. Navigate to `public_html` (or your domain's root directory)
4. **Upload these files:**
   ```
   ✅ index.html
   ✅ payment.html
   ✅ courses.html
   ✅ training-fees.html
   ✅ css/ (entire folder)
   ✅ js/ (entire folder - with updated config.js)
   ✅ Images (all .png, .jpg files)
   ```

5. **Make sure the structure is:**
   ```
   public_html/
   ├── index.html
   ├── payment.html
   ├── courses.html
   ├── training-fees.html
   ├── css/
   │   ├── styles.css
   │   └── payment.css
   ├── js/
   │   ├── config.js  (updated with Railway URL)
   │   ├── main.js
   │   └── simple-email.js
   └── [images]
   ```

---

### Step 5: Test Your Setup

1. **Test Backend:**
   ```
   https://your-app.up.railway.app/api/health
   ```
   Should return: `{"ok":true,"mode":"live"}`

2. **Test Frontend:**
   ```
   https://your-cpanel-domain.com
   ```
   Your website should load

3. **Test Payment:**
   - Go to: `https://your-cpanel-domain.com/payment.html`
   - Fill in the form
   - Click "Pay with Razorpay"
   - ✅ Payment should work!

---

## 🎯 SOLUTION 2: Using cPanel Node.js (If Available)

### Check if Your cPanel Supports Node.js

1. Login to cPanel
2. Look for **"Setup Node.js App"** or **"Node.js Selector"**
3. If you see it, continue. If not, use Solution 1.

### Steps:

1. **Create Node.js Application:**
   - In cPanel, go to **"Setup Node.js App"**
   - Click **"Create Application"**
   - Set:
     - **Node.js version:** 14.x or higher
     - **Application mode:** Production
     - **Application root:** `server`
     - **Application URL:** `api` or `backend`
     - **Application startup file:** `server.js`

2. **Upload Backend Files:**
   - Upload the `server` folder to your cPanel
   - Place it in: `home/yourusername/server/`

3. **Install Dependencies:**
   - In cPanel Node.js App interface, click "Run NPM Install"
   - Or use SSH/Terminal:
     ```bash
     cd ~/server
     npm install
     ```

4. **Set Environment Variables:**
   - In cPanel Node.js App settings, add:
     ```
     RAZORPAY_KEY_ID=rzp_live_Ra9dMWDeDR9sxr
     RAZORPAY_KEY_SECRET=z3hbpqpvKC2XyWolIPkSSKJ9
     ```

5. **Start the Application**

6. **Update Frontend:**
   Update `js/config.js`:
   ```javascript
   orderEndpoint: 'https://your-domain.com/api/razorpay/create-order',
   verifyEndpoint: 'https://your-domain.com/api/razorpay/verify-payment'
   ```

---

## 🔧 Alternative Backend Hosting Options

If Railway doesn't work, try these:

### Render.com (Free Tier)
1. Go to https://render.com/
2. Click "New" → "Web Service"
3. Connect GitHub or deploy manually
4. Set:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `node server/server.js`
5. Add environment variables
6. Get deployment URL

### Cyclic.sh (Free Tier)
1. Go to https://www.cyclic.sh/
2. Connect GitHub
3. Deploy
4. Add environment variables
5. Get deployment URL

### Glitch.com (Free Tier)
1. Go to https://glitch.com/
2. Create new project
3. Upload `server` folder
4. Add `.env` file with your keys
5. Get project URL

---

## 📝 Quick Configuration Template

After deploying backend, update `js/config.js`:

```javascript
RAZORPAY: {
    keyId: 'rzp_test_1234567890abcdef',
    keySecret: '',
    currency: 'INR',
    companyName: 'Muscle Mentors',
    description: 'Premium Gym Training Education',
    theme: {
        color: '#D4AF37'
    },
    paymentMethods: {
        card: true,
        upi: true,
        netbanking: true,
        wallet: true,
        emi: false
    },
    // CHANGE THESE URLs TO YOUR BACKEND URL:
    orderEndpoint: 'https://YOUR-BACKEND-URL/api/razorpay/create-order',
    verifyEndpoint: 'https://YOUR-BACKEND-URL/api/razorpay/verify-payment'
}
```

**Replace `YOUR-BACKEND-URL` with:**
- Railway: `https://your-app.up.railway.app`
- Render: `https://your-app.onrender.com`
- Cyclic: `https://your-app.cyclic.app`
- Glitch: `https://your-project.glitch.me`

---

## ✅ Deployment Checklist

### Backend Deployment:
- [ ] Deploy to Railway/Render/Cyclic
- [ ] Add environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
- [ ] Test health endpoint: `/api/health`
- [ ] Copy deployment URL

### Frontend Configuration:
- [ ] Update `js/config.js` with backend URL
- [ ] Update `server/server.js` CORS with your cPanel domain
- [ ] Redeploy backend with CORS changes

### cPanel Upload:
- [ ] Login to cPanel File Manager
- [ ] Navigate to `public_html`
- [ ] Upload all frontend files
- [ ] Verify file structure is correct

### Testing:
- [ ] Test backend: `https://backend-url/api/health`
- [ ] Test frontend: Load your website
- [ ] Test payment: Try making a payment
- [ ] Check browser console for errors (F12)

---

## 🆘 Troubleshooting

### Error: "Failed to fetch" or "Network Error"

**Cause:** Backend not accessible or CORS issue

**Solution:**
1. Check if backend is running:
   ```
   https://your-backend-url/api/health
   ```
2. Verify CORS in `server/server.js` includes your domain
3. Check if backend URL in `config.js` is correct

---

### Error: "CORS blocked"

**Cause:** Your domain not in allowedOrigins

**Solution:**
Open `server/server.js` and add your domain:
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'http://yourdomain.com',
  'https://www.yourdomain.com',
  'http://www.yourdomain.com',
];
```

Redeploy backend after changes.

---

### Error: "Invalid Key ID"

**Cause:** Environment variables not set

**Solution:**
1. Go to your backend hosting dashboard
2. Check environment variables
3. Ensure both keys are set correctly
4. Restart the backend service

---

### Payment Works Locally But Not on cPanel

**Cause:** Different URLs between local and production

**Solution:**
Check `js/config.js` - make sure the URLs point to your deployed backend, not `localhost`:
```javascript
orderEndpoint: 'https://your-backend.railway.app/api/razorpay/create-order',
// NOT: 'http://localhost:3001/api/razorpay/create-order'
```

---

## 📊 File Upload Checklist for cPanel

Make sure these files are on your cPanel:

```
public_html/
├── index.html ✓
├── payment.html ✓
├── courses.html ✓
├── training-fees.html ✓
├── admin-template.html ✓
├── test-form.html ✓
│
├── css/
│   ├── styles.css ✓
│   └── payment.css ✓
│
├── js/
│   ├── config.js ✓ (Updated with backend URL)
│   ├── main.js ✓
│   ├── simple-email.js ✓
│   └── realtime-contact.js ✓
│
└── Images/
    ├── Logo_smoothed-removebg-preview.png ✓
    ├── IMG_3663-removebg-preview.png ✓
    └── [all other images] ✓
```

**DO NOT upload:**
- ❌ `server/` folder (deployed separately)
- ❌ `node_modules/`
- ❌ `.env` files
- ❌ `.git/` folder

---

## 🎯 Summary for cPanel Hosting

**Your Setup:**
1. ✅ **Frontend** → Hosted on cPanel (HTML, CSS, JS files)
2. ✅ **Backend** → Hosted on Railway/Render (Node.js server)
3. ✅ **Connection** → Frontend calls backend API via HTTPS

**Why This Works:**
- cPanel is great for static files (HTML, CSS, JS)
- Railway/Render is great for Node.js backends
- They communicate via API calls
- Both are secure (HTTPS)

**What You Changed:**
- Updated `js/config.js` with backend URL
- Updated `server/server.js` with your domain in CORS
- Deployed backend separately
- Uploaded frontend to cPanel

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Deploy Backend to Railway
Visit: https://railway.app/
Deploy your 'server' folder
Add environment variables
Copy URL: https://your-app.up.railway.app

# 2. Update js/config.js
orderEndpoint: 'https://your-app.up.railway.app/api/razorpay/create-order'
verifyEndpoint: 'https://your-app.up.railway.app/api/razorpay/verify-payment'

# 3. Update server/server.js CORS
Add your cPanel domain to allowedOrigins

# 4. Upload to cPanel
Upload all frontend files to public_html

# 5. Test
Visit your website and try payment!
```

---

**That's it!** Your Razorpay integration will work with cPanel hosting. 🎉

Need help? Check the troubleshooting section above or test each endpoint individually.

