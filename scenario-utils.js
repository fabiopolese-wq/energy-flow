// Scenario Utilities - Simple approach using sessionStorage
window.ScenarioUtils = {
  // Get current scenario from URL parameter or sessionStorage
  getCurrentScenario() {
    // First try URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlScenario = urlParams.get('scenario');
    
    if (urlScenario) {
      // Store in sessionStorage for future use
      sessionStorage.setItem('currentScenario', urlScenario);
      console.log('Got scenario from URL:', urlScenario);
      return urlScenario;
    }
    
    // Fallback to sessionStorage
    const storedScenario = sessionStorage.getItem('currentScenario');
    console.log('Got scenario from sessionStorage:', storedScenario);
    return storedScenario;
  },
  
  // Check if current scenario is E.ON
  isEonScenario() {
    const scenario = this.getCurrentScenario();
    return scenario === 'eon';
  },
  
  // Check if current scenario is British Gas
  isBgScenario() {
    const scenario = this.getCurrentScenario();
    return scenario === 'bg';
  },
  
  // Apply E.ON branding to marketplace page
  applyEonBrandingToMarketplace() {
    console.log('Applying E.ON branding to marketplace page');
    
    const providerLogo = document.querySelector('.provider-logo .logo-text');
    const providerName = document.querySelector('.provider-name');
    const exploreBtn = document.getElementById('exploreOffersBtn');
    
    if (providerLogo) {
      providerLogo.textContent = 'e.on';
      providerLogo.className = 'logo-text eon';
      console.log('Updated provider logo to E.ON');
    }
    
    if (providerName) {
      providerName.textContent = 'EON Energy - Standard Variable Tariff';
      console.log('Updated provider name to EON Energy - Standard Variable Tariff');
    }
    
    if (exploreBtn) {
      exploreBtn.textContent = 'Explore other offers with E.ON';
      console.log('Updated explore button text');
    }
  },
  
  // Apply BG branding to marketplace page
  applyBgBrandingToMarketplace() {
    console.log('Applying BG branding to marketplace page');
    
    const providerLogo = document.querySelector('.provider-logo .logo-text');
    const providerName = document.querySelector('.provider-name');
    const exploreBtn = document.getElementById('exploreOffersBtn');
    
    if (providerLogo) {
      providerLogo.textContent = 'BG';
      providerLogo.className = 'logo-text bg';
      console.log('Updated provider logo to BG');
    }
    
    if (providerName) {
      providerName.textContent = 'British Gas - Standard Variable Plan';
      console.log('Updated provider name to British Gas - Standard Variable Plan');
    }
    
    if (exploreBtn) {
      exploreBtn.textContent = 'Explore other offers with BG';
      console.log('Updated explore button text');
    }
  },
  
  // Apply E.ON branding to detailed comparison page
  applyEonBrandingToComparison() {
    console.log('Applying E.ON branding to comparison page');
    
    // Update template for E.ON scenario
    const template = document.getElementById('detailsTemplate');
    if (template) {
      template.innerHTML = `
        <div class="details-panel">
          <div class="details-body">
            <h4>Compare E.ON plans</h4>
            <div class="compare">
              <div class="col">
                <div class="logo">e.on</div>
                <div class="title">EON Next Gust 12 m</div>
                <div class="attribute"><span class="attr-label">Pricing type:</span><span class="attr-value">Fixed (locked for 12 months)</span></div>
                <div class="attribute"><span class="attr-label">Contract length:</span><span class="attr-value">12 months</span></div>
                <div class="attribute"><span class="attr-label">Exit fees:</span><span class="attr-value">£50</span></div>
                <div class="attribute"><span class="attr-label">Protection:</span><span class="attr-value">Protection if prices rise</span></div>
                <div class="attribute"><span class="attr-label">Renewable %:</span><span class="attr-value">85.5%</span></div>
              </div>
              <div class="col">
                <div class="logo">e.on</div>
                <div class="title">EON Simpler Energy</div>
                <div class="attribute"><span class="attr-label">Pricing type:</span><span class="attr-value">Variable (follows market rates)</span></div>
                <div class="attribute"><span class="attr-label">Contract length:</span><span class="attr-value">Rolling contract</span></div>
                <div class="attribute"><span class="attr-label">Exit fees:</span><span class="attr-value">None</span></div>
                <div class="attribute"><span class="attr-label">Protection:</span><span class="attr-value">Flexibility to switch anytime</span></div>
                <div class="attribute"><span class="attr-label">Renewable %:</span><span class="attr-value">85.5%</span></div>
              </div>
            </div>
            <h4>About E.ON Energy</h4>
            <div class="bio">
              <p>E.ON is one of Europe's leading energy companies and in the UK it operates through E.ON Next with a strong focus on renewable electricity. All of its UK residential customers receive 100% renewable‑backed power, sourced through a mix of its own generation assets—such as biomass plants in Lockerbie and Sheffield—alongside power purchase agreements with UK wind and solar.</p>
              <div class="bio-actions">
                <button class="pill">What's my impact with renewables?</button>
                <button class="pill">Why 100% renewable?</button>
              </div>
            </div>
            <div class="footer-actions">
              <button class="primary">Choose plan</button>
              <button class="ghost close-details">Close Plan ▴</button>
            </div>
          </div>
        </div>
      `;
      console.log('Updated details template for E.ON');
    }
  },
  
  // Apply BG branding to detailed comparison page
  applyBgBrandingToComparison() {
    console.log('Applying BG branding to comparison page');
    
    // Update template for BG scenario
    const template = document.getElementById('detailsTemplate');
    if (template) {
      template.innerHTML = `
        <div class="details-panel">
          <div class="details-body">
            <h4>Compare BG plans</h4>
            <div class="compare">
              <div class="col">
                <div class="logo bg">BG</div>
                <div class="title">BG Home Energy</div>
                <div class="attribute"><span class="attr-label">Pricing type:</span><span class="attr-value">Fixed (locked for 12 months)</span></div>
                <div class="attribute"><span class="attr-label">Contract length:</span><span class="attr-value">12 months</span></div>
                <div class="attribute"><span class="attr-label">Exit fees:</span><span class="attr-value">£50</span></div>
                <div class="attribute"><span class="attr-label">Protection:</span><span class="attr-value">Protection if prices rise</span></div>
                <div class="attribute"><span class="attr-label">Renewable %:</span><span class="attr-value">100%</span></div>
              </div>
              <div class="col">
                <div class="logo bg">BG</div>
                <div class="title">BG Simpler Energy</div>
                <div class="attribute"><span class="attr-label">Pricing type:</span><span class="attr-value">Variable (follows market rates)</span></div>
                <div class="attribute"><span class="attr-label">Contract length:</span><span class="attr-value">Rolling contract</span></div>
                <div class="attribute"><span class="attr-label">Exit fees:</span><span class="attr-value">None</span></div>
                <div class="attribute"><span class="attr-label">Protection:</span><span class="attr-value">Flexibility to switch anytime</span></div>
                <div class="attribute"><span class="attr-label">Renewable %:</span><span class="attr-value">100%</span></div>
              </div>
            </div>
            <h4>About British Gas</h4>
            <div class="bio">
              <p>British Gas is the UK's leading energy supplier, serving millions of customers across the country. They offer a range of energy plans including 100% renewable electricity options and innovative smart home solutions. British Gas is committed to helping customers reduce their carbon footprint while providing reliable energy services.</p>
              <div class="bio-actions">
                <button class="pill">What's my impact with renewables?</button>
                <button class="pill">Why 100% renewable?</button>
              </div>
            </div>
            <div class="footer-actions">
              <button class="primary">Choose plan</button>
              <button class="ghost close-details">Close Plan ▴</button>
            </div>
          </div>
        </div>
      `;
      console.log('Updated details template for BG');
    }
  },
  
  // Apply E.ON branding to checkout page
  applyEonBrandingToCheckout() {
    console.log('Applying E.ON branding to checkout page');
    
    const planName = document.querySelector('.plan-name');
    const planLogo = document.querySelector('.plan-logo .logo-text');
    
    if (planName) {
      planName.textContent = 'EON Next Gust 12 m';
      console.log('Updated plan name to EON Next Gust 12 m');
    }
    
    if (planLogo) {
      planLogo.textContent = 'e.on';
      planLogo.className = 'logo-text eon';
      console.log('Updated plan logo to E.ON');
    }
  },
  
  // Apply BG branding to checkout page
  applyBgBrandingToCheckout() {
    console.log('Applying BG branding to checkout page');
    
    const planName = document.querySelector('.plan-name');
    const planLogo = document.querySelector('.plan-logo .logo-text');
    
    if (planName) {
      planName.textContent = 'BG Home Energy';
      console.log('Updated plan name to BG Home Energy');
    }
    
    if (planLogo) {
      planLogo.textContent = 'BG';
      planLogo.className = 'logo-text bg';
      console.log('Updated plan logo to BG');
    }
  },
  
  // Apply E.ON branding to subscriptions page
  applyEonBrandingToSubscriptions() {
    console.log('Applying E.ON branding to subscriptions page');
    
    // Update main subscription card logo
    const mainLogo = document.querySelector('.provider-logo .logo-text');
    if (mainLogo) {
      mainLogo.textContent = 'e.on';
      mainLogo.className = 'logo-text eon';
      console.log('Updated main logo to E.ON');
    }
    
    // Update plan name
    const planNameElement = document.querySelector('.detail-value');
    if (planNameElement && planNameElement.textContent.includes('OVO')) {
      planNameElement.textContent = 'EON Next Gust 12 m';
      console.log('Updated plan name to EON Next Gust 12 m');
    }
    
    // Update success modal elements
    const modalLogo = document.querySelector('.service-logo .logo-text');
    if (modalLogo) {
      modalLogo.textContent = 'e.on';
      modalLogo.className = 'logo-text eon';
      console.log('Updated modal logo to E.ON');
    }
    
    const modalPlanName = document.querySelector('.service-info h4');
    if (modalPlanName) {
      modalPlanName.textContent = 'EON Next Gust 12 m';
      console.log('Updated modal plan name to EON Next Gust 12 m');
    }
  },
  
  // Apply BG branding to subscriptions page
  applyBgBrandingToSubscriptions() {
    console.log('Applying BG branding to subscriptions page');
    
    // Update main subscription card logo
    const mainLogo = document.querySelector('.provider-logo .logo-text');
    if (mainLogo) {
      mainLogo.textContent = 'BG';
      mainLogo.className = 'logo-text bg';
      console.log('Updated main logo to BG');
    }
    
    // Update plan name
    const planNameElement = document.querySelector('.detail-value');
    if (planNameElement && planNameElement.textContent.includes('OVO')) {
      planNameElement.textContent = 'BG Home Energy';
      console.log('Updated plan name to BG Home Energy');
    }
    
    // Update success modal elements
    const modalLogo = document.querySelector('.service-logo .logo-text');
    if (modalLogo) {
      modalLogo.textContent = 'BG';
      modalLogo.className = 'logo-text bg';
      console.log('Updated modal logo to BG');
    }
    
    const modalPlanName = document.querySelector('.service-info h4');
    if (modalPlanName) {
      modalPlanName.textContent = 'BG Home Energy';
      console.log('Updated modal plan name to BG Home Energy');
    }
  }
};
