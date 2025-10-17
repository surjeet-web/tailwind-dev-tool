# Unified Design System

## Overview

This document outlines the unified design system for the redesigned Tailwind CSS Developer Tools extension. The design system ensures consistency, accessibility, and a modern user experience across all pages and components.

## Design Principles

### 1. Clarity & Simplicity
- Clean, uncluttered interfaces
- Clear visual hierarchy
- Intuitive navigation patterns
- Minimal cognitive load

### 2. Consistency
- Unified visual language
- Consistent interaction patterns
- Predictable component behavior
- Standardized spacing and typography

### 3. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast options

### 4. Performance
- Optimized assets and animations
- Efficient rendering
- Smooth interactions
- Minimal resource usage

## Color System

### Primary Color Palette
```css
:root {
  /* Brand Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Semantic Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  --info-50: #f0f9ff;
  --info-500: #0ea5e9;
  --info-600: #0284c7;
}
```

### Neutral Color Palette
```css
:root {
  /* Light Theme */
  --neutral-0: #ffffff;
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
}

[data-theme="dark"] {
  /* Dark Theme */
  --neutral-0: #111827;
  --neutral-50: #1f2937;
  --neutral-100: #374151;
  --neutral-200: #4b5563;
  --neutral-300: #6b7280;
  --neutral-400: #9ca3af;
  --neutral-500: #d1d5db;
  --neutral-600: #e5e7eb;
  --neutral-700: #f3f4f6;
  --neutral-800: #f9fafb;
  --neutral-900: #ffffff;
}
```

### Color Usage Guidelines
- **Primary**: Main actions, navigation, important elements
- **Success**: Positive feedback, successful states
- **Warning**: Cautionary messages, attention needed
- **Error**: Error states, destructive actions
- **Info**: Informational content, help text
- **Neutral**: Backgrounds, borders, text, disabled states

## Typography System

### Font Families
```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --font-display: 'Inter Display', system-ui, sans-serif;
}
```

### Type Scale
```css
:root {
  /* Display Typography */
  --text-display-xs:    2.25rem;  /* 36px */
  --text-display-sm:    2.5rem;   /* 40px */
  --text-display-md:    3rem;     /* 48px */
  --text-display-lg:    3.75rem;  /* 60px */
  --text-display-xl:    4.5rem;   /* 72px */
  
  /* Heading Typography */
  --text-h1:            2.25rem;  /* 36px */
  --text-h2:            1.875rem; /* 30px */
  --text-h3:            1.5rem;   /* 24px */
  --text-h4:            1.25rem;  /* 20px */
  --text-h5:            1.125rem; /* 18px */
  --text-h6:            1rem;     /* 16px */
  
  /* Body Typography */
  --text-lg:            1.125rem; /* 18px */
  --text-base:          1rem;     /* 16px */
  --text-sm:            0.875rem; /* 14px */
  --text-xs:            0.75rem;  /* 12px */
  
  /* Line Heights */
  --leading-none:       1;
  --leading-tight:      1.25;
  --leading-snug:       1.375;
  --leading-normal:     1.5;
  --leading-relaxed:    1.625;
  --leading-loose:      2;
  
  /* Font Weights */
  --font-thin:          100;
  --font-light:         300;
  --font-normal:        400;
  --font-medium:        500;
  --font-semibold:      600;
  --font-bold:          700;
  --font-extrabold:     800;
  --font-black:         900;
}
```

### Typography Classes
```css
/* Display Classes */
.text-display-xs { font-size: var(--text-display-xs); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-display-sm { font-size: var(--text-display-sm); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-display-md { font-size: var(--text-display-md); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-display-lg { font-size: var(--text-display-lg); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-display-xl { font-size: var(--text-display-xl); font-weight: var(--font-bold); line-height: var(--leading-tight); }

/* Heading Classes */
.text-h1 { font-size: var(--text-h1); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-h2 { font-size: var(--text-h2); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-h3 { font-size: var(--text-h3); font-weight: var(--font-semibold); line-height: var(--leading-snug); }
.text-h4 { font-size: var(--text-h4); font-weight: var(--font-semibold); line-height: var(--leading-snug); }
.text-h5 { font-size: var(--text-h5); font-weight: var(--font-medium); line-height: var(--leading-normal); }
.text-h6 { font-size: var(--text-h6); font-weight: var(--font-medium); line-height: var(--leading-normal); }

/* Body Classes */
.text-lg { font-size: var(--text-lg); line-height: var(--leading-relaxed); }
.text-base { font-size: var(--text-base); line-height: var(--leading-normal); }
.text-sm { font-size: var(--text-sm); line-height: var(--leading-normal); }
.text-xs { font-size: var(--text-xs); line-height: var(--leading-normal); }

/* Code Classes */
.text-code { font-family: var(--font-mono); font-size: 0.875rem; line-height: var(--leading-normal); }
.text-code-sm { font-family: var(--font-mono); font-size: 0.75rem; line-height: var(--leading-normal); }
```

## Spacing System

### Spacing Scale
```css
:root {
  --space-0:   0;      /* 0px */
  --space-1:   0.25rem; /* 4px */
  --space-2:   0.5rem;  /* 8px */
  --space-3:   0.75rem; /* 12px */
  --space-4:   1rem;    /* 16px */
  --space-5:   1.25rem; /* 20px */
  --space-6:   1.5rem;  /* 24px */
  --space-8:   2rem;    /* 32px */
  --space-10:  2.5rem;  /* 40px */
  --space-12:  3rem;    /* 48px */
  --space-16:  4rem;    /* 64px */
  --space-20:  5rem;    /* 80px */
  --space-24:  6rem;    /* 96px */
  --space-32:  8rem;    /* 128px */
}
```

### Spacing Usage
- **0**: Remove spacing
- **1-2**: Tight spacing, inside components
- **3-4**: Regular spacing, between related elements
- **5-6**: Loose spacing, between sections
- **8+**: Extra loose spacing, major layout divisions

## Layout System

### Container Sizes
```css
:root {
  --container-xs:  20rem;   /* 320px */
  --container-sm:  24rem;   /* 384px */
  --container-md:  28rem;   /* 448px */
  --container-lg:  32rem;   /* 512px */
  --container-xl:  36rem;   /* 576px */
  --container-2xl: 42rem;   /* 672px */
  --container-3xl: 48rem;   /* 768px */
  --container-4xl: 56rem;   /* 896px */
  --container-5xl: 64rem;   /* 1024px */
  --container-6xl: 72rem;   /* 1152px */
  --container-7xl: 80rem;   /* 1280px */
}
```

### Grid System
```css
:root {
  --grid-cols-1:  repeat(1, minmax(0, 1fr));
  --grid-cols-2:  repeat(2, minmax(0, 1fr));
  --grid-cols-3:  repeat(3, minmax(0, 1fr));
  --grid-cols-4:  repeat(4, minmax(0, 1fr));
  --grid-cols-5:  repeat(5, minmax(0, 1fr));
  --grid-cols-6:  repeat(6, minmax(0, 1fr));
  --grid-cols-8:  repeat(8, minmax(0, 1fr));
  --grid-cols-10: repeat(10, minmax(0, 1fr));
  --grid-cols-12: repeat(12, minmax(0, 1fr));
}
```

## Border & Shadow System

### Border Radius
```css
:root {
  --radius-none:   0;
  --radius-sm:     0.125rem; /* 2px */
  --radius-base:   0.25rem;  /* 4px */
  --radius-md:     0.375rem; /* 6px */
  --radius-lg:     0.5rem;   /* 8px */
  --radius-xl:     0.75rem;  /* 12px */
  --radius-2xl:    1rem;     /* 16px */
  --radius-3xl:    1.5rem;   /* 24px */
  --radius-full:   9999px;
}
```

### Border Width
```css
:root {
  --border-0: 0;
  --border: 1px;
  --border-2: 2px;
  --border-4: 4px;
  --border-8: 8px;
}
```

### Shadow System
```css
:root {
  --shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
```

## Component Library

### Button Component
```css
/* Base Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-none);
  border-radius: var(--radius-md);
  border: var(--border-0) solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
}

.btn:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button Variants */
.btn--primary {
  background-color: var(--primary-500);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--primary-600);
}

.btn--secondary {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--neutral-200);
}

.btn--ghost {
  background-color: transparent;
  color: var(--neutral-700);
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--neutral-100);
}

.btn--danger {
  background-color: var(--error-500);
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background-color: var(--error-600);
}

/* Button Sizes */
.btn--sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.btn--lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
}
```

### Input Component
```css
.input {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--neutral-900);
  background-color: var(--neutral-0);
  border: var(--border) solid var(--neutral-300);
  border-radius: var(--radius-md);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:disabled {
  background-color: var(--neutral-50);
  color: var(--neutral-400);
  cursor: not-allowed;
}

.input--error {
  border-color: var(--error-500);
}

.input--error:focus {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### Card Component
```css
.card {
  background-color: var(--neutral-0);
  border: var(--border) solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card--hover {
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.card--hover:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card__header {
  padding: var(--space-6);
  border-bottom: var(--border) solid var(--neutral-200);
}

.card__body {
  padding: var(--space-6);
}

.card__footer {
  padding: var(--space-6);
  border-top: var(--border) solid var(--neutral-200);
  background-color: var(--neutral-50);
}
```

### Badge Component
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* Badge Variants */
.badge--primary {
  background-color: var(--primary-100);
  color: var(--primary-800);
}

.badge--success {
  background-color: var(--success-100);
  color: var(--success-800);
}

.badge--warning {
  background-color: var(--warning-100);
  color: var(--warning-800);
}

.badge--error {
  background-color: var(--error-100);
  color: var(--error-800);
}

.badge--neutral {
  background-color: var(--neutral-100);
  color: var(--neutral-800);
}
```

### Tab Component
```css
.tab-list {
  display: flex;
  border-bottom: var(--border) solid var(--neutral-200);
}

.tab {
  display: flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--neutral-500);
  background-color: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.tab:hover {
  color: var(--neutral-700);
  background-color: var(--neutral-50);
}

.tab--active {
  color: var(--primary-600);
  border-bottom-color: var(--primary-600);
}

.tab:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: -2px;
}

.tab:disabled {
  color: var(--neutral-300);
  cursor: not-allowed;
}
```

## Animation System

### Transition Utilities
```css
:root {
  --transition-fast:     150ms;
  --transition-normal:   200ms;
  --transition-slow:     300ms;
  --transition-slower:   500ms;
  
  --ease-linear:        linear;
  --ease-in:            cubic-bezier(0.4, 0, 1, 1);
  --ease-out:           cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:        cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animation Classes
```css
/* Fade Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Animations */
@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-down {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale Animations */
@keyframes scale-up {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scale-down {
  from { transform: scale(1.05); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Animation Utilities */
.animate-fade-in { animation: fade-in var(--transition-normal) var(--ease-out); }
.animate-fade-out { animation: fade-out var(--transition-normal) var(--ease-out); }
.animate-slide-up { animation: slide-up var(--transition-normal) var(--ease-out); }
.animate-slide-down { animation: slide-down var(--transition-normal) var(--ease-out); }
.animate-scale-up { animation: scale-up var(--transition-normal) var(--ease-out); }
.animate-scale-down { animation: scale-down var(--transition-normal) var(--ease-out); }
```

## Responsive Design System

### Breakpoint System
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media Queries */
@media (min-width: 640px) {
  .sm\:block { display: block; }
  .sm\:hidden { display: none; }
  .sm\:grid-cols-2 { grid-template-columns: var(--grid-cols-2); }
}

@media (min-width: 768px) {
  .md\:block { display: block; }
  .md\:hidden { display: none; }
  .md\:grid-cols-3 { grid-template-columns: var(--grid-cols-3); }
}

@media (min-width: 1024px) {
  .lg\:block { display: block; }
  .lg\:hidden { display: none; }
  .lg\:grid-cols-4 { grid-template-columns: var(--grid-cols-4); }
}
```

## Accessibility Guidelines

### Focus Management
```css
/* Focus Styles */
.focusable:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.focusable:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-600);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: var(--radius-base);
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```css
/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Not Screen Reader Only */
.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Dark Mode Support

### Theme Implementation
```css
/* Theme Variables */
[data-theme="dark"] {
  --color-bg-primary: var(--neutral-0);
  --color-bg-secondary: var(--neutral-50);
  --color-text-primary: var(--neutral-900);
  --color-text-secondary: var(--neutral-500);
  --color-border: var(--neutral-200);
}

[data-theme="light"] {
  --color-bg-primary: var(--neutral-900);
  --color-bg-secondary: var(--neutral-800);
  --color-text-primary: var(--neutral-0);
  --color-text-secondary: var(--neutral-400);
  --color-border: var(--neutral-700);
}

/* Theme Toggle */
.theme-toggle {
  position: relative;
  width: 48px;
  height: 24px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.theme-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: var(--radius-full);
  transition: transform var(--transition-normal);
}

[data-theme="dark"] .theme-toggle::after {
  transform: translateX(24px);
}
```

## Icon System

### Icon Usage
```css
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}

.icon--sm { font-size: 0.875rem; }
.icon--md { font-size: 1rem; }
.icon--lg { font-size: 1.25rem; }
.icon--xl { font-size: 1.5rem; }
```

## Usage Examples

### Component Composition
```html
<!-- Card with Button -->
<div class="card card--hover">
  <div class="card__header">
    <h3 class="text-h4">Component Title</h3>
  </div>
  <div class="card__body">
    <p class="text-base">Card content goes here.</p>
  </div>
  <div class="card__footer">
    <button class="btn btn--primary">Action</button>
  </div>
</div>

<!-- Tab Navigation -->
<div class="tab-list">
  <button class="tab tab--active">Inspector</button>
  <button class="tab">Design</button>
  <button class="tab">Responsive</button>
  <button class="tab">Accessibility</button>
</div>

<!-- Form with Inputs -->
<form>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Name</label>
      <input type="text" class="input" placeholder="Enter name">
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">Email</label>
      <input type="email" class="input input--error" placeholder="Enter email">
    </div>
    <button class="btn btn--primary btn--lg">Submit</button>
  </div>
</form>
```

## Conclusion

This unified design system provides a comprehensive foundation for building consistent, accessible, and modern user interfaces across the Tailwind CSS Developer Tools extension. By following these guidelines and using these components, the development team can ensure a cohesive user experience while maintaining flexibility for future enhancements.

The design system emphasizes:
- **Consistency** through standardized colors, typography, and spacing
- **Accessibility** through WCAG compliance and inclusive design practices
- **Maintainability** through clear documentation and reusable components
- **Flexibility** through modular design and customizable variables
- **Performance** through optimized CSS and efficient animations

Regular updates and refinements to this design system will ensure it remains relevant and effective as the extension evolves.