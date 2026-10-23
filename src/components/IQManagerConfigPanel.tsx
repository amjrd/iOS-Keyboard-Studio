import React from 'react';
import { IQKeyboardSettings, KeyboardTheme, DeviceType, KeyboardLanguage } from '../types/keyboard';
import { Sliders, Volume2, Vibrate, Palette, Smartphone, Globe, Sparkles } from 'lucide-react';

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
              IQKeyboardManager Preferences
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ported from hackiftekhar/IQKeyboardManager for Android 17 Jetpack Compose
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCodeModal}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Kotlin Sources
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

      {/* Primary Toggle: Master Enable */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white block">
            IQKeyboardManager.enable
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Automatically shift view when text field is covered by keyboard
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
            <span className="font-mono font-bold text-blue-600">{settings.distanceFromTextField}px</span>
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
            <span>25px (default)</span>
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
            enableAutoToolbar (Done/Prev/Next)
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

        {/* Toolbar Placeholder Title */}
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

      {/* Toolbar Done Text & Tint Color */}
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

      {/* Hardware & Theme Controls */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Device Frame */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Target Device</span>
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
              <option value="iphone16">Apple iPhone 16 Pro</option>
              <option value="android17">Android 17 Jetpack Flagship</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Keyboard Theme</span>
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
              <option value="ios17-light">iOS 17 Light (Classic)</option>
              <option value="ios17-dark">iOS 17 Dark (OLED)</option>
              <option value="ios18-glass">iOS 18 Frosted Glass</option>
              <option value="android17-material">Android 17 Material You</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Keyboard Language</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() =>
                  onChange((prev) => ({ ...prev, language: 'en' }))
                }
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  settings.language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                English QWERTY
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange((prev) => ({ ...prev, language: 'ar' }))
                }
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  settings.language === 'ar'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                العربية
              </button>
            </div>
          </div>
        </div>

        {/* Sound & Haptic Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>Mechanical Tap Audio</span>
            <input
              type="checkbox"
              checked={settings.shouldPlayInputClicks}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  shouldPlayInputClicks: e.target.checked,
                }))
              }
              className="ml-1 w-3.5 h-3.5 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <Vibrate className="w-4 h-4 text-slate-500" />
            <span>Vibration / Haptic Feedback</span>
            <input
              type="checkbox"
              checked={settings.enableHaptics}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  enableHaptics: e.target.checked,
                }))
              }
              className="ml-1 w-3.5 h-3.5 text-blue-600 rounded border-slate-300 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
