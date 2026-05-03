import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRightLeft, ChevronDown, User, Calendar, Plus, Minus, Check, Plane, Users, AlertTriangle, Hammer } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// --- وارد کردن کامپوننت‌های مشترک جدید ---
import AirportSearch from '../components/common/AirportSearch';
import SmartCalendar from '../components/common/SmartCalendar';

// --- ترجمه‌ها ---
const translations = {
  dr: {
    one_way: "یک طرفه", round_trip: "رفت و برگشت",
    economy: "اکونومی", business: "بیزنس", first: "فرست کلاس",
    adults: "بزرگسال", children: "کودک", passenger: "مسافر", confirm: "تایید",
    errorEmpty: "لطفا مبدا و مقصد را وارد کنید",
    originLabel: "مبدا (شهر یا فرودگاه)", destLabel: "مقصد (شهر یا فرودگاه)",
    select_date: "تاریخ رفت", return_date: "تاریخ برگشت", close: "بستن", today: "برو به امروز",
    coming_soon_title: "در حال بروزرسانی سیستم",
    coming_soon_desc: "سیستم هوشمند رزرو آنلاین بلیط پروازهای داخلی و خارجی در حال توسعه است و به زودی فعال خواهد شد. برای رزرو بلیط لطفاً با پشتیبانی تماس بگیرید."
  },
  ps: {
    one_way: "یو طرفه", round_trip: "تګ راتګ",
    economy: "اکونومي", business: "بیزنس", first: "لومړۍ درجه",
    adults: "لویان", children: "ماشومان", passenger: "مسافر", confirm: "تایید",
    errorEmpty: "مهرباني وکړئ مبدا او مقصد دننه کړئ",
    originLabel: "مبدا (ښار یا هوايي ډګر)", destLabel: "مقصد (ښار یا هوايي ډګر)",
    select_date: "د تګ نیټه", return_date: "د راستنیدو نیټه", close: "بندول", today: "نن ورځ",
    coming_soon_title: "سیسټم تازه کیږي",
    coming_soon_desc: "د کورنیو او بهرنیو الوتنو د آنلاین بکینګ هوښیار سیسټم د پراختیا په حال کې دی او ژر به فعال شي. د ټکټ بک کولو لپاره مهرباني وکړئ ملاتړ سره اړیکه ونیسئ."
  },
  en: {
    one_way: "One Way", round_trip: "Round Trip",
    economy: "Economy", business: "Business", first: "First Class",
    adults: "Adults", children: "Children", passenger: "Passenger", confirm: "Confirm",
    errorEmpty: "Please enter origin and destination.",
    originLabel: "Origin (City or Airport)", destLabel: "Destination (City or Airport)",
    select_date: "Depart Date", return_date: "Return Date", close: "Close", today: "Go to Today",
    coming_soon_title: "System Under Construction",
    coming_soon_desc: "Our smart online flight booking system is currently under development and will be active soon. Please contact support to book your tickets."
  }
};

const TopFilterBtn = ({ label, active, onClick, icon: Icon }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all relative ${active ? 'bg-white text-[#1e3a8a] border border-gray-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}> {Icon && <Icon size={16}/>} {label} <ChevronDown size={14} className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}/> </button>
);

export default function Tickets({ t, lang, initialData }) {
  const location = useLocation();
  
  const searchData = location.state?.initialData || initialData;
  const [searchState, setSearchState] = useState('idle'); // idle, coming_soon
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  const isLtr = lang === 'en';
  const txt = translations[lang] || translations.dr;
  const lt = { 
      search: lang==='en'?'Search':(lang==='dr'?'جستجوی پرواز':'لټون'), 
      select_date: lang==='en'?'Depart Date':(lang==='dr'?'تاریخ رفت':'نیټه'), 
      return_date: lang==='en'?'Return Date':(lang==='dr'?'تاریخ برگشت':'راستنیدو نیټه') 
  };
  
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '', tripType: 'one_way', flightClass: 'economy', adults: 1, children: 0 });

  useEffect(() => {
    if (searchData) {
      setFormData(searchData);
      setSearchState('coming_soon');
    }
  }, [searchData]);

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
    if(!formData.origin || !formData.destination) {
        alert(txt.errorEmpty);
        return;
    }
    // نمایش حالت "در دست ساخت" به جای جستجو در سرور
    setSearchState('coming_soon');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 pt-8 space-y-8 animate-in fade-in font-[Vazirmatn]" dir={isLtr ? 'ltr' : 'rtl'}>

       <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-6 relative z-30" ref={dropdownRef}>
          <div className="flex flex-wrap items-center gap-3 relative z-50">
             
             {/* نوع سفر */}
             <div className="relative">
                <TopFilterBtn label={txt[formData.tripType]} icon={ArrowRightLeft} active={activeDropdown === 'type'} onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')} />
                {activeDropdown === 'type' && (
                  <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 z-50 ${isLtr ? 'left-0' : 'right-0'}`}>
                    {['round_trip', 'one_way'].map(k => (
                      <button key={k} onClick={() => {setFormData({...formData, tripType: k}); setActiveDropdown(null)}} className={`w-full px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between ${isLtr ? 'text-left' : 'text-right'}`}>
                        {txt[k]} {formData.tripType === k && <Check size={16} className="text-[#1e3a8a]"/>}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* مسافران */}
             <div className="relative">
                  <TopFilterBtn label={`${formData.adults + formData.children} ${txt.passenger}`} icon={Users} active={activeDropdown === 'pax'} onClick={() => setActiveDropdown(activeDropdown === 'pax' ? null : 'pax')} />
                  {activeDropdown === 'pax' && (
                    <div className={`absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl p-4 animate-in zoom-in-95 cursor-default z-50 ${isLtr ? 'left-0' : 'right-0'}`}>
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

             {/* کلاس پروازی */}
             <div className="relative">
                  <TopFilterBtn label={txt[formData.flightClass]} icon={Plane} active={activeDropdown === 'class'} onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')} />
                  {activeDropdown === 'class' && (
                    <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 z-50 ${isLtr ? 'left-0' : 'right-0'}`}>
                      {['economy', 'business', 'first'].map(k => (
                        <button key={k} onClick={() => {setFormData({...formData, flightClass: k}); setActiveDropdown(null)}} className={`w-full px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between ${isLtr ? 'text-left' : 'text-right'}`}>{txt[k]}</button>
                      ))}
                    </div>
                  )}
             </div>
          </div>

          <div className={`bg-white rounded-[1.5rem] p-2 flex flex-col lg:flex-row items-stretch shadow-lg relative z-30 min-h-[80px] ${isLtr ? 'divide-y lg:divide-y-0 lg:divide-x divide-gray-100' : 'divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gray-100'}`}>
             
             <div className="flex-1 h-20 lg:h-auto">
                <AirportSearch lang={lang} icon={Plane} value={formData.origin} onChange={(val)=>setFormData({...formData, origin: val})} placeholder={txt.originLabel} />
             </div>
             
             <div className="relative h-0 lg:h-auto lg:w-0 z-40 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <button 
                        type="button" 
                        onClick={() => setFormData(p => ({...p, origin: p.destination, destination: p.origin}))} 
                        className="bg-white p-2.5 rounded-full text-gray-500 hover:bg-[#058B8C] hover:text-white transition shadow-md border border-gray-100 flex items-center justify-center"
                        style={{ width: '40px', height: '40px' }}
                      >
                         <ArrowRightLeft size={18} />
                      </button>
                </div>
             </div>

             <div className="flex-1 h-20 lg:h-auto">
                <AirportSearch lang={lang} icon={MapPin} value={formData.destination} onChange={(val)=>setFormData({...formData, destination: val})} placeholder={txt.destLabel} />
             </div>

             <div className={`flex-1 relative h-20 lg:h-auto ${isLtr ? 'border-l border-gray-100' : 'border-r border-gray-100'}`}>
                <div onClick={()=>setActiveDropdown(activeDropdown==='date'?null:'date')} className="flex items-center gap-3 px-4 py-3 cursor-pointer h-full hover:bg-gray-50 rounded-xl transition">
                   <Calendar size={20} className="text-gray-400"/>
                   <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold">{lt.select_date}</span>
                        <span className={`text-sm font-black ${formData.date?'text-gray-800':'text-gray-300'}`}>{formData.date || '---'}</span>
                   </div>
                </div>
                {activeDropdown==='date' && <SmartCalendar lang={lang} selectedDate={formData.date} onSelect={(d)=>{setFormData({...formData, date:d});setActiveDropdown(null)}} onClose={()=>setActiveDropdown(null)} />}
             </div>

             <div className={`flex-1 relative h-20 lg:h-auto ${isLtr ? 'border-l border-gray-100' : 'border-r border-gray-100'}`}>
                <div onClick={()=>formData.tripType==='round_trip' && setActiveDropdown(activeDropdown==='date_ret'?null:'date_ret')} className={`flex items-center gap-3 px-4 py-3 cursor-pointer h-full ${formData.tripType==='round_trip'?'hover:bg-gray-50 rounded-xl transition':'opacity-50 cursor-not-allowed bg-gray-50 rounded-xl'}`}>
                   <Calendar size={20} className="text-gray-400"/>
                   <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 font-bold">{lt.return_date}</span>
                        <span className={`text-sm font-black ${formData.returnDate?'text-gray-800':'text-gray-300'}`}>{formData.returnDate || (formData.tripType === 'round_trip' ? '---' : txt.one_way)}</span>
                   </div>
                </div>
                {activeDropdown==='date_ret' && <SmartCalendar lang={lang} selectedDate={formData.returnDate} onSelect={(d)=>{setFormData({...formData, returnDate:d});setActiveDropdown(null)}} onClose={()=>setActiveDropdown(null)} />}
             </div>

             <div className="p-2 lg:w-auto w-full h-20 lg:h-auto">
                 <button onClick={handleSearch} className="w-full lg:w-auto h-full min-w-[140px] bg-[#f97316] text-white rounded-xl font-bold px-8 py-3 flex items-center justify-center gap-2 transition hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-95 transform">
                   <Search size={20}/> {lt.search}
                </button>
             </div>
          </div>
       </div>

       {/* نمایش حالت در حال ساخت */}
       {searchState === 'coming_soon' && (
          <div className="bg-white rounded-3xl p-12 text-center border border-blue-100 shadow-sm animate-in slide-in-from-bottom-4">
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hammer size={40} className="text-blue-400 animate-pulse"/>
             </div>
             <h2 className="text-2xl font-black text-gray-800 mb-3">{txt.coming_soon_title}</h2>
             <p className="text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
                 {txt.coming_soon_desc}
             </p>
          </div>
       )}

       <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8 relative overflow-hidden mt-8">
          <div className="absolute -top-6 -left-6 opacity-5 rotate-12">
             <AlertTriangle size={150} className="text-[#f97316]"/>
          </div>

          <div className="relative z-10">
             <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3 border-b border-orange-200 pb-4">
                <div className="bg-orange-100 p-2 rounded-lg text-[#f97316]">
                    <AlertTriangle size={24}/>
                </div>
                <div>
                   <div className="text-base">{lang === 'en' ? "Important Pre-Flight Notes" : "تذکرات مهم قبل از پرواز"}</div>
                   <div className="text-xs text-gray-500 font-normal mt-1">{lang === 'en' ? "Essential information for your journey" : "د الوتنې دمخه مهم یادداشتونه"}</div>
                </div>
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lang === 'en' ? (
                   <>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                           <p className="text-sm text-gray-600 leading-relaxed text-left">
                              <span className="font-bold text-gray-800 block mb-1">Passport Validity:</span>
                              Ensure your passport is valid for at least <span className="text-red-500 font-bold">6 months</span>.
                           </p>
                        </div>
                        <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                           <p className="text-sm text-gray-600 leading-relaxed text-left">
                               <span className="font-bold text-gray-800 block mb-1">Visa & Documents:</span>
                               The passenger is responsible for verifying visa validity and travel documents.
                           </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                           <p className="text-sm text-gray-600 leading-relaxed text-left">
                               <span className="font-bold text-gray-800 block mb-1">Check-in Time:</span>
                               Please arrive at the airport 3 hours before international flights and 2 hours before domestic flights.
                           </p>
                        </div>
                    </div>
                   </>
                ) : (
                   <>
                    <div className="space-y-4">
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                             <span className="font-bold text-gray-800 block mb-1">اعتبار پاسپورت:</span>
                             اطمینان حاصل کنید که پاسپورت شما حداقل <span className="text-red-500 font-bold">۶ ماه</span> اعتبار دارد.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">ویزا و مدارک:</span>
                              مسئولیت کنترل ویزا و صحت مدارک به عهده مسافر می‌باشد.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">زمان حضور:</span>
                             برای پروازهای خارجی ۳ ساعت و داخلی ۲ ساعت قبل از پرواز در فرودگاه حاضر باشید.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4 text-right" dir="rtl">
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">د پاسپورټ اعتبار:</span>
                               ډاډ ترلاسه کړئ چې ستاسو پاسپورټ لږترلږه <span className="text-red-500 font-bold">۶ میاشتې</span> اعتبار لري.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">ویزه او اسناد:</span>
                             د ویزې او اسنادو د سموالي مسؤلیت د مسافر په غاړه دی.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">د شتون وخت:</span>
                             د بهرنیو الوتنو لپاره ۳ ساعته او د کورنیو لپاره ۲ ساعته مخکې په هوایی ډګر کې حاضر اوسئ.
                          </p>
                       </div>
                    </div>
                   </>
                )}
             </div>
          </div>
       </div>

    </div>
  );
}