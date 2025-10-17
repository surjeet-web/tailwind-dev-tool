// Background service worker for Tailwind CSS Developer Tools extension

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tailwind CSS Developer Tools extension installed');
  
  // Set up default settings
  chrome.storage.sync.set({
    settings: {
      theme: 'light',
      autoInspect: false,
      showNotifications: true,
      keyboardShortcuts: true
    }
  });
  
  // Create context menu for inspecting elements
  chrome.contextMenus.create({
    id: 'inspect-element',
    title: 'Inspect with Tailwind Tools',
    contexts: ['all']
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getExtensionData') {
    // Return extension data
    sendResponse({
      version: chrome.runtime.getManifest().version,
      name: chrome.runtime.getManifest().name
    });
  } else if (request.action === 'getSettings') {
    // Get user settings
    chrome.storage.sync.get('settings', (data) => {
      sendResponse(data.settings || {});
    });
    return true; // Indicates async response
  } else if (request.action === 'updateSettings') {
    // Update user settings
    chrome.storage.sync.set({ settings: request.settings }, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates async response
  } else if (request.action === 'openPanel') {
    // Open extension panel on the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }).catch(err => {
          console.error('Failed to inject content script:', err);
        });
        
        chrome.scripting.insertCSS({
          target: { tabId: tabs[0].id },
          files: ['content.css']
        }).catch(err => {
          console.error('Failed to inject content CSS:', err);
        });
        
        // Send message to content script to open panel
        chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' }).catch(err => {
          console.error('Failed to send message to content script:', err);
        });
      }
    });
    
    sendResponse({ success: true });
  }
  
  return true;
});

// Handle keyboard shortcuts
if (chrome.commands) {
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-panel') {
      // Open extension panel on the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }).catch(err => {
            console.error('Failed to inject content script:', err);
          });
          
          chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            files: ['content.css']
          }).catch(err => {
            console.error('Failed to inject content CSS:', err);
          });
          
          // Send message to content script to open panel
          chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' }).catch(err => {
            console.error('Failed to send message to content script:', err);
          });
        }
      });
    } else if (command === 'inspect-element') {
      // Start element inspection on the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }).catch(err => {
            console.error('Failed to inject content script:', err);
          });
          
          chrome.scripting.insertCSS({
            target: { tabId: tabs[0].id },
            files: ['content.css']
          }).catch(err => {
            console.error('Failed to inject content CSS:', err);
          });
          
          // Send message to content script to start inspection
          chrome.tabs.sendMessage(tabs[0].id, { action: 'inspectElement' }).catch(err => {
            console.error('Failed to send message to content script:', err);
          });
        }
      });
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'inspect-element') {
    // Check if we're on a chrome:// URL
    if (tab.url && tab.url.startsWith('chrome://')) {
      console.log('Cannot inspect elements on chrome:// URLs');
      return;
    }
    
    // Inject content script if not already injected
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).catch(err => {
      console.error('Failed to inject content script:', err);
    });
    
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content.css']
    }).catch(err => {
      console.error('Failed to inject content CSS:', err);
    });
    
    // Send message to content script to inspect element
    chrome.tabs.sendMessage(tab.id, {
      action: 'inspectElementAtCoords',
      x: info.clientX,
      y: info.clientY
    }).catch(err => {
      console.error('Failed to send message to content script:', err);
    });
  }
});