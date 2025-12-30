# Environment Variables Setup

This guide shows you how to set up environment variables for the Node.js backend.

## 📋 Required Environment Variables

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID | `rzp_live_Ra9dMWDeDR9sxr` |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret | `z3hbpqpvKC2XyWolIPkSSKJ9` |
| `PORT` | Server port (optional) | `3001` |

---

## 🏠 Local Development Setup

### Step 1: Create `.env` file

In the `server/` folder, create a file named `.env`:

```bash
# Navigate to server folder
cd server

# Create .env file (Windows)
type nul > .env

# Or create manually in your editor
```

### Step 2: Add your variables

Open `server/.env` and add:

```env
RAZORPAY_KEY_ID=rzp_live_Ra9dMWDeDR9sxr
RAZORPAY_KEY_SECRET=z3hbpqpvKC2XyWolIPkSSKJ9
PORT=3001
```

### Step 3: Install dependencies

```bash
cd server
npm install
```

This will install `dotenv` package which loads the `.env` file.

### Step 4: Run the server

```bash
npm start
```

The server will automatically load variables from `.env` file.

---

## 🌐 cPanel Production Setup

### Option 1: Using cPanel Node.js App Environment Variables (Recommended)

1. **Login to cPanel**
2. **Find "Setup Node.js App"** (or "Node.js Selector")
3. **Click on your Node.js application**
4. **Go to "Environment Variables" section**
5. **Add these variables:**

   | Variable Name | Value |
   |--------------|-------|
   | `RAZORPAY_KEY_ID` | `rzp_live_Ra9dMWDeDR9sxr` |
   | `RAZORPAY_KEY_SECRET` | `z3hbpqpvKC2XyWolIPkSSKJ9` |
   | `PORT` | (Leave empty or set to your port) |

6. **Click "Save"**
7. **Restart your Node.js application**

✅ **Done!** The server will use these environment variables.

---

### Option 2: Using .env file in cPanel

1. **Login to cPanel File Manager**
2. **Navigate to your backend folder** (e.g., `/home/yourusername/backend/`)
3. **Create a new file** named `.env`
4. **Add your variables:**

   ```env
   RAZORPAY_KEY_ID=rzp_live_Ra9dMWDeDR9sxr
   RAZORPAY_KEY_SECRET=z3hbpqpvKC2XyWolIPkSSKJ9
   PORT=3001
   ```

5. **Save the file**
6. **Restart your Node.js application**

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**

1. **Never commit `.env` file to Git** - It's already in `.gitignore`
2. **Never share your `RAZORPAY_KEY_SECRET`** - Keep it private
3. **Use different keys for test and production**
4. **In cPanel, use Environment Variables** instead of `.env` file for better security

---

## ✅ Testing

After setting up environment variables, test your backend:

```bash
# Test health endpoint
curl https://yourdomain.com/api/health

# Should return:
# {"ok":true,"mode":"live"}
```

---

## 🆘 Troubleshooting

### Problem: Environment variables not loading

**Solution:**
- Make sure `.env` file is in the `server/` folder
- Check for typos in variable names (must be exact: `RAZORPAY_KEY_ID`)
- Restart the server after creating/updating `.env`
- In cPanel, make sure you clicked "Save" and restarted the app

### Problem: "dotenv is not defined"

**Solution:**
```bash
cd server
npm install
```

### Problem: Still using hardcoded values

**Solution:**
- Check that `.env` file exists in `server/` folder
- Verify variable names match exactly (case-sensitive)
- Restart the Node.js application

---

## 📝 Example .env File

Create `server/.env` with this content:

```env
# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_live_Ra9dMWDeDR9sxr
RAZORPAY_KEY_SECRET=z3hbpqpvKC2XyWolIPkSSKJ9

# Server Port (optional - usually auto-set by cPanel)
PORT=3001
```

**Note:** Replace the values with your actual Razorpay keys!

---

## 🎯 Quick Reference

**Local Development:**
- Create `server/.env` file
- Add your variables
- Run `npm install` (installs dotenv)
- Run `npm start`

**cPanel Production:**
- Go to Node.js App → Environment Variables
- Add variables in cPanel interface
- Restart the app
- ✅ Done!

