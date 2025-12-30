# 🎯 Run Backend + Frontend on Same cPanel Server

## Your Goal
Run BOTH the Node.js backend AND the website frontend on the same cPanel hosting.

---

## ✅ Prerequisites

Your cPanel must have **Node.js support**. Check by:
1. Login to cPanel
2. Look for one of these:
   - **"Setup Node.js App"**
   - **"Node.js Selector"**
   - **"Application Manager"**

✅ **If you see it** → Continue with this guide
❌ **If you don't see it** → Contact your hosting provider to enable Node.js

---

## 🚀 Complete Setup Guide

### STEP 1: Prepare Your Files

Before uploading, let's update the configuration to use **relative URLs** (same domain).

#### Update `js/config.js`:

Open `js/config.js` and set `BACKEND_URL` to empty string (this makes it use the same domain):

```javascript
// Set your backend URL here:
BACKEND_URL: '', // Empty = use same domain as frontend
```

**That's it!** When `BACKEND_URL` is empty, it automatically uses:
- Local: `http://localhost:3001`
- Production: Same domain as your website

---

### STEP 2: Upload Files to cPanel

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to your home directory** (usually `/home/yourusername/`)

#### Create This Structure:

```
/home/yourusername/
├── public_html/                  ← Your website files
│   ├── index.html
│   ├── payment.html
│   ├── courses.html
│   ├── training-fees.html
│   ├── css/
│   │   ├── styles.css
│   │   └── payment.css
│   ├── js/
│   │   ├── config.js (with BACKEND_URL: '')
│   │   ├── main.js
│   │   └── simple-email.js
│   └── [all your images]
│
└── backend/                      ← Your Node.js backend
    ├── server.js
    ├── package.json
    └── (node_modules will be installed by cPanel)
```

#### Upload Steps:

**A. Upload Frontend:**
1. Go to `public_html` folder
2. Upload all HTML files
3. Upload `css/` folder
4. Upload `js/` folder (with updated config.js)
5. Upload all images

**B. Upload Backend:**
1. Go back to home directory (`/home/yourusername/`)
2. Create new folder: `backend`
3. Upload from your `server` folder:
   - `server.js`
   - `package.json`

---

### STEP 3: Set Up Node.js Application

1. **In cPanel, find "Setup Node.js App"** (or similar)
2. **Click "Create Application"**

#### Fill in these settings:

| Setting | Value |
|---------|-------|
| **Node.js Version** | 14.x or higher (16.x recommended) |
| **Application Mode** | Production |
| **Application Root** | `backend` (or full path: `/home/yourusername/backend`) |
| **Application URL** | `api` |
| **Application Startup File** | `server.js` |
| **Passenger Log File** | Leave default |

3. **Click "Create"**

---

### STEP 4: Add Environment Variables

In the Node.js App settings page, look for **"Environment Variables"** section:

Add these variables:

| Variable Name | Value |
|--------------|-------|
| `RAZORPAY_KEY_ID` | `rzp_live_Ra9dMWDeDR9sxr` |
| `RAZORPAY_KEY_SECRET` | `z3hbpqpvKC2XyWolIPkSSKJ9` |
| `PORT` | (Usually set automatically, leave default) |

**Save** the variables.

---

### STEP 5: Install Dependencies

In the Node.js App interface:

1. Find **"Run NPM Install"** button
2. Click it to install dependencies
3. Wait for installation to complete

**OR if you have SSH access:**

```bash
cd ~/backend
npm install
```

---

### STEP 6: Configure .htaccess for API Routes

You need to route `/api/*` requests to your Node.js app.

Create or edit `.htaccess` in `public_html`:

```apache
# Redirect API requests to Node.js app
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://127.0.0.1:YOUR_PORT/api/$1 [P,L]

# Or if cPanel provides a domain for the app
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ https://yourdomain.com:PORT/$1 [P,L]
```

**Note:** cPanel's Node.js setup usually handles this automatically. Check your Node.js app settings for the correct configuration.

---

### STEP 7: Alternative - Use Passenger and App URL

If your cPanel uses Passenger (most common), the "Application URL" you set (e.g., `api`) means:

- Your backend will be accessible at: `https://yourdomain.com/api`
- No `.htaccess` needed!
- The configuration in `config.js` with `BACKEND_URL: ''` will work automatically

---

### STEP 8: Start the Application

In cPanel Node.js App interface:

1. Look for **"Start"** or **"Run"** button
2. Click it to start your application
3. Check status - it should show **"Running"**

---

## ✅ Testing

### Test 1: Check Node.js App Status
In cPanel → Node.js App → Should show status: **"Running"**

### Test 2: Test Backend Health
Open browser and visit:
```
https://yourdomain.com/api/health
```

**Expected Response:**
```json
{"ok":true,"mode":"live"}
```

✅ If you see this → Backend is working!

### Test 3: Test Public Key Endpoint
```
https://yourdomain.com/api/razorpay/public-key
```

**Expected Response:**
```json
{"keyId":"rzp_live_Ra9dMWDeDR9sxr"}
```

### Test 4: Load Your Website
```
https://yourdomain.com
```
Should load normally.

### Test 5: Try Payment
1. Go to: `https://yourdomain.com/payment.html`
2. Fill in the form
3. Click "Pay with Razorpay"
4. ✅ Razorpay checkout should open!

---

## 🎯 How It Works

```
USER VISITS: https://yourdomain.com
     │
     ├─→ Static files (HTML/CSS/JS)
     │   Served from: /public_html/
     │
     └─→ API calls (/api/*)
         Served by: Node.js app in /backend/
         
SAME SERVER, SAME DOMAIN!
```

---

## 📋 File Structure Summary

```
cPanel Server (yourdomain.com)
│
├── public_html/              ← Website files (Frontend)
│   ├── index.html
│   ├── payment.html
│   ├── js/
│   │   └── config.js (BACKEND_URL: '')
│   └── css/
│
├── backend/                  ← Node.js app (Backend)
│   ├── server.js
│   ├── package.json
│   └── node_modules/
│
└── .htaccess (if needed)     ← API routing
```

---

## 🔧 Troubleshooting

### Problem: "Setup Node.js App" not in cPanel

**Solution:**
1. Check cPanel version (need version 11.82+)
2. Contact hosting provider to enable Node.js
3. Ask if they support "Node.js Selector" or "Passenger"
4. **Alternative:** Use separate backend deployment (Railway/Render)

---

### Problem: Node.js app won't start

**Check:**
1. Is `server.js` uploaded correctly?
2. Is `package.json` in the same folder?
3. Did NPM install run successfully?
4. Check error logs in cPanel Node.js interface

**Fix:**
- View error logs in cPanel → Node.js App → Logs
- Common issue: missing dependencies → Run NPM install again
- Port conflict: Change port in environment variables

---

### Problem: `/api/health` returns 404

**Possible causes:**
1. Node.js app not running
2. Application URL not configured correctly
3. Routing not set up

**Fix:**
- Check Node.js app status in cPanel (should be "Running")
- Verify "Application URL" is set to `api`
- Check if `.htaccess` routing is needed
- Restart the Node.js application

---

### Problem: CORS errors

**This shouldn't happen** since frontend and backend are on same domain!

But if it does:
- Check `server/server.js` - make sure your domain is in `allowedOrigins`
- Add both www and non-www versions
- Restart Node.js app

---

### Problem: Environment variables not working

**Check:**
1. Go to cPanel → Node.js App → Environment Variables
2. Verify both keys are there
3. No extra spaces in values
4. Restart the app after adding variables

**Fix:**
- Re-add the variables
- Click "Save"
- Click "Restart" for the app

---

## 🎛️ cPanel Node.js App Settings Reference

### Typical Configuration:

```
Application Properties:
├─ Node.js Version: 16.x
├─ Application Mode: Production
├─ Application Root: /home/user/backend
├─ Application URL: api
├─ Application Startup File: server.js
└─ Environment Variables:
   ├─ RAZORPAY_KEY_ID=rzp_live_...
   └─ RAZORPAY_KEY_SECRET=...
```

---

## 💡 Pro Tips

### Tip 1: Use Git for Easy Updates
If your cPanel supports Git:
1. Set up Git repository in cPanel
2. Connect to your GitHub
3. Updates pull automatically

### Tip 2: Monitor Logs
Check Node.js app logs regularly:
- cPanel → Node.js App → View Logs
- Look for errors or warnings

### Tip 3: Restart After Changes
After updating `server.js` or environment variables:
1. Go to Node.js App settings
2. Click "Restart"
3. Wait for status to show "Running"

### Tip 4: Use PM2 (Advanced)
If available, use PM2 for better process management:
- Automatic restart on crashes
- Better logging
- Easy monitoring

---

## 📊 Quick Checklist

**Before Starting:**
- [ ] cPanel has Node.js support
- [ ] Files are ready to upload
- [ ] `config.js` has `BACKEND_URL: ''`

**File Upload:**
- [ ] Frontend files in `public_html`
- [ ] Backend files in `backend` folder
- [ ] `package.json` uploaded
- [ ] `server.js` uploaded

**Node.js App Setup:**
- [ ] App created in cPanel
- [ ] Application URL set to `api`
- [ ] Environment variables added
- [ ] NPM install completed
- [ ] App started and running

**Testing:**
- [ ] `/api/health` returns success
- [ ] Website loads correctly
- [ ] Payment page opens
- [ ] Razorpay checkout works

---

## 🎉 Advantages of Same Server Setup

✅ **Simpler:** Everything in one place
✅ **No CORS issues:** Same domain
✅ **Easier management:** One hosting account
✅ **Better performance:** No external API calls
✅ **Cheaper:** Only one hosting plan

---

## ⚠️ Important Notes

### Security:
1. **Never** commit your API keys to Git
2. Always use environment variables
3. Keep cPanel password secure
4. Enable 2FA if available

### Maintenance:
1. Update Node.js version occasionally
2. Keep dependencies updated (`npm update`)
3. Monitor disk space usage
4. Check logs for errors regularly

### Backup:
1. Backup both `public_html` and `backend` folders
2. Export environment variables settings
3. Keep local copies of files
4. Use Git for version control

---

## 🆘 If Node.js Not Available

If your cPanel doesn't support Node.js:

**Option 1:** Upgrade hosting plan
- Ask provider about Node.js hosting
- May need VPS or higher tier

**Option 2:** Split deployment
- Frontend on cPanel (static files)
- Backend on Railway/Render (free)
- Follow `START_HERE_CPANEL.md` guide

**Option 3:** Change hosting
Consider hosts with Node.js support:
- Hostinger (Node.js + cPanel)
- A2 Hosting (Node.js support)
- InMotion (Node.js available)
- Bluehost VPS (Node.js support)

---

## 📞 Getting Help

**Check with your hosting provider:**
1. Do they support Node.js?
2. What's the maximum Node.js version?
3. How to set up Node.js applications?
4. Do they use Passenger or another system?
5. Any specific configuration needed?

**Common hosting providers with Node.js:**
- cPanel with CloudLinux + Node.js Selector ✅
- Hostinger ✅
- A2 Hosting ✅
- InMotion ✅
- NameCheap (some plans) ✅
- GoDaddy (VPS/Dedicated only) ⚠️

---

## 🎊 Summary

**Setup:**
1. ✅ Upload frontend to `public_html`
2. ✅ Upload backend to `backend` folder
3. ✅ Create Node.js app in cPanel
4. ✅ Set environment variables
5. ✅ Start the app

**Configuration:**
- `BACKEND_URL: ''` in config.js (use same domain)
- Application URL: `api`
- Everything runs on: `yourdomain.com`

**Result:**
- Frontend: `https://yourdomain.com`
- Backend: `https://yourdomain.com/api`
- Same server, same domain! 🎉

---

## 🚀 Next Steps

1. **Check** if your cPanel has Node.js support
2. **Update** `config.js` with `BACKEND_URL: ''`
3. **Follow** the steps above
4. **Test** your payment integration
5. **Enjoy** your working payment system! ✨

---

*For any issues, check the Troubleshooting section or contact your hosting provider's support.*

