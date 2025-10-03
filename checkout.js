// Checkout Page JavaScript
class CheckoutForm {
  constructor() {
    this.form = document.getElementById('paymentForm');
    this.continueBtn = document.getElementById('continueBtn');
    this.completeBtn = document.querySelector('.complete-registration-btn');
    this.smartMeterCheckbox = document.getElementById('smartMeter');
    this.totalAmount = document.querySelector('.total-amount');
    
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupSortCodeFormatting();
    this.setupAccountNumberValidation();
    this.setupSmartMeterToggle();
    this.setupChat();
    this.setupTariffInfo();
    this.setupCancel();
    this.setupPaymentDateTooltip();
  }

  // Form validation
  setupFormValidation() {
    const requiredFields = [
      'accountHolder',
      'accountNumber', 
      'sortCode',
      'authoriseDebit',
      'agreeTerms'
    ];

    // Add event listeners to all form inputs
    requiredFields.forEach(fieldName => {
      const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
      if (field) {
        if (field.type === 'checkbox') {
          field.addEventListener('change', () => this.validateForm());
        } else {
          field.addEventListener('input', () => this.validateField(field));
          field.addEventListener('blur', () => this.validateField(field));
        }
      }
    });

    // Initial validation
    this.validateForm();
  }

  validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    let isValid = true;
    let errorMessage = '';

    // Clear previous error state
    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';

    // Validate based on field type
    switch (field.id) {
      case 'accountHolder':
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = 'Account holder name is required';
        } else if (field.value.trim().length < 2) {
          isValid = false;
          errorMessage = 'Please enter a valid name';
        }
        break;

      case 'accountNumber':
        const accountNumber = field.value.replace(/\D/g, '');
        if (!accountNumber) {
          isValid = false;
          errorMessage = 'Account number is required';
        } else if (accountNumber.length !== 8) {
          isValid = false;
          errorMessage = 'Account number must be 8 digits';
        }
        break;

      case 'sortCode':
        const sortCode = field.value.replace(/\D/g, '');
        if (!sortCode) {
          isValid = false;
          errorMessage = 'Sort code is required';
        } else if (sortCode.length !== 6) {
          isValid = false;
          errorMessage = 'Sort code must be 6 digits';
        }
        break;
    }

    // Show error if invalid
    if (!isValid) {
      field.classList.add('error');
      if (errorElement) errorElement.textContent = errorMessage;
    }

    // Validate entire form after individual field validation
    setTimeout(() => this.validateForm(), 0);
    
    return isValid;
  }

  validateForm() {
    const accountHolder = document.getElementById('accountHolder').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.replace(/\D/g, '');
    const sortCode = document.getElementById('sortCode').value.replace(/\D/g, '');
    const authoriseDebit = document.getElementById('authoriseDebit').checked;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    const isValid = accountHolder.length >= 2 && 
                   accountNumber.length === 8 && 
                   sortCode.length === 6 && 
                   authoriseDebit && 
                   agreeTerms;

    // Update continue button - enable when form is valid
    this.continueBtn.disabled = !isValid;
    
    // Keep complete registration button disabled (only enabled in step 2)
    this.completeBtn.disabled = true;
    
    return isValid;
  }

  // Format sort code as user types
  setupSortCodeFormatting() {
    const sortCodeInput = document.getElementById('sortCode');
    
    sortCodeInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 6 digits
      if (value.length > 6) {
        value = value.substring(0, 6);
      }
      
      // Format as XX-XX-XX
      if (value.length >= 2) {
        value = value.substring(0, 2) + '-' + value.substring(2);
      }
      if (value.length >= 6) {
        value = value.substring(0, 5) + '-' + value.substring(5);
      }
      
      e.target.value = value;
    });
  }

  // Validate account number (numbers only)
  setupAccountNumberValidation() {
    const accountNumberInput = document.getElementById('accountNumber');
    
    accountNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 8 digits
      if (value.length > 8) {
        value = value.substring(0, 8);
      }
      
      e.target.value = value;
    });
  }

  // Smart meter toggle
  setupSmartMeterToggle() {
    this.smartMeterCheckbox.addEventListener('change', () => {
      this.updateTotal();
    });
  }

  updateTotal() {
    const basePrice = 50.71;
    const smartMeterPrice = this.smartMeterCheckbox.checked ? 32 : 0;
    const total = basePrice + smartMeterPrice;
    
    this.totalAmount.innerHTML = `£${total.toFixed(2)} <span class="total-period">/ month</span>`;
  }

  // Setup chat functionality (reused from other pages)
  setupChat() {
    const fab = document.querySelector('.fab');
    if (!fab) return;

    function ensurePanel() {
      let panel = document.getElementById('chatPanel');
      return panel;
    }

    function appendBot(text) {
      const body = document.getElementById('chatBody');
      if (!body) return;
      const p = document.createElement('div');
      p.className = 'chat-message bot';
      p.textContent = text;
      body.appendChild(p);
      body.scrollTop = body.scrollHeight;
    }

    function appendUser(text) {
      const body = document.getElementById('chatBody');
      if (!body) return;
      const p = document.createElement('div');
      p.className = 'chat-message user';
      p.textContent = text;
      body.appendChild(p);
      body.scrollTop = body.scrollHeight;
    }

    function sendMessage() {
      const input = document.getElementById('chatInput');
      if (!input) return;
      const v = input.value.trim();
      if (!v) return;
      appendUser(v);
      appendBot(dynamicAnswerFor(v));
      input.value = '';
    }

    function dynamicAnswerFor(q) {
      if (/direct debit|secure|safety/i.test(q)) {
        return 'Direct Debit is very secure and protected by the Direct Debit Guarantee. Banks use advanced security measures, and you can cancel or change payments easily. It\'s actually safer than many other payment methods.';
      }
      if (/cancel|stop|change/i.test(q)) {
        return 'You can cancel your energy plan or Direct Debit at any time by contacting your supplier. There are no exit fees with this plan, and the Direct Debit Guarantee protects you throughout the process.';
      }
      if (/smart meter|installation/i.test(q)) {
        return 'Smart meters help you track your energy usage in real-time and ensure accurate billing. Installation is usually free and takes about 2 hours. You can opt out if you prefer.';
      }
      return 'I can help you with any questions about the checkout process, Direct Debit, or your energy plan. What would you like to know?';
    }

    function openChat(message) {
      const panel = ensurePanel();
      if (!panel) return;
      panel.style.display = 'block';
      if (message) {
        appendUser(message);
        appendBot(dynamicAnswerFor(message));
      }
    }

    function closeChat() {
      const panel = ensurePanel();
      if (!panel) return;
      panel.style.display = 'none';
    }

    // FAB click handler
    fab.addEventListener('click', () => {
      const panel = ensurePanel();
      if (!panel) return;
      
      if (panel.style.display === 'none' || !panel.style.display) {
        openChat();
      } else {
        closeChat();
      }
    });

    // Send button and enter key
    const sendBtn = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    
    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }

    // Chat prompts
    document.querySelectorAll('.chat-prompt').forEach(btn => {
      btn.addEventListener('click', () => {
        const suggestion = btn.getAttribute('data-suggest');
        if (suggestion) {
          openChat(suggestion);
        }
      });
    });
  }

  // Tariff info button
  setupTariffInfo() {
    const tariffBtn = document.getElementById('tariffInfoBtn');
    if (tariffBtn) {
      tariffBtn.addEventListener('click', () => {
        // Could open a modal or navigate to tariff details
        alert('Tariff information would be displayed here');
      });
    }
  }

  // Cancel button
  setupCancel() {
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
          // Preserve scenario parameter when navigating back
          const urlParams = new URLSearchParams(window.location.search);
          const scenario = urlParams.get('scenario');
          const targetUrl = scenario ? `marketplace.html?scenario=${scenario}` : 'marketplace.html';
          window.location.href = targetUrl;
        }
      });
    }
  }

  // Form submission
  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.proceedToStep2();
    }
  }

  // Proceed to Step 2 with animation
  proceedToStep2() {
    const paymentSection = document.querySelector('.payment-section');
    const reviewSection = document.getElementById('reviewSection');
    const step1Collapsed = document.getElementById('step1Collapsed');
    const progressStep1 = document.querySelector('.progress-steps .step.active');
    const progressStep2 = document.querySelector('.progress-steps .step:not(.active)');

    // Update progress steps in header
    if (progressStep1) {
      progressStep1.classList.remove('active');
      progressStep1.querySelector('.step-number').innerHTML = '✓';
      progressStep1.querySelector('.step-number').style.background = '#22c55e';
      progressStep1.querySelector('.step-number').style.color = 'white';
    }
    if (progressStep2) {
      progressStep2.classList.add('active');
    }

    // Animate step 1 collapse
    paymentSection.classList.add('collapsing');
    
    setTimeout(() => {
      // Hide step 1 and show step 2
      paymentSection.style.display = 'none';
      reviewSection.style.display = 'block';
      
      // Populate step 2 with data from step 1
      this.populateStep2Data();
      
      // Bounce to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Show step 2 with animation
      setTimeout(() => {
        reviewSection.classList.add('show');
        
        // Show collapsed step 1 card with click handler
        setTimeout(() => {
          step1Collapsed.style.display = 'block';
          step1Collapsed.classList.add('show');
          this.setupStep1Reopen();
        }, 200);
        
        // Show tooltip initially and auto-close
        setTimeout(() => {
          this.showPaymentDateTooltipInitially();
        }, 600);
      }, 50);
    }, 400);
  }

  // Populate Step 2 with data from Step 1
  populateStep2Data() {
    const accountNumber = document.getElementById('accountNumber').value;
    const sortCode = document.getElementById('sortCode').value;
    
    document.getElementById('reviewAccountNumber').value = accountNumber;
    document.getElementById('reviewSortCode').value = sortCode;
    
    // Hide addon and guarantee sections in step 2
    const addonSection = document.getElementById('addonSection');
    const guaranteeSection = document.getElementById('guaranteeSection');
    
    if (addonSection) addonSection.style.display = 'none';
    if (guaranteeSection) guaranteeSection.style.display = 'none';
    
    // Enable complete registration button since we're in step 2
    this.completeBtn.classList.add('active');
    this.completeBtn.disabled = false;
  }

  // Setup payment date tooltip and Jay integration
  setupPaymentDateTooltip() {
    const paymentDateWrapper = document.querySelector('.payment-date-wrapper');
    const tooltip = document.getElementById('paymentTooltip');
    const followUpBtn = document.getElementById('followUpJay');
    let hoverTimeout;
    
    if (paymentDateWrapper && tooltip) {
      // Ensure tooltip is initially hidden
      tooltip.style.display = 'none';
      tooltip.classList.remove('show');
      
      // Show tooltip on hover
      paymentDateWrapper.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        this.showTooltip(tooltip);
      });

      // Hide tooltip when mouse leaves (with delay)
      paymentDateWrapper.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          this.hideTooltip(tooltip);
        }, 200);
      });

      // Keep tooltip visible when hovering over it
      tooltip.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
      });

      tooltip.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          this.hideTooltip(tooltip);
        }, 200);
      });
    }

    if (followUpBtn) {
      followUpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close tooltip
        this.hideTooltip(tooltip);
        
        // Open Jay chat with specific message
        this.openJayChatWithMessage("This will be live from 25th July, same day as you move in");
      });
    }
  }

  // Helper methods for tooltip
  showTooltip(tooltip) {
    tooltip.style.display = 'block';
    setTimeout(() => {
      tooltip.classList.add('show');
    }, 10);
  }

  hideTooltip(tooltip) {
    tooltip.classList.remove('show');
    setTimeout(() => {
      tooltip.style.display = 'none';
    }, 200);
  }

  // Open Jay chat with specific message
  openJayChatWithMessage(message) {
    const fab = document.querySelector('.fab');
    const panel = document.getElementById('chatPanel');
    
    if (panel) {
      // Show chat panel
      panel.style.display = 'block';
      
      // Add the message
      this.appendUser("I have a question about the payment date");
      this.appendBot(message + ". I can help explain more about your payment schedule and move-in process. What would you like to know?");
    }
  }

  // Helper methods for chat
  appendUser(text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const p = document.createElement('div');
    p.className = 'chat-message user';
    p.textContent = text;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  appendBot(text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const p = document.createElement('div');
    p.className = 'chat-message bot';
    p.textContent = text;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  // Show payment date tooltip initially and auto-close
  showPaymentDateTooltipInitially() {
    const tooltip = document.getElementById('paymentTooltip');
    if (tooltip) {
      this.showTooltip(tooltip);
      
      // Auto-close after 4 seconds
      setTimeout(() => {
        this.hideTooltip(tooltip);
      }, 4000);
    }
  }

  // Setup click handler to reopen step 1
  setupStep1Reopen() {
    const step1Collapsed = document.getElementById('step1Collapsed');
    const editBtn = step1Collapsed?.querySelector('.edit-btn');
    
    if (step1Collapsed) {
      step1Collapsed.style.cursor = 'pointer';
      step1Collapsed.addEventListener('click', () => {
        this.reopenStep1();
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent double-triggering from parent click
        this.reopenStep1();
      });
    }
  }

  // Reopen step 1 for editing
  reopenStep1() {
    const paymentSection = document.querySelector('.payment-section');
    const reviewSection = document.getElementById('reviewSection');
    const progressStep1 = document.querySelector('.progress-steps .step:not(.active)');
    const progressStep2 = document.querySelector('.progress-steps .step.active');

    // Update progress steps in header
    if (progressStep1) {
      progressStep1.classList.add('active');
      progressStep1.querySelector('.step-number').innerHTML = '1';
      progressStep1.querySelector('.step-number').style.background = '#1f2937';
      progressStep1.querySelector('.step-number').style.color = 'white';
    }
    if (progressStep2) {
      progressStep2.classList.remove('active');
    }

    // Show addon and guarantee sections again
    const addonSection = document.getElementById('addonSection');
    const guaranteeSection = document.getElementById('guaranteeSection');
    
    if (addonSection) addonSection.style.display = 'block';
    if (guaranteeSection) guaranteeSection.style.display = 'block';

    // Disable complete registration button (back to step 1)
    this.completeBtn.classList.remove('active');
    this.completeBtn.disabled = true;

    // Hide step 2 and show step 1
    reviewSection.classList.remove('show');
    
    setTimeout(() => {
      reviewSection.style.display = 'none';
      paymentSection.style.display = 'block';
      paymentSection.classList.remove('collapsing');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }

  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      // Just proceed to step 2, no loading state here
      this.proceedToStep2();
    }
  }

  // Complete registration (Step 2)
  completeRegistration() {
    this.showLoadingState();
    
    // Simulate processing time
    setTimeout(() => {
      // Preserve scenario when navigating to subscriptions
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? 
        `subscriptions.html?scenario=${scenario}&success=true` : 
        'subscriptions.html?success=true';
      window.location.href = targetUrl;
    }, 2500);
  }

  // Show loading state
  showLoadingState() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3 class="loading-title">Setting up your subscription...</h3>
        <p class="loading-text">We're getting everything ready for you</p>
      </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Animate in
    setTimeout(() => {
      loadingOverlay.classList.add('show');
    }, 10);
  }
}

// Handle scenario-specific branding
function handleScenarioBranding() {
  const urlParams = new URLSearchParams(window.location.search);
  const scenario = urlParams.get('scenario');
  
  if (scenario === 'eon') {
    // Update plan to E.ON
    const planName = document.querySelector('.plan-name');
    const planLogo = document.querySelector('.plan-logo .logo-text');
    
    if (planName) {
      planName.textContent = 'EON Next Gust 12 m';
    }
    
    if (planLogo) {
      planLogo.textContent = 'e.on';
      planLogo.className = 'logo-text eon';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const checkout = new CheckoutForm();
  
  // Handle scenario branding
  handleScenarioBranding();
  
  // Handle form submission
  const form = document.getElementById('paymentForm');
  if (form) {
    form.addEventListener('submit', (e) => checkout.handleSubmit(e));
  }

  // Handle complete registration button
  const completeBtn = document.querySelector('.complete-registration-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!completeBtn.disabled) {
        checkout.completeRegistration();
      }
    });
  }
});
