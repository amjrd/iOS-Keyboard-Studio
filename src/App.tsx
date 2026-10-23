import React, { useState } from 'react';
import {
  IQKeyboardSettings,
  AndroidBuildConfig,
} from './types/keyboard';
import { DeviceSimulator } from './components/DeviceSimulator';
import { IQManagerConfigPanel } from './components/IQManagerConfigPanel';
import { ApkBuilderModal } from './components/ApkBuilderModal';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { generateAndDownloadZip } from './utils/androidProjectCode';
import {
  Keyboard,
  Layers,
  Sparkles,
  Download,
  Github,
  CheckCircle,
  Smartphone,
  Shield,
  Zap,
} from 'lucide-react';

export default function App() {
  // IQKeyboardManager state
  const [settings, setSettings] = useState<IQKeyboardSettings>({
    enabled: true,
    distanceFromTextField: 16,
    shouldResignOnTouchOutside: true,
    enableAutoToolbar: true,
    shouldShowToolbarPlaceholder: true,
    toolbarDoneBarButtonItemText: 'Done',
    toolbarTintColor: '#007aff',
    shouldPlayInputClicks: true,
    enableHaptics: true,
    theme: 'ios17-light',
    deviceType: 'iphone16',
    language: 'ar', // default to Arabic layout as user requested in Arabic
  });

  // Android APK configuration
  const [androidConfig, setAndroidConfig] = useState<AndroidBuildConfig>({
    appName: 'IQKeyboard Pro',
    packageName: 'com.hackiftekhar.iqkeyboard.android',
    versionName: '1.0.0',
    versionCode: 1,
    targetSdk: 35,
    minSdk: 26,
    composeVersion: '1.7.0',
    kotlinVersion: '2.0.21',
    enableHaptics: true,
    enableSound: true,
    includeToolbar: true,
    languageSupport: 'both',
  });

  // Modals state
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadZip = async () => {
    await generateAndDownloadZip(androidConfig);
    showToast('Project ZIP downloaded! Ready for Android Studio.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (1-line Brand wordmark, 4-5 concise nav links, 1 primary action) */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Keyboard className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            IQKeyboard Pro
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => {
              setSettings((prev) => ({
                ...prev,
                language: prev.language === 'en' ? 'ar' : 'en',
              }));
              showToast(
                `Keyboard language switched to ${
                  settings.language === 'en' ? 'Arabic (العربية)' : 'English'
                }`
              );
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {settings.language === 'en' ? 'Switch to العربية' : 'التبديل إلى English'}
          </button>
          <button
            type="button"
            onClick={() => setIsCodeModalOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Kotlin Architecture
          </button>
          <a
            href="https://github.com/hackiftekhar/IQKeyboardManagerObjC"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsApkModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build Android APK</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
        {/* Intro Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
              <span>hackiftekhar/IQKeyboardManager Port</span>
              <span aria-hidden="true">·</span>
              <span>iOS 17 Keyboard IME</span>
              <span aria-hidden="true">·</span>
              <span>Android 17 Jetpack Compose</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Professional iOS Keyboard & Android 17 APK Builder
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete zero-boilerplate keyboard handling: automatic field avoidance, animated Previous/Next/Done IQToolbar, 
              touch-outside dismissal, authentic iOS 17 keyboard with Arabic & English layouts, and compile-ready Kotlin project export.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadZip}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project ZIP</span>
            </button>
            <button
              type="button"
              onClick={() => setIsApkModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Compile APK</span>
            </button>
          </div>
        </div>

        {/* 2-Column Desktop Grid: Left is Phone Simulator, Right is Config & Tech Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Hardware Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <DeviceSimulator
              settings={settings}
              onUpdateSettings={setSettings}
              onShowSuccessAlert={showToast}
            />
            <p className="mt-3 text-xs text-slate-400 text-center max-w-xs">
              Tap any input field above to trigger the iOS 17 keyboard, sound clicks, and IQKeyboardManager insets calculation.
            </p>
          </div>

          {/* Right Column: Settings & Architecture & APK Build Pipeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Configuration Panel */}
            <IQManagerConfigPanel
              settings={settings}
              onChange={setSettings}
              onOpenApkModal={() => setIsApkModalOpen(true)}
              onOpenCodeModal={() => setIsCodeModalOpen(true)}
            />

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Zero Boilerplate Insets
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Automatically measures focused field positions with <code>BringIntoViewRequester</code> and animates view offsets above the IME.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Automated IQToolbar
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Previous & Next arrow chevrons to cycle between fields effortlessly without touching, plus auto placeholder and Done button.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Android 17 IME Service
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real <code>InputMethodService</code> implementation ready to install and activate across all Android apps.
                </p>
              </div>
            </div>

            {/* Comparison Box: Without vs With IQKeyboardManager */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">
                  Why IQKeyboardManager is Essential
                </h3>
                <span className="text-xs text-blue-400 font-mono">hackiftekhar/IQKeyboardManager</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/40 text-red-200 space-y-1.5">
                  <span className="font-bold text-red-400 block">❌ Without IQKeyboardManager</span>
                  <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Bottom input fields are hidden behind the soft keyboard</li>
                    <li>User cannot see what they are typing in long forms</li>
                    <li>Primary "Submit" and "Save" buttons are completely covered</li>
                    <li>No easy way to jump between form fields without manual scrolling</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-400 block">✅ With IQKeyboardManager</span>
                  <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                    <li>Screen smoothly animates up to reveal the focused field</li>
                    <li>Customizable distance padding (e.g. 16px) above keyboard</li>
                    <li>Integrated IQToolbar with Previous, Next, and Done actions</li>
                    <li>Tapping background instantly dismisses keyboard smoothly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 lg:px-12 mt-12 bg-white dark:bg-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Based on</span>
            <a
              href="https://github.com/hackiftekhar/IQKeyboardManagerObjC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              hackiftekhar/IQKeyboardManager
            </a>
            <span>by Iftekhar Qurashi</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Kotlin Codebase
            </button>
            <button
              type="button"
              onClick={() => setIsApkModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              APK Build Console
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApkBuilderModal
        config={androidConfig}
        onChangeConfig={setAndroidConfig}
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        onOpenCodeViewer={() => {
          setIsApkModalOpen(false);
          setIsCodeModalOpen(true);
        }}
      />

      <AndroidCodeViewer
        config={androidConfig}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onDownloadZip={handleDownloadZip}
      />
    </div>
  );
}
