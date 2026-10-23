export type KeyboardMode = 'letters' | 'numbers' | 'symbols' | 'emojis' | 'numeric_pad';
export type KeyboardLanguage = 'en' | 'ar';
export type KeyboardTheme = 'ios17-light' | 'ios17-dark' | 'ios18-glass' | 'android17-material' | 'custom';
export type SoundType = 'ios' | 'mechanical' | 'bubble' | 'silent';
export type DeviceType = 'iphone16' | 'android17';

export interface KeyDefinition {
  label: string;
  value?: string;
  altValue?: string;
  subLabel?: string;
  width?: string;
  type?: 'char' | 'shift' | 'backspace' | 'space' | 'return' | 'mode' | 'lang' | 'dictation';
  alternates?: string[];
}

export interface CustomThemeConfig {
  keyRadius: number; // 4 - 20
  keyHeight: number; // 38 - 50
  bg: string;
  keyBg: string;
  textColor: string;
  specialKeyBg: string;
  returnColor: string;
  glassBlur: boolean;
}

export interface IQKeyboardSettings {
  enabled: boolean;
  distanceFromTextField: number; // in pixels (default 16)
  shouldResignOnTouchOutside: boolean;
  enableAutoToolbar: boolean;
  shouldShowToolbarPlaceholder: boolean;
  toolbarDoneBarButtonItemText: string;
  toolbarTintColor: string;
  shouldPlayInputClicks: boolean;
  soundType: SoundType;
  enableHaptics: boolean;
  theme: KeyboardTheme;
  customTheme: CustomThemeConfig;
  deviceType: DeviceType;
  language: KeyboardLanguage;
  doubleSpaceShortcut: boolean;
  trackpadMode: boolean;
  showDiacriticsOnLongPress: boolean;
}

export interface FormFieldData {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'number' | 'multiline';
  value: string;
  required?: boolean;
}

export interface AndroidBuildConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  targetSdk: number;
  minSdk: number;
  composeVersion: string;
  kotlinVersion: string;
  enableHaptics: boolean;
  enableSound: boolean;
  includeToolbar: boolean;
  languageSupport: 'both' | 'en' | 'ar';
}
