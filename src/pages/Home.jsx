import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRightLeft, ChevronDown, User, Calendar, Plus, Minus, Check, ShieldCheck, Clock, Globe, Plane, FileText, Hotel, Package, CreditCard, GraduationCap, Users, CheckCircle, Briefcase, Megaphone, Pin, X } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import WeatherBlock from '../components/WeatherBlock';

// لیست فرودگاه‌ها برای جستجوی هوشمند
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

const ICON_MAP = {
  'Plane': Plane, 'FileText': FileText, 'Package': Package, 'CreditCard': CreditCard,
  'GraduationCap': GraduationCap, 'ShieldCheck': ShieldCheck, 'Hotel': Hotel, 'Clock': Clock, 'Globe': Globe
};

const searchT = {
  dr: { one_way: "یک طرفه", round_trip: "رفت و برگشت", economy: "اکونومی", business: "بیزنس", first: "فرست کلاس", adults: "بزرگسال", children: "کودک", passenger: "مسافر", confirm: "تایید" },
  ps: { one_way: "یو طرفه", round_trip: "تګ راتګ", economy: "اکونومي", business: "بیزنس", first: "لومړۍ درجه", adults: "لویان", children: "ماشومان", passenger: "مسافر", confirm: "تایید" }
};

// --- کامپوننت جستجوی فرودگاه ---
const AirportSearch = ({ value, onChange, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  // پیدا کردن نام شهر بر اساس کد ذخیره شده
  useEffect(() => {
    const found = AIRPORTS.find(a => a.code === value);
    if (found) setSearch(`${found.fa} (${found.code})`);
    else if (!value) setSearch('');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // اگر کدی انتخاب نشده، متن را ریست کن
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
    const firstDay = getFirstDay(year, month); // 0 = Sunday
    
    // تنظیم بلنک‌ها برای شروع هفته
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
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all relative ${active ? 'bg-white text-[#058B8C] border border-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
    {Icon && <Icon size={16}/>} {label} <ChevronDown size={14} className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}/>
  </button>
);

export default function Home({ t, setPage, lang, onSearch, newsData, settings }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [stats, setStats] = useState({ customers: 0, flights: 0, visas: 0, experience: 0 });
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '', tripType: 'one_way', flightClass: 'economy', adults: 1, children: 0 });
  const st = searchT[lang] || searchT.dr;
  
  const lt = {
    search: lang === 'dr' ? 'جستجوی پرواز' : 'د الوتنې لټون',
    select_date: lang === 'dr' ? "تاریخ رفت" : "نیټه وټاکئ",
    return_date: lang === 'dr' ? "تاریخ برگشت" : "راستنیدو نیټه",
    services_title: lang === 'dr' ? "خدمات ما" : "زموږ خدمتونه",
    news_title: lang === 'dr' ? "اخبار و اعلامیه‌ها" : "خبرونه او خبرتیاوې",
    stat_customers: lang === 'dr' ? "مشتریان راضی" : "راضی پیرودونکي",
    stat_flights: lang === 'dr' ? "پرواز موفق" : "بریالۍ الوتنې",
    stat_visas: lang === 'dr' ? "ویزای صادر شده" : "صادر شوي ویزې",
    stat_experience: lang === 'dr' ? "سال تجربه" : "کال تجربه"
  };

  useEffect(() => {
    const targets = settings?.stats || { customers: 0, flights: 0, visas: 0, experience: 0 };
    const duration = 2500; 
    const interval = 20; 
    const steps = duration / interval;
    const increments = { customers: targets.customers/steps, flights: targets.flights/steps, visas: targets.visas/steps, experience: targets.experience/steps };

    const timer = setInterval(() => {
      setStats(prev => {
        const next = {
          customers: Math.min(prev.customers + increments.customers, targets.customers),
          flights: Math.min(prev.flights + increments.flights, targets.flights),
          visas: Math.min(prev.visas + increments.visas, targets.visas),
          experience: Math.min(prev.experience + increments.experience, targets.experience),
        };
        if (next.customers >= targets.customers) clearInterval(timer);
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [settings.stats]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) {
       alert(lang === 'dr' ? "لطفا مبدا و مقصد را وارد کنید" : "مهربانی وکړئ مبدا او مقصد دننه کړئ");
       return;
    }
    if (onSearch) onSearch(formData);
  };

  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-20 font-[Vazirmatn]">
      
      {/* 1. Hero Section + Search Bar (ثابت) */}
      <div className="relative">
        <div className="h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-xl relative z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#058B8C]/90 via-transparent to-transparent z-10" />
          <img src={settings.hero.image} className="w-full h-full object-cover" alt="Travel" />
          <div className="absolute top-1/3 right-10 z-20 text-white max-w-2xl">
             <h2 className="text-5xl font-black mb-4 drop-shadow-lg leading-tight">{settings.hero.title}</h2>
             <p className="text-xl font-medium drop-shadow-md opacity-90">{settings.hero.subtitle}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 relative z-30 -mt-24">
          <div className="bg-[#058B8C] p-6 rounded-[2rem] shadow-2xl border border-white/10 space-y-6" ref={dropdownRef}>
            
            {/* دکمه‌های فیلتر بالای سرچ */}
            <div className="flex flex-wrap items-center gap-3 relative z-50">
               
               {/* نوع سفر */}
               <div className="relative">
                  <TopFilterBtn label={st[formData.tripType]} icon={ArrowRightLeft} active={activeDropdown === 'type'} onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')} />
                  {activeDropdown === 'type' && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95">
                      {['round_trip', 'one_way'].map(k => (
                        <button key={k} onClick={() => {setFormData({...formData, tripType: k}); setActiveDropdown(null)}} className="w-full text-right px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between">
                            {st[k]} {formData.tripType === k && <Check size={16} className="text-[#058B8C]"/>}
                        </button>
                      ))}
                    </div>
                  )}
               </div>
               
               {/* تعداد مسافر */}
               <div className="relative">
                  <TopFilterBtn label={`${formData.adults + formData.children} ${st.passenger}`} icon={Users} active={activeDropdown === 'pax'} onClick={() => setActiveDropdown(activeDropdown === 'pax' ? null : 'pax')} />
                  {activeDropdown === 'pax' && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 animate-in zoom-in-95 cursor-default">
                       {['adults', 'children'].map(k => (
                          <div key={k} className="flex justify-between items-center mb-4 last:mb-0">
                           <span className="font-bold text-gray-700">{st[k]}</span>
                           <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                              <button onClick={() => setFormData(p => ({...p, [k]: Math.max(0, p[k]-1)}))} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-gray-600 hover:text-red-500"><Minus size={14}/></button>
                             <span className="w-4 text-center font-bold text-sm">{formData[k]}</span>
                             <button onClick={() => setFormData(p => ({...p, [k]: p[k]+1}))} className="w-8 h-8 flex items-center justify-center bg-[#058B8C] text-white rounded shadow"><Plus size={14}/></button>
                           </div>
                         </div>
                       ))}
                       <button onClick={() => setActiveDropdown(null)} className="w-full mt-2 py-2 text-[#058B8C] font-black text-sm hover:bg-blue-50 rounded-lg">{st.confirm}</button>
                    </div>
                  )}
               </div>

               {/* کلاس پرواز */}
               <div className="relative">
                  <TopFilterBtn label={st[formData.flightClass]} icon={Plane} active={activeDropdown === 'class'} onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')} />
                  {activeDropdown === 'class' && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95">
                      {['economy', 'business', 'first'].map(k => (
                         <button key={k} onClick={() => {setFormData({...formData, flightClass: k}); setActiveDropdown(null)}} className="w-full text-right px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between">{st[k]}</button>
                      ))}
                    </div>
                  )}
               </div>
            </div>

            {/* فرم اصلی جستجو */}
            <div className="bg-white rounded-[1.5rem] p-2 flex flex-col lg:flex-row shadow-lg divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gray-100 relative z-30">
               {/* مبدا */}
               <div className="flex-1">
                  <AirportSearch icon={Plane} value={formData.origin} onChange={(val)=>setFormData({...formData, origin: val})} placeholder={lang==='dr'?"مبدا (شهر یا فرودگاه)":"له کوم ځای؟"} />
               </div>
               
               {/* دکمه جابجایی */}
               <div className="flex items-center justify-center -my-3 lg:my-0 lg:-mx-3 z-10">
                 <button type="button" onClick={() => setFormData(p => ({...p, origin: p.destination, destination: p.origin}))} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-[#058B8C] hover:text-white transition shadow-sm border border-white"><ArrowRightLeft size={16} /></button>
               </div>
               
               {/* مقصد */}
               <div className="flex-1">
                  <AirportSearch icon={MapPin} value={formData.destination} onChange={(val)=>setFormData({...formData, destination: val})} placeholder={lang==='dr'?"مقصد (شهر یا فرودگاه)":"چیرته؟"} />
               </div>
               
               {/* تاریخ رفت */}
               <div className="flex-1 relative border-r border-gray-100">
                  <div onClick={() => setActiveDropdown(activeDropdown === 'date_dep' ? null : 'date_dep')} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group h-full">
                     <Calendar size={20} className="text-gray-400 group-hover:text-[#058B8C]"/>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold">{lt.select_date}</span>
                        <span className={`text-sm font-black ${formData.date ? 'text-gray-800' : 'text-gray-300'}`}>{formData.date || '---'}</span>
                     </div>
                  </div>
                  {activeDropdown === 'date_dep' && <GoogleCalendar lang={lang} selectedDate={formData.date} onSelect={(d) => { setFormData({...formData, date: d}); setActiveDropdown(null); }} onClose={() => setActiveDropdown(null)} />}
               </div>
               
               {/* تاریخ برگشت */}
               <div className="flex-1 relative border-r border-gray-100">
                  <div 
                    onClick={() => formData.tripType === 'round_trip' && setActiveDropdown(activeDropdown === 'date_ret' ? null : 'date_ret')} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition h-full ${formData.tripType === 'round_trip' ? 'hover:bg-gray-50 cursor-pointer group' : 'bg-gray-50 opacity-50 cursor-not-allowed'}`}
                  >
                     <Calendar size={20} className="text-gray-400 group-hover:text-[#058B8C]"/>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold">{lt.return_date}</span>
                        <span className={`text-sm font-black ${formData.returnDate ? 'text-gray-800' : 'text-gray-300'}`}>
                          {formData.tripType === 'round_trip' ? (formData.returnDate || '---') : st.one_way}
                        </span>
                     </div>
                  </div>
                  {activeDropdown === 'date_ret' && <GoogleCalendar lang={lang} selectedDate={formData.returnDate} onSelect={(d) => { setFormData({...formData, returnDate: d}); setActiveDropdown(null); }} onClose={() => setActiveDropdown(null)} />}
               </div>
               
               {/* دکمه جستجو */}
               <div className="p-2">
                 <button onClick={handleSearch} className="w-full lg:w-auto h-full min-w-[140px] bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all transform active:scale-95 py-3 lg:py-0">
                    {lt.search}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. اخبار و اطلاعیه‌ها (جابجا شده به بالا) */}
      <div className="max-w-7xl mx-auto px-4 py-10">
         <h2 className="text-3xl font-black text-center text-[#058B8C] mb-12 relative">
            {lt.news_title}
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#D4AF37] rounded-full"></span>
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {newsData && newsData.filter(n => n.pinned).concat(newsData.filter(n => !n.pinned)).slice(0, 5).map((news) => (
               <div key={news.id} onClick={() => setPage('news')} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative">
                  {news.pinned && <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm z-10"><Pin size={12} fill="white"/></div>}
                  <div className="h-32 overflow-hidden">
                     <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                     <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                        <Megaphone size={14} />
                        <span className="text-[10px] font-bold bg-yellow-50 px-2 py-0.5 rounded-full">اطلاعیه</span>
                     </div>
                     <h3 className="font-black text-gray-800 text-sm mb-2 line-clamp-1">{news.title}</h3>
                     <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{news.description}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 3. خدمات ما (جابجا شده) */}
      <div className="max-w-7xl mx-auto px-4 py-10">
         <h2 className="text-3xl font-black text-center text-[#058B8C] mb-12 relative">
            {lt.services_title}
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#D4AF37] rounded-full"></span>
         </h2>
         <div className="flex flex-wrap justify-center gap-6">
            {settings.services && settings.services.map((srv, index) => {
               const IconComponent = ICON_MAP[srv.icon] || FileText;
               const colorClasses = {
                  blue: 'bg-blue-50 text-[#058B8C] group-hover:bg-[#058B8C] group-hover:text-white',
                  orange: 'bg-orange-50 text-[#f97316] group-hover:bg-[#f97316] group-hover:text-white',
                  green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
                  purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
                  teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
               };
               const activeColor = colorClasses[srv.color] || colorClasses.blue;

               return (
                  <div key={index} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[calc(20%-1.5rem)] bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer text-center">
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${activeColor.split(' group')[0]} ${activeColor.split(' ').slice(2).join(' ')}`}>
                        <IconComponent size={32} />
                     </div>
                     <h3 className="text-lg font-black text-gray-800 mb-2">{srv.title}</h3>
                     <p className="text-gray-500 text-xs leading-relaxed">{srv.desc}</p>
                  </div>
               );
            })}
         </div>
      </div>

      {/* 4. آمار (جابجا شده) */}
      <div className="bg-[#058B8C] py-10 text-white relative overflow-hidden my-10 rounded-[2rem] mx-4 shadow-xl">
         <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-x-reverse divide-white/10">
               <div className="space-y-2 group">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                     <Users size={24} className="text-[#D4AF37]"/>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white" dir="ltr">+{Math.floor(stats.customers)}</div>
                     <div className="text-xs font-bold text-gray-200">{lt.stat_customers}</div>
                  </div>
               </div>
               <div className="space-y-2 group">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                     <Plane size={24} className="text-[#D4AF37]"/>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white" dir="ltr">+{Math.floor(stats.flights)}</div>
                     <div className="text-xs font-bold text-gray-200">{lt.stat_flights}</div>
                  </div>
               </div>
               <div className="space-y-2 group">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                     <CheckCircle size={24} className="text-[#D4AF37]"/>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white" dir="ltr">+{Math.floor(stats.visas)}</div>
                     <div className="text-xs font-bold text-gray-200">{lt.stat_visas}</div>
                  </div>
               </div>
               <div className="space-y-2 group">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                     <Briefcase size={24} className="text-[#D4AF37]"/>
                  </div>
                  <div>
                     <div className="text-3xl font-black text-white" dir="ltr">+{Math.floor(stats.experience)}</div>
                     <div className="text-xs font-bold text-gray-200">{lt.stat_experience}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 5. آب و هوا (جابجا شده به پایین آمار) */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
         <WeatherBlock cities={settings?.weather_cities} lang={lang} />
      </div>

      {/* 6. ویژگی‌های شرکت (سه کارت) */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-10">
          <ServiceCard icon={ShieldCheck} title={lang === 'dr' ? "امنیت و اعتماد" : "امنیت او باور"} desc={t.home.why_desc} color='#058B8C' />
          <ServiceCard icon={Clock} title={lang === 'dr' ? "سرعت در اجرا" : "په کار کې چټکتیا"} desc={t.home.why_desc} color='#f97316' />
          <ServiceCard icon={Globe} title={lang === 'dr' ? "پوشش جهانی" : "نړیوال پوښښ"} desc={t.home.why_desc} color='#058B8C' />
      </div>
    </div>
  );
}