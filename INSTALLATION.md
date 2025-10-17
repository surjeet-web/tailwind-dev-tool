# Installation Guide for Tailwind CSS Developer Tools Extension

## Prerequisites
- Google Chrome browser (version 88 or higher)
- The extension files from this repository

## Installation Steps

### Method 1: Using Chrome's Developer Mode

1. **Download or clone this repository**
   - If you haven't already, download all the extension files to a local folder.

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/` in the address bar
   - Enable "Developer mode" using the toggle in the top right corner

3. **Load the Extension**
   - Click the "Load unpacked" button that appears
   - Navigate to and select the folder containing the extension files
   - Click "Select Folder"

4. **Verify Installation**
   - The extension should now appear in your extensions list
   - Look for the Tailwind CSS Developer Tools icon in your Chrome toolbar

### Method 2: Packing and Installing (Advanced)

1. **Pack the Extension**
   - In the Chrome Extensions page (`chrome://extensions/`)
   - With Developer mode enabled, click "Pack extension"
   - Browse to the extension directory and click "Pack extension"
   - This will create a `.crx` file

2. **Install the Packed Extension**
   - Drag the `.crx` file onto the Chrome Extensions page
   - Confirm the installation when prompted

## Testing the Extension

### Basic Functionality Test

1. **Open the Extension**
   - Click the extension icon in your Chrome toolbar
   - A simple popup should appear with "Open Panel" and "Inspect Element" buttons

2. **Test the Panel**
   - Click "Open Panel" to open the extension panel
   - The panel should slide in from the right side of the page
   - Try closing the panel using the X button in the top right

3. **Test Element Inspection**
   - Click "Inspect Element" in the popup
   - Move your cursor over elements on the page
   - Elements should be highlighted with a blue border
   - Click on an element to select it
   - The element's information should appear in the panel

### Troubleshooting Common Issues

#### Issue: "Service worker registration failed. Status code: 15"
- **Solution**: This is usually due to a syntax error in the background.js file. Make sure all files are correctly saved and there are no syntax errors.

#### Issue: "Cannot read properties of undefined (reading 'onCommand')"
- **Solution**: This error occurs when the chrome.commands API is not available. The updated background.js file includes a check for this API.

#### Issue: Content Security Policy errors
- **Solution**: The updated popup.html file uses inline CSS instead of external CDN links to avoid CSP violations.

#### Issue: "Uncaught SyntaxError: Unexpected token '<'"
- **Solution**: This usually happens when trying to use JSX syntax in a non-React environment. The updated popup.js file uses plain JavaScript instead of React.

#### Issue: Extension doesn't appear in the toolbar
- **Solution**: 
  1. Make sure Developer mode is enabled
  2. Check that the extension was loaded correctly
  3. Try reloading the extension by clicking the reload button on the extension card

#### Issue: Panel doesn't open or close properly
- **Solution**: The updated content.js file uses CSS transitions instead of GSAP for animations, which should resolve any animation-related issues.

## Advanced Testing

### Testing Keyboard Shortcuts
1. Go to `chrome://extensions/shortcuts` in Chrome
2. Look for the Tailwind CSS Developer Tools extension
3. Verify that the shortcuts are set up correctly
4. Try using the shortcuts on a webpage

### Testing Context Menu
1. Right-click on any element in a webpage
2. Look for "Inspect with Tailwind Tools" in the context menu
3. Click it to test the context menu functionality

### Testing on Different Websites
1. Try the extension on various websites, especially those using Tailwind CSS
2. Test on both simple and complex web pages
3. Verify that the extension works correctly on responsive designs

## Getting Help

If you encounter any issues not covered in this guide:

1. Check the browser console for error messages:
   - Right-click on the page and select "Inspect"
   - Go to the Console tab
   - Look for any red error messages

2. Check the extension's background page console:
   - Go to `chrome://extensions/`
   - Find the Tailwind CSS Developer Tools extension
   - Click on "service worker" or "background page"
   - Check the console for any error messages

3. Review the extension files for any syntax errors or missing dependencies

## Next Steps

Once the extension is working correctly, you can:

1. Explore all the features in the extension panel
2. Customize the settings to your preference
3. Provide feedback or report any issues
4. Consider contributing to the project if you find ways to improve it