# 🚀 Complete cPanel Deployment Guide

## Your cPanel Structure

```
/home/muscleme/
├── backend/                    ← Node.js backend files
│   ├── server.js
│   └── package.json
│
└── public_html/                ← All website files directly here (no subfolders)
    ├── index.html
    ├── payment.html
    ├── courses.html
    ├── training-fees.html
    ├── styles.css              ← CSS file directly in public_html
    ├── payment.css             ← CSS file directly in public_html
    ├── main.js                 ← JS file directly in public_html
    ├── config.js               ← JS file directly in public_html
    ├── simple-email.js         ← JS file directly in public_html
    ├── realtime-contact.js     ← JS file directly in public_html
    └── [all image files]
```

---

## ✅ STEP 1: Prepare Files Locally

### Files to Upload to `public_html/`:

**HTML Files:**
- ✅ `index.html`
- ✅ `payment.html`
- ✅ `courses.html`
- ✅ `training-fees.html`
- ✅ `admin-template.html` (if needed)
- ✅ `test-form.html` (if needed)

**CSS Files (move from css/ folder):**
- ✅ `css/styles.css` → Upload as `styles.css` directly in `public_html/`
- ✅ `css/payment.css` → Upload as `payment.css` directly in `public_html/`

**JavaScript Files (move from js/ folder):**
- ✅ `js/config.js` → Upload as `config.js` directly in `public_html/`
- ✅ `js/main.js` → Upload as `main.js` directly in `public_html/`
- ✅ `js/simple-email.js` → Upload as `simple-email.js` directly in `public_html/`
- ✅ `js/realtime-contact.js` → Upload as `realtime-contact.js` directly in `public_html/`

**Image Files:**
- ✅ All `.png`, `.jpg`, `.JPG` files
- ✅ `Logo smoothed.png`
- ✅ `Logo_smoothed-removebg-preview.png`
- ✅ `level 1.png`, `level 2.png`, `level 3.png`
- ✅ All certificate images
- ✅ All DSC images

### Files to Upload to `backend/`:

- ✅ `server/server.js` → Upload as `server.js` to `backend/`
- ✅ `server/package.json` → Upload as `package.json` to `backend/`

---

## ✅ STEP 2: Update HTML Files (Fix CSS/JS Paths)

Since all files are directly in `public_html/`, update your HTML files:

### Before (with folders):
```html
<link rel="stylesheet" href="css/styles.css">
<script src="js/main.js"></script>
```

### After (all files directly in public_html):
```html
<link rel="stylesheet" href="styles.css">
<script src="main.js"></script>
```

**Files to update:**
- `index.html`
- `payment.html`
- `courses.html`
- `training-fees.html`
- `admin-template.html`
- `test-form.html`

---

## ✅ STEP 3: Upload to cPanel

### A. Upload Frontend Files

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to `public_html/`**
4. **Upload all files directly to `public_html/`** (not in subfolders):
   - All HTML files
   - All CSS files (styles.css, payment.css)
   - All JS files (config.js, main.js, etc.)
   - All image files

**Important:** Make sure files are directly in `public_html/`, NOT in `public_html/css/` or `public_html/js/`

### B. Upload Backend Files

1. **Go back to home directory** (`/home/muscleme/`)
2. **Create folder `backend`** (if not exists)
3. **Enter `backend/` folder**
4. **Upload:**
   - `server.js` (from your local `server/` folder)
   - `package.json` (from your local `server/` folder)

---

## ✅ STEP 4: Set Up Node.js App in cPanel

1. **In cPanel, find "Setup Node.js App"** (or "Node.js Selector")
2. **Click "Create Application"**

### Fill in these settings:

| Setting | Value |
|---------|-------|
| **Node.js Version** | 16.x or higher (18.x recommended) |
| **Application Mode** | Production |
| **Application Root** | `backend` |
| **Application URL** | `api` |
| **Application Startup File** | `server.js` |
| **Passenger Log File** | Leave default |

3. **Click "Create"**

---

## ✅ STEP 5: Add Environment Variables

In the Node.js App settings page:

1. **Find "Environment Variables" section**
2. **Click "Add Variable"** for each:

| Variable Name | Value |
|--------------|-------|
| `RAZORPAY_KEY_ID` | `rzp_live_Ra9dMWDeDR9sxr` |
| `RAZORPAY_KEY_SECRET` | `z3hbpqpvKC2XyWolIPkSSKJ9` |

3. **Click "Save"** after adding each variable

---

## ✅ STEP 6: Install Dependencies

In the Node.js App interface:

1. **Find "Run NPM Install" button**
2. **Click it**
3. **Wait for installation to complete** (may take 1-2 minutes)

**OR if you have SSH access:**
```bash
cd ~/backend
npm install
```

---

## ✅ STEP 7: Start the Application

1. **In Node.js App interface**
2. **Click "Start" or "Run" button**
3. **Check status** - should show **"Running"** (green)

---

## ✅ STEP 8: Test Everything

### Test 1: Backend Health Check
Open browser:
```
https://musclementorsacademy.com/api/health
```
**Expected:** `{"ok":true,"mode":"live"}`

✅ If you see this → Backend is working!

### Test 2: Public Key Endpoint
```
https://musclementorsacademy.com/api/razorpay/public-key
```
**Expected:** `{"keyId":"rzp_live_Ra9dMWDeDR9sxr"}`

✅ If you see this → API is working!

### Test 3: Website Loads
```
https://musclementorsacademy.com
```
**Expected:** Your homepage loads correctly

✅ If it loads → Frontend is working!

### Test 4: CSS and JS Load
- Open browser DevTools (F12)
- Go to Network tab
- Reload page
- Check if `styles.css` and `main.js` load without 404 errors

✅ If no 404 errors → File paths are correct!

### Test 5: Payment Page
```
https://musclementorsacademy.com/payment.html
```
1. Fill in the payment form
2. Click "Pay with Razorpay"
3. **Expected:** Razorpay checkout opens

✅ If checkout opens → Payment integration is working!

---

## 🔧 Troubleshooting

### Problem: CSS/JS files not loading (404 errors)

**Solution:**
- Make sure files are directly in `public_html/`, not in subfolders
- Check HTML file paths: should be `href="styles.css"` not `href="css/styles.css"`
- Clear browser cache (Ctrl+F5)

### Problem: `/api/health` returns 404

**Possible causes:**
1. Node.js app not running
2. Application URL not set to `api`
3. Routing not configured

**Fix:**
- Check Node.js app status (should be "Running")
- Verify "Application URL" is set to `api`
- Restart the Node.js application

### Problem: Node.js app won't start

**Check:**
1. Is `server.js` uploaded correctly?
2. Is `package.json` in the same folder?
3. Did NPM install run successfully?
4. Check error logs in cPanel Node.js interface

**Fix:**
- View error logs: cPanel → Node.js App → Logs
- Re-run NPM install
- Check for syntax errors in `server.js`

### Problem: CORS errors

**This shouldn't happen** since frontend and backend are on same domain!

**If it does:**
- Check `server.js` - `allowedOrigins` should include your domain
- Restart Node.js app after changes

---

## 📋 Final Checklist

**Before Upload:**
- [ ] All CSS files moved from `css/` folder to root
- [ ] All JS files moved from `js/` folder to root
- [ ] HTML files updated with correct paths (no `css/` or `js/` in paths)
- [ ] `server.js` has correct paths configured
- [ ] `config.js` has `BACKEND_URL: ''`

**File Upload:**
- [ ] All HTML files uploaded to `public_html/`
- [ ] All CSS files uploaded directly to `public_html/`
- [ ] All JS files uploaded directly to `public_html/`
- [ ] All images uploaded to `public_html/`
- [ ] `server.js` uploaded to `backend/`
- [ ] `package.json` uploaded to `backend/`

**Node.js Setup:**
- [ ] Node.js app created in cPanel
- [ ] Application Root set to `backend`
- [ ] Application URL set to `api`
- [ ] Environment variables added (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
- [ ] NPM install completed successfully
- [ ] App started and shows "Running" status

**Testing:**
- [ ] `/api/health` returns success
- [ ] `/api/razorpay/public-key` returns key ID
- [ ] Website loads correctly
- [ ] CSS and JS files load (no 404 errors)
- [ ] Payment page opens
- [ ] Razorpay checkout works

---

## 🎯 Path Reference

### In server.js (Backend):

```javascript
// Access files in backend folder
const packagePath = path.join(__dirname, 'package.json');
// Result: /home/muscleme/backend/package.json

// Access files in public_html
const indexPath = path.join(__dirname, '..', 'public_html', 'index.html');
// Result: /home/muscleme/public_html/index.html

const cssPath = path.join(__dirname, '..', 'public_html', 'styles.css');
// Result: /home/muscleme/public_html/styles.css

const jsPath = path.join(__dirname, '..', 'public_html', 'main.js');
// Result: /home/muscleme/public_html/main.js
```

### In HTML Files:

```html
<!-- All files directly in public_html -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="payment.css">
<script src="config.js"></script>
<script src="main.js"></script>
<script src="simple-email.js"></script>
```

---

## 🎉 Success!

Once all tests pass, your website is fully deployed and working!

**Your URLs:**
- Frontend: `https://musclementorsacademy.com`
- Backend API: `https://musclementorsacademy.com/api`

Everything runs on the same server, same domain! 🚀

---

*For issues, check the Troubleshooting section above or contact your hosting provider.*


