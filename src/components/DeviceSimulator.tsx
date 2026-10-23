import React, { useRef, useEffect, useState } from 'react';
import {
  IQKeyboardSettings,
  KeyboardLanguage,
} from '../types/keyboard';
import { IosKeyboard } from './IosKeyboard';
import { IQToolbar } from './IQToolbar';
import { FormsPlayground, ScreenType } from './FormsPlayground';
import { Wifi, BatteryMedium, Signal, Info, Smartphone } from 'lucide-react';

interface DeviceSimulatorProps {
  settings: IQKeyboardSettings;
  onUpdateSettings: (updater: (prev: IQKeyboardSettings) => IQKeyboardSettings) => void;
  onShowSuccessAlert?: (msg: string) => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  settings,
  onUpdateSettings,
  onShowSuccessAlert,
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('registration');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [focusedFieldLabel, setFocusedFieldLabel] = useState<string>('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [scrollOffsetY, setScrollOffsetY] = useState<number>(0);
  const [showDebugHud, setShowDebugHud] = useState<boolean>(false);

  // Field order for each screen to enable Previous/Next cycling
  const fieldOrders: Record<ScreenType, string[]> = {
    registration: ['reg_name', 'reg_email', 'reg_password', 'reg_phone', 'reg_city'],
    checkout: ['pay_name', 'pay_number', 'pay_exp', 'pay_cvv', 'pay_address'],
    chat: ['chat_input'],
    notes: ['note_title', 'note_body'],
  };

  const fieldLabels: Record<string, string> = {
    reg_name: 'Full Name',
    reg_email: 'Email Address',
    reg_password: 'Password',
    reg_phone: 'Mobile Number',
    reg_city: 'City / Region',
    pay_name: 'Cardholder Name',
    pay_number: 'Card Number',
    pay_exp: 'Expiry Date',
    pay_cvv: 'Security Code',
    pay_address: 'Billing Address',
    chat_input: 'iMessage Field',
    note_title: 'Note Title',
    note_body: 'Note Body',
  };

  const activeFieldsList = fieldOrders[currentScreen];
  const currentIndex = focusedFieldId ? activeFieldsList.indexOf(focusedFieldId) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < activeFieldsList.length - 1;

  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate IQKeyboardManager displacement
  useEffect(() => {
    if (!isKeyboardVisible || !focusedFieldId) {
      setScrollOffsetY(0);
      return;
    }

    if (!settings.enabled) {
      // IQKeyboardManager is disabled: do NOT adjust scroll (native broken behavior)
      setScrollOffsetY(0);
      return;
    }

    // IQKeyboardManager is enabled: calculate smart offset
    const fieldElement = document.getElementById(focusedFieldId);
    const container = contentRef.current;
    if (fieldElement && container) {
      const fieldRect = fieldElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const keyboardTotalHeight = settings.enableAutoToolbar ? 320 : 276;
      const visibleScreenBottom = containerRect.bottom - keyboardTotalHeight;
      const fieldBottom = fieldRect.bottom;

      // How much the field is covered or needs pushing
      const overlap = fieldBottom + settings.distanceFromTextField - visibleScreenBottom;
      if (overlap > 0) {
        setScrollOffsetY((prev) => Math.min(prev + overlap + 10, 240));
      }
    }
  }, [focusedFieldId, isKeyboardVisible, settings.enabled, settings.distanceFromTextField, settings.enableAutoToolbar]);

  const handleFieldFocus = (id: string, label: string) => {
    setFocusedFieldId(id);
    setFocusedFieldLabel(label);
    setIsKeyboardVisible(true);
  };

  const handleDoneDismiss = () => {
    setIsKeyboardVisible(false);
    setFocusedFieldId(null);
    setScrollOffsetY(0);
  };

  const handleTouchOutside = (e: React.MouseEvent) => {
    if (!settings.shouldResignOnTouchOutside) return;
    const target = e.target as HTMLElement;
    // Don't resign if clicking inside input or keyboard
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('button') ||
      target.closest('.keyboard-container')
    ) {
      return;
    }
    handleDoneDismiss();
  };

  const handleNavigatePrevious = () => {
    if (hasPrevious) {
      const prevId = activeFieldsList[currentIndex - 1];
      const prevEl = document.getElementById(prevId);
      if (prevEl) {
        prevEl.focus();
        handleFieldFocus(prevId, fieldLabels[prevId] || prevId);
      }
    }
  };

  const handleNavigateNext = () => {
    if (hasNext) {
      const nextId = activeFieldsList[currentIndex + 1];
      const nextEl = document.getElementById(nextId);
      if (nextEl) {
        nextEl.focus();
        handleFieldFocus(nextId, fieldLabels[nextId] || nextId);
      }
    }
  };

  const handleCharInput = (char: string) => {
    if (!focusedFieldId) return;
    setFormValues((prev) => ({
      ...prev,
      [focusedFieldId]: (prev[focusedFieldId] || '') + char,
    }));
  };

  const handleBackspace = () => {
    if (!focusedFieldId) return;
    setFormValues((prev) => ({
      ...prev,
      [focusedFieldId]: (prev[focusedFieldId] || '').slice(0, -1),
    }));
  };

  const handleReturn = () => {
    if (hasNext) {
      handleNavigateNext();
    } else {
      handleDoneDismiss();
    }
  };

  const isAndroid = settings.deviceType === 'android17';

  return (
    <div className="flex flex-col items-center">
      {/* Device Switcher & Debug HUD Toggle */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[390px] px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {isAndroid ? 'Android 17 Dynamic Island' : 'iPhone 16 Pro Max'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowDebugHud(!showDebugHud)}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
            showDebugHud
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {showDebugHud ? 'Hide Insets HUD' : 'Show Insets HUD'}
        </button>
      </div>

      {/* Realistic Hardware Frame */}
      <div
        className={`relative w-[360px] sm:w-[380px] h-[720px] rounded-[48px] p-3 shadow-2xl transition-all duration-300 ${
          isAndroid
            ? 'bg-slate-900 border-[8px] border-slate-700 shadow-purple-950/20'
            : 'bg-[#1a1a1c] border-[8px] border-[#2d2d30] shadow-black/40'
        }`}
      >
        {/* Device Screen Viewport */}
        <div
          ref={contentRef}
          onClick={handleTouchOutside}
          className="relative w-full h-full rounded-[38px] overflow-hidden bg-slate-50 dark:bg-[#0f1117] flex flex-col justify-between select-none"
        >
          {/* Top Status Bar with Dynamic Island / Camera */}
          <div className="relative z-30 pt-2.5 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-white bg-transparent">
            {/* Clock */}
            <span className="tracking-tight text-[13px] font-mono">9:41</span>

            {/* Dynamic Island / Android Pill */}
            {isAndroid ? (
              <div className="w-4 h-4 rounded-full bg-black ring-2 ring-slate-800" />
            ) : (
              <div className="w-24 h-6 rounded-full bg-black flex items-center justify-between px-2 text-[9px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="truncate">IQKeyboard</span>
              </div>
            )}

            {/* Icons: 5G, Wifi, Battery */}
            <div className="flex items-center gap-1.5 opacity-90">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Real-time Insets Debugger Banner */}
          {showDebugHud && (
            <div className="z-20 bg-blue-950/90 text-blue-200 px-3 py-1.5 text-[10px] font-mono border-b border-blue-800/60 flex items-center justify-between">
              <span>IME: {isKeyboardVisible ? (settings.enableAutoToolbar ? '324px' : '280px') : '0px'}</span>
              <span>Offset: -{Math.round(scrollOffsetY)}px</span>
              <span>Dist: {settings.distanceFromTextField}px</span>
            </div>
          )}

          {/* Scrollable Form Viewport with smooth IQKeyboardManager animation */}
          <div
            className="flex-1 overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateY(-${scrollOffsetY}px)`,
            }}
          >
            <FormsPlayground
              currentScreen={currentScreen}
              onScreenChange={(s) => {
                setCurrentScreen(s);
                handleDoneDismiss();
              }}
              focusedFieldId={focusedFieldId}
              onFieldFocus={handleFieldFocus}
              formValues={formValues}
              onFormValueChange={(id, val) =>
                setFormValues((prev) => ({ ...prev, [id]: val }))
              }
              onSubmit={(screen) => {
                handleDoneDismiss();
                if (onShowSuccessAlert) {
                  onShowSuccessAlert(
                    `Action triggered on ${screen}! All inputs processed with IQKeyboardManager.`
                  );
                }
              }}
            />
          </div>

          {/* Keyboard Container sliding up from bottom */}
          <div
            className={`keyboard-container absolute bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isKeyboardVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* IQToolbar above keyboard if enabled */}
            {settings.enableAutoToolbar && (
              <IQToolbar
                currentFieldTitle={focusedFieldLabel}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                onPrevious={handleNavigatePrevious}
                onNext={handleNavigateNext}
                onDone={handleDoneDismiss}
                showPlaceholder={settings.shouldShowToolbarPlaceholder}
                doneText={
                  settings.language === 'ar' ? 'تم' : settings.toolbarDoneBarButtonItemText
                }
                tintColor={settings.toolbarTintColor}
                theme={settings.theme}
                soundEnabled={settings.shouldPlayInputClicks}
                hapticsEnabled={settings.enableHaptics}
              />
            )}

            {/* iOS 17 / Android 17 Keyboard */}
            <IosKeyboard
              language={settings.language}
              theme={settings.theme}
              soundEnabled={settings.shouldPlayInputClicks}
              hapticsEnabled={settings.enableHaptics}
              onKeyPress={handleCharInput}
              onBackspace={handleBackspace}
              onReturn={handleReturn}
              onLanguageChange={(lang) =>
                onUpdateSettings((prev) => ({ ...prev, language: lang }))
              }
            />

            {/* Home indicator bar (iPhone gesture line / Android bar) */}
            <div className="h-3 flex items-center justify-center bg-inherit">
              <div
                className={`h-1 rounded-full ${
                  isAndroid ? 'w-20 bg-slate-400/80' : 'w-32 bg-slate-500/80'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
