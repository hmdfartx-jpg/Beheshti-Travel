import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const AIRLINES = [
  // --- افغانستان ---
  { id: 'RQ', name: 'Kam Air', fa: 'کام ایر', country: 'افغانستان' },
  { id: 'FG', name: 'Ariana Afghan Airlines', fa: 'آریانا افغان', country: 'افغانستان' },
  { id: 'ZA', name: 'Bakhtar Afghan Airlines', fa: 'باختر افغان', country: 'افغانستان' },
  
  // --- امارات متحده عربی ---
  { id: 'EK', name: 'Emirates', fa: 'امارات', country: 'امارات' },
  { id: 'FZ', name: 'FlyDubai', fa: 'فلای دبی', country: 'امارات' },
  { id: 'G9', name: 'Air Arabia', fa: 'ایر عربیا', country: 'امارات' },
  { id: 'EY', name: 'Etihad Airways', fa: 'اتحاد ایرویز', country: 'امارات' },
  { id: '5W', name: 'Wizz Air Abu Dhabi', fa: 'ویز ایر ابوظبی', country: 'امارات' },

  // --- ترکیه ---
  { id: 'TK', name: 'Turkish Airlines', fa: 'ترکیش ایرلاینز', country: 'ترکیه' },
  { id: 'PC', name: 'Pegasus Airlines', fa: 'پگاسوس', country: 'ترکیه' },
  { id: 'XQ', name: 'SunExpress', fa: 'سان اکسپرس', country: 'ترکیه' },
  { id: 'VF', name: 'AJet (AnadoluJet)', fa: 'آناجت', country: 'ترکیه' },

  // --- ایران ---
  { id: 'W5', name: 'Mahan Air', fa: 'ماهان ایر', country: 'ایران' },
  { id: 'IR', name: 'Iran Air', fa: 'ایران ایر', country: 'ایران' },
  { id: 'EP', name: 'Iran Aseman Airlines', fa: 'آسمان', country: 'ایران' },
  { id: 'QB', name: 'Qeshm Air', fa: 'قشم ایر', country: 'ایران' },
  { id: 'Y9', name: 'Kish Air', fa: 'کیش ایر', country: 'ایران' },
  { id: 'I3', name: 'ATA Airlines', fa: 'آتا', country: 'ایران' },
  { id: 'ZV', name: 'Zagros Airlines', fa: 'زاگرس', country: 'ایران' },
  { id: 'VR', name: 'Varesh Airlines', fa: 'وارش', country: 'ایران' },
  { id: 'IS', name: 'Sepehran Airlines', fa: 'سپهران', country: 'ایران' },

  // --- عربستان و کشورهای خلیج فارس ---
  { id: 'SV', name: 'Saudia', fa: 'سعودی ایرلاین', country: 'عربستان' },
  { id: 'XY', name: 'Flynas', fa: 'فلای ناس', country: 'عربستان' },
  { id: 'F3', name: 'Flyadeal', fa: 'فلای ادیل', country: 'عربستان' },
  { id: 'QR', name: 'Qatar Airways', fa: 'قطر ایرویز', country: 'قطر' },
  { id: 'KU', name: 'Kuwait Airways', fa: 'کویت ایرویز', country: 'کویت' },
  { id: 'J9', name: 'Jazeera Airways', fa: 'الجزیره', country: 'کویت' },
  { id: 'WY', name: 'Oman Air', fa: 'عمان ایر', country: 'عمان' },
  { id: 'GF', name: 'Gulf Air', fa: 'گلف ایر', country: 'بحرین' },
  { id: 'IA', name: 'Iraqi Airways', fa: 'عراقی ایرویز', country: 'عراق' },

  // --- پاکستان و هند ---
  { id: 'PK', name: 'PIA', fa: 'پی آی ای', country: 'پاکستان' },
  { id: 'PA', name: 'Airblue', fa: 'ایر بلو', country: 'پاکستان' },
  { id: 'ER', name: 'SereneAir', fa: 'سرین ایر', country: 'پاکستان' },
  { id: 'PF', name: 'AirSial', fa: 'ایر سیال', country: 'پاکستان' },
  { id: 'AI', name: 'Air India', fa: 'ایر ایندیا', country: 'هند' },
  { id: '6E', name: 'IndiGo', fa: 'ایندیگو', country: 'هند' },

  // --- آسیای میانه و روسیه ---
  { id: 'HY', name: 'Uzbekistan Airways', fa: 'ازبکستان ایرویز', country: 'ازبکستان' },
  { id: 'SZ', name: 'Somon Air', fa: 'سامان ایر', country: 'تاجیکستان' },
  { id: 'KC', name: 'Air Astana', fa: 'ایر آستانه', country: 'قزاقستان' },
  { id: 'DV', name: 'SCAT Airlines', fa: 'اسکات ایرلاینز', country: 'قزاقستان' },
  { id: 'T5', name: 'Turkmenistan Airlines', fa: 'ترکمنستان ایرلاینز', country: 'ترکمنستان' },
  { id: 'SU', name: 'Aeroflot', fa: 'آئروفلوت', country: 'روسیه' },
  
  // --- بین المللی عمومی ---
  { id: 'LH', name: 'Lufthansa', fa: 'لوفت‌هانزا', country: 'آلمان' }
];

export default function AirlineSearch({ value, onChange, placeholder, icon: Icon, lang = 'dr' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const isLtr = lang === 'en';

  const getDisplayName = (a) => lang === 'en' ? a.name : a.fa;

  useEffect(() => {
    const found = AIRLINES.find(a => a.name === value);
    if (found) setSearch(getDisplayName(found));
    else if (!value) setSearch('');
  }, [value, lang]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        const found = AIRLINES.find(a => a.name === value);
        setSearch(found ? getDisplayName(found) : '');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, lang]);

  const filteredAirlines = AIRLINES.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.fa.includes(search) || 
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const isCentered = !search && !isOpen;

  return (
    <div className="relative w-full h-full" ref={wrapperRef}>
      <div 
        className="relative w-full h-full hover:bg-gray-50 rounded-xl transition-colors duration-300 cursor-text group"
        onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
      >
        <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 px-2 rounded-full
            ${isCentered 
               ? 'top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold bg-transparent'
               : 'top-0 -translate-y-1/2 text-[11px] text-[#058B8C] font-black bg-white shadow-sm'
             }`}
        >
             {placeholder}
        </div>

        <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10
            ${isCentered 
               ? (isLtr ? 'left-1/2 -translate-x-[110px] text-gray-400' : 'left-1/2 translate-x-[85px] text-gray-400')
               : (isLtr ? 'left-4 text-[#058B8C]' : 'left-[calc(100%-25px)] -translate-x-1/2 text-[#058B8C]')
            }`}
        >
            <Icon size={20}/>
        </div>

        <input 
          ref={inputRef}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          className={`w-full h-full bg-transparent outline-none font-black text-gray-800 text-lg transition-all duration-300 px-10
            ${isCentered ? 'opacity-0' : 'opacity-100'} ${isLtr ? 'text-left' : 'text-right'}`}
          autoComplete="off"
          dir={isLtr ? 'ltr' : 'rtl'}
        />

        {value && (
            <button 
                type="button"
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onChange(''); 
                    setSearch(''); 
                    inputRef.current?.focus(); 
                }} 
                className={`absolute top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full animate-in fade-in z-20 ${isLtr ? 'right-3' : 'left-3'}`}
             >
                <X size={14} className="text-gray-400"/>
            </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95">
           {filteredAirlines.length > 0 ? filteredAirlines.map(item => (
            <div 
              key={item.id} 
              className={`px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-50 last:border-0 ${isLtr ? 'flex-row text-left justify-between' : 'flex-row-reverse text-right justify-between'}`}
              onClick={() => {
                onChange(item.name); // ذخیره نام اصلی در دیتابیس
                setSearch(getDisplayName(item));
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <img src={`https://pics.avs.io/200/200/${item.id}.png`} alt={item.id} className="w-8 h-8 rounded-full bg-white border border-gray-100 object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png'} />
                <div>
                  <div className="font-bold text-gray-800 text-sm">
                     {lang === 'en' ? item.name : item.fa} 
                  </div>
                  <div className="text-[10px] text-gray-400">{item.country}</div>
                </div>
              </div>
              <span className="font-mono font-black text-[#058B8C] bg-blue-50 px-2 py-1 rounded text-xs">{item.id}</span>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-400 text-xs">
                {lang === 'en' ? "No results found" : "موردی یافت نشد"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}