/**
 * CONFIGURATION FILE FOR THIRD-PARTY INTEGRATIONS
 * Update these settings with your actual API keys and service IDs
 */

const CONFIG = {
    // EmailJS Configuration
    EMAILJS: {
        serviceID: 'service_e88yz2p', // Get this from https://www.emailjs.com/
        templateID: 'template_wgcxuip', // Create a template in EmailJS dashboard
        publicKey: 'zL--s0K3zFjEPi1kO' // Your EmailJS public key
    },
    
    // Tawk.to Live Chat Configuration
    TAWKTO: {
        propertyId: 'YOUR_TAWK_PROPERTY_ID', // Get this from https://www.tawk.to/ (should be like: 1234567890abcdef1234567890abcdef)
        widgetId: 'default'
    },
    
    // Google Analytics Configuration
    GOOGLE_ANALYTICS: {
        measurementId: 'GA_MEASUREMENT_ID' // Get this from Google Analytics 4
    },
    
    // Formspree Configuration (Alternative to EmailJS)
    FORMSPREE: {
        endpoint: 'https://formspree.io/f/mzzanrva', // Get this from https://formspree.io/
        enabled: false // Set to true to use Formspree instead of EmailJS
    },
    
    // Netlify Forms Configuration (Alternative)
    NETLIFY: {
        enabled: false, // Set to true if using Netlify hosting
        formName: 'contact-form' // The name attribute of your form
    },
    
    // Intercom Configuration (Alternative to Tawk.to)
    INTERCOM: {
        appId: 'YOUR_INTERCOM_APP_ID', // Get this from https://www.intercom.com/
        enabled: false // Set to true to use Intercom instead of Tawk.to
    },
    
    // Custom API Configuration
    CUSTOM_API: {
        endpoint: 'https://your-api.com/contact',
        enabled: false,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN'
        }
    },
    
    // Razorpay Payment Gateway Configuration
    RAZORPAY: {
        // Default to a test key; replace via URL ?rk=rzp_test_xxx or localStorage
        keyId: 'rzp_test_1234567890abcdef', // Test Key ID (override via rk param or localStorage)
        keySecret: '', // NEVER keep Key Secret in frontend. Move to server-side only.
        currency: 'INR', // Indian Rupees
        companyName: 'Muscle Mentors',
        description: 'Premium Gym Training Education',
        theme: {
            color: '#D4AF37' // Your brand color (Metallic Gold)
        },
        // Payment method preferences
        paymentMethods: {
            card: true,
            upi: true,
            netbanking: true,
            wallet: true,
            emi: false
        },
        // Backend endpoints configuration
        // IMPORTANT: Update BACKEND_URL with your deployed backend URL
        // 
        // For cPanel hosting, deploy backend separately to:
        // - Railway: https://railway.app/
        // - Render: https://render.com/
        // - Cyclic: https://cyclic.sh/
        // Then update BACKEND_URL below with your deployment URL
        
        // Set your backend URL here:
        BACKEND_URL: '', // Example: 'https://your-app.up.railway.app'
        
        // Automatic endpoint detection
        get orderEndpoint() {
            const backendUrl = this.BACKEND_URL || (window.location.hostname === 'localhost' 
                ? 'http://localhost:3001' 
                : window.location.origin);
            return backendUrl + '/api/razorpay/create-order';
        },
        get verifyEndpoint() {
            const backendUrl = this.BACKEND_URL || (window.location.hostname === 'localhost'
                ? 'http://localhost:3001'
                : window.location.origin);
            return backendUrl + '/api/razorpay/verify-payment';
        }
    }
};

// Allow runtime override of Razorpay Key ID for easy testing
try {
    const params = new URLSearchParams(window.location.search);
    const runtimeKey = params.get('rk') || (window.localStorage && localStorage.getItem('RAZORPAY_KEY_ID')) || '';
    if (runtimeKey) {
        CONFIG.RAZORPAY.keyId = runtimeKey;
    }
} catch (e) {
    // ignore
}

// If no explicit key provided, fetch Key ID from our backend using the orderEndpoint origin
(async function ensureRazorpayKeyId() {
    try {
        if (!CONFIG.RAZORPAY.orderEndpoint) return;
        const needsFetch = !CONFIG.RAZORPAY.keyId || CONFIG.RAZORPAY.keyId === 'rzp_test_1234567890abcdef';
        if (!needsFetch) return;
        const origin = new URL(CONFIG.RAZORPAY.orderEndpoint).origin;
        const resp = await fetch(origin + '/api/razorpay/public-key', { credentials: 'omit' });
        if (!resp.ok) return;
        const data = await resp.json();
        if (data && data.keyId) {
            CONFIG.RAZORPAY.keyId = data.keyId;
            try { localStorage.setItem('RAZORPAY_KEY_ID', data.keyId); } catch (_) {}
        }
    } catch (err) {
        console.warn('Could not fetch Razorpay public key from server:', err);
    }
})();

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. EMAILJS SETUP:
 *    - Go to https://www.emailjs.com/
 *    - Create an account and verify your email
 *    - Create a new service (Gmail, Outlook, etc.)
 *    - Create a new email template
 *    - Get your Public Key from Account > API Keys
 *    - Replace the values above with your actual IDs
 * 
 * 2. TAWK.TO SETUP:
 *    - Go to https://www.tawk.to/
 *    - Create an account and add your website
 *    - Get your Property ID from the dashboard
 *    - Replace 'YOUR_TAWK_ID' with your actual Property ID
 * 
 * 3. GOOGLE ANALYTICS SETUP:
 *    - Go to https://analytics.google.com/
 *    - Create a new GA4 property
 *    - Get your Measurement ID (starts with G-)
 *    - Replace 'GA_MEASUREMENT_ID' with your actual ID
 * 
 * 4. FORMSPREE SETUP (Alternative to EmailJS):
 *    - Go to https://formspree.io/
 *    - Create an account and new form
 *    - Get your form endpoint URL
 *    - Set CONFIG.FORMSPREE.enabled = true
 *    - Replace 'YOUR_FORM_ID' with your actual form ID
 * 
 * 5. NETLIFY FORMS SETUP (If using Netlify hosting):
 *    - Deploy your site to Netlify
 *    - Add netlify attribute to your form: <form netlify>
 *    - Set CONFIG.NETLIFY.enabled = true
 * 
 * 6. INTERCOM SETUP (Alternative to Tawk.to):
 *    - Go to https://www.intercom.com/
 *    - Create an account and workspace
 *    - Get your App ID from Settings > Installation
 *    - Set CONFIG.INTERCOM.enabled = true
 *    - Replace 'YOUR_INTERCOM_APP_ID' with your actual App ID
 * 
 * 7. RAZORPAY SETUP:
 *    - Go to https://dashboard.razorpay.com/
 *    - Create an account and complete KYC verification
 *    - Go to Settings > API Keys
 *    - Generate API Keys (Key ID and Key Secret)
 *    - Replace 'YOUR_RAZORPAY_KEY_ID' with your actual Key ID
 *    - Keep Key Secret secure (only use on server-side for production)
 *    - Configure webhook endpoints for payment verification
 *    - Test with Razorpay test keys first
 */

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
