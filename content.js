// Content script for Tailwind CSS Developer Tools extension
(function() {
  'use strict';

  // Prevent multiple initialization
  if (window.tailwindDevToolsInitialized) {
    return;
  }
  window.tailwindDevToolsInitialized = true;

  // Extension variables (scoped to this IIFE)
  let highlighter;
  let panel;
  let selectedElement = null;
  let isInspecting = false;
  let tailwindIntelligence;

  // Embedded Tailwind Intelligence System for 0ms loading
  class TailwindIntelligence {
    constructor() {
      this.classDatabase = new Map();
      this.initialized = false;
      this.initializeDatabase();
    }

    initializeDatabase() {
      // Quick initialization with essential classes
      const classes = [
        // Spacing
        { name: 'p-0', description: 'Padding 0', category: 'spacing', css: 'padding: 0' },
        { name: 'p-1', description: 'Padding 0.25rem (4px)', category: 'spacing', css: 'padding: 0.25rem' },
        { name: 'p-2', description: 'Padding 0.5rem (8px)', category: 'spacing', css: 'padding: 0.5rem' },
        { name: 'p-3', description: 'Padding 0.75rem (12px)', category: 'spacing', css: 'padding: 0.75rem' },
        { name: 'p-4', description: 'Padding 1rem (16px)', category: 'spacing', css: 'padding: 1rem' },
        { name: 'p-5', description: 'Padding 1.25rem (20px)', category: 'spacing', css: 'padding: 1.25rem' },
        { name: 'p-6', description: 'Padding 1.5rem (24px)', category: 'spacing', css: 'padding: 1.5rem' },
        { name: 'p-8', description: 'Padding 2rem (32px)', category: 'spacing', css: 'padding: 2rem' },
        { name: 'p-10', description: 'Padding 2.5rem (40px)', category: 'spacing', css: 'padding: 2.5rem' },
        { name: 'p-12', description: 'Padding 3rem (48px)', category: 'spacing', css: 'padding: 3rem' },
        
        { name: 'm-0', description: 'Margin 0', category: 'spacing', css: 'margin: 0' },
        { name: 'm-1', description: 'Margin 0.25rem (4px)', category: 'spacing', css: 'margin: 0.25rem' },
        { name: 'm-2', description: 'Margin 0.5rem (8px)', category: 'spacing', css: 'margin: 0.5rem' },
        { name: 'm-3', description: 'Margin 0.75rem (12px)', category: 'spacing', css: 'margin: 0.75rem' },
        { name: 'm-4', description: 'Margin 1rem (16px)', category: 'spacing', css: 'margin: 1rem' },
        { name: 'm-5', description: 'Margin 1.25rem (20px)', category: 'spacing', css: 'margin: 1.25rem' },
        { name: 'm-6', description: 'Margin 1.5rem (24px)', category: 'spacing', css: 'margin: 1.5rem' },
        { name: 'm-8', description: 'Margin 2rem (32px)', category: 'spacing', css: 'margin: 2rem' },
        { name: 'm-10', description: 'Margin 2.5rem (40px)', category: 'spacing', css: 'margin: 2.5rem' },
        { name: 'm-12', description: 'Margin 3rem (48px)', category: 'spacing', css: 'margin: 3rem' },

        // Colors - Background
        { name: 'bg-white', description: 'White background', category: 'colors', css: 'background-color: #ffffff' },
        { name: 'bg-black', description: 'Black background', category: 'colors', css: 'background-color: #000000' },
        { name: 'bg-red-50', description: 'Red 50 background', category: 'colors', css: 'background-color: #fef2f2' },
        { name: 'bg-red-100', description: 'Red 100 background', category: 'colors', css: 'background-color: #fee2e2' },
        { name: 'bg-red-200', description: 'Red 200 background', category: 'colors', css: 'background-color: #fecaca' },
        { name: 'bg-red-300', description: 'Red 300 background', category: 'colors', css: 'background-color: #fca5a5' },
        { name: 'bg-red-400', description: 'Red 400 background', category: 'colors', css: 'background-color: #f87171' },
        { name: 'bg-red-500', description: 'Red 500 background', category: 'colors', css: 'background-color: #ef4444' },
        { name: 'bg-red-600', description: 'Red 600 background', category: 'colors', css: 'background-color: #dc2626' },
        { name: 'bg-red-700', description: 'Red 700 background', category: 'colors', css: 'background-color: #b91c1c' },
        { name: 'bg-red-800', description: 'Red 800 background', category: 'colors', css: 'background-color: #991b1b' },
        { name: 'bg-red-900', description: 'Red 900 background', category: 'colors', css: 'background-color: #7f1d1d' },
        
        { name: 'bg-blue-50', description: 'Blue 50 background', category: 'colors', css: 'background-color: #eff6ff' },
        { name: 'bg-blue-100', description: 'Blue 100 background', category: 'colors', css: 'background-color: #dbeafe' },
        { name: 'bg-blue-200', description: 'Blue 200 background', category: 'colors', css: 'background-color: #bfdbfe' },
        { name: 'bg-blue-300', description: 'Blue 300 background', category: 'colors', css: 'background-color: #93c5fd' },
        { name: 'bg-blue-400', description: 'Blue 400 background', category: 'colors', css: 'background-color: #60a5fa' },
        { name: 'bg-blue-500', description: 'Blue 500 background', category: 'colors', css: 'background-color: #3b82f6' },
        { name: 'bg-blue-600', description: 'Blue 600 background', category: 'colors', css: 'background-color: #2563eb' },
        { name: 'bg-blue-700', description: 'Blue 700 background', category: 'colors', css: 'background-color: #1d4ed8' },
        { name: 'bg-blue-800', description: 'Blue 800 background', category: 'colors', css: 'background-color: #1e40af' },
        { name: 'bg-blue-900', description: 'Blue 900 background', category: 'colors', css: 'background-color: #1e3a8a' },

        { name: 'bg-green-50', description: 'Green 50 background', category: 'colors', css: 'background-color: #f0fdf4' },
        { name: 'bg-green-100', description: 'Green 100 background', category: 'colors', css: 'background-color: #dcfce7' },
        { name: 'bg-green-200', description: 'Green 200 background', category: 'colors', css: 'background-color: #bbf7d0' },
        { name: 'bg-green-300', description: 'Green 300 background', category: 'colors', css: 'background-color: #86efac' },
        { name: 'bg-green-400', description: 'Green 400 background', category: 'colors', css: 'background-color: #4ade80' },
        { name: 'bg-green-500', description: 'Green 500 background', category: 'colors', css: 'background-color: #22c55e' },
        { name: 'bg-green-600', description: 'Green 600 background', category: 'colors', css: 'background-color: #16a34a' },
        { name: 'bg-green-700', description: 'Green 700 background', category: 'colors', css: 'background-color: #15803d' },
        { name: 'bg-green-800', description: 'Green 800 background', category: 'colors', css: 'background-color: #166534' },
        { name: 'bg-green-900', description: 'Green 900 background', category: 'colors', css: 'background-color: #14532d' },

        { name: 'bg-gray-50', description: 'Gray 50 background', category: 'colors', css: 'background-color: #f9fafb' },
        { name: 'bg-gray-100', description: 'Gray 100 background', category: 'colors', css: 'background-color: #f3f4f6' },
        { name: 'bg-gray-200', description: 'Gray 200 background', category: 'colors', css: 'background-color: #e5e7eb' },
        { name: 'bg-gray-300', description: 'Gray 300 background', category: 'colors', css: 'background-color: #d1d5db' },
        { name: 'bg-gray-400', description: 'Gray 400 background', category: 'colors', css: 'background-color: #9ca3af' },
        { name: 'bg-gray-500', description: 'Gray 500 background', category: 'colors', css: 'background-color: #6b7280' },
        { name: 'bg-gray-600', description: 'Gray 600 background', category: 'colors', css: 'background-color: #4b5563' },
        { name: 'bg-gray-700', description: 'Gray 700 background', category: 'colors', css: 'background-color: #374151' },
        { name: 'bg-gray-800', description: 'Gray 800 background', category: 'colors', css: 'background-color: #1f2937' },
        { name: 'bg-gray-900', description: 'Gray 900 background', category: 'colors', css: 'background-color: #111827' },

        // Colors - Text
        { name: 'text-white', description: 'White text color', category: 'colors', css: 'color: #ffffff' },
        { name: 'text-black', description: 'Black text color', category: 'colors', css: 'color: #000000' },
        { name: 'text-red-500', description: 'Red 500 text', category: 'colors', css: 'color: #ef4444' },
        { name: 'text-red-600', description: 'Red 600 text', category: 'colors', css: 'color: #dc2626' },
        { name: 'text-blue-500', description: 'Blue 500 text', category: 'colors', css: 'color: #3b82f6' },
        { name: 'text-blue-600', description: 'Blue 600 text', category: 'colors', css: 'color: #2563eb' },
        { name: 'text-gray-500', description: 'Gray 500 text', category: 'colors', css: 'color: #6b7280' },
        { name: 'text-gray-600', description: 'Gray 600 text', category: 'colors', css: 'color: #4b5563' },
        { name: 'text-gray-700', description: 'Gray 700 text', category: 'colors', css: 'color: #374151' },
        { name: 'text-gray-800', description: 'Gray 800 text', category: 'colors', css: 'color: #1f2937' },
        { name: 'text-gray-900', description: 'Gray 900 text', category: 'colors', css: 'color: #111827' },

        // Borders
        { name: 'rounded', description: 'Border radius 0.25rem', category: 'borders', css: 'border-radius: 0.25rem' },
        { name: 'rounded-none', description: 'No border radius', category: 'borders', css: 'border-radius: 0' },
        { name: 'rounded-sm', description: 'Small border radius', category: 'borders', css: 'border-radius: 0.125rem' },
        { name: 'rounded-md', description: 'Medium border radius', category: 'borders', css: 'border-radius: 0.375rem' },
        { name: 'rounded-lg', description: 'Large border radius', category: 'borders', css: 'border-radius: 0.5rem' },
        { name: 'rounded-xl', description: 'Extra large border radius', category: 'borders', css: 'border-radius: 0.75rem' },
        { name: 'rounded-2xl', description: '2x large border radius', category: 'borders', css: 'border-radius: 1rem' },
        { name: 'rounded-full', description: 'Full border radius', category: 'borders', css: 'border-radius: 9999px' },

        // Effects
        { name: 'shadow', description: 'Box shadow', category: 'effects', css: 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
        { name: 'shadow-sm', description: 'Small shadow', category: 'effects', css: 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)' },
        { name: 'shadow-md', description: 'Medium shadow', category: 'effects', css: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
        { name: 'shadow-lg', description: 'Large shadow', category: 'effects', css: 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
        { name: 'shadow-xl', description: 'Extra large shadow', category: 'effects', css: 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
        { name: 'shadow-2xl', description: '2x large shadow', category: 'effects', css: 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)' },
        { name: 'shadow-none', description: 'No shadow', category: 'effects', css: 'box-shadow: 0 0 #0000' },

        // Layout
        { name: 'flex', description: 'Display flex', category: 'layout', css: 'display: flex' },
        { name: 'block', description: 'Display block', category: 'layout', css: 'display: block' },
        { name: 'inline', description: 'Display inline', category: 'layout', css: 'display: inline' },
        { name: 'inline-block', description: 'Display inline-block', category: 'layout', css: 'display: inline-block' },
        { name: 'hidden', description: 'Display none', category: 'layout', css: 'display: none' },
        { name: 'grid', description: 'Display grid', category: 'layout', css: 'display: grid' },

        // Typography
        { name: 'font-thin', description: 'Font weight 100', category: 'typography', css: 'font-weight: 100' },
        { name: 'font-light', description: 'Font weight 300', category: 'typography', css: 'font-weight: 300' },
        { name: 'font-normal', description: 'Font weight 400', category: 'typography', css: 'font-weight: 400' },
        { name: 'font-medium', description: 'Font weight 500', category: 'typography', css: 'font-weight: 500' },
        { name: 'font-semibold', description: 'Font weight 600', category: 'typography', css: 'font-weight: 600' },
        { name: 'font-bold', description: 'Font weight 700', category: 'typography', css: 'font-weight: 700' },
        { name: 'font-extrabold', description: 'Font weight 800', category: 'typography', css: 'font-weight: 800' },
        { name: 'font-black', description: 'Font weight 900', category: 'typography', css: 'font-weight: 900' },

        // Text sizes
        { name: 'text-xs', description: 'Font size 0.75rem (12px)', category: 'typography', css: 'font-size: 0.75rem; line-height: 1rem' },
        { name: 'text-sm', description: 'Font size 0.875rem (14px)', category: 'typography', css: 'font-size: 0.875rem; line-height: 1.25rem' },
        { name: 'text-base', description: 'Font size 1rem (16px)', category: 'typography', css: 'font-size: 1rem; line-height: 1.5rem' },
        { name: 'text-lg', description: 'Font size 1.125rem (18px)', category: 'typography', css: 'font-size: 1.125rem; line-height: 1.75rem' },
        { name: 'text-xl', description: 'Font size 1.25rem (20px)', category: 'typography', css: 'font-size: 1.25rem; line-height: 1.75rem' },
        { name: 'text-2xl', description: 'Font size 1.5rem (24px)', category: 'typography', css: 'font-size: 1.5rem; line-height: 2rem' },
        { name: 'text-3xl', description: 'Font size 1.875rem (30px)', category: 'typography', css: 'font-size: 1.875rem; line-height: 2.25rem' },
        { name: 'text-4xl', description: 'Font size 2.25rem (36px)', category: 'typography', css: 'font-size: 2.25rem; line-height: 2.5rem' }
      ];

      // Add all classes to database
      classes.forEach(cls => {
        this.classDatabase.set(cls.name, {
          ...cls,
          alternatives: this.generateAlternatives(cls.name),
          variants: ['responsive', 'hover', 'focus']
        });
      });

      this.initialized = true;
      console.log(`Tailwind Intelligence initialized with ${this.classDatabase.size} classes`);
    }

    generateAlternatives(className) {
      const alternatives = [];
      
      if (className.startsWith('p-')) {
        const values = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12'];
        values.forEach(val => {
          const alt = `p-${val}`;
          if (alt !== className) alternatives.push(alt);
        });
      } else if (className.startsWith('m-')) {
        const values = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12'];
        values.forEach(val => {
          const alt = `m-${val}`;
          if (alt !== className) alternatives.push(alt);
        });
      } else if (className.startsWith('bg-')) {
        if (className.includes('-')) {
          const parts = className.split('-');
          if (parts.length >= 3) {
            const color = parts[1];
            const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
            shades.forEach(shade => alternatives.push(`bg-${color}-${shade}`));
          }
        }
        const colors = ['red', 'blue', 'green', 'gray', 'white', 'black'];
        colors.forEach(color => {
          if (color === 'white' || color === 'black') {
            alternatives.push(`bg-${color}`);
          } else {
            alternatives.push(`bg-${color}-500`);
          }
        });
      } else if (className.startsWith('text-')) {
        const colors = ['red', 'blue', 'green', 'gray', 'white', 'black'];
        colors.forEach(color => {
          if (color === 'white' || color === 'black') {
            alternatives.push(`text-${color}`);
          } else {
            alternatives.push(`text-${color}-500`);
          }
        });
      } else if (className.startsWith('rounded')) {
        const sizes = ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'];
        alternatives.push(...sizes.filter(s => s !== className));
      } else if (className.startsWith('shadow')) {
        const sizes = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
        alternatives.push(...sizes.filter(s => s !== className));
      } else if (className.startsWith('font-')) {
        const weights = ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'];
        alternatives.push(...weights.filter(w => w !== className));
      } else if (className.startsWith('text-') && ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].some(size => className.includes(size))) {
        const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
        alternatives.push(...sizes.filter(s => s !== className));
      }

      return alternatives.slice(0, 12);
    }

    search(query, limit = 15) {
      if (!this.initialized || !query) return [];

      const queryLower = query.toLowerCase().trim();
      const results = [];

      for (const [className, classInfo] of this.classDatabase) {
        let score = 0;

        if (className === queryLower) score = 1000;
        else if (className.startsWith(queryLower)) score = 900;
        else if (className.includes(queryLower)) score = 700;
        else if (classInfo.description.toLowerCase().includes(queryLower)) score = 500;
        else if (classInfo.category.toLowerCase().includes(queryLower)) score = 300;

        if (score > 0) {
          results.push({ ...classInfo, score });
        }
      }

      return results.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    getAlternatives(className, limit = 12) {
      const classInfo = this.classDatabase.get(className);
      if (!classInfo) return [];

      return (classInfo.alternatives || [])
        .slice(0, limit)
        .map(altClassName => {
          const altInfo = this.classDatabase.get(altClassName);
          return {
            name: altClassName,
            description: altInfo?.description || altClassName,
            category: altInfo?.category || 'utility',
            css: altInfo?.css || ''
          };
        });
    }

    getContextualSuggestions(existingClasses = [], limit = 8) {
      const suggestions = [];
      const categories = new Set();
      
      existingClasses.forEach(className => {
        const classInfo = this.classDatabase.get(className);
        if (classInfo) categories.add(classInfo.category);
      });

      if (categories.has('layout') && !categories.has('spacing')) {
        suggestions.push('p-4', 'p-6', 'm-4');
      }
      
      if (categories.has('colors') && !categories.has('effects')) {
        suggestions.push('shadow-md', 'rounded-lg');
      }
      
      if (categories.has('spacing') && !categories.has('colors')) {
        suggestions.push('bg-white', 'text-gray-900');
      }

      if (categories.size === 0) {
        suggestions.push('flex', 'p-4', 'bg-white', 'text-gray-900', 'rounded-lg', 'shadow-md');
      }

      return suggestions
        .filter(className => !existingClasses.includes(className))
        .slice(0, limit)
        .map(className => {
          const classInfo = this.classDatabase.get(className);
          return {
            name: className,
            description: classInfo?.description || className,
            category: classInfo?.category || 'utility',
            css: classInfo?.css || ''
          };
        });
    }
  }



  // Create element highlighter
  function createHighlighter() {
    const highlighterElement = document.createElement('div');
    highlighterElement.className = 'tailwind-dev-tools-highlighter';
    highlighterElement.style.cssText = `
      position: absolute;
      pointer-events: none;
      background-color: rgba(59, 130, 246, 0.2);
      border: 2px solid #3B82F6;
      border-radius: 4px;
      z-index: 99998;
      display: none;
      transition: all 0.1s ease;
    `;
    document.body.appendChild(highlighterElement);
    return highlighterElement;
  }

  // Create floating panel
  function createFloatingPanel() {
    const panelElement = document.createElement('div');
    panelElement.id = 'tailwind-tools-panel';
    panelElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 420px;
      height: calc(100vh - 40px);
      background-color: white;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
      z-index: 99999;
      display: none;
      overflow: hidden;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    `;

    panelElement.innerHTML = `
      <!-- Panel Header -->
      <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f8fafc, #f1f5f9);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B82F6, #2563EB); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
              </svg>
            </div>
            <div>
              <h1 style="margin: 0; font-size: 16px; font-weight: bold; color: #111827;">Tailwind CSS Tools</h1>
              <div style="font-size: 11px; color: #6B7280; margin-top: 2px;">v2.0</div>
            </div>
          </div>
          <button id="close-panel" style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; opacity: 0.8; transition: all 0.2s;">
            <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Panel Content -->
      <div style="height: calc(100% - 65px); display: flex; flex-direction: column;">
        <!-- Inspector Section -->
        <div style="padding: 16px; flex: 1; overflow-y: auto;">
          <button id="inspect-element" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; border-radius: 8px; cursor: pointer; margin-bottom: 16px; font-weight: 500; transition: all 0.2s; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);">
            🔍 Inspect Element
          </button>

          <div id="element-info" style="display: none; margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 6px; font-weight: 500;" id="element-path"></div>
            <div style="font-family: monospace; font-size: 13px; background-color: #f1f5f9; padding: 8px; border-radius: 4px; color: #111827;" id="element-tag"></div>
          </div>

          <div id="applied-classes" style="display: none; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">Applied Classes</h3>
              <span style="font-size: 11px; color: #3B82F6; background: #EFF6FF; padding: 2px 6px; border-radius: 3px; font-weight: 500;">💡 Click for alternatives</span>
            </div>
            <div id="classes-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
          </div>

          <div style="margin-bottom: 16px; position: relative;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #111827;">Add Class</h3>
            <div style="position: relative;">
              <input type="text" id="class-search" placeholder="Search Tailwind classes..." style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; font-size: 13px; box-sizing: border-box;">
              <div id="search-suggestions" style="position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 4px; z-index: 1000; display: none; max-height: 300px; overflow-y: auto; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);"></div>
            </div>
          </div>

          <div id="suggestions" style="display: none;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #111827;">Smart Suggestions</h3>
            <div id="suggestions-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
          </div>
        </div>
      </div>

      <!-- Class Alternatives Modal -->
      <div id="class-alternatives-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 100000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
        <div style="background: white; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="font-size: 14px; font-weight: 600; color: #111827;">
                Alternatives for <code id="modal-class-name" style="background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-size: 12px;">p-4</code>
              </h3>
              <button id="close-alternatives-modal" style="background: none; border: none; cursor: pointer; padding: 4px;">
                <svg width="16" height="16" fill="#6B7280" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div style="padding: 16px;">
            <div id="alternatives-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; max-height: 500px; overflow-y: auto; padding: 4px;"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panelElement);
    return panelElement;
  }

  // Initialize Tailwind Intelligence (instant - 0ms delay)
  function initializeTailwindIntelligence() {
    tailwindIntelligence = new TailwindIntelligence();
    console.log('Tailwind Intelligence initialized instantly!');
  }

  // Search functionality
  function setupSearch() {
    const searchInput = document.getElementById('class-search');
    const searchSuggestions = document.getElementById('search-suggestions');
    
    if (!searchInput || !searchSuggestions) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query === '') {
        searchSuggestions.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query, searchSuggestions);
      }, 150);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
      }
    });
  }

  function performSearch(query, searchSuggestions) {
    if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
      // Initialize immediately if not ready
      if (!tailwindIntelligence) {
        initializeTailwindIntelligence();
      }
      
      // If still not ready, show loading (should never happen now)
      if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
        searchSuggestions.innerHTML = `
          <div style="padding: 12px; color: #6B7280; text-align: center; font-size: 14px;">
            Initializing intelligence...
          </div>
        `;
        searchSuggestions.style.display = 'block';
        return;
      }
    }

    const results = tailwindIntelligence.search(query, 12);

    if (results.length > 0) {
      searchSuggestions.innerHTML = results.map(cls => {
        const highlightedClass = cls.name.replace(
          new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
          match => `<span style="font-weight: 600; color: #3B82F6;">${match}</span>`
        );
        
        const categoryColor = getCategoryColor(cls.category);
        
        return `
          <div class="search-suggestion" data-class="${cls.name}" style="padding: 12px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.1s ease; background: white; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
              <div style="font-weight: 500; font-family: monospace; font-size: 13px; color: #111827;">${highlightedClass}</div>
              <div style="background: ${categoryColor}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">${cls.category}</div>
            </div>
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">${cls.description}</div>
            ${cls.css ? `<div style="font-size: 11px; color: #9CA3AF; font-family: monospace; background: #f8fafc; padding: 2px 4px; border-radius: 2px;">${cls.css}</div>` : ''}
            ${cls.variants && cls.variants.length > 0 ? `<div style="font-size: 10px; color: #3B82F6; margin-top: 4px;">Variants: ${cls.variants.slice(0, 3).join(', ')}${cls.variants.length > 3 ? '...' : ''}</div>` : ''}
          </div>
        `;
      }).join('');

      // Add hover effects and click handlers
      const suggestionElements = searchSuggestions.querySelectorAll('.search-suggestion');
      suggestionElements.forEach(suggestion => {
        suggestion.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f8fafc';
          this.style.borderLeft = '3px solid #3B82F6';
        });
        
        suggestion.addEventListener('mouseleave', function() {
          this.style.backgroundColor = 'white';
          this.style.borderLeft = 'none';
        });

        suggestion.addEventListener('click', function() {
          const selectedClass = this.dataset.class;
          addClass(selectedClass);
          document.getElementById('class-search').value = '';
          searchSuggestions.style.display = 'none';
        });
      });

      searchSuggestions.style.display = 'block';
    } else {
      searchSuggestions.innerHTML = `
        <div style="padding: 12px; color: #6B7280; text-align: center; font-size: 14px;">
          <div style="margin-bottom: 8px;">No classes found for "${query}"</div>
          <div style="font-size: 12px; color: #9CA3AF;">Try searching for: p-, m-, bg-, text-, flex, grid</div>
        </div>
      `;
      searchSuggestions.style.display = 'block';
    }
  }

  function getCategoryColor(category) {
    const colors = {
      spacing: '#10B981',
      colors: '#F59E0B',
      layout: '#3B82F6',
      typography: '#8B5CF6',
      borders: '#EF4444',
      effects: '#06B6D4',
      utility: '#6B7280'
    };
    return colors[category] || colors.utility;
  }

  // Initialize extension
  function initializeExtension() {
    if (window.location.protocol === 'chrome:') {
      console.log('Extension cannot run on chrome:// URLs');
      return;
    }

    // Initialize Tailwind Intelligence FIRST (0ms delay)
    initializeTailwindIntelligence();

    // Create UI elements
    highlighter = createHighlighter();
    panel = createFloatingPanel();

    // Set up functionality
    setupEventListeners();
    setupSearch();

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      try {
        if (request.action === 'togglePanel') {
          togglePanel();
          sendResponse({ success: true });
        } else if (request.action === 'inspectElement') {
          startInspection();
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

    // Close alternatives modal
    const closeModalButton = document.getElementById('close-alternatives-modal');
    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        document.getElementById('class-alternatives-modal').style.display = 'none';
      });
    }

    // Mouse events for element inspection
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
  }

  // Toggle panel visibility
  function togglePanel() {
    if (panel.style.display === 'none' || panel.style.display === '') {
      panel.style.display = 'block';
      panel.style.opacity = '0';
      panel.style.transform = 'translateX(100%)';
      
      requestAnimationFrame(() => {
        panel.style.transition = 'all 0.3s ease-out';
        panel.style.opacity = '1';
        panel.style.transform = 'translateX(0)';
      });
    } else {
      panel.style.transition = 'all 0.3s ease-in';
      panel.style.opacity = '0';
      panel.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        panel.style.display = 'none';
        stopInspection();
      }, 300);
    }
  }

  // Start element inspection
  function startInspection() {
    isInspecting = true;
    const inspectButton = document.getElementById('inspect-element');
    if (inspectButton) {
      inspectButton.textContent = '⏹️ Stop Inspecting';
      inspectButton.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
    }
    document.body.style.cursor = 'crosshair';
  }

  // Stop element inspection
  function stopInspection() {
    isInspecting = false;
    const inspectButton = document.getElementById('inspect-element');
    if (inspectButton) {
      inspectButton.textContent = '🔍 Inspect Element';
      inspectButton.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
    }
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
    const classes = Array.from(element.classList).filter(cls => cls.trim() !== '');
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
        const classes = Array.from(current.classList).filter(cls => cls.trim() !== '');
        if (classes.length > 0) {
          selector += '.' + classes.slice(0, 2).join('.');
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }

  // Display applied classes with alternatives button
  function displayAppliedClasses(classes) {
    const classesList = document.getElementById('classes-list');
    classesList.innerHTML = '';
    
    classes.forEach(cls => {
      const classItem = document.createElement('div');
      classItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        margin-bottom: 6px;
        background-color: #f8fafc;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      
      classItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f1f5f9';
        this.style.borderColor = '#3B82F6';
      });
      
      classItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f8fafc';
        this.style.borderColor = '#e2e8f0';
      });
      
      const className = document.createElement('span');
      className.style.cssText = `
        font-family: monospace;
        font-size: 13px;
        font-weight: 500;
        color: #111827;
      `;
      className.textContent = cls;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.style.cssText = 'display: flex; gap: 4px; align-items: center;';
      
      // Alternatives button
      const alternativesButton = document.createElement('button');
      alternativesButton.style.cssText = `
        background: #3B82F6;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      alternativesButton.textContent = 'Alt';
      alternativesButton.title = 'Show alternatives';
      
      alternativesButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openClassAlternativesModal(cls);
      });
      
      // Remove button
      const removeButton = document.createElement('button');
      removeButton.style.cssText = `
        background: #EF4444;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 6px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      `;
      removeButton.innerHTML = '×';
      removeButton.title = 'Remove class';
      
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeClass(cls);
      });
      
      actionsDiv.appendChild(alternativesButton);
      actionsDiv.appendChild(removeButton);
      
      classItem.appendChild(className);
      classItem.appendChild(actionsDiv);
      classesList.appendChild(classItem);
    });
  }

  // Open class alternatives modal with enhanced intelligence
  function openClassAlternativesModal(className) {
    const modal = document.getElementById('class-alternatives-modal');
    const modalClassName = document.getElementById('modal-class-name');
    const alternativesGrid = document.getElementById('alternatives-grid');
    
    modalClassName.textContent = className;
    
    if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
      // Initialize immediately if not ready
      if (!tailwindIntelligence) {
        initializeTailwindIntelligence();
      }
      
      if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
        alternativesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #6B7280;">
            Initializing intelligence...
          </div>
        `;
        modal.style.display = 'flex';
        return;
      }
    }

    // Get detailed alternatives with descriptions
    const alternatives = tailwindIntelligence.getAlternatives(className, 18);
    
    if (alternatives.length === 0) {
      alternativesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #6B7280;">
          <div style="margin-bottom: 8px;">No alternatives found for "${className}"</div>
          <div style="font-size: 12px; color: #9CA3AF;">This class might be custom or very specific.</div>
        </div>
      `;
    } else {
      alternativesGrid.innerHTML = alternatives.map(alt => {
        const categoryColor = getCategoryColor(alt.category);
        return `
          <div class="alternative-item" data-class="${alt.name}" style="
            padding: 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          ">
            <div>
              <div style="font-family: monospace; font-size: 12px; font-weight: 600; color: #111827; margin-bottom: 4px; word-break: break-all;">${alt.name}</div>
              <div style="font-size: 10px; color: #6B7280; line-height: 1.3; margin-bottom: 6px;">${alt.description}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="background: ${categoryColor}; color: white; padding: 1px 4px; border-radius: 2px; font-size: 8px; font-weight: 500; text-transform: uppercase;">${alt.category}</div>
              <div style="font-size: 8px; color: #3B82F6; font-weight: 500;">Click to apply</div>
            </div>
          </div>
        `;
      }).join('');
    }
    
    // Add enhanced click handlers for alternatives
    alternativesGrid.querySelectorAll('.alternative-item').forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#e0f2fe';
        this.style.borderColor = '#3B82F6';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f8fafc';
        this.style.borderColor = '#e2e8f0';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
      });
      
      item.addEventListener('click', function() {
        const newClass = this.dataset.class;
        
        // Add visual feedback
        this.style.backgroundColor = '#10B981';
        this.style.borderColor = '#10B981';
        this.style.color = 'white';
        
        setTimeout(() => {
          replaceClass(className, newClass);
          modal.style.display = 'none';
        }, 200);
      });
    });
    
    modal.style.display = 'flex';
  }

  // Generate class alternatives using Tailwind Intelligence
  function generateClassAlternatives(className) {
    if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
      // Initialize immediately if not ready
      if (!tailwindIntelligence) {
        initializeTailwindIntelligence();
      }
      
      if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
        return []; // Return empty if still not ready
      }
    }

    const alternatives = tailwindIntelligence.getAlternatives(className, 15);
    return alternatives.map(alt => alt.name);
  }

  // Replace a class with another
  function replaceClass(oldClass, newClass) {
    if (!selectedElement) return;
    
    selectedElement.classList.remove(oldClass);
    selectedElement.classList.add(newClass);
    
    const classes = Array.from(selectedElement.classList);
    displayAppliedClasses(classes);
    generateSuggestions(classes);
  }

  // Remove a class from the selected element
  function removeClass(className) {
    if (!selectedElement) return;
    
    selectedElement.classList.remove(className);
    const classes = Array.from(selectedElement.classList);
    displayAppliedClasses(classes);
    generateSuggestions(classes);
  }

  // Add a class to the selected element
  function addClass(className) {
    if (!selectedElement) return;
    
    selectedElement.classList.add(className);
    const classes = Array.from(selectedElement.classList);
    displayAppliedClasses(classes);
    generateSuggestions(classes);
  }

  // Generate intelligent class suggestions
  function generateSuggestions(classes) {
    if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
      // Initialize immediately if not ready
      if (!tailwindIntelligence) {
        initializeTailwindIntelligence();
      }
      
      if (!tailwindIntelligence || !tailwindIntelligence.initialized) {
        document.getElementById('suggestions').style.display = 'none';
        return;
      }
    }

    // Get contextual suggestions based on existing classes
    const suggestions = tailwindIntelligence.getContextualSuggestions(classes, 8);
    
    // Display suggestions
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    
    if (suggestions.length === 0) {
      document.getElementById('suggestions').style.display = 'none';
      return;
    }
    
    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.style.cssText = `
        padding: 10px 12px;
        margin-bottom: 6px;
        background-color: #f8fafc;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #e2e8f0;
        position: relative;
      `;
      
      const categoryColor = getCategoryColor(suggestion.category);
      
      suggestionItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <div style="font-family: monospace; font-size: 13px; font-weight: 600; color: #111827;">${suggestion.name}</div>
          <div style="background: ${categoryColor}; color: white; padding: 1px 4px; border-radius: 2px; font-size: 9px; font-weight: 500; text-transform: uppercase;">${suggestion.category}</div>
        </div>
        <div style="font-size: 11px; color: #6B7280; line-height: 1.3;">${suggestion.description}</div>
        ${suggestion.css ? `<div style="font-size: 10px; color: #9CA3AF; font-family: monospace; margin-top: 4px; background: #f1f5f9; padding: 2px 4px; border-radius: 2px;">${suggestion.css}</div>` : ''}
      `;
      
      suggestionItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#e0f2fe';
        this.style.borderColor = '#3B82F6';
        this.style.transform = 'translateX(4px)';
      });
      
      suggestionItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f8fafc';
        this.style.borderColor = '#e2e8f0';
        this.style.transform = 'translateX(0)';
      });
      
      suggestionItem.addEventListener('click', () => {
        // Add visual feedback
        suggestionItem.style.backgroundColor = '#10B981';
        suggestionItem.style.borderColor = '#10B981';
        suggestionItem.style.color = 'white';
        
        setTimeout(() => {
          addClass(suggestion.name);
        }, 150);
      });
      
      suggestionsList.appendChild(suggestionItem);
    });
    
    document.getElementById('suggestions').style.display = 'block';
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }

})(); // End of IIFE