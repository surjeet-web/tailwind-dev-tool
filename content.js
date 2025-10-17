// Content script for Tailwind CSS Developer Tools extension
(function() {
  'use strict';

  // Prevent multiple initialization
  if (window.tailwindDevToolsInitialized) {
    return;
  }
  window.tailwindDevToolsInitialized = true;

  // Extension variables (scoped to this IIFE)
  let highlighter;
  let panel;
  let selectedElement = null;
  let isInspecting = false;
  let tailwindClasses = [];

  // Comprehensive Tailwind classes database (fallback)
  const fallbackClasses = [
    // Spacing
    { class: 'p-0', description: 'Padding 0', category: 'spacing' },
    { class: 'p-1', description: 'Padding 0.25rem (4px)', category: 'spacing' },
    { class: 'p-2', description: 'Padding 0.5rem (8px)', category: 'spacing' },
    { class: 'p-3', description: 'Padding 0.75rem (12px)', category: 'spacing' },
    { class: 'p-4', description: 'Padding 1rem (16px)', category: 'spacing' },
    { class: 'p-5', description: 'Padding 1.25rem (20px)', category: 'spacing' },
    { class: 'p-6', description: 'Padding 1.5rem (24px)', category: 'spacing' },
    { class: 'p-8', description: 'Padding 2rem (32px)', category: 'spacing' },
    { class: 'p-10', description: 'Padding 2.5rem (40px)', category: 'spacing' },
    { class: 'p-12', description: 'Padding 3rem (48px)', category: 'spacing' },
    
    { class: 'm-0', description: 'Margin 0', category: 'spacing' },
    { class: 'm-1', description: 'Margin 0.25rem (4px)', category: 'spacing' },
    { class: 'm-2', description: 'Margin 0.5rem (8px)', category: 'spacing' },
    { class: 'm-3', description: 'Margin 0.75rem (12px)', category: 'spacing' },
    { class: 'm-4', description: 'Margin 1rem (16px)', category: 'spacing' },
    { class: 'm-5', description: 'Margin 1.25rem (20px)', category: 'spacing' },
    { class: 'm-6', description: 'Margin 1.5rem (24px)', category: 'spacing' },
    { class: 'm-8', description: 'Margin 2rem (32px)', category: 'spacing' },
    { class: 'm-10', description: 'Margin 2.5rem (40px)', category: 'spacing' },
    { class: 'm-12', description: 'Margin 3rem (48px)', category: 'spacing' },

    // Colors - Background
    { class: 'bg-white', description: 'White background', category: 'colors' },
    { class: 'bg-black', description: 'Black background', category: 'colors' },
    { class: 'bg-red-50', description: 'Red 50 background', category: 'colors' },
    { class: 'bg-red-100', description: 'Red 100 background', category: 'colors' },
    { class: 'bg-red-200', description: 'Red 200 background', category: 'colors' },
    { class: 'bg-red-300', description: 'Red 300 background', category: 'colors' },
    { class: 'bg-red-400', description: 'Red 400 background', category: 'colors' },
    { class: 'bg-red-500', description: 'Red 500 background', category: 'colors' },
    { class: 'bg-red-600', description: 'Red 600 background', category: 'colors' },
    { class: 'bg-red-700', description: 'Red 700 background', category: 'colors' },
    { class: 'bg-red-800', description: 'Red 800 background', category: 'colors' },
    { class: 'bg-red-900', description: 'Red 900 background', category: 'colors' },
    
    { class: 'bg-blue-50', description: 'Blue 50 background', category: 'colors' },
    { class: 'bg-blue-100', description: 'Blue 100 background', category: 'colors' },
    { class: 'bg-blue-200', description: 'Blue 200 background', category: 'colors' },
    { class: 'bg-blue-300', description: 'Blue 300 background', category: 'colors' },
    { class: 'bg-blue-400', description: 'Blue 400 background', category: 'colors' },
    { class: 'bg-blue-500', description: 'Blue 500 background', category: 'colors' },
    { class: 'bg-blue-600', description: 'Blue 600 background', category: 'colors' },
    { class: 'bg-blue-700', description: 'Blue 700 background', category: 'colors' },
    { class: 'bg-blue-800', description: 'Blue 800 background', category: 'colors' },
    { class: 'bg-blue-900', description: 'Blue 900 background', category: 'colors' },

    { class: 'bg-green-50', description: 'Green 50 background', category: 'colors' },
    { class: 'bg-green-100', description: 'Green 100 background', category: 'colors' },
    { class: 'bg-green-200', description: 'Green 200 background', category: 'colors' },
    { class: 'bg-green-300', description: 'Green 300 background', category: 'colors' },
    { class: 'bg-green-400', description: 'Green 400 background', category: 'colors' },
    { class: 'bg-green-500', description: 'Green 500 background', category: 'colors' },
    { class: 'bg-green-600', description: 'Green 600 background', category: 'colors' },
    { class: 'bg-green-700', description: 'Green 700 background', category: 'colors' },
    { class: 'bg-green-800', description: 'Green 800 background', category: 'colors' },
    { class: 'bg-green-900', description: 'Green 900 background', category: 'colors' },

    { class: 'bg-gray-50', description: 'Gray 50 background', category: 'colors' },
    { class: 'bg-gray-100', description: 'Gray 100 background', category: 'colors' },
    { class: 'bg-gray-200', description: 'Gray 200 background', category: 'colors' },
    { class: 'bg-gray-300', description: 'Gray 300 background', category: 'colors' },
    { class: 'bg-gray-400', description: 'Gray 400 background', category: 'colors' },
    { class: 'bg-gray-500', description: 'Gray 500 background', category: 'colors' },
    { class: 'bg-gray-600', description: 'Gray 600 background', category: 'colors' },
    { class: 'bg-gray-700', description: 'Gray 700 background', category: 'colors' },
    { class: 'bg-gray-800', description: 'Gray 800 background', category: 'colors' },
    { class: 'bg-gray-900', description: 'Gray 900 background', category: 'colors' },

    // Colors - Text
    { class: 'text-white', description: 'White text color', category: 'colors' },
    { class: 'text-black', description: 'Black text color', category: 'colors' },
    { class: 'text-red-500', description: 'Red 500 text', category: 'colors' },
    { class: 'text-red-600', description: 'Red 600 text', category: 'colors' },
    { class: 'text-blue-500', description: 'Blue 500 text', category: 'colors' },
    { class: 'text-blue-600', description: 'Blue 600 text', category: 'colors' },
    { class: 'text-gray-500', description: 'Gray 500 text', category: 'colors' },
    { class: 'text-gray-600', description: 'Gray 600 text', category: 'colors' },
    { class: 'text-gray-700', description: 'Gray 700 text', category: 'colors' },
    { class: 'text-gray-800', description: 'Gray 800 text', category: 'colors' },
    { class: 'text-gray-900', description: 'Gray 900 text', category: 'colors' },

    // Borders
    { class: 'rounded', description: 'Border radius 0.25rem', category: 'borders' },
    { class: 'rounded-none', description: 'No border radius', category: 'borders' },
    { class: 'rounded-sm', description: 'Small border radius', category: 'borders' },
    { class: 'rounded-md', description: 'Medium border radius', category: 'borders' },
    { class: 'rounded-lg', description: 'Large border radius', category: 'borders' },
    { class: 'rounded-xl', description: 'Extra large border radius', category: 'borders' },
    { class: 'rounded-2xl', description: '2x large border radius', category: 'borders' },
    { class: 'rounded-full', description: 'Full border radius', category: 'borders' },

    // Effects
    { class: 'shadow', description: 'Box shadow', category: 'effects' },
    { class: 'shadow-sm', description: 'Small shadow', category: 'effects' },
    { class: 'shadow-md', description: 'Medium shadow', category: 'effects' },
    { class: 'shadow-lg', description: 'Large shadow', category: 'effects' },
    { class: 'shadow-xl', description: 'Extra large shadow', category: 'effects' },
    { class: 'shadow-2xl', description: '2x large shadow', category: 'effects' },
    { class: 'shadow-none', description: 'No shadow', category: 'effects' },

    // Layout
    { class: 'flex', description: 'Display flex', category: 'layout' },
    { class: 'block', description: 'Display block', category: 'layout' },
    { class: 'inline', description: 'Display inline', category: 'layout' },
    { class: 'inline-block', description: 'Display inline-block', category: 'layout' },
    { class: 'hidden', description: 'Display none', category: 'layout' },
    { class: 'grid', description: 'Display grid', category: 'layout' },

    // Typography
    { class: 'font-thin', description: 'Font weight 100', category: 'typography' },
    { class: 'font-light', description: 'Font weight 300', category: 'typography' },
    { class: 'font-normal', description: 'Font weight 400', category: 'typography' },
    { class: 'font-medium', description: 'Font weight 500', category: 'typography' },
    { class: 'font-semibold', description: 'Font weight 600', category: 'typography' },
    { class: 'font-bold', description: 'Font weight 700', category: 'typography' },
    { class: 'font-extrabold', description: 'Font weight 800', category: 'typography' },
    { class: 'font-black', description: 'Font weight 900', category: 'typography' }
  ];

  // Create element highlighter
  function createHighlighter() {
    const highlighterElement = document.createElement('div');
    highlighterElement.className = 'tailwind-dev-tools-highlighter';
    highlighterElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      background-color: rgba(59, 130, 246, 0.2);
      border: 2px solid #3B82F6;
      border-radius: 4px;
      z-index: 99998;
      display: none;
      transition: all 0.1s ease;
    `;
    document.body.appendChild(highlighterElement);
    return highlighterElement;
  }

  // Create floating panel
  function createFloatingPanel() {
    const panelElement = document.createElement('div');
    panelElement.id = 'tailwind-tools-panel';
    panelElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 420px;
      height: calc(100vh - 40px);
      background-color: white;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
      z-index: 99999;
      display: none;
      overflow: hidden;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    `;

    panelElement.innerHTML = `
      <!-- Panel Header -->
      <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f8fafc, #f1f5f9);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B82F6, #2563EB); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
              </svg>
            </div>
            <div>
              <h1 style="margin: 0; font-size: 16px; font-weight: bold; color: #111827;">Tailwind CSS Tools</h1>
              <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">v2.0</div>
            </div>
          </div>
          <button id="close-panel" style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; opacity: 0.8; transition: all 0.2s;">
            <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Panel Content -->
      <div style="height: calc(100% - 65px); display: flex; flex-direction: column;">
        <!-- Inspector Section -->
        <div style="padding: 16px; flex: 1; overflow-y: auto;">
          <button id="inspect-element" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 16px; font-weight: 500; transition: all 0.2s; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);">
            🔍 Inspect Element
          </button>

          <div id="element-info" style="display: none; margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 6px; font-weight: 500;" id="element-path"></div>
            <div style="font-family: monospace; font-size: 13px; background-color: #f1f5f9; padding: 8px; border-radius: 4px; color: #111827;" id="element-tag"></div>
          </div>

          <div id="applied-classes" style="display: none; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">Applied Classes</h3>
              <span style="font-size: 11px; color: #3B82F6; background: #EFF6FF; padding: 2px 6px; border-radius: 3px; font-weight: 500;">💡 Click for alternatives</span>
            </div>
            <div id="classes-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
          </div>

          <div style="margin-bottom: 16px; position: relative;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #111827;">Add Class</h3>
            <div style="position: relative;">
              <input type="text" id="class-search" placeholder="Search Tailwind classes..." style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; font-size: 13px; box-sizing: border-box;">
              <div id="search-suggestions" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 4px; z-index: 1000; display: none; max-height: 300px; overflow-y: auto; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);"></div>
            </div>
          </div>

          <div id="suggestions" style="display: none;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #111827;">Smart Suggestions</h3>
            <div id="suggestions-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
          </div>
        </div>
      </div>

      <!-- Class Alternatives Modal -->
      <div id="class-alternatives-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 100000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
        <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-size: 14px; font-weight: 600; color: #111827;">
                Alternatives for <code id="modal-class-name" style="background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-size: 12px;">p-4</code>
              </h3>
              <button id="close-alternatives-modal" style="background: none; border: none; cursor: pointer; padding: 4px;">
                <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div style="padding: 16px;">
            <div id="alternatives-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; max-height: 400px; overflow-y: auto;"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panelElement);
    return panelElement;
  }

  // Load Tailwind classes
  function loadTailwindClasses() {
    // Try to load from JSON file first
    fetch(chrome.runtime.getURL('tailwind-classes-enhanced.json'))
      .then(response => response.json())
      .then(data => {
        console.log('Loading Tailwind classes from JSON...');
        tailwindClasses = [];
        
        // Flatten the trie-based class structure
        function flattenClasses(obj, prefix = '') {
          for (const [key, value] of Object.entries(obj)) {
            if (key === '__info') {
              if (value.type === 'utility' || !value.type) {
                tailwindClasses.push({
                  class: prefix,
                  description: value.description,
                  category: value.category
                });
              }
            } else if (typeof value === 'object') {
              const newPrefix = prefix ? `${prefix}-${key}` : key;
              flattenClasses(value, newPrefix);
            }
          }
        }

        flattenClasses(data.classNamesTree);
        console.log(`Loaded ${tailwindClasses.length} Tailwind classes`);
      })
      .catch(err => {
        console.log('Using fallback classes:', err);
        tailwindClasses = fallbackClasses;
      });
  }

  // Search functionality
  function setupSearch() {
    const searchInput = document.getElementById('class-search');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    if (!searchInput || !searchSuggestions) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query === '') {
        searchSuggestions.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query, searchSuggestions);
      }, 150);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
      }
    });
  }

  function performSearch(query, searchSuggestions) {
    const queryLower = query.toLowerCase();
    const results = [];

    // Search through classes
    tailwindClasses.forEach(cls => {
      let score = 0;
      
      if (cls.class.toLowerCase() === queryLower) score = 100;
      else if (cls.class.toLowerCase().startsWith(queryLower)) score = 90;
      else if (cls.class.toLowerCase().includes(queryLower)) score = 70;
      else if (cls.description.toLowerCase().includes(queryLower)) score = 50;
      else if (cls.category.toLowerCase().includes(queryLower)) score = 30;

      if (score > 0) {
        results.push({ ...cls, score });
      }
    });

    // Sort by score and limit results
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, 10);

    if (topResults.length > 0) {
      searchSuggestions.innerHTML = topResults.map(cls => {
        const highlightedClass = cls.class.replace(
          new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
          match => `<span style="font-weight: 600; color: #3B82F6;">${match}</span>`
        );
        
        return `
          <div class="search-suggestion" data-class="${cls.class}" style="padding: 12px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.1s ease; background: white;">
            <div style="font-weight: 500; margin-bottom: 4px; font-family: monospace; font-size: 13px;">${highlightedClass}</div>
            <div style="font-size: 12px; color: #6B7280;">${cls.description} • ${cls.category}</div>
          </div>
        `;
      }).join('');

      // Add hover effects
      const suggestionElements = searchSuggestions.querySelectorAll('.search-suggestion');
      suggestionElements.forEach(suggestion => {
        suggestion.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f8fafc';
        });
        
        suggestion.addEventListener('mouseleave', function() {
          this.style.backgroundColor = 'white';
        });

        suggestion.addEventListener('click', function() {
          const selectedClass = this.dataset.class;
          addClass(selectedClass);
          document.getElementById('class-search').value = '';
          searchSuggestions.style.display = 'none';
        });
      });

      searchSuggestions.style.display = 'block';
    } else {
      searchSuggestions.innerHTML = `
        <div style="padding: 12px; color: #6B7280; text-align: center; font-size: 14px;">
          No classes found for "${query}"
        </div>
      `;
      searchSuggestions.style.display = 'block';
    }
  }

  // Initialize extension
  function initializeExtension() {
    if (window.location.protocol === 'chrome:') {
      console.log('Extension cannot run on chrome:// URLs');
      return;
    }

    // Create UI elements
    highlighter = createHighlighter();
    panel = createFloatingPanel();

    // Load classes
    loadTailwindClasses();

    // Set up functionality
    setupEventListeners();
    setupSearch();

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      try {
        if (request.action === 'togglePanel') {
          togglePanel();
          sendResponse({ success: true });
        } else if (request.action === 'inspectElement') {
          startInspection();
          sendResponse({ success: true });
        }
      } catch (err) {
        console.error('Error handling message:', err);
        sendResponse({ success: false, error: err.message });
      }
      return true;
    });

    console.log('Tailwind CSS Developer Tools extension initialized');
  }

  // Set up event listeners
  function setupEventListeners() {
    // Close panel button
    const closeButton = document.getElementById('close-panel');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        panel.style.display = 'none';
        stopInspection();
      });
    }

    // Inspect element button
    const inspectButton = document.getElementById('inspect-element');
    if (inspectButton) {
      inspectButton.addEventListener('click', () => {
        if (isInspecting) {
          stopInspection();
        } else {
          startInspection();
        }
      });
    }

    // Close alternatives modal
    const closeModalButton = document.getElementById('close-alternatives-modal');
    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        document.getElementById('class-alternatives-modal').style.display = 'none';
      });
    }

    // Mouse events for element inspection
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
  }

  // Toggle panel visibility
  function togglePanel() {
    if (panel.style.display === 'none' || panel.style.display === '') {
      panel.style.display = 'block';
      panel.style.opacity = '0';
      panel.style.transform = 'translateX(100%)';
      
      requestAnimationFrame(() => {
        panel.style.transition = 'all 0.3s ease-out';
        panel.style.opacity = '1';
        panel.style.transform = 'translateX(0)';
      });
    } else {
      panel.style.transition = 'all 0.3s ease-in';
      panel.style.opacity = '0';
      panel.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        panel.style.display = 'none';
        stopInspection();
      }, 300);
    }
  }

  // Start element inspection
  function startInspection() {
    isInspecting = true;
    const inspectButton = document.getElementById('inspect-element');
    if (inspectButton) {
      inspectButton.textContent = '⏹️ Stop Inspecting';
      inspectButton.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
    }
    document.body.style.cursor = 'crosshair';
  }

  // Stop element inspection
  function stopInspection() {
    isInspecting = false;
    const inspectButton = document.getElementById('inspect-element');
    if (inspectButton) {
      inspectButton.textContent = '🔍 Inspect Element';
      inspectButton.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
    }
    document.body.style.cursor = 'default';
    highlighter.style.display = 'none';
  }

  // Handle mouse over during inspection
  function handleMouseOver(e) {
    if (!isInspecting) return;
    
    const element = e.target;
    if (element === panel || panel.contains(element)) return;
    
    const rect = element.getBoundingClientRect();
    highlighter.style.width = rect.width + 'px';
    highlighter.style.height = rect.height + 'px';
    highlighter.style.top = rect.top + window.scrollY + 'px';
    highlighter.style.left = rect.left + window.scrollX + 'px';
    highlighter.style.display = 'block';
  }

  // Handle click during inspection
  function handleClick(e) {
    if (!isInspecting) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    if (element === panel || panel.contains(element)) return;
    
    selectElement(element);
    stopInspection();
  }

  // Handle key down during inspection
  function handleKeyDown(e) {
    if (e.key === 'Escape' && isInspecting) {
      stopInspection();
    }
  }

  // Select an element and display its information
  function selectElement(element) {
    selectedElement = element;
    
    // Get element path
    const path = getElementPath(element);
    document.getElementById('element-path').textContent = path;
    
    // Get element tag
    document.getElementById('element-tag').textContent = `<${element.tagName.toLowerCase()}>`;
    
    // Get applied classes
    const classes = Array.from(element.classList).filter(cls => cls.trim() !== '');
    displayAppliedClasses(classes);
    
    // Show element info
    document.getElementById('element-info').style.display = 'block';
    document.getElementById('applied-classes').style.display = 'block';
    
    // Generate suggestions
    generateSuggestions(classes);
  }

  // Get element path for display
  function getElementPath(element) {
    const path = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += '#' + current.id;
      } else if (current.className) {
        const classes = Array.from(current.classList).filter(cls => cls.trim() !== '');
        if (classes.length > 0) {
          selector += '.' + classes.slice(0, 2).join('.');
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }

  // Display applied classes with alternatives button
  function displayAppliedClasses(classes) {
    const classesList = document.getElementById('classes-list');
    classesList.innerHTML = '';
    
    classes.forEach(cls => {
      const classItem = document.createElement('div');
      classItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        margin-bottom: 6px;
        background-color: #f8fafc;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      classItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f1f5f9';
        this.style.borderColor = '#3B82F6';
      });
      
      classItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f8fafc';
        this.style.borderColor = '#e2e8f0';
      });
      
      const className = document.createElement('span');
      className.style.cssText = `
        font-family: monospace;
        font-size: 13px;
        font-weight: 500;
        color: #111827;
      `;
      className.textContent = cls;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.style.cssText = 'display: flex; gap: 4px; align-items: center;';
      
      // Alternatives button
      const alternativesButton = document.createElement('button');
      alternativesButton.style.cssText = `
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      alternativesButton.textContent = 'Alt';
      alternativesButton.title = 'Show alternatives';
      
      alternativesButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openClassAlternativesModal(cls);
      });
      
      // Remove button
      const removeButton = document.createElement('button');
      removeButton.style.cssText = `
        background: #EF4444;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 6px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      removeButton.innerHTML = '×';
      removeButton.title = 'Remove class';
      
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeClass(cls);
      });
      
      actionsDiv.appendChild(alternativesButton);
      actionsDiv.appendChild(removeButton);
      
      classItem.appendChild(className);
      classItem.appendChild(actionsDiv);
      classesList.appendChild(classItem);
    });
  }

  // Open class alternatives modal
  function openClassAlternativesModal(className) {
    const modal = document.getElementById('class-alternatives-modal');
    const modalClassName = document.getElementById('modal-class-name');
    const alternativesGrid = document.getElementById('alternatives-grid');
    
    modalClassName.textContent = className;
    
    // Generate alternatives
    const alternatives = generateClassAlternatives(className);
    
    alternativesGrid.innerHTML = alternatives.map(alt => `
      <div class="alternative-item" data-class="${alt}" style="
        padding: 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-family: monospace;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      ">${alt}</div>
    `).join('');
    
    // Add click handlers for alternatives
    alternativesGrid.querySelectorAll('.alternative-item').forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#e0f2fe';
        this.style.borderColor = '#3B82F6';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f8fafc';
        this.style.borderColor = '#e2e8f0';
      });
      
      item.addEventListener('click', function() {
        const newClass = this.dataset.class;
        replaceClass(className, newClass);
        modal.style.display = 'none';
      });
    });
    
    modal.style.display = 'flex';
  }

  // Generate class alternatives
  function generateClassAlternatives(className) {
    const alternatives = [];
    
    // Parse class to understand its type
    if (className.startsWith('p-')) {
      // Padding alternatives
      const value = className.split('-')[1];
      const baseValues = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
      baseValues.forEach(val => {
        if (val !== value) {
          alternatives.push(`p-${val}`);
        }
      });
    } else if (className.startsWith('m-')) {
      // Margin alternatives
      const value = className.split('-')[1];
      const baseValues = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
      baseValues.forEach(val => {
        if (val !== value) {
          alternatives.push(`m-${val}`);
        }
      });
    } else if (className.startsWith('bg-')) {
      // Background color alternatives
      const parts = className.split('-');
      if (parts.length >= 3) {
        const color = parts[1];
        const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
        shades.forEach(shade => {
          alternatives.push(`bg-${color}-${shade}`);
        });
      }
      // Different colors
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray'];
      colors.forEach(color => {
        alternatives.push(`bg-${color}-500`);
      });
    } else if (className.startsWith('text-')) {
      // Text color alternatives
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray', 'black', 'white'];
      colors.forEach(color => {
        alternatives.push(`text-${color}-500`);
      });
    } else if (className.startsWith('rounded')) {
      // Border radius alternatives
      const sizes = ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'];
      alternatives.push(...sizes.filter(s => s !== className));
    } else if (className.startsWith('shadow')) {
      // Shadow alternatives
      const sizes = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
      alternatives.push(...sizes.filter(s => s !== className));
    }
    
    return alternatives.slice(0, 12); // Limit to 12 alternatives
  }

  // Replace a class with another
  function replaceClass(oldClass, newClass) {
    if (!selectedElement) return;
    
    selectedElement.classList.remove(oldClass);
    selectedElement.classList.add(newClass);
    
    const classes = Array.from(selectedElement.classList);
    displayAppliedClasses(classes);
    generateSuggestions(classes);
  }

  // Remove a class from the selected element
  function removeClass(className) {
    if (!selectedElement) return;
    
    selectedElement.classList.remove(className);
    const classes = Array.from(selectedElement.classList);
    displayAppliedClasses(classes);
    generateSuggestions(classes);
  }

  // Add a class to the selected element
  function addClass(className) {
    if (!selectedElement) return;
    
    selectedElement.classList.add(className);
    const classes = Array.from(selectedElement.classList);
    displayAppliedClasses(classes);
    generateSuggestions(classes);
  }

  // Generate class suggestions
  function generateSuggestions(classes) {
    const suggestions = [
      'p-4', 'p-6', 'm-4', 'bg-blue-500', 'text-white', 'rounded-lg', 'shadow-md', 'font-semibold', 'flex', 'hidden'
    ];
    
    // Filter out already applied classes
    const filteredSuggestions = suggestions.filter(suggestion => !classes.includes(suggestion));
    
    // Display suggestions
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    
    filteredSuggestions.slice(0, 6).forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.style.cssText = `
        padding: 8px 12px;
        margin-bottom: 4px;
        background-color: #f3f4f6;
        border-radius: 6px;
        font-family: monospace;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #e5e7eb;
      `;
      suggestionItem.textContent = suggestion;
      
      suggestionItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#e0f2fe';
        this.style.borderColor = '#3B82F6';
      });
      
      suggestionItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f3f4f6';
        this.style.borderColor = '#e5e7eb';
      });
      
      suggestionItem.addEventListener('click', () => {
        addClass(suggestion);
      });
      
      suggestionsList.appendChild(suggestionItem);
    });
    
    document.getElementById('suggestions').style.display = 'block';
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }

})(); // End of IIFE