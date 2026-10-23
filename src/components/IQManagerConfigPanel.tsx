import React, { useState } from 'react';
import {
  IQKeyboardSettings,
  KeyboardTheme,
  DeviceType,
  SoundType,
} from '../types/keyboard';
import {
  Sliders,
  Volume2,
  Vibrate,
  Palette,
  Smartphone,
  Globe,
  Sparkles,
  MoveHorizontal,
  Hash,
  ChevronRight,
  Code2,
} from 'lucide-react';

interface IQManagerConfigPanelProps {
  settings: IQKeyboardSettings;
  onChange: (updater: (prev: IQKeyboardSettings) => IQKeyboardSettings) => void;
  onOpenApkModal: () => void;
  onOpenCodeModal: () => void;
}

export const IQManagerConfigPanel: React.FC<IQManagerConfigPanelProps> = ({
  settings,
  onChange,
  onOpenApkModal,
  onOpenCodeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'insets' | 'studio' | 'ergonomics'>('insets');

  const tintOptions = [
    { label: 'iOS Blue', value: '#007aff' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Purple', value: '#8b5cf6' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Amber', value: '#f59e0b' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-6">
      {/* Header and Quick Build CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              iOS Keyboard Studio & IQKeyboard Preferences
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Integrated architecture: <strong>hackiftekhar/IQKeyboardManager</strong> + <strong>SwiftyKit/SwiftyKeyboard</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCodeModal}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kotlin Sources</span>
          </button>
          <button
            type="button"
            onClick={onOpenApkModal}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build APK Suite</span>
          </button>
        </div>
      </div>

      {/* Segmented Section Tabs */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('insets')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'insets'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          IQKeyboardManager Insets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'studio'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          SwiftyKeyboard Studio
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ergonomics')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'ergonomics'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Typing Ergonomics & Audio
        </button>
      </div>

      {/* Tab 1: Insets & IQKeyboardManager Engine */}
      {activeTab === 'insets' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                IQKeyboardManager.enable
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Automatically displace view when text field is covered by soft keyboard
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange((prev) => ({ ...prev, enabled: !prev.enabled }))
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                settings.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Grid of Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Distance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <span>keyboardDistanceFromTextField</span>
                <span className="font-mono font-bold text-blue-600">
                  {settings.distanceFromTextField}px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={2}
                value={settings.distanceFromTextField}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    distanceFromTextField: Number(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0px (flush)</span>
                <span>16px (default)</span>
                <span>50px (generous)</span>
              </div>
            </div>

            {/* Resign On Touch Outside */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                shouldResignOnTouchOutside
              </span>
              <input
                type="checkbox"
                checked={settings.shouldResignOnTouchOutside}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    shouldResignOnTouchOutside: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Auto Toolbar */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                enableAutoToolbar (Previous / Next / Done)
              </span>
              <input
                type="checkbox"
                checked={settings.enableAutoToolbar}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    enableAutoToolbar: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Toolbar Placeholder */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                shouldShowToolbarPlaceholder
              </span>
              <input
                type="checkbox"
                checked={settings.shouldShowToolbarPlaceholder}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    shouldShowToolbarPlaceholder: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Toolbar Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                toolbarDoneBarButtonItemText
              </label>
              <input
                type="text"
                value={settings.toolbarDoneBarButtonItemText}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    toolbarDoneBarButtonItemText: e.target.value,
                  }))
                }
                placeholder="Done or تم"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                toolbarTintColor
              </label>
              <div className="flex items-center gap-2">
                {tintOptions.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({ ...prev, toolbarTintColor: t.value }))
                    }
                    title={t.label}
                    className={`w-6 h-6 rounded-full transition-all ${
                      settings.toolbarTintColor === t.value
                        ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: t.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SwiftyKeyboard Studio & Custom Themes */}
      {activeTab === 'studio' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Theme Presets */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Keyboard Theme Preset</span>
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    theme: e.target.value as KeyboardTheme,
                  }))
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="ios17-light">iOS 17 Light (Classic White)</option>
                <option value="ios17-dark">iOS 17 Dark (OLED Charcoal)</option>
                <option value="ios18-glass">iOS 18 Frosted Glassmorphism</option>
                <option value="android17-material">Android 17 Material You Dynamic</option>
                <option value="custom">Custom Studio Palette (SwiftyKit)</option>
              </select>
            </div>

            {/* Target Hardware */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Hardware Simulation Frame</span>
              </label>
              <select
                value={settings.deviceType}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    deviceType: e.target.value as DeviceType,
                  }))
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <option value="iphone16">Apple iPhone 16 Pro Max</option>
                <option value="android17">Android 17 Jetpack Flagship</option>
              </select>
            </div>
          </div>

          {/* Custom Theme Studio Controls */}
          {settings.theme === 'custom' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Custom Palette & Geometry Editor
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Tray Background</label>
                  <input
                    type="color"
                    value={settings.customTheme.bg}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        customTheme: { ...prev.customTheme, bg: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Keycap Background</label>
                  <input
                    type="color"
                    value={settings.customTheme.keyBg}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        customTheme: { ...prev.customTheme, keyBg: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Keycap Text Color</label>
                  <input
                    type="color"
                    value={settings.customTheme.textColor}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        customTheme: { ...prev.customTheme, textColor: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Return / Action Key</label>
                  <input
                    type="color"
                    value={settings.customTheme.returnColor}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        customTheme: { ...prev.customTheme, returnColor: e.target.value },
                      }))
                    }
                    className="w-full h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-600 bg-transparent"
                  />
                </div>
              </div>

              {/* Sliders for Radius & Height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>Key Corner Radius</span>
                    <span className="font-mono">{settings.customTheme.keyRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={18}
                    value={settings.customTheme.keyRadius}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        customTheme: {
                          ...prev.customTheme,
                          keyRadius: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>Keycap Height</span>
                    <span className="font-mono">{settings.customTheme.keyHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min={38}
                    max={50}
                    value={settings.customTheme.keyHeight}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        customTheme: {
                          ...prev.customTheme,
                          keyHeight: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SwiftyKeyboard Numeric Pad Highlight */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
            <Hash className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">
                SwiftyKeyboard Dedicated Numeric / PIN Pad
              </span>
              <p className="text-blue-700 dark:text-blue-400 mt-0.5">
                Inspired by <code>SwiftyKit/SwiftyKeyboard</code>: tap the <strong># SwiftyKeypad</strong> button
                inside the keyboard suggestion bar to instantly switch to the large numeric PIN & payment dialer layout!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Typing Ergonomics & Audio Synthesizer */}
      {activeTab === 'ergonomics' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Sound Styles */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Keyboard Acoustic Profile</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'ios', label: 'iOS 17 Authentic', desc: 'Damped impulse' },
                { id: 'mechanical', label: 'Cherry MX Blue', desc: 'Tactile switch' },
                { id: 'bubble', label: 'Water Bubble', desc: 'Soft pop' },
                { id: 'silent', label: 'Silent / Muted', desc: 'No sound' },
              ].map((sound) => (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      soundType: sound.id as SoundType,
                      shouldPlayInputClicks: sound.id !== 'silent',
                    }))
                  }
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    settings.soundType === sound.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{sound.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{sound.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typing Gestures */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Advanced iOS & SwiftyKeyboard Gestures
            </span>

            {/* Trackpad mode */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MoveHorizontal className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">
                    Spacebar Trackpad Mode
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Swipe left or right across the spacebar to move cursor smoothly
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.trackpadMode}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, trackpadMode: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Double space shortcut */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">
                  Double Space Period Shortcut (". ")
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tapping spacebar twice quickly inserts a full stop and a space
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.doubleSpaceShortcut}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, doubleSpaceShortcut: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Haptics */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">
                    Vibration & Haptic Feedback
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tactile micro-vibration on every key stroke
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableHaptics}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, enableHaptics: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
