/**
 * DEMO RAZORPAY CONFIGURATION
 * 
 * This file contains demo/test configuration for Razorpay integration.
 * Replace the values in js/config.js with your actual Razorpay credentials.
 * 
 * IMPORTANT: 
 * - These are demo values and will not work for actual payments
 * - Get your real API keys from https://dashboard.razorpay.com/
 * - Never commit real API keys to version control
 */

// Demo Razorpay Configuration
const DEMO_RAZORPAY_CONFIG = {
    // Test Key ID (replace with your actual test key)
    keyId: 'rzp_test_1234567890abcdef',
    
    // Test Key Secret (replace with your actual test secret)
    keySecret: 'your_test_secret_key_here',
    
    // Currency (INR for India)
    currency: 'INR',
    
    // Your company details
    companyName: 'Muscle Mentors',
    description: 'Premium Gym Training Education',
    
    // Theme configuration
    theme: {
        color: '#2563eb' // Your brand color
    },
    
    // Payment method preferences
    paymentMethods: {
        card: true,      // Credit/Debit cards
        upi: true,       // UPI payments
        netbanking: true, // Net banking
        wallet: true,    // Digital wallets
        emi: false       // EMI options (optional)
    }
};

// Test card numbers for development
const TEST_CARDS = {
    visa: {
        number: '4111 1111 1111 1111',
        cvv: '123',
        expiry: '12/25',
        name: 'Test User'
    },
    mastercard: {
        number: '5555 5555 5555 4444',
        cvv: '123',
        expiry: '12/25',
        name: 'Test User'
    },
    rupay: {
        number: '6070 0000 0000 0000',
        cvv: '123',
        expiry: '12/25',
        name: 'Test User'
    }
};

// Test UPI IDs
const TEST_UPI_IDS = [
    'success@razorpay',
    'failure@razorpay'
];

// Instructions for setup
const SETUP_INSTRUCTIONS = `
RAZORPAY SETUP INSTRUCTIONS:

1. Create Razorpay Account:
   - Go to https://dashboard.razorpay.com/
   - Sign up and complete KYC verification

2. Get API Keys:
   - Go to Settings > API Keys
   - Copy your Test Key ID and Test Key Secret
   - Replace the values in js/config.js

3. Test Configuration:
   - Use test keys during development
   - Switch to live keys for production
   - Test with the provided test card numbers

4. Production Setup:
   - Set up webhooks for payment verification
   - Implement server-side payment verification
   - Monitor payments in Razorpay dashboard

For detailed setup instructions, see RAZORPAY_SETUP_GUIDE.md
`;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEMO_RAZORPAY_CONFIG,
        TEST_CARDS,
        TEST_UPI_IDS,
        SETUP_INSTRUCTIONS
    };
} else {
    window.DEMO_RAZORPAY_CONFIG = DEMO_RAZORPAY_CONFIG;
    window.TEST_CARDS = TEST_CARDS;
    window.TEST_UPI_IDS = TEST_UPI_IDS;
    window.SETUP_INSTRUCTIONS = SETUP_INSTRUCTIONS;
}

console.log('Razorpay Demo Configuration Loaded');
console.log(SETUP_INSTRUCTIONS);
