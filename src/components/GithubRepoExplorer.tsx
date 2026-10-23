import React, { useState } from 'react';
import { AndroidBuildConfig } from '../types/keyboard';
import { getAndroidFiles, generateAndDownloadZip } from '../utils/androidProjectCode';
import {
  Folder,
  FileCode,
  Github,
  Download,
  Copy,
  Check,
  GitBranch,
  Terminal,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface GithubRepoExplorerProps {
  config: AndroidBuildConfig;
  onOpenWorkflow: () => void;
  onOpenDirectApk: () => void;
  onShowToast: (msg: string) => void;
}

export const GithubRepoExplorer: React.FC<GithubRepoExplorerProps> = ({
  config,
  onOpenWorkflow,
  onOpenDirectApk,
  onShowToast,
}) => {
  const [selectedFileKey, setSelectedFileKey] = useState<string>('workflow');
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    github: true,
    workflows: true,
    app: true,
    src: true,
    main: true,
    java: true,
    pkg: true,
    res: true,
  });

  const files = getAndroidFiles(config);

  const fileEntries: Record<
    string,
    { name: string; path: string; code: string; lang: string }
  > = {
    workflow: {
      name: 'build-apk.yml',
      path: '.github/workflows/build-apk.yml',
      code: files.githubActionsYml,
      lang: 'yaml',
    },
    service: {
      name: 'IosKeyboardService.kt',
      path: `app/src/main/java/${files.packagePath}/service/IosKeyboardService.kt`,
      code: files.iosKeyboardServiceKotlin,
      lang: 'kotlin',
    },
    ui: {
      name: 'IosKeyboardView.kt',
      path: `app/src/main/java/${files.packagePath}/ui/IosKeyboardView.kt`,
      code: files.iosKeyboardViewKotlin,
      lang: 'kotlin',
    },
    iqkeyboard: {
      name: 'IQKeyboardManager.kt',
      path: `app/src/main/java/${files.packagePath}/iqkeyboard/IQKeyboardManager.kt`,
      code: files.iqKeyboardManagerKotlin,
      lang: 'kotlin',
    },
    mainActivity: {
      name: 'MainActivity.kt',
      path: `app/src/main/java/${files.packagePath}/MainActivity.kt`,
      code: files.mainActivityKotlin,
      lang: 'kotlin',
    },
    manifest: {
      name: 'AndroidManifest.xml',
      path: 'app/src/main/AndroidManifest.xml',
      code: files.androidManifestXml,
      lang: 'xml',
    },
    methodXml: {
      name: 'method.xml',
      path: 'app/src/main/res/xml/method.xml',
      code: files.methodXml,
      lang: 'xml',
    },
    appGradle: {
      name: 'build.gradle.kts (app)',
      path: 'app/build.gradle.kts',
      code: files.buildGradleKts,
      lang: 'kotlin',
    },
    rootGradle: {
      name: 'build.gradle.kts (root)',
      path: 'build.gradle.kts',
      code: files.rootBuildGradleKts,
      lang: 'kotlin',
    },
    settingsGradle: {
      name: 'settings.gradle.kts',
      path: 'settings.gradle.kts',
      code: files.settingsGradleKts,
      lang: 'kotlin',
    },
    readme: {
      name: 'README.md',
      path: 'README.md',
      code: files.readmeMd,
      lang: 'markdown',
    },
  };

  const activeFile = fileEntries[selectedFileKey] || fileEntries.workflow;

  const toggleFolder = (key: string) => {
    setOpenFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const gitCommands = `# 1. Clone your repository from GitHub
git clone https://github.com/Gautier7799/iOS-Keyboard-Studio-APK.git
cd iOS-Keyboard-Studio-APK

# 2. Extract the downloaded ZIP contents into this folder

# 3. Commit and push to GitHub
git add .
git commit -m "feat: complete iOS 17 Keyboard IME with IQKeyboardManager & GitHub Actions APK build"
git branch -M main
git push -u origin main`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleDownloadZip = async () => {
    await generateAndDownloadZip(config);
    onShowToast('تم تحميل كود المستودع بالكامل (.zip) لرفعه على GitHub!');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* GitHub Repository Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-slate-800 dark:text-white" />
            <a
              href="https://github.com/Gautier7799/iOS-Keyboard-Studio-APK"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
            >
              <span>Gautier7799 / iOS-Keyboard-Studio-APK</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Public Repository
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ملفات المستودع الرسمية لبناء لوحة مفاتيح <strong>iOS 17 Keyboard</strong> على <strong>أندرويد</strong> باستخدام <strong>Jetpack Compose</strong> مع دعم <strong>GitHub Actions</strong> لتوليد ملف الـ APK تلقائياً.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadZip}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>تنزيل ملفات المستودع بالكامل (ZIP)</span>
          </button>
          <button
            type="button"
            onClick={onOpenWorkflow}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow Actions (CI/CD)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Workspace: File Tree on Left, Code Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left: Tree Navigator (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-950/30 overflow-y-auto max-h-[580px] font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Repository Files Structure
          </div>

          {/* .github/workflows */}
          <div>
            <button
              type="button"
              onClick={() => toggleFolder('github')}
              className="w-full flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left font-semibold text-slate-800 dark:text-slate-200"
            >
              {openFolders.github ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <Folder className="w-4 h-4 text-purple-400" />
              <span>.github</span>
            </button>

            {openFolders.github && (
              <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleFolder('workflows')}
                  className="w-full flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left"
                >
                  {openFolders.workflows ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <Folder className="w-3.5 h-3.5 text-purple-400" />
                  <span>workflows</span>
                </button>

                {openFolders.workflows && (
                  <div className="ml-4 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedFileKey('workflow')}
                      className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                        selectedFileKey === 'workflow'
                          ? 'bg-blue-600 text-white font-bold'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-300'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>build-apk.yml</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* app */}
          <div>
            <button
              type="button"
              onClick={() => toggleFolder('app')}
              className="w-full flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left font-semibold text-slate-800 dark:text-slate-200"
            >
              {openFolders.app ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <Folder className="w-4 h-4 text-blue-400" />
              <span>app</span>
            </button>

            {openFolders.app && (
              <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                {/* Kotlin Source files */}
                <button
                  type="button"
                  onClick={() => setSelectedFileKey('service')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'service'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate">IosKeyboardService.kt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileKey('ui')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'ui'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate">IosKeyboardView.kt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileKey('iqkeyboard')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'iqkeyboard'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate">IQKeyboardManager.kt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileKey('mainActivity')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'mainActivity'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-500" />
                  <span className="truncate">MainActivity.kt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileKey('manifest')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'manifest'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-500" />
                  <span>AndroidManifest.xml</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileKey('methodXml')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'methodXml'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-500" />
                  <span>res/xml/method.xml</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFileKey('appGradle')}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                    selectedFileKey === 'appGradle'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-green-500" />
                  <span>app/build.gradle.kts</span>
                </button>
              </div>
            )}
          </div>

          {/* Root Gradle & Config */}
          <button
            type="button"
            onClick={() => setSelectedFileKey('rootGradle')}
            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
              selectedFileKey === 'rootGradle'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-green-500" />
            <span>build.gradle.kts</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFileKey('settingsGradle')}
            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
              selectedFileKey === 'settingsGradle'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-green-500" />
            <span>settings.gradle.kts</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFileKey('readme')}
            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
              selectedFileKey === 'readme'
                ? 'bg-blue-600 text-white font-bold'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>README.md</span>
          </button>
        </div>

        {/* Right: Code Inspector (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-[#0d1117] text-slate-300">
          {/* File Toolbar */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold">{activeFile.path}</span>

            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copiedFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-sans font-semibold">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="font-sans font-semibold">نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-auto max-h-[500px] select-text">
            <pre>
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Bottom: Git Push Quick Guide to GitHub */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              طريقة رفع الملفات مباشرة إلى مستودعك على GitHub
            </h4>
          </div>

          <button
            type="button"
            onClick={handleCopyGitCommands}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            {copiedCommand ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">تم نسخ الأوامر!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الأوامر</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto select-text">
          <pre>{gitCommands}</pre>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            بمجرد تنفيذ <code className="text-slate-200">git push origin main</code>، سيقوم <strong>GitHub Actions</strong> تلقائياً بتجميع التطبيق وبناء ملف الـ <strong>APK</strong> وإتاحته للتحميل مباشرة من صفحة الـ Releases في مستودعك!
          </span>
          <a
            href="https://github.com/Gautier7799/iOS-Keyboard-Studio-APK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline flex items-center gap-1 font-semibold whitespace-nowrap"
          >
            <span>انتقل إلى مستودعك</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
