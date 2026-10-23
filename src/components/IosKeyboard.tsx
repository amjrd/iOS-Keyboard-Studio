import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardMode,
  KeyboardLanguage,
  KeyboardTheme,
  KeyDefinition,
} from '../types/keyboard';
import {
  ENGLISH_LETTERS_LOWER,
  ENGLISH_LETTERS_UPPER,
  ARABIC_LETTERS,
  NUMBERS_PAGE,
  SYMBOLS_PAGE,
  EMOJI_LIST,
} from '../utils/keyboardLayouts';
import { keyboardAudio } from '../utils/audioSynth';
import { Globe, Mic, Smile, Delete } from 'lucide-react';

interface IosKeyboardProps {
  language: KeyboardLanguage;
  theme: KeyboardTheme;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  onLanguageChange: (lang: KeyboardLanguage) => void;
}

export const IosKeyboard: React.FC<IosKeyboardProps> = ({
  language,
  theme,
  soundEnabled,
  hapticsEnabled,
  onKeyPress,
  onBackspace,
  onReturn,
  onLanguageChange,
}) => {
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [isShifted, setIsShifted] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [activePopupKey, setActivePopupKey] = useState<string | null>(null);
  const backspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Suggestions for autocomplete bar
  const suggestions = language === 'ar' 
    ? ['السلام عليكم', 'شكراً', 'إن شاء الله'] 
    : ['the', 'I', 'to'];

  // Handle key sound & haptics
  const playFeedback = (type: 'char' | 'space' | 'backspace' | 'return' | 'modifier') => {
    if (soundEnabled) keyboardAudio.playClick(type);
    if (hapticsEnabled) keyboardAudio.triggerHaptic(type === 'return' ? 'medium' : 'light');
  };

  // Backspace hold support
  const startBackspace = () => {
    playFeedback('backspace');
    onBackspace();
    backspaceTimerRef.current = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(() => {
        playFeedback('backspace');
        onBackspace();
      }, 75);
    }, 400);
  };

  const stopBackspace = () => {
    if (backspaceTimerRef.current) clearTimeout(backspaceTimerRef.current);
    if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
  };

  useEffect(() => {
    return () => stopBackspace();
  }, []);

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

    if (key.type === 'backspace') {
      // handled by mouse/touch down
      return;
    }

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

  // Determine current letter layout
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
  }

  // Theme palettes matching genuine iOS 17 / 18 / Material
  const themeStyles = {
    'ios17-light': {
      container: 'bg-[#d0d3d9] text-black border-t border-[#b2b5bb]',
      keyRegular: 'bg-white text-black shadow-[0_1px_0_rgba(0,0,0,0.35)] active:bg-[#e4e4e7]',
      keySpecial: 'bg-[#b0b5be] text-black shadow-[0_1px_0_rgba(0,0,0,0.35)] active:bg-[#9da2ab]',
      keyReturn: 'bg-[#007aff] text-white shadow-[0_1px_0_rgba(0,0,0,0.35)] active:bg-[#0062cc]',
      suggestions: 'bg-[#d8dbdf] text-slate-700 border-b border-[#c2c5cb]',
    },
    'ios17-dark': {
      container: 'bg-[#1c1c1e] text-white border-t border-[#2c2c2e]',
      keyRegular: 'bg-[#6b6b70] text-white shadow-[0_1px_0_rgba(0,0,0,0.6)] active:bg-[#525256]',
      keySpecial: 'bg-[#434346] text-white shadow-[0_1px_0_rgba(0,0,0,0.6)] active:bg-[#343436]',
      keyReturn: 'bg-[#007aff] text-white shadow-[0_1px_0_rgba(0,0,0,0.6)] active:bg-[#0062cc]',
      suggestions: 'bg-[#252528] text-slate-300 border-b border-[#323236]',
    },
    'ios18-glass': {
      container: 'bg-black/60 backdrop-blur-2xl text-white border-t border-white/10',
      keyRegular: 'bg-white/15 text-white backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.15)] active:bg-white/30',
      keySpecial: 'bg-white/10 text-white backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.1)] active:bg-white/20',
      keyReturn: 'bg-indigo-600 text-white shadow-[0_1px_0_rgba(255,255,255,0.2)] active:bg-indigo-700',
      suggestions: 'bg-white/5 text-slate-200 border-b border-white/10',
    },
    'android17-material': {
      container: 'bg-[#f3edf7] dark:bg-[#1d192b] text-slate-900 dark:text-slate-100 border-t border-purple-200/40 dark:border-purple-900/40',
      keyRegular: 'bg-white dark:bg-[#2b2738] text-slate-900 dark:text-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.1)] rounded-xl active:bg-purple-100 dark:active:bg-purple-900/50',
      keySpecial: 'bg-[#e8def8] dark:bg-[#4a4458] text-purple-900 dark:text-purple-100 shadow-[0_1px_2px_rgba(0,0,0,0.1)] rounded-xl active:bg-purple-200',
      keyReturn: 'bg-[#6750a4] text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] rounded-xl active:bg-[#533f85]',
      suggestions: 'bg-[#ede7f6] dark:bg-[#201a24] text-slate-700 dark:text-slate-200 border-b border-purple-200/50',
    },
  }[theme];

  return (
    <div
      className={`w-full select-none transition-colors duration-150 pb-2 ${themeStyles.container}`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* iOS Autocomplete Suggestions Bar */}
      <div
        className={`h-9 px-4 flex items-center justify-around text-sm font-medium ${themeStyles.suggestions}`}
      >
        {suggestions.map((word, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              playFeedback('space');
              onKeyPress(word + ' ');
            }}
            className="px-3 py-0.5 rounded transition-colors active:opacity-60 truncate max-w-[120px]"
          >
            "{word}"
          </button>
        ))}
      </div>

      {/* Main Keys Container */}
      {mode === 'emojis' ? (
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
              className={`px-4 py-2 text-xs font-semibold rounded-[5px] ${themeStyles.keySpecial}`}
            >
              ABC
            </button>
            <button
              type="button"
              onMouseDown={startBackspace}
              onMouseUp={stopBackspace}
              onTouchStart={startBackspace}
              onTouchEnd={stopBackspace}
              className={`px-4 py-2 text-xs font-semibold rounded-[5px] ${themeStyles.keySpecial}`}
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-1 pt-1.5 flex flex-col gap-1.5">
          {/* Key Rows */}
          {currentRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={`flex items-center justify-center gap-1 ${
                rowIdx === 1 ? 'px-3' : 'px-0.5'
              }`}
            >
              {row.map((k, colIdx) => {
                const isSpecial = k.type === 'shift' || k.type === 'backspace' || k.type === 'mode';
                const isShiftActive = k.type === 'shift' && (isShifted || isCapsLock);

                return (
                  <div key={colIdx} className="relative flex-1 flex justify-center">
                    {/* Key Magnifier Popup on Touch */}
                    {activePopupKey === k.label && !isSpecial && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-slate-700 text-black dark:text-white rounded-lg shadow-xl flex items-center justify-center text-2xl font-bold border border-slate-200 dark:border-slate-600 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-75">
                        {k.label}
                      </div>
                    )}

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (k.type === 'backspace') {
                          startBackspace();
                        } else {
                          setActivePopupKey(k.label);
                          handleKeyTap(k);
                        }
                      }}
                      onMouseUp={() => {
                        setActivePopupKey(null);
                        if (k.type === 'backspace') stopBackspace();
                      }}
                      onMouseLeave={() => {
                        setActivePopupKey(null);
                        if (k.type === 'backspace') stopBackspace();
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        if (k.type === 'backspace') {
                          startBackspace();
                        } else {
                          setActivePopupKey(k.label);
                          handleKeyTap(k);
                        }
                      }}
                      onTouchEnd={() => {
                        setActivePopupKey(null);
                        if (k.type === 'backspace') stopBackspace();
                      }}
                      className={`h-[42px] min-w-[28px] w-full rounded-[5px] flex items-center justify-center text-lg font-normal transition-all active:scale-[0.96] select-none ${
                        isSpecial
                          ? isShiftActive
                            ? 'bg-white text-black font-bold shadow-md'
                            : themeStyles.keySpecial
                          : themeStyles.keyRegular
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
                        <span>{k.label}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Bottom Action Row: 123 / Globe / Space / Return / Mic */}
          <div className="flex items-center justify-between gap-1 px-0.5 mt-0.5">
            {/* Mode Switcher: 123 or ABC */}
            <button
              type="button"
              onClick={() => {
                playFeedback('modifier');
                if (mode === 'letters') setMode('numbers');
                else setMode('letters');
              }}
              className={`h-[42px] min-w-[44px] px-2.5 rounded-[5px] text-xs font-semibold flex items-center justify-center select-none ${themeStyles.keySpecial}`}
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
              className={`h-[42px] w-[38px] rounded-[5px] flex items-center justify-center select-none ${themeStyles.keySpecial}`}
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
              className={`h-[42px] w-[38px] rounded-[5px] flex items-center justify-center select-none ${themeStyles.keySpecial}`}
            >
              <Smile className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Space Bar with authentic iOS styling */}
            <button
              type="button"
              onClick={() => {
                playFeedback('space');
                onKeyPress(' ');
              }}
              className={`h-[42px] flex-1 rounded-[5px] text-xs font-normal flex items-center justify-center select-none shadow-[0_1px_0_rgba(0,0,0,0.3)] ${themeStyles.keyRegular}`}
            >
              <span className="text-[11px] text-slate-500 font-sans tracking-wide">
                {language === 'ar' ? 'مسافة' : 'space'}
              </span>
            </button>

            {/* Return / Enter Button */}
            <button
              type="button"
              onClick={() => {
                playFeedback('return');
                onReturn();
              }}
              className={`h-[42px] px-4 min-w-[72px] rounded-[5px] text-xs font-medium flex items-center justify-center select-none ${themeStyles.keyReturn}`}
            >
              <span>{language === 'ar' ? 'إدخال' : 'return'}</span>
            </button>

            {/* Dictation / Mic */}
            <button
              type="button"
              onClick={() => playFeedback('modifier')}
              className={`h-[42px] w-[34px] rounded-[5px] flex items-center justify-center opacity-80 ${themeStyles.keySpecial}`}
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
