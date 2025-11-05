/**
 * MUSCLE MENTORS - MAIN JAVASCRIPT
 * Interactive functionality for the gym training education website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initCourseFilters();
    initPricingToggle();
    initFAQAccordion();
    initPaymentForm();
    initFormValidation();
    initPromoCode();
    initScrollEffects();
    initEmailEnhancements();
    initCourseCheckout();
    
    // Initialize simple contact form
    if (document.getElementById('contact-form')) {
        console.log('Main.js: Contact form found, loading simple email script...');
        const script = document.createElement('script');
        script.src = 'js/simple-email.js';
        script.onload = function() {
            console.log('Main.js: Simple email script loaded successfully');
        };
        script.onerror = function() {
            console.error('Main.js: Failed to load simple email script');
        };
        document.head.appendChild(script);
    } else {
        console.log('Main.js: Contact form not found on this page');
    }
});

/**
 * MOBILE NAVIGATION
 */
function initMobileNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !navMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * EMAIL INPUT ENHANCEMENTS
 * - Auto-insert '@' before 'gmail.com' if missing
 * - Live cleanup of spaces and multiple '@'
 * - Live validity feedback using existing validation
 */
function initEmailEnhancements() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    if (!emailInputs || emailInputs.length === 0) return;
    
    emailInputs.forEach(input => {
        // Normalize on input
        input.addEventListener('input', function() {
            let value = this.value;
            // Remove spaces
            if (value.indexOf(' ') !== -1) {
                value = value.replace(/\s+/g, '');
            }
            // Ensure only a single '@'
            const atCount = (value.match(/@/g) || []).length;
            if (atCount > 1) {
                // Keep the first '@', remove the rest
                const firstAtIndex = value.indexOf('@');
                value = value.slice(0, firstAtIndex + 1) + value.slice(firstAtIndex + 1).replace(/@/g, '');
            }
            // If user typed 'gmail.com' without '@', insert it
            // Cases: "namegmail.com", "name.gmail.com" → "name@gmail.com"
            value = value.replace(/^(.*?)(?:\.|)gmail\.com$/i, function(_, local) {
                // If local already ends with '@', keep as is; else insert '@'
                return local.endsWith('@') ? local + 'gmail.com' : local + '@gmail.com';
            });
            // If value starts with 'gmail.com', prepend '@'
            if (/^gmail\.com$/i.test(value)) {
                value = '@' + value;
            }
            // Assign back only if changed to avoid moving caret unnecessarily
            if (this.value !== value) {
                const cursorPos = this.selectionStart;
                this.value = value;
                // Best-effort keep cursor position
                try { this.setSelectionRange(cursorPos, cursorPos); } catch (_) {}
            }
            // Live validate using existing validation
            validateField(this);
        });
        
        // Final normalization on blur
        input.addEventListener('blur', function() {
            let value = this.value.trim();
            if (!value) return;
            // If ends with 'gmail.com' and no '@' anywhere, prepend '@' after presumed local part
            if (/gmail\.com$/i.test(value) && value.indexOf('@') === -1) {
                // Try to split local part from trailing 'gmail.com'
                value = value.replace(/^(.*)gmail\.com$/i, function(_, local) {
                    return local + '@gmail.com';
                });
            }
            this.value = value;
            validateField(this);
        });
    });
}

/**
 * SMOOTH SCROLLING
 */
function initSmoothScrolling() {
    // Handle anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * COURSE FILTERS
 */
function initCourseFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const courseCards = document.querySelectorAll('.course-card');
    
    if (filterTabs.length === 0) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter courses
            courseCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * PRICING TOGGLE (Monthly/Annual)
 */
function initPricingToggle() {
    const pricingToggle = document.getElementById('pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const annualSavings = document.querySelectorAll('.annual-savings');
    
    if (!pricingToggle) return;
    
    pricingToggle.addEventListener('change', function() {
        const isAnnual = this.checked;
        
        monthlyPrices.forEach(price => {
            price.style.display = isAnnual ? 'none' : 'inline';
        });
        
        annualPrices.forEach(price => {
            price.style.display = isAnnual ? 'inline' : 'none';
        });
        
        annualSavings.forEach(saving => {
            saving.style.display = isAnnual ? 'block' : 'none';
        });
        
        // Update payment page if applicable
        updatePaymentPricing(isAnnual);
    });
}

/**
 * FAQ ACCORDION
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        }
    });
}

/**
 * PAYMENT FORM FUNCTIONALITY
 */
function initPaymentForm() {
    // Handle billing cycle changes
    const billingOptions = document.querySelectorAll('input[name="billing"]');
    billingOptions.forEach(option => {
        option.addEventListener('change', updatePaymentSummary);
    });
    
    // Handle add-on changes
    const addonOptions = document.querySelectorAll('input[name="addons"]');
    addonOptions.forEach(option => {
        option.addEventListener('change', updatePaymentSummary);
    });
    
    // Handle payment method changes
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentInfo = document.getElementById('payment-info');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (paymentInfo) {
                // Update payment info based on selected method
                updatePaymentInfo(this.value);
            }
        });
    });
    
    // Handle billing address toggle
    const sameAsAccount = document.getElementById('sameAsAccount');
    const billingAddress = document.getElementById('billing-address');
    
    if (sameAsAccount && billingAddress) {
        sameAsAccount.addEventListener('change', function() {
            billingAddress.style.display = this.checked ? 'none' : 'block';
        });
    }
    
    // Handle form submission
    const submitButton = document.getElementById('submit-payment');
    if (submitButton) {
        submitButton.addEventListener('click', handlePaymentSubmission);
    }
    
    // Initialize payment summary
    updatePaymentSummary();
}

/**
 * UPDATE PAYMENT INFO BASED ON SELECTED METHOD
 */
function updatePaymentInfo(method) {
    const paymentInfo = document.getElementById('payment-info');
    if (!paymentInfo) return;
    
    const infoText = paymentInfo.querySelector('.payment-info-text p');
    const methodBadges = paymentInfo.querySelector('.supported-methods');
    
    if (!infoText || !methodBadges) return;
    
    switch(method) {
        case 'upi':
            infoText.textContent = 'Your payment will be processed securely through Razorpay UPI. You can pay using any UPI app like Google Pay, PhonePe, Paytm, or BHIM.';
            methodBadges.innerHTML = '<span class="method-badge">UPI Apps</span><span class="method-badge">Google Pay</span><span class="method-badge">PhonePe</span><span class="method-badge">Paytm</span>';
            break;
        case 'netbanking':
            infoText.textContent = 'Your payment will be processed securely through Razorpay Net Banking. Choose from 50+ banks for instant payment.';
            methodBadges.innerHTML = '<span class="method-badge">SBI</span><span class="method-badge">HDFC</span><span class="method-badge">ICICI</span><span class="method-badge">Axis</span>';
            break;
        case 'wallet':
            infoText.textContent = 'Your payment will be processed securely through Razorpay Digital Wallets. Use your favorite wallet for quick payments.';
            methodBadges.innerHTML = '<span class="method-badge">Paytm</span><span class="method-badge">Mobikwik</span><span class="method-badge">Freecharge</span><span class="method-badge">JioMoney</span>';
            break;
        default:
            infoText.textContent = 'Your payment will be processed securely through Razorpay. You\'ll be redirected to a secure payment page where you can choose from multiple payment options including cards, UPI, net banking, and digital wallets.';
            methodBadges.innerHTML = '<span class="method-badge">Cards</span><span class="method-badge">UPI</span><span class="method-badge">Net Banking</span><span class="method-badge">Wallets</span>';
    }
}

/**
 * UPDATE PAYMENT SUMMARY
 */
function updatePaymentSummary() {
    const selectedBilling = document.querySelector('input[name="billing"]:checked');
    const selectedAddons = document.querySelectorAll('input[name="addons"]:checked');
    
    if (!selectedBilling) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const overrideAmountParam = urlParams.get('amount');
    const overrideAmount = overrideAmountParam ? parseFloat(overrideAmountParam) : null;
    let basePrice = overrideAmount != null ? overrideAmount : (selectedBilling.value === 'monthly' ? 149 : 119);
    let addonsTotal = 0;
    
    // Calculate add-ons
    selectedAddons.forEach(addon => {
        switch(addon.value) {
            case 'nutrition':
                addonsTotal += 79;
                break;
            case 'analysis':
                addonsTotal += 49;
                break;
            case 'recovery':
                addonsTotal += 39;
                break;
        }
    });
    
    const subtotal = basePrice + addonsTotal;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    // Update display
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    const symbol = (typeof CONFIG !== 'undefined' && CONFIG.RAZORPAY && CONFIG.RAZORPAY.currency === 'INR') ? '₹' : '$';
    if (subtotalEl) subtotalEl.textContent = `${symbol}${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `${symbol}${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${symbol}${total.toFixed(2)}`;
}

/**
 * UPDATE PRICING FOR ANNUAL TOGGLE
 */
function updatePaymentPricing(isAnnual) {
    const monthlyPrice = document.querySelector('.monthly-price');
    const annualPrice = document.querySelector('.annual-price');
    
    if (monthlyPrice && annualPrice) {
        monthlyPrice.style.display = isAnnual ? 'none' : 'inline';
        annualPrice.style.display = isAnnual ? 'inline' : 'none';
    }
    
    // Update billing options
    const monthlyOption = document.querySelector('input[name="billing"][value="monthly"]');
    const annualOption = document.querySelector('input[name="billing"][value="annual"]');
    
    if (isAnnual && annualOption) {
        annualOption.checked = true;
    } else if (!isAnnual && monthlyOption) {
        monthlyOption.checked = true;
    }
    
    updatePaymentSummary();
}

/**
 * FORM VALIDATION
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form, .form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error state while typing
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    });
}

/**
 * VALIDATE INDIVIDUAL FIELD
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    field.classList.remove('error', 'success');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Card number validation
    else if (field.id === 'cardNumber' && value) {
        const cardRegex = /^[\d\s]{13,19}$/;
        if (!cardRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid card number';
        }
    }
    
    // Expiry date validation
    else if (field.id === 'expiryDate' && value) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
        }
    }
    
    // CVV validation
    else if (field.id === 'cvv' && value) {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV';
        }
    }
    
    // Apply validation result
    if (isValid) {
        field.classList.add('success');
    } else {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * SHOW FIELD ERROR
 */
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

/**
 * PROMO CODE FUNCTIONALITY
 */
function initPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const applyBtn = document.getElementById('apply-promo');
    const discountItem = document.getElementById('discount-item');
    
    if (!promoInput || !applyBtn) return;
    
    applyBtn.addEventListener('click', function() {
        const promoCode = promoInput.value.trim().toUpperCase();
        
        // Simulate promo code validation
        const validCodes = {
            'SAVE20': 0.20,
            'FIRST10': 0.10,
            'STUDENT15': 0.15,
            'WELCOME25': 0.25
        };
        
        if (validCodes[promoCode]) {
            const discount = validCodes[promoCode];
            const subtotalEl = document.getElementById('subtotal');
            const discountEl = document.getElementById('discount');
            
            if (subtotalEl && discountEl) {
                const subtotal = parseFloat(subtotalEl.textContent.replace('₹', '').replace('$', ''));
                const discountAmount = subtotal * discount;
                
                const symbol = (typeof CONFIG !== 'undefined' && CONFIG.RAZORPAY && CONFIG.RAZORPAY.currency === 'INR') ? '₹' : '$';
                discountEl.textContent = `-${symbol}${discountAmount.toFixed(2)}`;
                discountItem.style.display = 'flex';
                
                // Recalculate total
                updatePaymentSummary();
                
                showNotification('Promo code applied successfully!', 'success');
            }
        } else {
            showNotification('Invalid promo code. Please try again.', 'error');
        }
    });
}

/**
 * HANDLE PAYMENT SUBMISSION
 */
function handlePaymentSubmission(e) {
    e.preventDefault();
    
    // Validate all required fields
    const form = e.target.closest('form') || document.querySelector('.payment-form');
    const requiredFields = form.querySelectorAll('[required]');
    const termsCheckbox = document.getElementById('terms');
    
    let allValid = true;
    
    // Validate each required field
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    // Check terms agreement
    if (termsCheckbox && !termsCheckbox.checked) {
        allValid = false;
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
    }
    
    if (allValid) {
        // Process payment with Razorpay
        processRazorpayPayment();
    } else {
        // Shake form to indicate errors
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        
        showNotification('Please correct the errors in the form', 'error');
    }
}

/**
 * PROCESS RAZORPAY PAYMENT
 */
function processRazorpayPayment() {
    // Check if Razorpay is available
    if (typeof Razorpay === 'undefined') {
        showNotification('Payment gateway not loaded. Please refresh the page.', 'error');
        return;
    }
    
    // Check if config is available
    if (typeof CONFIG === 'undefined' || !CONFIG.RAZORPAY || CONFIG.RAZORPAY.keyId === 'YOUR_RAZORPAY_KEY_ID') {
        showNotification('Payment gateway not configured. Please contact support.', 'error');
        return;
    }

    // Require server order creation in live mode
    if (CONFIG.RAZORPAY.keyId && CONFIG.RAZORPAY.keyId.startsWith('rzp_live_') && !CONFIG.RAZORPAY.orderEndpoint) {
        showNotification('Live payments require a server order endpoint. Please set CONFIG.RAZORPAY.orderEndpoint.', 'error');
        console.error('Missing orderEndpoint while using live key. Set CONFIG.RAZORPAY.orderEndpoint to your server API that creates Razorpay orders.');
        return;
    }
    
    // Get form data
    const formData = getPaymentFormData();
    if (!formData) return;
    
    // Calculate total amount (convert to paise for Razorpay)
    const totalAmount = calculateTotalAmount();
    const amountInPaise = Math.round(totalAmount * 100);
    if (!amountInPaise || amountInPaise < 100) {
        showNotification('Amount must be at least ₹1.00', 'error');
        return;
    }
    
    const openCheckout = (orderId) => {
        const options = {
            key: CONFIG.RAZORPAY.keyId,
            amount: amountInPaise,
            currency: CONFIG.RAZORPAY.currency,
            name: CONFIG.RAZORPAY.companyName,
            description: CONFIG.RAZORPAY.description,
            image: 'Logo_smoothed-removebg-preview.png',
            order_id: orderId || generateOrderId(),
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: CONFIG.RAZORPAY.theme,
            handler: function (response) {
                handlePaymentSuccess(response, formData);
                if (CONFIG.RAZORPAY.verifyEndpoint) {
                    try {
                        fetch(CONFIG.RAZORPAY.verifyEndpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response)
                        });
                    } catch (_) {}
                }
            },
            modal: {
                ondismiss: function() {
                    showNotification('Payment cancelled by user', 'info');
                }
            },
            notes: {
                plan: getSelectedPlan(),
                billing: getSelectedBilling(),
                addons: getSelectedAddons()
            }
        };

        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (selectedPaymentMethod) {
            switch(selectedPaymentMethod.value) {
                case 'upi': options.method = { upi: true }; break;
                case 'netbanking': options.method = { netbanking: true }; break;
                case 'wallet': options.method = { wallet: true }; break;
                default: options.method = { card: true, upi: true, netbanking: true, wallet: true };
            }
        }

        const rzp = new Razorpay(options);
        // Detailed failure diagnostics
        try {
            rzp.on('payment.failed', function (resp) {
                const err = resp && resp.error ? resp.error : {};
                const msg = err.description || err.reason || 'Payment failed';
                showNotification(`Payment failed: ${msg}`, 'error');
                console.error('Razorpay payment failed:', resp);
            });
        } catch (_) {}
        rzp.open();
    };

    if (CONFIG.RAZORPAY.orderEndpoint) {
        fetch(CONFIG.RAZORPAY.orderEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInPaise, currency: CONFIG.RAZORPAY.currency, notes: { plan: getSelectedPlan() } })
        })
        .then(r => r.json())
        .then(data => openCheckout(data && (data.id || data.order_id)))
        .catch(() => openCheckout());
    } else {
        openCheckout();
    }
}

/**
 * GET PAYMENT FORM DATA
 */
function getPaymentFormData() {
    const firstName = document.getElementById('firstName')?.value?.trim();
    const lastName = document.getElementById('lastName')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const phone = document.getElementById('phone')?.value?.trim();
    
    if (!firstName || !lastName || !email || !phone) {
        showNotification('Please fill in all required fields', 'error');
        return null;
    }
    
    return {
        firstName,
        lastName,
        email,
        phone
    };
}

/**
 * CALCULATE TOTAL AMOUNT
 */
function calculateTotalAmount() {
    const totalElement = document.getElementById('total');
    if (totalElement) {
        const totalText = totalElement.textContent.replace('₹', '').replace('$', '');
        return parseFloat(totalText) || 0;
    }
    return 0;
}

/**
 * GENERATE ORDER ID (for demo purposes)
 */
function generateOrderId() {
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * GET SELECTED PLAN
 */
function getSelectedPlan() {
    const planName = document.querySelector('.plan-name');
    return planName ? planName.textContent : 'Pro Plan';
}

/**
 * GET SELECTED BILLING
 */
function getSelectedBilling() {
    const selectedBilling = document.querySelector('input[name="billing"]:checked');
    return selectedBilling ? selectedBilling.value : 'monthly';
}

/**
 * GET SELECTED ADDONS
 */
function getSelectedAddons() {
    const selectedAddons = document.querySelectorAll('input[name="addons"]:checked');
    return Array.from(selectedAddons).map(addon => addon.value);
}

/**
 * HANDLE PAYMENT SUCCESS
 */
function handlePaymentSuccess(response, formData) {
    console.log('Payment successful:', response);
    
    // Show success message
    showNotification('Payment successful! Welcome to Muscle Mentors!', 'success');
    
    // In a real application, you would:
    // 1. Send payment details to your server for verification
    // 2. Create user account
    // 3. Send confirmation email
    // 4. Redirect to success page
    
    // For demo purposes, we'll simulate this
    setTimeout(() => {
        // Redirect to success page or dashboard
        // window.location.href = '/success.html';
        console.log('Payment verified and user account created');
    }, 2000);
}

/**
 * INIT COURSE CHECKOUT
 * Elements with [data-checkout] will redirect to payment with plan/amount
 */
function initCourseCheckout() {
    document.addEventListener('click', function(e) {
        const el = e.target.closest('[data-checkout]');
        if (!el) return;
        e.preventDefault();
        const plan = el.getAttribute('data-plan') || 'pro';
        const amount = el.getAttribute('data-amount');
        const label = el.getAttribute('data-label') || '';
        const addon = el.getAttribute('data-addon') || '';
        const params = new URLSearchParams();
        params.set('plan', plan);
        if (amount) params.set('amount', amount);
        if (label) params.set('label', label);
        if (addon) params.set('addon', addon);
        window.location.href = `payment.html?${params.toString()}`;
    });
}

/**
 * SHOW PROCESSING OVERLAY
 */
function showProcessingOverlay() {
    let overlay = document.querySelector('.payment-processing');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'payment-processing';
        overlay.innerHTML = `
            <div class="processing-content">
                <div class="processing-spinner"></div>
                <p class="processing-text">Processing your payment...</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * HIDE PROCESSING OVERLAY
 */
function hideProcessingOverlay() {
    const overlay = document.querySelector('.payment-processing');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * SHOW NOTIFICATION
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * SCROLL EFFECTS
 */
function initScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'var(--background-dark)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = 'var(--background-light)';
                navbar.style.backdropFilter = 'none';
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .program-card, .testimonial-card, .course-card, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * UTILITY FUNCTIONS
 */

// Format card number with spaces
function formatCardNumber(input) {
    const value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
        return parts.join(' ');
    } else {
        return value;
    }
}

// Format expiry date
function formatExpiryDate(input) {
    const value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        return value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    return value;
}

// Apply input formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            this.value = formatCardNumber(this);
        });
    }
    
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            this.value = formatExpiryDate(this);
        });
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }
});

// Handle URL parameters for plan selection
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const amount = urlParams.get('amount');
    
    // Redirect to courses if on payment page without course selection
    if (window.location.pathname.includes('payment.html') && !plan && !amount) {
        showNotification('Please select a course first', 'info');
        setTimeout(() => {
            window.location.href = 'courses.html';
        }, 2000);
        return;
    }
    
    const addon = urlParams.get('addon');
    
    if (plan) {
        // Update selected plan based on URL parameter
        updateSelectedPlan(plan);
    }
    
    if (addon) {
        // Select addon based on URL parameter
        const addonCheckbox = document.querySelector(`input[name="addons"][value="${addon}"]`);
        if (addonCheckbox) {
            addonCheckbox.checked = true;
            updatePaymentSummary();
        }
    }
});

/**
 * UPDATE SELECTED PLAN
 */
function updateSelectedPlan(planType) {
    const planNames = {
        'starter': 'Starter Plan',
        'pro': 'Pro Plan',
        'elite': 'Elite Plan'
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const amountParam = urlParams.get('amount');
    const labelParam = urlParams.get('label');
    const planPrices = !amountParam ? {
        'starter': { monthly: 99, annual: 79 },
        'pro': { monthly: 149, annual: 119 },
        'elite': { monthly: 249, annual: 199 }
    } : null;
    
    const planName = document.querySelector('.plan-name');
    const monthlyPrice = document.querySelector('.monthly-price');
    const annualPrice = document.querySelector('.annual-price');
    
    if (planName) {
        if (labelParam) {
            planName.textContent = labelParam;
        } else if (planNames[planType]) {
            planName.textContent = planNames[planType];
        }
    }
    
    if (amountParam) {
        if (monthlyPrice) monthlyPrice.textContent = parseFloat(amountParam);
        if (annualPrice) annualPrice.textContent = parseFloat(amountParam);
    } else if (planPrices && planPrices[planType]) {
        if (monthlyPrice) monthlyPrice.textContent = planPrices[planType].monthly;
        if (annualPrice) annualPrice.textContent = planPrices[planType].annual;
    }
    
    // Update payment summary
    setTimeout(updatePaymentSummary, 100);
}
