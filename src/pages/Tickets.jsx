import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRightLeft, ChevronDown, User, Calendar, Plus, Minus, Check, Plane, ChevronLeft, ChevronRight, X, Phone, Loader2, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PaymentModal from '../components/PaymentModal';

// لیست فرودگاه‌ها (مشترک با صفحه اصلی)
const AIRPORTS = [
  { code: 'KBL', name: 'Kabul International', city: 'Kabul', fa: 'کابل', ps: 'کابل', country: 'Afghanistan' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', fa: 'دبی', ps: 'دوبی', country: 'UAE' },
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', fa: 'جده', ps: 'جده', country: 'Saudi Arabia' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', fa: 'استانبول', ps: 'استانبول', country: 'Turkey' },
  { code: 'MZD', name: 'Mazar-i-Sharif', city: 'Mazar-i-Sharif', fa: 'مزارشریف', ps: 'مزارشریف', country: 'Afghanistan' },
  { code: 'HER', name: 'Herat International', city: 'Herat', fa: 'هرات', ps: 'هرات', country: 'Afghanistan' },
  { code: 'KDH', name: 'Kandahar International', city: 'Kandahar', fa: 'قندهار', ps: 'کندهار', country: 'Afghanistan' },
  { code: 'THR', name: 'Mehrabad/Imam Khomeini', city: 'Tehran', fa: 'تهران', ps: 'تهران', country: 'Iran' },
  { code: 'MHD', name: 'Mashhad International', city: 'Mashhad', fa: 'مشهد', ps: 'مشهد', country: 'Iran' },
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', fa: 'اسلام‌آباد', ps: 'اسلام‌آباد', country: 'Pakistan' },
  { code: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', fa: 'دهلی نو', ps: 'نوی ډیلي', country: 'India' },
];

const translations = {
  dr: {
    one_way: "یک طرفه", round_trip: "رفت و برگشت",
    economy: "اکونومی", business: "بیزنس", first: "فرست کلاس",
    adults: "بزرگسال", children: "کودک", passenger: "مسافر", confirm: "تایید",
    modalInfoTitle: "اطلاعات مسافر",
    modalInfoDesc: "برای رزرو پرواز، لطفاً مشخصات زیر را وارد کنید.",
    labelName: "نام و نام خانوادگی",
    labelPhone: "شماره تماس",
    placeName: "مثلا: احمد محمدی",
    placePhone: "0799...",
    btnSubmit: "ثبت و ادامه جهت پرداخت",
    btnLoading: "در حال ثبت...",
    modalSuccessTitle: "رزرو اولیه انجام شد!",
    labelOrderId: "شماره سفارش",
    modalPayDesc: "برای نهایی کردن بلیط، لطفاً پرداخت را انجام دهید.",
    paySuccessMsg: "پرداخت با موفقیت انجام شد و بلیط صادر گردید!",
    errorEmpty: "لطفا نام و شماره تماس را وارد کنید",
    errorBooking: "خطا در ثبت رزرو. لطفا دوباره تلاش کنید.",
    searching: "در حال جستجو در ایرلاین‌ها...",
    noResult: "پروازی یافت نشد. لطفاً مسیر دیگری را امتحان کنید.",
    originLabel: "مبدا (شهر یا فرودگاه)",
    destLabel: "مقصد (شهر یا فرودگاه)"
  },
  ps: {
    one_way: "یو طرفه", round_trip: "تګ راتګ",
    economy: "اکونومي", business: "بیزنس", first: "لومړۍ درجه",
    adults: "لویان", children: "ماشومان", passenger: "مسافر", confirm: "تایید",
    modalInfoTitle: "د مسافر معلومات",
    modalInfoDesc: "د الوتنې د ثبت لپاره، مهرباني وکړئ لاندې مشخصات دننه کړئ.",
    labelName: "بشپړ نوم",
    labelPhone: "د اړیکې شمېره",
    placeName: "مثلا: احمد محمدي",
    placePhone: "0799...",
    btnSubmit: "ثبت او د تادیې لپاره دوام",
    btnLoading: "د ثبت په حال کې...",
    modalSuccessTitle: "لومړنی ثبت ترسره شو!",
    labelOrderId: "د سپارښتنې شمېره",
    modalPayDesc: "د ټکټ نهایي کولو لپاره، مهرباني وکړئ تادیه ترسره کړئ.",
    paySuccessMsg: "تادیه په بریالیتوب سره ترسره شوه!",
    errorEmpty: "مهرباني وکړئ نوم او د اړیکې شمېره دننه کړئ",
    errorBooking: "د ثبت پرمهال ستونزه. مهرباني وکړئ بیا هڅه وکړئ.",
    searching: "د الوتنو پلټنه...",
    noResult: "هیڅ الوتنه ونه موندل شوه.",
    originLabel: "مبدا (ښار یا هوايي ډګر)",
    destLabel: "مقصد (ښار یا هوايي ډګر)"
  }
};

// --- کامپوننت جستجوی فرودگاه ---
const AirportSearch = ({ value, onChange, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const found = AIRPORTS.find(a => a.code === value);
    if (found) setSearch(`${found.fa} (${found.code})`);
    else if (!value) setSearch('');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        const found = AIRPORTS.find(a => a.code === value);
        setSearch(found ? `${found.fa} (${found.code})` : '');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredAirports = AIRPORTS.filter(a => 
    a.city.toLowerCase().includes(search.toLowerCase()) || 
    a.code.toLowerCase().includes(search.toLowerCase()) ||
    a.fa.includes(search) ||
    a.ps.includes(search)
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition cursor-text group" onClick={() => setIsOpen(true)}>
        <div className="text-gray-400 group-hover:text-[#058B8C] transition"><Icon size={20}/></div>
        <input 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full text-sm font-black text-gray-800 bg-transparent outline-none placeholder:font-normal placeholder:text-gray-400"
          autoComplete="off"
        />
        {value && <button onClick={(e) => { e.stopPropagation(); onChange(''); setSearch(''); }} className="p-1 hover:bg-gray-200 rounded-full"><X size={14} className="text-gray-400"/></button>}
      </div>
      
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95">
          {filteredAirports.length > 0 ? filteredAirports.map(item => (
            <div 
              key={item.code} 
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
              onClick={() => {
                onChange(item.code);
                setSearch(`${item.fa} (${item.code})`);
                setIsOpen(false);
              }}
            >
              <div>
                <div className="font-bold text-gray-800 text-sm">{item.fa} <span className="text-xs text-gray-500 font-normal">({item.city})</span></div>
                <div className="text-[10px] text-gray-400">{item.country}</div>
              </div>
              <span className="font-mono font-black text-[#058B8C] bg-blue-50 px-2 py-1 rounded text-xs">{item.code}</span>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-400 text-xs">موردی یافت نشد</div>
          )}
        </div>
      )}
    </div>
  );
};

// --- کامپوننت تقویم اصلاح شده ---
const GoogleCalendar = ({ onSelect, onClose, selectedDate, lang }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date(); today.setHours(0, 0, 0, 0);
  
  const months = lang === 'dr' 
    ? ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"] 
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = lang === 'dr' ? ["ش", "ی", "د", "س", "چ", "پ", "ج"] : ["S", "M", "T", "W", "T", "F", "S"];
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year, month) => new Date(year, month, 1).getDay();
  const changeMonth = (offset) => { const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1); setViewDate(newDate); };
  
  const renderMonth = (offset) => {
    const currentView = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    const year = currentView.getFullYear();
    const month = currentView.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);
    
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="flex-1 px-4">
        <div className="font-bold text-center mb-4 text-gray-700">{months[month]} {year}</div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((d, i) => <span key={i} className="text-xs text-gray-400 font-bold">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {blanks.map((_, i) => <div key={`blank-${offset}-${i}`} />)}
          {days.map(d => {
            const thisDayDate = new Date(year, month, d);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const isPast = thisDayDate < today;
            return (
              <button 
                key={d} type="button" disabled={isPast}
                onClick={(e) => { e.stopPropagation(); if (!isPast) onSelect(dateStr); }}
                className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs transition-all ${isSelected ? 'bg-[#058B8C] text-white shadow-md' : ''} ${!isSelected && !isPast ? 'hover:bg-blue-50 text-gray-700' : ''} ${isPast ? 'text-gray-300' : ''}`}
              >
                <span className={`font-bold ${isPast ? 'line-through decoration-gray-300' : ''}`}>{d}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 w-[650px] animate-in fade-in zoom-in-95 hidden md:block cursor-default" onClick={(e) => e.stopPropagation()}>
       <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
       </div>
       <div className="flex divide-x divide-gray-100 divide-x-reverse">{renderMonth(0)}{renderMonth(1)}</div>
       <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-lg">انصراف</button>
       </div>
    </div>
  );
};

const TopFilterBtn = ({ label, active, onClick, icon: Icon }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all relative ${active ? 'bg-white text-[#1e3a8a] border border-gray-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}> {Icon && <Icon size={16}/>} {label} <ChevronDown size={14} className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}/> </button>
);

export default function Tickets({ t, setPage, lang, initialData, onBookSuccess }) {
  const [searchState, setSearchState] = useState('idle');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  // استیت‌های مودال
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [bookedOrder, setBookedOrder] = useState(null);

  const txt = translations[lang] || translations.dr; 
  const lt = { search: lang==='dr'?'جستجوی پرواز':'لټون', select_date: lang==='dr'?'تاریخ رفت':'نیټه', return_date: lang==='dr'?'تاریخ برگشت':'راستنیدو نیټه' };
  
  // تغییر: مقادیر پیش‌فرض خالی شد و tripType شد one_way
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '', tripType: 'one_way', flightClass: 'economy', adults: 1, children: 0 });
  const [results, setResults] = useState([]);

  useEffect(() => {
    // تغییر: فقط اگر initialData وجود داشت جستجو کن، در غیر این صورت هیچ کاری نکن
    if (initialData) {
      setFormData(initialData);
      performSearch(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (data) => {
    setSearchState('loading');
    setResults([]);

    try {
        const { data: resData, error } = await supabase.functions.invoke('search-flights', {
            body: { 
                origin: data.origin.toUpperCase(), 
                destination: data.destination.toUpperCase() 
            }
        });

        if (error) throw error;
        
        if (resData.flights && resData.flights.length > 0) {
            setResults(resData.flights);
            setSearchState('results');
        } else {
            setSearchState('empty');
        }

    } catch (err) {
        console.error("Search Error:", err);
        setSearchState('empty');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(!formData.origin || !formData.destination) {
        alert(lang === 'dr' ? "لطفا مبدا و مقصد را انتخاب کنید" : "مهربانی وکړئ مبدا او مقصد وټاکئ");
        return;
    }
    performSearch(formData);
  };

  const openInfoModal = (flight) => {
    setSelectedFlight(flight);
    setCustomerInfo({ name: '', phone: '' });
  };

  const handleSubmitBooking = async (e) => {
     e.preventDefault();
     if(!customerInfo.name || !customerInfo.phone) {
         alert(txt.errorEmpty);
         return;
     }
     
     setBookingLoading(true);
     
     const { data, error } = await supabase.from('bookings').insert([{ 
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        flight_info: selectedFlight, 
        status: 'pending_payment',
        amount: selectedFlight.price * 70 
     }]).select();

     setBookingLoading(false);

     if (error) {
       console.error("Error booking:", error);
       alert(`${txt.errorBooking}`);
     } else {
       if (data && data.length > 0) {
           const newOrder = data[0];
           setBookedOrder({
               id: newOrder.id,
               amount: newOrder.amount
           });
           setSelectedFlight(null);
       }
     }
  };

  return (
    <div className="space-y-8 animate-in fade-in font-[Vazirmatn]">
       
       {/* --- مودال‌ها (بدون تغییر) --- */}
       {selectedFlight && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setSelectedFlight(null)} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
                <h3 className="text-xl font-black text-gray-800 mb-1">{txt.modalInfoTitle}</h3>
                <p className="text-sm text-gray-500 mb-6">{txt.modalInfoDesc}</p>
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{txt.labelName}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-3">
                            <User size={18} className="text-gray-400"/>
                            <input autoFocus value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold" placeholder={txt.placeName}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{txt.labelPhone}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-3">
                            <Phone size={18} className="text-gray-400"/>
                            <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold text-left dir-ltr" placeholder={txt.placePhone}/>
                        </div>
                    </div>
                    <button type="submit" disabled={bookingLoading} className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-200">
                        {bookingLoading ? txt.btnLoading : txt.btnSubmit}
                    </button>
                </form>
            </div>
         </div>
       )}

       {bookedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setBookedOrder(null)} className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><Check size={40}/></div>
                    <h3 className="text-2xl font-black text-gray-800">{txt.modalSuccessTitle}</h3>
                    <p className="text-gray-500 mt-2 text-sm">{txt.labelOrderId}: <span className="font-mono bg-gray-100 px-2 rounded mx-1 font-bold">{String(bookedOrder.id).slice(0,8)}</span></p>
                    <p className="text-gray-600 mt-4 text-sm">{txt.modalPayDesc}</p>
                </div>
                <PaymentModal lang={lang} amount={bookedOrder.amount} orderId={bookedOrder.id} onClose={() => setBookedOrder(null)} onSuccess={() => { alert(txt.paySuccessMsg); setBookedOrder(null); if(onBookSuccess) onBookSuccess(); }}/>
            </div>
         </div>
       )}

       {/* --- نوار جستجوی پیشرفته (اصلاح شده) --- */}
       <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-6 relative z-30" ref={dropdownRef}>
          <div className="flex flex-wrap items-center gap-3 relative z-50">
             
             {/* 1. نوع سفر */}
             <div className="relative">
                <TopFilterBtn label={txt[formData.tripType]} icon={ArrowRightLeft} active={activeDropdown === 'type'} onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')} />
                {activeDropdown === 'type' && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 z-50">
                    {['round_trip', 'one_way'].map(k => (
                      <button key={k} onClick={() => {setFormData({...formData, tripType: k}); setActiveDropdown(null)}} className="w-full text-right px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between">
                        {txt[k]} {formData.tripType === k && <Check size={16} className="text-[#1e3a8a]"/>}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* 2. تعداد مسافر (اضافه شده) */}
             <div className="relative">
                  <TopFilterBtn label={`${formData.adults + formData.children} ${txt.passenger}`} icon={Users} active={activeDropdown === 'pax'} onClick={() => setActiveDropdown(activeDropdown === 'pax' ? null : 'pax')} />
                  {activeDropdown === 'pax' && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 animate-in zoom-in-95 cursor-default z-50">
                       {['adults', 'children'].map(k => (
                         <div key={k} className="flex justify-between items-center mb-4 last:mb-0">
                           <span className="font-bold text-gray-700">{txt[k]}</span>
                           <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                             <button onClick={() => setFormData(p => ({...p, [k]: Math.max(0, p[k]-1)}))} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-gray-600 hover:text-red-500"><Minus size={14}/></button>
                             <span className="w-4 text-center font-bold text-sm">{formData[k]}</span>
                             <button onClick={() => setFormData(p => ({...p, [k]: p[k]+1}))} className="w-8 h-8 flex items-center justify-center bg-[#058B8C] text-white rounded shadow"><Plus size={14}/></button>
                           </div>
                         </div>
                       ))}
                       <button onClick={() => setActiveDropdown(null)} className="w-full mt-2 py-2 text-[#058B8C] font-black text-sm hover:bg-blue-50 rounded-lg">{txt.confirm}</button>
                    </div>
                  )}
             </div>

             {/* 3. کلاس پرواز (اضافه شده) */}
             <div className="relative">
                  <TopFilterBtn label={txt[formData.flightClass]} icon={Plane} active={activeDropdown === 'class'} onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')} />
                  {activeDropdown === 'class' && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 z-50">
                      {['economy', 'business', 'first'].map(k => (
                         <button key={k} onClick={() => {setFormData({...formData, flightClass: k}); setActiveDropdown(null)}} className="w-full text-right px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between">{txt[k]}</button>
                      ))}
                    </div>
                  )}
             </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-[1.5rem] p-2 flex flex-col lg:flex-row shadow-sm divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gray-100 relative z-30">
             {/* مبدا (هوشمند) */}
             <div className="flex-1">
                <AirportSearch icon={Plane} value={formData.origin} onChange={(val)=>setFormData({...formData, origin: val})} placeholder={txt.originLabel} />
             </div>
             
             {/* مقصد (هوشمند) */}
             <div className="flex-1">
                <AirportSearch icon={MapPin} value={formData.destination} onChange={(val)=>setFormData({...formData, destination: val})} placeholder={txt.destLabel} />
             </div>

             {/* تاریخ رفت */}
             <div className="flex-1 relative border-r border-gray-100">
                <div onClick={()=>setActiveDropdown(activeDropdown==='date'?null:'date')} className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                   <Calendar size={20} className="text-gray-400"/>
                   <span className={`text-sm font-black ${formData.date?'text-gray-800':'text-gray-300'}`}>{formData.date || lt.select_date}</span>
                </div>
                {activeDropdown==='date' && <GoogleCalendar lang={lang} selectedDate={formData.date} onSelect={(d)=>{setFormData({...formData, date:d});setActiveDropdown(null)}} onClose={()=>setActiveDropdown(null)} />}
             </div>

             {/* تاریخ برگشت */}
             <div className="flex-1 relative border-r border-gray-100">
                <div onClick={()=>formData.tripType==='round_trip' && setActiveDropdown(activeDropdown==='date_ret'?null:'date_ret')} className={`flex items-center gap-3 px-4 py-3 cursor-pointer h-full ${formData.tripType==='round_trip'?'hover:bg-gray-50':'opacity-50 cursor-not-allowed bg-gray-50'}`}>
                   <Calendar size={20} className="text-gray-400"/>
                   <span className={`text-sm font-black ${formData.returnDate?'text-gray-800':'text-gray-300'}`}>{formData.returnDate || lt.return_date}</span>
                </div>
                {activeDropdown==='date_ret' && <GoogleCalendar lang={lang} selectedDate={formData.returnDate} onSelect={(d)=>{setFormData({...formData, returnDate:d});setActiveDropdown(null)}} onClose={()=>setActiveDropdown(null)} />}
             </div>

             {/* دکمه جستجو */}
             <div className="p-2">
                <button onClick={handleSearch} disabled={searchState==='loading'} className="w-full h-full bg-[#f97316] text-white rounded-xl font-bold px-8 py-3 flex items-center justify-center gap-2 transition disabled:opacity-70">
                   {searchState==='loading' ? <Loader2 className="animate-spin"/> : <><Search size={20}/> {lt.search}</>}
                </button>
             </div>
          </div>
       </div>

       {/* --- نتایج جستجو --- */}
       {searchState === 'results' && (
          <div className="space-y-4">
             {results.map(flight => (
                <div key={flight.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-[#1e3a8a] transition-all flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg">
                   <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                          <img src={`https://pics.avs.io/200/200/${flight.logo}.png`} alt={flight.airline} className="max-w-full max-h-full object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png'}/>
                      </div>
                      <div>
                         <div className="font-black text-xl" dir="ltr">{flight.dep} - {flight.arr}</div>
                         <div className="text-xs text-gray-500 font-bold">{flight.airline} | {flight.flightNo}</div>
                         <div className="text-[10px] text-gray-400 mt-1">{flight.duration}</div>
                      </div>
                   </div>
                   <div className="font-black text-2xl text-[#1e3a8a]">${flight.price}</div>
                   <button onClick={()=>openInfoModal(flight)} className="px-6 py-2 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-full font-bold hover:bg-[#1e3a8a] hover:text-white transition">
                     {txt.confirm}
                   </button>
                </div>
             ))}
          </div>
       )}
       {searchState === 'empty' && <div className="text-center text-gray-400 py-10">{txt.noResult}</div>}
       {searchState === 'loading' && <div className="text-center text-gray-500 py-20 flex flex-col items-center gap-4"><Loader2 size={40} className="animate-spin text-[#058B8C]"/><span>{txt.searching}</span></div>}
    </div>
  );
}