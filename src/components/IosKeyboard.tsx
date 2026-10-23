import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardMode,
  KeyboardLanguage,
  KeyboardTheme,
  KeyDefinition,
  CustomThemeConfig,
  SoundType,
} from '../types/keyboard';
import {
  ENGLISH_LETTERS_LOWER,
  ENGLISH_LETTERS_UPPER,
  ARABIC_LETTERS,
  SWIFTY_NUMERIC_PAD,
  ARABIC_TASHKEEL,
  NUMBERS_PAGE,
  SYMBOLS_PAGE,
  EMOJI_LIST,
} from '../utils/keyboardLayouts';
import { keyboardAudio } from '../utils/audioSynth';
import { Globe, Mic, Smile, Delete, Hash, MoveHorizontal } from 'lucide-react';

interface IosKeyboardProps {
  language: KeyboardLanguage;
  theme: KeyboardTheme;
  customTheme?: CustomThemeConfig;
  soundEnabled: boolean;
  soundType?: SoundType;
  hapticsEnabled: boolean;
  doubleSpaceShortcut?: boolean;
  trackpadModeEnabled?: boolean;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  onMoveCursor?: (direction: 'left' | 'right') => void;
  onLanguageChange: (lang: KeyboardLanguage) => void;
}

export const IosKeyboard: React.FC<IosKeyboardProps> = ({
  language,
  theme,
  customTheme,
  soundEnabled,
  soundType = 'ios',
  hapticsEnabled,
  doubleSpaceShortcut = true,
  trackpadModeEnabled = true,
  onKeyPress,
  onBackspace,
  onReturn,
  onMoveCursor,
  onLanguageChange,
}) => {
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [isShifted, setIsShifted] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
  const [activeAlternatesKey, setActiveAlternatesKey] = useState<KeyDefinition | null>(null);
  const [showTashkeelBar, setShowTashkeelBar] = useState(false);

  // Spacebar trackpad gesture
  const [isTrackpadActive, setIsTrackpadActive] = useState(false);
  const trackpadStartX = useRef<number | null>(null);
  const lastSpaceTapTime = useRef<number>(0);

  const backspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Autocomplete suggestions
  const suggestions =
    language === 'ar'
      ? ['السلام عليكم', 'شكراً', 'إن شاء الله']
      : ['the', 'I', 'to'];

  const playFeedback = (
    keyAction: 'char' | 'space' | 'backspace' | 'return' | 'modifier' = 'char'
  ) => {
    if (soundEnabled) {
      keyboardAudio.playClick(keyAction, soundType);
    }
    if (hapticsEnabled) {
      keyboardAudio.triggerHaptic(keyAction === 'return' ? 'medium' : 'light');
    }
  };

  // Backspace continuous hold
  const startBackspace = () => {
    playFeedback('backspace');
    onBackspace();
    backspaceTimerRef.current = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(() => {
        playFeedback('backspace');
        onBackspace();
      }, 70);
    }, 400);
  };

  const stopBackspace = () => {
    if (backspaceTimerRef.current) clearTimeout(backspaceTimerRef.current);
    if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      stopBackspace();
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  const handleKeyTouchStart = (key: KeyDefinition) => {
    if (key.type === 'backspace') {
      startBackspace();
      return;
    }

    setActivePopupKey(key.label);

    // If key has alternates, start long-press detection
    if (key.alternates && key.alternates.length > 0) {
      longPressTimerRef.current = setTimeout(() => {
        setActiveAlternatesKey(key);
        playFeedback('modifier');
      }, 420);
    }
  };

  const handleKeyTouchEnd = (key: KeyDefinition) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    if (key.type === 'backspace') {
      stopBackspace();
      return;
    }

    setActivePopupKey(null);

    // If alternates popup is currently showing, don't type normal character
    if (activeAlternatesKey) {
      return;
    }

    handleKeyTap(key);
  };

  const handleKeyTap = (key: KeyDefinition) => {
    if (key.type === 'shift') {
      playFeedback('modifier');
      if (isShifted) {
        setIsCapsLock(!isCapsLock);
      } else {
        setIsShifted(true);
      }
      return;
    }

    if (key.type === 'backspace') return;

    if (key.type === 'mode') {
      playFeedback('modifier');
      if (mode === 'numbers') {
        setMode('symbols');
      } else if (mode === 'symbols') {
        setMode('numbers');
      }
      return;
    }

    if (key.value) {
      playFeedback('char');
      onKeyPress(key.value);
      if (isShifted && !isCapsLock) {
        setIsShifted(false);
      }
    }
  };

  // Spacebar handling with double-space shortcut & trackpad drag
  const handleSpacebarTap = () => {
    const now = Date.now();
    if (doubleSpaceShortcut && now - lastSpaceTapTime.current < 360) {
      // Double space shortcut: backspace the previous space and add ". "
      playFeedback('char');
      onBackspace();
      onKeyPress('. ');
      lastSpaceTapTime.current = 0;
      return;
    }

    lastSpaceTapTime.current = now;
    playFeedback('space');
    onKeyPress(' ');
  };

  const handleTrackpadStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!trackpadModeEnabled) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    trackpadStartX.current = clientX;
    setIsTrackpadActive(true);
  };

  const handleTrackpadMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isTrackpadActive || trackpadStartX.current === null || !onMoveCursor) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const delta = clientX - trackpadStartX.current;
    if (Math.abs(delta) > 16) {
      if (delta > 0) {
        onMoveCursor('right');
      } else {
        onMoveCursor('left');
      }
      playFeedback('modifier');
      trackpadStartX.current = clientX;
    }
  };

  const handleTrackpadEnd = () => {
    setIsTrackpadActive(false);
    trackpadStartX.current = null;
  };

  // Select key rows based on mode
  let currentRows: KeyDefinition[][] = [];
  if (mode === 'letters') {
    if (language === 'ar') {
      currentRows = ARABIC_LETTERS;
    } else {
      currentRows = isShifted || isCapsLock ? ENGLISH_LETTERS_UPPER : ENGLISH_LETTERS_LOWER;
    }
  } else if (mode === 'numbers') {
    currentRows = NUMBERS_PAGE;
  } else if (mode === 'symbols') {
    currentRows = SYMBOLS_PAGE;
  } else if (mode === 'numeric_pad') {
    currentRows = SWIFTY_NUMERIC_PAD;
  }

  // Styles per theme
  const isCustom = theme === 'custom' && customTheme;

  const defaultThemeStyles = {
    'ios17-light': {
      container: 'bg-[#d0d3d9] text-black border-t border-[#b2b5bb]',
      keyRegular: 'bg-white text-black shadow-[0_1px_0_rgba(0,0,0,0.35)] active:bg-[#e4e4e7]',
      keySpecial: 'bg-[#b0b5be] text-black shadow-[0_1px_0_rgba(0,0,0,0.35)] active:bg-[#9da2ab]',
      keyReturn: 'bg-[#007aff] text-white shadow-[0_1px_0_rgba(0,0,0,0.35)] active:bg-[#0062cc]',
      suggestions: 'bg-[#d8dbdf] text-slate-700 border-b border-[#c2c5cb]',
      radius: 'rounded-[5px]',
      height: '42px',
    },
    'ios17-dark': {
      container: 'bg-[#1c1c1e] text-white border-t border-[#2c2c2e]',
      keyRegular: 'bg-[#6b6b70] text-white shadow-[0_1px_0_rgba(0,0,0,0.6)] active:bg-[#525256]',
      keySpecial: 'bg-[#434346] text-white shadow-[0_1px_0_rgba(0,0,0,0.6)] active:bg-[#343436]',
      keyReturn: 'bg-[#007aff] text-white shadow-[0_1px_0_rgba(0,0,0,0.6)] active:bg-[#0062cc]',
      suggestions: 'bg-[#252528] text-slate-300 border-b border-[#323236]',
      radius: 'rounded-[5px]',
      height: '42px',
    },
    'ios18-glass': {
      container: 'bg-black/60 backdrop-blur-2xl text-white border-t border-white/10',
      keyRegular: 'bg-white/15 text-white backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.15)] active:bg-white/30',
      keySpecial: 'bg-white/10 text-white backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.1)] active:bg-white/20',
      keyReturn: 'bg-indigo-600 text-white shadow-[0_1px_0_rgba(255,255,255,0.2)] active:bg-indigo-700',
      suggestions: 'bg-white/5 text-slate-200 border-b border-white/10',
      radius: 'rounded-[7px]',
      height: '42px',
    },
    'android17-material': {
      container: 'bg-[#f3edf7] dark:bg-[#1d192b] text-slate-900 dark:text-slate-100 border-t border-purple-200/40',
      keyRegular: 'bg-white dark:bg-[#2b2738] text-slate-900 dark:text-slate-100 shadow-sm active:bg-purple-100',
      keySpecial: 'bg-[#e8def8] dark:bg-[#4a4458] text-purple-900 dark:text-purple-100 shadow-sm active:bg-purple-200',
      keyReturn: 'bg-[#6750a4] text-white shadow-sm active:bg-[#533f85]',
      suggestions: 'bg-[#ede7f6] dark:bg-[#201a24] text-slate-700 dark:text-slate-200 border-b border-purple-200/50',
      radius: 'rounded-xl',
      height: '44px',
    },
    custom: {
      container: 'border-t border-slate-300 dark:border-slate-700',
      keyRegular: 'shadow-sm active:opacity-80',
      keySpecial: 'shadow-sm active:opacity-80',
      keyReturn: 'shadow-sm active:opacity-90',
      suggestions: 'border-b border-white/10',
      radius: 'rounded-lg',
      height: '42px',
    },
  }[theme];

  return (
    <div
      className={`w-full select-none transition-colors duration-150 pb-2 relative ${
        isCustom ? '' : defaultThemeStyles.container
      }`}
      style={{
        backgroundColor: isCustom ? customTheme?.bg : undefined,
        touchAction: 'manipulation',
      }}
    >
      {/* Arabic Tashkeel quick bar */}
      {language === 'ar' && showTashkeelBar && (
        <div className="px-2 py-1.5 bg-black/10 dark:bg-white/10 backdrop-blur-md flex items-center justify-around border-b border-black/10">
          {ARABIC_TASHKEEL.map((tashkeel, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                playFeedback('char');
                onKeyPress(tashkeel.label);
              }}
              title={tashkeel.name}
              className="w-8 h-8 rounded-md bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-lg font-bold hover:scale-110 active:scale-95 transition-transform"
            >
              {tashkeel.label}
            </button>
          ))}
        </div>
      )}

      {/* Autocomplete / Suggestions Bar */}
      <div
        className={`h-9 px-4 flex items-center justify-between text-xs font-medium ${
          isCustom ? 'bg-black/10' : defaultThemeStyles.suggestions
        }`}
      >
        <div className="flex items-center gap-1">
          {/* SwiftyKeyboard Numeric Pad Quick Switcher */}
          <button
            type="button"
            onClick={() => {
              playFeedback('modifier');
              setMode(mode === 'numeric_pad' ? 'letters' : 'numeric_pad');
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              mode === 'numeric_pad'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3 h-3" />
            <span>SwiftyKeypad</span>
          </button>

          {/* Tashkeel toggle for Arabic */}
          {language === 'ar' && (
            <button
              type="button"
              onClick={() => setShowTashkeelBar(!showTashkeelBar)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                showTashkeelBar
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              التشكيل َ ُ ِ
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {suggestions.map((word, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                playFeedback('space');
                onKeyPress(word + ' ');
              }}
              className="px-2 py-0.5 rounded active:opacity-60 truncate max-w-[100px]"
            >
              "{word}"
            </button>
          ))}
        </div>
      </div>

      {/* Long-press Alternates / Diacritics Floating Popover */}
      {activeAlternatesKey && activeAlternatesKey.alternates && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1.5 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-100">
          {activeAlternatesKey.alternates.map((alt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                playFeedback('char');
                onKeyPress(alt);
                setActiveAlternatesKey(null);
              }}
              className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-base font-semibold flex items-center justify-center transition-colors active:scale-95"
            >
              {alt}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveAlternatesKey(null)}
            className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mode: SwiftyKeyboard Dedicated Numeric / PIN Pad */}
      {mode === 'numeric_pad' ? (
        <div className="p-2 space-y-1.5 max-w-[340px] mx-auto">
          {SWIFTY_NUMERIC_PAD.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-3 gap-2">
              {row.map((k, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (k.type === 'backspace') startBackspace();
                    else {
                      playFeedback('char');
                      if (k.value) onKeyPress(k.value);
                    }
                  }}
                  onMouseUp={() => {
                    if (k.type === 'backspace') stopBackspace();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (k.type === 'backspace') startBackspace();
                    else {
                      playFeedback('char');
                      if (k.value) onKeyPress(k.value);
                    }
                  }}
                  onTouchEnd={() => {
                    if (k.type === 'backspace') stopBackspace();
                  }}
                  className={`h-12 rounded-xl flex flex-col items-center justify-center shadow-[0_1px_0_rgba(0,0,0,0.25)] transition-all active:scale-[0.97] ${
                    k.type === 'backspace'
                      ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  {k.type === 'backspace' ? (
                    <Delete className="w-5 h-5" />
                  ) : (
                    <>
                      <span className="text-xl font-medium leading-none">{k.label}</span>
                      {k.subLabel && (
                        <span className="text-[9px] font-bold tracking-widest opacity-40 mt-0.5">
                          {k.subLabel}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          ))}

          {/* Action Row for Numeric Pad */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                playFeedback('modifier');
                setMode('letters');
              }}
              className="flex-1 h-10 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold"
            >
              {language === 'ar' ? 'أبجدية' : 'ABC'}
            </button>
            <button
              type="button"
              onClick={() => {
                playFeedback('return');
                onReturn();
              }}
              className="flex-1 h-10 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              {language === 'ar' ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      ) : mode === 'emojis' ? (
        /* Emoji Mode */
        <div className="p-2 h-[216px] flex flex-col justify-between">
          <div className="grid grid-cols-8 gap-2 overflow-y-auto max-h-[160px] p-1">
            {EMOJI_LIST.map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playFeedback('char');
                  onKeyPress(emoji);
                }}
                className="text-2xl h-10 flex items-center justify-center hover:scale-125 transition-transform active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                playFeedback('modifier');
                setMode('letters');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-[5px] bg-slate-300 dark:bg-slate-700"
            >
              ABC
            </button>
            <button
              type="button"
              onMouseDown={startBackspace}
              onMouseUp={stopBackspace}
              onTouchStart={startBackspace}
              onTouchEnd={stopBackspace}
              className="px-4 py-2 text-xs font-semibold rounded-[5px] bg-slate-300 dark:bg-slate-700"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Standard Key Rows (English / Arabic / Numbers / Symbols) */
        <div className="px-1 pt-1.5 flex flex-col gap-1.5">
          {currentRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex items-center justify-center gap-1 ${
                rowIdx === 1 ? 'px-3' : 'px-0.5'
              }`}
            >
              {row.map((k, colIdx) => {
                const isSpecial =
                  k.type === 'shift' || k.type === 'backspace' || k.type === 'mode';
                const isShiftActive = k.type === 'shift' && (isShifted || isCapsLock);

                return (
                  <div key={colIdx} className="relative flex-1 flex justify-center">
                    {/* Magnifier Popup */}
                    {activePopupKey === k.label && !isSpecial && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-slate-700 text-black dark:text-white rounded-lg shadow-xl flex items-center justify-center text-2xl font-bold border border-slate-200 dark:border-slate-600 z-40 pointer-events-none animate-in fade-in zoom-in-95 duration-75">
                        {k.label}
                      </div>
                    )}

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleKeyTouchStart(k);
                      }}
                      onMouseUp={() => handleKeyTouchEnd(k)}
                      onMouseLeave={() => {
                        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                        setActivePopupKey(null);
                        if (k.type === 'backspace') stopBackspace();
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        handleKeyTouchStart(k);
                      }}
                      onTouchEnd={() => handleKeyTouchEnd(k)}
                      style={{
                        backgroundColor: isCustom
                          ? isSpecial
                            ? customTheme?.specialKeyBg
                            : customTheme?.keyBg
                          : undefined,
                        color: isCustom ? customTheme?.textColor : undefined,
                        borderRadius: isCustom ? `${customTheme?.keyRadius}px` : undefined,
                        height: isCustom ? `${customTheme?.keyHeight}px` : undefined,
                      }}
                      className={`h-[42px] min-w-[28px] w-full rounded-[5px] flex items-center justify-center text-lg font-normal transition-all active:scale-[0.96] select-none ${
                        isSpecial
                          ? isShiftActive
                            ? 'bg-white text-black font-bold shadow-md'
                            : isCustom
                            ? defaultThemeStyles.keySpecial
                            : defaultThemeStyles.keySpecial
                          : defaultThemeStyles.keyRegular
                      } ${k.width || ''}`}
                    >
                      {k.type === 'shift' ? (
                        <div className="relative">
                          <span>⇧</span>
                          {isCapsLock && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-current rounded-full" />
                          )}
                        </div>
                      ) : k.type === 'backspace' ? (
                        <Delete className="w-5 h-5 stroke-[2]" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span>{k.label}</span>
                          {k.alternates && (
                            <span className="w-1 h-1 rounded-full bg-slate-400/60 -mt-1" />
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Bottom Action Bar: 123 / Globe / Emoji / Space (Trackpad) / Return / Mic */}
          <div className="flex items-center justify-between gap-1 px-0.5 mt-0.5">
            {/* Mode Switcher */}
            <button
              type="button"
              onClick={() => {
                playFeedback('modifier');
                if (mode === 'letters') setMode('numbers');
                else setMode('letters');
              }}
              className={`h-[42px] min-w-[44px] px-2.5 rounded-[5px] text-xs font-semibold flex items-center justify-center select-none ${defaultThemeStyles.keySpecial}`}
            >
              {mode === 'letters' ? '123' : 'ABC'}
            </button>

            {/* Language / Globe Key */}
            <button
              type="button"
              onClick={() => {
                playFeedback('modifier');
                onLanguageChange(language === 'en' ? 'ar' : 'en');
              }}
              title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              className={`h-[42px] w-[38px] rounded-[5px] flex items-center justify-center select-none ${defaultThemeStyles.keySpecial}`}
            >
              <Globe className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Emoji Switcher */}
            <button
              type="button"
              onClick={() => {
                playFeedback('modifier');
                setMode('emojis');
              }}
              className={`h-[42px] w-[38px] rounded-[5px] flex items-center justify-center select-none ${defaultThemeStyles.keySpecial}`}
            >
              <Smile className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Space Bar with SwiftyKeyboard Trackpad Cursor Gesture */}
            <button
              type="button"
              onClick={handleSpacebarTap}
              onMouseDown={handleTrackpadStart}
              onMouseMove={handleTrackpadMove}
              onMouseUp={handleTrackpadEnd}
              onTouchStart={handleTrackpadStart}
              onTouchMove={handleTrackpadMove}
              onTouchEnd={handleTrackpadEnd}
              style={{
                backgroundColor: isCustom ? customTheme?.keyBg : undefined,
                color: isCustom ? customTheme?.textColor : undefined,
                borderRadius: isCustom ? `${customTheme?.keyRadius}px` : undefined,
              }}
              className={`h-[42px] flex-1 rounded-[5px] text-xs font-normal flex items-center justify-center select-none shadow-[0_1px_0_rgba(0,0,0,0.3)] transition-colors ${
                isTrackpadActive
                  ? 'bg-blue-100 dark:bg-blue-900/60 ring-2 ring-blue-500'
                  : defaultThemeStyles.keyRegular
              }`}
            >
              {isTrackpadActive ? (
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-300 font-semibold text-[11px]">
                  <MoveHorizontal className="w-3.5 h-3.5" />
                  <span>Swipe to Move Cursor</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 font-sans tracking-wide">
                  {language === 'ar' ? 'مسافة (Space)' : 'space'}
                </span>
              )}
            </button>

            {/* Return / Enter Button */}
            <button
              type="button"
              onClick={() => {
                playFeedback('return');
                onReturn();
              }}
              style={{
                backgroundColor: isCustom ? customTheme?.returnColor : undefined,
                borderRadius: isCustom ? `${customTheme?.keyRadius}px` : undefined,
              }}
              className={`h-[42px] px-4 min-w-[72px] rounded-[5px] text-xs font-medium flex items-center justify-center select-none ${defaultThemeStyles.keyReturn}`}
            >
              <span>{language === 'ar' ? 'إدخال' : 'return'}</span>
            </button>

            {/* Dictation / Mic */}
            <button
              type="button"
              onClick={() => playFeedback('modifier')}
              className={`h-[42px] w-[34px] rounded-[5px] flex items-center justify-center opacity-80 ${defaultThemeStyles.keySpecial}`}
              title="Dictation"
            >
              <Mic className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
