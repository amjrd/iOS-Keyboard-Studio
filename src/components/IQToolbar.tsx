import React from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { keyboardAudio } from '../utils/audioSynth';
import { KeyboardTheme } from '../types/keyboard';

interface IQToolbarProps {
  currentFieldTitle: string;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onDone: () => void;
  showPlaceholder: boolean;
  doneText: string;
  tintColor: string;
  theme: KeyboardTheme;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const IQToolbar: React.FC<IQToolbarProps> = ({
  currentFieldTitle,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onDone,
  showPlaceholder,
  doneText,
  tintColor,
  theme,
  soundEnabled,
  hapticsEnabled,
}) => {
  const isDark = theme === 'ios17-dark' || theme === 'ios18-glass';

  const handleAction = (callback: () => void, isDone = false) => {
    if (soundEnabled) {
      keyboardAudio.playClick(isDone ? 'return' : 'modifier');
    }
    if (hapticsEnabled) {
      keyboardAudio.triggerHaptic(isDone ? 'medium' : 'light');
    }
    callback();
  };

  const toolbarBg = {
    'ios17-light': 'bg-[#f6f6f6]/95 border-[#d6d6d8] text-slate-800',
    'ios17-dark': 'bg-[#282829]/95 border-[#3d3d3f] text-slate-100',
    'ios18-glass': 'bg-[#1e1e24]/80 backdrop-blur-xl border-white/10 text-white',
    'android17-material': 'bg-[#ede7f6] dark:bg-[#201a24] border-[#d1c4e9]/50 text-slate-800 dark:text-slate-100',
    'custom': 'bg-slate-100/90 dark:bg-slate-850/90 backdrop-blur-md border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100',
  }[theme];

  return (
    <div
      className={`h-11 px-3 border-t border-b flex items-center justify-between transition-colors select-none ${toolbarBg}`}
    >
      {/* Left zone: Previous / Next Navigation Arrows */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() => handleAction(onPrevious)}
          title="Previous Field (IQKeyboardManager)"
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
            hasPrevious
              ? 'active:bg-black/10 dark:active:bg-white/10'
              : 'opacity-30 cursor-not-allowed'
          }`}
          style={{ color: hasPrevious ? tintColor : undefined }}
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          type="button"
          disabled={!hasNext}
          onClick={() => handleAction(onNext)}
          title="Next Field (IQKeyboardManager)"
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
            hasNext
              ? 'active:bg-black/10 dark:active:bg-white/10'
              : 'opacity-30 cursor-not-allowed'
          }`}
          style={{ color: hasNext ? tintColor : undefined }}
        >
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Center zone: Automatic Placeholder or Field Title */}
      <div className="flex-1 px-3 text-center truncate">
        {showPlaceholder && currentFieldTitle ? (
          <span className="text-xs font-medium tracking-tight text-slate-500 dark:text-slate-400 select-none">
            {currentFieldTitle}
          </span>
        ) : (
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-40">
            IQToolbar
          </span>
        )}
      </div>

      {/* Right zone: Done Button */}
      <button
        type="button"
        onClick={() => handleAction(onDone, true)}
        className="px-2.5 py-1 text-sm font-semibold tracking-tight transition-transform active:scale-95 flex items-center gap-1 rounded-md"
        style={{ color: tintColor }}
      >
        <span>{doneText || 'Done'}</span>
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
