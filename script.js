const state = {
  supply: 'Electricity only',
  bedrooms: '1 – 2 bedrooms',
  ev: 'Electric vehicle: No',
  usage: 'Low',
  confirmed: { supply: false, bedrooms: false, ev: false },
};

const usageChip = () => document.getElementById('usageChip');
const confidenceFill = () => document.getElementById('confidenceFill');
const confidenceText = () => document.getElementById('confidencePercent');

function updateUsageFromBedrooms() {
  if (state.bedrooms === '3 – 4 bedrooms' || state.bedrooms === '5+ bedrooms') { state.usage = 'Medium'; } else { state.usage = 'Low'; }
  const u = document.getElementById('usageChip'); if (u) u.textContent = `${state.usage} usage`;
  const su = document.getElementById('stickyUsage'); if (su) su.textContent = `${state.usage}`;
}

function computeConfidencePercent() {
  const items = Object.keys(state.confirmed).length;
  const confirmedCount = Object.values(state.confirmed).filter(Boolean).length;
  const base = 50; const perItem = 50 / items; return Math.min(100, Math.round(base + confirmedCount * perItem));
}

function updateConfidenceBar() {
  const pct = computeConfidencePercent();
  const f = confidenceFill(); if (f) f.style.width = pct + '%';
  const t = confidenceText(); if (t) t.textContent = pct + '%';
  
  // Update bar color based on confirmation status
  const confirmedCount = Object.values(state.confirmed).filter(Boolean).length;
  if (f) {
    if (confirmedCount > 0) {
      f.classList.add('confirmed');
    } else {
      f.classList.remove('confirmed');
    }
  }
}

function computeMatchPercentRank(rank) {
  // Progressive decrease by 5% per rank, min 50
  return Math.max(50, computeConfidencePercent() - (rank * 5));
}

function updateConfidenceCaption() {
  const captionEl = document.getElementById('confidenceCaption'); if (!captionEl) return;
  const allConfirmed = Object.values(state.confirmed).every(Boolean);
  const pct = computeConfidencePercent();
  captionEl.textContent = (allConfirmed && pct === 100)
    ? 'Nice work — you\u2019ve reached 100% confidence'
    : 'Confirm the pills to strengthen matches.';
}

function truncatedMatchText(match, savings) {
  return `${match}% match, saves you £${savings}`; // truncated; popover expands
}

function offerHTML(price, compact, opts = {}) {
  const { showMatch = true, variable = false, rank = 0 } = opts;
  const match = computeMatchPercentRank(rank);
  const savings = Math.max(10, Math.round((100 - match) * 0.8));
  const matchHtml = showMatch ? `<button class="match-chip" data-match="${match}" data-savings="${savings}" data-variable="${variable}">${truncatedMatchText(match, savings)}</button>` : '';
  
  // Check scenario using ScenarioUtils
  const isEonScenario = window.ScenarioUtils ? window.ScenarioUtils.isEonScenario() : false;
  const isBgScenario = window.ScenarioUtils ? window.ScenarioUtils.isBgScenario() : false;
  
  console.log('offerHTML - E.ON scenario:', isEonScenario, 'BG scenario:', isBgScenario, 'Rank:', rank); // Debug log
  
  // Show different providers based on scenario
  let provider, product, contractMeta, exitFee, providerClass;
  
  if (variable) {
    provider = 'octopus';
    product = 'Agile Octopus';
    contractMeta = '12 month contract';
    exitFee = '';
    providerClass = '';
  } else if (isEonScenario) {
    // E.ON scenario - show E.ON plans for rank 0 and 1
    if (rank === 0) {
      provider = 'e.on';
      product = 'EON Next Gust 12 m';
      contractMeta = '12 month contract';
      exitFee = '£50 exit fee';
      providerClass = '';
    } else if (rank === 1) {
      provider = 'e.on';
      product = 'EON Simpler Energy';
      contractMeta = 'Rolling contract';
      exitFee = 'No exit fees';
      providerClass = '';
    } else {
      provider = 'ovo';
      product = 'OVO 1 Year Fixed';
      contractMeta = '12 month contract';
      exitFee = '';
      providerClass = 'ovo';
    }
  } else if (isBgScenario) {
    // BG scenario - show BG plans for rank 0 and 1
    if (rank === 0) {
      provider = 'BG';
      product = 'BG Home Energy';
      contractMeta = '12 month contract';
      exitFee = '£50 exit fee';
      providerClass = 'bg';
    } else if (rank === 1) {
      provider = 'BG';
      product = 'BG Simpler Energy';
      contractMeta = 'Rolling contract';
      exitFee = 'No exit fees';
      providerClass = 'bg';
    } else {
      provider = 'ovo';
      product = 'OVO 1 Year Fixed';
      contractMeta = '12 month contract';
      exitFee = '';
      providerClass = 'ovo';
    }
  } else {
    // Default/OVO scenario - show OVO plans for rank 0 and 1
    if (rank === 0) {
      provider = 'ovo';
      product = 'OVO 1 Year Fixed';
      contractMeta = '12 month contract';
      exitFee = '£50 exit fee';
      providerClass = 'ovo';
    } else if (rank === 1) {
      provider = 'ovo';
      product = 'OVO Simpler Energy';
      contractMeta = 'Rolling contract';
      exitFee = 'No exit fees';
      providerClass = 'ovo';
    } else {
      provider = 'e.on';
      product = 'EON Next Gust 12 m';
      contractMeta = '12 month contract';
      exitFee = '';
      providerClass = '';
    }
  }
  
  return `
    <article class="offer card ${compact ? 'compact' : ''}">
      <div class="offer-left">
        <div class="provider ${providerClass}">${provider}</div>
        <div class="product">${product}</div>
        <div class="meta">${contractMeta} · <span class="tag">${variable ? 'Variable' : 'Fixed'}</span></div>
        ${exitFee ? `<div class="meta exit-fee">${exitFee}</div>` : ''}
        <div class="meta rates-toggle" style="cursor: pointer;">View unit rates and standing charges <span class="chev">›</span></div>
        <div class="rates-section" style="display: none;">
          <div class="rate-row"><span class="rate-label">Unit rate per kWH:</span><span class="rate-value">22.530p</span></div>
          <div class="rate-row"><span class="rate-label">Standing charge per day:</span><span class="rate-value">39.190p</span></div>
        </div>
        <div class="badges">
          <span class="badge">B‑Corp certified</span>
          <span class="badge">85.5% renewable</span>
        </div>
      </div>
      <div class="offer-right">
        ${matchHtml}
        <div class="price">
          <div class="label">Price</div>
          <div class="value">£${price}<span class="unit">/month</span></div>
        </div>
        <div class="note danger">Potential 20% inc. in Dec</div>
        <button class="details">View more details <span class="chev">▾</span></button>
      </div>
    </article>`;
}

function renderOffers() {
  const bestRoot = document.getElementById('bestOffers');
  const allRoot = document.getElementById('allOffers');
  const bestOffersSection = document.querySelector('.best-offers');
  const allOffersSection = document.querySelector('.all-offers');
  
  if (!bestRoot || !allRoot || !bestOffersSection || !allOffersSection) return;
  
  // Check if any pill is confirmed
  const hasConfirmedPill = Object.values(state.confirmed).some(Boolean);
  
  if (!hasConfirmedPill) {
    // Hide both sections when no pills are confirmed
    bestOffersSection.style.display = 'none';
    allOffersSection.style.display = 'none';
    return;
  }
  
  // Show best offers section when at least one pill is confirmed
  bestOffersSection.style.display = 'block';
  
  // Hide all offers section initially (will be shown by "Show all offers" button)
  allOffersSection.style.display = 'none';
  
  const priceBase = 40.94; const multiplier = state.bedrooms === '3 – 4 bedrooms' ? 1.18 : state.bedrooms === '5+ bedrooms' ? 1.35 : 1.0;
  const evAdj = state.ev.includes('Yes') ? 1.07 : 1.0; const dualAdj = state.supply === 'Dual fuel' ? 1.06 : 1.0;
  const price = (priceBase * multiplier * evAdj * dualAdj).toFixed(2);
  
  // Show shimmer placeholder first
  bestRoot.innerHTML = `
    <article class="offer card shimmer-placeholder">
      <div class="offer-left">
        <div class="shimmer-line" style="width: 60px; height: 20px; margin-bottom: 8px;"></div>
        <div class="shimmer-line" style="width: 120px; height: 16px; margin-bottom: 4px;"></div>
        <div class="shimmer-line" style="width: 80px; height: 12px;"></div>
      </div>
      <div class="offer-right">
        <div class="shimmer-line" style="width: 80px; height: 24px; margin-bottom: 4px;"></div>
        <div class="shimmer-line" style="width: 60px; height: 14px;"></div>
      </div>
    </article>
  `;
  
  // After 800ms, show the actual cards with shimmer animation
  setTimeout(() => {
    const price2 = (parseFloat(price) + 3.50).toFixed(2); // Simpler Energy is slightly more expensive
    console.log('renderOffers - E.ON scenario:', window.ScenarioUtils ? window.ScenarioUtils.isEonScenario() : false);
    const bestOffersHtml = offerHTML(price, false, { showMatch: true, variable: false, rank: 0 }) +
                          offerHTML(price2, false, { showMatch: true, variable: false, rank: 1 });
    bestRoot.innerHTML = bestOffersHtml;
    
    // Add shimmer to the newly rendered cards
    const cards = bestRoot.querySelectorAll('.offer.card');
    cards.forEach(card => {
      card.classList.add('shimmer');
      setTimeout(() => card.classList.remove('shimmer'), 1000);
    });
  }, 800);

  const offers = Array.from({length: 7}, (_, i) => {
    const adjustedPrice = (parseFloat(price) + (i * 2.5)).toFixed(2);
    return { price: adjustedPrice, variable: i % 3 === 0, rank: i + 2 }; // Start from rank 2 for E.ON offers
  });

  // Filters start none-selected => show full list
  const filters = document.querySelectorAll('.all-offers .pill');
  let mode = 'All';
  filters.forEach((el) => { if (el.classList.contains('pill-active')) { mode = el.textContent.trim(); } });
  const filtered = offers.filter(o => {
    if (mode === 'Fixed') return !o.variable;
    if (mode === 'Variable') return o.variable;
    return true;
  });

  const allHtml = filtered.map((o) => offerHTML(o.price, true, { showMatch: true, variable: o.variable, rank: o.rank })).join('');
  allRoot.innerHTML = allHtml;

  // Click handlers to change filters
  filters.forEach((el) => {
    el.onclick = () => {
      document.querySelectorAll('.all-offers .pill').forEach(p => p.classList.remove('pill-active'));
      el.classList.add('pill-active');
      
      // Only re-render the all offers section, don't call full renderOffers()
      const offers = Array.from({length: 7}, (_, i) => {
        const adjustedPrice = (parseFloat(price) + (i * 2.5)).toFixed(2);
        return { price: adjustedPrice, variable: i % 3 === 0, rank: i + 2 }; // Start from rank 2 for E.ON offers
      });

      let mode = 'All';
      filters.forEach((filterEl) => { if (filterEl.classList.contains('pill-active')) { mode = filterEl.textContent.trim(); } });
      const filtered = offers.filter(o => {
        if (mode === 'Fixed') return !o.variable;
        if (mode === 'Variable') return o.variable;
        return true;
      });

      const allHtml = filtered.map((o) => offerHTML(o.price, true, { showMatch: true, variable: o.variable, rank: o.rank })).join('');
      allRoot.innerHTML = allHtml;
    };
  });
}

function addShimmer() {
  console.log('Adding shimmer to cards...');
  const cards = document.querySelectorAll('.offer.card');
  console.log('Found cards:', cards.length);
  
  cards.forEach((card, index) => {
    console.log(`Adding shimmer to card ${index}:`, card);
    
    // Force reflow to ensure the class is applied
    card.style.animation = 'none';
    card.offsetHeight; // trigger reflow
    card.style.animation = null;
    
    // Add shimmer class
    card.classList.add('shimmer');
    
    // Remove after animation completes
    setTimeout(() => {
      card.classList.remove('shimmer');
      console.log(`Removed shimmer from card ${index}`);
    }, 1000);
  });
}

function attachSelectorHandlers() {
  document.querySelectorAll('.select').forEach((btn) => {
    const key = btn.dataset.key; const values = JSON.parse(btn.dataset.values || '[]'); const labelEl = btn.querySelector('.label');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-preview').forEach(n => n.remove());
      const willOpen = !btn.classList.contains('open');
      document.querySelectorAll('.select.open').forEach(b => b.classList.remove('open'));
      if (!willOpen) { btn.classList.remove('open'); return; }
      btn.classList.add('open');
      const menu = document.createElement('div'); menu.className = 'dropdown-preview';
      values.forEach((val) => {
        const item = document.createElement('div'); item.className = 'dropdown-option'; item.textContent = val;
        item.addEventListener('click', () => {
          console.log('Pill clicked:', key, val);
          state[key] = val; labelEl.textContent = val; state.confirmed[key] = true; btn.classList.add('confirmed'); btn.setAttribute('aria-pressed','true');
          syncStickyPills(); if (key === 'bedrooms') updateUsageFromBedrooms();
          updateConfidenceBar(); updateConfidenceCaption(); 
          
          // Check if this is the first confirmation
          const wasFirstConfirmation = Object.values(state.confirmed).filter(Boolean).length === 1;
          
          renderOffers(); 
          
          // Add shimmer effect when cards first appear
          setTimeout(() => addShimmer(), 100);
          
          menu.remove(); btn.classList.remove('open');
        });
        menu.appendChild(item);
      });
      btn.insertAdjacentElement('afterend', menu);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.select')) {
      document.querySelectorAll('.dropdown-preview').forEach(n => n.remove());
      document.querySelectorAll('.select.open').forEach(b => b.classList.remove('open'));
    }
  });
}

function syncStickyPills() {
  const row = document.getElementById('stickyPillsRow'); if (!row) return; row.innerHTML = '';
  const entries = [ ['supply', state.supply, ['Electricity only','Dual fuel']], ['bedrooms', state.bedrooms, ['1 – 2 bedrooms','3 – 4 bedrooms','5+ bedrooms']], ['ev', state.ev, ['Electric vehicle: No','Electric vehicle: Yes']] ];
  entries.forEach(([key, val, values]) => {
    const pill = document.createElement('button'); pill.type = 'button'; pill.className = 'pill-compact' + (state.confirmed[key] ? ' confirmed' : ''); pill.textContent = val;
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close any other fixed dropdowns
      document.querySelectorAll('.dropdown-fixed').forEach(n => n.remove());
      const menu = document.createElement('div'); menu.className = 'dropdown-fixed';
      // Position under pill
      const rect = pill.getBoundingClientRect();
      menu.style.top = (rect.bottom + 6) + 'px';
      menu.style.left = Math.max(8, Math.min(window.innerWidth - 240, rect.left)) + 'px';
      (values).forEach((option) => {
        const item = document.createElement('div'); item.className = 'dropdown-option'; item.textContent = option;
        item.addEventListener('click', () => {
          console.log('Sticky pill clicked:', key, option);
          state[key] = option; pill.textContent = option; state.confirmed[key] = true; pill.classList.add('confirmed');
          // Also update main pills text
          const mainBtn = document.querySelector(`.select[data-key="${key}"]`); if (mainBtn) { const l = mainBtn.querySelector('.label'); if (l) l.textContent = option; mainBtn.classList.add('confirmed'); mainBtn.setAttribute('aria-pressed','true'); }
          if (key === 'bedrooms') updateUsageFromBedrooms();
          updateConfidenceBar(); updateConfidenceCaption(); 
          
          // Check if this is the first confirmation
          const wasFirstConfirmation = Object.values(state.confirmed).filter(Boolean).length === 1;
          
          renderOffers(); 
          
          // Add shimmer effect when cards first appear
          setTimeout(() => addShimmer(), 100);
          
          syncStickyPills();
          menu.remove();
        });
        menu.appendChild(item);
      });
      document.body.appendChild(menu);
    });
    row.appendChild(pill);
  });
}

function setupHeaderBar() { const back = document.getElementById('backBtn'); back?.addEventListener('click', () => {}); }

function setupCollapseObserver() {
  const sticky = document.getElementById('needs-sticky');
  const full = document.getElementById('personal-needs-full');
  const anchor = document.getElementById('personal-needs-anchor');
  if (!sticky || !full || !anchor) return;

  const HEADER_OFFSET_PX = 40;
  let collapsed = false;
  let ticking = false;

  function closeOpenDropdowns() {
    document.querySelectorAll('.dropdown-preview').forEach(n => n.remove());
    document.querySelectorAll('.select.open').forEach(b => b.classList.remove('open'));
  }

  function update() {
    const y = anchor.getBoundingClientRect().top;
    // Enter collapsed when scrolling down past header
    if (!collapsed && y < -HEADER_OFFSET_PX) {
      collapsed = true;
      sticky.classList.add('show');
      full.style.display = 'none';
      full.setAttribute('aria-hidden','true');
      sticky.setAttribute('aria-expanded','false');
      closeOpenDropdowns();
    }
    // Exit collapsed when scrolling back up to original position
    if (collapsed && y > -HEADER_OFFSET_PX) {
      collapsed = false;
      sticky.classList.remove('show');
      full.style.display = 'block';
      full.setAttribute('aria-hidden','false');
      sticky.setAttribute('aria-expanded','true');
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // initial state
  update();

  // Click/keyboard to expand
  sticky.addEventListener('click', () => anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  sticky.addEventListener('keydown', (e) => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); sticky.click(); } });
}

function maybeToggleDetails(target) {
  const detailsBtn = target.closest('.details'); if (!detailsBtn) return;
  const article = detailsBtn.closest('.offer'); let panel = article.querySelector('.details-panel');
  if (panel) { panel.remove(); detailsBtn.querySelector('.chev').textContent = '▾'; return; }
  const tpl = document.getElementById('detailsTemplate'); const clone = tpl.content.cloneNode(true); article.appendChild(clone); detailsBtn.querySelector('.chev').textContent = '▴';
}

// Chat overlay (floaty button) — static size with input + prompts
function generateJayAnalysis(match, savings, variable) {
  const usage = state.usage.toLowerCase();
  const planType = variable ? 'variable' : 'fixed';
  
  if (match >= 80) {
    return `This ${planType} plan is an excellent match for your ${usage} usage profile. The ${match}% match indicates strong alignment with your energy needs. You'll save £${savings} annually compared to your current plan, making it a smart financial choice. The ${planType} pricing structure works well with your consumption pattern.`;
  } else if (match >= 60) {
    return `This ${planType} plan offers a good match at ${match}% for your ${usage} usage. While not perfect, it still provides £${savings} in annual savings. The ${planType} structure may have some trade-offs with your usage pattern, but the savings make it worth considering.`;
  } else {
    return `This ${planType} plan has a ${match}% match, which is lower due to your ${usage} usage pattern. While you'd save £${savings} annually, the ${planType} pricing structure may not be optimal for your consumption habits. Consider confirming your pill selections to find better matches.`;
  }
}

function openJayChatWithAnalysis(question, analysis) {
  const fab = document.querySelector('.fab');
  if (!fab) return;
  
  function ensurePanel() {
    let panel = document.getElementById('chatPanel');
    if (!panel) {
      panel = document.createElement('div'); panel.id = 'chatPanel';
      panel.innerHTML = `
        <div id="chatHeader">Jay <span style="opacity:.8; font-size:12px">↗</span></div>
        <div id="chatBody"></div>
        <div id="chatPrompts"><button class="details" data-suggest="What happens if energy prices change?">What happens if energy prices change?</button><button class="details" data-suggest="Show me other fixed plans I could consider.">Show me other fixed plans I could consider.</button></div>
        <div id="chatFooter"><input id="chatInput" placeholder="Ask anything..." /><button id="chatSend" class="details">Send</button></div>`;
      document.body.appendChild(panel);
      document.getElementById('chatSend').onclick = () => sendMessage();
      document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key==='Enter') sendMessage(); });
      document.querySelectorAll('#chatPrompts .details').forEach(btn => btn.addEventListener('click', () => openChat(btn.getAttribute('data-suggest'))));
    }
    return panel;
  }
  function appendBot(text) { const body = document.getElementById('chatBody'); const p = document.createElement('div'); p.textContent = text; body.appendChild(p); body.scrollTop = body.scrollHeight; }
  function appendUser(text) { const body = document.getElementById('chatBody'); const p = document.createElement('div'); p.style.color = '#374151'; p.style.fontWeight = '600'; p.textContent = text; body.appendChild(p); body.scrollTop = body.scrollHeight; }
  function sendMessage() { const input = document.getElementById('chatInput'); const v = input.value.trim(); if (!v) return; appendUser(v); appendBot(dynamicAnswerFor(v)); input.value=''; }
  function dynamicAnswerFor(q) {
    if (/variable/i.test(q)) return 'Variable plans can change with the price cap. Based on your needs, this plan scores lower because rates may fluctuate and your usage looks ' + state.usage.toLowerCase() + '.';
    if (/fixed/i.test(q)) return 'Fixed plans keep your unit rate predictable for the contract term; your match improves if your usage pattern is steady.';
    if (/renewable/i.test(q)) return 'This plan sources a high share of renewable energy; greener but sometimes pricier. I can compare emissions against similar usage.';
    return 'Here\'s a tailored explanation based on your current needs and confidence. I\'ll highlight savings and trade‑offs for each plan.';
  }
  function openChat(message) {
    const panel = ensurePanel();
    if (message) { appendUser(message); appendBot(dynamicAnswerFor(message)); }
  }
  
  // Open chat panel
  const panel = ensurePanel();
  
  // Add the question and analysis
  appendUser(question);
  appendBot(analysis);
}

function setupChat() {
  const fab = document.querySelector('.fab');
  if (!fab) return;
  function ensurePanel() {
    let panel = document.getElementById('chatPanel');
    if (!panel) {
      panel = document.createElement('div'); panel.id = 'chatPanel';
      panel.innerHTML = `
        <div id="chatHeader">Jay <span style="opacity:.8; font-size:12px">↗</span></div>
        <div id="chatBody"></div>
        <div id="chatPrompts"><button class="details" data-suggest="What happens if energy prices change?">What happens if energy prices change?</button><button class="details" data-suggest="Show me other fixed plans I could consider.">Show me other fixed plans I could consider.</button></div>
        <div id="chatFooter"><input id="chatInput" placeholder="Ask anything..." /><button id="chatSend" class="details">Send</button></div>`;
      document.body.appendChild(panel);
      document.getElementById('chatSend').onclick = () => sendMessage();
      document.getElementById('chatInput').addEventListener('keydown', (e) => { if (e.key==='Enter') sendMessage(); });
      document.querySelectorAll('#chatPrompts .details').forEach(btn => btn.addEventListener('click', () => openChat(btn.getAttribute('data-suggest'))));
    }
    return panel;
  }
  function appendBot(text) { const body = document.getElementById('chatBody'); const p = document.createElement('div'); p.textContent = text; body.appendChild(p); body.scrollTop = body.scrollHeight; }
  function appendUser(text) { const body = document.getElementById('chatBody'); const p = document.createElement('div'); p.style.color = '#374151'; p.style.fontWeight = '600'; p.textContent = text; body.appendChild(p); body.scrollTop = body.scrollHeight; }
  function sendMessage() { const input = document.getElementById('chatInput'); const v = input.value.trim(); if (!v) return; appendUser(v); appendBot(dynamicAnswerFor(v)); input.value=''; }
  function dynamicAnswerFor(q) {
    if (/variable/i.test(q)) return 'Variable plans can change with the price cap. Based on your needs, this plan scores lower because rates may fluctuate and your usage looks ' + state.usage.toLowerCase() + '.';
    if (/fixed/i.test(q)) return 'Fixed plans keep your unit rate predictable for the contract term; your match improves if your usage pattern is steady.';
    if (/renewable/i.test(q)) return 'This plan sources a high share of renewable energy; greener but sometimes pricier. I can compare emissions against similar usage.';
    return 'Here\'s a tailored explanation based on your current needs and confidence. I\'ll highlight savings and trade‑offs for each plan.';
  }
  function openChat(message) {
    const panel = ensurePanel();
    if (message) { appendUser(message); appendBot(dynamicAnswerFor(message)); }
  }
  fab.addEventListener('click', () => {
    const panel = document.getElementById('chatPanel');
    if (panel) { panel.remove(); } else { openChat(); }
  });
  document.addEventListener('click', (e) => {
    const ask = e.target.closest('.ask-jay'); if (ask) { const q = ask.getAttribute('data-question'); openChat(q); }
    if (e.target && (e.target.textContent?.includes('impact with renewables') || e.target.textContent?.includes('100% renewable'))) {
      openChat('This plan sources 85.5% renewable electricity. Based on your usage, we estimate match and savings as shown.');
    }
  });
}

// HoverCard implementation
let hoverCard = null;
let currentAnchor = null;

function createHoverCard() {
  if (hoverCard) return hoverCard;
  
  hoverCard = document.createElement('div');
  hoverCard.className = 'hover-card';
  hoverCard.style.cssText = `
    position: fixed;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04);
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    max-width: 320px;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  `;
  document.body.appendChild(hoverCard);
  return hoverCard;
}

function updateHoverCardPosition(anchor) {
  if (!hoverCard || !anchor) return;
  
  const rect = anchor.getBoundingClientRect();
  const vw = window.innerWidth;
  const cardWidth = hoverCard.offsetWidth || 320;
  
  let left = rect.left + rect.width / 2 - cardWidth / 2;
  left = Math.max(8, Math.min(left, vw - cardWidth - 8));
  const top = rect.bottom + 8;
  
  hoverCard.style.top = top + 'px';
  hoverCard.style.left = left + 'px';
  hoverCard.style.opacity = '1';
  hoverCard.style.pointerEvents = 'auto';
}

function showHoverCard(anchor) {
  const match = anchor.dataset.match;
  const savings = anchor.dataset.savings;
  const variable = anchor.dataset.variable === 'true';
  
  createHoverCard();
  hoverCard.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">${match}% match</div>
    <div style="margin-bottom: 8px;">saves you £${savings} compared to your current plan.</div>
    <button class="ask-jay-btn" style="background: #f8f9ff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 8px; font-size: 12px; cursor: pointer; transition: all 0.2s ease;" data-question="Why is this ${variable ? 'variable' : 'fixed'} plan a ${match}% match for me?" data-match="${match}" data-savings="${savings}" data-variable="${variable}">Ask Jay</button>
  `;
  
  currentAnchor = anchor;
  updateHoverCardPosition(anchor);
  
  // Add event listeners for Ask Jay button
  const askJayBtn = hoverCard.querySelector('.ask-jay-btn');
  if (askJayBtn) {
    askJayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const question = askJayBtn.dataset.question;
      const match = askJayBtn.dataset.match;
      const savings = askJayBtn.dataset.savings;
      const variable = askJayBtn.dataset.variable === 'true';
      
      // Generate analysis from Jay
      const analysis = generateJayAnalysis(match, savings, variable);
      
      // Open chat with pre-sent question and analysis
      openJayChatWithAnalysis(question, analysis);
      
      // Keep hover card open (don't hide it)
    });
    askJayBtn.addEventListener('mouseenter', () => {
      askJayBtn.style.background = '#6E40FF';
      askJayBtn.style.color = 'white';
      askJayBtn.style.borderColor = '#6E40FF';
    });
    askJayBtn.addEventListener('mouseleave', () => {
      askJayBtn.style.background = '#f8f9ff';
      askJayBtn.style.color = '';
      askJayBtn.style.borderColor = '#e5e7eb';
    });
  }
}

function hideHoverCard() {
  if (hoverCard) {
    hoverCard.style.opacity = '0';
    hoverCard.style.pointerEvents = 'none';
    currentAnchor = null;
  }
}

function setupHoverCards() {
  let hoverTimeout = null;
  
  document.addEventListener('mouseover', (e) => {
    const matchChip = e.target.closest('.match-chip');
    if (matchChip) {
      // Clear any pending hide timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      showHoverCard(matchChip);
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    const matchChip = e.target.closest('.match-chip');
    if (matchChip && currentAnchor === matchChip) {
      // Check if mouse is moving to hover card
      const hoverCardElement = e.relatedTarget?.closest('.hover-card');
      if (!hoverCardElement) {
        // Add delay before hiding to allow mouse to reach hover card
        hoverTimeout = setTimeout(() => {
          hideHoverCard();
        }, 300);
      }
    }
  });
  
  // Keep hover card visible when hovering over it
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.hover-card')) {
      // Clear hide timeout when hovering over card
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      hoverCard.style.opacity = '1';
      hoverCard.style.pointerEvents = 'auto';
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.hover-card') && !e.relatedTarget?.closest('.hover-card')) {
      // Add delay before hiding when leaving hover card
      hoverTimeout = setTimeout(() => {
        hideHoverCard();
      }, 300);
    }
  });
  
  // Update position on scroll and resize
  window.addEventListener('scroll', () => {
    if (currentAnchor && hoverCard) {
      updateHoverCardPosition(currentAnchor);
    }
  }, { passive: true });
  
  window.addEventListener('resize', () => {
    if (currentAnchor && hoverCard) {
      updateHoverCardPosition(currentAnchor);
    }
  });
}

function setupHeaderBar() {
  // Set up back button navigation
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      // Navigate back to marketplace, preserving scenario
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? `marketplace.html?scenario=${scenario}` : 'marketplace.html';
      window.location.href = targetUrl;
    });
  }
}

function setupSidebarNavigation() {
  // Sidebar navigation
  const homeBtn = document.getElementById('homeBtn');
  const marketplaceBtn = document.getElementById('marketplaceBtn');
  const subscriptionsBtn = document.getElementById('subscriptionsBtn');
  
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      window.location.href = 'index-landing.html';
    });
  }
  
  if (marketplaceBtn) {
    marketplaceBtn.addEventListener('click', () => {
      // Navigate to marketplace, preserving scenario
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? `marketplace.html?scenario=${scenario}` : 'marketplace.html';
      window.location.href = targetUrl;
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
}

function updateDetailsTemplate() {
  const urlParams = new URLSearchParams(window.location.search);
  const scenario = urlParams.get('scenario');
  
  console.log('Current scenario:', scenario); // Debug log
  
  if (scenario === 'eon') {
    // Create a new template for E.ON scenario
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
    }
  }
}

function init() {
  console.log('Initializing main page...'); // Debug log
  
  setupHeaderBar();
  setupSidebarNavigation();
  updateUsageFromBedrooms(); updateConfidenceBar(); updateConfidenceCaption(); attachSelectorHandlers(); 
  
  // Update template based on scenario
  updateDetailsTemplate();
  
  // Show initial loading state for best match card
  showInitialLoadingState();
  
  syncStickyPills(); setupCollapseObserver(); setupChat(); setupHoverCards(); setupShowAllOffersButton();
  document.addEventListener('click', (e) => {
    if (e.target.closest('.details')) { maybeToggleDetails(e.target); }
    if (e.target.closest('.close-details')) {
      const panel = e.target.closest('.details-panel'); const offer = e.target.closest('.offer'); if (panel && offer) { panel.remove(); const btn = offer.querySelector('.details'); if (btn) btn.querySelector('.chev').textContent = '▾'; }
    }
    // Handle "Choose plan" button clicks
    if (e.target.closest('.primary') && e.target.textContent.includes('Choose plan')) {
      const urlParams = new URLSearchParams(window.location.search);
      const scenario = urlParams.get('scenario');
      const targetUrl = scenario ? `checkout.html?scenario=${scenario}` : 'checkout.html';
      window.location.href = targetUrl;
    }
    // Handle rates toggle
    if (e.target.closest('.rates-toggle')) {
      const toggle = e.target.closest('.rates-toggle');
      const ratesSection = toggle.nextElementSibling;
      const chevron = toggle.querySelector('.chev');
      if (ratesSection.style.display === 'none') {
        ratesSection.style.display = 'block';
        chevron.textContent = '▴';
      } else {
        ratesSection.style.display = 'none';
        chevron.textContent = '›';
      }
    }
  });
}

function showInitialLoadingState() {
  const bestRoot = document.getElementById('bestOffers');
  const allRoot = document.getElementById('allOffers');
  const bestOffersSection = document.querySelector('.best-offers');
  const allOffersSection = document.querySelector('.all-offers');
  
  if (!bestRoot || !bestOffersSection) return;
  
  // Show best offers section
  bestOffersSection.style.display = 'block';
  
  // Hide all offers section initially (will be shown by "Show all offers" button)
  if (allOffersSection) {
    allOffersSection.style.display = 'none';
  }
  
  // Show shimmer placeholder first
  bestRoot.innerHTML = `
    <article class="offer card shimmer-placeholder">
      <div class="offer-left">
        <div class="shimmer-line" style="width: 60px; height: 20px; margin-bottom: 8px;"></div>
        <div class="shimmer-line" style="width: 120px; height: 16px; margin-bottom: 4px;"></div>
        <div class="shimmer-line" style="width: 80px; height: 12px;"></div>
      </div>
      <div class="offer-right">
        <div class="shimmer-line" style="width: 80px; height: 24px; margin-bottom: 4px;"></div>
        <div class="shimmer-line" style="width: 60px; height: 14px;"></div>
      </div>
    </article>
  `;
  
  // After 1200ms, show the actual card with shimmer animation
  setTimeout(() => {
    const priceBase = 40.94; 
    const multiplier = state.bedrooms === '3 – 4 bedrooms' ? 1.18 : state.bedrooms === '5+ bedrooms' ? 1.35 : 1.0;
    const evAdj = state.ev.includes('Yes') ? 1.07 : 1.0; 
    const dualAdj = state.supply === 'Dual fuel' ? 1.06 : 1.0;
    const price1 = (priceBase * multiplier * evAdj * dualAdj).toFixed(2);
    const price2 = (parseFloat(price1) + 3.50).toFixed(2); // Simpler Energy is slightly more expensive
    
    // Show best offers based on scenario
    console.log('showInitialLoadingState - E.ON scenario:', window.ScenarioUtils ? window.ScenarioUtils.isEonScenario() : false);
    const bestOffersHtml = offerHTML(price1, false, { showMatch: true, variable: false, rank: 0 }) +
                          offerHTML(price2, false, { showMatch: true, variable: false, rank: 1 });
    bestRoot.innerHTML = bestOffersHtml;
    
    // Prepare all offers data but don't show them yet
    if (allRoot) {
      const offers = Array.from({length: 7}, (_, i) => {
        const adjustedPrice = (parseFloat(price1) + (i * 2.5)).toFixed(2);
        return { price: adjustedPrice, variable: i % 3 === 0, rank: i + 2 }; // Start from rank 2 for E.ON offers
      });
      const allHtml = offers.map((o) => offerHTML(o.price, true, { showMatch: true, variable: o.variable, rank: o.rank })).join('');
      allRoot.innerHTML = allHtml;
    }
    
    // Add shimmer to the newly rendered cards
    const cards = bestRoot.querySelectorAll('.offer.card');
    cards.forEach(card => {
      card.classList.add('shimmer');
      setTimeout(() => card.classList.remove('shimmer'), 1000);
    });
  }, 1200);
}

function setupShowAllOffersButton() {
  const showAllBtn = document.getElementById('showAllOffersBtn');
  const allOffersSection = document.querySelector('.all-offers');
  
  if (!showAllBtn || !allOffersSection) return;
  
  showAllBtn.addEventListener('click', () => {
    const isHidden = allOffersSection.style.display === 'none' || allOffersSection.style.display === '';
    
    if (isHidden) {
      // Show all offers section
      allOffersSection.style.display = 'block';
      showAllBtn.innerHTML = 'Hide all offers <span class="chev">▴</span>';
      
      // Add shimmer to all offers cards
      setTimeout(() => {
        const allCards = allOffersSection.querySelectorAll('.offer.card');
        allCards.forEach(card => {
          card.classList.add('shimmer');
          setTimeout(() => card.classList.remove('shimmer'), 1000);
        });
      }, 100);
    } else {
      // Hide all offers section
      allOffersSection.style.display = 'none';
      showAllBtn.innerHTML = 'Show all offers <span class="chev">▾</span>';
    }
  });
}

init();
