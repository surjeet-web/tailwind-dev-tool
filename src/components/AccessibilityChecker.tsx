import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  element: string;
  suggestion: string;
  fix?: string;
}

interface AccessibilityCheckerProps {
  onFixApply: (fix: string) => void;
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ onFixApply }) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null);

  // Mock accessibility issues for demo
  const mockIssues: AccessibilityIssue[] = [
    {
      id: '1',
      type: 'error',
      title: 'Insufficient Color Contrast',
      description: 'The text color does not have enough contrast with the background color.',
      element: 'button.primary',
      suggestion: 'Increase the color contrast ratio to at least 4.5:1',
      fix: 'text-white bg-blue-600'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Missing Alt Text',
      description: 'Image is missing alternative text for screen readers.',
      element: 'img.hero-image',
      suggestion: 'Add descriptive alt text to the image',
      fix: 'alt="Hero image showing product features"'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Missing Form Label',
      description: 'Form input does not have an associated label.',
      element: 'input#email',
      suggestion: 'Add a label element or aria-label attribute',
      fix: 'aria-label="Email address"'
    },
    {
      id: '4',
      type: 'info',
      title: 'Consider ARIA Roles',
      description: 'Custom interactive elements should have appropriate ARIA roles.',
      element: 'div.custom-button',
      suggestion: 'Add role="button" to make it accessible',
      fix: 'role="button"'
    },
    {
      id: '5',
      type: 'error',
      title: 'Empty Heading',
      description: 'Heading element has no text content.',
      element: 'h3.subtitle',
      suggestion: 'Add text content or remove the empty heading',
      fix: 'Remove empty heading'
    }
  ];

  // Simulate accessibility scan
  const scanAccessibility = () => {
    setIsScanning(true);
    setIssues([]);
    
    // Simulate scanning delay
    setTimeout(() => {
      setIssues(mockIssues);
      setIsScanning(false);
      
      // Animate results
      gsap.from('.issue-item', {
        opacity: 0,
        x: -20,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }, 1500);
  };

  // Apply fix for an issue
  const applyFix = (issue: AccessibilityIssue) => {
    if (issue.fix) {
      onFixApply(issue.fix);
      
      // Remove the issue from the list
      setIssues(issues.filter(i => i.id !== issue.id));
      if (selectedIssue?.id === issue.id) {
        setSelectedIssue(null);
      }
    }
  };

  // Get issue type icon
  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Get issue type color
  const getIssueColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Count issues by type
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-3">Accessibility Scanner</h3>
        <button
          onClick={scanAccessibility}
          disabled={isScanning}
          className={`w-full py-2 rounded flex items-center justify-center ${
            isScanning
              ? 'bg-gray-200 text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isScanning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scanning...
            </>
          ) : (
            'Scan for Accessibility Issues'
          )}
        </button>
      </div>

      {issues.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Issues Found</h4>
            <div className="flex space-x-2">
              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                {errorCount} Errors
              </span>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                {warningCount} Warnings
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {infoCount} Info
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`issue-item p-3 border rounded cursor-pointer transition-all ${
                  getIssueColor(issue.type)
                } ${selectedIssue?.id === issue.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-sm">{issue.title}</h5>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {issue.element}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                    {selectedIssue?.id === issue.id && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-gray-700 mb-2">Suggestion:</p>
                        <p className="text-xs text-gray-600 mb-3">{issue.suggestion}</p>
                        
                        {issue.fix && (
                          <div className="flex justify-between items-center">
                            <div className="text-xs font-mono bg-gray-800 text-gray-200 px-2 py-1 rounded">
                              {issue.fix}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                applyFix(issue);
                              }}
                              className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Apply Fix
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {issues.length === 0 && !isScanning && (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No accessibility issues found!</p>
          <p className="text-xs text-gray-500 mt-1">Click "Scan" to check for accessibility issues</p>
        </div>
      )}

      <div className="pt-4 border-t">
        <h4 className="font-medium mb-2">Accessibility Guidelines</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 flex-shrink-0">1</div>
            <p>Ensure text has sufficient color contrast (at least 4.5:1)</p>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 flex-shrink-0">2</div>
            <p>Provide alternative text for all meaningful images</p>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 flex-shrink-0">3</div>
            <p>Ensure all form inputs have associated labels</p>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 flex-shrink-0">4</div>
            <p>Use semantic HTML elements appropriately</p>
          </div>
          <div className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2 flex-shrink-0">5</div>
            <p>Ensure the interface is keyboard navigable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityChecker;