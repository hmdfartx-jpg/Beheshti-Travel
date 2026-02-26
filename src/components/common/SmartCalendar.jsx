import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- توابع تبدیل تاریخ (Jalaali Logic) ---
const jalaali = {
  toJalaali: (gy, gm, gd) => {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * parseInt(days / 12053);
    days %= 12053;
    jy += 4 * parseInt(days / 1461);
    days %= 1461;
    jy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { jy, jm, jd };
  },
  toGregorian: (jy, jm, jd) => {
    let gy = (jy <= 979) ? 621 : 1600;
    jy -= (jy <= 979) ? 0 : 979;
    let days = (365 * jy) + (parseInt(jy / 33) * 8) + parseInt(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * parseInt(days / 146097);
    days %= 146097;
    if (days > 36524) {
      days--;
      gy += 100 * parseInt(days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * parseInt(days / 1461);
    days %= 1461;
    gy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    let gd = days + 1;
    let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm;
    for (gm = 0; gm < 13; gm++) {
      let v = sal_a[gm];
      if (gd <= v) break;
      gd -= v;
    }
    return new Date(gy, gm - 1, gd);
  },
  jalaaliMonthLength: (jy, jm) => {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    const isLeap = (jy % 33 === 1 || jy % 33 === 5 || jy % 33 === 9 || jy % 33 === 13 || jy % 33 === 17 || jy % 33 === 22 || jy % 33 === 26 || jy % 33 === 30);
    return isLeap ? 30 : 29;
  }
};

// --- نام ماه‌ها (با نام‌های افغانی برای شمسی) ---
const MONTH_NAMES = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  dr_gregorian: ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"],
  ps_gregorian: ["جنوري", "فبروري", "مارچ", "اپریل", "می", "جون", "جولای", "اګست", "سپتمبر", "اکتوبر", "نومبر", "دسمبر"],
  dr_solar: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"],
  ps_solar: ["وری", "غویی", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "لیندۍ", "مرغومی", "سلواغه", "کب"]
};

const translations = {
  dr: { close: "بستن" },
  ps: { close: "بندول" },
  en: { close: "Close" }
};

export default function SmartCalendar({ selectedDate, onSelect, onClose, lang = 'dr', align = 'left' }) {
  const isLtr = lang === 'en';
  const today = new Date();
  today.setHours(0,0,0,0);

  const [currentView, setCurrentView] = useState(() => {
      if (isLtr) {
          return { year: today.getFullYear(), month: today.getMonth() };
      } else {
          const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
          return { year: jToday.jy, month: jToday.jm - 1 };
      }
  });

  const changeMonth = (offset) => {
      let newMonth = currentView.month + offset;
      let newYear = currentView.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      else if (newMonth < 0) { newMonth = 11; newYear--; }
      
      if (isLtr) {
          if (new Date(newYear, newMonth, 1) < new Date(today.getFullYear(), today.getMonth(), 1)) return;
      } else {
          const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
          if (newYear < jToday.jy || (newYear === jToday.jy && newMonth < jToday.jm - 1)) return;
      }
      setCurrentView({ year: newYear, month: newMonth });
  };

  const generateDays = () => {
      const days = [];
      let daysInMonth, startDayOfWeek;
      if (isLtr) {
          daysInMonth = new Date(currentView.year, currentView.month + 1, 0).getDate();
          startDayOfWeek = new Date(currentView.year, currentView.month, 1).getDay();
      } else {
          daysInMonth = jalaali.jalaaliMonthLength(currentView.year, currentView.month + 1);
          const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
          const jsDay = gDate.getDay();
          startDayOfWeek = (jsDay + 1) % 7;
      }

      for (let i = 0; i < startDayOfWeek; i++) days.push({ empty: true });
      for (let i = 1; i <= daysInMonth; i++) {
          let dateObj, isPast, dateString, secondaryDay;
          if (isLtr) {
              dateObj = new Date(currentView.year, currentView.month, i);
              isPast = dateObj < today;
              const jDate = jalaali.toJalaali(currentView.year, currentView.month + 1, i);
              secondaryDay = jDate.jd;
              dateString = `${currentView.year}-${String(currentView.month + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
          } else {
              const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, i);
              dateObj = gDate;
              isPast = gDate < today;
              secondaryDay = gDate.getDate();
              dateString = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2,'0')}-${String(gDate.getDate()).padStart(2,'0')}`;
          }

          days.push({
              day: i,
              secondaryDay: secondaryDay,
              dateString: dateString,
              isPast: isPast,
              isSelected: selectedDate === dateString,
              isToday: dateObj.getTime() === today.getTime()
          });
      }
      return days;
  };

  const getSecondaryMonthRange = () => {
      if (isLtr) {
          const startJ = jalaali.toJalaali(currentView.year, currentView.month + 1, 1);
          const endJ = jalaali.toJalaali(currentView.year, currentView.month + 1, 28); 
          const m1 = MONTH_NAMES.dr_solar[startJ.jm - 1]; 
          const m2 = MONTH_NAMES.dr_solar[endJ.jm - 1];
          return startJ.jm === endJ.jm ? m1 : `${m1} - ${m2}`;
      } else {
          const startG = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
          const endG = jalaali.toGregorian(currentView.year, currentView.month + 1, 28);
          const mArr = lang === 'ps' ? MONTH_NAMES.ps_gregorian : MONTH_NAMES.dr_gregorian;
          const m1 = mArr[startG.getMonth()];
          const m2 = mArr[endG.getMonth()];
          return startG.getMonth() === endG.getMonth() ? m1 : `${m1} - ${m2}`;
      }
  };

  const daysGrid = generateDays();
  const weekDayNames = isLtr ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const primaryMonthName = isLtr ? MONTH_NAMES.en[currentView.month] : (lang === 'ps' ? MONTH_NAMES.ps_solar[currentView.month] : MONTH_NAMES.dr_solar[currentView.month]);
  const toNativeNum = (num) => isLtr ? num : String(num).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

  const alignmentClass = align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left';

  return (
    <div className={`absolute top-full mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 w-[340px] md:w-[360px] animate-in zoom-in-95 ${alignmentClass}`} onClick={e => e.stopPropagation()} dir={isLtr ? 'ltr' : 'rtl'}>
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-2xl">
            <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition disabled:opacity-30">
                {isLtr ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
            </button>
            <div className="text-center">
                <span className="font-black text-lg text-gray-800 block leading-none">
                    {primaryMonthName} {toNativeNum(currentView.year)}
                </span>
                <span className="text-xs font-bold text-[#058B8C] mt-1 block">
                    {getSecondaryMonthRange()}
                </span>
            </div>
            <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition">
                {isLtr ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
            </button>
        </div>

        <div className="grid grid-cols-7 text-center mb-2">
            {weekDayNames.map((d, i) => (
                <div key={i} className={`text-xs font-black ${i===0 || i===6 ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
            {daysGrid.map((d, idx) => {
                if (d.empty) return <div key={idx}></div>;
                return (
                    <button 
                        type="button"
                        key={idx}
                        disabled={d.isPast}
                        onClick={() => !d.isPast && onSelect(d.dateString)}
                        className={`
                            h-12 rounded-xl flex flex-col items-center justify-center relative transition-all border border-transparent
                            ${d.isPast ? 'text-gray-300 cursor-not-allowed bg-gray-50/50' : 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer text-gray-700'}
                            ${d.isSelected ? '!bg-[#058B8C] !text-white shadow-lg shadow-[#058B8C]/30 transform scale-105 z-10' : ''}
                            ${d.isToday && !d.isSelected ? 'border border-[#058B8C] text-[#058B8C] font-bold' : ''}
                        `}
                    >
                        <span className="text-sm font-black leading-none mb-0.5">{toNativeNum(d.day)}</span>
                        <span className={`text-[9px] font-bold ${d.isSelected ? 'text-white/70' : 'text-gray-400'}`} dir="ltr">
                            {d.secondaryDay}
                        </span>
                    </button>
                )
            })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <button type="button" onClick={onClose} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                {translations[lang]?.close || 'بستن'}
            </button>
        </div>
    </div>
  );
}