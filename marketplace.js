// Marketplace page JavaScript - reusing components from main page

// Tooltip system (reused from main page)
let tooltipCard = null;
let currentTooltipAnchor = null;

function createTooltipCard() {
  if (tooltipCard) return tooltipCard;

  tooltipCard = document.createElement('div');
  tooltipCard.className = 'tooltip-card';
  document.body.appendChild(tooltipCard);
  return tooltipCard;
}

function updateTooltipPosition(anchor) {
  if (!tooltipCard || !anchor) return;

  const rect = anchor.getBoundingClientRect();
  const vw = window.innerWidth;
  const cardWidth = tooltipCard.offsetWidth || 280;

  let left = rect.left + rect.width / 2 - cardWidth / 2;
  left = Math.max(8, Math.min(left, vw - cardWidth - 8));
  const top = rect.bottom + 8;

  tooltipCard.style.top = top + 'px';
  tooltipCard.style.left = left + 'px';
  tooltipCard.classList.add('show');
}

function showTooltip(anchor, type) {
  createTooltipCard();
  
  let content = '';
  if (type === 'low-usage') {
    content = `
      <div class="tooltip-title">Low usage estimate</div>
      <div class="tooltip-content">We estimate a low usage for this property given data available in your region and supplied by our partner Energy Helper</div>
      <div class="tooltip-details">Median usage in your area<br>Electricity: 1244kWh</div>
    `;
  }
  
  tooltipCard.innerHTML = content;
  currentTooltipAnchor = anchor;
  updateTooltipPosition(anchor);
}

function hideTooltip() {
  if (tooltipCard) {
    tooltipCard.classList.remove('show');
    currentTooltipAnchor = null;
  }
}

function setupTooltips() {
  let tooltipTimeout = null;

  document.addEventListener('mouseover', (e) => {
    const tooltipTrigger = e.target.closest('[data-tooltip]');
    if (tooltipTrigger) {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
      const tooltipType = tooltipTrigger.dataset.tooltip;
      showTooltip(tooltipTrigger, tooltipType);
    }
  });

  document.addEventListener('mouseout', (e) => {
    const tooltipTrigger = e.target.closest('[data-tooltip]');
    if (tooltipTrigger && currentTooltipAnchor === tooltipTrigger) {
      const tooltipElement = e.relatedTarget?.closest('.tooltip-card');
      if (!tooltipElement) {
        tooltipTimeout = setTimeout(() => {
          hideTooltip();
        }, 300);
      }
    }
  });

  // Keep tooltip visible when hovering over it
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.tooltip-card')) {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.tooltip-card') && !e.relatedTarget?.closest('.tooltip-card')) {
      tooltipTimeout = setTimeout(() => {
        hideTooltip();
      }, 300);
    }
  });

  // Update position on scroll and resize
  window.addEventListener('scroll', () => {
    if (currentTooltipAnchor && tooltipCard) {
      updateTooltipPosition(currentTooltipAnchor);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (currentTooltipAnchor && tooltipCard) {
      updateTooltipPosition(currentTooltipAnchor);
    }
  });
}

// Jay Chat System (reused from main page)
function setupChat() {
  const fab = document.querySelector('.fab');
  if (!fab) return;

  function ensurePanel() {
    let panel = document.getElementById('chatPanel');
    if (!panel) return null;
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
    if (/save|saving|switch/i.test(q)) {
      return 'Based on your low usage profile, most households in your area save £200-400 annually by switching from default tariffs. I can help you explore the best options.';
    }
    if (/fixed|variable|rate/i.test(q)) {
      return 'Fixed rates stay the same for your contract term, while variable rates can change with market conditions. For low usage like yours, fixed rates often provide better value and predictability.';
    }
    if (/default|tariff/i.test(q)) {
      return 'Default tariffs are what you\'re automatically put on when you don\'t choose a plan. They\'re regulated but rarely the cheapest option. Most people can find better deals.';
    }
    return 'I can help you understand your energy options and find the best deals for your specific usage pattern. What would you like to know more about?';
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

// Navigation
function setupNavigation() {
  const exploreBtn = document.getElementById('exploreOffersBtn');
  const keepPlanBtn = document.getElementById('keepPlanBtn');
  
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      // Navigate to the detailed comparison page, preserving scenario
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? `index.html?scenario=${scenario}` : 'index.html';
      window.location.href = targetUrl;
    });
  }
  
  if (keepPlanBtn) {
    keepPlanBtn.addEventListener('click', () => {
      // Navigate to checkout, preserving scenario
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? `checkout.html?scenario=${scenario}` : 'checkout.html';
      window.location.href = targetUrl;
    });
  }

  // Sidebar navigation
  const homeBtn = document.getElementById('homeBtn');
  const subscriptionsBtn = document.getElementById('subscriptionsBtn');
  
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = 'index-landing.html';
    });
  }
  
  if (subscriptionsBtn) {
    subscriptionsBtn.addEventListener('click', () => {
      // Navigate to subscriptions, preserving scenario
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? `subscriptions.html?scenario=${scenario}` : 'subscriptions.html';
      window.location.href = targetUrl;
    });
  }

  // Tab switching (using shared pill component)
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('pill-active'));
      pill.classList.add('pill-active');
    });
  });
}

// Read more functionality removed - no longer needed

// Handle scenario-specific branding
function handleScenarioBranding() {
  const urlParams = new URLSearchParams(window.location.search);
  const scenario = urlParams.get('scenario');
  
  console.log('Marketplace - Current scenario:', scenario); // Debug log
  
  if (scenario === 'eon') {
    console.log('Applying E.ON branding to marketplace'); // Debug log
    
    // Update current provider to E.ON
    const providerLogo = document.querySelector('.provider-logo .logo-text');
    const providerName = document.querySelector('.provider-name');
    const exploreBtn = document.getElementById('exploreOffersBtn');
    
    if (providerLogo) {
      providerLogo.textContent = 'e.on';
      providerLogo.className = 'logo-text eon';
      console.log('Updated provider logo to E.ON'); // Debug log
    }
    
    if (providerName) {
      providerName.textContent = 'EON Energy - Standard Variable Tariff';
      console.log('Updated provider name to EON Energy - Standard Variable Tariff'); // Debug log
    }
    
    if (exploreBtn) {
      exploreBtn.textContent = 'Explore other offers with E.ON';
      console.log('Updated explore button text'); // Debug log
    }
  }
}

// Initialize everything
function init() {
  setupTooltips();
  setupChat();
  setupNavigation();
  handleScenarioBranding();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
