import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ColorPicker from './ColorPicker';
import SpacingCalculator from './SpacingCalculator';
import AnimationPreview from './AnimationPreview';
import ResponsivePreviewer from './ResponsivePreviewer';
import AccessibilityChecker from './AccessibilityChecker';
import ComponentTemplateLibrary from './ComponentTemplateLibrary';
import SettingsManager from './SettingsManager';

interface ExtensionPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ElementInfo {
  tagName: string;
  classes: string[];
  path: string;
}

const ExtensionPanel: React.FC<ExtensionPanelProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('inspector');
  const [designTool, setDesignTool] = useState('color');
  const [elementInfo, setElementInfo] = useState<ElementInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Animation for panel opening/closing
  useEffect(() => {
    if (panelRef.current) {
      if (isVisible) {
        gsap.fromTo(panelRef.current, 
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(panelRef.current, {
          x: '100%',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: onClose
        });
      }
    }
  }, [isVisible, onClose]);

  // Mock function to simulate element inspection
  const inspectElement = () => {
    // This would be replaced with actual DOM inspection logic
    setElementInfo({
      tagName: 'div',
      classes: ['p-4', 'bg-blue-500', 'text-white', 'rounded-lg'],
      path: 'body > div.container > div.card'
    });
    
    // Generate some mock suggestions
    setSuggestions(['p-6', 'bg-blue-600', 'text-blue-100', 'shadow-lg']);
  };

  // Handle class addition
  const addClass = (className: string) => {
    if (elementInfo) {
      setElementInfo({
        ...elementInfo,
        classes: [...elementInfo.classes, className]
      });
    }
  };

  // Handle class removal
  const removeClass = (className: string) => {
    if (elementInfo) {
      setElementInfo({
        ...elementInfo,
        classes: elementInfo.classes.filter(c => c !== className)
      });
    }
  };

  // Filter suggestions based on search query
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      ref={panelRef}
      className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          <h1 className="text-lg font-bold">Tailwind CSS Tools</h1>
        </div>
        <button 
          onClick={() => gsap.to(panelRef.current, { 
            x: '100%', 
            opacity: 0, 
            duration: 0.3, 
            ease: 'power2.in',
            onComplete: onClose 
          })}
          className="p-1 rounded hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Element Info */}
      {elementInfo && (
        <div className="p-4 border-b">
          <div className="text-sm text-gray-500 mb-1">{elementInfo.path}</div>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">
            <{elementInfo.tagName}>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {['inspector', 'design', 'responsive', 'accessibility', 'templates', 'settings'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'templates' ? 'Component Library' : tab === 'settings' ? 'Settings' : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            <button
              onClick={inspectElement}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Inspect Element
            </button>

            {elementInfo && (
              <>
                <div>
                  <h3 className="font-medium mb-2">Applied Classes</h3>
                  <div className="space-y-1">
                    {elementInfo.classes.map((className) => (
                      <div 
                        key={className}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <span className="font-mono text-sm">{className}</span>
                        <button
                          onClick={() => removeClass(className)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Add Class</h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search classes..."
                      className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-gray-200 px-3 rounded-r hover:bg-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {filteredSuggestions.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Suggestions</h3>
                    <div className="space-y-1">
                      {filteredSuggestions.map((suggestion) => (
                        <div
                          key={suggestion}
                          className="p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                          onClick={() => addClass(suggestion)}
                        >
                          <span className="font-mono text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-4">
            <h3 className="font-medium">Visual Design Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDesignTool('color')}
                className={`p-3 border rounded flex flex-col items-center ${
                  designTool === 'color' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="text-xs">Color</span>
              </button>
              <button
                onClick={() => setDesignTool('spacing')}
                className={`p-3 border rounded flex flex-col items-center ${
                  designTool === 'spacing' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                </svg>
                <span className="text-xs">Spacing</span>
              </button>
              <button
                onClick={() => setDesignTool('animation')}
                className={`p-3 border rounded flex flex-col items-center ${
                  designTool === 'animation' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">Animation</span>
              </button>
            </div>

            {designTool === 'color' && (
              <ColorPicker
                onColorSelect={(colorClass) => {
                  if (elementInfo) {
                    setElementInfo({
                      ...elementInfo,
                      classes: [...elementInfo.classes, colorClass]
                    });
                  }
                }}
              />
            )}

            {designTool === 'spacing' && (
              <SpacingCalculator
                onSpacingChange={(spacingClass) => {
                  if (elementInfo) {
                    setElementInfo({
                      ...elementInfo,
                      classes: [...elementInfo.classes, spacingClass]
                    });
                  }
                }}
              />
            )}

            {designTool === 'animation' && (
              <AnimationPreview
                onAnimationSelect={(animationClass) => {
                  if (elementInfo) {
                    setElementInfo({
                      ...elementInfo,
                      classes: [...elementInfo.classes, animationClass]
                    });
                  }
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'responsive' && (
          <ResponsivePreviewer
            onBreakpointSelect={(breakpointClass) => {
              // This would be used to apply responsive classes to the selected element
              console.log('Selected breakpoint:', breakpointClass);
            }}
          />
        )}

        {activeTab === 'accessibility' && (
          <AccessibilityChecker
            onFixApply={(fix) => {
              if (elementInfo) {
                setElementInfo({
                  ...elementInfo,
                  classes: [...elementInfo.classes, fix]
                });
              }
            }}
          />
        )}

        {activeTab === 'templates' && (
          <ComponentTemplateLibrary
            onTemplateSelect={(html, classes) => {
              // This would be used to insert the template HTML and apply classes
              console.log('Template selected:', html, classes);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ExtensionPanel;