// Checklist Page JavaScript

class ChecklistManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSidebarToggle();
    this.setupCheckboxHandlers();
    this.updateProgress();
    this.setupScenarioBranding();
  }

  setupSidebarToggle() {
    // Use global sidebar functionality - no need for local implementation
    // The global initializeSidebar() function handles state persistence
  }

  setupCheckboxHandlers() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.handleCheckboxChange(checkbox);
        this.updateProgress();
      });
    });
  }

  handleCheckboxChange(checkbox) {
    const checklistItem = checkbox.closest('.checklist-item');
    const category = checklistItem.dataset.category;
    
    if (checkbox.checked) {
      checklistItem.classList.add('completed');
      this.showCompletionAnimation(checklistItem);
      
      // Determine CTA based on whether provider was selected from marketplace
      const selectedProvider = sessionStorage.getItem('selectedEnergyProvider');
      if (category === 'energy' && selectedProvider) {
        this.updateCTAButton(checklistItem, true, true); // Completed via marketplace
      } else {
        this.updateCTAButton(checklistItem, true, false); // Completed manually
      }
    } else {
      checklistItem.classList.remove('completed');
      this.updateCTAButton(checklistItem, false);
      
      // Remove green treatment from section if it was complete
      const section = checklistItem.closest('.checklist-section');
      if (section.classList.contains('section-complete')) {
        section.classList.remove('section-complete');
        this.expandSection(section, true); // Expand and remove button
        this.updateSectionIcon(section, category, false); // Reset icon
      }
    }
    
    // Update section progress
    this.updateSectionProgress(category);
  }

  updateCTAButton(item, isCompleted, fromMarketplace = false) {
    console.log('updateCTAButton called:', { isCompleted, fromMarketplace, item: item.querySelector('h3')?.textContent });
    
    // Look for both primary and secondary buttons
    let primaryBtn = item.querySelector('.action-btn.primary');
    if (!primaryBtn) {
      primaryBtn = item.querySelector('.action-btn.secondary');
    }
    
    if (primaryBtn) {
      console.log('Button found:', primaryBtn.textContent, 'Current classes:', primaryBtn.className);
      
      if (isCompleted) {
        primaryBtn.classList.remove('primary');
        primaryBtn.classList.add('secondary');
        console.log('Button updated to secondary, new classes:', primaryBtn.className);
        if (fromMarketplace) {
          primaryBtn.textContent = 'View Details';
          primaryBtn.onclick = () => this.toggleDetails(item);
        } else {
          primaryBtn.textContent = 'Share details with Jay';
          primaryBtn.onclick = () => this.shareWithJay(item);
        }
      } else {
        // Reset to primary button when unchecked
        primaryBtn.classList.remove('secondary');
        primaryBtn.classList.add('primary');
        // Determine original button text based on task
        const taskTitle = item.querySelector('h3').textContent;
        if (taskTitle.includes('electricity')) {
          primaryBtn.textContent = 'Browse Energy Plans';
          primaryBtn.onclick = () => window.location.href = 'marketplace.html';
        } else if (taskTitle.includes('gas')) {
          primaryBtn.textContent = 'Browse Gas Plans';
          primaryBtn.onclick = () => window.location.href = 'marketplace.html';
        } else if (taskTitle.includes('broadband')) {
          primaryBtn.textContent = 'Compare plans';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('TV')) {
          primaryBtn.textContent = 'Explore options';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('council')) {
          primaryBtn.textContent = 'Go to council site';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('waste')) {
          primaryBtn.textContent = 'View schedule';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('vote')) {
          primaryBtn.textContent = 'Register online';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('insurance')) {
          primaryBtn.textContent = 'Get a quote';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('car')) {
          primaryBtn.textContent = 'Update details';
          primaryBtn.onclick = () => {};
        } else if (taskTitle.includes('meter')) {
          primaryBtn.textContent = 'Learn more';
          primaryBtn.onclick = () => {};
        } else {
          primaryBtn.textContent = 'Learn more';
          primaryBtn.onclick = () => {};
        }
      }
    }
  }

  shareWithJay(item) {
    // Open Jay chat with pre-filled message
    const taskName = item.querySelector('h3').textContent;
    const message = `I've completed ${taskName}. Can you help me with the next steps?`;
    
    // Store the message for Jay chat
    sessionStorage.setItem('jayMessage', message);
    
    // Open Jay chat (this would integrate with your existing chat system)
    console.log('Opening Jay chat with message:', message);
    // You can integrate this with your existing chat system
  }

  toggleDetails(item) {
    const details = item.querySelector('.item-details');
    if (details) {
      const isVisible = details.style.display !== 'none';
      if (isVisible) {
        details.style.display = 'none';
      } else {
        details.style.display = 'block';
        // Trigger animation
        details.style.animation = 'none';
        setTimeout(() => {
          details.style.animation = 'expandDetails 0.3s ease-out';
        }, 10);
      }
    }
  }

  showCompletionAnimation(item) {
    // Add a subtle animation when item is completed
    item.style.transform = 'scale(1.02)';
    item.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
      item.style.transform = 'scale(1)';
    }, 200);
  }

  updateSectionProgress(category) {
    const section = document.querySelector(`[data-category="${category}"]`).closest('.checklist-section');
    const items = section.querySelectorAll('.checklist-item');
    const completedItems = section.querySelectorAll('.checklist-item.completed');
    
    const progress = (completedItems.length / items.length) * 100;
    const progressFill = section.querySelector('.progress-fill');
    const progressText = section.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${completedItems.length}/${items.length} completed`;
    }
    
    // Check if section is complete
    if (completedItems.length === items.length) {
      this.handleSectionComplete(section, category);
    }
  }

  handleSectionComplete(section, category) {
    // Add completion styling
    section.classList.add('section-complete');
    
    // Collapse the section with animation
    this.collapseSection(section);
    
    // Update section icon to green
    this.updateSectionIcon(section, category, true);
    
    // Add expand button
    this.addExpandButton(section);
    
    // Show completion animation
    this.showSectionCompletionAnimation(section);
  }

  collapseSection(section) {
    const checklistItems = section.querySelector('.checklist-items');
    if (checklistItems) {
      checklistItems.style.maxHeight = '0';
      checklistItems.style.overflow = 'hidden';
      checklistItems.style.transition = 'max-height 0.5s ease';
      checklistItems.style.opacity = '0';
    }
    
    // Replace collapse button with expand button
    const collapseBtn = section.querySelector('.collapse-btn');
    if (collapseBtn) {
      collapseBtn.className = 'expand-btn';
      collapseBtn.innerHTML = '↕️ Expand';
      collapseBtn.onclick = () => this.expandSection(section);
    }
  }

  expandSection(section) {
    const checklistItems = section.querySelector('.checklist-items');
    if (checklistItems) {
      checklistItems.style.maxHeight = '1000px';
      checklistItems.style.opacity = '1';
      checklistItems.style.transition = 'max-height 0.5s ease, opacity 0.3s ease';
    }
    
    // Replace expand button with collapse button
    const expandBtn = section.querySelector('.expand-btn');
    if (expandBtn) {
      expandBtn.className = 'collapse-btn';
      expandBtn.innerHTML = '↕️ Collapse';
      expandBtn.onclick = () => this.collapseSection(section);
    }
  }

  addExpandButton(section) {
    const sectionHeader = section.querySelector('.section-header');
    if (sectionHeader && !sectionHeader.querySelector('.expand-btn')) {
      const expandBtn = document.createElement('button');
      expandBtn.className = 'expand-btn';
      expandBtn.innerHTML = '↕️ Expand';
      expandBtn.onclick = () => this.expandSection(section);
      
      sectionHeader.appendChild(expandBtn);
    }
  }

  updateSectionIcon(section, category, isComplete) {
    const sectionIcon = section.querySelector('.section-icon');
    if (sectionIcon) {
      if (isComplete) {
        sectionIcon.style.background = '#10b981'; // Green
        sectionIcon.textContent = '✓';
      } else {
        // Reset to original icon based on category
        const icons = {
          energy: '⚡',
          internet: '📶',
          council: '🏛️',
          insurance: '🛡️'
        };
        sectionIcon.style.background = '#6144DD'; // Original purple
        sectionIcon.textContent = icons[category] || '📋';
      }
    }
  }

  showSectionCompletionAnimation(section) {
    // Add a subtle pulse animation
    section.style.transform = 'scale(1.02)';
    section.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
      section.style.transform = 'scale(1)';
    }, 300);
  }

  updateProgress() {
    // Check if user has completed energy setup from marketplace
    this.checkEnergyProviderSelection();
    
    // Note: Removed completion message as requested
  }

  checkEnergyProviderSelection() {
    // Check if user has selected an energy provider from marketplace
    const selectedProvider = sessionStorage.getItem('selectedEnergyProvider');
    const selectedPlan = sessionStorage.getItem('selectedEnergyPlan');
    
    if (selectedProvider && selectedPlan) {
      this.markEnergyTaskComplete(selectedProvider, selectedPlan);
    }
  }

  markEnergyTaskComplete(provider, plan) {
    const energyTask = document.querySelector('#energy-1');
    if (energyTask && !energyTask.checked) {
      // Mark as completed
      energyTask.checked = true;
      const checklistItem = energyTask.closest('.checklist-item');
      checklistItem.classList.add('completed');
      
      // Update CTA button
      this.updateCTAButton(checklistItem, true);
      
      // Add provider logo and plan name
      this.addProviderDisplay(checklistItem, provider, plan);
      
      // Update section progress
      this.updateSectionProgress('energy');
    }
  }

  addProviderDisplay(item, provider, plan) {
    const itemContent = item.querySelector('.item-content');
    
    // Update the expandable details with provider info
    const details = item.querySelector('.item-details');
    if (details) {
      const providerLogo = details.querySelector('.provider-logo');
      const providerPlan = details.querySelector('.provider-plan');
      
      if (providerLogo) {
        providerLogo.textContent = provider;
        providerLogo.className = `provider-logo ${provider.toLowerCase()}`;
      }
      
      if (providerPlan) {
        providerPlan.textContent = plan;
      }
    }
    
    // Create provider display for the main card
    const providerDisplay = document.createElement('div');
    providerDisplay.className = 'provider-display';
    providerDisplay.innerHTML = `
      <div class="provider-info">
        <div class="provider-logo ${provider.toLowerCase()}">${provider}</div>
        <div class="provider-plan">${plan}</div>
      </div>
    `;
    
    // Insert after the description
    const description = itemContent.querySelector('p');
    description.insertAdjacentElement('afterend', providerDisplay);
  }


  setupScenarioBranding() {
    // Apply scenario-specific branding if available
    if (window.ScenarioUtils) {
      const scenario = window.ScenarioUtils.getCurrentScenario();
      
      if (scenario === 'eon') {
        this.applyEonBranding();
      } else if (scenario === 'bg') {
        this.applyBgBranding();
      } else if (scenario === 'openrent') {
        this.applyOpenRentBranding();
      }
    }
  }

  applyEonBranding() {
    // Keep Just Move In branding - don't change the brand text
    // const brand = document.querySelector('.brand');
    // if (brand) {
    //   brand.textContent = 'E.ON Next';
    // }
    
    // Update primary buttons to main CTA color
    const primaryButtons = document.querySelectorAll('.action-btn.primary');
    primaryButtons.forEach(btn => {
      btn.style.background = '#6144DD';
    });
    
    // Update progress bars to main CTA color
    const progressFills = document.querySelectorAll('.progress-fill, .overall-progress-fill');
    progressFills.forEach(fill => {
      fill.style.background = '#6144DD';
    });
  }

  applyBgBranding() {
    // Keep Just Move In branding - don't change the brand text
    // const brand = document.querySelector('.brand');
    // if (brand) {
    //   brand.textContent = 'British Gas';
    // }
    
    // Update primary buttons to main CTA color
    const primaryButtons = document.querySelectorAll('.action-btn.primary');
    primaryButtons.forEach(btn => {
      btn.style.background = '#6144DD';
    });
    
    // Update progress bars to main CTA color
    const progressFills = document.querySelectorAll('.progress-fill, .overall-progress-fill');
    progressFills.forEach(fill => {
      fill.style.background = '#6144DD';
    });
  }

  applyOpenRentBranding() {
    // Keep Just Move In branding - don't change the brand text
    // const brand = document.querySelector('.brand');
    // if (brand) {
    //   brand.textContent = 'Open Rent';
    // }
    
    // Update menu label to "Contracts" for Open Rent scenario
    const navLabels = document.querySelectorAll('.nav-item .nav-label');
    navLabels.forEach(label => {
      if (label.textContent === 'Subscriptions') {
        label.textContent = 'Contracts';
        console.log('Updated sidebar menu label to Contracts');
      }
    });
    
    // Update primary buttons to main CTA color
    const primaryButtons = document.querySelectorAll('.action-btn.primary');
    primaryButtons.forEach(btn => {
      btn.style.background = '#6144DD';
    });
    
    // Update progress bars to main CTA color
    const progressFills = document.querySelectorAll('.progress-fill, .overall-progress-fill');
    progressFills.forEach(fill => {
      fill.style.background = '#6144DD';
    });
  }
}

// Global functions for HTML onclick handlers
function toggleSidebar() {
  // This will be handled by the ChecklistManager class
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChecklistManager();
});

// Handle scenario branding on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('CHECKLIST PAGE LOADED');
  if (window.ScenarioUtils) {
    if (window.ScenarioUtils.isEonScenario()) {
      console.log('E.ON SCENARIO DETECTED - Applying branding');
      // Branding will be applied by ChecklistManager
    } else if (window.ScenarioUtils.isBgScenario()) {
      console.log('BG SCENARIO DETECTED - Applying branding');
      // Branding will be applied by ChecklistManager
    } else {
      console.log('No special scenario detected');
    }
  }
});
