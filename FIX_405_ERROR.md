# 🔧 Fixing 405 Method Not Allowed Error

## 🔎 What Causes 405 Error?

A **405 Method Not Allowed** error means:
- The endpoint exists, but doesn't accept the HTTP method (POST) you're using
- OR the request is going to the wrong URL (frontend instead of backend)

---

## ✅ What I Fixed

### 1. **Improved Local Development Detection**
- Now detects `127.0.0.1` in addition to `localhost`
- Automatically uses `http://localhost:3001` for backend when running locally
- Prevents requests from going to the frontend server (port 5505) instead of backend (port 3001)

### 2. **Better Error Messages**
- Specific error message for 405 errors
- Shows the exact URL being called
- Helps identify if backend is running

### 3. **Enhanced Server Logging**
- Server now logs all method attempts
- Better debugging information

---

## 🚀 Quick Fix Steps

### Step 1: Make Sure Backend is Running

Open a terminal and start your backend:

```bash
cd server
npm install  # If you haven't already
npm start
```

You should see:
```
✅ Razorpay API running on http://localhost:3001
```

### Step 2: Test Backend Directly

Open browser and visit:
```
http://localhost:3001/api/health
```

Should return: `{"ok":true,"mode":"live"}`

### Step 3: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Click "Pay with Razorpay"
4. Look for these logs:
   ```
   Creating order on server: http://localhost:3001/api/razorpay/create-order
   Request details: { method: 'POST', url: '...', amount: ... }
   ```

### Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Pay with Razorpay"
4. Look for the request to `/api/razorpay/create-order`
5. Check:
   - **Status**: Should be 200 (not 405)
   - **Method**: Should be POST
   - **URL**: Should be `http://localhost:3001/api/razorpay/create-order`

---

## 🐛 Common Issues

### Issue 1: Backend Not Running

**Symptom**: 405 or 404 error

**Solution**:
```bash
cd server
npm start
```

### Issue 2: Wrong Port

**Symptom**: Request going to port 5505 instead of 3001

**Solution**: 
- The code now auto-detects local development
- If still having issues, manually set `BACKEND_URL` in `js/config.js`:
  ```javascript
  BACKEND_URL: 'http://localhost:3001'
  ```

### Issue 3: CORS Issues

**Symptom**: Network error or CORS error in console

**Solution**: 
- Backend CORS is configured to allow all origins in development
- Check `server/server.js` - CORS should allow your frontend URL

### Issue 4: Using 127.0.0.1 Instead of localhost

**Symptom**: Code was trying to use `http://127.0.0.1:5505` instead of backend

**Solution**: 
- ✅ **FIXED!** Code now detects `127.0.0.1` and uses `localhost:3001` for backend

---

## 🧪 Testing Checklist

- [ ] Backend server is running on port 3001
- [ ] `http://localhost:3001/api/health` returns success
- [ ] Browser console shows correct endpoint URL
- [ ] Network tab shows POST request to correct URL
- [ ] No 405 errors in console or network tab

---

## 📝 Manual Configuration (If Auto-Detection Fails)

If the automatic detection doesn't work, manually set the backend URL:

**In `js/config.js`:**

```javascript
BACKEND_URL: 'http://localhost:3001', // For local development
// OR
BACKEND_URL: 'https://your-backend.com', // For production
```

---

## 🔍 Debugging Steps

1. **Check what URL is being used**:
   - Open browser console
   - Look for: `Creating order on server: [URL]`
   - Verify it's pointing to your backend (port 3001), not frontend (port 5505)

2. **Test backend directly**:
   ```bash
   curl -X POST http://localhost:3001/api/razorpay/create-order \
     -H "Content-Type: application/json" \
     -d '{"amount":990000,"currency":"INR"}'
   ```

3. **Check server logs**:
   - Look at the terminal where backend is running
   - Should see: "Creating Razorpay order: { amount: 990000, ... }"

---

## ✅ Success Indicators

When everything works:
- ✅ Console: "Creating order on server: http://localhost:3001/api/razorpay/create-order"
- ✅ Console: "Order created successfully: { id: 'order_xxx', ... }"
- ✅ Network tab: POST request returns 200 status
- ✅ Razorpay checkout popup opens

---

**The main fix**: The code now properly detects local development (including `127.0.0.1`) and automatically uses the correct backend URL (`localhost:3001`) instead of trying to use the frontend server.

