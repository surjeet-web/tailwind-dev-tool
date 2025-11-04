# Screen Design Documentation - Tailwind CSS Developer Tools Extension

## Table of Contents
1. [Extension UI Overview](#extension-ui-overview)
2. [Main Interface Components](#main-interface-components)
3. [Screen Layouts](#screen-layouts)
4. [Visual Design Elements](#visual-design-elements)
5. [Interactive Elements](#interactive-elements)
6. [Responsive Design](#responsive-design)
7. [Accessibility Considerations](#accessibility-considerations)

## Extension UI Overview

The extension consists of two primary UI components:
1. **Browser Toolbar Icon** - Quick access to enable/disable the extension
2. **Floating Panel** - The main interface that appears when inspecting elements

### Browser Toolbar Icon
- A clean, recognizable icon representing Tailwind CSS
- Visual state indicators:
  - Default: Inactive state
  - Active: Extension is enabled and ready to inspect
  - Processing: Visual feedback when the extension is working

## Main Interface Components

### 1. Floating Panel Structure
The main floating panel is divided into several key sections:

#### Header Section
- **Extension Logo/Title**: Branding and identification
- **Close Button**: Dismiss the panel
- **Settings Icon**: Access to extension preferences
- **Help Icon**: Quick access to documentation

#### Element Information Section
- **Selected Element Path**: DOM hierarchy display
- **Element Tag**: HTML tag of the selected element
- **Applied Classes**: List of all Tailwind classes currently applied

#### Class Management Section
- **Active Classes Display**: Visual representation of all applied classes
- **Add Class Input**: Field to add new Tailwind classes
- **Class Search Bar**: Real-time search for Tailwind utilities
- **Class Suggestions Panel**: Context-aware alternatives and related classes

#### Tools Section
- **Tool Tabs**: Organized access to various features
  - Inspector
  - Visual Design Tools
  - Component Templates
  - Accessibility Checker
  - Responsive Preview

### 2. Inspector Tool Interface
- **Element Highlighting**: Visual overlay on the selected element
- **Class List**: Scrollable list of all applied classes with:
  - Remove button (×) for each class
  - Toggle switches for responsive variants
  - Hover effects to show class impact

### 3. Visual Design Tools Interface
- **Color Picker**:
  - Visual color selection interface
  - Custom color input (hex, rgb)
  - Integration with project's color palette
  - Preview of color classes

- **Spacing Calculator**:
  - Visual sliders for margin, padding, gap adjustments
  - Live preview of changes
  - Auto-suggestion of nearest Tailwind spacing classes

- **Animation Preview**:
  - List of available animation classes
  - Play buttons to preview animations
  - Apply animation to selected element

### 4. Component Template Library Interface
- **Template Categories**:
  - Navigation components
  - Form elements
  - Cards and containers
  - Modals and overlays
  - Layout patterns

- **Template Preview**:
  - Visual preview of each template
  - Apply button to insert template
  - Customization options

### 5. Accessibility Checker Interface
- **Issue Summary**:
  - Pass/Fail indicators
  - Severity levels (error, warning, info)
  - Count of issues found

- **Issue Details**:
  - Description of accessibility issue
  - Suggested fixes
  - One-click apply for suggested classes

### 6. Responsive Breakpoint Previewer
- **Breakpoint Buttons**:
  - Quick selection for common breakpoints
  - Custom width input
  - Device presets (mobile, tablet, desktop)

- **Preview Pane**:
  - Resizable preview area
  - Current viewport dimensions
  - Orientation toggle

## Screen Layouts

### Default Layout
```
+-----------------------------------+
| Header: Logo | Title | Settings    |
+-----------------------------------+
| Element Path: body > div > p      |
+-----------------------------------+
| Applied Classes:                  |
| - text-lg                         |
| - font-bold                       |
| - text-blue-600                   |
| - [×] [×] [×]                     |
+-----------------------------------+
| Add Class: [__________] [Search]  |
+-----------------------------------+
| Suggestions:                      |
| - text-xl                         |
| - text-blue-700                   |
| - hover:text-blue-800             |
+-----------------------------------+
| Tools: [Inspector] [Design] [A11y]|
+-----------------------------------+
```

### Visual Design Tools Layout
```
+-----------------------------------+
| Header: Logo | Title | Settings    |
+-----------------------------------+
| Element Path: body > div > p      |
+-----------------------------------+
| Color Picker | Spacing | Animation|
+-----------------------------------+
| [Color Palette]                   |
| #3B82F6 [Apply text-blue-500]     |
|                                   |
| [Spacing Sliders]                 |
| Margin: [====] M-4                |
| Padding: [==] P-2                 |
+-----------------------------------+
| Preview of selected element       |
+-----------------------------------+
```

### Responsive Preview Layout
```
+-----------------------------------+
| Header: Logo | Title | Settings    |
+-----------------------------------+
| Breakpoints: [SM] [MD] [LG] [XL]  |
+-----------------------------------+
| +-----------------------------+   |
| |                             |   |
| |   Preview Area              |   |
| |                             |   |
| |                             |   |
| +-----------------------------+   |
| Width: 768px                  |
+-----------------------------------+
```

## Visual Design Elements

### Color Scheme
- **Primary**: Tailwind Blue (#3B82F6)
- **Secondary**: Gray scale for neutral elements (#6B7280, #9CA3AF, #F3F4F6)
- **Success**: Green for positive actions (#10B981)
- **Warning**: Yellow for warnings (#F59E0B)
- **Error**: Red for errors (#EF4444)

### Typography
- **Headings**: Inter, Bold, 16px
- **Body Text**: Inter, Regular, 14px
- **Code/Classes**: JetBrains Mono, Regular, 13px

### Spacing
- **Padding**: 4px base unit, multiples for hierarchy
- **Margins**: 4px base unit, with 8px for component separation
- **Gaps**: 8px between related elements

### Borders and Shadows
- **Borders**: 1px solid #E5E7EB for containers
- **Shadows**: Subtle box-shadow for floating elements
- **Rounded Corners**: 6px radius for containers, 4px for buttons

## Interactive Elements

### Buttons
- **Primary Action**: Blue background, white text, hover effect
- **Secondary Action**: Gray background, darker text
- **Icon Buttons**: Square with icon, subtle background on hover
- **Toggle Buttons**: Visual state change when active

### Inputs
- **Text Inputs**: Border focus state, clear button
- **Search Inputs**: Search icon prefix, real-time filtering
- **Sliders**: Visual track with draggable thumb
- **Color Picker**: Swatch display with picker dialog

### Hover States
- **Buttons**: Slightly darker background
- **Interactive Elements**: Subtle border or background change
- **Class Items**: Highlight with background color change

### Transitions
- **Panel Open/Close**: Smooth slide animation
- **State Changes**: 200ms transition for interactive elements
- **Hover Effects**: 150ms ease-in-out

## Responsive Design

### Panel Adaptation
- **Large Screens**: Full panel with all sections visible
- **Medium Screens**: Collapsible sections, vertical stacking
- **Small Screens**: Minimal interface, essential controls only

### Touch Considerations
- **Minimum Touch Targets**: 44px × 44px
- **Spacing**: Increased spacing between touch targets
- **Gestures**: Swipe support for tool switching

## Accessibility Considerations

### Keyboard Navigation
- **Tab Order**: Logical flow through all interactive elements
- **Keyboard Shortcuts**: Documented shortcuts for all main actions
- **Focus Indicators**: Clear visual indication of focus

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all controls
- **Live Regions**: Announcements for dynamic content changes
- **Semantic HTML**: Proper HTML structure for assistive technologies

### Color and Contrast
- **Text Contrast**: Minimum 4.5:1 ratio for normal text
- **UI Elements**: Sufficient contrast for interactive elements
- **Color-Independent**: Not relying solely on color for information

### Visual Indicators
- **Status Indicators**: Icons and text for status information
- **Error Messages**: Clear visual and text indicators
- **Help Text**: Additional context where needed