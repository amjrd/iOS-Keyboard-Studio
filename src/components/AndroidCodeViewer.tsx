import React, { useState } from 'react';
import { AndroidBuildConfig } from '../types/keyboard';
import { getAndroidFiles } from '../utils/androidProjectCode';
import { Copy, Check, FileCode, X, Download } from 'lucide-react';

interface AndroidCodeViewerProps {
  config: AndroidBuildConfig;
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export const AndroidCodeViewer: React.FC<AndroidCodeViewerProps> = ({
  config,
  isOpen,
  onClose,
  onDownloadZip,
}) => {
  const [activeTab, setActiveTab] = useState<
    'iqmanager' | 'service' | 'ui' | 'manifest' | 'gradle' | 'github'
  >('iqmanager');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files = getAndroidFiles(config);

  const fileMap = {
    iqmanager: {
      name: 'IQKeyboardManager.kt',
      path: `app/src/main/java/.../iqkeyboard/IQKeyboardManager.kt`,
      code: files.iqKeyboardManagerKotlin,
      lang: 'kotlin',
    },
    service: {
      name: 'IosKeyboardService.kt',
      path: `app/src/main/java/.../service/IosKeyboardService.kt`,
      code: files.iosKeyboardServiceKotlin,
      lang: 'kotlin',
    },
    ui: {
      name: 'IosKeyboardView.kt',
      path: `app/src/main/java/.../ui/IosKeyboardView.kt`,
      code: files.iosKeyboardViewKotlin,
      lang: 'kotlin',
    },
    manifest: {
      name: 'AndroidManifest.xml',
      path: `app/src/main/AndroidManifest.xml`,
      code: files.androidManifestXml,
      lang: 'xml',
    },
    gradle: {
      name: 'build.gradle.kts',
      path: `app/build.gradle.kts`,
      code: files.buildGradleKts,
      lang: 'kotlin',
    },
    github: {
      name: 'build-apk.yml',
      path: `.github/workflows/build-apk.yml`,
      code: files.githubActionsYml,
      lang: 'yaml',
    },
  };

  const currentFile = fileMap[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Android 17 / Jetpack Compose Source Code
              </h3>
              <p className="text-[11px] text-slate-400">
                Pure Kotlin implementation of IQKeyboardManager & iOS Keyboard IME
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadZip}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(Object.keys(fileMap) as Array<keyof typeof fileMap>).map((key) => {
            const item = fileMap[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Code View Header */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="truncate">{currentFile.path}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 overflow-auto p-4 bg-[#0d1117] font-mono text-xs leading-relaxed text-slate-300 select-text">
          <pre>
            <code>{currentFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
