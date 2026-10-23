export type KeyboardMode = 'letters' | 'numbers' | 'symbols' | 'emojis';
export type KeyboardLanguage = 'en' | 'ar';
export type KeyboardTheme = 'ios17-light' | 'ios17-dark' | 'ios18-glass' | 'android17-material';
export type DeviceType = 'iphone16' | 'android17';

export interface KeyDefinition {
  label: string;
  value?: string;
  altValue?: string;
  width?: string; // flex ratio or specific class
  type?: 'char' | 'shift' | 'backspace' | 'space' | 'return' | 'mode' | 'lang' | 'dictation';
}

export interface IQKeyboardSettings {
  enabled: boolean;
  distanceFromTextField: number; // in pixels (default 10)
  shouldResignOnTouchOutside: boolean;
  enableAutoToolbar: boolean;
  shouldShowToolbarPlaceholder: boolean;
  toolbarDoneBarButtonItemText: string;
  toolbarTintColor: string;
  shouldPlayInputClicks: boolean;
  enableHaptics: boolean;
  theme: KeyboardTheme;
  deviceType: DeviceType;
  language: KeyboardLanguage;
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
