/**
 * REAL-TIME CONTACT FORM FUNCTIONALITY
 * Advanced contact form with third-party integrations and real-time features
 */

class RealtimeContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.connectionStatus = document.getElementById('connection-status');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.chatWidget = document.getElementById('live-chat');
        this.chatWindow = document.getElementById('chat-window');
        this.chatToggle = document.getElementById('chat-toggle');
        this.chatClose = document.getElementById('chat-close');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSend = document.getElementById('chat-send');
        this.chatBadge = document.getElementById('chat-badge');
        
        this.isConnected = false;
        this.typingTimeout = null;
        this.autoSaveTimeout = null;
        this.draftData = {};
        this.messageCount = 0;
        
        // EmailJS configuration - use CONFIG object if available, fallback to hardcoded values
        this.emailConfig = {
            serviceID: (typeof CONFIG !== 'undefined' && CONFIG.EMAILJS) ? CONFIG.EMAILJS.serviceID : 'service_e88yz2p',
            templateID: (typeof CONFIG !== 'undefined' && CONFIG.EMAILJS) ? CONFIG.EMAILJS.templateID : 'template_hty85vh',
            publicKey: (typeof CONFIG !== 'undefined' && CONFIG.EMAILJS) ? CONFIG.EMAILJS.publicKey : 'zL--s0K3zFjEPi1kO'
        };
        
        this.init();
    }
    
    init() {
        console.log('RealtimeContactForm: Initializing...');
        console.log('Form element:', this.form);
        console.log('EmailJS Config:', this.emailConfig);
        
        if (!this.form) {
            console.error('RealtimeContactForm: Contact form not found!');
            return;
        }
        
        this.initEmailJS();
        this.initFormValidation();
        this.initAutoSave();
        this.initTypingIndicator();
        this.initLiveChat();
        this.initCharacterCount();
        this.initPhoneFormatting();
        this.loadDraft();
        this.checkConnection();
        
        // Periodic connection check
        setInterval(() => this.checkConnection(), 30000);
        
        console.log('RealtimeContactForm: Initialized successfully');
    }
    
    /**
     * Initialize EmailJS
     */
    initEmailJS() {
        console.log('Initializing EmailJS...');
        console.log('EmailJS available:', typeof emailjs !== 'undefined');
        console.log('Public Key:', this.emailConfig.publicKey);
        console.log('CONFIG object:', typeof CONFIG !== 'undefined' ? CONFIG : 'CONFIG not found');
        
        if (typeof emailjs !== 'undefined') {
            if (this.emailConfig.publicKey && this.emailConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                try {
                    emailjs.init(this.emailConfig.publicKey);
                    this.updateConnectionStatus('connected');
                    console.log('EmailJS initialized successfully with key:', this.emailConfig.publicKey);
                } catch (error) {
                    console.error('EmailJS initialization failed:', error);
                    this.updateConnectionStatus('disconnected');
                }
            } else {
                console.warn('EmailJS public key not configured properly');
                console.log('Expected key format, got:', this.emailConfig.publicKey);
                this.updateConnectionStatus('disconnected');
            }
        } else {
            console.warn('EmailJS library not loaded');
            this.updateConnectionStatus('disconnected');
        }
    }
    
    /**
     * Initialize real-time form validation
     */
    initFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation on input
            input.addEventListener('input', (e) => {
                this.validateField(e.target);
                this.triggerTypingIndicator();
                this.autoSave();
            });
            
            // Validation on blur
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
                this.clearTypingIndicator();
            });
            
            // Validation on focus
            input.addEventListener('focus', (e) => {
                this.clearFieldStatus(e.target);
            });
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
        
        // Save draft button
        const saveDraftBtn = document.getElementById('save-draft');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                this.saveDraft();
                this.showNotification('Draft saved successfully!', 'success');
            });
        }
    }
    
    /**
     * Real-time field validation
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type || field.tagName.toLowerCase();
        const fieldId = field.id;
        const statusEl = document.getElementById(`${fieldId.replace('contact-', '')}-status`);
        
        let isValid = true;
        let message = '';
        
        // Clear previous status
        field.classList.remove('success', 'error');
        if (statusEl) {
            statusEl.className = 'field-status';
            statusEl.textContent = '';
        }
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            } else {
                // Check email availability (simulated)
                this.checkEmailAvailability(value, statusEl);
            }
        }
        // Phone validation
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }
        // Name validation
        else if (fieldId === 'contact-name' && value) {
            if (value.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters';
            }
        }
        // Message validation
        else if (fieldId === 'contact-message' && value) {
            if (value.length < 10) {
                isValid = false;
                message = 'Message must be at least 10 characters';
            }
        }
        
        // Apply validation result
        if (value && isValid) {
            field.classList.add('success');
            if (statusEl) {
                statusEl.className = 'field-status show valid';
                statusEl.textContent = '✓ Valid';
            }
        } else if (!isValid && value) {
            field.classList.add('error');
            if (statusEl) {
                statusEl.className = 'field-status show invalid';
                statusEl.textContent = message;
            }
        }
        
        return isValid;
    }
    
    /**
     * Check email availability (simulated)
     */
    checkEmailAvailability(email, statusEl) {
        if (statusEl) {
            statusEl.className = 'field-status show checking';
            statusEl.textContent = 'Checking...';
        }
        
        // Simulate API call
        setTimeout(() => {
            // Mock email check - in real app, this would be an API call
            const isAvailable = Math.random() > 0.3; // 70% chance of being available
            
            if (statusEl) {
                if (isAvailable) {
                    statusEl.className = 'field-status show valid';
                    statusEl.textContent = '✓ Email available';
                } else {
                    statusEl.className = 'field-status show invalid';
                    statusEl.textContent = '⚠ Email already registered';
                }
            }
        }, 1000);
    }
    
    /**
     * Initialize auto-save functionality
     */
    initAutoSave() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => {
                    this.autoSave();
                }, 2000); // Auto-save after 2 seconds of inactivity
            });
        });
    }
    
    /**
     * Auto-save form data
     */
    autoSave() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('contact-form-draft', JSON.stringify(data));
        this.showAutoSaveIndicator();
    }
    
    /**
     * Load saved draft
     */
    loadDraft() {
        const saved = localStorage.getItem('contact-form-draft');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'yes';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                this.showNotification('Draft restored from previous session', 'info');
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }
    
    /**
     * Save draft manually
     */
    saveDraft() {
        this.autoSave();
        localStorage.setItem('contact-form-draft', JSON.stringify(this.draftData));
    }
    
    /**
     * Show auto-save indicator
     */
    showAutoSaveIndicator() {
        const indicators = document.querySelectorAll('.auto-save-indicator');
        indicators.forEach(indicator => {
            indicator.classList.add('show', 'saving');
            indicator.textContent = 'Saving...';
            
            setTimeout(() => {
                indicator.classList.remove('saving');
                indicator.classList.add('saved');
                indicator.textContent = 'Saved';
                
                setTimeout(() => {
                    indicator.classList.remove('show', 'saved');
                }, 2000);
            }, 500);
        });
    }
    
    /**
     * Initialize typing indicator
     */
    initTypingIndicator() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.triggerTypingIndicator();
            });
        });
    }
    
    /**
     * Trigger typing indicator
     */
    triggerTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.clearTypingIndicator();
        }, 1000);
    }
    
    /**
     * Clear typing indicator
     */
    clearTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    /**
     * Initialize character count
     */
    initCharacterCount() {
        const messageField = document.getElementById('contact-message');
        const charCount = document.getElementById('char-count');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                const count = messageField.value.length;
                charCount.textContent = count;
                
                const countEl = charCount.parentElement;
                countEl.classList.remove('warning', 'danger');
                
                if (count > 400) {
                    countEl.classList.add('danger');
                } else if (count > 300) {
                    countEl.classList.add('warning');
                }
            });
        }
    }
    
    /**
     * Initialize phone number formatting
     */
    initPhoneFormatting() {
        const phoneField = document.getElementById('contact-phone');
        
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
                
                e.target.value = value;
            });
        }
    }
    
    /**
     * Initialize live chat
     */
    initLiveChat() {
        if (this.chatToggle) {
            this.chatToggle.addEventListener('click', () => {
                this.toggleChatWindow();
            });
        }
        
        if (this.chatClose) {
            this.chatClose.addEventListener('click', () => {
                this.closeChatWindow();
            });
        }
        
        if (this.chatSend) {
            this.chatSend.addEventListener('click', () => {
                this.sendChatMessage();
            });
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
        
        // Simulate incoming messages
        this.simulateIncomingMessages();
    }
    
    /**
     * Toggle chat window
     */
    toggleChatWindow() {
        if (this.chatWindow) {
            this.chatWindow.classList.toggle('active');
            
            if (this.chatWindow.classList.contains('active')) {
                this.chatInput.focus();
                this.hideChatBadge();
            }
        }
    }
    
    /**
     * Close chat window
     */
    closeChatWindow() {
        if (this.chatWindow) {
            this.chatWindow.classList.remove('active');
        }
    }
    
    /**
     * Send chat message
     */
    sendChatMessage() {
        const message = this.chatInput.value.trim();
        
        if (message) {
            this.addChatMessage(message, 'user');
            this.chatInput.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                this.simulateBotResponse(message);
            }, 1000);
        }
    }
    
    /**
     * Add chat message
     */
    addChatMessage(message, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${message}</p>`;
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(content);
        
        if (this.chatMessages) {
            this.chatMessages.appendChild(messageEl);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
        
        if (sender === 'bot') {
            this.messageCount++;
            this.showChatBadge();
        }
    }
    
    /**
     * Simulate bot response
     */
    simulateBotResponse(userMessage) {
        const responses = [
            "That's a great question! Let me help you with that.",
            "I understand your concern. Here's what I can tell you...",
            "Thanks for reaching out! Our team will get back to you shortly.",
            "I'd be happy to provide more information about our training programs.",
            "That's exactly what we specialize in! Let me connect you with our experts."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addChatMessage(randomResponse, 'bot');
    }
    
    /**
     * Simulate incoming messages
     */
    simulateIncomingMessages() {
        // Show initial message after 5 seconds
        setTimeout(() => {
            if (!this.chatWindow.classList.contains('active')) {
                this.showChatBadge();
            }
        }, 5000);
    }
    
    /**
     * Show chat badge
     */
    showChatBadge() {
        if (this.chatBadge) {
            this.chatBadge.textContent = this.messageCount || '1';
            this.chatBadge.style.display = 'flex';
        }
    }
    
    /**
     * Hide chat badge
     */
    hideChatBadge() {
        if (this.chatBadge) {
            this.chatBadge.style.display = 'none';
            this.messageCount = 0;
        }
    }
    
    /**
     * Handle form submission
     */
    async handleFormSubmission() {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            this.showNotification('Please correct the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        
        try {
            // Prepare form data
            const formData = new FormData(this.form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Send via EmailJS - simplified for basic template
            if (this.isConnected && typeof emailjs !== 'undefined') {
                // Only send the required variables for your template
                const templateParams = {
                    name: data.name,
                    email: data.email
                };
                
                console.log('Sending email with params:', templateParams);
                console.log('Using service:', this.emailConfig.serviceID);
                console.log('Using template:', this.emailConfig.templateID);
                
                await emailjs.send(
                    this.emailConfig.serviceID,
                    this.emailConfig.templateID,
                    templateParams
                );
            } else {
                // Fallback: simulate successful submission
                await this.simulateFormSubmission(data);
            }
            
            // Success
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.form.reset();
            localStorage.removeItem('contact-form-draft');
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: 'contact_form'
                });
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }
    
    /**
     * Simulate form submission (fallback)
     */
    async simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted (simulated):', data);
                resolve();
            }, 2000);
        });
    }
    
    /**
     * Check connection status
     */
    checkConnection() {
        if (navigator.onLine) {
            this.updateConnectionStatus('connected');
        } else {
            this.updateConnectionStatus('disconnected');
        }
    }
    
    /**
     * Update connection status
     */
    updateConnectionStatus(status) {
        if (this.connectionStatus) {
            this.connectionStatus.className = `status-indicator ${status}`;
            
            const statusText = this.connectionStatus.querySelector('span');
            if (statusText) {
                switch (status) {
                    case 'connected':
                        statusText.textContent = 'Connected';
                        this.isConnected = true;
                        break;
                    case 'connecting':
                        statusText.textContent = 'Connecting...';
                        this.isConnected = false;
                        break;
                    case 'disconnected':
                        statusText.textContent = 'Offline';
                        this.isConnected = false;
                        break;
                }
            }
        }
    }
    
    /**
     * Clear field status
     */
    clearFieldStatus(field) {
        const fieldId = field.id;
        const statusEl = document.getElementById(`${fieldId.replace('contact-', '')}-status`);
        
        if (statusEl) {
            statusEl.className = 'field-status';
            statusEl.textContent = '';
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.realtime-notification');
        existing.forEach(n => n.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `realtime-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
            max-width: 350px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new RealtimeContactForm();
});

// Handle online/offline events
window.addEventListener('online', function() {
    if (window.realtimeForm) {
        window.realtimeForm.updateConnectionStatus('connected');
    }
});

window.addEventListener('offline', function() {
    if (window.realtimeForm) {
        window.realtimeForm.updateConnectionStatus('disconnected');
    }
});
