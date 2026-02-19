import React, { useState, useEffect, useRef } from 'react';
import { Plane, Plus, Trash2, Save, Calendar, ChevronRight, ChevronLeft, X } from 'lucide-react';

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
    if (days > 36524) { days--; gy += 100 * parseInt(days / 36524); days %= 36524; if (days >= 365) days++; }
    gy += 4 * parseInt(days / 1461); days %= 1461; gy += parseInt((days - 1) / 365); if (days > 365) days = (days - 1) % 365;
    let gd = days + 1;
    let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm; for (gm = 0; gm < 13; gm++) { let v = sal_a[gm]; if (gd <= v) break; gd -= v; }
    return new Date(gy, gm - 1, gd);
  },
  jalaaliMonthLength: (jy, jm) => {
    if (jm <= 6) return 31; if (jm <= 11) return 30;
    const isLeap = (jy % 33 === 1 || jy % 33 === 5 || jy % 33 === 9 || jy % 33 === 13 || jy % 33 === 17 || jy % 33 === 22 || jy % 33 === 26 || jy % 33 === 30);
    return isLeap ? 30 : 29;
  }
};

const MONTH_NAMES = {
  gregorian: ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"],
  solar: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"]
};

// --- کامپوننت تقویم هوشمند (مخصوص ادمین) ---
const SmartCalendar = ({ selectedDate, onSelect, onClose }) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [currentView, setCurrentView] = useState(() => {
      const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return { year: jToday.jy, month: jToday.jm - 1 }; 
  });

  const changeMonth = (offset) => {
      let newMonth = currentView.month + offset;
      let newYear = currentView.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      else if (newMonth < 0) { newMonth = 11; newYear--; }
      const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      if (newYear < jToday.jy || (newYear === jToday.jy && newMonth < jToday.jm - 1)) return;
      setCurrentView({ year: newYear, month: newMonth });
  };

  const generateDays = () => {
      const days = [];
      const daysInMonth = jalaali.jalaaliMonthLength(currentView.year, currentView.month + 1);
      const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
      const jsDay = gDate.getDay(); 
      const startDayOfWeek = (jsDay + 1) % 7; 

      for (let i = 0; i < startDayOfWeek; i++) days.push({ empty: true });

      for (let i = 1; i <= daysInMonth; i++) {
          const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, i);
          const isPast = gDate < today;
          const secondaryDay = gDate.getDate();
          const dateString = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2,'0')}-${String(gDate.getDate()).padStart(2,'0')}`;

          days.push({
              day: i, secondaryDay: secondaryDay, dateString: dateString, isPast: isPast,
              isSelected: selectedDate === dateString, isToday: gDate.getTime() === today.getTime()
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

  const daysGrid = generateDays();
  const weekDayNames = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  const toNativeNum = (num) => String(num).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

  return (
    <div className="absolute top-full right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 w-[340px] animate-in zoom-in-95 origin-top-right" onClick={e => e.stopPropagation()} dir="rtl">
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-2xl">
            <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition disabled:opacity-30"><ChevronRight size={20}/></button>
            <div className="text-center">
                <span className="font-black text-lg text-gray-800 block leading-none">{MONTH_NAMES.solar[currentView.month]} {toNativeNum(currentView.year)}</span>
                <span className="text-xs font-bold text-[#058B8C] mt-1 block">{getSecondaryMonthRange()}</span>
            </div>
            <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition"><ChevronLeft size={20}/></button>
        </div>
        <div className="grid grid-cols-7 text-center mb-2">
            {weekDayNames.map((d, i) => <div key={i} className={`text-xs font-black ${i===0 || i===6 ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
            {daysGrid.map((d, idx) => {
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

export default function CustomFlightsTab() {
  const [manualFlights, setManualFlights] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const [newFlight, setNewFlight] = useState({
    airline: '', flightNo: '', origin: '', destination: '',
    date: '', time: '', price: '', capacity: '100', class: 'اکونومی'
  });

  useEffect(() => {
    function handleClickOutside(event) {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddFlight = () => {
    if (!newFlight.origin || !newFlight.destination || !newFlight.price || !newFlight.date) return alert("لطفا فیلدهای ضروری از جمله تاریخ را پر کنید.");
    setManualFlights([{ ...newFlight, id: Date.now() }, ...manualFlights]);
    setNewFlight({ airline: '', flightNo: '', origin: '', destination: '', date: '', time: '', price: '', capacity: '100', class: 'اکونومی' });
  };

  const handleDelete = (id) => setManualFlights(manualFlights.filter(f => f.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-black text-gray-800">مدیریت پروازهای دستی (چارتر)</h2>
           <p className="text-sm text-gray-500 mt-1">پروازهایی که در اینجا اضافه می‌کنید مستقیماً در نتایج جستجوی کاربران سایت نمایش داده می‌شود.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-4 mb-4"><Plus size={18} className="text-[#058B8C]"/> افزودن پرواز جدید</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">ایرلاین</label><input type="text" value={newFlight.airline} onChange={e=>setNewFlight({...newFlight, airline: e.target.value})} placeholder="مثلا آریانا افغان" className="input-admin" /></div>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">شماره پرواز</label><input type="text" value={newFlight.flightNo} onChange={e=>setNewFlight({...newFlight, flightNo: e.target.value})} placeholder="FG-101" className="input-admin dir-ltr" /></div>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">فرودگاه مبدا</label><input type="text" value={newFlight.origin} onChange={e=>setNewFlight({...newFlight, origin: e.target.value})} placeholder="KBL" className="input-admin" /></div>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">فرودگاه مقصد</label><input type="text" value={newFlight.destination} onChange={e=>setNewFlight({...newFlight, destination: e.target.value})} placeholder="MZD" className="input-admin" /></div>
          
          {/* فیلد تاریخ مجهز به تقویم هوشمند */}
          <div className="relative" ref={calendarRef}>
             <label className="text-xs font-bold text-gray-500 mb-1 block">تاریخ پرواز</label>
             <div onClick={() => setShowCalendar(!showCalendar)} className="input-admin flex items-center justify-between cursor-pointer bg-[#F9FAFB]">
                <span className={`font-bold ${newFlight.date ? 'text-gray-800' : 'text-gray-400'}`} dir="ltr">{newFlight.date || 'انتخاب تاریخ'}</span>
                <Calendar size={16} className="text-gray-400"/>
             </div>
             {showCalendar && (
                <SmartCalendar selectedDate={newFlight.date} onSelect={(d) => { setNewFlight({...newFlight, date: d}); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} />
             )}
          </div>

          <div><label className="text-xs font-bold text-gray-500 mb-1 block">ساعت پرواز</label><input type="time" value={newFlight.time} onChange={e=>setNewFlight({...newFlight, time: e.target.value})} className="input-admin" /></div>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">قیمت (افغانی/دلار)</label><input type="number" value={newFlight.price} onChange={e=>setNewFlight({...newFlight, price: e.target.value})} placeholder="5000" className="input-admin" /></div>
          <div><label className="text-xs font-bold text-gray-500 mb-1 block">ظرفیت مسافر</label><input type="number" value={newFlight.capacity} onChange={e=>setNewFlight({...newFlight, capacity: e.target.value})} className="input-admin" /></div>
        </div>
        
        <div className="flex justify-end pt-4">
           <button onClick={handleAddFlight} className="bg-[#058B8C] hover:bg-[#047070] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-[#058B8C]/30"><Save size={18}/> ذخیره پرواز در موتور جستجو</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 text-right">ایرلاین / پرواز</th>
              <th className="p-4 text-right">مسیر</th>
              <th className="p-4 text-center">زمان</th>
              <th className="p-4 text-center">ظرفیت/کلاس</th>
              <th className="p-4 text-center">قیمت</th>
              <th className="p-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {manualFlights.map(f => (
               <tr key={f.id} className="hover:bg-gray-50">
                  <td className="p-4"><div className="font-bold text-gray-800">{f.airline}</div><div className="text-xs text-gray-400 font-mono">{f.flightNo}</div></td>
                  <td className="p-4 font-bold" dir="ltr">{f.origin} &rarr; {f.destination}</td>
                  <td className="p-4 text-center"><div className="font-mono text-gray-800" dir="ltr">{f.date}</div><div className="text-xs text-gray-500">{f.time}</div></td>
                  <td className="p-4 text-center">{f.capacity} نفر<br/><span className="text-xs text-gray-400">{f.class}</span></td>
                  <td className="p-4 text-center font-black text-[#058B8C]">{Number(f.price).toLocaleString()}</td>
                  <td className="p-4 text-center"><button onClick={() => handleDelete(f.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={18}/></button></td>
               </tr>
             ))}
             {manualFlights.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-bold">هیچ پرواز دستی فعالی وجود ندارد.</td></tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}