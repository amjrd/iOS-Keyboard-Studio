import React, { useState } from 'react';
import { FormFieldData } from '../types/keyboard';
import { User, CreditCard, MessageSquare, FileText, Send, Lock } from 'lucide-react';

export type ScreenType = 'registration' | 'checkout' | 'chat' | 'notes';

interface FormsPlaygroundProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
  focusedFieldId: string | null;
  onFieldFocus: (id: string, label: string) => void;
  formValues: Record<string, string>;
  onFormValueChange: (id: string, value: string) => void;
  onSubmit: (screen: ScreenType) => void;
}

export const FormsPlayground: React.FC<FormsPlaygroundProps> = ({
  currentScreen,
  onScreenChange,
  focusedFieldId,
  onFieldFocus,
  formValues,
  onFormValueChange,
  onSubmit,
}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'other'; text: string; time: string }>>([
    { sender: 'other', text: 'Hey! Is IQKeyboardManager active?', time: '10:41 AM' },
    { sender: 'user', text: 'Yes, running iOS 17 keyboard & insets engine!', time: '10:42 AM' },
    { sender: 'other', text: 'Try focusing the input below to test keyboard distance and toolbar.', time: '10:43 AM' },
  ]);

  const handleSendChat = () => {
    const text = formValues['chat_input'] || '';
    if (!text.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text, time: 'Now' },
    ]);
    onFormValueChange('chat_input', '');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Screen Mode Tabs */}
      <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => onScreenChange('registration')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            currentScreen === 'registration'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign Up</span>
        </button>

        <button
          type="button"
          onClick={() => onScreenChange('checkout')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            currentScreen === 'checkout'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Checkout</span>
        </button>

        <button
          type="button"
          onClick={() => onScreenChange('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            currentScreen === 'chat'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Messenger</span>
        </button>

        <button
          type="button"
          onClick={() => onScreenChange('notes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
            currentScreen === 'notes'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>
      </div>

      {/* Screen Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentScreen === 'registration' && (
          <div className="space-y-3.5">
            <div className="mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Account</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Notice how IQKeyboardManager auto-scrolls to every focused field.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                id="reg_name"
                type="text"
                value={formValues['reg_name'] || ''}
                onChange={(e) => onFormValueChange('reg_name', e.target.value)}
                onFocus={() => onFieldFocus('reg_name', 'Full Name')}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'reg_name'
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                id="reg_email"
                type="email"
                value={formValues['reg_email'] || ''}
                onChange={(e) => onFormValueChange('reg_email', e.target.value)}
                onFocus={() => onFieldFocus('reg_email', 'Email Address')}
                placeholder="alex@company.com"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'reg_email'
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                id="reg_password"
                type="password"
                value={formValues['reg_password'] || ''}
                onChange={(e) => onFormValueChange('reg_password', e.target.value)}
                onFocus={() => onFieldFocus('reg_password', 'Password')}
                placeholder="••••••••••••"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'reg_password'
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                id="reg_phone"
                type="tel"
                value={formValues['reg_phone'] || ''}
                onChange={(e) => onFormValueChange('reg_phone', e.target.value)}
                onFocus={() => onFieldFocus('reg_phone', 'Mobile Number')}
                placeholder="+1 (555) 019-2834"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'reg_phone'
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                City / Region
              </label>
              <input
                id="reg_city"
                type="text"
                value={formValues['reg_city'] || ''}
                onChange={(e) => onFormValueChange('reg_city', e.target.value)}
                onFocus={() => onFieldFocus('reg_city', 'City / Region')}
                placeholder="San Francisco, CA"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'reg_city'
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => onSubmit('registration')}
              className="w-full py-3 mt-4 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <span>Complete Registration</span>
            </button>
          </div>
        )}

        {currentScreen === 'checkout' && (
          <div className="space-y-3.5">
            <div className="mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Secure Checkout</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test numerical keypad input & toolbar done buttons.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Cardholder Name
              </label>
              <input
                id="pay_name"
                type="text"
                value={formValues['pay_name'] || ''}
                onChange={(e) => onFormValueChange('pay_name', e.target.value)}
                onFocus={() => onFieldFocus('pay_name', 'Cardholder Name')}
                placeholder="JOHN DOE"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'pay_name'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Card Number
              </label>
              <input
                id="pay_number"
                type="text"
                value={formValues['pay_number'] || ''}
                onChange={(e) => onFormValueChange('pay_number', e.target.value)}
                onFocus={() => onFieldFocus('pay_number', 'Card Number')}
                placeholder="4000 1234 5678 9010"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none font-mono ${
                  focusedFieldId === 'pay_number'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Expiry Date
                </label>
                <input
                  id="pay_exp"
                  type="text"
                  value={formValues['pay_exp'] || ''}
                  onChange={(e) => onFormValueChange('pay_exp', e.target.value)}
                  onFocus={() => onFieldFocus('pay_exp', 'Expiry Date')}
                  placeholder="MM/YY"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none font-mono ${
                    focusedFieldId === 'pay_exp'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Security Code
                </label>
                <input
                  id="pay_cvv"
                  type="password"
                  value={formValues['pay_cvv'] || ''}
                  onChange={(e) => onFormValueChange('pay_cvv', e.target.value)}
                  onFocus={() => onFieldFocus('pay_cvv', 'Security Code (CVV)')}
                  placeholder="CVC"
                  maxLength={4}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none font-mono ${
                    focusedFieldId === 'pay_cvv'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Billing Address
              </label>
              <input
                id="pay_address"
                type="text"
                value={formValues['pay_address'] || ''}
                onChange={(e) => onFormValueChange('pay_address', e.target.value)}
                onFocus={() => onFieldFocus('pay_address', 'Billing Address')}
                placeholder="742 Evergreen Terrace"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'pay_address'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => onSubmit('checkout')}
              className="w-full py-3 mt-4 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authorize & Pay $49.00</span>
            </button>
          </div>
        )}

        {currentScreen === 'chat' && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-2.5 mb-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <input
                id="chat_input"
                type="text"
                value={formValues['chat_input'] || ''}
                onChange={(e) => onFormValueChange('chat_input', e.target.value)}
                onFocus={() => onFieldFocus('chat_input', 'Message Field')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChat();
                }}
                placeholder="iMessage or typing..."
                className={`flex-1 px-3 py-2 text-xs rounded-full border bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all outline-none ${
                  focusedFieldId === 'chat_input'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={handleSendChat}
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center active:scale-95 transition-transform shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'notes' && (
          <div className="space-y-3.5">
            <div className="mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Notes</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-line text editor with automatic scrolling avoidance.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Note Title
              </label>
              <input
                id="note_title"
                type="text"
                value={formValues['note_title'] || ''}
                onChange={(e) => onFormValueChange('note_title', e.target.value)}
                onFocus={() => onFieldFocus('note_title', 'Note Title')}
                placeholder="Meeting Architecture Summary"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none ${
                  focusedFieldId === 'note_title'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Note Content
              </label>
              <textarea
                id="note_body"
                rows={5}
                value={formValues['note_body'] || ''}
                onChange={(e) => onFormValueChange('note_body', e.target.value)}
                onFocus={() => onFieldFocus('note_body', 'Note Content')}
                placeholder="Type your markdown or thoughts here..."
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none resize-none ${
                  focusedFieldId === 'note_body'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => onSubmit('notes')}
              className="w-full py-2.5 text-xs font-semibold rounded-xl text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Save Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
