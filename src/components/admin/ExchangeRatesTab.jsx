import React, { useState, useEffect, useRef } from 'react';
import { Save, Calendar, Trash2, TrendingUp, RefreshCw, PlusCircle, ChevronRight, ChevronLeft } from 'lucide-react';

// --- توابع تبدیل تاریخ (Jalaali Logic) ---
const jalaali = {
  toJalaali: (gy, gm, gd) => {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979; gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * parseInt(days / 12053); days %= 12053; jy += 4 * parseInt(days / 1461); days %= 1461;
    jy += parseInt((days - 1) / 365); if (days > 365) days = (days - 1) % 365;
    let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { jy, jm, jd };
  },
  toGregorian: (jy, jm, jd) => {
    let gy = (jy <= 979) ? 621 : 1600; jy -= (jy <= 979) ? 0 : 979;
    let days = (365 * jy) + (parseInt(jy / 33) * 8) + parseInt(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * parseInt(days / 146097); days %= 146097;
    if (days > 36524) { days--; gy += 100 * parseInt(days / 36524); days %= 36524; if (days >= 365) days++; }
    gy += 4 * parseInt(days / 1461); days %= 1461; gy += parseInt((days - 1) / 365); if (days > 365) days = (days - 1) % 365;
    let gd = days + 1;
    let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm; for (gm = 0; gm < 13; gm++) { let v = sal_a[gm]; if (gd <= v) break; gd -= v; }
    return new Date(gy, gm - 1, gd);
  },
  jalaaliMonthLength: (jy, jm) => {
    if (jm <= 6) return 31; if (jm <= 11) return 30;
    return (jy % 33 === 1 || jy % 33 === 5 || jy % 33 === 9 || jy % 33 === 13 || jy % 33 === 17 || jy % 33 === 22 || jy % 33 === 26 || jy % 33 === 30) ? 30 : 29;
  }
};

const MONTH_NAMES = {
  gregorian: ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"],
  solar: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"]
};

// --- کامپوننت تقویم هوشمند ---
const SmartCalendar = ({ selectedDate, onSelect, onClose }) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const [currentView, setCurrentView] = useState(() => {
      const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return { year: jToday.jy, month: jToday.jm - 1 }; 
  });

  const changeMonth = (offset) => {
      let newMonth = currentView.month + offset; let newYear = currentView.year;
      if (newMonth > 11) { newMonth = 0; newYear++; } else if (newMonth < 0) { newMonth = 11; newYear--; }
      const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      if (newYear < jToday.jy || (newYear === jToday.jy && newMonth < jToday.jm - 1)) return;
      setCurrentView({ year: newYear, month: newMonth });
  };

  const generateDays = () => {
      const days = [];
      const daysInMonth = jalaali.jalaaliMonthLength(currentView.year, currentView.month + 1);
      const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
      const startDayOfWeek = (gDate.getDay() + 1) % 7; 

      for (let i = 0; i < startDayOfWeek; i++) days.push({ empty: true });
      for (let i = 1; i <= daysInMonth; i++) {
          const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, i);
          const dateString = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2,'0')}-${String(gDate.getDate()).padStart(2,'0')}`;
          days.push({
              day: i, secondaryDay: gDate.getDate(), dateString: dateString, 
              isPast: gDate < today, isSelected: selectedDate === dateString, isToday: gDate.getTime() === today.getTime()
          });
      }
      return days;
  };

  const getSecondaryMonthRange = () => {
      const startG = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
      const endG = jalaali.toGregorian(currentView.year, currentView.month + 1, 28);
      const m1 = MONTH_NAMES.gregorian[startG.getMonth()];
      const m2 = MONTH_NAMES.gregorian[endG.getMonth()];
      return startG.getMonth() === endG.getMonth() ? m1 : `${m1} - ${m2}`;
  };

  const toNativeNum = (num) => String(num).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 w-[340px] animate-in zoom-in-95 origin-top-right" onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-2xl">
            <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition disabled:opacity-30"><ChevronRight size={20}/></button>
            <div className="text-center">
                <span className="font-black text-lg text-gray-800 block leading-none">{MONTH_NAMES.solar[currentView.month]} {toNativeNum(currentView.year)}</span>
                <span className="text-xs font-bold text-[#058B8C] mt-1 block">{getSecondaryMonthRange()}</span>
            </div>
            <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition"><ChevronLeft size={20}/></button>
        </div>
        <div className="grid grid-cols-7 text-center mb-2">
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d, i) => <div key={i} className={`text-xs font-black ${i===0 || i===6 ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
            {generateDays().map((d, idx) => {
                if (d.empty) return <div key={idx}></div>;
                return (
                    <button type="button" key={idx} disabled={d.isPast} onClick={() => !d.isPast && onSelect(d.dateString)} className={`h-12 rounded-xl flex flex-col items-center justify-center relative transition-all border border-transparent ${d.isPast ? 'text-gray-300 cursor-not-allowed bg-gray-50/50' : 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer text-gray-700'} ${d.isSelected ? '!bg-[#058B8C] !text-white shadow-lg shadow-[#058B8C]/30 transform scale-105 z-10' : ''} ${d.isToday && !d.isSelected ? 'border border-[#058B8C] text-[#058B8C] font-bold' : ''}`}>
                        <span className="text-sm font-black leading-none mb-0.5">{toNativeNum(d.day)}</span>
                        <span className={`text-[10px] font-bold ${d.isSelected ? 'text-white/70' : 'text-gray-400'}`} dir="ltr">{d.secondaryDay}</span>
                    </button>
                )
            })}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <button type="button" onClick={onClose} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">بستن</button>
        </div>
    </div>
  );
};

export default function ExchangeRatesTab() {
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    usd_buy: '', usd_sell: '', eur_buy: '', eur_sell: '', irr_buy: '', irr_sell: ''
  });

  const [history, setHistory] = useState([
    { id: 1, date: '2026-02-19', usd_buy: 71.00, usd_sell: 71.30, eur_buy: 76.80, eur_sell: 77.20, irr_buy: 1180, irr_sell: 1200 }
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddRate = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.usd_buy || !formData.usd_sell || !formData.eur_buy || !formData.eur_sell || !formData.irr_buy || !formData.irr_sell) return alert('تمام فیلدهای نرخ خرید و فروش الزامی است.');

    setLoading(true);
    setTimeout(() => {
        setHistory([{ id: Date.now(), ...formData, usd_buy: Number(formData.usd_buy), usd_sell: Number(formData.usd_sell), eur_buy: Number(formData.eur_buy), eur_sell: Number(formData.eur_sell), irr_buy: Number(formData.irr_buy), irr_sell: Number(formData.irr_sell) }, ...history]);
        setFormData({ ...formData, usd_buy: '', usd_sell: '', eur_buy: '', eur_sell: '', irr_buy: '', irr_sell: '' });
        setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-6xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
         <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2"><TrendingUp className="text-[#058B8C]" size={28}/> نرخ اسعار روزانه بازار کابل</h2>
         <p className="text-sm text-gray-500 mt-2">ثبت نرخ خرید و فروش روزانه برای محاسبه دقیق تراکنش‌های ارزی و سود و زیان.</p>
      </div>

      {/* حذف overflow-hidden از فرم تا تقویم بتواند کامل باز شود */}
      <form onSubmit={handleAddRate} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg relative">
         {/* اضافه کردن rounded-t-3xl به خط رنگی بالا */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#058B8C] to-[#D4AF37] rounded-t-3xl"></div>
         
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
             <h3 className="font-black text-gray-800 text-lg flex items-center gap-2"><PlusCircle size={20} className="text-[#058B8C]"/> ثبت نرخ جدید</h3>
             
             {/* فیلد تاریخ مجهز به تقویم هوشمند */}
             <div className="relative flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200" ref={calendarRef}>
                 <span className="text-sm font-bold text-gray-600 pr-2">تاریخ ثبت:</span>
                 <div onClick={() => setShowCalendar(!showCalendar)} className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono cursor-pointer flex items-center justify-between min-w-[150px]">
                    <span dir="ltr" className="font-bold text-gray-800">{formData.date}</span>
                    <Calendar size={16} className="text-gray-400 ml-2"/>
                 </div>
                 {showCalendar && (
                    <SmartCalendar selectedDate={formData.date} onSelect={(d) => { setFormData({...formData, date: d}); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} />
                 )}
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                 <div className="flex justify-between items-center border-b border-blue-100 pb-3 mb-4"><div className="font-black text-blue-900 text-lg">۱ دلار (USD)</div><div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">به افغانی</div></div>
                 <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-xs font-bold text-gray-500 mb-1 block">نرخ خرید</label><input type="number" step="0.01" value={formData.usd_buy} onChange={e=>setFormData({...formData, usd_buy: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 font-mono text-center" required/></div>
                     <div><label className="text-xs font-bold text-gray-500 mb-1 block">نرخ فروش</label><input type="number" step="0.01" value={formData.usd_sell} onChange={e=>setFormData({...formData, usd_sell: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 font-mono text-center" required/></div>
                 </div>
             </div>
             <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                 <div className="flex justify-between items-center border-b border-orange-100 pb-3 mb-4"><div className="font-black text-orange-900 text-lg">۱ یورو (EUR)</div><div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">به افغانی</div></div>
                 <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-xs font-bold text-gray-500 mb-1 block">نرخ خرید</label><input type="number" step="0.01" value={formData.eur_buy} onChange={e=>setFormData({...formData, eur_buy: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-500 font-mono text-center" required/></div>
                     <div><label className="text-xs font-bold text-gray-500 mb-1 block">نرخ فروش</label><input type="number" step="0.01" value={formData.eur_sell} onChange={e=>setFormData({...formData, eur_sell: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-500 font-mono text-center" required/></div>
                 </div>
             </div>
             <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
                 <div className="flex justify-between items-center border-b border-green-100 pb-3 mb-4"><div className="font-black text-green-900 text-lg">۱ میلیون تومان</div><div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">به افغانی</div></div>
                 <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-xs font-bold text-gray-500 mb-1 block">نرخ خرید</label><input type="number" value={formData.irr_buy} onChange={e=>setFormData({...formData, irr_buy: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-500 font-mono text-center" required/></div>
                     <div><label className="text-xs font-bold text-gray-500 mb-1 block">نرخ فروش</label><input type="number" value={formData.irr_sell} onChange={e=>setFormData({...formData, irr_sell: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-500 font-mono text-center" required/></div>
                 </div>
             </div>
         </div>

         <div className="mt-6 flex justify-end">
             <button type="submit" disabled={loading} className="bg-[#058B8C] hover:bg-[#047070] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg disabled:opacity-70">{loading ? <RefreshCw className="animate-spin" size={20}/> : <Save size={20}/>} ثبت در سیستم</button>
         </div>
      </form>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
         <div className="p-5 border-b border-gray-100 bg-gray-50"><h3 className="font-black text-gray-800">تاریخچه نرخ اسعار</h3></div>
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-center">
                 <thead className="bg-gray-100 text-gray-600">
                     <tr><th className="p-4 text-right" rowSpan="2">تاریخ</th><th className="p-3 border-r border-gray-200" colSpan="2">۱ دلار (USD)</th><th className="p-3 border-r border-gray-200" colSpan="2">۱ یورو (EUR)</th><th className="p-3 border-r border-gray-200" colSpan="2">۱ میلیون تومان (IRR)</th><th className="p-4 border-r border-gray-200" rowSpan="2">عملیات</th></tr>
                     <tr className="bg-gray-50 text-xs"><th className="p-2 border-r border-t border-gray-200">خرید</th><th className="p-2 border-t border-gray-200">فروش</th><th className="p-2 border-r border-t border-gray-200">خرید</th><th className="p-2 border-t border-gray-200">فروش</th><th className="p-2 border-r border-t border-gray-200">خرید</th><th className="p-2 border-t border-gray-200">فروش</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {history.map((item) => (
                         <tr key={item.id} className="hover:bg-blue-50/30">
                             <td className="p-4 text-right font-bold text-gray-800" dir="ltr">{item.date}</td>
                             <td className="p-3 border-r border-gray-100 font-mono text-gray-600">{item.usd_buy.toFixed(2)}</td><td className="p-3 font-mono font-bold text-blue-600">{item.usd_sell.toFixed(2)}</td>
                             <td className="p-3 border-r border-gray-100 font-mono text-gray-600">{item.eur_buy.toFixed(2)}</td><td className="p-3 font-mono font-bold text-orange-600">{item.eur_sell.toFixed(2)}</td>
                             <td className="p-3 border-r border-gray-100 font-mono text-gray-600">{item.irr_buy}</td><td className="p-3 font-mono font-bold text-green-600">{item.irr_sell}</td>
                             <td className="p-3 border-r border-gray-100"><button onClick={() => setHistory(history.filter(h=>h.id!==item.id))} className="p-1.5 bg-red-50 text-red-500 rounded-lg mx-auto block"><Trash2 size={16}/></button></td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
}