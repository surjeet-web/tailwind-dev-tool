import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

interface SpacingCalculatorProps {
  onSpacingChange: (spacingClass: string) => void;
  currentSpacing?: string;
}

const SpacingCalculator: React.FC<SpacingCalculatorProps> = ({ onSpacingChange, currentSpacing }) => {
  const [margin, setMargin] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [padding, setPadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [gap, setGap] = useState(0);
  const [activeTab, setActiveTab] = useState('margin');

  // Tailwind spacing scale
  const spacingScale = [
    { value: 0, class: '0', px: 0 },
    { value: 0.25, class: '1', px: 4 },
    { value: 0.5, class: '2', px: 8 },
    { value: 1, class: '3', px: 12 },
    { value: 1.5, class: '4', px: 16 },
    { value: 2, class: '5', px: 20 },
    { value: 2.5, class: '6', px: 24 },
    { value: 3, class: '7', px: 28 },
    { value: 3.5, class: '8', px: 32 },
    { value: 4, class: '9', px: 36 },
    { value: 5, class: '10', px: 40 },
    { value: 6, class: '11', px: 44 },
    { value: 7, class: '12', px: 48 },
    { value: 8, class: '14', px: 56 },
    { value: 9, class: '16', px: 64 },
    { value: 10, class: '20', px: 80 },
    { value: 11, class: '24', px: 96 },
    { value: 12, class: '28', px: 112 },
    { value: 13, class: '32', px: 128 },
    { value: 14, class: '36', px: 144 },
    { value: 15, class: '40', px: 160 },
    { value: 16, class: '44', px: 176 },
    { value: 17, class: '48', px: 192 },
    { value: 18, class: '52', px: 208 },
    { value: 19, class: '56', px: 224 },
    { value: 20, class: '60', px: 240 },
    { value: 21, class: '64', px: 256 },
    { value: 22, class: '72', px: 288 },
    { value: 23, class: '80', px: 320 },
    { value: 24, class: '96', px: 384 },
  ];

  // Find the closest spacing class for a given pixel value
  const findClosestSpacing = (pxValue: number) => {
    return spacingScale.reduce((prev, curr) => 
      Math.abs(curr.px - pxValue) < Math.abs(prev.px - pxValue) ? curr : prev
    );
  };

  // Handle margin change
  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const newMargin = { ...margin, [side]: value };
    setMargin(newMargin);
    
    // Generate Tailwind classes
    const classes: string[] = [];
    if (newMargin.top > 0) classes.push(`mt-${findClosestSpacing(newMargin.top).class}`);
    if (newMargin.right > 0) classes.push(`mr-${findClosestSpacing(newMargin.right).class}`);
    if (newMargin.bottom > 0) classes.push(`mb-${findClosestSpacing(newMargin.bottom).class}`);
    if (newMargin.left > 0) classes.push(`ml-${findClosestSpacing(newMargin.left).class}`);
    
    if (classes.length > 0) {
      onSpacingChange(classes.join(' '));
    }
  };

  // Handle padding change
  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const newPadding = { ...padding, [side]: value };
    setPadding(newPadding);
    
    // Generate Tailwind classes
    const classes: string[] = [];
    if (newPadding.top > 0) classes.push(`pt-${findClosestSpacing(newPadding.top).class}`);
    if (newPadding.right > 0) classes.push(`pr-${findClosestSpacing(newPadding.right).class}`);
    if (newPadding.bottom > 0) classes.push(`pb-${findClosestSpacing(newPadding.bottom).class}`);
    if (newPadding.left > 0) classes.push(`pl-${findClosestSpacing(newPadding.left).class}`);
    
    if (classes.length > 0) {
      onSpacingChange(classes.join(' '));
    }
  };

  // Handle gap change
  const handleGapChange = (value: number) => {
    setGap(value);
    if (value > 0) {
      onSpacingChange(`gap-${findClosestSpacing(value).class}`);
    }
  };

  // Spacing slider component
  const SpacingSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
  }> = ({ label, value, onChange, min = 0, max = 64 }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-mono">{value}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="text-xs text-gray-500 mt-1">
        {findClosestSpacing(value).px === value 
          ? `Exact: ${findClosestSpacing(value).class}` 
          : `Closest: ${findClosestSpacing(value).class} (${findClosestSpacing(value).px}px)`}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex border-b">
        {['margin', 'padding', 'gap'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'margin' && (
        <div>
          <h3 className="font-medium mb-3">Margin</h3>
          <SpacingSlider
            label="Top"
            value={margin.top}
            onChange={(value) => handleMarginChange('top', value)}
          />
          <SpacingSlider
            label="Right"
            value={margin.right}
            onChange={(value) => handleMarginChange('right', value)}
          />
          <SpacingSlider
            label="Bottom"
            value={margin.bottom}
            onChange={(value) => handleMarginChange('bottom', value)}
          />
          <SpacingSlider
            label="Left"
            value={margin.left}
            onChange={(value) => handleMarginChange('left', value)}
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-2">Preview</div>
            <div className="flex justify-center">
              <div 
                className="bg-blue-100 border border-blue-300 text-blue-800 text-center p-2 text-sm"
                style={{
                  marginTop: `${margin.top}px`,
                  marginRight: `${margin.right}px`,
                  marginBottom: `${margin.bottom}px`,
                  marginLeft: `${margin.left}px`,
                }}
              >
                Element with margin
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'padding' && (
        <div>
          <h3 className="font-medium mb-3">Padding</h3>
          <SpacingSlider
            label="Top"
            value={padding.top}
            onChange={(value) => handlePaddingChange('top', value)}
          />
          <SpacingSlider
            label="Right"
            value={padding.right}
            onChange={(value) => handlePaddingChange('right', value)}
          />
          <SpacingSlider
            label="Bottom"
            value={padding.bottom}
            onChange={(value) => handlePaddingChange('bottom', value)}
          />
          <SpacingSlider
            label="Left"
            value={padding.left}
            onChange={(value) => handlePaddingChange('left', value)}
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-2">Preview</div>
            <div className="flex justify-center">
              <div 
                className="bg-blue-500 text-white text-center"
                style={{
                  paddingTop: `${padding.top}px`,
                  paddingRight: `${padding.right}px`,
                  paddingBottom: `${padding.bottom}px`,
                  paddingLeft: `${padding.left}px`,
                }}
              >
                Element with padding
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gap' && (
        <div>
          <h3 className="font-medium mb-3">Gap</h3>
          <SpacingSlider
            label="Gap Size"
            value={gap}
            onChange={handleGapChange}
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-2">Preview</div>
            <div 
              className="flex flex-wrap"
              style={{ gap: `${gap}px` }}
            >
              <div className="bg-blue-500 text-white text-center p-2 text-sm">Item 1</div>
              <div className="bg-blue-500 text-white text-center p-2 text-sm">Item 2</div>
              <div className="bg-blue-500 text-white text-center p-2 text-sm">Item 3</div>
              <div className="bg-blue-500 text-white text-center p-2 text-sm">Item 4</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacingCalculator;