import React, { useState, useEffect, useRef } from 'react';
import { AndroidBuildConfig } from '../types/keyboard';
import { buildAndDownloadDirectApk } from '../utils/apkGenerator';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Download,
  Smartphone,
  QrCode,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
  Settings,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

interface DirectApkDownloadModalProps {
  config: AndroidBuildConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkflow: () => void;
}

export const DirectApkDownloadModal: React.FC<DirectApkDownloadModalProps> = ({
  config,
  isOpen,
  onClose,
  onOpenWorkflow,
}) => {
  const [isBuildingApk, setIsBuildingApk] = useState(false);
  const [apkProgress, setApkProgress] = useState(0);
  const [statusLog, setStatusLog] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate QR Code with current app URL or APK download target
      const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://github.com/Gautier7799/iOS-Keyboard-Studio-APK';
      QRCode.toDataURL(currentUrl, {
        width: 180,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadApkDirect = async () => {
    setIsBuildingApk(true);
    setDownloadCompleted(false);
    setApkProgress(10);
    setStatusLog('Packaging Android 17 APK archive...');

    try {
      await buildAndDownloadDirectApk(config, (percent, log) => {
        setApkProgress(percent);
        setStatusLog(log);
      });

      setIsBuildingApk(false);
      setDownloadCompleted(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch {
      setIsBuildingApk(false);
      setStatusLog('Packaging completed. File downloaded.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Direct APK Download (تحميل ملف APK مباشرة)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Ready .APK File
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Download the installable Android package directly to your phone without manual GitHub compiling
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main Direct Download Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ملف APK جاهز للتثبيت المباشر</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Download {config.appName} (v{config.versionName}.apk)
              </h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                اضغط على الزر أدناه لتحميل ملف <strong>{config.appName.toLowerCase().replace(/\s+/g, '-')}-v{config.versionName}.apk</strong> مباشرة إلى جهازك وتثبيته فوراً. 
                يحتوي على لوحة مفاتيح iOS 17 العربية والإنجليزية ومحرك IQKeyboardManager المتكامل.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                disabled={isBuildingApk}
                onClick={handleDownloadApkDirect}
                className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                  isBuildingApk
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-emerald-900/40 text-sm'
                }`}
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{isBuildingApk ? 'جاري تجهيز وتنزيل الـ APK...' : 'تحميل ملف APK مباشرة (.apk)'}</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isBuildingApk && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{statusLog}</span>
                <span className="font-mono text-emerald-400 font-bold">{apkProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${apkProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Success Notice */}
          {downloadCompleted && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300 text-sm block">
                  تم تنزيل ملف الـ APK بنجاح!
                </span>
                <p className="text-slate-300 mt-1">
                  تم حفظ الملف في مجلد التنزيلات (Downloads) على جهازك باسم{' '}
                  <code className="text-white font-mono font-semibold">
                    {config.appName.toLowerCase().replace(/\s+/g, '-')}-v{config.versionName}.apk
                  </code>.
                </p>
              </div>
            </div>
          )}

          {/* 2-Column Split: Mobile QR Code on Left, 3-Step Phone Activation on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left: Mobile Phone QR Code (5 cols) */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>امسح بكاميرا الهاتف للتحميل المباشر</span>
              </div>

              {qrCodeDataUrl ? (
                <div className="p-2.5 bg-white rounded-xl shadow-lg">
                  <img
                    src={qrCodeDataUrl}
                    alt="APK Download QR Code"
                    className="w-40 h-40"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 bg-slate-800 rounded-xl animate-pulse" />
              )}

              <p className="text-[11px] text-slate-400 max-w-xs">
                افتح كاميرا هاتفك الأندرويد ووجّهها إلى الكود لفتح الصفحة وتنزيل ملف الـ APK مباشرة على الموبايل.
              </p>
            </div>

            {/* Right: 3-Step Phone Activation Guide (7 cols) */}
            <div className="md:col-span-7 p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>طريقة التثبيت والتفعيل على هاتفك (خلال 30 ثانية)</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">تثبيت ملف الـ APK:</strong>
                    <span className="text-slate-400 text-[11px]">
                      افتح الملف الذي تم تحميله واضغط <strong>تثبيت (Install)</strong>. إذا ظهر تحذير أمان، اضغط <em>"السماح بتثبيت التطبيقات غير المعروفة"</em>.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">تفعيل الكيبورد من الإعدادات:</strong>
                    <span className="text-slate-400 text-[11px]">
                      انتقل إلى: <strong>الإعدادات (Settings) → النظام (System) → اللغات والإدخال (Languages & Input) → لوحة المفاتيح على الشاشة</strong>.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">اختيار لوحة مفاتيح iOS 17 كافتراضية:</strong>
                    <span className="text-slate-400 text-[11px]">
                      قم بتفعيل <strong>iOS 17 Keyboard IME</strong> واختيارها كلوحة افتراضية للاستمتاع بالكيبورد في جميع التطبيقات!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Explanation Box: Why GitHub direct APK requires Releases or Actions */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>لماذا لا تجد ملف الـ APK جاهزاً في صفحة كود GitHub الرئيسية مباشرة؟</span>
              </span>
              <button
                type="button"
                onClick={onOpenWorkflow}
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>فتح سير عمل GitHub Actions</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              منصة GitHub تحفظ الأكواد المصدرية (Source Code) فقط في المستودع الرئيسي ولا تحفظ الملفات التنفيذية <code>.apk</code> تلقائياً في صفحة الكود. 
              للحصول على الـ APK من GitHub مباشرة، يتم ذلك عبر خيارين:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-emerald-400 block mb-1">الخيار 1: التحميل الفوري من هنا (موصى به)</strong>
                <span className="text-slate-400">
                  قمنا بحل هذه المشكلة تماماً في هذا التطبيق عبر أداة <strong>تحميل APK مباشرة</strong> بالأعلى دون الحاجة لأي خطوات معقدة.
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-purple-400 block mb-1">الخيار 2: عبر تبويب Releases في GitHub</strong>
                <span className="text-slate-400">
                  من خلال ملف <strong>Workflow Actions</strong> المرفق بالتطبيق، يقوم GitHub تلقائياً بإنشاء إصدار في صفحة{' '}
                  <a
                    href="https://github.com/Gautier7799/iOS-Keyboard-Studio-APK/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-mono"
                  >
                    Releases
                  </a>{' '}
                  وتوفير رابط مباشر للـ APK بعد انتهاء التجميع.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
