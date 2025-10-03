// Landing Page JavaScript - Scenario Router

class ScenarioRouter {
  constructor() {
    this.init();
  }

  init() {
    this.setupScenarioButtons();
    this.addCardAnimations();
  }

  // Setup scenario button click handlers
  setupScenarioButtons() {
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    
    scenarioButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const scenario = e.target.getAttribute('data-scenario');
        this.handleScenarioSelection(scenario, e.target);
      });
    });
  }

  // Handle scenario selection and routing
  handleScenarioSelection(scenario, button) {
    console.log('Scenario selected:', scenario);
    // Add loading state to clicked button
    this.showButtonLoading(button);

    // Route to appropriate flow based on scenario
    setTimeout(() => {
      console.log('Routing to scenario:', scenario);
      switch (scenario) {
        case 'standard':
          this.startStandardFlow();
          break;
        case 'eon':
          this.startEonFlow();
          break;
        case 'bg':
          this.startBgFlow();
          break;
        case 'existing':
          this.startExistingCustomerFlow();
          break;
        case 'success':
          this.startSuccessDemo();
          break;
        default:
          console.error('Unknown scenario:', scenario);
      }
    }, 800); // Small delay for UX
  }

  // Show loading state on button
  showButtonLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Store original text for potential restoration
    button.setAttribute('data-original-text', originalText);
  }

  // Scenario 1: Standard Flow
  startStandardFlow() {
    // Start from marketplace overview
    window.location.href = 'marketplace.html?scenario=standard';
  }

  // Scenario 2: E.ON Flow
  startEonFlow() {
    // Store scenario in sessionStorage for persistence across all pages
    sessionStorage.setItem('currentScenario', 'eon');
    console.log('Stored E.ON scenario in sessionStorage');
    
    // Start from marketplace overview with E.ON branding
    window.location.href = 'marketplace.html?scenario=eon';
  }

  // Scenario 3: British Gas Flow
  startBgFlow() {
    console.log('Starting BG flow...');
    // Store scenario in sessionStorage for persistence across all pages
    sessionStorage.setItem('currentScenario', 'bg');
    console.log('Stored BG scenario in sessionStorage');
    
    // Start from marketplace overview with BG branding
    console.log('Navigating to marketplace.html?scenario=bg');
    window.location.href = 'marketplace.html?scenario=bg';
  }

  // Scenario 3: Existing Customer
  startExistingCustomerFlow() {
    // Go directly to subscriptions page (existing customer view)
    window.location.href = 'subscriptions.html?scenario=existing';
  }

  // Scenario 4: Success Demo
  startSuccessDemo() {
    // Go to subscriptions with immediate success modal
    window.location.href = 'subscriptions.html?scenario=success&success=true';
  }

  // Add hover animations to cards
  addCardAnimations() {
    const cards = document.querySelectorAll('.scenario-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
    });
  }

  // Animate card hover effects
  animateCardHover(card, isHovering) {
    const icon = card.querySelector('.scenario-icon');
    const button = card.querySelector('.scenario-btn');
    
    if (isHovering) {
      // Add subtle animations on hover
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      icon.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
      
      button.style.transform = 'translateY(-2px)';
    } else {
      // Reset animations
      icon.style.transform = 'scale(1) rotate(0deg)';
      button.style.transform = 'translateY(0)';
    }
  }

  // Utility method to get URL parameters (for future use)
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Store scenario selection in sessionStorage for cross-page access
  storeScenarioData(scenario, data = {}) {
    const scenarioData = {
      scenario: scenario,
      timestamp: Date.now(),
      ...data
    };
    
    sessionStorage.setItem('currentScenario', JSON.stringify(scenarioData));
  }

  // Retrieve stored scenario data
  getScenarioData() {
    const stored = sessionStorage.getItem('currentScenario');
    return stored ? JSON.parse(stored) : null;
  }
}

// Utility functions for other pages to use
window.ScenarioUtils = {
  // Get current scenario from URL or sessionStorage
  getCurrentScenario() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlScenario = urlParams.get('scenario');
    
    if (urlScenario) {
      return urlScenario;
    }
    
    const stored = sessionStorage.getItem('currentScenario');
    if (stored) {
      const data = JSON.parse(stored);
      return data.scenario;
    }
    
    return 'standard'; // default
  },

  // Check if we're in a specific scenario
  isScenario(scenarioName) {
    return this.getCurrentScenario() === scenarioName;
  },

  // Get scenario-specific data
  getScenarioData(key) {
    const stored = sessionStorage.getItem('currentScenario');
    if (stored) {
      const data = JSON.parse(stored);
      return key ? data[key] : data;
    }
    return null;
  },

  // Update scenario data
  updateScenarioData(updates) {
    const stored = sessionStorage.getItem('currentScenario');
    if (stored) {
      const data = JSON.parse(stored);
      const updated = { ...data, ...updates };
      sessionStorage.setItem('currentScenario', JSON.stringify(updated));
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ScenarioRouter();
});

// Add some visual flair on page load
document.addEventListener('DOMContentLoaded', () => {
  // Animate cards in sequence
  const cards = document.querySelectorAll('.scenario-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + (index * 100));
  });
});
