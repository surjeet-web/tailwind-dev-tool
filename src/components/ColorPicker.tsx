import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ColorPickerProps {
  onColorSelect: (colorClass: string) => void;
  currentColor?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, currentColor }) => {
  const [selectedColor, setSelectedColor] = useState(currentColor || '#3B82F6');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Tailwind color palette
  const colorPalette = [
    { name: 'blue', value: '#3B82F6', classes: ['bg-blue-500', 'text-blue-500', 'border-blue-500'] },
    { name: 'red', value: '#EF4444', classes: ['bg-red-500', 'text-red-500', 'border-red-500'] },
    { name: 'green', value: '#10B981', classes: ['bg-green-500', 'text-green-500', 'border-green-500'] },
    { name: 'yellow', value: '#F59E0B', classes: ['bg-yellow-500', 'text-yellow-500', 'border-yellow-500'] },
    { name: 'purple', value: '#8B5CF6', classes: ['bg-purple-500', 'text-purple-500', 'border-purple-500'] },
    { name: 'pink', value: '#EC4899', classes: ['bg-pink-500', 'text-pink-500', 'border-pink-500'] },
    { name: 'indigo', value: '#6366F1', classes: ['bg-indigo-500', 'text-indigo-500', 'border-indigo-500'] },
    { name: 'gray', value: '#6B7280', classes: ['bg-gray-500', 'text-gray-500', 'border-gray-500'] },
  ];

  // Shade variations for each color
  const shadeVariations = [
    { suffix: '50', value: 50 },
    { suffix: '100', value: 100 },
    { suffix: '200', value: 200 },
    { suffix: '300', value: 300 },
    { suffix: '400', value: 400 },
    { suffix: '500', value: 500 },
    { suffix: '600', value: 600 },
    { suffix: '700', value: 700 },
    { suffix: '800', value: 800 },
    { suffix: '900', value: 900 },
  ];

  // Animation for picker
  useEffect(() => {
    if (pickerRef.current) {
      if (showPicker) {
        gsap.fromTo(pickerRef.current, 
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [showPicker]);

  const handleColorSelect = (colorName: string, shade: string) => {
    const colorClass = `bg-${colorName}-${shade}`;
    setSelectedColor(colorClass);
    onColorSelect(colorClass);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    // Convert hex to closest Tailwind color (simplified for demo)
    onColorSelect(`bg-[${color}]`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full p-2 border rounded flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded mr-2 border" 
            style={{ backgroundColor: selectedColor.startsWith('#') ? selectedColor : '' }}
          ></div>
          <span className="text-sm">
            {selectedColor.startsWith('bg-') ? selectedColor : 'Custom Color'}
          </span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute z-10 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4"
        >
          <div className="mb-4">
            <h3 className="font-medium text-sm mb-2">Custom Color</h3>
            <div className="flex items-center">
              <input
                type="color"
                value={selectedColor.startsWith('#') ? selectedColor : '#3B82F6'}
                onChange={handleCustomColorChange}
                className="w-10 h-10 border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={selectedColor.startsWith('#') ? selectedColor : ''}
                onChange={(e) => {
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    handleCustomColorChange(e);
                  }
                }}
                placeholder="#000000"
                className="ml-2 flex-1 p-2 border rounded text-sm"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-2">Tailwind Colors</h3>
            <div className="space-y-3">
              {colorPalette.map((color) => (
                <div key={color.name}>
                  <div className="text-xs text-gray-500 mb-1 capitalize">{color.name}</div>
                  <div className="grid grid-cols-10 gap-1">
                    {shadeVariations.map((shade) => (
                      <button
                        key={`${color.name}-${shade.suffix}`}
                        onClick={() => handleColorSelect(color.name, shade.suffix)}
                        className={`w-6 h-6 rounded border hover:scale-110 transition-transform ${
                          selectedColor === `bg-${color.name}-${shade.suffix}` ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={`${color.name}-${shade.suffix}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t">
            <h3 className="font-medium text-sm mb-2">Apply As</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => onColorSelect(`bg-${selectedColor.split('-')[1]}-${selectedColor.split('-')[2] || '500'}`)}
                className="p-2 text-xs border rounded hover:bg-gray-50"
              >
                Background
              </button>
              <button 
                onClick={() => onColorSelect(`text-${selectedColor.split('-')[1]}-${selectedColor.split('-')[2] || '500'}`)}
                className="p-2 text-xs border rounded hover:bg-gray-50"
              >
                Text
              </button>
              <button 
                onClick={() => onColorSelect(`border-${selectedColor.split('-')[1]}-${selectedColor.split('-')[2] || '500'}`)}
                className="p-2 text-xs border rounded hover:bg-gray-50"
              >
                Border
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;