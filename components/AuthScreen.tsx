'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, School, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { DEFAULT_PIN, getStoredPin } from '@/lib/storage';
import { SchoolInfo } from '@/types/preschool';
import { PRESET_LOGOS } from './LogoSelectModal';

interface AuthScreenProps {
  onSuccess?: () => void;
  onAuthenticated?: () => void;
  savedPin?: string;
  schoolInfo?: SchoolInfo;
}

export default function AuthScreen({
  onSuccess,
  onAuthenticated,
  savedPin,
  schoolInfo,
}: AuthScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const effectiveSavedPin = savedPin || getStoredPin();

  const handleCallbackSuccess = () => {
    if (onAuthenticated) onAuthenticated();
    if (onSuccess) onSuccess();
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const verifyPin = (inputPin: string) => {
    if (inputPin === effectiveSavedPin) {
      setError('');
      handleCallbackSuccess();
    } else {
      setError('Mã PIN không chính xác! Vui lòng thử lại.');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 500);
    }
  };

  const handleQuickFillDefault = () => {
    setPin(DEFAULT_PIN);
    setError('');
    setTimeout(() => {
      if (DEFAULT_PIN === effectiveSavedPin) {
        handleCallbackSuccess();
      } else {
        verifyPin(DEFAULT_PIN);
      }
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigitClick(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Enter' && pin.length === 6) {
      verifyPin(pin);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center p-4 outline-none select-none text-slate-100"
    >
      {/* Decorative top badge */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 text-slate-900">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-3 overflow-hidden">
            {schoolInfo?.logoUrl ? (
              schoolInfo.logoUrl.startsWith('preset:') ? (
                (() => {
                  const found = PRESET_LOGOS.find((p) => p.id === schoolInfo.logoUrl);
                  if (found) {
                    const PresetIcon = found.icon;
                    return (
                      <div
                        className={`w-full h-full bg-gradient-to-tr ${found.gradient} ${found.iconColor} flex items-center justify-center`}
                      >
                        <PresetIcon className="w-9 h-9" />
                      </div>
                    );
                  }
                  return (
                    <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center">
                      <School className="w-8 h-8" />
                    </div>
                  );
                })()
              ) : (
                <div className="w-full h-full bg-white p-1 flex items-center justify-center border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={schoolInfo.logoUrl}
                    alt={schoolInfo.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center">
                <School className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Hệ thống Quản lý Mầm non & Số hóa Hồ sơ
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            {schoolInfo ? schoolInfo.name : 'Trường Mầm Non Họa Mi'}
          </h1>
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mt-0.5">
            {schoolInfo ? schoolInfo.department : 'Phòng GD&ĐT Quận Cầu Giấy'}
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Nhập mã PIN 6 chữ số để mở khóa hệ thống sổ sách điện tử
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="my-6">
          <div
            className={`flex justify-center items-center gap-3 transition-transform ${
              isShaking ? 'animate-shake' : ''
            }`}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const hasDigit = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all duration-150 ${
                    hasDigit
                      ? 'border-blue-600 bg-blue-50 text-blue-800 scale-105 shadow-sm'
                      : 'border-slate-300 bg-slate-50 text-transparent'
                  }`}
                >
                  {hasDigit ? '•' : ''}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-rose-600 text-xs font-medium mt-3 bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitClick(num)}
              className="h-13 text-xl font-semibold rounded-xl bg-slate-100 hover:bg-blue-100 active:bg-blue-200 text-slate-800 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-13 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
          >
            Xóa hết
          </button>
          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="h-13 text-xl font-semibold rounded-xl bg-slate-100 hover:bg-blue-100 active:bg-blue-200 text-slate-800 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-13 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
          >
            ⌫ Xóa
          </button>
        </div>

        {/* Unlock Button */}
        <button
          type="button"
          onClick={() => verifyPin(pin)}
          disabled={pin.length !== 6}
          className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
            pin.length === 6
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Mở khóa vào Bảng điều khiển</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Default PIN Helper */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Mã PIN ban đầu mặc định: <strong className="text-slate-800 font-mono">150520</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDefault}
            className="text-blue-700 hover:text-blue-800 font-medium underline underline-offset-2 cursor-pointer"
          >
            Điền nhanh
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400 max-w-sm">
        Hệ thống hỗ trợ số hóa toàn bộ sổ sách theo chuẩn văn bản Phòng Giáo dục & Đào tạo.
      </div>
    </div>
  );
}
