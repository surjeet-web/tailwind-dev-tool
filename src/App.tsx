import React, { useState } from 'react';
import ExtensionPanel from './components/ExtensionPanel';

const App: React.FC = () => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const closePanel = () => {
    setIsPanelVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar button to open the extension */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={togglePanel}
          className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      </div>

      {/* Demo content to inspect */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Tailwind CSS Developer Tools</h1>
            <p className="text-gray-600 mb-6">
              This is a demo page for the Tailwind CSS Developer Tools extension. Click the blue button in the top-right corner to open the extension panel, then click "Inspect Element" to see how it works.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">Features</h2>
                <ul className="list-disc pl-5 space-y-1 text-blue-700">
                  <li>Element Inspector</li>
                  <li>Live Class Editing</li>
                  <li>Class Search & Preview</li>
                  <li>Visual Design Tools</li>
                  <li>Responsive Breakpoint Preview</li>
                  <li>Accessibility Checker</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Benefits</h2>
                <ul className="list-disc pl-5 space-y-1 text-green-700">
                  <li>Faster development workflow</li>
                  <li>Improved understanding of Tailwind CSS</li>
                  <li>Better accessibility compliance</li>
                  <li>Seamless integration with existing tools</li>
                  <li>Enhanced productivity</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Try It Out</h3>
              <p className="text-gray-600 mb-4">
                Open the extension panel and click "Inspect Element". Then try adding, removing, or modifying Tailwind classes to see the changes in real-time.
              </p>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            <p>Tailwind CSS Developer Tools Extension Demo</p>
          </div>
        </div>
      </div>

      {/* Extension Panel */}
      <ExtensionPanel isVisible={isPanelVisible} onClose={closePanel} />
    </div>
  );
};

export default App;