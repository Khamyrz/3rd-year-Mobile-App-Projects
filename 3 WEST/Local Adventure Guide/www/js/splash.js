/**
 * splash.js - Handles the splash screen for Local Adventure Guide
 * Controls loading animations, initialization tasks, and transition to main app
 */

// Configuration
const SPLASH_DURATION = 3000; // Total time to show splash screen (ms)
const MIN_DISPLAY_TIME = 1500; // Minimum time to show splash even if loading completes (ms)
const FADE_DURATION = 500; // Duration of fade out transition (ms)

// DOM Elements
let splashContainer;
let loadingBar;
let loadingProgress;
let loadingText;
let appReady = false;

/**
 * Initialize the splash screen
 */
function initSplash() {
  // Get references to DOM elements
  splashContainer = document.querySelector('.splash-container');
  loadingBar = document.querySelector('.loading-bar');
  loadingProgress = document.querySelector('.loading-progress');
  loadingText = document.querySelector('.loading-text');
  
  // Set up loading animation
  animateLoading();
  
  // Start loading app resources
  loadAppResources();
  
  // Set timer for minimum display time
  setTimeout(() => {
    if (appReady) {
      hideSplash();
    } else {
      // If resources aren't loaded yet, wait until they are
      loadingText.textContent = 'Almost there...';
    }
  }, MIN_DISPLAY_TIME);
  
  // Set maximum time to show splash screen
  setTimeout(() => {
    if (!appReady) {
      appReady = true;
      loadingText.textContent = 'Ready!';
      hideSplash();
    }
  }, SPLASH_DURATION);
}

/**
 * Animate the loading bar
 */
function animateLoading() {
  // Instead of using CSS animation, control it with JS for more flexibility
  let progress = 0;
  const interval = 30; // Update interval in ms
  const increment = 100 / (SPLASH_DURATION / interval * 0.8); // Slightly slower than actual loading
  
  const progressInterval = setInterval(() => {
    progress += increment;
    
    // Cap at 90% until resources are actually loaded
    if (!appReady && progress > 90) {
      progress = 90;
      clearInterval(progressInterval);
    }
    
    // If resources loaded but not at 100% yet, jump to 100%
    if (appReady && progress < 100) {
      progress = 100;
    }
    
    // If reached 100%, clear the interval
    if (progress >= 100) {
      clearInterval(progressInterval);
    }
    
    loadingProgress.style.width = `${progress}%`;
  }, interval);
}

/**
 * Load necessary app resources
 */
function loadAppResources() {
  // Simulate loading app resources (replace with actual resource loading)
  const resources = [
    'map-data.json',
    'adventure-icons.svg',
    'location-services.js',
    'main-app.js'
  ];
  
  let loadedCount = 0;
  
  // Simulate loading each resource with random timing
  resources.forEach(resource => {
    const loadTime = 500 + Math.random() * 1500; // Random load time between 500ms and 2000ms
    
    setTimeout(() => {
      console.log(`Loaded: ${resource}`);
      loadedCount++;
      
      // Update loading text to show progress
      loadingText.textContent = `Loading resources (${loadedCount}/${resources.length})...`;
      
      // Check if all resources are loaded
      if (loadedCount === resources.length) {
        appReady = true;
        loadingText.textContent = 'Ready!';
        
        // If minimum display time has already passed, hide splash
        if (Date.now() - startTime > MIN_DISPLAY_TIME) {
          hideSplash();
        }
      }
    }, loadTime);
  });
}

/**
 * Hide the splash screen and show the main app
 */
function hideSplash() {
  // Fade out splash screen
  splashContainer.style.transition = `opacity ${FADE_DURATION}ms ease-out`;
  splashContainer.style.opacity = '0';
  
  // After fade completes, redirect or show main app
  setTimeout(() => {
    // Option 1: Hide splash screen but keep it in DOM
    splashContainer.style.display = 'none';
    
    // Option 2: Remove splash screen from DOM
    // splashContainer.parentNode.removeChild(splashContainer);
    
    // Option 3: Redirect to main app page
    // window.location.href = 'main.html';
    
    // For this example, we'll just show an element that would be your main app
    const mainApp = document.getElementById('main-app') || document.createElement('div');
    if (!mainApp.id) {
      mainApp.id = 'main-app';
      mainApp.innerHTML = '<h1>Welcome to Local Adventure Guide!</h1><p>Main app content would load here.</p>';
      mainApp.style.padding = '2rem';
      mainApp.style.textAlign = 'center';
      document.body.appendChild(mainApp);
    }
    mainApp.style.display = 'block';
    
    // Trigger any initialization function for main app
    if (typeof initMainApp === 'function') {
      initMainApp();
    }
  }, FADE_DURATION);
}

// Record start time to ensure minimum display duration
const startTime = Date.now();

// Initialize splash when DOM is ready
document.addEventListener('DOMContentLoaded', initSplash);

// Export functions for external use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSplash,
    hideSplash
  };
}