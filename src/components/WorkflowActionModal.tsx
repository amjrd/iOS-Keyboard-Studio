import React, { useState } from 'react';
import { AndroidBuildConfig } from '../types/keyboard';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle2,
  Copy,
  Check,
  Download,
  X,
  GitBranch,
  Terminal,
  Shield,
  FileCode,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  Package,
} from 'lucide-react';

interface WorkflowActionModalProps {
  config: AndroidBuildConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowActionModal: React.FC<WorkflowActionModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'yaml_build' | 'yaml_release' | 'secrets'>('simulator');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const workflowSteps = [
    { title: 'actions/checkout@v4', desc: 'Fetch Git repository & submodules', duration: '1.2s' },
    { title: 'actions/setup-java@v4', desc: 'Set up JDK 21 Temurin architecture', duration: '3.1s' },
    { title: 'android-actions/setup-android@v3', desc: 'Configure Android SDK 35 & Command-line tools', duration: '4.5s' },
    { title: 'gradle/actions/setup-gradle@v4', desc: 'Restore Gradle dependency & build cache', duration: '1.8s' },
    { title: 'Decode Signing Keystore', desc: 'Read KEYSTORE_BASE64 from GitHub Secrets', duration: '0.6s' },
    { title: 'Run Jetpack Compose Lint & Tests', desc: './gradlew testReleaseUnitTest', duration: '8.4s' },
    { title: 'Compile & Assemble Release APK', desc: './gradlew assembleRelease --stacktrace', duration: '24.2s' },
    { title: 'Sign & Align APK with apksigner', desc: 'Apply APK Signature Scheme v2, v3, v4', duration: '1.4s' },
    { title: 'actions/upload-artifact@v4', desc: 'Publish APK artifact to GitHub Action run', duration: '2.5s' },
    { title: 'softprops/action-gh-release@v2', desc: 'Create GitHub Release & attach binaries', duration: '1.9s' },
  ];

  const handleRunWorkflow = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setWorkflowLogs([
      `[Workflow Dispatch] Triggered by push on branch 'main'`,
      `Runner: Ubuntu 24.04 LTS (x64) - GitHub-hosted runner`,
      `Repository: Gautier7799/iOS-Keyboard-Studio-APK`,
      `Target: Android 17 / API 35 (Jetpack Compose)`,
    ]);

    const runStep = (index: number) => {
      if (index >= workflowSteps.length) {
        setIsRunning(false);
        setCurrentStepIndex(-1);
        try {
          confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        setWorkflowLogs((prev) => [
          ...prev,
          `\n✅ WORKFLOW COMPLETED SUCCESSFULLY in 49.6s`,
          `Artifact: app-release.apk (4.82 MB) uploaded.`,
          `Release: https://github.com/Gautier7799/iOS-Keyboard-Studio-APK/releases/tag/v${config.versionName}`,
        ]);
        return;
      }

      setCurrentStepIndex(index);
      setWorkflowLogs((prev) => [
        ...prev,
        `> Running step [${index + 1}/${workflowSteps.length}]: ${workflowSteps[index].title}`,
        `  ${workflowSteps[index].desc}`,
      ]);

      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index]);
        runStep(index + 1);
      }, 700);
    };

    setTimeout(() => {
      runStep(0);
    }, 400);
  };

  const buildApkWorkflowYaml = `name: Build & Test Android 17 APK

on:
  push:
    branches: [ "main", "master", "develop" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:
    inputs:
      build_type:
        description: 'Build Type (Release or Debug)'
        required: true
        default: 'release'
        type: choice
        options:
          - release
          - debug

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: 1. Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 2. Set up Java JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: 'gradle'

      - name: 3. Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: 4. Setup Gradle Wrapper Cache
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: wrapper

      - name: 5. Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: 6. Decode Keystore (Optional for Signed Release)
        if: \${{ github.event.inputs.build_type == 'release' || github.ref == 'refs/heads/main' }}
        env:
          KEYSTORE_BASE64: \${{ secrets.KEYSTORE_BASE64 }}
        run: |
          if [ -n "$KEYSTORE_BASE64" ]; then
            echo "$KEYSTORE_BASE64" | base64 --decode > app/release.jks
            echo "KEYSTORE_FILE=release.jks" >> $GITHUB_ENV
          else
            echo "No custom keystore found, proceeding with build."
          fi

      - name: 7. Run Unit Tests & Compose Verification
        run: ./gradlew testReleaseUnitTest --continue

      - name: 8. Build Release APK with Gradle
        env:
          SIGNING_KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          SIGNING_KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
          SIGNING_STORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
        run: ./gradlew assembleRelease --stacktrace

      - name: 9. Upload APK to GitHub Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.toLowerCase().replace(/\\s+/g, '-')}-android17-release.apk
          path: app/build/outputs/apk/release/*.apk
          retention-days: 30
`;

  const releaseWorkflowYaml = `name: Production Release APK & AAB

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  release:
    name: Build Signed APK & Create GitHub Release
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Grant Execute Permission
        run: chmod +x gradlew

      - name: Decode Production Keystore
        env:
          KEYSTORE_BASE64: \${{ secrets.KEYSTORE_BASE64 }}
        run: |
          echo "$KEYSTORE_BASE64" | base64 --decode > app/release.jks

      - name: Build Signed APK & App Bundle (AAB)
        env:
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
        run: |
          ./gradlew assembleRelease bundleRelease

      - name: Publish GitHub Release with Artifacts
        uses: softprops/action-gh-release@v2
        with:
          name: Release \${{ github.ref_name }}
          draft: false
          prerelease: false
          generate_release_notes: true
          files: |
            app/build/outputs/apk/release/*.apk
            app/build/outputs/bundle/release/*.aab
`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadYaml = (yamlContent: string, filename: string) => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[88vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>GitHub Actions CI/CD Workflow Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  Android 17 / API 35
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Automated continuous compilation, testing, signing, and release pipeline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Workflow Runner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('yaml_build')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'yaml_build'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>.github/workflows/build-apk.yml</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('yaml_release')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'yaml_release'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>.github/workflows/release.yml</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('secrets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'secrets'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Keystore & Secrets Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: Simulator */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              {/* Trigger Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Run GitHub Actions Runner (Simulation)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Execute the 10-step CI/CD pipeline in real-time to test compilation and artifact generation.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleRunWorkflow}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all ${
                    isRunning
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95 shadow-purple-900/30'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running Pipeline...' : 'Trigger workflow_dispatch'}</span>
                </button>
              </div>

              {/* 10 Pipeline Steps List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workflowSteps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-200'
                          : isCurrent
                          ? 'bg-purple-950/40 border-purple-600 text-white ring-1 ring-purple-500 animate-pulse'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-mono font-semibold block">{step.title}</span>
                          <span className="text-[10px] text-slate-400">{step.desc}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {isDone ? step.duration : isCurrent ? 'Running...' : 'Queued'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Live Terminal Output */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0c0e14]">
                <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span>Runner Console Output</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ubuntu-latest (x64)</span>
                </div>

                <div className="p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto space-y-1 select-text">
                  {workflowLogs.length === 0 ? (
                    <div className="text-slate-500 italic">
                      Click "Trigger workflow_dispatch" above to start the live GitHub Actions runner simulation.
                    </div>
                  ) : (
                    workflowLogs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes('SUCCESS')
                            ? 'text-emerald-400 font-bold'
                            : log.startsWith('>')
                            ? 'text-purple-300'
                            : log.startsWith('[Workflow')
                            ? 'text-blue-400 font-semibold'
                            : 'text-slate-400'
                        }
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Build Workflow YAML */}
          {activeTab === 'yaml_build' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Continuous Integration & APK Build Workflow
                  </h4>
                  <p className="text-xs text-slate-400">
                    Place at <code>.github/workflows/build-apk.yml</code> in your repository
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(buildApkWorkflowYaml, 'build_yaml')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    {copiedCode === 'build_yaml' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy YAML</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadYaml(buildApkWorkflowYaml, 'build-apk.yml')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs text-white transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto select-text">
                <pre>
                  <code>{buildApkWorkflowYaml}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Release Workflow YAML */}
          {activeTab === 'yaml_release' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Automated GitHub Tag Release Workflow
                  </h4>
                  <p className="text-xs text-slate-400">
                    Runs automatically when you push a tag like <code>v1.0.0</code> and uploads the APK + AAB
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(releaseWorkflowYaml, 'release_yaml')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    {copiedCode === 'release_yaml' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy YAML</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadYaml(releaseWorkflowYaml, 'release.yml')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs text-white transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 font-mono text-xs leading-relaxed text-slate-300 max-h-[60vh] overflow-y-auto select-text">
                <pre>
                  <code>{releaseWorkflowYaml}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Secrets & Keystore Guide */}
          {activeTab === 'secrets' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>How to Configure GitHub Secrets for Signed APKs</span>
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  To produce officially signed release APKs that can be installed on any Android 17 device without security warnings, 
                  store your signing key in GitHub Actions Secrets:
                </p>

                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">
                    1. Generate a Release Keystore (in Terminal):
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                    <code>
                      keytool -genkey -v -keystore release.jks -alias iqkeyboard -keyalg RSA -keysize 2048 -validity 10000
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'keytool -genkey -v -keystore release.jks -alias iqkeyboard -keyalg RSA -keysize 2048 -validity 10000',
                          'keytool_cmd'
                        )
                      }
                      className="ml-2 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">
                    2. Convert Keystore to Base64 (for GitHub Secrets):
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#0d1117] border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                    <code>base64 -w 0 release.jks &gt; keystore_base64.txt</code>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy('base64 -w 0 release.jks > keystore_base64.txt', 'base64_cmd')
                      }
                      className="ml-2 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-300 block">
                    3. Add Secrets to your GitHub Repository:
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Go to <strong>Settings → Secrets and variables → Actions → New repository secret</strong> and add:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-blue-400 font-mono block">KEYSTORE_BASE64</strong>
                      <span className="text-slate-400">Content of keystore_base64.txt</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-blue-400 font-mono block">KEY_ALIAS</strong>
                      <span className="text-slate-400">e.g. <code>iqkeyboard</code></span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-blue-400 font-mono block">KEY_PASSWORD</strong>
                      <span className="text-slate-400">Your key password</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <strong className="text-blue-400 font-mono block">KEYSTORE_PASSWORD</strong>
                      <span className="text-slate-400">Your keystore password</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
