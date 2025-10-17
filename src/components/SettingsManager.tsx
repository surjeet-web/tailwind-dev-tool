import React, { useState, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  autoInspect: boolean;
  showNotifications: boolean;
  keyboardShortcuts: boolean;
  autoUpdate: boolean;
  telemetry: boolean;
}

interface SettingsManagerProps {
  onSettingsChange: (settings: Settings) => void;
  currentSettings?: Settings;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ onSettingsChange, currentSettings }) => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    autoInspect: false,
    showNotifications: true,
    keyboardShortcuts: true,
    autoUpdate: true,
    telemetry: false,
    ...currentSettings
  });

  // Update settings when currentSettings prop changes
  useEffect(() => {
    if (currentSettings) {
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [currentSettings]);

  // Handle setting change
  const handleSettingChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Reset to default settings
  const resetToDefaults = () => {
    const defaultSettings: Settings = {
      theme: 'system',
      autoInspect: false,
      showNotifications: true,
      keyboardShortcuts: true,
      autoUpdate: true,
      telemetry: false
    };
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Auto Inspect on Hover</div>
              <div className="text-xs text-gray-500">Automatically inspect elements when hovering</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoInspect}
                onChange={(e) => handleSettingChange('autoInspect', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Show Notifications</div>
              <div className="text-xs text-gray-500">Display notifications for important events</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showNotifications}
                onChange={(e) => handleSettingChange('showNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Keyboard Shortcuts</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Enable Keyboard Shortcuts</div>
              <div className="text-xs text-gray-500">Use keyboard shortcuts for quick actions</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.keyboardShortcuts}
                onChange={(e) => handleSettingChange('keyboardShortcuts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Available Shortcuts</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Toggle Panel</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+Shift+T</span>
              </div>
              <div className="flex justify-between">
                <span>Inspect Element</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+Shift+I</span>
              </div>
              <div className="flex justify-between">
                <span>Color Picker</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+Shift+C</span>
              </div>
              <div className="flex justify-between">
                <span>Spacing Calculator</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">Ctrl+Shift+S</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Privacy & Data</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Auto Update</div>
              <div className="text-xs text-gray-500">Automatically check for updates</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoUpdate}
                onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700">Share Telemetry Data</div>
              <div className="text-xs text-gray-500">Help improve the extension by sharing anonymous usage data</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.telemetry}
                onChange={(e) => handleSettingChange('telemetry', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
        >
          Reset to Default Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsManager;