import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRightLeft, ChevronDown, User, Calendar, Plus, Minus, Check, Plane, ChevronLeft, ChevronRight, X, Phone, Loader2, Users, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PaymentModal from '../components/PaymentModal';
import { useLocation } from 'react-router-dom';

// --- وارد کردن کامپوننت‌های مشترک جدید ---
import AirportSearch from '../components/common/AirportSearch';
import SmartCalendar from '../components/common/SmartCalendar';

// --- ترجمه‌ها ---
const translations = {
  dr: {
    one_way: "یک طرفه", round_trip: "رفت و برگشت",
    economy: "اکونومی", business: "بیزنس", first: "فرست کلاس",
    adults: "بزرگسال", children: "کودک", passenger: "مسافر", confirm: "تایید و رزرو",
    modalInfoTitle: "اطلاعات مسافر",
    modalInfoDesc: "برای رزرو پرواز، لطفاً مشخصات زیر را وارد کنید.",
    labelName: "نام و نام خانوادگی مسافر", labelPhone: "شماره تماس",
    placeName: "مثلا: احمد محمدی", placePhone: "0799...",
    btnSubmit: "ثبت و ادامه جهت پرداخت", btnLoading: "در حال ثبت...",
    modalSuccessTitle: "رزرو اولیه انجام شد!", labelOrderId: "شماره سفارش",
    modalPayDesc: "برای نهایی کردن بلیط، لطفاً پرداخت را انجام دهید.",
    paySuccessMsg: "پرداخت با موفقیت انجام شد و بلیط صادر گردید!",
    errorEmpty: "لطفا نام و شماره تماس را وارد کنید",
    errorBooking: "خطا در ثبت رزرو. لطفا دوباره تلاش کنید.",
    searching: "در حال جستجو در ایرلاین‌ها و دیتابیس...",
    noResult: "پروازی در این تاریخ و مسیر یافت نشد. لطفاً روز دیگری را امتحان کنید.",
    originLabel: "مبدا (شهر یا فرودگاه)", destLabel: "مقصد (شهر یا فرودگاه)",
    select_date: "تاریخ رفت", return_date: "تاریخ برگشت", close: "بستن", today: "برو به امروز"
  },
  ps: {
    one_way: "یو طرفه", round_trip: "تګ راتګ",
    economy: "اکونومي", business: "بیزنس", first: "لومړۍ درجه",
    adults: "لویان", children: "ماشومان", passenger: "مسافر", confirm: "تایید",
    modalInfoTitle: "د مسافر معلومات", modalInfoDesc: "د الوتنې د ثبت لپاره، مهرباني وکړئ لاندې مشخصات دننه کړئ.",
    labelName: "بشپړ نوم", labelPhone: "د اړیکې شمېره",
    placeName: "مثلا: احمد محمدي", placePhone: "0799...",
    btnSubmit: "ثبت او د تادیې لپاره دوام", btnLoading: "د ثبت په حال کې...",
    modalSuccessTitle: "لومړنی ثبت ترسره شو!", labelOrderId: "د سپارښتنې شمېره",
    modalPayDesc: "د ټکټ نهایي کولو لپاره، مهرباني وکړئ تادیه ترسره کړئ.",
    paySuccessMsg: "تادیه په بریالیتوب سره ترسره شوه!",
    errorEmpty: "مهرباني وکړئ نوم او د اړیکې شمېره دننه کړئ",
    errorBooking: "د ثبت پرمهال ستونزه. مهرباني وکړئ بیا هڅه وکړئ.",
    searching: "د الوتنو پلټنه...", noResult: "هیڅ الوتنه ونه موندل شوه.",
    originLabel: "مبدا (ښار یا هوايي ډګر)", destLabel: "مقصد (ښار یا هوايي ډګر)",
    select_date: "د تګ نیټه", return_date: "د راستنیدو نیټه", close: "بندول", today: "نن ورځ"
  },
  en: {
    one_way: "One Way", round_trip: "Round Trip",
    economy: "Economy", business: "Business", first: "First Class",
    adults: "Adults", children: "Children", passenger: "Passenger", confirm: "Book Now",
    modalInfoTitle: "Passenger Info", modalInfoDesc: "Please enter your details to book the flight.",
    labelName: "Full Name", labelPhone: "Phone Number",
    placeName: "Ex: John Doe", placePhone: "+93...",
    btnSubmit: "Register & Pay", btnLoading: "Registering...",
    modalSuccessTitle: "Booking Initiated!", labelOrderId: "Order ID",
    modalPayDesc: "Please proceed with payment to finalize your ticket.",
    paySuccessMsg: "Payment successful! Ticket has been issued.",
    errorEmpty: "Please enter your name and phone number.",
    errorBooking: "Booking failed. Please try again.",
    searching: "Searching airlines...", noResult: "No flights found. Please try another route.",
    originLabel: "Origin (City or Airport)", destLabel: "Destination (City or Airport)",
    select_date: "Depart Date", return_date: "Return Date", close: "Close", today: "Go to Today"
  }
};

const TopFilterBtn = ({ label, active, onClick, icon: Icon }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all relative ${active ? 'bg-white text-[#1e3a8a] border border-gray-200 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}> 
    {Icon && <Icon size={16}/>} {label} 
    <ChevronDown size={14} className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}/> 
  </button>
);

export default function Tickets({ t, setPage, lang, initialData, onBookSuccess }) {
  const location = useLocation();
  const searchData = location.state?.initialData || initialData;
  const [searchState, setSearchState] = useState('idle');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [bookedOrder, setBookedOrder] = useState(null);
  const isLtr = lang === 'en';

  const txt = translations[lang] || translations.dr;
  const lt = { 
      search: lang==='en'?'Search':(lang==='dr'?'جستجوی پرواز':'لټون'), 
      select_date: lang==='en'?'Depart Date':(lang==='dr'?'تاریخ رفت':'نیټه'), 
      return_date: lang==='en'?'Return Date':(lang==='dr'?'تاریخ برگشت':'راستنیدو نیټه') 
  };
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '', tripType: 'one_way', flightClass: 'economy', adults: 1, children: 0 });
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchData && searchData.origin && searchData.destination) {
      setFormData(searchData);
      performSearch(searchData);
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

  // تابع هوشمند برای استخراج کدهای IATA (مثلا KBL) از متن انتخاب شده
  const extractIATA = (text) => {
    if (!text) return '';
    // ابتدا به دنبال ۳ حرف داخل پرانتز می‌گردد
    const exactMatch = text.match(/\(([A-Za-z]{3})\)/);
    if (exactMatch) return exactMatch[1].toUpperCase();
    
    // در غیر این صورت به دنبال ۳ حرف انگلیسی پشت سر هم می‌گردد
    const wordMatch = text.match(/\b([A-Za-z]{3})\b/);
    if (wordMatch) return wordMatch[1].toUpperCase();
    
    return text.trim().toUpperCase();
  };

  const performSearch = async (data) => {
    setSearchState('loading');
    setResults([]);
    try {
        const originCode = extractIATA(data.origin);
        const destCode = extractIATA(data.destination);

        const { data: resData, error } = await supabase.functions.invoke('search-flights', {
            body: { 
                origin: originCode, 
                destination: destCode,
                date: data.date 
            }
        });
        if (error) throw error;
        
        if (resData && resData.flights && resData.flights.length > 0) {
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
        alert(txt.errorEmpty);
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
        amount: selectedFlight.price * 70 // تبدیل حدودی به افغانی (میتوانید تغییر دهید)
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
    <div className="max-w-7xl mx-auto w-full px-4 pt-8 space-y-8 animate-in fade-in font-[Vazirmatn]" dir={isLtr ? 'ltr' : 'rtl'}>
       
       {/* مدال دریافت اطلاعات مسافر */}
       {selectedFlight && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative" dir={isLtr ? 'ltr' : 'rtl'}>
                <button onClick={() => setSelectedFlight(null)} className={`absolute top-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition ${isLtr ? 'right-4' : 'left-4'}`}><X size={20}/></button>
                <h3 className="text-xl font-black text-gray-800 mb-1">{txt.modalInfoTitle}</h3>
                <p className="text-sm text-gray-500 mb-6">{txt.modalInfoDesc}</p>
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{txt.labelName}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border border-transparent focus-within:border-[#058B8C] rounded-xl p-3 transition-colors">
                            <User size={18} className="text-gray-400"/>
                            <input autoFocus value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold" placeholder={txt.placeName}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{txt.labelPhone}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border border-transparent focus-within:border-[#058B8C] rounded-xl p-3 transition-colors">
                            <Phone size={18} className="text-gray-400"/>
                            <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold text-left dir-ltr" placeholder={txt.placePhone}/>
                        </div>
                    </div>
                    <button type="submit" disabled={bookingLoading} className="w-full bg-[#f97316] hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 mt-6 shadow-lg shadow-orange-200">
                        {bookingLoading ? <Loader2 className="animate-spin" size={18}/> : null}
                        {bookingLoading ? txt.btnLoading : txt.btnSubmit}
                    </button>
                </form>
            </div>
         </div>
       )}

       {/* مدال پرداخت */}
       {bookedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative" dir={isLtr ? 'ltr' : 'rtl'}>
                <button onClick={() => setBookedOrder(null)} className={`absolute top-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 ${isLtr ? 'right-4' : 'left-4'}`}><X size={20}/></button>
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

       {/* بخش فرم جستجو */}
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
                   <Calendar size={20} className="text-[#058B8C]"/>
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
                 <button onClick={handleSearch} disabled={searchState==='loading'} className="w-full lg:w-auto h-full min-w-[140px] bg-[#f97316] text-white rounded-xl font-bold px-8 py-3 flex items-center justify-center gap-2 transition disabled:opacity-70 shadow-lg shadow-orange-200 active:scale-95 transform">
                   {searchState==='loading' ? <Loader2 className="animate-spin"/> : <><Search size={20}/> {lt.search}</>}
                </button>
             </div>
          </div>
       </div>

       {/* لیست نتایج پرواز */}
       {searchState === 'results' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4">
             {results.map(flight => (
                 <div key={flight.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-[#1e3a8a] transition-all flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg">
                   <div className="flex items-center gap-4 min-w-[200px] w-full md:w-auto">
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-2xl p-2 shrink-0 border border-gray-100">
                          <img src={`https://pics.avs.io/200/200/${flight.logo}.png`} alt={flight.airline} className="max-w-full max-h-full object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png'}/>
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center flex-wrap gap-2 mb-1">
                            {/* نشانگر منبع پرواز */}
                            {flight.source === 'manual' && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-black">چارتر ویژه</span>}
                            {flight.source !== 'manual' && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">سیستمی</span>}
                            <span className="text-xs text-gray-500 font-bold">{flight.airline} | {flight.flightNo}</span>
                         </div>
                         <div className="font-black text-xl text-gray-800" dir="ltr">{flight.dep} - {flight.arr}</div>
                         <div className="text-[11px] text-gray-400 mt-1 font-bold">مدت زمان: {flight.duration}</div>
                      </div>
                   </div>

                   <div className="flex md:flex-col items-center justify-between md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="font-black text-2xl text-[#f97316] mb-2">${flight.price}</div>
                      <button onClick={()=>openInfoModal(flight)} className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-blue-900 transition shadow-lg shadow-blue-200 active:scale-95">
                         {txt.confirm}
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}

       {searchState === 'empty' && (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><Plane size={32} className="text-gray-300"/></div>
             <p className="font-bold text-gray-600">{txt.noResult}</p>
          </div>
       )}
       
       {searchState === 'loading' && (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
             <Loader2 size={40} className="animate-spin text-[#058B8C]"/>
             <span className="font-bold text-gray-500">{txt.searching}</span>
          </div>
       )}

       {/* تذکرات مهم */}
       <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
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