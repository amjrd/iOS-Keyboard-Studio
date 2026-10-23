import { KeyDefinition } from '../types/keyboard';

export const ENGLISH_LETTERS_LOWER: KeyDefinition[][] = [
  [
    { label: 'q', value: 'q' },
    { label: 'w', value: 'w' },
    { label: 'e', value: 'e', alternates: ['é', 'è', 'ê', 'ë', 'ē', 'ė', 'ę'] },
    { label: 'r', value: 'r' },
    { label: 't', value: 't' },
    { label: 'y', value: 'y', alternates: ['ÿ'] },
    { label: 'u', value: 'u', alternates: ['û', 'ü', 'ù', 'ú', 'ū'] },
    { label: 'i', value: 'i', alternates: ['î', 'ï', 'í', 'ī', 'ì'] },
    { label: 'o', value: 'o', alternates: ['ô', 'ö', 'ò', 'ó', 'œ', 'ø', 'ō'] },
    { label: 'p', value: 'p' },
  ],
  [
    { label: 'a', value: 'a', alternates: ['à', 'á', 'â', 'ä', 'æ', 'ã', 'å', 'ā'] },
    { label: 's', value: 's', alternates: ['ß', 'ś', 'š'] },
    { label: 'd', value: 'd' },
    { label: 'f', value: 'f' },
    { label: 'g', value: 'g' },
    { label: 'h', value: 'h' },
    { label: 'j', value: 'j' },
    { label: 'k', value: 'k' },
    { label: 'l', value: 'l' },
  ],
  [
    { label: '⇧', type: 'shift', width: 'w-11 sm:w-12' },
    { label: 'z', value: 'z' },
    { label: 'x', value: 'x' },
    { label: 'c', value: 'c', alternates: ['ç', 'ć', 'č'] },
    { label: 'v', value: 'v' },
    { label: 'b', value: 'b' },
    { label: 'n', value: 'n', alternates: ['ñ', 'ń'] },
    { label: 'm', value: 'm' },
    { label: '⌫', type: 'backspace', width: 'w-11 sm:w-12' },
  ],
];

export const ENGLISH_LETTERS_UPPER: KeyDefinition[][] = [
  [
    { label: 'Q', value: 'Q' },
    { label: 'W', value: 'W' },
    { label: 'E', value: 'E', alternates: ['É', 'È', 'Ê', 'Ë', 'Ē'] },
    { label: 'R', value: 'R' },
    { label: 'T', value: 'T' },
    { label: 'Y', value: 'Y' },
    { label: 'U', value: 'U', alternates: ['Û', 'Ü', 'Ù', 'Ú', 'Ū'] },
    { label: 'I', value: 'I', alternates: ['Î', 'Ï', 'Í', 'Ī', 'Ì'] },
    { label: 'O', value: 'O', alternates: ['Ô', 'Ö', 'Ò', 'Ó', 'Œ', 'Ø'] },
    { label: 'P', value: 'P' },
  ],
  [
    { label: 'A', value: 'A', alternates: ['À', 'Á', 'Â', 'Ä', 'Æ', 'Ã', 'Å'] },
    { label: 'S', value: 'S', alternates: ['Ś', 'Š'] },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
    { label: 'G', value: 'G' },
    { label: 'H', value: 'H' },
    { label: 'J', value: 'J' },
    { label: 'K', value: 'K' },
    { label: 'L', value: 'L' },
  ],
  [
    { label: '⇧', type: 'shift', width: 'w-11 sm:w-12' },
    { label: 'Z', value: 'Z' },
    { label: 'X', value: 'X' },
    { label: 'C', value: 'C', alternates: ['Ç', 'Ć'] },
    { label: 'V', value: 'V' },
    { label: 'B', value: 'B' },
    { label: 'N', value: 'N', alternates: ['Ñ'] },
    { label: 'M', value: 'M' },
    { label: '⌫', type: 'backspace', width: 'w-11 sm:w-12' },
  ],
];

export const ARABIC_LETTERS: KeyDefinition[][] = [
  [
    { label: 'ض', value: 'ض' },
    { label: 'ص', value: 'ص' },
    { label: 'ث', value: 'ث' },
    { label: 'ق', value: 'ق' },
    { label: 'ف', value: 'ف' },
    { label: 'غ', value: 'غ' },
    { label: 'ع', value: 'ع' },
    { label: 'ه', value: 'ه', alternates: ['ة', 'هـ'] },
    { label: 'خ', value: 'خ' },
    { label: 'ح', value: 'ح' },
    { label: 'ج', value: 'ج' },
    { label: 'د', value: 'د' },
  ],
  [
    { label: 'ش', value: 'ش' },
    { label: 'س', value: 'س' },
    { label: 'ي', value: 'ي', alternates: ['ى', 'ئ', 'ي'] },
    { label: 'ب', value: 'ب' },
    { label: 'ل', value: 'ل', alternates: ['لا', 'لإ', 'لأ', 'لآ'] },
    { label: 'ا', value: 'ا', alternates: ['أ', 'إ', 'آ', 'ء'] },
    { label: 'ت', value: 'ت', alternates: ['ة'] },
    { label: 'ن', value: 'ن' },
    { label: 'م', value: 'م' },
    { label: 'ك', value: 'ك' },
    { label: 'ط', value: 'ط' },
  ],
  [
    { label: 'ذ', value: 'ذ', width: 'w-8' },
    { label: 'ئ', value: 'ئ' },
    { label: 'ء', value: 'ء' },
    { label: 'ؤ', value: 'ؤ' },
    { label: 'ر', value: 'ر' },
    { label: 'لا', value: 'لا' },
    { label: 'ى', value: 'ى' },
    { label: 'ة', value: 'ة' },
    { label: 'و', value: 'و', alternates: ['ؤ', 'و'] },
    { label: 'ز', value: 'ز' },
    { label: 'ظ', value: 'ظ' },
    { label: '⌫', type: 'backspace', width: 'w-11 sm:w-12' },
  ],
];

// SwiftyKeyboard Dedicated Numeric / PIN Pad (Inspired by SwiftyKit/SwiftyKeyboard)
export const SWIFTY_NUMERIC_PAD: KeyDefinition[][] = [
  [
    { label: '1', value: '1', subLabel: '' },
    { label: '2', value: '2', subLabel: 'ABC' },
    { label: '3', value: '3', subLabel: 'DEF' },
  ],
  [
    { label: '4', value: '4', subLabel: 'GHI' },
    { label: '5', value: '5', subLabel: 'JKL' },
    { label: '6', value: '6', subLabel: 'MNO' },
  ],
  [
    { label: '7', value: '7', subLabel: 'PQRS' },
    { label: '8', value: '8', subLabel: 'TUV' },
    { label: '9', value: '9', subLabel: 'WXYZ' },
  ],
  [
    { label: '.', value: '.', subLabel: '' },
    { label: '0', value: '0', subLabel: '+' },
    { label: '⌫', type: 'backspace', subLabel: '' },
  ],
];

export const ARABIC_TASHKEEL = [
  { label: 'َ', name: 'فتحة' },
  { label: 'ً', name: 'تنوين فتح' },
  { label: 'ُ', name: 'ضمة' },
  { label: 'ٌ', name: 'تنوين ضم' },
  { label: 'ِ', name: 'كسرة' },
  { label: 'ٍ', name: 'تنوين كسر' },
  { label: 'ْ', name: 'سكون' },
  { label: 'ّ', name: 'شدة' },
];

export const NUMBERS_PAGE: KeyDefinition[][] = [
  [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '0', value: '0' },
  ],
  [
    { label: '-', value: '-' },
    { label: '/', value: '/' },
    { label: ':', value: ':' },
    { label: ';', value: ';' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '$', value: '$' },
    { label: '&', value: '&' },
    { label: '@', value: '@' },
    { label: '"', value: '"' },
  ],
  [
    { label: '#+=', type: 'mode', width: 'w-12 sm:w-14' },
    { label: '.', value: '.' },
    { label: ',', value: ',' },
    { label: '?', value: '?' },
    { label: '!', value: '!' },
    { label: "'", value: "'" },
    { label: '⌫', type: 'backspace', width: 'w-11 sm:w-12' },
  ],
];

export const SYMBOLS_PAGE: KeyDefinition[][] = [
  [
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '{', value: '{' },
    { label: '}', value: '}' },
    { label: '#', value: '#' },
    { label: '%', value: '%' },
    { label: '^', value: '^' },
    { label: '*', value: '*' },
    { label: '+', value: '+' },
    { label: '=', value: '=' },
  ],
  [
    { label: '_', value: '_' },
    { label: '\\', value: '\\' },
    { label: '|', value: '|' },
    { label: '~', value: '~' },
    { label: '<', value: '<' },
    { label: '>', value: '>' },
    { label: '€', value: '€' },
    { label: '£', value: '£' },
    { label: '¥', value: '¥' },
    { label: '•', value: '•' },
  ],
  [
    { label: '123', type: 'mode', width: 'w-12 sm:w-14' },
    { label: '.', value: '.' },
    { label: ',', value: ',' },
    { label: '?', value: '?' },
    { label: '!', value: '!' },
    { label: "'", value: "'" },
    { label: '⌫', type: 'backspace', width: 'w-11 sm:w-12' },
  ],
];

export const EMOJI_LIST = [
  '😀', '😂', '😍', '🔥', '🚀', '✨', '👍', '🙏', 
  '❤️', '💡', '🎉', '💯', '👏', '🤖', '📱', '⚡',
  '☕', '🌟', '💻', '🔒', '📦', '🎯', '💪', '🏆',
  '😊', '😎', '🙌', '🤝', '🥳', '🪄', '⭐', '🌈'
];
