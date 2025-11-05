# Razorpay Integration Setup Guide

## Overview
This guide will help you set up Razorpay payment gateway integration for your Muscle Mentors website. Razorpay is India's leading payment gateway that supports multiple payment methods including cards, UPI, net banking, and digital wallets.

## Prerequisites
- Razorpay account (sign up at https://dashboard.razorpay.com/)
- Valid business documents for KYC verification
- Website domain (for webhook configuration)

## Step 1: Create Razorpay Account

1. **Sign Up**: Go to https://dashboard.razorpay.com/ and create an account
2. **Complete KYC**: Upload required business documents for verification
3. **Wait for Approval**: Razorpay will review your documents (usually 1-2 business days)

## Step 2: Get API Keys

1. **Login** to your Razorpay dashboard
2. **Navigate** to Settings > API Keys
3. **Generate** API Keys:
   - **Key ID**: This is your public key (safe to use in frontend)
   - **Key Secret**: This is your private key (keep secure, use only on server-side)

## Step 3: Configure Your Website

### Update Configuration File
Open `js/config.js` and update the Razorpay configuration:

```javascript
RAZORPAY: {
    keyId: 'YOUR_ACTUAL_KEY_ID', // Replace with your actual Key ID
    keySecret: 'YOUR_ACTUAL_KEY_SECRET', // Keep this secure
    currency: 'INR',
    companyName: 'Muscle Mentors',
    description: 'Premium Gym Training Education',
    theme: {
        color: '#2563eb' // Your brand color
    },
    paymentMethods: {
        card: true,
        upi: true,
        netbanking: true,
        wallet: true,
        emi: false
    }
}
```

### Test with Test Keys First
Razorpay provides test keys for development:
- **Test Key ID**: Available in your dashboard under "Test Mode"
- **Test Key Secret**: Available in your dashboard under "Test Mode"

Use test keys during development and switch to live keys for production.

## Step 4: Payment Flow

### How It Works
1. **User fills** the payment form with their details
2. **Form validation** ensures all required fields are completed
3. **Razorpay checkout** opens with pre-filled user information
4. **User selects** their preferred payment method (UPI, Card, Net Banking, etc.)
5. **Payment processing** happens securely on Razorpay's servers
6. **Success/failure** callback handles the result

### Supported Payment Methods

#### 1. Credit/Debit Cards
- Visa, Mastercard, American Express, RuPay
- International cards supported
- 3D Secure authentication

#### 2. UPI (Unified Payments Interface)
- Google Pay, PhonePe, Paytm, BHIM
- All UPI apps supported
- Instant payments

#### 3. Net Banking
- 50+ banks supported
- SBI, HDFC, ICICI, Axis, and more
- Secure bank authentication

#### 4. Digital Wallets
- Paytm, Mobikwik, Freecharge, JioMoney
- Quick and convenient payments

## Step 5: Production Setup

### Webhook Configuration
For production, set up webhooks to verify payments:

1. **Go to** Settings > Webhooks in your Razorpay dashboard
2. **Add webhook URL**: `https://yourdomain.com/webhook/razorpay`
3. **Select events**: `payment.captured`, `payment.failed`
4. **Verify signature** in your webhook handler

### Server-Side Verification
Always verify payments on your server:

```javascript
// Example webhook handler (Node.js)
const crypto = require('crypto');

function verifyWebhookSignature(body, signature, secret) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    
    return expectedSignature === signature;
}
```

## Step 6: Testing

### Test Cards
Use these test card numbers for testing:

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa | 4111 1111 1111 1111 | 123 | Any future date |
| Mastercard | 5555 5555 5555 4444 | 123 | Any future date |
| RuPay | 6070 0000 0000 0000 | 123 | Any future date |

### Test UPI IDs
- `success@razorpay`
- `failure@razorpay`

### Test Net Banking
- Use any bank from the list
- Use any credentials (test mode)

## Step 7: Security Best Practices

### Frontend Security
- ✅ Never expose your Key Secret in frontend code
- ✅ Always use HTTPS in production
- ✅ Validate all form inputs
- ✅ Use Razorpay's secure checkout

### Backend Security
- ✅ Verify webhook signatures
- ✅ Store Key Secret securely
- ✅ Log all payment attempts
- ✅ Implement rate limiting

## Step 8: Monitoring and Analytics

### Razorpay Dashboard
- Monitor transactions in real-time
- View payment success rates
- Analyze payment method preferences
- Download reports

### Key Metrics to Track
- Payment success rate
- Average transaction value
- Popular payment methods
- Failed payment reasons

## Troubleshooting

### Common Issues

#### 1. "Payment gateway not configured"
- Check if `CONFIG.RAZORPAY.keyId` is set correctly
- Ensure Razorpay SDK is loaded

#### 2. "Invalid Key ID"
- Verify your Key ID in Razorpay dashboard
- Check if you're using test/live keys correctly

#### 3. Payment Fails
- Check Razorpay dashboard for error details
- Verify webhook configuration
- Check server logs

#### 4. UPI Not Working
- Ensure UPI is enabled in your Razorpay account
- Check if the user has a valid UPI ID

### Support
- **Razorpay Support**: https://razorpay.com/support/
- **Documentation**: https://razorpay.com/docs/
- **Status Page**: https://status.razorpay.com/

## Pricing

### Razorpay Fees
- **Cards**: 2% per transaction
- **UPI**: 0.5% per transaction
- **Net Banking**: 2% per transaction
- **Wallets**: 2% per transaction

### Minimum Transaction
- ₹1 for most payment methods
- No setup fees or monthly charges

## Next Steps

1. **Test thoroughly** with test keys
2. **Set up webhooks** for production
3. **Monitor payments** in dashboard
4. **Optimize** based on user preferences
5. **Scale** as your business grows

## Additional Features

### Recurring Payments
- Set up subscriptions for monthly plans
- Automatic billing for annual plans
- Proration handling

### Refunds
- Process full or partial refunds
- Automatic refund handling
- Refund status tracking

### Analytics
- Payment method analytics
- Success rate monitoring
- Revenue tracking

---

**Note**: This integration is designed for Indian businesses. For international payments, consider additional payment gateways like Stripe or PayPal.
