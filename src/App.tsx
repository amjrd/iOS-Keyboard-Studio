import React, { useState } from 'react';
import {
  IQKeyboardSettings,
  AndroidBuildConfig,
} from './types/keyboard';
import { DeviceSimulator } from './components/DeviceSimulator';
import { IQManagerConfigPanel } from './components/IQManagerConfigPanel';
import { ApkBuilderModal } from './components/ApkBuilderModal';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { WorkflowActionModal } from './components/WorkflowActionModal';
import { DirectApkDownloadModal } from './components/DirectApkDownloadModal';
import { GithubRepoExplorer } from './components/GithubRepoExplorer';
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
  GitBranch,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Main View Mode: GitHub Repo Explorer vs Phone Simulator
  const [viewMode, setViewMode] = useState<'github_repo' | 'simulator'>('github_repo');

  // IQKeyboardManager & SwiftyKeyboard state
  const [settings, setSettings] = useState<IQKeyboardSettings>({
    enabled: true,
    distanceFromTextField: 16,
    shouldResignOnTouchOutside: true,
    enableAutoToolbar: true,
    shouldShowToolbarPlaceholder: true,
    toolbarDoneBarButtonItemText: 'Done',
    toolbarTintColor: '#007aff',
    shouldPlayInputClicks: true,
    soundType: 'ios',
    enableHaptics: true,
    theme: 'ios17-light',
    customTheme: {
      keyRadius: 6,
      keyHeight: 42,
      bg: '#1e1b2e',
      keyBg: '#2f2b4a',
      textColor: '#ffffff',
      specialKeyBg: '#443e68',
      returnColor: '#7c3aed',
      glassBlur: true,
    },
    deviceType: 'iphone16',
    language: 'ar',
    doubleSpaceShortcut: true,
    trackpadMode: true,
    showDiacriticsOnLongPress: true,
  });

  // Android APK configuration targeting Gautier7799/iOS-Keyboard-Studio-APK
  const [androidConfig, setAndroidConfig] = useState<AndroidBuildConfig>({
    appName: 'iOS Keyboard Studio',
    packageName: 'com.gautier.ioskeyboard',
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
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isDirectApkModalOpen, setIsDirectApkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadZip = async () => {
    await generateAndDownloadZip(androidConfig);
    showToast('تم تحميل كود المستودع بالكامل (.zip) لرفعه على GitHub!');
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
            <Github className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            iOS-Keyboard-Studio-APK
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setViewMode('github_repo')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              viewMode === 'github_repo'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>ملفات المستودع (GitHub Files)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              viewMode === 'simulator'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>المحاكي التفاعلي (Preview)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsWorkflowModalOpen(true)}
            className="hover:text-purple-600 dark:hover:text-purple-400 text-purple-600 dark:text-purple-400 font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow Actions (CI/CD)</span>
          </button>

          <a
            href="https://github.com/Gautier7799/iOS-Keyboard-Studio-APK"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadZip}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>تحميل ملفات المستودع (ZIP)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Intro Header focused on GitHub Repo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
              <span>https://github.com/Gautier7799/iOS-Keyboard-Studio-APK</span>
              <span aria-hidden="true">·</span>
              <span>hackiftekhar/IQKeyboardManager Port</span>
              <span aria-hidden="true">·</span>
              <span>SwiftyKit/SwiftyKeyboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              بناء لوحة مفاتيح iOS 17 لأندرويد على منصة GitHub
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              تم تجهيز وتنظيم كامل ملفات المشروع المصدرية (Kotlin & Jetpack Compose & XML & Gradle) بالإضافة إلى سير عمل{' '}
              <strong>GitHub Actions</strong> لتوليد ملف الـ <strong>APK</strong> تلقائياً عند رفعه إلى مستودعك.
            </p>
          </div>

          {/* Quick Segmented Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('github_repo')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'github_repo'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>ملفات المستودع (GitHub)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('simulator')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'simulator'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>المحاكي التفاعلي</span>
            </button>
          </div>
        </div>

        {/* PRIMARY VIEW 1: GitHub Repository Code Explorer */}
        {viewMode === 'github_repo' && (
          <div className="space-y-6">
            <GithubRepoExplorer
              config={androidConfig}
              onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              onOpenDirectApk={() => setIsDirectApkModalOpen(true)}
              onShowToast={showToast}
            />

            {/* Workflow Action Highlight Banner */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    كيف يقوم GitHub ببناء ملف الـ APK تلقائياً؟
                  </h4>
                  <p className="text-[11px] text-purple-300 mt-0.5">
                    ملف <code>.github/workflows/build-apk.yml</code> المرفق بالمشروع يقوم بتشغيل خوادم GitHub المجانية لتجميع كود الـ Kotlin وتوقيع الـ APK ونشره في Releases.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsWorkflowModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                >
                  معاينة سير العمل (CI/CD)
                </button>
                <button
                  type="button"
                  onClick={() => setIsDirectApkModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  تحميل APK مباشر
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY VIEW 2: Interactive Hardware & Keyboard Simulator */}
        {viewMode === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Hardware Simulator (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <DeviceSimulator
                settings={settings}
                onUpdateSettings={setSettings}
                onShowSuccessAlert={showToast}
              />
              <p className="mt-3 text-xs text-slate-400 text-center max-w-xs">
                اختبار عملي لنتائج كود كوتلن: لوحة مفاتيح iOS 17 العربية والإنجليزية ومحرك تجنب الحجب التلقائي IQKeyboardManager.
              </p>
            </div>

            {/* Right Column: Settings & Architecture & APK Build Pipeline (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <IQManagerConfigPanel
                settings={settings}
                onChange={setSettings}
                onOpenApkModal={() => setIsApkModalOpen(true)}
                onOpenCodeModal={() => setIsCodeModalOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 lg:px-12 mt-12 bg-white dark:bg-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span>Target Repository:</span>
            <a
              href="https://github.com/Gautier7799/iOS-Keyboard-Studio-APK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-bold"
            >
              Gautier7799/iOS-Keyboard-Studio-APK
            </a>
            <span>·</span>
            <a
              href="https://github.com/hackiftekhar/IQKeyboardManagerObjC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:underline"
            >
              hackiftekhar/IQKeyboardManager
            </a>
            <span>·</span>
            <a
              href="https://github.com/SwiftyKit/SwiftyKeyboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:underline"
            >
              SwiftyKit/SwiftyKeyboard
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadZip}
              className="hover:text-slate-800 dark:hover:text-white transition-colors font-semibold"
            >
              تحميل ملفات GitHub (ZIP)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsWorkflowModalOpen(true)}
              className="hover:text-slate-800 dark:hover:text-white transition-colors font-semibold text-purple-600 dark:text-purple-400"
            >
              Workflow Actions
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
        onOpenWorkflowModal={() => {
          setIsApkModalOpen(false);
          setIsWorkflowModalOpen(true);
        }}
      />

      <AndroidCodeViewer
        config={androidConfig}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onDownloadZip={handleDownloadZip}
      />

      <WorkflowActionModal
        config={androidConfig}
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />

      <DirectApkDownloadModal
        config={androidConfig}
        isOpen={isDirectApkModalOpen}
        onClose={() => setIsDirectApkModalOpen(false)}
        onOpenWorkflow={() => {
          setIsDirectApkModalOpen(false);
          setIsWorkflowModalOpen(true);
        }}
      />
    </div>
  );
}
