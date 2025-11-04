// Tailwind CSS Intelligence System
// Based on Tailwind CSS IntelliSense extension logic

class TailwindIntelligence {
  constructor() {
    this.classDatabase = new Map();
    this.variantDatabase = new Map();
    this.colorDatabase = new Map();
    this.spacingDatabase = new Map();
    this.initialized = false;
    
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Comprehensive Tailwind CSS class database
    this.setupSpacingClasses();
    this.setupColorClasses();
    this.setupLayoutClasses();
    this.setupTypographyClasses();
    this.setupBorderClasses();
    this.setupEffectClasses();
    this.setupTransformClasses();
    this.setupGridClasses();
    this.setupInteractivityClasses();
    this.setupAccessibilityClasses();
    this.setupFormClasses();
    this.setupTableClasses();
    this.setupVariants();
    
    this.initialized = true;
    console.log('Tailwind Intelligence initialized with', this.classDatabase.size, 'classes');
  }

  setupSpacingClasses() {
    const spacingValues = ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'];
    const spacingPrefixes = [
      { prefix: 'p', name: 'padding', description: 'Padding on all sides' },
      { prefix: 'px', name: 'padding-x', description: 'Horizontal padding' },
      { prefix: 'py', name: 'padding-y', description: 'Vertical padding' },
      { prefix: 'pt', name: 'padding-top', description: 'Top padding' },
      { prefix: 'pr', name: 'padding-right', description: 'Right padding' },
      { prefix: 'pb', name: 'padding-bottom', description: 'Bottom padding' },
      { prefix: 'pl', name: 'padding-left', description: 'Left padding' },
      { prefix: 'm', name: 'margin', description: 'Margin on all sides' },
      { prefix: 'mx', name: 'margin-x', description: 'Horizontal margin' },
      { prefix: 'my', name: 'margin-y', description: 'Vertical margin' },
      { prefix: 'mt', name: 'margin-top', description: 'Top margin' },
      { prefix: 'mr', name: 'margin-right', description: 'Right margin' },
      { prefix: 'mb', name: 'margin-bottom', description: 'Bottom margin' },
      { prefix: 'ml', name: 'margin-left', description: 'Left margin' },
      { prefix: 'space-x', name: 'space-between-x', description: 'Horizontal space between children' },
      { prefix: 'space-y', name: 'space-between-y', description: 'Vertical space between children' },
      { prefix: 'gap', name: 'gap', description: 'Gap between grid/flex items' },
      { prefix: 'gap-x', name: 'column-gap', description: 'Column gap' },
      { prefix: 'gap-y', name: 'row-gap', description: 'Row gap' }
    ];

    spacingPrefixes.forEach(({ prefix, name, description }) => {
      spacingValues.forEach(value => {
        const className = `${prefix}-${value}`;
        const pixelValue = this.getPixelValue(value);
        this.classDatabase.set(className, {
          name: className,
          description: `${description}: ${pixelValue}`,
          category: 'spacing',
          type: 'utility',
          css: `${name}: ${this.getRemValue(value)}`,
          alternatives: this.generateSpacingAlternatives(prefix, value, spacingValues),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus', 'active']
        });
      });
    });

    // Add negative margins
    spacingValues.slice(1).forEach(value => {
      ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'].forEach(prefix => {
        const className = `-${prefix}-${value}`;
        const pixelValue = this.getPixelValue(value);
        this.classDatabase.set(className, {
          name: className,
          description: `Negative ${prefix.replace('m', 'margin')}: -${pixelValue}`,
          category: 'spacing',
          type: 'utility',
          css: `${prefix.replace('m', 'margin')}: -${this.getRemValue(value)}`,
          alternatives: this.generateSpacingAlternatives(prefix, value, spacingValues, true),
          modifiers: [],
          variants: ['responsive']
        });
      });
    });
  }

  setupColorClasses() {
    const colors = {
      slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
      gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
      zinc: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' },
      neutral: { 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' },
      stone: { 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' },
      red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
      orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407' },
      amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
      yellow: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006' },
      lime: { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05' },
      green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
      emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' },
      teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e' },
      cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
      sky: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' },
      blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
      indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' },
      violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' },
      purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' },
      fuchsia: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e' },
      pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724' },
      rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519' }
    };

    const colorPrefixes = [
      { prefix: 'bg', property: 'background-color', description: 'Background color' },
      { prefix: 'text', property: 'color', description: 'Text color' },
      { prefix: 'border', property: 'border-color', description: 'Border color' },
      { prefix: 'outline', property: 'outline-color', description: 'Outline color' },
      { prefix: 'ring', property: '--tw-ring-color', description: 'Ring color' },
      { prefix: 'ring-offset', property: '--tw-ring-offset-color', description: 'Ring offset color' },
      { prefix: 'shadow', property: '--tw-shadow-color', description: 'Shadow color' },
      { prefix: 'accent', property: 'accent-color', description: 'Accent color' },
      { prefix: 'caret', property: 'caret-color', description: 'Caret color' },
      { prefix: 'fill', property: 'fill', description: 'Fill color' },
      { prefix: 'stroke', property: 'stroke', description: 'Stroke color' }
    ];

    // Add special colors
    ['transparent', 'current', 'inherit'].forEach(special => {
      colorPrefixes.forEach(({ prefix, property, description }) => {
        const className = `${prefix}-${special}`;
        this.classDatabase.set(className, {
          name: className,
          description: `${description}: ${special}`,
          category: 'colors',
          type: 'utility',
          css: `${property}: ${special}`,
          alternatives: this.generateColorAlternatives(prefix, special, null),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'group-focus']
        });
      });
    });

    // Add white and black
    ['white', 'black'].forEach(color => {
      colorPrefixes.forEach(({ prefix, property, description }) => {
        const className = `${prefix}-${color}`;
        const hexValue = color === 'white' ? '#ffffff' : '#000000';
        this.classDatabase.set(className, {
          name: className,
          description: `${description}: ${color} (${hexValue})`,
          category: 'colors',
          type: 'utility',
          css: `${property}: ${hexValue}`,
          alternatives: this.generateColorAlternatives(prefix, color, null),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'group-focus']
        });
      });
    });

    // Add color scale
    Object.entries(colors).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, hexValue]) => {
        colorPrefixes.forEach(({ prefix, property, description }) => {
          const className = `${prefix}-${colorName}-${shade}`;
          this.classDatabase.set(className, {
            name: className,
            description: `${description}: ${colorName} ${shade} (${hexValue})`,
            category: 'colors',
            type: 'utility',
            css: `${property}: ${hexValue}`,
            alternatives: this.generateColorAlternatives(prefix, colorName, shade),
            modifiers: [],
            variants: ['responsive', 'hover', 'focus', 'active', 'group-hover', 'group-focus'],
            color: hexValue
          });
        });
      });
    });
  }

  setupLayoutClasses() {
    const layoutClasses = [
      // Display
      { name: 'block', description: 'Display block', css: 'display: block' },
      { name: 'inline-block', description: 'Display inline-block', css: 'display: inline-block' },
      { name: 'inline', description: 'Display inline', css: 'display: inline' },
      { name: 'flex', description: 'Display flex', css: 'display: flex' },
      { name: 'inline-flex', description: 'Display inline-flex', css: 'display: inline-flex' },
      { name: 'table', description: 'Display table', css: 'display: table' },
      { name: 'inline-table', description: 'Display inline-table', css: 'display: inline-table' },
      { name: 'table-caption', description: 'Display table-caption', css: 'display: table-caption' },
      { name: 'table-cell', description: 'Display table-cell', css: 'display: table-cell' },
      { name: 'table-column', description: 'Display table-column', css: 'display: table-column' },
      { name: 'table-column-group', description: 'Display table-column-group', css: 'display: table-column-group' },
      { name: 'table-footer-group', description: 'Display table-footer-group', css: 'display: table-footer-group' },
      { name: 'table-header-group', description: 'Display table-header-group', css: 'display: table-header-group' },
      { name: 'table-row-group', description: 'Display table-row-group', css: 'display: table-row-group' },
      { name: 'table-row', description: 'Display table-row', css: 'display: table-row' },
      { name: 'flow-root', description: 'Display flow-root', css: 'display: flow-root' },
      { name: 'grid', description: 'Display grid', css: 'display: grid' },
      { name: 'inline-grid', description: 'Display inline-grid', css: 'display: inline-grid' },
      { name: 'contents', description: 'Display contents', css: 'display: contents' },
      { name: 'list-item', description: 'Display list-item', css: 'display: list-item' },
      { name: 'hidden', description: 'Display none', css: 'display: none' },

      // Position
      { name: 'static', description: 'Position static', css: 'position: static' },
      { name: 'fixed', description: 'Position fixed', css: 'position: fixed' },
      { name: 'absolute', description: 'Position absolute', css: 'position: absolute' },
      { name: 'relative', description: 'Position relative', css: 'position: relative' },
      { name: 'sticky', description: 'Position sticky', css: 'position: sticky' },

      // Flex Direction
      { name: 'flex-row', description: 'Flex direction row', css: 'flex-direction: row' },
      { name: 'flex-row-reverse', description: 'Flex direction row-reverse', css: 'flex-direction: row-reverse' },
      { name: 'flex-col', description: 'Flex direction column', css: 'flex-direction: column' },
      { name: 'flex-col-reverse', description: 'Flex direction column-reverse', css: 'flex-direction: column-reverse' },

      // Flex Wrap
      { name: 'flex-wrap', description: 'Flex wrap', css: 'flex-wrap: wrap' },
      { name: 'flex-wrap-reverse', description: 'Flex wrap reverse', css: 'flex-wrap: wrap-reverse' },
      { name: 'flex-nowrap', description: 'Flex no wrap', css: 'flex-wrap: nowrap' },

      // Justify Content
      { name: 'justify-start', description: 'Justify content flex-start', css: 'justify-content: flex-start' },
      { name: 'justify-end', description: 'Justify content flex-end', css: 'justify-content: flex-end' },
      { name: 'justify-center', description: 'Justify content center', css: 'justify-content: center' },
      { name: 'justify-between', description: 'Justify content space-between', css: 'justify-content: space-between' },
      { name: 'justify-around', description: 'Justify content space-around', css: 'justify-content: space-around' },
      { name: 'justify-evenly', description: 'Justify content space-evenly', css: 'justify-content: space-evenly' },

      // Align Items
      { name: 'items-start', description: 'Align items flex-start', css: 'align-items: flex-start' },
      { name: 'items-end', description: 'Align items flex-end', css: 'align-items: flex-end' },
      { name: 'items-center', description: 'Align items center', css: 'align-items: center' },
      { name: 'items-baseline', description: 'Align items baseline', css: 'align-items: baseline' },
      { name: 'items-stretch', description: 'Align items stretch', css: 'align-items: stretch' }
    ];

    layoutClasses.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'layout',
        type: 'utility',
        css,
        alternatives: this.generateLayoutAlternatives(name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupTypographyClasses() {
    const typographyClasses = [
      // Font Family
      { name: 'font-sans', description: 'Font family sans-serif', css: 'font-family: ui-sans-serif, system-ui, sans-serif' },
      { name: 'font-serif', description: 'Font family serif', css: 'font-family: ui-serif, Georgia, serif' },
      { name: 'font-mono', description: 'Font family monospace', css: 'font-family: ui-monospace, SFMono-Regular, monospace' },

      // Font Size
      { name: 'text-xs', description: 'Font size 0.75rem (12px)', css: 'font-size: 0.75rem; line-height: 1rem' },
      { name: 'text-sm', description: 'Font size 0.875rem (14px)', css: 'font-size: 0.875rem; line-height: 1.25rem' },
      { name: 'text-base', description: 'Font size 1rem (16px)', css: 'font-size: 1rem; line-height: 1.5rem' },
      { name: 'text-lg', description: 'Font size 1.125rem (18px)', css: 'font-size: 1.125rem; line-height: 1.75rem' },
      { name: 'text-xl', description: 'Font size 1.25rem (20px)', css: 'font-size: 1.25rem; line-height: 1.75rem' },
      { name: 'text-2xl', description: 'Font size 1.5rem (24px)', css: 'font-size: 1.5rem; line-height: 2rem' },
      { name: 'text-3xl', description: 'Font size 1.875rem (30px)', css: 'font-size: 1.875rem; line-height: 2.25rem' },
      { name: 'text-4xl', description: 'Font size 2.25rem (36px)', css: 'font-size: 2.25rem; line-height: 2.5rem' },
      { name: 'text-5xl', description: 'Font size 3rem (48px)', css: 'font-size: 3rem; line-height: 1' },
      { name: 'text-6xl', description: 'Font size 3.75rem (60px)', css: 'font-size: 3.75rem; line-height: 1' },
      { name: 'text-7xl', description: 'Font size 4.5rem (72px)', css: 'font-size: 4.5rem; line-height: 1' },
      { name: 'text-8xl', description: 'Font size 6rem (96px)', css: 'font-size: 6rem; line-height: 1' },
      { name: 'text-9xl', description: 'Font size 8rem (128px)', css: 'font-size: 8rem; line-height: 1' },

      // Font Weight
      { name: 'font-thin', description: 'Font weight 100', css: 'font-weight: 100' },
      { name: 'font-extralight', description: 'Font weight 200', css: 'font-weight: 200' },
      { name: 'font-light', description: 'Font weight 300', css: 'font-weight: 300' },
      { name: 'font-normal', description: 'Font weight 400', css: 'font-weight: 400' },
      { name: 'font-medium', description: 'Font weight 500', css: 'font-weight: 500' },
      { name: 'font-semibold', description: 'Font weight 600', css: 'font-weight: 600' },
      { name: 'font-bold', description: 'Font weight 700', css: 'font-weight: 700' },
      { name: 'font-extrabold', description: 'Font weight 800', css: 'font-weight: 800' },
      { name: 'font-black', description: 'Font weight 900', css: 'font-weight: 900' },

      // Text Align
      { name: 'text-left', description: 'Text align left', css: 'text-align: left' },
      { name: 'text-center', description: 'Text align center', css: 'text-align: center' },
      { name: 'text-right', description: 'Text align right', css: 'text-align: right' },
      { name: 'text-justify', description: 'Text align justify', css: 'text-align: justify' },
      { name: 'text-start', description: 'Text align start', css: 'text-align: start' },
      { name: 'text-end', description: 'Text align end', css: 'text-align: end' }
    ];

    typographyClasses.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'typography',
        type: 'utility',
        css,
        alternatives: this.generateTypographyAlternatives(name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupBorderClasses() {
    const borderWidths = ['0', '2', '4', '8'];
    const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'];
    const borderRadii = [
      { name: 'rounded-none', value: '0px', description: 'No border radius' },
      { name: 'rounded-sm', value: '0.125rem', description: 'Small border radius' },
      { name: 'rounded', value: '0.25rem', description: 'Default border radius' },
      { name: 'rounded-md', value: '0.375rem', description: 'Medium border radius' },
      { name: 'rounded-lg', value: '0.5rem', description: 'Large border radius' },
      { name: 'rounded-xl', value: '0.75rem', description: 'Extra large border radius' },
      { name: 'rounded-2xl', value: '1rem', description: '2x large border radius' },
      { name: 'rounded-3xl', value: '1.5rem', description: '3x large border radius' },
      { name: 'rounded-full', value: '9999px', description: 'Full border radius' }
    ];

    // Border widths
    ['border', 'border-t', 'border-r', 'border-b', 'border-l', 'border-x', 'border-y'].forEach(prefix => {
      ['', ...borderWidths].forEach(width => {
        const className = width ? `${prefix}-${width}` : prefix;
        const widthValue = width || '1px';
        this.classDatabase.set(className, {
          name: className,
          description: `Border width: ${widthValue}`,
          category: 'borders',
          type: 'utility',
          css: `border-width: ${widthValue}`,
          alternatives: this.generateBorderAlternatives(prefix, width),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus']
        });
      });
    });

    // Border radius
    borderRadii.forEach(({ name, value, description }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'borders',
        type: 'utility',
        css: `border-radius: ${value}`,
        alternatives: borderRadii.map(r => r.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupEffectClasses() {
    const shadows = [
      { name: 'shadow-sm', description: 'Small shadow', css: 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)' },
      { name: 'shadow', description: 'Default shadow', css: 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
      { name: 'shadow-md', description: 'Medium shadow', css: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
      { name: 'shadow-lg', description: 'Large shadow', css: 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
      { name: 'shadow-xl', description: 'Extra large shadow', css: 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
      { name: 'shadow-2xl', description: '2x large shadow', css: 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25)' },
      { name: 'shadow-inner', description: 'Inner shadow', css: 'box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' },
      { name: 'shadow-none', description: 'No shadow', css: 'box-shadow: 0 0 #0000' }
    ];

    shadows.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'effects',
        type: 'utility',
        css,
        alternatives: shadows.map(s => s.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive', 'hover', 'focus']
      });
    });

    // Opacity
    const opacities = ['0', '5', '10', '20', '25', '30', '40', '50', '60', '70', '75', '80', '90', '95', '100'];
    opacities.forEach(opacity => {
      const className = `opacity-${opacity}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Opacity: ${opacity}%`,
        category: 'effects',
        type: 'utility',
        css: `opacity: ${parseInt(opacity) / 100}`,
        alternatives: opacities.map(o => `opacity-${o}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive', 'hover', 'focus', 'group-hover']
      });
    });

    // Transitions
    const transitions = [
      { name: 'transition-none', description: 'No transition', css: 'transition-property: none' },
      { name: 'transition-all', description: 'Transition all properties', css: 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms' },
      { name: 'transition', description: 'Transition common properties', css: 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms' },
      { name: 'transition-colors', description: 'Transition colors', css: 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms' },
      { name: 'transition-opacity', description: 'Transition opacity', css: 'transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms' },
      { name: 'transition-shadow', description: 'Transition shadow', css: 'transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms' },
      { name: 'transition-transform', description: 'Transition transform', css: 'transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms' }
    ];

    transitions.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'effects',
        type: 'utility',
        css,
        alternatives: transitions.map(t => t.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Transition duration
    const durations = ['75', '100', '150', '200', '300', '500', '700', '1000'];
    durations.forEach(duration => {
      const className = `duration-${duration}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Transition duration: ${duration}ms`,
        category: 'effects',
        type: 'utility',
        css: `transition-duration: ${duration}ms`,
        alternatives: durations.map(d => `duration-${d}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Transition timing
    const timings = [
      { name: 'ease-linear', description: 'Linear timing function', css: 'transition-timing-function: linear' },
      { name: 'ease-in', description: 'Ease in timing function', css: 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1)' },
      { name: 'ease-out', description: 'Ease out timing function', css: 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1)' },
      { name: 'ease-in-out', description: 'Ease in out timing function', css: 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)' }
    ];

    timings.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'effects',
        type: 'utility',
        css,
        alternatives: timings.map(t => t.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Animation
    const animations = [
      { name: 'animate-none', description: 'No animation', css: 'animation: none' },
      { name: 'animate-spin', description: 'Spin animation', css: 'animation: spin 1s linear infinite' },
      { name: 'animate-ping', description: 'Ping animation', css: 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' },
      { name: 'animate-pulse', description: 'Pulse animation', css: 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
      { name: 'animate-bounce', description: 'Bounce animation', css: 'animation: bounce 1s infinite' }
    ];

    animations.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'effects',
        type: 'utility',
        css,
        alternatives: animations.map(a => a.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupTransformClasses() {
    // Scale
    const scales = ['0', '50', '75', '90', '95', '100', '105', '110', '125', '150'];
    scales.forEach(scale => {
      const className = `scale-${scale}`;
      const value = parseInt(scale) / 100;
      this.classDatabase.set(className, {
        name: className,
        description: `Scale: ${scale}%`,
        category: 'transforms',
        type: 'utility',
        css: `transform: scale(${value})`,
        alternatives: scales.map(s => `scale-${s}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive', 'hover', 'focus', 'active']
      });
    });

    // Scale X and Y
    scales.forEach(scale => {
      const value = parseInt(scale) / 100;
      ['x', 'y'].forEach(axis => {
        const className = `scale-${axis}-${scale}`;
        this.classDatabase.set(className, {
          name: className,
          description: `Scale ${axis.toUpperCase()}: ${scale}%`,
          category: 'transforms',
          type: 'utility',
          css: `transform: scale${axis.toUpperCase()}(${value})`,
          alternatives: scales.map(s => `scale-${axis}-${s}`).filter(n => n !== className),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus', 'active']
        });
      });
    });

    // Rotate
    const rotations = ['0', '1', '2', '3', '6', '12', '45', '90', '180'];
    rotations.forEach(rotation => {
      const className = `rotate-${rotation}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Rotate: ${rotation}deg`,
        category: 'transforms',
        type: 'utility',
        css: `transform: rotate(${rotation}deg)`,
        alternatives: rotations.map(r => `rotate-${r}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive', 'hover', 'focus', 'active']
      });
    });

    // Translate
    const translates = ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'];
    ['x', 'y'].forEach(axis => {
      translates.forEach(translate => {
        const className = `translate-${axis}-${translate}`;
        const value = translate === '0' ? '0' : `${translate}rem`;
        this.classDatabase.set(className, {
          name: className,
          description: `Translate ${axis.toUpperCase()}: ${value}`,
          category: 'transforms',
          type: 'utility',
          css: `transform: translate${axis.toUpperCase()}(${value})`,
          alternatives: translates.map(t => `translate-${axis}-${t}`).filter(n => n !== className),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus', 'active']
        });
      });
    });

    // Skew
    const skews = ['0', '1', '2', '3', '6', '12'];
    ['x', 'y'].forEach(axis => {
      skews.forEach(skew => {
        const className = `skew-${axis}-${skew}`;
        this.classDatabase.set(className, {
          name: className,
          description: `Skew ${axis.toUpperCase()}: ${skew}deg`,
          category: 'transforms',
          type: 'utility',
          css: `transform: skew${axis.toUpperCase()}(${skew}deg)`,
          alternatives: skews.map(s => `skew-${axis}-${s}`).filter(n => n !== className),
          modifiers: [],
          variants: ['responsive', 'hover', 'focus', 'active']
        });
      });
    });

    // Transform origin
    const origins = [
      { name: 'origin-center', description: 'Transform origin center', css: 'transform-origin: center' },
      { name: 'origin-top', description: 'Transform origin top', css: 'transform-origin: top' },
      { name: 'origin-top-right', description: 'Transform origin top right', css: 'transform-origin: top right' },
      { name: 'origin-right', description: 'Transform origin right', css: 'transform-origin: right' },
      { name: 'origin-bottom-right', description: 'Transform origin bottom right', css: 'transform-origin: bottom right' },
      { name: 'origin-bottom', description: 'Transform origin bottom', css: 'transform-origin: bottom' },
      { name: 'origin-bottom-left', description: 'Transform origin bottom left', css: 'transform-origin: bottom left' },
      { name: 'origin-left', description: 'Transform origin left', css: 'transform-origin: left' },
      { name: 'origin-top-left', description: 'Transform origin top left', css: 'transform-origin: top left' }
    ];

    origins.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'transforms',
        type: 'utility',
        css,
        alternatives: origins.map(o => o.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupGridClasses() {
    // Grid template columns
    const gridCols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    gridCols.forEach(cols => {
      const className = `grid-cols-${cols}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Grid columns: ${cols}`,
        category: 'grid',
        type: 'utility',
        css: `grid-template-columns: repeat(${cols}, minmax(0, 1fr))`,
        alternatives: gridCols.map(c => `grid-cols-${c}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid template rows
    gridCols.forEach(rows => {
      const className = `grid-rows-${rows}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Grid rows: ${rows}`,
        category: 'grid',
        type: 'utility',
        css: `grid-template-rows: repeat(${rows}, minmax(0, 1fr))`,
        alternatives: gridCols.map(r => `grid-rows-${r}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid column span
    const colSpans = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', 'full'];
    colSpans.forEach(span => {
      const className = `col-span-${span}`;
      const value = span === 'full' ? '1 / -1' : `span ${span} / span ${span}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Grid column span: ${span}`,
        category: 'grid',
        type: 'utility',
        css: `grid-column: ${value}`,
        alternatives: colSpans.map(s => `col-span-${s}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid row span
    colSpans.forEach(span => {
      const className = `row-span-${span}`;
      const value = span === 'full' ? '1 / -1' : `span ${span} / span ${span}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Grid row span: ${span}`,
        category: 'grid',
        type: 'utility',
        css: `grid-row: ${value}`,
        alternatives: colSpans.map(s => `row-span-${s}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid column start/end
    const positions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'];
    positions.forEach(pos => {
      const startClass = `col-start-${pos}`;
      const endClass = `col-end-${pos}`;
      
      this.classDatabase.set(startClass, {
        name: startClass,
        description: `Grid column start: ${pos}`,
        category: 'grid',
        type: 'utility',
        css: `grid-column-start: ${pos}`,
        alternatives: positions.map(p => `col-start-${p}`).filter(n => n !== startClass),
        modifiers: [],
        variants: ['responsive']
      });

      this.classDatabase.set(endClass, {
        name: endClass,
        description: `Grid column end: ${pos}`,
        category: 'grid',
        type: 'utility',
        css: `grid-column-end: ${pos}`,
        alternatives: positions.map(p => `col-end-${p}`).filter(n => n !== endClass),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid row start/end
    positions.forEach(pos => {
      const startClass = `row-start-${pos}`;
      const endClass = `row-end-${pos}`;
      
      this.classDatabase.set(startClass, {
        name: startClass,
        description: `Grid row start: ${pos}`,
        category: 'grid',
        type: 'utility',
        css: `grid-row-start: ${pos}`,
        alternatives: positions.map(p => `row-start-${p}`).filter(n => n !== startClass),
        modifiers: [],
        variants: ['responsive']
      });

      this.classDatabase.set(endClass, {
        name: endClass,
        description: `Grid row end: ${pos}`,
        category: 'grid',
        type: 'utility',
        css: `grid-row-end: ${pos}`,
        alternatives: positions.map(p => `row-end-${p}`).filter(n => n !== endClass),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid auto flow
    const autoFlows = [
      { name: 'grid-flow-row', description: 'Grid auto flow row', css: 'grid-auto-flow: row' },
      { name: 'grid-flow-col', description: 'Grid auto flow column', css: 'grid-auto-flow: column' },
      { name: 'grid-flow-row-dense', description: 'Grid auto flow row dense', css: 'grid-auto-flow: row dense' },
      { name: 'grid-flow-col-dense', description: 'Grid auto flow column dense', css: 'grid-auto-flow: column dense' }
    ];

    autoFlows.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'grid',
        type: 'utility',
        css,
        alternatives: autoFlows.map(f => f.name).filter(n => n !== name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Grid auto columns/rows
    const autoSizes = ['auto', 'min', 'max', 'fr'];
    autoSizes.forEach(size => {
      const colsClass = `auto-cols-${size}`;
      const rowsClass = `auto-rows-${size}`;
      
      this.classDatabase.set(colsClass, {
        name: colsClass,
        description: `Grid auto columns: ${size}`,
        category: 'grid',
        type: 'utility',
        css: `grid-auto-columns: ${size === 'fr' ? 'minmax(0, 1fr)' : size === 'min' ? 'min-content' : size === 'max' ? 'max-content' : 'auto'}`,
        alternatives: autoSizes.map(s => `auto-cols-${s}`).filter(n => n !== colsClass),
        modifiers: [],
        variants: ['responsive']
      });

      this.classDatabase.set(rowsClass, {
        name: rowsClass,
        description: `Grid auto rows: ${size}`,
        category: 'grid',
        type: 'utility',
        css: `grid-auto-rows: ${size === 'fr' ? 'minmax(0, 1fr)' : size === 'min' ? 'min-content' : size === 'max' ? 'max-content' : 'auto'}`,
        alternatives: autoSizes.map(s => `auto-rows-${s}`).filter(n => n !== rowsClass),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupInteractivityClasses() {
    // Cursor
    const cursors = [
      { name: 'cursor-auto', description: 'Auto cursor', css: 'cursor: auto' },
      { name: 'cursor-default', description: 'Default cursor', css: 'cursor: default' },
      { name: 'cursor-pointer', description: 'Pointer cursor', css: 'cursor: pointer' },
      { name: 'cursor-wait', description: 'Wait cursor', css: 'cursor: wait' },
      { name: 'cursor-text', description: 'Text cursor', css: 'cursor: text' },
      { name: 'cursor-move', description: 'Move cursor', css: 'cursor: move' },
      { name: 'cursor-help', description: 'Help cursor', css: 'cursor: help' },
      { name: 'cursor-not-allowed', description: 'Not allowed cursor', css: 'cursor: not-allowed' },
      { name: 'cursor-none', description: 'No cursor', css: 'cursor: none' },
      { name: 'cursor-context-menu', description: 'Context menu cursor', css: 'cursor: context-menu' },
      { name: 'cursor-progress', description: 'Progress cursor', css: 'cursor: progress' },
      { name: 'cursor-cell', description: 'Cell cursor', css: 'cursor: cell' },
      { name: 'cursor-crosshair', description: 'Crosshair cursor', css: 'cursor: crosshair' },
      { name: 'cursor-vertical-text', description: 'Vertical text cursor', css: 'cursor: vertical-text' },
      { name: 'cursor-alias', description: 'Alias cursor', css: 'cursor: alias' },
      { name: 'cursor-copy', description: 'Copy cursor', css: 'cursor: copy' },
      { name: 'cursor-no-drop', description: 'No drop cursor', css: 'cursor: no-drop' },
      { name: 'cursor-grab', description: 'Grab cursor', css: 'cursor: grab' },
      { name: 'cursor-grabbing', description: 'Grabbing cursor', css: 'cursor: grabbing' },
      { name: 'cursor-all-scroll', description: 'All scroll cursor', css: 'cursor: all-scroll' },
      { name: 'cursor-col-resize', description: 'Column resize cursor', css: 'cursor: col-resize' },
      { name: 'cursor-row-resize', description: 'Row resize cursor', css: 'cursor: row-resize' },
      { name: 'cursor-n-resize', description: 'North resize cursor', css: 'cursor: n-resize' },
      { name: 'cursor-e-resize', description: 'East resize cursor', css: 'cursor: e-resize' },
      { name: 'cursor-s-resize', description: 'South resize cursor', css: 'cursor: s-resize' },
      { name: 'cursor-w-resize', description: 'West resize cursor', css: 'cursor: w-resize' },
      { name: 'cursor-ne-resize', description: 'North east resize cursor', css: 'cursor: ne-resize' },
      { name: 'cursor-nw-resize', description: 'North west resize cursor', css: 'cursor: nw-resize' },
      { name: 'cursor-se-resize', description: 'South east resize cursor', css: 'cursor: se-resize' },
      { name: 'cursor-sw-resize', description: 'South west resize cursor', css: 'cursor: sw-resize' },
      { name: 'cursor-ew-resize', description: 'East west resize cursor', css: 'cursor: ew-resize' },
      { name: 'cursor-ns-resize', description: 'North south resize cursor', css: 'cursor: ns-resize' },
      { name: 'cursor-nesw-resize', description: 'North east south west resize cursor', css: 'cursor: nesw-resize' },
      { name: 'cursor-nwse-resize', description: 'North west south east resize cursor', css: 'cursor: nwse-resize' },
      { name: 'cursor-zoom-in', description: 'Zoom in cursor', css: 'cursor: zoom-in' },
      { name: 'cursor-zoom-out', description: 'Zoom out cursor', css: 'cursor: zoom-out' }
    ];

    cursors.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'interactivity',
        type: 'utility',
        css,
        alternatives: cursors.filter(c => c.name !== name).map(c => c.name),
        modifiers: [],
        variants: ['responsive', 'hover', 'focus']
      });
    });

    // User select
    const userSelects = [
      { name: 'select-none', description: 'User select none', css: 'user-select: none' },
      { name: 'select-text', description: 'User select text', css: 'user-select: text' },
      { name: 'select-all', description: 'User select all', css: 'user-select: all' },
      { name: 'select-auto', description: 'User select auto', css: 'user-select: auto' }
    ];

    userSelects.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'interactivity',
        type: 'utility',
        css,
        alternatives: userSelects.filter(s => s.name !== name).map(s => s.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Pointer events
    const pointerEvents = [
      { name: 'pointer-events-none', description: 'Pointer events none', css: 'pointer-events: none' },
      { name: 'pointer-events-auto', description: 'Pointer events auto', css: 'pointer-events: auto' }
    ];

    pointerEvents.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'interactivity',
        type: 'utility',
        css,
        alternatives: pointerEvents.filter(p => p.name !== name).map(p => p.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Resize
    const resizes = [
      { name: 'resize-none', description: 'Resize none', css: 'resize: none' },
      { name: 'resize-y', description: 'Resize vertical', css: 'resize: vertical' },
      { name: 'resize-x', description: 'Resize horizontal', css: 'resize: horizontal' },
      { name: 'resize', description: 'Resize both', css: 'resize: both' }
    ];

    resizes.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'interactivity',
        type: 'utility',
        css,
        alternatives: resizes.filter(r => r.name !== name).map(r => r.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Scroll behavior
    const scrollBehaviors = [
      { name: 'scroll-auto', description: 'Scroll auto', css: 'scroll-behavior: auto' },
      { name: 'scroll-smooth', description: 'Scroll smooth', css: 'scroll-behavior: smooth' }
    ];

    scrollBehaviors.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'interactivity',
        type: 'utility',
        css,
        alternatives: scrollBehaviors.filter(s => s.name !== name).map(s => s.name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupAccessibilityClasses() {
    // Screen reader only
    const screenReaderClasses = [
      { name: 'sr-only', description: 'Screen reader only', css: 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0' },
      { name: 'not-sr-only', description: 'Not screen reader only', css: 'position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal' }
    ];

    screenReaderClasses.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'accessibility',
        type: 'utility',
        css,
        alternatives: screenReaderClasses.filter(s => s.name !== name).map(s => s.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Focus visible
    const focusVisibleClasses = [
      { name: 'focus-visible', description: 'Focus visible styles', css: 'outline: 2px solid transparent; outline-offset: 2px' },
      { name: 'focus-visible:outline-none', description: 'Focus visible no outline', css: 'outline: 2px solid transparent; outline-offset: 2px; outline: none' }
    ];

    focusVisibleClasses.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'accessibility',
        type: 'utility',
        css,
        alternatives: focusVisibleClasses.filter(f => f.name !== name).map(f => f.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Outline
    const outlines = [
      { name: 'outline-none', description: 'No outline', css: 'outline: 2px solid transparent; outline-offset: 2px; outline: none' },
      { name: 'outline-white', description: 'White outline', css: 'outline: 2px solid white; outline-offset: 2px' },
      { name: 'outline-black', description: 'Black outline', css: 'outline: 2px solid black; outline-offset: 2px' },
      { name: 'outline', description: 'Default outline', css: 'outline: 2px solid transparent; outline-offset: 2px' }
    ];

    outlines.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'accessibility',
        type: 'utility',
        css,
        alternatives: outlines.filter(o => o.name !== name).map(o => o.name),
        modifiers: [],
        variants: ['responsive', 'focus', 'focus-visible']
      });
    });

    // Outline width
    const outlineWidths = ['0', '1', '2', '4', '8'];
    outlineWidths.forEach(width => {
      const className = `outline-${width}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Outline width: ${width}px`,
        category: 'accessibility',
        type: 'utility',
        css: `outline-width: ${width}px`,
        alternatives: outlineWidths.map(w => `outline-${w}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive', 'focus', 'focus-visible']
      });
    });

    // Outline offset
    const outlineOffsets = ['0', '1', '2', '4', '8'];
    outlineOffsets.forEach(offset => {
      const className = `outline-offset-${offset}`;
      this.classDatabase.set(className, {
        name: className,
        description: `Outline offset: ${offset}px`,
        category: 'accessibility',
        type: 'utility',
        css: `outline-offset: ${offset}px`,
        alternatives: outlineOffsets.map(o => `outline-offset-${o}`).filter(n => n !== className),
        modifiers: [],
        variants: ['responsive', 'focus', 'focus-visible']
      });
    });
  }

  setupFormClasses() {
    // Input sizing
    const inputSizes = [
      { name: 'input-xs', description: 'Extra small input', css: 'font-size: 0.75rem; line-height: 1rem; padding: 0.25rem 0.5rem; border-radius: 0.125rem' },
      { name: 'input-sm', description: 'Small input', css: 'font-size: 0.875rem; line-height: 1.25rem; padding: 0.375rem 0.75rem; border-radius: 0.125rem' },
      { name: 'input-md', description: 'Medium input', css: 'font-size: 1rem; line-height: 1.5rem; padding: 0.5rem 1rem; border-radius: 0.25rem' },
      { name: 'input-lg', description: 'Large input', css: 'font-size: 1.125rem; line-height: 1.75rem; padding: 0.625rem 1.25rem; border-radius: 0.375rem' },
      { name: 'input-xl', description: 'Extra large input', css: 'font-size: 1.25rem; line-height: 1.75rem; padding: 0.75rem 1.5rem; border-radius: 0.5rem' }
    ];

    inputSizes.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'forms',
        type: 'utility',
        css,
        alternatives: inputSizes.filter(s => s.name !== name).map(s => s.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Checkbox and radio sizing
    const checkboxSizes = [
      { name: 'checkbox-xs', description: 'Extra small checkbox', css: 'width: 0.75rem; height: 0.75rem' },
      { name: 'checkbox-sm', description: 'Small checkbox', css: 'width: 1rem; height: 1rem' },
      { name: 'checkbox-md', description: 'Medium checkbox', css: 'width: 1.25rem; height: 1.25rem' },
      { name: 'checkbox-lg', description: 'Large checkbox', css: 'width: 1.5rem; height: 1.5rem' },
      { name: 'checkbox-xl', description: 'Extra large checkbox', css: 'width: 1.75rem; height: 1.75rem' }
    ];

    checkboxSizes.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'forms',
        type: 'utility',
        css,
        alternatives: checkboxSizes.filter(s => s.name !== name).map(s => s.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Form states
    const formStates = [
      { name: 'required', description: 'Required field indicator', css: '' },
      { name: 'invalid', description: 'Invalid field state', css: '' },
      { name: 'valid', description: 'Valid field state', css: '' },
      { name: 'disabled', description: 'Disabled field state', css: 'opacity: 0.5; cursor: not-allowed' },
      { name: 'readonly', description: 'Readonly field state', css: 'cursor: default' }
    ];

    formStates.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'forms',
        type: 'utility',
        css,
        alternatives: formStates.filter(s => s.name !== name).map(s => s.name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupTableClasses() {
    // Table layout
    const tableLayouts = [
      { name: 'table-auto', description: 'Auto table layout', css: 'table-layout: auto' },
      { name: 'table-fixed', description: 'Fixed table layout', css: 'table-layout: fixed' }
    ];

    tableLayouts.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'tables',
        type: 'utility',
        css,
        alternatives: tableLayouts.filter(t => t.name !== name).map(t => t.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Border collapse
    const borderCollapses = [
      { name: 'border-collapse', description: 'Border collapse', css: 'border-collapse: collapse' },
      { name: 'border-separate', description: 'Border separate', css: 'border-collapse: separate' }
    ];

    borderCollapses.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'tables',
        type: 'utility',
        css,
        alternatives: borderCollapses.filter(b => b.name !== name).map(b => b.name),
        modifiers: [],
        variants: ['responsive']
      });
    });

    // Caption side
    const captionSides = [
      { name: 'caption-top', description: 'Caption top', css: 'caption-side: top' },
      { name: 'caption-bottom', description: 'Caption bottom', css: 'caption-side: bottom' }
    ];

    captionSides.forEach(({ name, description, css }) => {
      this.classDatabase.set(name, {
        name,
        description,
        category: 'tables',
        type: 'utility',
        css,
        alternatives: captionSides.filter(c => c.name !== name).map(c => c.name),
        modifiers: [],
        variants: ['responsive']
      });
    });
  }

  setupVariants() {
    const variants = [
      // Responsive
      { name: 'sm', description: 'Small screens (640px+)', type: 'responsive' },
      { name: 'md', description: 'Medium screens (768px+)', type: 'responsive' },
      { name: 'lg', description: 'Large screens (1024px+)', type: 'responsive' },
      { name: 'xl', description: 'Extra large screens (1280px+)', type: 'responsive' },
      { name: '2xl', description: '2x large screens (1536px+)', type: 'responsive' },

      // Interactive
      { name: 'hover', description: 'On hover', type: 'interactive' },
      { name: 'focus', description: 'On focus', type: 'interactive' },
      { name: 'focus-within', description: 'When child has focus', type: 'interactive' },
      { name: 'focus-visible', description: 'On focus visible', type: 'interactive' },
      { name: 'active', description: 'On active', type: 'interactive' },
      { name: 'visited', description: 'On visited', type: 'interactive' },
      { name: 'target', description: 'On target', type: 'interactive' },
      { name: 'disabled', description: 'When disabled', type: 'interactive' },
      { name: 'enabled', description: 'When enabled', type: 'interactive' },
      { name: 'checked', description: 'When checked', type: 'interactive' },
      { name: 'indeterminate', description: 'When indeterminate', type: 'interactive' },
      { name: 'default', description: 'When default', type: 'interactive' },
      { name: 'required', description: 'When required', type: 'interactive' },
      { name: 'valid', description: 'When valid', type: 'interactive' },
      { name: 'invalid', description: 'When invalid', type: 'interactive' },
      { name: 'in-range', description: 'When in range', type: 'interactive' },
      { name: 'out-of-range', description: 'When out of range', type: 'interactive' },
      { name: 'placeholder-shown', description: 'When placeholder shown', type: 'interactive' },
      { name: 'autofill', description: 'When autofilled', type: 'interactive' },
      { name: 'read-only', description: 'When read only', type: 'interactive' },

      // Group states
      { name: 'group-hover', description: 'When parent group is hovered', type: 'group' },
      { name: 'group-focus', description: 'When parent group is focused', type: 'group' },
      { name: 'group-active', description: 'When parent group is active', type: 'group' },
      { name: 'group-visited', description: 'When parent group is visited', type: 'group' },
      { name: 'group-target', description: 'When parent group is target', type: 'group' },
      { name: 'group-disabled', description: 'When parent group is disabled', type: 'group' },

      // Peer states
      { name: 'peer-hover', description: 'When peer is hovered', type: 'peer' },
      { name: 'peer-focus', description: 'When peer is focused', type: 'peer' },
      { name: 'peer-active', description: 'When peer is active', type: 'peer' },
      { name: 'peer-visited', description: 'When peer is visited', type: 'peer' },
      { name: 'peer-target', description: 'When peer is target', type: 'peer' },
      { name: 'peer-disabled', description: 'When peer is disabled', type: 'peer' },
      { name: 'peer-checked', description: 'When peer is checked', type: 'peer' },
      { name: 'peer-valid', description: 'When peer is valid', type: 'peer' },
      { name: 'peer-invalid', description: 'When peer is invalid', type: 'peer' },

      // Pseudo-elements
      { name: 'before', description: 'Before pseudo-element', type: 'pseudo' },
      { name: 'after', description: 'After pseudo-element', type: 'pseudo' },
      { name: 'first-letter', description: 'First letter pseudo-element', type: 'pseudo' },
      { name: 'first-line', description: 'First line pseudo-element', type: 'pseudo' },
      { name: 'marker', description: 'Marker pseudo-element', type: 'pseudo' },
      { name: 'selection', description: 'Selection pseudo-element', type: 'pseudo' },
      { name: 'file', description: 'File selector button', type: 'pseudo' },
      { name: 'backdrop', description: 'Backdrop pseudo-element', type: 'pseudo' },
      { name: 'placeholder', description: 'Placeholder pseudo-element', type: 'pseudo' },

      // Child selectors
      { name: 'first', description: 'First child', type: 'child' },
      { name: 'last', description: 'Last child', type: 'child' },
      { name: 'only', description: 'Only child', type: 'child' },
      { name: 'odd', description: 'Odd children', type: 'child' },
      { name: 'even', description: 'Even children', type: 'child' },
      { name: 'first-of-type', description: 'First of type', type: 'child' },
      { name: 'last-of-type', description: 'Last of type', type: 'child' },
      { name: 'only-of-type', description: 'Only of type', type: 'child' },

      // Dark mode
      { name: 'dark', description: 'Dark mode', type: 'media' },

      // Print
      { name: 'print', description: 'Print media', type: 'media' },

      // Motion
      { name: 'motion-safe', description: 'When motion is safe', type: 'media' },
      { name: 'motion-reduce', description: 'When motion is reduced', type: 'media' },

      // Contrast
      { name: 'contrast-more', description: 'High contrast', type: 'media' },
      { name: 'contrast-less', description: 'Low contrast', type: 'media' }
    ];

    variants.forEach(variant => {
      this.variantDatabase.set(variant.name, variant);
    });
  }

  // Helper methods for generating alternatives
  generateSpacingAlternatives(prefix, currentValue, allValues, isNegative = false) {
    const alternatives = [];
    const currentIndex = allValues.indexOf(currentValue);
    
    // Add nearby values
    for (let i = Math.max(0, currentIndex - 2); i <= Math.min(allValues.length - 1, currentIndex + 2); i++) {
      if (i !== currentIndex) {
        const value = allValues[i];
        const className = isNegative ? `-${prefix}-${value}` : `${prefix}-${value}`;
        alternatives.push(className);
      }
    }

    // Add related spacing types
    if (prefix.startsWith('p')) {
      const marginPrefix = prefix.replace('p', 'm');
      alternatives.push(isNegative ? `-${marginPrefix}-${currentValue}` : `${marginPrefix}-${currentValue}`);
    } else if (prefix.startsWith('m')) {
      const paddingPrefix = prefix.replace('m', 'p');
      alternatives.push(`${paddingPrefix}-${currentValue}`);
    }

    return alternatives.slice(0, 8);
  }

  generateColorAlternatives(prefix, colorName, shade) {
    const alternatives = [];
    
    if (shade) {
      // Same color, different shades
      const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
      shades.forEach(s => {
        if (s !== shade) {
          alternatives.push(`${prefix}-${colorName}-${s}`);
        }
      });

      // Related colors with same shade
      const relatedColors = this.getRelatedColors(colorName);
      relatedColors.forEach(color => {
        alternatives.push(`${prefix}-${color}-${shade}`);
      });
    } else {
      // Special colors or single colors
      alternatives.push(`${prefix}-white`, `${prefix}-black`, `${prefix}-transparent`, `${prefix}-current`);
    }

    return alternatives.slice(0, 12);
  }

  generateLayoutAlternatives(className) {
    const alternatives = [];
    
    if (className.startsWith('flex')) {
      alternatives.push('block', 'inline-block', 'grid', 'inline-grid');
    } else if (className === 'block') {
      alternatives.push('flex', 'inline-block', 'grid', 'inline');
    } else if (className === 'grid') {
      alternatives.push('flex', 'block', 'inline-grid');
    } else if (className.startsWith('justify-')) {
      alternatives.push('justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly');
    } else if (className.startsWith('items-')) {
      alternatives.push('items-start', 'items-center', 'items-end', 'items-baseline', 'items-stretch');
    }

    return alternatives.filter(alt => alt !== className).slice(0, 8);
  }

  generateTypographyAlternatives(className) {
    const alternatives = [];
    
    if (className.startsWith('text-') && !className.includes('-')) {
      // Font sizes
      alternatives.push('text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl');
    } else if (className.startsWith('font-')) {
      if (className.includes('font-sans') || className.includes('font-serif') || className.includes('font-mono')) {
        alternatives.push('font-sans', 'font-serif', 'font-mono');
      } else {
        alternatives.push('font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black');
      }
    } else if (className.startsWith('text-') && (className.includes('left') || className.includes('center') || className.includes('right'))) {
      alternatives.push('text-left', 'text-center', 'text-right', 'text-justify');
    }

    return alternatives.filter(alt => alt !== className).slice(0, 8);
  }

  generateBorderAlternatives(prefix, currentWidth) {
    const alternatives = [];
    const widths = ['', '0', '2', '4', '8'];
    
    widths.forEach(width => {
      if (width !== currentWidth) {
        const className = width ? `${prefix}-${width}` : prefix;
        alternatives.push(className);
      }
    });

    return alternatives.slice(0, 6);
  }

  getRelatedColors(baseColor) {
    const colorGroups = {
      red: ['orange', 'pink', 'rose'],
      orange: ['red', 'amber', 'yellow'],
      amber: ['orange', 'yellow', 'lime'],
      yellow: ['amber', 'lime', 'green'],
      lime: ['yellow', 'green', 'emerald'],
      green: ['lime', 'emerald', 'teal'],
      emerald: ['green', 'teal', 'cyan'],
      teal: ['emerald', 'cyan', 'sky'],
      cyan: ['teal', 'sky', 'blue'],
      sky: ['cyan', 'blue', 'indigo'],
      blue: ['sky', 'indigo', 'violet'],
      indigo: ['blue', 'violet', 'purple'],
      violet: ['indigo', 'purple', 'fuchsia'],
      purple: ['violet', 'fuchsia', 'pink'],
      fuchsia: ['purple', 'pink', 'rose'],
      pink: ['fuchsia', 'rose', 'red'],
      rose: ['pink', 'red', 'orange'],
      gray: ['slate', 'zinc', 'neutral', 'stone'],
      slate: ['gray', 'zinc', 'neutral'],
      zinc: ['gray', 'slate', 'neutral'],
      neutral: ['gray', 'slate', 'zinc'],
      stone: ['gray', 'neutral', 'zinc']
    };

    return colorGroups[baseColor] || ['gray', 'slate'];
  }

  getPixelValue(remValue) {
    const rem = parseFloat(remValue);
    if (rem === 0) return '0px';
    if (rem < 1) return `${rem * 16}px`;
    return `${rem * 16}px`;
  }

  getRemValue(value) {
    if (value === '0') return '0';
    if (value === '0.5') return '0.125rem';
    if (value === '1.5') return '0.375rem';
    if (value === '2.5') return '0.625rem';
    if (value === '3.5') return '0.875rem';
    return `${parseFloat(value) * 0.25}rem`;
  }

  // Main search method
  search(query, limit = 15) {
    if (!this.initialized || !query) return [];

    const queryLower = query.toLowerCase().trim();
    const results = [];

    // Search through all classes
    for (const [className, classInfo] of this.classDatabase) {
      let score = 0;

      // Exact match
      if (className === queryLower) {
        score = 1000;
      }
      // Starts with query
      else if (className.startsWith(queryLower)) {
        score = 900;
      }
      // Contains query
      else if (className.includes(queryLower)) {
        score = 700;
      }
      // Description contains query
      else if (classInfo.description.toLowerCase().includes(queryLower)) {
        score = 500;
      }
      // Category matches
      else if (classInfo.category.toLowerCase().includes(queryLower)) {
        score = 300;
      }

      if (score > 0) {
        results.push({
          ...classInfo,
          score,
          variants: this.getApplicableVariants(className)
        });
      }
    }

    // Sort by score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Get class alternatives
  getAlternatives(className, limit = 12) {
    const classInfo = this.classDatabase.get(className);
    if (!classInfo) return [];

    let alternatives = classInfo.alternatives || [];

    // If no predefined alternatives, generate smart alternatives
    if (alternatives.length === 0) {
      alternatives = this.generateSmartAlternatives(className);
    }

    return alternatives
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

  generateSmartAlternatives(className) {
    const alternatives = [];
    
    // Parse the class name to understand its structure
    const parts = className.split('-');
    const prefix = parts[0];
    
    // Generate alternatives based on class type
    if (['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'].includes(prefix)) {
      // Spacing alternatives
      const values = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12'];
      values.forEach(value => {
        const alt = `${prefix}-${value}`;
        if (alt !== className && this.classDatabase.has(alt)) {
          alternatives.push(alt);
        }
      });
    } else if (prefix === 'bg' || prefix === 'text' || prefix === 'border') {
      // Color alternatives
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray'];
      const shades = ['100', '200', '300', '400', 'white', 'black'];
      
      colors.forEach(color => {
        shades.forEach(shade => {
          const alt = shade === 'white' || shade === 'black' ? `${prefix}-${shade}` : `${prefix}-${color}-${shade}`;
          if (alt !== className && this.classDatabase.has(alt)) {
            alternatives.push(alt);
          }
        });
      });
    } else if (className.startsWith('rounded')) {
      // Border radius alternatives
      const radii = ['rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'];
      alternatives.push(...radii.filter(r => r !== className));
    } else if (className.startsWith('shadow')) {
      // Shadow alternatives
      const shadows = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'];
      alternatives.push(...shadows.filter(s => s !== className));
    }

    return alternatives.slice(0, 12);
  }

  getApplicableVariants(className) {
    const classInfo = this.classDatabase.get(className);
    if (!classInfo) return [];

    return classInfo.variants || ['responsive', 'hover', 'focus'];
  }

  // Get class information
  getClassInfo(className) {
    return this.classDatabase.get(className) || null;
  }

  // Get variant information
  getVariantInfo(variantName) {
    return this.variantDatabase.get(variantName) || null;
  }

  // Get suggestions based on context
  getContextualSuggestions(existingClasses = [], limit = 10) {
    const suggestions = [];
    const categories = new Set();
    const hasFlex = existingClasses.some(c => c === 'flex' || c.startsWith('flex-'));
    const hasGrid = existingClasses.some(c => c === 'grid' || c.startsWith('grid-'));
    const hasPosition = existingClasses.some(c => ['absolute', 'relative', 'fixed', 'sticky'].includes(c));
    const hasBgColor = existingClasses.some(c => c.startsWith('bg-'));
    const hasTextColor = existingClasses.some(c => c.startsWith('text-'));
    const hasBorder = existingClasses.some(c => c.startsWith('border'));
    const hasRounded = existingClasses.some(c => c.startsWith('rounded'));
    const hasShadow = existingClasses.some(c => c.startsWith('shadow'));
    const hasTransform = existingClasses.some(c => c.startsWith('scale') || c.startsWith('translate') || c.startsWith('rotate') || c.startsWith('skew'));
    const hasTransition = existingClasses.some(c => c.startsWith('transition') || c.startsWith('duration') || c.startsWith('ease'));
    
    // Analyze existing classes to understand context
    existingClasses.forEach(className => {
      const classInfo = this.classDatabase.get(className);
      if (classInfo) {
        categories.add(classInfo.category);
      }
    });

    // Layout-based suggestions
    if (hasFlex && !existingClasses.some(c => c.startsWith('justify-'))) {
      suggestions.push('justify-center', 'justify-between', 'justify-around', 'justify-start', 'justify-end');
    }
    
    if (hasFlex && !existingClasses.some(c => c.startsWith('items-'))) {
      suggestions.push('items-center', 'items-start', 'items-end', 'items-stretch');
    }
    
    if (hasFlex && !existingClasses.some(c => c.startsWith('gap'))) {
      suggestions.push('gap-2', 'gap-4', 'gap-6', 'gap-x-4', 'gap-y-4');
    }
    
    if (hasGrid && !existingClasses.some(c => c.startsWith('grid-cols'))) {
      suggestions.push('grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-6', 'grid-cols-12');
    }
    
    if (hasGrid && !existingClasses.some(c => c.startsWith('gap'))) {
      suggestions.push('gap-2', 'gap-4', 'gap-6');
    }

    // Position-based suggestions
    if (hasPosition && !existingClasses.some(c => ['top', 'right', 'bottom', 'left'].some(dir => c.startsWith(dir)))) {
      suggestions.push('top-0', 'right-0', 'bottom-0', 'left-0', 'inset-0');
    }
    
    if (hasPosition && !existingClasses.some(c => c.startsWith('z-'))) {
      suggestions.push('z-10', 'z-20', 'z-30', 'z-40', 'z-50');
    }

    // Color-based suggestions
    if (hasBgColor && !hasTextColor) {
      suggestions.push('text-white', 'text-gray-900', 'text-gray-800', 'text-black');
    }
    
    if (hasTextColor && !hasBgColor) {
      suggestions.push('bg-white', 'bg-gray-100', 'bg-transparent');
    }
    
    if ((hasBgColor || hasTextColor) && !hasBorder) {
      suggestions.push('border', 'border-2', 'border-gray-200', 'border-gray-300');
    }
    
    if ((hasBgColor || hasBorder) && !hasRounded) {
      suggestions.push('rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full');
    }
    
    if ((hasBgColor || hasRounded) && !hasShadow) {
      suggestions.push('shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl');
    }

    // Transform-based suggestions
    if (hasTransform && !hasTransition) {
      suggestions.push('transition-transform', 'duration-200', 'duration-300', 'ease-in-out');
    }
    
    if (hasTransition && !hasTransform) {
      suggestions.push('hover:scale-105', 'hover:translate-y-1', 'hover:rotate-3', 'active:scale-95');
    }

    // Interactive suggestions
    if (hasBgColor && !existingClasses.some(c => c.startsWith('hover:'))) {
      suggestions.push('hover:bg-opacity-80', 'hover:bg-gray-100', 'hover:bg-blue-500');
    }
    
    if (hasTextColor && !existingClasses.some(c => c.startsWith('hover:'))) {
      suggestions.push('hover:text-blue-600', 'hover:text-gray-900', 'hover:underline');
    }

    // Form-specific suggestions
    if (existingClasses.some(c => ['input', 'textarea', 'select'].some(tag => c.includes(tag)))) {
      suggestions.push('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500', 'rounded-md');
    }

    // Component-specific suggestions
    if (existingClasses.includes('card') || existingClasses.includes('container')) {
      suggestions.push('p-6', 'bg-white', 'rounded-lg', 'shadow-md', 'border border-gray-200');
    }
    
    if (existingClasses.includes('button') || existingClasses.includes('btn')) {
      suggestions.push('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600', 'transition-colors');
    }
    
    if (existingClasses.includes('modal') || existingClasses.includes('dialog')) {
      suggestions.push('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50');
    }

    // Navigation suggestions
    if (existingClasses.includes('nav') || existingClasses.includes('navbar')) {
      suggestions.push('flex', 'items-center', 'justify-between', 'p-4', 'bg-white', 'shadow-md');
    }

    // Add popular utility classes if no context
    if (categories.size === 0) {
      suggestions.push('flex', 'p-4', 'bg-white', 'text-gray-900', 'rounded-lg', 'shadow-md', 'border', 'gap-4');
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

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TailwindIntelligence;
} else if (typeof window !== 'undefined') {
  window.TailwindIntelligence = TailwindIntelligence;
}