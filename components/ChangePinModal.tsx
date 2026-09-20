'use client';

import React, { useState } from 'react';
import { KeyRound, X, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { DEFAULT_PIN } from '@/lib/storage';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSavedPin: string;
  onUpdatePin: (newPin: string) => void;
}

export default function ChangePinModal({
  isOpen,
  onClose,
  currentSavedPin,
  onUpdatePin,
}: ChangePinModalProps) {
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (currentPinInput !== currentSavedPin) {
      setError('Mã PIN hiện tại không chính xác!');
      return;
    }
    if (!/^\d{6}$/.test(newPin)) {
      setError('Mã PIN mới phải bao gồm đúng 6 chữ số!');
      return;
    }
    if (newPin !== confirmPin) {
      setError('Xác nhận mã PIN mới không khớp!');
      return;
    }

    onUpdatePin(newPin);
    setSuccess('Đổi mã PIN thành công!');
    setTimeout(() => {
      onClose();
      setCurrentPinInput('');
      setNewPin('');
      setConfirmPin('');
      setSuccess('');
    }, 1200);
  };

  const handleResetToDefault = () => {
    onUpdatePin(DEFAULT_PIN);
    setSuccess(`Đã khôi phục mã PIN về mặc định (${DEFAULT_PIN})!`);
    setTimeout(() => {
      onClose();
      setSuccess('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Đổi Mã PIN Nội Bộ</h3>
              <p className="text-xs text-slate-500">Mã bảo mật gồm 6 chữ số</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
              <Check className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã PIN hiện tại
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mã PIN mới (6 chữ số)
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nhập lại mã PIN mới
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại 150520
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm cursor-pointer"
              >
                Cập nhật mã PIN
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
