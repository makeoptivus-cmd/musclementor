# 🗑️ Files to Remove Before Deployment

These files are **NOT needed** for cPanel deployment. You can delete them to keep your project clean.

---

## ❌ Documentation Files (Keep only CPANEL_DEPLOYMENT_COMPLETE.md)

**Delete these guide files:**
- ❌ `ACHIEVEMENTS_CERTIFICATES_SETUP.md`
- ❌ `ACHIEVEMENTS_SLIDER_SETUP.md`
- ❌ `BEFORE_AFTER_COMPARISON.md`
- ❌ `CERTIFICATIONS_GALLERY_GUIDE.md`
- ❌ `CLEAN_IMAGE_SLIDER_GUIDE.md`
- ❌ `CPANEL_SAME_SERVER.md`
- ❌ `CPANEL_SAME_SERVER_QUICK.txt`
- ❌ `CPANEL_SIMPLE_FIX.txt`
- ❌ `DEPLOYMENT_GUIDE.md`
- ❌ `FIX_405_ERROR.md`
- ❌ `GUIDES_INDEX.md`
- ❌ `HERO_BACKGROUND_SETUP.md`
- ❌ `PAGE_SECTIONS_STRUCTURE.md`
- ❌ `PAYMENT_ARCHITECTURE.md`
- ❌ `QUICK_FIX_GUIDE.md`
- ❌ `RAZORPAY_SETUP_GUIDE.md`
- ❌ `README_PAYMENT_FIX.md`
- ❌ `REALTIME_CONTACT_SETUP.md`
- ❌ `SETUP_SUMMARY.md`
- ❌ `SLIDER_QUICK_START.md`
- ❌ `SOLUTION_SUMMARY.md`
- ❌ `START_HERE_CPANEL.md`
- ❌ `server/ENV_SETUP.md`
- ❌ `server/README.md`

**Keep this one:**
- ✅ `CPANEL_DEPLOYMENT_COMPLETE.md` (your main deployment guide)

---

## ❌ Test/Template Files (Optional - Delete if not needed)

**Delete these if you don't need them:**
- ❌ `admin-template.html` (if not using admin panel)
- ❌ `test-form.html` (test file, not needed in production)
- ❌ `emailjs-template.html` (template file, not needed)
- ❌ `vercel.json` (only needed for Vercel deployment, not cPanel)

---

## ❌ Configuration Files (Not needed for cPanel)

**Delete these:**
- ❌ `RAZORPAY_DEMO_CONFIG.js` (demo file, not needed)

---

## ✅ Files to KEEP

### Frontend Files (Upload to public_html/):
- ✅ `index.html`
- ✅ `payment.html`
- ✅ `courses.html`
- ✅ `training-fees.html`
- ✅ `css/styles.css` → Move to `public_html/styles.css`
- ✅ `css/payment.css` → Move to `public_html/payment.css`
- ✅ `js/config.js` → Move to `public_html/config.js`
- ✅ `js/main.js` → Move to `public_html/main.js`
- ✅ `js/simple-email.js` → Move to `public_html/simple-email.js`
- ✅ `js/realtime-contact.js` → Move to `public_html/realtime-contact.js`
- ✅ All image files (`.png`, `.jpg`, `.JPG`)

### Backend Files (Upload to backend/):
- ✅ `server/server.js` → Upload as `server.js`
- ✅ `server/package.json` → Upload as `package.json`

---

## 📋 Quick Cleanup Steps

1. **Delete all `.md` files** except `CPANEL_DEPLOYMENT_COMPLETE.md`
2. **Delete test files**: `test-form.html`, `admin-template.html` (if not needed)
3. **Delete**: `vercel.json`, `RAZORPAY_DEMO_CONFIG.js`
4. **Move CSS files** from `css/` folder to root (or directly upload to cPanel)
5. **Move JS files** from `js/` folder to root (or directly upload to cPanel)

---

## 🎯 Final Structure After Cleanup

```
Your Local Project/
├── CPANEL_DEPLOYMENT_COMPLETE.md  ← Keep this guide
│
├── index.html                     ← Upload to public_html/
├── payment.html                   ← Upload to public_html/
├── courses.html                   ← Upload to public_html/
├── training-fees.html             ← Upload to public_html/
│
├── styles.css                     ← Upload to public_html/
├── payment.css                    ← Upload to public_html/
│
├── config.js                      ← Upload to public_html/
├── main.js                        ← Upload to public_html/
├── simple-email.js                ← Upload to public_html/
├── realtime-contact.js            ← Upload to public_html/
│
├── [all image files]              ← Upload to public_html/
│
└── server/
    ├── server.js                  ← Upload to backend/
    └── package.json              ← Upload to backend/
```

---

**Note:** You can delete the `css/` and `js/` folders after moving files, or just upload files directly to cPanel without creating those folders.


