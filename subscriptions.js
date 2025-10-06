// Subscriptions Page JavaScript

class SubscriptionsPage {
  constructor() {
    this.init();
  }

  handleScenarioBranding() {
    const urlParams = new URLSearchParams(window.location.search);
    const scenario = urlParams.get('scenario');
    
    // Fallback to sessionStorage if URL parameter is not available
    const scenarioFromStorage = sessionStorage.getItem('currentScenario');
    const finalScenario = scenario || scenarioFromStorage;
    
    console.log('Subscriptions - Current scenario:', finalScenario); // Debug log
    console.log('URL scenario:', scenario); // Debug log
    console.log('Storage scenario:', scenarioFromStorage); // Debug log
    console.log('URL:', window.location.href); // Debug log
    console.log('Available elements:', {
      mainLogo: !!document.querySelector('.provider-logo .logo-text'),
      planNames: document.querySelectorAll('.detail-value').length,
      modalLogo: !!document.querySelector('.service-logo .logo-text'),
      modalPlanName: !!document.querySelector('.service-info h4')
    });
    
    if (finalScenario === 'eon') {
      console.log('Applying E.ON branding to subscriptions page'); // Debug log
      
      // Replace the entire provider section with E.ON content
      const providerSection = document.querySelector('.provider-section');
      if (providerSection) {
        providerSection.innerHTML = `
          <div class="provider-logo">
            <span class="logo-text eon">e.on</span>
          </div>
        `;
        console.log('Replaced provider section with E.ON content');
      }
      
      // Replace plan details section
      const planDetails = document.querySelector('.plan-details');
      if (planDetails) {
        planDetails.innerHTML = `
          <div class="detail-row">
            <span class="detail-label">Your plan</span>
            <span class="detail-value">EON Next Gust 12 m</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment method</span>
            <span class="detail-value">Direct debit</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Elapsed period</span>
            <span class="detail-value">0 months</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Contract ends</span>
            <span class="detail-value">Sep 2026</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Monthly cost</span>
            <span class="detail-value">£50.71</span>
          </div>
        `;
        console.log('Replaced plan details with E.ON content');
      }
      
      // Replace success modal service card
      const serviceCard = document.querySelector('.service-card');
      if (serviceCard) {
        serviceCard.innerHTML = `
          <div class="service-logo">
            <span class="logo-text eon">e.on</span>
          </div>
          <div class="service-info">
            <h4>EON Next Gust 12 m</h4>
            <div class="service-price">£50.71 <span class="price-period">/ month</span></div>
            <div class="service-term">1 Year Fixed Rate</div>
          </div>
        `;
        console.log('Replaced success modal service card with E.ON content');
      }
    } else if (finalScenario === 'openrent') {
      console.log('OPEN RENT SCENARIO DETECTED - Applying branding');
      this.applyOpenRentBranding();
    } else {
      console.log('No special scenario detected, using default OVO branding');
    }
  }

  applyOpenRentBranding() {
    console.log('Applying Open Rent branding to subscriptions page');
    
    // Debug: Check if elements exist
    console.log('Elements found:', {
      pageTitle: !!document.querySelector('.page-header h1'),
      pageSubtitle: !!document.querySelector('.page-subtitle'),
      providerSection: !!document.querySelector('.provider-section'),
      planDetails: !!document.querySelector('.plan-details'),
      subscriptionCard: !!document.querySelector('.subscription-card'),
      navLabel: !!document.querySelector('.nav-item .nav-label')
    });
    
    // Change page title to "Active Contracts" for Open Rent scenario
    const pageTitle = document.querySelector('.page-header h1');
    if (pageTitle) {
      pageTitle.textContent = 'Active Contracts';
      console.log('Updated page title to Active Contracts');
    } else {
      console.error('Page title not found');
    }
    
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageSubtitle) {
      pageSubtitle.textContent = 'Find your active contracts here';
      console.log('Updated page subtitle');
    } else {
      console.error('Page subtitle not found');
    }
    
    // Update sidebar menu label to "Contracts"
    const navLabels = document.querySelectorAll('.nav-item .nav-label');
    navLabels.forEach(label => {
      if (label.textContent === 'Subscriptions') {
        label.textContent = 'Contracts';
        console.log('Updated sidebar menu label to Contracts');
      }
    });
    
    // Completely refactor the active services section for side-by-side layout
    this.refactorActiveServicesSection();
    
    // Replace success modal service card
    const serviceCard = document.querySelector('.service-card');
    if (serviceCard) {
      serviceCard.innerHTML = `
        <div class="service-logo">
          <span class="logo-text openrent">OR</span>
        </div>
        <div class="service-info">
          <h4>Open Rent Standard</h4>
          <div class="service-price">£3,350.00 <span class="price-period">/ month</span></div>
          <div class="service-term">12 Month Fixed Term</div>
        </div>
      `;
      console.log('Replaced success modal service card with Open Rent content');
    } else {
      console.error('Service card not found');
    }
  }

  refactorActiveServicesSection() {
    console.log('Refactoring active services section for side-by-side layout');
    
    // Find the active services section
    const activeServicesSection = document.querySelector('.active-services');
    if (!activeServicesSection) {
      console.error('Active services section not found');
      return;
    }
    
    // Clear existing content
    activeServicesSection.innerHTML = '<h2 class="section-title">Active contracts</h2>';
    
    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
    cardsContainer.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 20px;
      flex-wrap: wrap;
      align-items: flex-start;
      width: 100%;
    `;
    
    // Create energy card
    const energyCard = document.createElement('div');
    energyCard.className = 'subscription-card energy-card';
    energyCard.style.cssText = `
      flex: 1;
      min-width: 300px;
      max-width: 400px;
      margin-bottom: 0;
    `;
    energyCard.innerHTML = `
      <!-- Upper Section with Gray Background -->
      <div class="card-upper-section">
        <!-- Card Header -->
        <div class="card-header">
          <div class="lock-icon">
            <span>🔒</span>
          </div>
          <div class="status-badges">
            <span class="status-badge new">New</span>
            <span class="status-badge active">● Active</span>
          </div>
        </div>

        <!-- Provider Logo -->
        <div class="provider-section">
          <div class="provider-logo">
            <span class="logo-text eon">e.on</span>
          </div>
        </div>
      </div>

      <!-- Plan Details -->
      <div class="plan-details">
        <div class="detail-row">
          <span class="detail-label">Your plan</span>
          <span class="detail-value">EON Next Gust 12 m</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment method</span>
          <span class="detail-value">Direct debit</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Elapsed period</span>
          <span class="detail-value">0 months</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contract ends</span>
          <span class="detail-value">Sep 2026</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Monthly cost</span>
          <span class="detail-value">£50.71</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-label">Contract Progress</span>
          <span class="progress-text">0/12 months</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>
    `;
    
    // Create rental contract card
    const rentalCard = document.createElement('div');
    rentalCard.className = 'subscription-card rental-contract-card';
    rentalCard.style.cssText = `
      flex: 1;
      min-width: 300px;
      max-width: 400px;
      margin-bottom: 0;
    `;
    rentalCard.innerHTML = `
      <!-- Upper Section with Gray Background -->
      <div class="card-upper-section">
        <!-- Card Header -->
        <div class="card-header">
          <div class="lock-icon">
            <span>🏠</span>
          </div>
          <div class="status-badges">
            <span class="status-badge new">New</span>
            <span class="status-badge active">● Active</span>
          </div>
        </div>

        <!-- Provider Logo -->
        <div class="provider-section">
          <div class="provider-logo">
            <span class="logo-text rent-contract">Rent Contract</span>
          </div>
        </div>
      </div>

      <!-- Plan Details -->
      <div class="plan-details">
        <div class="detail-row">
          <span class="detail-label">Property</span>
          <span class="detail-value">123 Main Street, London</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Monthly rent</span>
          <span class="detail-value">£3,350.00</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Deposit</span>
          <span class="detail-value">£3,350.00</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contract start</span>
          <span class="detail-value">Thursday, 9 October 2025</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fixed term</span>
          <span class="detail-value">12 Months</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Break clause</span>
          <span class="detail-value">After 4 months</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-label">Contract Progress</span>
          <span class="progress-text">0/12 months</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="card-actions" style="display: flex; gap: 12px; padding: 0 20px 20px 20px;">
        <button class="action-btn secondary" onclick="alert('View full contract')" style="background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 24px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; flex: 1; transition: all 0.2s ease;">
          View Contract
        </button>
        <button class="action-btn secondary" onclick="alert('Manage rental')" style="background: white; color: #374151; border: 1px solid #d1d5db; border-radius: 24px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; flex: 1; transition: all 0.2s ease;">
          Manage Rental
        </button>
      </div>
    `;
    
    // Add cards to container
    cardsContainer.appendChild(energyCard);
    cardsContainer.appendChild(rentalCard);
    
    // Add container to active services section
    activeServicesSection.appendChild(cardsContainer);
    
    console.log('Refactored active services section with side-by-side layout');
  }


  init() {
    this.setupFAB();
    this.setupChat();
    this.setupSuggestions();
    this.animateProgressBar();
    this.setupSuccessModal();
    this.checkForModalTrigger();
    this.handleScenarioVariations();
    
    // Apply branding immediately
    this.handleScenarioBranding();
    
    // Also apply branding with delay as fallback
    setTimeout(() => {
      this.handleScenarioBranding();
    }, 200);
    
    // Additional fallback for Open Rent scenario
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const scenarioFromStorage = sessionStorage.getItem('currentScenario');
      const finalScenario = scenario || scenarioFromStorage;
      
      if (finalScenario === 'openrent') {
        console.log('Open Rent fallback branding applied');
        this.applyOpenRentBranding();
      }
    }, 500);
  }

  // Setup FAB functionality
  setupFAB() {
    const fab = document.getElementById('jayFab');
    const panel = document.getElementById('chatPanel');
    
    if (fab && panel) {
      fab.addEventListener('click', () => {
        const isVisible = panel.style.display === 'block';
        if (isVisible) {
          this.hideChat();
        } else {
          this.showChat();
        }
      });
    }
  }

  // Setup chat functionality
  setupChat() {
    const closeBtn = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendMessage');
    const input = document.getElementById('chatInput');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideChat();
      });
    }

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage();
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  }

  // Setup suggestion pills
  setupSuggestions() {
    const suggestions = document.querySelectorAll('.suggestion-pill');
    suggestions.forEach(pill => {
      pill.addEventListener('click', () => {
        const message = pill.textContent;
        this.addUserMessage(message);
        this.generateJayResponse(message);
      });
    });
  }

  // Show chat panel
  showChat() {
    const panel = document.getElementById('chatPanel');
    const fab = document.getElementById('jayFab');
    
    if (panel) {
      panel.style.display = 'block';
      setTimeout(() => {
        panel.classList.add('show');
      }, 10);
    }
    
    if (fab) {
      fab.classList.add('active');
    }
  }

  // Hide chat panel
  hideChat() {
    const panel = document.getElementById('chatPanel');
    const fab = document.getElementById('jayFab');
    
    if (panel) {
      panel.classList.remove('show');
      setTimeout(() => {
        panel.style.display = 'none';
      }, 300);
    }
    
    if (fab) {
      fab.classList.remove('active');
    }
  }

  // Send message
  sendMessage() {
    const input = document.getElementById('chatInput');
    if (input && input.value.trim()) {
      const message = input.value.trim();
      this.addUserMessage(message);
      this.generateJayResponse(message);
      input.value = '';
    }
  }

  // Add user message to chat
  addUserMessage(message) {
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'user-message';
      messageDiv.innerHTML = `<p>${message}</p>`;
      chatBody.appendChild(messageDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // Generate Jay's response
  generateJayResponse(userMessage) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'jay-message typing';
    typingDiv.innerHTML = '<p>Jay is typing...</p>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Generate response based on user message
    setTimeout(() => {
      chatBody.removeChild(typingDiv);
      
      let response = this.getResponseForMessage(userMessage);
      
      const responseDiv = document.createElement('div');
      responseDiv.className = 'jay-message';
      responseDiv.innerHTML = `<p>${response}</p>`;
      chatBody.appendChild(responseDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1500);
  }

  // Get appropriate response for user message
  getResponseForMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('subscription') || lowerMessage.includes('plan')) {
      return "You're currently on the EON Next Gust 12m plan. It's a 12-month fixed contract with direct debit payments of £50.71/month. Your contract runs until September 2026.";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('next payment')) {
      return "Your next payment of £50.71 is scheduled for the 1st of next month via direct debit. You can view all payment details in your account settings.";
    } else if (lowerMessage.includes('change') || lowerMessage.includes('switch')) {
      return "You can explore other energy plans in our marketplace. Since you're in a fixed contract until Sep 2026, early exit fees may apply. Would you like me to show you available options?";
    } else if (lowerMessage.includes('usage') || lowerMessage.includes('consumption')) {
      return "Based on your current plan, you're set up for low to medium usage. Your smart meter is tracking your consumption, and you're on track with your monthly estimates.";
    } else if (lowerMessage.includes('renewable') || lowerMessage.includes('green')) {
      return "Great question! Your EON Next plan includes renewable energy options. The plan is designed to help reduce your carbon footprint while keeping costs competitive.";
    } else {
      return "I'm here to help with any questions about your energy subscription, payments, or plan changes. What would you like to know more about?";
    }
  }

  // Animate progress bar on page load
  animateProgressBar() {
    setTimeout(() => {
      const progressFill = document.querySelector('.progress-fill');
      if (progressFill) {
        // Since it's a new subscription, keep it at 0%
        progressFill.style.width = '0%';
      }
    }, 500);
  }

  // Setup success modal functionality
  setupSuccessModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideSuccessModal();
      });
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideSuccessModal();
        }
      });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        this.hideSuccessModal();
      }
    });
  }

  // Check if modal should be shown (from checkout completion)
  checkForModalTrigger() {
    const urlParams = new URLSearchParams(window.location.search);
    const showModal = urlParams.get('success');
    
    if (showModal === 'true') {
      // Remove the parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Show modal after a short delay
      setTimeout(() => {
        this.showSuccessModal();
      }, 500);
    }
  }

  // Show success modal with animations
  showSuccessModal() {
    const modal = document.getElementById('successModal');
    const powerUpCard = document.getElementById('powerUpCard');
    
    if (modal) {
      modal.style.display = 'block';
      
      // Apply branding before showing modal
      this.handleScenarioBranding();
      
      // Animate modal in
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);

      // Trigger confetti animation
      setTimeout(() => {
        this.triggerConfetti();
      }, 800);
    }
  }

  // Hide success modal
  hideSuccessModal() {
    const modal = document.getElementById('successModal');
    
    if (modal) {
      modal.classList.remove('show');
      
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }

  // Trigger confetti animation
  triggerConfetti() {
    const confettiPieces = document.querySelectorAll('.confetti-piece');
    
    confettiPieces.forEach((piece, index) => {
      // Reset animation
      piece.style.animation = 'none';
      
      // Trigger animation with delay
      setTimeout(() => {
        const animationName = `confettiFall${index + 1}`;
        const duration = '3s';
        const delay = `${index * 0.2}s`;
        piece.style.animation = `${animationName} ${duration} ease-out ${delay}`;
      }, 10);
    });
  }

  // Handle different scenario variations
  handleScenarioVariations() {
    const urlParams = new URLSearchParams(window.location.search);
    const scenario = urlParams.get('scenario');
    
    switch (scenario) {
      case 'existing':
        this.setupExistingCustomerView();
        break;
      case 'success':
        this.setupSuccessDemo();
        break;
      case 'quick':
        this.setupQuickCheckoutResult();
        break;
      case 'eon':
        // E.ON scenario - branding will be handled by handleScenarioBranding
        console.log('E.ON scenario detected in variations');
        break;
      default:
        // Standard scenario - no changes needed
        break;
    }
  }

  // Setup existing customer view
  setupExistingCustomerView() {
    // Modify the subscription card to show different data for existing customers
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const elapsedPeriod = document.querySelector('.detail-row:nth-child(3) .detail-value');
    
    if (progressFill && progressText) {
      // Show some progress for existing customer
      setTimeout(() => {
        progressFill.style.width = '25%';
        progressText.innerHTML = '<span class="progress-completed">3</span>/12 months completed';
      }, 500);
    }
    
    if (elapsedPeriod) {
      elapsedPeriod.textContent = '3 months';
    }

    // Add a "Back to Landing" button for demo purposes
    this.addBackToLandingButton();
  }

  // Setup success demo (immediate modal)
  setupSuccessDemo() {
    // Show modal immediately for demo
    setTimeout(() => {
      this.showSuccessModal();
    }, 1000);
  }

  // Setup quick checkout result
  setupQuickCheckoutResult() {
    // Could modify the subscription details to reflect quick checkout
    const planName = document.querySelector('.service-info h4');
    if (planName) {
      planName.textContent = 'EON Next Gust 12 m (Quick Setup)';
    }
  }

  // Add back to landing button for demo navigation
  addBackToLandingButton() {
    const container = document.querySelector('.subscriptions-container');
    if (container) {
      const backButton = document.createElement('button');
      backButton.className = 'back-to-landing-btn';
      backButton.textContent = '← Back to Scenarios';
      backButton.style.cssText = `
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 20px;
        transition: all 0.2s ease;
      `;
      
      backButton.addEventListener('click', () => {
        window.location.href = 'index-landing.html';
      });
      
      backButton.addEventListener('mouseenter', () => {
        backButton.style.background = '#4b5563';
        backButton.style.transform = 'translateY(-1px)';
      });
      
      backButton.addEventListener('mouseleave', () => {
        backButton.style.background = '#6b7280';
        backButton.style.transform = 'translateY(0)';
      });
      
      container.insertBefore(backButton, container.firstChild);
    }
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SubscriptionsPage();
});

// Handle page visibility for animations
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Re-animate progress bar when page becomes visible
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = '0%';
    }
  }
});
