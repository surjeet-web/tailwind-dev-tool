// Simple popup implementation without React for now
document.addEventListener('DOMContentLoaded', () => {
  console.log('Tailwind CSS Developer Tools extension loaded');
  
  // Create popup UI
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="p-4">
      <h1 class="text-lg font-semibold mb-4">Tailwind CSS Developer Tools</h1>
      <div class="space-y-4">
        <button id="open-panel" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Open Panel
        </button>
        <button id="inspect-element" class="w-full p-2 bg-gray-200 rounded hover:bg-gray-300">
          Inspect Element
        </button>
      </div>
    </div>
  `;
  
  // Set up event listeners
  document.getElementById('open-panel').addEventListener('click', () => {
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
  });
  
  document.getElementById('inspect-element').addEventListener('click', () => {
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
  });
  
  // Set up communication with background script
  function sendMessageToBackground(message) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to background:', chrome.runtime.lastError);
            resolve(null);
          } else {
            resolve(response);
          }
        });
      } catch (err) {
        console.error('Exception sending message to background:', err);
        resolve(null);
      }
    });
  }
  
  // Example of sending a message to background script
  async function exampleBackgroundCommunication() {
    try {
      const response = await sendMessageToBackground({ action: 'getExtensionData' });
      console.log('Response from background:', response);
    } catch (err) {
      console.error('Error in background communication:', err);
    }
  }
  
  // Set up communication with content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'inspectElement') {
      // Handle element inspection from content script
      console.log('Element inspection requested:', request.element);
      sendResponse({ success: true });
    }
    return true; // Indicates async response
  });
  
  // Initialize extension
  exampleBackgroundCommunication();
});