import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimationPreviewProps {
  onAnimationSelect: (animationClass: string) => void;
  currentAnimation?: string;
}

const AnimationPreview: React.FC<AnimationPreviewProps> = ({ onAnimationSelect, currentAnimation }) => {
  const [selectedAnimation, setSelectedAnimation] = useState(currentAnimation || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Tailwind animation classes
  const animations = [
    { name: 'Spin', class: 'animate-spin', description: 'Spins element 360 degrees' },
    { name: 'Ping', class: 'animate-ping', description: 'Scales and fades out like a radar ping' },
    { name: 'Pulse', class: 'animate-pulse', description: 'Gently fades in and out' },
    { name: 'Bounce', class: 'animate-bounce', description: 'Bounces up and down' },
    { name: 'Fade In', class: 'animate-fade-in', description: 'Fades in from transparent' },
    { name: 'Fade Out', class: 'animate-fade-out', description: 'Fades out to transparent' },
    { name: 'Slide In', class: 'animate-slide-in', description: 'Slides in from the left' },
    { name: 'Slide Out', class: 'animate-slide-out', description: 'Slides out to the right' },
    { name: 'Zoom In', class: 'animate-zoom-in', description: 'Scales up from small' },
    { name: 'Zoom Out', class: 'animate-zoom-out', description: 'Scales down to small' },
    { name: 'Flip', class: 'animate-flip', description: 'Flips horizontally' },
    { name: 'Shake', class: 'animate-shake', description: 'Shakes side to side' },
  ];

  // Play animation
  const playAnimation = (animationClass: string) => {
    if (!previewRef.current) return;
    
    setIsPlaying(true);
    setSelectedAnimation(animationClass);
    
    // Remove any existing animation classes
    previewRef.current.className = previewRef.current.className
      .split(' ')
      .filter(cls => !cls.startsWith('animate-'))
      .join(' ');
    
    // Add the new animation class
    previewRef.current.classList.add(animationClass);
    
    // Reset after animation completes
    const animationDuration = getAnimationDuration(animationClass);
    setTimeout(() => {
      setIsPlaying(false);
      if (previewRef.current) {
        previewRef.current.classList.remove(animationClass);
      }
    }, animationDuration);
  };

  // Get animation duration in milliseconds
  const getAnimationDuration = (animationClass: string): number => {
    const durationMap: Record<string, number> = {
      'animate-spin': 1000,
      'animate-ping': 1000,
      'animate-pulse': 2000,
      'animate-bounce': 1000,
      'animate-fade-in': 500,
      'animate-fade-out': 500,
      'animate-slide-in': 500,
      'animate-slide-out': 500,
      'animate-zoom-in': 500,
      'animate-zoom-out': 500,
      'animate-flip': 1000,
      'animate-shake': 500,
    };
    
    return durationMap[animationClass] || 1000;
  };

  // Apply animation to selected element
  const applyAnimation = () => {
    if (selectedAnimation) {
      onAnimationSelect(selectedAnimation);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3">Animation Preview</h3>
        <div className="flex justify-center mb-6">
          <div 
            ref={previewRef}
            className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
          >
            Preview
          </div>
        </div>
        
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={() => selectedAnimation && playAnimation(selectedAnimation)}
            disabled={!selectedAnimation || isPlaying}
            className={`px-4 py-2 rounded ${
              !selectedAnimation || isPlaying
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isPlaying ? 'Playing...' : 'Play'}
          </button>
          
          <button
            onClick={applyAnimation}
            disabled={!selectedAnimation}
            className={`px-4 py-2 rounded ${
              !selectedAnimation
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Apply
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Available Animations</h3>
        <div className="grid grid-cols-2 gap-3">
          {animations.map((animation) => (
            <button
              key={animation.class}
              onClick={() => playAnimation(animation.class)}
              className={`p-3 border rounded text-left transition-all ${
                selectedAnimation === animation.class
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">{animation.name}</div>
              <div className="text-xs text-gray-500 mt-1">{animation.description}</div>
              <div className="font-mono text-xs text-gray-400 mt-1">{animation.class}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-medium mb-3">Animation Settings</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Duration</label>
            <select className="w-full p-2 border rounded">
              <option>Fast (200ms)</option>
              <option selected>Normal (500ms)</option>
              <option>Slow (1000ms)</option>
              <option>Very Slow (2000ms)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Easing</label>
            <select className="w-full p-2 border rounded">
              <option>Linear</option>
              <option selected>Ease</option>
              <option>Ease In</option>
              <option>Ease Out</option>
              <option>Ease In Out</option>
              <option>Bounce</option>
              <option>Elastic</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Delay</label>
            <select className="w-full p-2 border rounded">
              <option selected>None</option>
              <option>Short (100ms)</option>
              <option>Medium (300ms)</option>
              <option>Long (500ms)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Iteration Count</label>
            <select className="w-full p-2 border rounded">
              <option selected>Once</option>
              <option>Twice</option>
              <option>3 Times</option>
              <option>5 Times</option>
              <option>Infinite</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPreview;