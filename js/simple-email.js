/**
 * SIMPLE EMAILJS CONTACT FORM
 * Clean, minimal email sending functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple EmailJS form loading...');
    
    // EmailJS Configuration
    const EMAIL_CONFIG = {
        serviceID: 'service_e88yz2p',
        templateID: 'template_hty85vh',
        publicKey: 'zL--s0K3zFjEPi1kO'
    };
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS not loaded');
        return;
    }
    
    // Get the contact form
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }
    
    console.log('Contact form found, setting up...');
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        
        // Validate required fields
        if (!name || !email) {
            alert('Please fill in your name and email');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send email via EmailJS
            console.log('Sending email...');
            const response = await emailjs.send(
                EMAIL_CONFIG.serviceID,
                EMAIL_CONFIG.templateID,
                {
                    name: name,
                    email: email
                }
            );
            
            console.log('Email sent successfully:', response);
            alert('Message sent successfully!');
            contactForm.reset();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    console.log('Simple EmailJS form setup complete');
});
