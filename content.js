// Content script for Tailwind CSS Developer Tools extension

// Global variables
let highlighter;
let panel;
let selectedElement = null;
let isInspecting = false;

// Simple animation implementation without GSAP
function animateElement(element, properties, duration = 300) {
  const start = performance.now();
  const initialStyles = {};
  
  // Store initial styles
  for (const prop in properties) {
    initialStyles[prop] = element.style[prop] || window.getComputedStyle(element)[prop];
  }
  
  function update() {
    const elapsed = performance.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Apply interpolated styles
    for (const prop in properties) {
      const startValue = parseFloat(initialStyles[prop]) || 0;
      const endValue = parseFloat(properties[prop]);
      const currentValue = startValue + (endValue - startValue) * progress;
      
      if (prop === 'opacity') {
        element.style[prop] = currentValue;
      } else {
        element.style[prop] = currentValue + 'px';
      }
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Create element highlighter
function createHighlighter() {
  const highlighterElement = document.createElement('div');
  highlighterElement.className = 'element-highlighter';
  highlighterElement.style.display = 'none';
  document.body.appendChild(highlighterElement);
  return highlighterElement;
}

// Create floating panel for extension
function createFloatingPanel() {
  const panelElement = document.createElement('div');
  panelElement.id = 'tailwind-tools-panel';
  panelElement.style.position = 'fixed';
  panelElement.style.top = '0';
  panelElement.style.right = '0';
  panelElement.style.width = '420px';
  panelElement.style.height = '100vh';
  panelElement.style.backgroundColor = 'white';
  panelElement.style.boxShadow = '-4px 0 24px rgba(0, 0, 0, 0.15)';
  panelElement.style.zIndex = '99999';
  panelElement.style.display = 'none';
  panelElement.style.overflow = 'hidden';
  panelElement.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
  panelElement.style.transform = 'translateX(100%)';
  panelElement.style.opacity = '0';
  panelElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  panelElement.style.backdropFilter = 'blur(8px)';
  panelElement.style.borderLeft = '1px solid rgba(0, 0, 0, 0.1)';

  // Make panel draggable
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target.id === 'panel-drag-handle' || e.target.classList.contains('panel-drag-handle')) {
      isDragging = true;
      panelElement.style.cursor = 'grabbing';
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    panelElement.style.cursor = 'default';

    // Save position to localStorage
    localStorage.setItem('tailwind-panel-x', xOffset);
    localStorage.setItem('tailwind-panel-y', yOffset);
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;

      // Keep panel within viewport bounds
      const maxX = window.innerWidth - panelElement.offsetWidth;
      const maxY = window.innerHeight - 50; // Leave space for close button

      xOffset = Math.max(0, Math.min(xOffset, maxX));
      yOffset = Math.max(0, Math.min(yOffset, maxY));

      setTranslate(xOffset, yOffset, panelElement);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }

  // Load saved position
  const savedX = localStorage.getItem('tailwind-panel-x');
  const savedY = localStorage.getItem('tailwind-panel-y');
  if (savedX && savedY) {
    xOffset = parseInt(savedX);
    yOffset = parseInt(savedY);
    setTranslate(xOffset, yOffset, panelElement);
  }

  // Add panel content with enhanced UI
  panelElement.innerHTML = `
    <!-- Panel Header with Drag Handle -->
    <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f8fafc, #f1f5f9); cursor: grab;" id="panel-drag-handle">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B82F6, #2563EB); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
          </div>
          <div>
            <h1 style="margin: 0; font-size: 16px; font-weight: bold; color: #111827;">Tailwind CSS Tools</h1>
            <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">v2.0</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <!-- Resize Handle -->
          <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: ew-resize; opacity: 0.6; border-radius: 4px; flex-shrink: 0;" class="panel-resize-handle" title="Resize panel">
            <svg width="16" height="16" fill="#6B7280" viewBox="0 0 24 24">
              <path d="M10 20v-6H6v6H4v-8h6v2H8v4h2zm2-12v6h4V8h2V4h-6v2h2v4h-2z"/>
            </svg>
          </div>
          <button id="close-panel" style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; opacity: 0.8; transition: all 0.2s;">
            <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Panel Content -->
    <div style="height: calc(100% - 65px); display: flex; flex-direction: column;">
      <!-- Inspector Section -->
      <div style="padding: 16px; flex: 1; overflow-y: auto;">
        <button id="inspect-element" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 16px; font-weight: 500; transition: all 0.2s; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);">
          <svg width="16" height="16" fill="white" viewBox="0 0 24 24" style="margin-right: 8px;">
            <path d="M12 15v4l-8-8 8-8v4h8a4 4 0 01-8 0z"/>
          </svg>
          Inspect Element
        </button>

        <div id="element-info" style="display: none; margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; color: #6B7280; margin-bottom: 6px; font-weight: 500;" id="element-path"></div>
          <div style="font-family: monospace; font-size: 13px; background-color: #f1f5f9; padding: 8px; border-radius: 4px; color: #111827;" id="element-tag"></div>
        </div>

        <div id="applied-classes" style="display: none; margin-bottom: 16px;">
          <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">Applied Classes</h3>
            <span style="font-size: 11px; color: #6B7280; background: #f1f5f9; padding: 2px 6px; border-radius: 3px;">Click to explore alternatives</span>
          </div>
          <div id="classes-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
        </div>

        <div style="margin-bottom: 16px;">
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #111827;">Add Class</h3>
          <div style="display: flex; border-radius: 8px; overflow: hidden; border: 1px solid #d1d5db;">
            <input type="text" id="class-search" placeholder="Search 500+ Tailwind classes..." style="flex: 1; padding: 10px; border: none; outline: none; font-size: 13px;">
            <button id="search-button" style="padding: 10px 12px; background-color: #f8fafc; border: none; cursor: pointer; transition: background 0.2s;">
              <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div id="suggestions" style="display: none;">
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #111827;">Smart Suggestions</h3>
          <div id="suggestions-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div style="border-top: 1px solid #e5e7eb; background: #fafafa;">
        <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
          <button class="tab-button" data-tab="inspector" style="flex: 1; padding: 12px 8px; font-size: 12px; font-weight: 500; color: #6B7280; background: none; border: none; cursor: pointer; position: relative; transition: all 0.2s;">
            Inspector
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #3B82F6; transform: scaleX(0); transition: transform 0.2s;"></div>
          </button>
          <button class="tab-button" data-tab="design" style="flex: 1; padding: 12px 8px; font-size: 12px; font-weight: 500; color: #6B7280; background: none; border: none; cursor: pointer; position: relative; transition: all 0.2s;">
            Design
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #3B82F6; transform: scaleX(0); transition: transform 0.2s;"></div>
          </button>
          <button class="tab-button" data-tab="responsive" style="flex: 1; padding: 12px 8px; font-size: 12px; font-weight: 500; color: #6B7280; background: none; border: none; cursor: pointer; position: relative; transition: all 0.2s;">
            Responsive
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #3B82F6; transform: scaleX(0); transition: transform 0.2s;"></div>
          </button>
          <button class="tab-button" data-tab="accessibility" style="flex: 1; padding: 12px 8px; font-size: 12px; font-weight: 500; color: #6B7280; background: none; border: none; cursor: pointer; position: relative; transition: all 0.2s;">
            Accessibility
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #3B82F6; transform: scaleX(0); transition: transform 0.2s;"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Class Alternatives Modal -->
    <div id="class-alternatives-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 100000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 14px; font-weight: 600; color: #111827;">
              Alternatives for <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-size: 12px;">p-4</code>
            </h3>
            <button id="close-alternatives-modal" style="background: none; border: none; cursor: pointer; padding: 4px;">
              <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div style="padding: 16px;">
          <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; max-height: 400px; overflow-y: auto;">
            <!-- Alternatives will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for drag functionality
  panelElement.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  document.body.appendChild(panelElement);
  return panelElement;
}

// Initialize extension
function initializeExtension() {
  // Check if we're on a chrome:// URL
  if (window.location.protocol === 'chrome:') {
    console.log('Extension cannot run on chrome:// URLs');
    return;
  }

  // Create UI elements
  highlighter = createHighlighter();
  panel = createFloatingPanel();

  // Set up event listeners
  setupEventListeners();

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'togglePanel') {
        togglePanel();
        sendResponse({ success: true });
      } else if (request.action === 'inspectElement') {
        startInspection();
        sendResponse({ success: true });
      } else if (request.action === 'inspectElementAtCoords') {
        // Handle element inspection at specific coordinates
        const element = document.elementFromPoint(request.x, request.y);
        if (element && element !== panel && !panel.contains(element)) {
          selectElement(element);
        }
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

  // Search button
  const searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchInput = document.getElementById('class-search');
      if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
          console.log('Searching for class:', query);
          // You can add search functionality here
        }
      }
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

  // Tab buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Design tool buttons
  const designToolButtons = document.querySelectorAll('.design-tool-button');
  designToolButtons.forEach(button => {
    button.addEventListener('click', () => {
      const toolName = button.getAttribute('data-tool');
      switchDesignTool(toolName);
    });
  });

  // Color swatches
  const colorSwatches = document.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      applyColor(color);
    });
  });

  // Spacing sliders
  const spacingSliders = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'gap'];
  spacingSliders.forEach(sliderId => {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(sliderId + '-value');

    if (slider && valueDisplay) {
      slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value + 'px';
        applySpacing();
      });
    }
  });

  // Animation buttons
  const animationButtons = document.querySelectorAll('.animation-button');
  animationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const animation = button.getAttribute('data-animation');
      previewAnimation(animation);
    });
  });

  // Breakpoint buttons
  const breakpointButtons = document.querySelectorAll('.breakpoint-button');
  breakpointButtons.forEach(button => {
    button.addEventListener('click', () => {
      const breakpoint = button.getAttribute('data-breakpoint');
      applyBreakpoint(breakpoint);
    });
  });

  // Scan accessibility button
  const scanButton = document.getElementById('scan-accessibility');
  if (scanButton) {
    scanButton.addEventListener('click', scanAccessibility);
  }

  // Mouse events for element inspection
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);
}

// Toggle panel visibility
function togglePanel() {
  if (panel.style.display === 'none' || panel.style.display === '') {
    // Show panel first
    panel.style.display = 'block';

    // Force a reflow to ensure display:block is applied
    panel.offsetHeight;

    // Apply entrance animation
    panel.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    requestAnimationFrame(() => {
      panel.style.transform = 'translateX(0)';
      panel.style.opacity = '1';
    });
  } else {
    // Apply exit animation
    panel.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
    panel.style.transform = 'translateX(100%)';
    panel.style.opacity = '0';

    setTimeout(() => {
      panel.style.display = 'none';
      panel.style.transition = '';
      panel.style.transform = '';
      panel.style.opacity = '';
      stopInspection();
    }, 300);
  }
}

// Start element inspection
function startInspection() {
  isInspecting = true;
  document.getElementById('inspect-element').textContent = 'Stop Inspecting';
  document.body.style.cursor = 'crosshair';
}

// Stop element inspection
function stopInspection() {
  isInspecting = false;
  document.getElementById('inspect-element').textContent = 'Inspect Element';
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
  highlighter.setAttribute('data-element-tag', element.tagName.toLowerCase());
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
  } else if (e.key === 'm' && !isInspecting) {
    // Toggle panel with 'm' key
    togglePanel();
  } else if (e.key === 'n' && !isInspecting) {
    // Start inspection with 'n' key
    startInspection();
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
  const classes = element.className.split(' ').filter(cls => cls.trim() !== '');
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
      selector += '.' + current.className.split(' ').filter(cls => cls.trim() !== '').join('.');
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

// Display applied classes
function displayAppliedClasses(classes) {
  const classesList = document.getElementById('classes-list');
  classesList.innerHTML = '';
  
  classes.forEach(cls => {
    const classItem = document.createElement('div');
    classItem.style.display = 'flex';
    classItem.style.justifyContent = 'space-between';
    classItem.style.alignItems = 'center';
    classItem.style.padding = '8px';
    classItem.style.marginBottom = '4px';
    classItem.style.backgroundColor = '#f3f4f6';
    classItem.style.borderRadius = '4px';
    
    const className = document.createElement('span');
    className.style.fontFamily = 'monospace';
    className.style.fontSize = '14px';
    className.textContent = cls;
    
    const removeButton = document.createElement('button');
    removeButton.style.background = 'none';
    removeButton.style.border = 'none';
    removeButton.style.cursor = 'pointer';
    removeButton.style.color = '#6B7280';
    removeButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    `;
    
    removeButton.addEventListener('click', () => {
      removeClass(cls);
    });
    
    classItem.appendChild(className);
    classItem.appendChild(removeButton);
    classesList.appendChild(classItem);
  });
}

// Remove a class from the selected element
function removeClass(className) {
  if (!selectedElement) return;
  
  selectedElement.classList.remove(className);
  const classes = Array.from(selectedElement.classList);
  displayAppliedClasses(classes);
  generateSuggestions(classes);
}

// Generate class suggestions
function generateSuggestions(classes) {
  // This is a simplified version - in a real extension, you would have a more sophisticated algorithm
  const suggestions = [
    'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20', 'p-24',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-16', 'm-20', 'm-24',
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'text-red-500', 'text-orange-500', 'text-amber-500', 'text-yellow-500', 'text-lime-500', 'text-green-500',
    'text-emerald-500', 'text-teal-500', 'text-cyan-500', 'text-sky-500', 'text-blue-500', 'text-indigo-500',
    'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl',
    'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
    'border', 'border-2', 'border-4',
    'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'
  ];
  
  // Filter out already applied classes
  const filteredSuggestions = suggestions.filter(suggestion => !classes.includes(suggestion));
  
  // Display suggestions
  const suggestionsList = document.getElementById('suggestions-list');
  suggestionsList.innerHTML = '';
  
  filteredSuggestions.slice(0, 8).forEach(suggestion => {
    const suggestionItem = document.createElement('div');
    suggestionItem.style.padding = '8px';
    suggestionItem.style.marginBottom = '4px';
    suggestionItem.style.backgroundColor = '#f3f4f6';
    suggestionItem.style.borderRadius = '4px';
    suggestionItem.style.fontFamily = 'monospace';
    suggestionItem.style.fontSize = '14px';
    suggestionItem.style.cursor = 'pointer';
    suggestionItem.textContent = suggestion;
    
    suggestionItem.addEventListener('click', () => {
      addClass(suggestion);
    });
    
    suggestionsList.appendChild(suggestionItem);
  });
  
  document.getElementById('suggestions').style.display = 'block';
}

// Add a class to the selected element
function addClass(className) {
  if (!selectedElement) return;
  
  selectedElement.classList.add(className);
  const classes = Array.from(selectedElement.classList);
  displayAppliedClasses(classes);
  generateSuggestions(classes);
}

// Switch tab
function switchTab(tabName) {
  // Update tab buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    if (button.getAttribute('data-tab') === tabName) {
      button.style.color = '#3B82F6';
      button.style.borderBottom = '2px solid #3B82F6';
    } else {
      button.style.color = '#6B7280';
      button.style.borderBottom = 'none';
    }
  });
  
  // Update tab content
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    if (content.id === tabName + '-tab') {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
}

// Switch design tool
function switchDesignTool(toolName) {
  // Update tool buttons
  const toolButtons = document.querySelectorAll('.design-tool-button');
  toolButtons.forEach(button => {
    if (button.getAttribute('data-tool') === toolName) {
      button.style.borderColor = '#3B82F6';
      button.style.backgroundColor = '#EFF6FF';
    } else {
      button.style.borderColor = '#e5e7eb';
      button.style.backgroundColor = 'transparent';
    }
  });
  
  // Update tool content
  const tools = document.querySelectorAll('.design-tool');
  tools.forEach(tool => {
    if (tool.id === toolName + '-tool') {
      tool.style.display = 'block';
    } else {
      tool.style.display = 'none';
    }
  });
}

// Apply color to selected element
function applyColor(color) {
  if (!selectedElement) return;
  
  // Remove existing color classes of the same type
  const colorType = color.split('-')[0]; // 'bg', 'text', 'border'
  const existingColors = Array.from(selectedElement.classList).filter(cls => cls.startsWith(colorType));
  existingColors.forEach(cls => selectedElement.classList.remove(cls));
  
  // Add new color class
  selectedElement.classList.add(color);
  
  // Update displayed classes
  const classes = Array.from(selectedElement.classList);
  displayAppliedClasses(classes);
  generateSuggestions(classes);
}

// Apply spacing to selected element
function applySpacing() {
  if (!selectedElement) return;
  
  // Get spacing values
  const marginTop = document.getElementById('margin-top').value;
  const marginRight = document.getElementById('margin-right').value;
  const marginBottom = document.getElementById('margin-bottom').value;
  const marginLeft = document.getElementById('margin-left').value;
  const paddingTop = document.getElementById('padding-top').value;
  const paddingRight = document.getElementById('padding-right').value;
  const paddingBottom = document.getElementById('padding-bottom').value;
  const paddingLeft = document.getElementById('padding-left').value;
  const gap = document.getElementById('gap').value;
  
  // Remove existing spacing classes
  const existingSpacing = Array.from(selectedElement.classList).filter(cls => 
    cls.startsWith('m-') || cls.startsWith('p-') || cls.startsWith('gap-')
  );
  existingSpacing.forEach(cls => selectedElement.classList.remove(cls));
  
  // Add new spacing classes
  if (marginTop > 0) selectedElement.classList.add(`mt-${marginTop}`);
  if (marginRight > 0) selectedElement.classList.add(`mr-${marginRight}`);
  if (marginBottom > 0) selectedElement.classList.add(`mb-${marginBottom}`);
  if (marginLeft > 0) selectedElement.classList.add(`ml-${marginLeft}`);
  if (paddingTop > 0) selectedElement.classList.add(`pt-${paddingTop}`);
  if (paddingRight > 0) selectedElement.classList.add(`pr-${paddingRight}`);
  if (paddingBottom > 0) selectedElement.classList.add(`pb-${paddingBottom}`);
  if (paddingLeft > 0) selectedElement.classList.add(`pl-${paddingLeft}`);
  if (gap > 0) selectedElement.classList.add(`gap-${gap}`);
  
  // Update displayed classes
  const classes = Array.from(selectedElement.classList);
  displayAppliedClasses(classes);
  generateSuggestions(classes);
}

// Preview animation
function previewAnimation(animation) {
  const preview = document.getElementById('animation-preview');
  
  // Remove any existing animation classes
  preview.className = preview.className.split(' ').filter(cls => !cls.startsWith('animate-')).join(' ');
  
  // Add the animation class
  preview.classList.add(animation);
  
  // Remove the animation class after it completes
  setTimeout(() => {
    preview.classList.remove(animation);
  }, 1000);
}

// Apply breakpoint
function applyBreakpoint(breakpoint) {
  const preview = document.getElementById('responsive-preview');
  
  // Set preview size based on breakpoint
  const breakpoints = {
    'sm': { width: '640px', height: '400px' },
    'md': { width: '768px', height: '400px' },
    'lg': { width: '1024px', height: '400px' },
    'xl': { width: '1280px', height: '400px' }
  };
  
  const size = breakpoints[breakpoint];
  preview.style.width = size.width;
  preview.style.height = size.height;
  preview.innerHTML = `<span style="font-size: 14px; color: #6B7280;">Preview at ${breakpoint} breakpoint (${size.width})</span>`;
}

// Scan for accessibility issues
function scanAccessibility() {
  const results = document.getElementById('accessibility-results');
  const issuesList = document.getElementById('accessibility-issues-list');
  const noIssues = document.getElementById('no-accessibility-issues');
  
  // Clear previous results
  issuesList.innerHTML = '';
  
  // Mock accessibility issues for demo
  const issues = [
    {
      type: 'error',
      title: 'Insufficient Color Contrast',
      description: 'The text color does not have enough contrast with the background color.',
      element: 'button.primary'
    },
    {
      type: 'warning',
      title: 'Missing Alt Text',
      description: 'Image is missing alternative text for screen readers.',
      element: 'img.hero-image'
    }
  ];
  
  if (issues.length > 0) {
    // Display issues
    issues.forEach(issue => {
      const issueItem = document.createElement('div');
      issueItem.style.padding = '12px';
      issueItem.style.marginBottom = '8px';
      issueItem.style.borderRadius = '4px';
      
      if (issue.type === 'error') {
        issueItem.style.backgroundColor = '#FEE2E2';
        issueItem.style.border = '1px solid #FECACA';
      } else if (issue.type === 'warning') {
        issueItem.style.backgroundColor = '#FEF3C7';
        issueItem.style.border = '1px solid #FDE68A';
      }
      
      const issueHeader = document.createElement('div');
      issueHeader.style.display = 'flex';
      issueHeader.style.alignItems = 'flex-start';
      issueHeader.style.marginBottom = '8px';
      
      const icon = document.createElement('div');
      icon.style.marginRight = '8px';
      icon.style.flexShrink = '0';
      
      if (issue.type === 'error') {
        icon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: #B91C1C;">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        `;
      } else if (issue.type === 'warning') {
        icon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: #B45309;">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        `;
      }
      
      const issueTitle = document.createElement('div');
      issueTitle.style.fontWeight = '600';
      issueTitle.style.fontSize = '14px';
      issueTitle.textContent = issue.title;
      
      const issueElement = document.createElement('div');
      issueElement.style.fontSize = '12px';
      issueElement.style.padding = '2px 6px';
      issueElement.style.backgroundColor = '#F3F4F6';
      issueElement.style.borderRadius = '4px';
      issueElement.style.fontFamily = 'monospace';
      issueElement.textContent = issue.element;
      
      issueHeader.appendChild(icon);
      issueHeader.appendChild(issueTitle);
      issueHeader.appendChild(issueElement);
      
      const issueDescription = document.createElement('div');
      issueDescription.style.fontSize = '14px';
      issueDescription.style.color = '#4B5563';
      issueDescription.textContent = issue.description;
      
      issueItem.appendChild(issueHeader);
      issueItem.appendChild(issueDescription);
      
      issuesList.appendChild(issueItem);
    });
    
    // Update counts
    const errorCount = issues.filter(issue => issue.type === 'error').length;
    const warningCount = issues.filter(issue => issue.type === 'warning').length;
    
    const countSpans = results.querySelectorAll('span');
    countSpans[0].textContent = `${errorCount} Errors`;
    countSpans[1].textContent = `${warningCount} Warnings`;
    
    results.style.display = 'block';
    noIssues.style.display = 'none';
  } else {
    results.style.display = 'none';
    noIssues.style.display = 'block';
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  // DOMContentLoaded already fired
  initializeExtension();
}