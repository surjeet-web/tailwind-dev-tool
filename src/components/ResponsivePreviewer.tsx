import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ResponsivePreviewerProps {
  onBreakpointSelect: (breakpointClass: string) => void;
  currentBreakpoint?: string;
}

const ResponsivePreviewer: React.FC<ResponsivePreviewerProps> = ({ onBreakpointSelect, currentBreakpoint }) => {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(currentBreakpoint || 'md');
  const [customWidth, setCustomWidth] = useState(768);
  const [isCustom, setIsCustom] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Tailwind default breakpoints
  const breakpoints = [
    { name: 'xs', width: 0, class: 'sm:', description: 'Extra small' },
    { name: 'sm', width: 640, class: 'sm:', description: 'Small' },
    { name: 'md', width: 768, class: 'md:', description: 'Medium' },
    { name: 'lg', width: 1024, class: 'lg:', description: 'Large' },
    { name: 'xl', width: 1280, class: 'xl:', description: 'Extra large' },
    { name: '2xl', width: 1536, class: '2xl:', description: '2X large' },
  ];

  // Device presets
  const devicePresets = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'MacBook Air', width: 1280, height: 800 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  // Apply breakpoint
  const applyBreakpoint = (breakpoint: string) => {
    setSelectedBreakpoint(breakpoint);
    onBreakpointSelect(breakpoint);
    
    // Animate preview resize
    if (previewRef.current) {
      const bp = breakpoints.find(b => b.name === breakpoint);
      if (bp) {
        gsap.to(previewRef.current, {
          width: bp.width,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  };

  // Apply custom width
  const applyCustomWidth = () => {
    setIsCustom(true);
    setSelectedBreakpoint('custom');
    
    // Animate preview resize
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        width: customWidth,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Apply device preset
  const applyDevicePreset = (width: number, height: number) => {
    setIsCustom(true);
    setSelectedBreakpoint('custom');
    setCustomWidth(width);
    
    // Animate preview resize
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        width,
        height,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Get current width
  const getCurrentWidth = () => {
    if (isCustom) return customWidth;
    const bp = breakpoints.find(b => b.name === selectedBreakpoint);
    return bp ? bp.width : 768;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3">Breakpoints</h3>
        <div className="grid grid-cols-6 gap-2">
          {breakpoints.map((breakpoint) => (
            <button
              key={breakpoint.name}
              onClick={() => applyBreakpoint(breakpoint.name)}
              className={`p-2 text-xs rounded flex flex-col items-center ${
                selectedBreakpoint === breakpoint.name && !isCustom
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="font-medium">{breakpoint.name}</span>
              <span className="text-xs opacity-75">{breakpoint.width}px</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Custom Width</h3>
        <div className="flex space-x-2">
          <input
            type="range"
            min="320"
            max="1920"
            value={customWidth}
            onChange={(e) => setCustomWidth(parseInt(e.target.value))}
            className="flex-1"
          />
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="320"
              max="1920"
              value={customWidth}
              onChange={(e) => setCustomWidth(parseInt(e.target.value) || 768)}
              className="w-20 p-2 border rounded text-sm"
            />
            <span className="text-sm">px</span>
          </div>
          <button
            onClick={applyCustomWidth}
            className={`px-3 py-2 rounded text-sm ${
              isCustom && selectedBreakpoint === 'custom'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Device Presets</h3>
        <div className="grid grid-cols-3 gap-2">
          {devicePresets.map((device) => (
            <button
              key={device.name}
              onClick={() => applyDevicePreset(device.width, device.height)}
              className={`p-2 text-xs rounded flex flex-col items-center ${
                isCustom && customWidth === device.width
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="font-medium">{device.name}</span>
              <span className="text-xs opacity-75">{device.width}×{device.height}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Preview</h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {isCustom ? 'Custom' : selectedBreakpoint} ({getCurrentWidth()}px)
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  if (previewRef.current) {
                    gsap.to(previewRef.current, {
                      scale: 0.8,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Zoom Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (previewRef.current) {
                    gsap.to(previewRef.current, {
                      scale: 1,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Actual Size"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (previewRef.current) {
                    gsap.to(previewRef.current, {
                      scale: 1.2,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Zoom In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center overflow-auto p-4 bg-white border rounded">
            <div 
              ref={previewRef}
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden transition-all duration-300"
              style={{ width: getCurrentWidth(), height: '400px' }}
            >
              <div className="p-4">
                <div className="text-center text-gray-500 mb-4">
                  Responsive Preview ({getCurrentWidth()}px)
                </div>
                
                {/* Demo responsive content */}
                <div className="space-y-4">
                  <div className="bg-blue-500 text-white p-4 rounded">
                    <h4 className="font-bold">Responsive Heading</h4>
                    <p className="text-sm opacity-90">This content will adapt to different screen sizes</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="bg-gray-100 p-3 rounded">
                        <div className="font-medium">Item {item}</div>
                        <div className="text-xs text-gray-500">Responsive grid item</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-green-100 p-3 rounded">
                      <div className="font-medium">Column 1</div>
                      <div className="text-xs text-gray-600">Stacks on mobile</div>
                    </div>
                    <div className="flex-1 bg-yellow-100 p-3 rounded">
                      <div className="font-medium">Column 2</div>
                      <div className="text-xs text-gray-600">Side by side on larger screens</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreviewer;