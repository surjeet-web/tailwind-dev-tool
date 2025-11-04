# Component Architecture & Interaction Patterns

## Overview

This document outlines the component architecture and interaction patterns for the redesigned Tailwind CSS Developer Tools extension. The architecture follows modern React patterns with a focus on reusability, performance, and maintainability.

## Architecture Principles

### 1. Component Composition
- **Atomic Design**: Atoms, molecules, organisms, templates, pages
- **Compound Components**: Flexible component composition
- **Render Props**: Advanced component customization
- **Hooks Pattern**: Logic reuse and state management

### 2. State Management
- **Local State**: Component-specific state
- **Context API**: Cross-component state sharing
- **Custom Hooks**: Complex logic abstraction
- **State Machines**: Complex state transitions

### 3. Performance Optimization
- **Memoization**: React.memo, useMemo, useCallback
- **Virtual Scrolling**: Large list rendering
- **Code Splitting**: Lazy loading of components
- **Debouncing**: Input optimization

## Component Hierarchy

```
App
├── ExtensionProvider
│   ├── ThemeProvider
│   ├── SettingsProvider
│   └── ElementProvider
├── ExtensionPanel
│   ├── PanelHeader
│   ├── TabNavigation
│   └── TabContent
│       ├── InspectorTab
│       ├── DesignTab
│       ├── ResponsiveTab
│       ├── AccessibilityTab
│       └── TemplatesTab
└── GlobalComponents
    ├── Modal
    ├── Tooltip
    ├── Notification
    └── ContextMenu
```

## Core Component Specifications

### 1. Provider Components

#### ExtensionProvider
```typescript
interface ExtensionProviderProps {
  children: React.ReactNode;
}

interface ExtensionContextValue {
  isVisible: boolean;
  selectedElement: ElementInfo | null;
  settings: ExtensionSettings;
  theme: Theme;
  actions: {
    togglePanel: () => void;
    selectElement: (element: ElementInfo) => void;
    updateSettings: (settings: Partial<ExtensionSettings>) => void;
    applyClass: (className: string) => void;
    removeClass: (className: string) => void;
  };
}
```

#### ElementProvider
```typescript
interface ElementProviderProps {
  children: React.ReactNode;
}

interface ElementContextValue {
  elementInfo: ElementInfo | null;
  computedStyles: ComputedStyle[];
  classHierarchy: ClassHierarchy;
  inheritedStyles: InheritedStyle[];
  actions: {
    inspectElement: () => void;
    updateElement: (updates: Partial<ElementInfo>) => void;
    applyClasses: (classes: string[]) => void;
    removeClasses: (classes: string[]) => void;
  };
}
```

### 2. Layout Components

#### PanelHeader
```typescript
interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onClose?: () => void;
  onSettings?: () => void;
}

// Usage patterns
<PanelHeader 
  title="Inspector" 
  subtitle="body > div.container > p"
  actions={<HeaderActions />}
  onClose={handleClose}
  onSettings={openSettings}
/>
```

#### TabNavigation
```typescript
interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}
```

### 3. Inspector Components

#### ElementOverview
```typescript
interface ElementOverviewProps {
  elementInfo: ElementInfo;
  onElementSelect?: (element: ElementInfo) => void;
}

// Features
- DOM path visualization
- Element metrics display
- State indicators
- Quick actions
```

#### ClassManager
```typescript
interface ClassManagerProps {
  classes: AppliedClass[];
  onClassAdd: (className: string) => void;
  onClassRemove: (className: string) => void;
  onClassToggle: (className: string) => void;
  onClassEdit: (oldClass: string, newClass: string) => void;
}

interface AppliedClass {
  name: string;
  source: 'direct' | 'inherited' | 'computed';
  specificity: number;
  conflicts?: string[];
  variants?: ResponsiveVariant[];
}
```

#### SmartSearch
```typescript
interface SmartSearchProps {
  onSearch: (query: string) => void;
  onSuggestionSelect: (suggestion: ClassSuggestion) => void;
  placeholder?: string;
  className?: string;
}

interface ClassSuggestion {
  name: string;
  description: string;
  category: string;
  confidence: number;
  preview?: string;
}
```

### 4. Design Tools Components

#### UnifiedDesignWorkspace
```typescript
interface UnifiedDesignWorkspaceProps {
  selectedTool: DesignTool;
  onToolChange: (tool: DesignTool) => void;
  elementInfo: ElementInfo;
  onPropertyChange: (property: string, value: any) => void;
}

type DesignTool = 'color' | 'spacing' | 'typography' | 'animation' | 'effects';
```

#### ColorTool
```typescript
interface ColorToolProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  colorFormat?: 'hex' | 'rgb' | 'hsl' | 'tailwind';
  showPresets?: boolean;
  showRecent?: boolean;
}

// Features
- Color picker with multiple formats
- Tailwind color palette integration
- Custom color management
- Color contrast checking
- Recent colors history
```

#### SpacingTool
```typescript
interface SpacingToolProps {
  spacing: SpacingValues;
  onSpacingChange: (spacing: SpacingValues) => void;
  unit?: 'px' | 'rem' | 'tailwind';
  showPreview?: boolean;
}

interface SpacingValues {
  margin: MarginValues;
  padding: PaddingValues;
  gap: number;
}

// Features
- Visual spacing editor
- Multiple input methods
- Live preview
- Preset spacing patterns
```

#### TypographyTool
```typescript
interface TypographyToolProps {
  typography: TypographyValues;
  onTypographyChange: (typography: TypographyValues) => void;
  showWebFonts?: boolean;
  showPreview?: boolean;
}

interface TypographyValues {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
}
```

### 5. Responsive Previewer Components

#### DevicePreviewer
```typescript
interface DevicePreviewerProps {
  devices: Device[];
  selectedDevice: Device;
  onDeviceChange: (device: Device) => void;
  customWidth: number;
  onCustomWidthChange: (width: number) => void;
  layout: 'single' | 'side-by-side' | 'carousel';
}

interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent?: string;
}
```

#### BreakpointControls
```typescript
interface BreakpointControlsProps {
  breakpoints: Breakpoint[];
  activeBreakpoint: string;
  onBreakpointChange: (breakpoint: string) => void;
  customBreakpoints?: CustomBreakpoint[];
}

interface Breakpoint {
  name: string;
  min: number;
  max?: number;
  class: string;
}
```

#### ResponsiveTestingTools
```typescript
interface ResponsiveTestingToolsProps {
  onNetworkChange: (speed: NetworkSpeed) => void;
  onOrientationChange: (orientation: Orientation) => void;
  onTouchSimulation: (enabled: boolean) => void;
  currentConditions: TestingConditions;
}

interface TestingConditions {
  networkSpeed: NetworkSpeed;
  orientation: Orientation;
  touchEnabled: boolean;
  userAgent: string;
}
```

### 6. Accessibility Checker Components

#### IssueScanner
```typescript
interface IssueScannerProps {
  onScanStart: () => void;
  onScanComplete: (issues: AccessibilityIssue[]) => void;
  isScanning: boolean;
  scanProgress: number;
  scanType: 'quick' | 'comprehensive' | 'custom';
}

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: AccessibilityCategory;
  title: string;
  description: string;
  element: HTMLElement;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  fixes: AccessibilityFix[];
}
```

#### SolutionEngine
```typescript
interface SolutionEngineProps {
  issues: AccessibilityIssue[];
  onFixApply: (fix: AccessibilityFix) => void;
  onFixPreview: (fix: AccessibilityFix) => void;
  aiSuggestions: boolean;
}

interface AccessibilityFix {
  id: string;
  type: 'automatic' | 'manual' | 'suggested';
  description: string;
  classes?: string[];
  attributes?: Record<string, string>;
  impact: FixImpact;
}
```

#### AccessibilityReporter
```typescript
interface AccessibilityReporterProps {
  issues: AccessibilityIssue[];
  score: AccessibilityScore;
  onReportGenerate: (format: 'pdf' | 'html' | 'json') => void;
  onHistoryView: () => void;
}

interface AccessibilityScore {
  overall: number;
  categories: Record<AccessibilityCategory, number>;
  compliance: ComplianceLevel;
}
```

## Interaction Patterns

### 1. Navigation Patterns

#### Tab Navigation
```typescript
const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default'
}) => {
  return (
    <nav className={`tab-navigation tab-navigation--${variant}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={cn(
            'tab-navigation__tab',
            { 'tab-navigation__tab--active': activeTab === tab.id }
          )}
          onClick={() => onTabChange(tab.id)}
          disabled={tab.disabled}
        >
          {tab.icon && <span className="tab-navigation__icon">{tab.icon}</span>}
          <span className="tab-navigation__label">{tab.label}</span>
          {tab.badge && (
            <span className="tab-navigation__badge">{tab.badge}</span>
          )}
        </button>
      ))}
    </nav>
  );
};
```

#### Context Menu
```typescript
const useContextMenu = () => {
  const [context, setContext] = useState<ContextMenuContext | null>(null);
  
  const showContextMenu = useCallback((event: MouseEvent, items: ContextMenuItem[]) => {
    setContext({
      x: event.clientX,
      y: event.clientY,
      items
    });
  }, []);
  
  const hideContextMenu = useCallback(() => {
    setContext(null);
  }, []);
  
  return { context, showContextMenu, hideContextMenu };
};
```

### 2. Input Patterns

#### Smart Input
```typescript
const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  suggestions,
  onSelect,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  
  const handleInputChange = useCallback((input: string) => {
    onChange(input);
    setFilteredSuggestions(
      suggestions.filter(s => 
        s.toLowerCase().includes(input.toLowerCase())
      )
    );
    setIsOpen(true);
  }, [onChange, suggestions]);
  
  return (
    <div className="smart-input">
      <input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="smart-input__field"
      />
      {isOpen && (
        <div className="smart-input__suggestions">
          {filteredSuggestions.map(suggestion => (
            <div
              key={suggestion}
              className="smart-input__suggestion"
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### Range Slider
```typescript
const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  marks,
  label
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging, handleMouseUp]);
  
  return (
    <div className="range-slider">
      {label && <label className="range-slider__label">{label}</label>}
      <div className="range-slider__track">
        <div 
          className="range-slider__fill"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        {marks?.map(mark => (
          <div
            key={mark.value}
            className="range-slider__mark"
            style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
          >
            <span className="range-slider__mark-label">{mark.label}</span>
          </div>
        ))}
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="range-slider__input"
        />
      </div>
    </div>
  );
};
```

### 3. Display Patterns

#### Virtual List
```typescript
const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  height,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(height / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <div
      ref={containerRef}
      className="virtual-list"
      style={{ height }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### Progressive Loading
```typescript
const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  children,
  fallback,
  delay = 200
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (isLoading) {
    return fallback || <div className="progressive-loader" />;
  }
  
  return <>{children}</>;
};
```

## Custom Hooks

### useElementInspector
```typescript
const useElementInspector = () => {
  const [elementInfo, setElementInfo] = useState<ElementInfo | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  
  const startInspection = useCallback(() => {
    setIsInspecting(true);
    // Enable inspection mode
  }, []);
  
  const stopInspection = useCallback(() => {
    setIsInspecting(false);
    // Disable inspection mode
  }, []);
  
  const selectElement = useCallback((element: HTMLElement) => {
    const info = analyzeElement(element);
    setElementInfo(info);
    stopInspection();
  }, [stopInspection]);
  
  return {
    elementInfo,
    isInspecting,
    startInspection,
    stopInspection,
    selectElement
  };
};
```

### useClassManager
```typescript
const useClassManager = (initialClasses: string[] = []) => {
  const [classes, setClasses] = useState<string[]>(initialClasses);
  
  const addClass = useCallback((className: string) => {
    setClasses(prev => [...prev, className]);
  }, []);
  
  const removeClass = useCallback((className: string) => {
    setClasses(prev => prev.filter(c => c !== className));
  }, []);
  
  const toggleClass = useCallback((className: string) => {
    setClasses(prev => 
      prev.includes(className) 
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  }, []);
  
  const replaceClass = useCallback((oldClass: string, newClass: string) => {
    setClasses(prev => 
      prev.map(c => c === oldClass ? newClass : c)
    );
  }, []);
  
  return {
    classes,
    addClass,
    removeClass,
    toggleClass,
    replaceClass
  };
};
```

### useResponsivePreview
```typescript
const useResponsivePreview = () => {
  const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
  const [customWidth, setCustomWidth] = useState(768);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const applyDevice = useCallback((device: Device) => {
    setCurrentDevice(device);
    setCustomWidth(device.width);
  }, []);
  
  const applyCustomWidth = useCallback((width: number) => {
    setCustomWidth(width);
    setCurrentDevice(null);
  }, []);
  
  const rotateOrientation = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);
  
  return {
    currentDevice,
    customWidth,
    orientation,
    applyDevice,
    applyCustomWidth,
    rotateOrientation
  };
};
```

## Performance Optimizations

### 1. Memoization Strategies
```typescript
const MemoizedClassManager = React.memo(ClassManager, (prevProps, nextProps) => {
  return (
    prevProps.classes.length === nextProps.classes.length &&
    prevProps.classes.every(c => nextProps.classes.includes(c)) &&
    prevProps.onClassAdd === nextProps.onClassAdd &&
    prevProps.onClassRemove === nextProps.onClassRemove
  );
});
```

### 2. Virtual Scrolling
```typescript
const VirtualizedClassList: React.FC<VirtualizedClassListProps> = ({
  classes,
  onClassSelect
}) => {
  return (
    <VirtualList
      items={classes}
      itemHeight={32}
      height={400}
      renderItem={(className, index) => (
        <ClassItem
          key={`${className}-${index}`}
          className={className}
          onSelect={() => onClassSelect(className)}
        />
      )}
    />
  );
};
```

### 3. Debounced Search
```typescript
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const DebouncedSearch: React.FC<DebouncedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search classes..."
    />
  );
};
```

## Testing Strategies

### 1. Component Testing
```typescript
describe('ClassManager', () => {
  it('should add class when addClass is called', () => {
    const onClassAdd = jest.fn();
    render(<ClassManager classes={['p-4']} onClassAdd={onClassAdd} />);
    
    fireEvent.click(screen.getByText('Add Class'));
    fireEvent.change(screen.getByPlaceholderText('Enter class'), {
      target: { value: 'm-2' }
    });
    fireEvent.click(screen.getByText('Apply'));
    
    expect(onClassAdd).toHaveBeenCalledWith('m-2');
  });
});
```

### 2. Hook Testing
```typescript
describe('useClassManager', () => {
  it('should add class to classes array', () => {
    const { result } = renderHook(() => useClassManager(['p-4']));
    
    act(() => {
      result.current.addClass('m-2');
    });
    
    expect(result.current.classes).toEqual(['p-4', 'm-2']);
  });
});
```

### 3. Integration Testing
```typescript
describe('Extension Integration', () => {
  it('should apply class to selected element', async () => {
    const mockElement = document.createElement('div');
    jest.spyOn(document, 'querySelector').mockReturnValue(mockElement);
    
    render(<ExtensionPanel isVisible={true} onClose={() => {}} />);
    
    fireEvent.click(screen.getByText('Inspect Element'));
    fireEvent.click(screen.getByText('Add Class'));
    fireEvent.change(screen.getByPlaceholderText('Enter class'), {
      target: { value: 'bg-blue-500' }
    });
    fireEvent.click(screen.getByText('Apply'));
    
    expect(mockElement.className).toContain('bg-blue-500');
  });
});
```

## Conclusion

This component architecture provides a solid foundation for building a modern, maintainable, and performant Tailwind CSS Developer Tools extension. The patterns and components outlined here ensure consistency across all pages while allowing for flexibility and extensibility.

The architecture emphasizes:
- **Reusability** through atomic design principles
- **Performance** through optimization strategies
- **Maintainability** through clear separation of concerns
- **Extensibility** through flexible component composition
- **Testability** through well-defined interfaces

By following these patterns and using these components, the development team can build a robust and user-friendly extension that meets the highest standards of modern web development.