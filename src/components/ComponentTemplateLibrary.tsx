import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ComponentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  html: string;
  classes: string[];
}

interface ComponentTemplateLibraryProps {
  onTemplateSelect: (html: string, classes: string[]) => void;
}

const ComponentTemplateLibrary: React.FC<ComponentTemplateLibraryProps> = ({ onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ComponentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Component categories
  const categories = [
    'all',
    'navigation',
    'forms',
    'cards',
    'modals',
    'layout',
    'buttons',
    'alerts',
    'badges'
  ];

  // Mock component templates
  const templates: ComponentTemplate[] = [
    {
      id: '1',
      name: 'Navigation Bar',
      category: 'navigation',
      description: 'Responsive navigation bar with logo and menu items',
      preview: 'nav',
      html: `<nav class="flex items-center justify-between p-4 bg-white shadow">
  <div class="text-xl font-bold">Logo</div>
  <div class="hidden md:flex space-x-4">
    <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
    <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
    <a href="#" class="text-gray-600 hover:text-gray-900">Services</a>
    <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
  </div>
  <button class="md:hidden">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </button>
</nav>`,
      classes: ['flex', 'items-center', 'justify-between', 'p-4', 'bg-white', 'shadow', 'text-xl', 'font-bold', 'hidden', 'md:flex', 'space-x-4', 'text-gray-600', 'hover:text-gray-900', 'md:hidden']
    },
    {
      id: '2',
      name: 'Contact Form',
      category: 'forms',
      description: 'Simple contact form with validation',
      preview: 'form',
      html: `<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
    <input type="text" class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input type="email" class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
  </div>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
    <textarea rows="4" class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"></textarea>
  </div>
  <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send Message</button>
</form>`,
      classes: ['space-y-4', 'block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1', 'w-full', 'p-2', 'border', 'rounded', 'focus:ring-blue-500', 'focus:border-blue-500', 'px-4', 'py-2', 'bg-blue-500', 'text-white', 'hover:bg-blue-600']
    },
    {
      id: '3',
      name: 'Feature Card',
      category: 'cards',
      description: 'Card component for displaying features',
      preview: 'card',
      html: `<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="p-6">
    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
    </div>
    <h3 class="text-lg font-semibold mb-2">Fast Performance</h3>
    <p class="text-gray-600">Optimized for speed and efficiency to provide the best user experience.</p>
  </div>
</div>`,
      classes: ['bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'p-6', 'w-12', 'h-12', 'bg-blue-100', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'mb-4', 'w-6', 'h-6', 'text-blue-500', 'text-lg', 'font-semibold', 'mb-2', 'text-gray-600']
    },
    {
      id: '4',
      name: 'Modal Dialog',
      category: 'modals',
      description: 'Modal dialog for confirmations and forms',
      preview: 'modal',
      html: `<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg max-w-md w-full">
    <div class="p-6">
      <h3 class="text-lg font-semibold mb-2">Confirm Action</h3>
      <p class="text-gray-600 mb-6">Are you sure you want to perform this action?</p>
      <div class="flex justify-end space-x-3">
        <button class="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
        <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
      </div>
    </div>
  </div>
</div>`,
      classes: ['fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'p-4', 'bg-white', 'rounded-lg', 'max-w-md', 'w-full', 'p-6', 'text-lg', 'font-semibold', 'mb-2', 'text-gray-600', 'mb-6', 'flex', 'justify-end', 'space-x-3', 'px-4', 'py-2', 'border', 'rounded', 'hover:bg-gray-50', 'bg-red-500', 'text-white', 'hover:bg-red-600']
    },
    {
      id: '5',
      name: 'Button Group',
      category: 'buttons',
      description: 'Group of related buttons with different styles',
      preview: 'buttons',
      html: `<div class="flex space-x-3">
  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Primary</button>
  <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Secondary</button>
  <button class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Outline</button>
  <button class="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded">Ghost</button>
</div>`,
      classes: ['flex', 'space-x-3', 'px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded', 'hover:bg-blue-600', 'bg-gray-200', 'text-gray-800', 'hover:bg-gray-300', 'border', 'border-gray-300', 'rounded', 'hover:bg-gray-50', 'text-blue-500', 'hover:bg-blue-50', 'rounded']
    },
    {
      id: '6',
      name: 'Alert Banner',
      category: 'alerts',
      description: 'Alert banner for notifications and warnings',
      preview: 'alert',
      html: `<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-blue-800">Information</h3>
      <div class="mt-2 text-sm text-blue-700">
        <p>This is an informational alert message.</p>
      </div>
    </div>
  </div>
</div>`,
      classes: ['p-4', 'bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'flex', 'flex-shrink-0', 'h-5', 'w-5', 'text-blue-400', 'ml-3', 'text-sm', 'font-medium', 'text-blue-800', 'mt-2', 'text-sm', 'text-blue-700']
    },
    {
      id: '7',
      name: 'Status Badge',
      category: 'badges',
      description: 'Badge component for status indicators',
      preview: 'badge',
      html: `<div class="flex space-x-2">
  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">New</span>
</div>`,
      classes: ['flex', 'space-x-2', 'px-2', 'py-1', 'text-xs', 'font-semibold', 'rounded-full', 'bg-green-100', 'text-green-800', 'bg-yellow-100', 'text-yellow-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800']
    },
    {
      id: '8',
      name: 'Two Column Layout',
      category: 'layout',
      description: 'Responsive two column layout',
      preview: 'layout',
      html: `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-3">Column 1</h3>
    <p class="text-gray-600">This is the first column of the two-column layout. It will stack on mobile devices.</p>
  </div>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-3">Column 2</h3>
    <p class="text-gray-600">This is the second column of the two-column layout. It will stack on mobile devices.</p>
  </div>
</div>`,
      classes: ['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6', 'bg-white', 'p-6', 'rounded-lg', 'shadow', 'text-lg', 'font-semibold', 'mb-3', 'text-gray-600']
    }
  ];

  // Filter templates by category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Apply template
  const applyTemplate = (template: ComponentTemplate) => {
    onTemplateSelect(template.html, template.classes);
    setSelectedTemplate(template);
    
    // Animate selection
    gsap.from('.template-preview', {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3">Component Templates</h3>
        
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{template.name}</h4>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
                {template.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 font-mono">
                {template.classes.length} classes
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyTemplate(template);
                }}
                className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Template Preview</h4>
          <div className="template-preview bg-white border rounded-lg p-4 mb-4">
            <div dangerouslySetInnerHTML={{ __html: selectedTemplate.html }} />
          </div>
          
          <div className="mb-4">
            <h5 className="font-medium text-sm mb-2">HTML Code</h5>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded text-xs overflow-x-auto">
              {selectedTemplate.html}
            </pre>
          </div>
          
          <div>
            <h5 className="font-medium text-sm mb-2">Tailwind Classes</h5>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.classes.map((cls, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono"
                >
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No templates found</p>
          <p className="text-xs text-gray-500 mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
};

export default ComponentTemplateLibrary;