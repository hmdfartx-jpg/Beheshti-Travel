import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRightLeft, ChevronDown, User, Calendar, Plus, Minus, Check, ShieldCheck, Clock, Globe, Plane, FileText, Hotel, Package, CreditCard, GraduationCap, Users, CheckCircle, Briefcase, Megaphone, Pin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import WeatherBlock from '../components/WeatherBlock';

// لیست جامع فرودگاه‌ها (بیش از ۱۰۰ فرودگاه مرتبط) - کامل بدون حذفیات
const AIRPORTS = [
  // --- افغانستان (Afghanistan) ---
  { code: 'KBL', name: 'Kabul International', city: 'Kabul', fa: 'کابل', ps: 'کابل', country: 'Afghanistan' },
  { code: 'HER', name: 'Herat International', city: 'Herat', fa: 'هرات', ps: 'هرات', country: 'Afghanistan' },
  { code: 'MZD', name: 'Mazar-i-Sharif International', city: 'Mazar-i-Sharif', fa: 'مزارشریف', ps: 'مزارشریف', country: 'Afghanistan' },
  { code: 'KDH', name: 'Kandahar International', city: 'Kandahar', fa: 'قندهار', ps: 'کندهار', country: 'Afghanistan' },
  { code: 'KHT', name: 'Khost International', city: 'Khost', fa: 'خوست', ps: 'خوست', country: 'Afghanistan' },
  { code: 'BST', name: 'Bost Airport', city: 'Lashkar Gah', fa: 'لشکرگاه', ps: 'لشکرګاه', country: 'Afghanistan' },
  { code: 'BNA', name: 'Bamyan Airport', city: 'Bamyan', fa: 'بامیان', ps: 'بامیان', country: 'Afghanistan' },
  { code: 'UND', name: 'Kunduz Airport', city: 'Kunduz', fa: 'قندوز', ps: 'کندز', country: 'Afghanistan' },
  { code: 'FBD', name: 'Faizabad Airport', city: 'Faizabad', fa: 'فیض‌آباد', ps: 'فیض‌اباد', country: 'Afghanistan' },
  { code: 'TII', name: 'Tarin Kowt Airport', city: 'Tarin Kowt', fa: 'ترین‌کوت', ps: 'ترینکوټ', country: 'Afghanistan' },
  { code: 'ZAJ', name: 'Zaranj Airport', city: 'Zaranj', fa: 'زرنج', ps: 'زرنج', country: 'Afghanistan' },
  { code: 'CCN', name: 'Chaghcharan Airport', city: 'Chaghcharan', fa: 'چغچران', ps: 'چغچران', country: 'Afghanistan' },

  // --- ایران (Iran) ---
  { code: 'IKA', name: 'Imam Khomeini International', city: 'Tehran', fa: 'تهران (امام خمینی)', ps: 'تهران (امام خمیني)', country: 'Iran' },
  { code: 'THR', name: 'Mehrabad International', city: 'Tehran', fa: 'تهران (مهرآباد)', ps: 'تهران (مهرآباد)', country: 'Iran' },
  { code: 'MHD', name: 'Mashhad International', city: 'Mashhad', fa: 'مشهد', ps: 'مشهد', country: 'Iran' },
  { code: 'SYZ', name: 'Shiraz International', city: 'Shiraz', fa: 'شیراز', ps: 'شیراز', country: 'Iran' },
  { code: 'TBZ', name: 'Tabriz International', city: 'Tabriz', fa: 'تبریز', ps: 'تبریز', country: 'Iran' },
  { code: 'IFN', name: 'Isfahan International', city: 'Isfahan', fa: 'اصفهان', ps: 'اصفهان', country: 'Iran' },
  { code: 'AWZ', name: 'Ahvaz International', city: 'Ahvaz', fa: 'اهواز', ps: 'اهواز', country: 'Iran' },
  { code: 'KIH', name: 'Kish International', city: 'Kish Island', fa: 'کیش', ps: 'کیش', country: 'Iran' },
  { code: 'GSM', name: 'Qeshm International', city: 'Qeshm Island', fa: 'قشم', ps: 'قشم', country: 'Iran' },
  { code: 'BND', name: 'Bandar Abbas International', city: 'Bandar Abbas', fa: 'بندرعباس', ps: 'بندرعباس', country: 'Iran' },
  { code: 'ZAH', name: 'Zahedan International', city: 'Zahedan', fa: 'زاهدان', ps: 'زاهدان', country: 'Iran' },
  { code: 'KER', name: 'Kerman Airport', city: 'Kerman', fa: 'کرمان', ps: 'کرمان', country: 'Iran' },
  { code: 'RAS', name: 'Rasht Airport', city: 'Rasht', fa: 'رشت', ps: 'رشت', country: 'Iran' },
  { code: 'OMH', name: 'Urmia Airport', city: 'Urmia', fa: 'ارومیه', ps: 'ارومیه', country: 'Iran' },
  { code: 'AZD', name: 'Yazd Airport', city: 'Yazd', fa: 'یزد', ps: 'یزد', country: 'Iran' },

  // --- پاکستان (Pakistan) ---
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', fa: 'اسلام‌آباد', ps: 'اسلام‌اباد', country: 'Pakistan' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', fa: 'لاهور', ps: 'لاهور', country: 'Pakistan' },
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', fa: 'کراچی', ps: 'کراچۍ', country: 'Pakistan' },
  { code: 'PEW', name: 'Bacha Khan International', city: 'Peshawar', fa: 'پیشاور', ps: 'پېښور', country: 'Pakistan' },
  { code: 'UET', name: 'Quetta International', city: 'Quetta', fa: 'کویته', ps: 'کوټه', country: 'Pakistan' },
  { code: 'MUX', name: 'Multan International', city: 'Multan', fa: 'مولتان', ps: 'ملتان', country: 'Pakistan' },
  { code: 'SKT', name: 'Sialkot International', city: 'Sialkot', fa: 'سیالکوت', ps: 'سیالکوټ', country: 'Pakistan' },

  // --- ترکیه (Turkey) ---
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', fa: 'استانبول (اصلی)', ps: 'استانبول', country: 'Turkey' },
  { code: 'SAW', name: 'Sabiha Gokcen', city: 'Istanbul', fa: 'استانبول (صبیحه)', ps: 'استانبول (صبیحه)', country: 'Turkey' },
  { code: 'ESB', name: 'Ankara Esenboga', city: 'Ankara', fa: 'آنکارا', ps: 'انقره', country: 'Turkey' },
  { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', fa: 'آنتالیا', ps: 'انتالیا', country: 'Turkey' },
  { code: 'ADB', name: 'Izmir Adnan Menderes', city: 'Izmir', fa: 'ازمیر', ps: 'ازمیر', country: 'Turkey' },
  { code: 'TZX', name: 'Trabzon Airport', city: 'Trabzon', fa: 'ترابزون', ps: 'ترابزون', country: 'Turkey' },

  // --- امارات متحده عربی (UAE) ---
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', fa: 'دبی', ps: 'دوبۍ', country: 'UAE' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', fa: 'شارجه', ps: 'شارجه', country: 'UAE' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', fa: 'ابوظبی', ps: 'ابوظبۍ', country: 'UAE' },
  { code: 'RKT', name: 'Ras Al Khaimah', city: 'Ras Al Khaimah', fa: 'راس‌الخیمه', ps: 'راس‌الخیمه', country: 'UAE' },
  { code: 'AAN', name: 'Al Ain International', city: 'Al Ain', fa: 'العین', ps: 'العین', country: 'UAE' },

  // --- عربستان سعودی (Saudi Arabia) ---
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', fa: 'جده', ps: 'جده', country: 'Saudi Arabia' },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', fa: 'ریاض', ps: 'ریاض', country: 'Saudi Arabia' },
  { code: 'DMM', name: 'King Fahd', city: 'Dammam', fa: 'دمام', ps: 'دمام', country: 'Saudi Arabia' },
  { code: 'MED', name: 'Prince Mohammad', city: 'Medina', fa: 'مدینه', ps: 'مدینه', country: 'Saudi Arabia' },

  // --- هند (India) ---
  { code: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', fa: 'دهلی نو', ps: 'نوی ډیلي', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', fa: 'مبئی', ps: 'ممبۍ', country: 'India' },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee', city: 'Amritsar', fa: 'آمریتسار', ps: 'امریتسار', country: 'India' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', fa: 'چنای', ps: 'چنای', country: 'India' },
  { code: 'BLR', name: 'Kempegowda', city: 'Bangalore', fa: 'بنگلور', ps: 'بنګلور', country: 'India' },
  { code: 'HYD', name: 'Rajiv Gandhi', city: 'Hyderabad', fa: 'حیدرآباد', ps: 'حیدرآباد', country: 'India' },

  // --- آسیای میانه (Central Asia) ---
  { code: 'DYU', name: 'Dushanbe International', city: 'Dushanbe', fa: 'دوشنبه', ps: 'دوشنبه', country: 'Tajikistan' },
  { code: 'TAS', name: 'Islam Karimov', city: 'Tashkent', fa: 'تاشکند', ps: 'تاشکند', country: 'Uzbekistan' },
  { code: 'ASB', name: 'Ashgabat International', city: 'Ashgabat', fa: 'عشق‌آباد', ps: 'عشق اباد', country: 'Turkmenistan' },
  { code: 'ALA', name: 'Almaty International', city: 'Almaty', fa: 'آلماتی', ps: 'الماتی', country: 'Kazakhstan' },
  { code: 'FRU', name: 'Manas International', city: 'Bishkek', fa: 'بیشکک', ps: 'بیشکک', country: 'Kyrgyzstan' },
  { code: 'LBD', name: 'Khujand Airport', city: 'Khujand', fa: 'خجند', ps: 'خجند', country: 'Tajikistan' },

  // --- خاورمیانه و خلیج فارس (Middle East) ---
  { code: 'DOH', name: 'Hamad International', city: 'Doha', fa: 'دوحه', ps: 'دوحه', country: 'Qatar' },
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait', fa: 'کویت', ps: 'کویت', country: 'Kuwait' },
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', fa: 'مسقط', ps: 'مسقط', country: 'Oman' },
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', fa: 'منامه', ps: 'منامه', country: 'Bahrain' },
  { code: 'BGW', name: 'Baghdad International', city: 'Baghdad', fa: 'بغداد', ps: 'بغداد', country: 'Iraq' },
  { code: 'NJF', name: 'Al Najaf International', city: 'Najaf', fa: 'نجف', ps: 'نجف', country: 'Iraq' },
  { code: 'AMM', name: 'Queen Alia', city: 'Amman', fa: 'امان', ps: 'امان', country: 'Jordan' },

  // --- اروپا (Europe) ---
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', fa: 'فرانکفورت', ps: 'فرانکفورت', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', fa: 'مونیخ', ps: 'مونیخ', country: 'Germany' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', fa: 'برلین', ps: 'برلین', country: 'Germany' },
  { code: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', fa: 'هامبورگ', ps: 'هامبورګ', country: 'Germany' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', fa: 'لندن (هیترو)', ps: 'لندن (هیترو)', country: 'UK' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', fa: 'لندن (گت‌ویک)', ps: 'لندن (ګت‌ویک)', country: 'UK' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', fa: 'منچستر', ps: 'منچستر', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', fa: 'پاریس', ps: 'پاریس', country: 'France' },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', fa: 'آمستردام', ps: 'امستردام', country: 'Netherlands' },
  { code: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', fa: 'رم', ps: 'روم', country: 'Italy' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', fa: 'میلان', ps: 'میلان', country: 'Italy' },
  { code: 'MAD', name: 'Adolfo Suarez', city: 'Madrid', fa: 'مادرید', ps: 'مادرید', country: 'Spain' },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', fa: 'بارسلونا', ps: 'بارسلونا', country: 'Spain' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', fa: 'وین', ps: 'وین', country: 'Austria' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', fa: 'زوریخ', ps: 'زوریخ', country: 'Switzerland' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', fa: 'بروکسل', ps: 'بروکسل', country: 'Belgium' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', fa: 'کپنهاگ', ps: 'کوپنهاګ', country: 'Denmark' },
  { code: 'ARN', name: 'Arlanda Airport', city: 'Stockholm', fa: 'استکهلم', ps: 'ستوکهولم', country: 'Sweden' },
  { code: 'OSL', name: 'Gardermoen', city: 'Oslo', fa: 'اسلو', ps: 'اسلو', country: 'Norway' },
  { code: 'SVO', name: 'Sheremetyevo', city: 'Moscow', fa: 'مسکو (شرمتیوو)', ps: 'مسکو', country: 'Russia' },
  { code: 'VKO', name: 'Vnukovo', city: 'Moscow', fa: 'مسکو (ونوکوو)', ps: 'مسکو', country: 'Russia' },

  // --- آمریکای شمالی (North America) ---
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', fa: 'نیویورک', ps: 'نیویارک', country: 'USA' },
  { code: 'IAD', name: 'Dulles International', city: 'Washington DC', fa: 'واشنگتن', ps: 'واشنګټن', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', fa: 'لس‌آنجلس', ps: 'لاس انجلس', country: 'USA' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', fa: 'شیکاگو', ps: 'شیکاګو', country: 'USA' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', fa: 'سان‌فرانسیسکو', ps: 'سان فرانسیسکو', country: 'USA' },
  { code: 'YYZ', name: 'Pearson International', city: 'Toronto', fa: 'تورنتو', ps: 'تورنتو', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', fa: 'ونکوور', ps: 'ونکوور', country: 'Canada' },
  { code: 'YUL', name: 'Trudeau International', city: 'Montreal', fa: 'مونترال', ps: 'مونتریال', country: 'Canada' },

  // --- شرق آسیا و اقیانوسیه (Asia Pacific) ---
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', fa: 'بانکوک', ps: 'بانکوک', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', fa: 'کوالالامپور', ps: 'کوالالمپور', country: 'Malaysia' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', fa: 'سنگاپور', ps: 'سنګاپور', country: 'Singapore' },
  { code: 'CAN', name: 'Baiyun International', city: 'Guangzhou', fa: 'گوانگجو', ps: 'ګوانګجو', country: 'China' },
  { code: 'PEK', name: 'Capital International', city: 'Beijing', fa: 'پکن', ps: 'بیجینګ', country: 'China' },
  { code: 'URC', name: 'Diwopu International', city: 'Urumqi', fa: 'ارومچی', ps: 'ارومچی', country: 'China' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', fa: 'سئول', ps: 'سیول', country: 'South Korea' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', fa: 'توکیو', ps: 'توکیو', country: 'Japan' },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', fa: 'سیدنی', ps: 'سیډني', country: 'Australia' },
  { code: 'MEL', name: 'Tullamarine', city: 'Melbourne', fa: 'ملبورن', ps: 'ملبورن', country: 'Australia' }
];

const ICON_MAP = {
  'Plane': Plane, 'FileText': FileText, 'Package': Package, 'CreditCard': CreditCard,
  'GraduationCap': GraduationCap, 'ShieldCheck': ShieldCheck, 'Hotel': Hotel, 'Clock': Clock, 'Globe': Globe
};

const searchT = {
  dr: { one_way: "یک طرفه", round_trip: "رفت و برگشت", economy: "اکونومی", business: "بیزنس", first: "فرست کلاس", adults: "بزرگسال", children: "کودک", passenger: "مسافر", confirm: "تایید" },
  ps: { one_way: "یو طرفه", round_trip: "تګ راتګ", economy: "اکونومي", business: "بیزنس", first: "لومړۍ درجه", adults: "لویان", children: "ماشومان", passenger: "مسافر", confirm: "تایید" },
  en: { one_way: "One Way", round_trip: "Round Trip", economy: "Economy", business: "Business", first: "First Class", adults: "Adults", children: "Children", passenger: "Passenger", confirm: "Confirm" }
};

// --- کامپوننت جستجوی فرودگاه (اصلاح نهایی: تنظیم دقیق لبه و آیکون) ---
const AirportSearch = ({ value, onChange, placeholder, icon: Icon, lang = 'dr' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  
  // تابع کمکی برای دریافت نام نمایش
  const getDisplayName = (a) => {
      if (lang === 'en') return `${a.name} (${a.code})`;
      if (lang === 'ps') return `${a.ps} (${a.code})`;
      return `${a.fa} (${a.code})`;
  };

  useEffect(() => {
    const found = AIRPORTS.find(a => a.code === value);
    if (found) setSearch(getDisplayName(found));
    else if (!value) setSearch('');
  }, [value, lang]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
        const found = AIRPORTS.find(a => a.code === value);
        setSearch(found ? getDisplayName(found) : '');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, lang]);

  const filteredAirports = AIRPORTS.filter(a => 
    a.city.toLowerCase().includes(search.toLowerCase()) || 
    a.code.toLowerCase().includes(search.toLowerCase()) ||
    a.fa.includes(search) ||
    a.ps.includes(search) ||
    (lang === 'en' && a.name.toLowerCase().includes(search.toLowerCase()))
  );

  // وضعیت وسط‌چین (غیرفعال)
  const isCentered = !search && !isFocused;
  const isLtr = lang === 'en';

  return (
    <div className="relative w-full h-full" ref={wrapperRef}>
      <div 
        className="relative w-full h-full hover:bg-gray-50 rounded-xl transition-colors duration-300 cursor-text group"
        onClick={() => {
            setIsOpen(true);
            setIsFocused(true);
            inputRef.current?.focus();
        }}
      >
        
        {/* متن راهنما (Label) */}
        <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 px-2 rounded-full
            ${isCentered 
               ? 'top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold bg-transparent' // حالت وسط
               : 'top-0 -translate-y-1/2 text-[11px] text-[#058B8C] font-black bg-white shadow-sm' // حالت روی لبه
             }`}
        >
             {placeholder}
        </div>

        {/* آیکون */}
        <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10
            ${isCentered 
               ? (isLtr ? 'left-1/2 -translate-x-[110px] text-gray-400' : 'left-1/2 translate-x-[85px] text-gray-400') // کنار متن (وسط)
               : (isLtr ? 'left-4 text-[#058B8C]' : 'left-[calc(100%-25px)] -translate-x-1/2 text-[#058B8C]') // گوشه (فعال)
            }`}
        >
            <Icon size={20}/>
        </div>

        {/* اینپوت */}
        <input 
          ref={inputRef}
          value={search}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          className={`w-full h-full bg-transparent outline-none font-black text-gray-800 text-sm transition-all duration-300 px-10
            ${isCentered ? 'opacity-0' : 'opacity-100'} ${isLtr ? 'text-left' : 'text-right'}`}
          autoComplete="off"
          dir={isLtr ? 'ltr' : 'rtl'}
        />

        {/* دکمه حذف */}
        {value && (
            <button 
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
      
      {/* لیست نتایج */}
      {isOpen && (
        <div className={`absolute top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 left-0 right-0`}>
          {filteredAirports.length > 0 ?
          filteredAirports.map(item => (
            <div 
              key={item.code} 
              className={`px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-50 last:border-0 ${isLtr ? 'flex-row text-left justify-between' : 'flex-row-reverse text-right justify-between'}`}
              onClick={() => {
                onChange(item.code);
                setSearch(getDisplayName(item));
                setIsOpen(false);
                setIsFocused(false);
              }}
            >
              <div>
                <div className="font-bold text-gray-800 text-sm">
                    {lang === 'en' ? item.name : (lang === 'ps' ? item.ps : item.fa)} 
                    <span className="text-xs text-gray-500 font-normal mx-1">({item.city})</span>
                </div>
                <div className="text-[10px] text-gray-400">{item.country}</div>
              </div>
              <span className="font-mono font-black text-[#058B8C] bg-blue-50 px-2 py-1 rounded text-xs">{item.code}</span>
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
};

const GoogleCalendar = ({ onSelect, onClose, selectedDate, lang }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date(); today.setHours(0, 0, 0, 0);
  
  const getMonths = () => {
      if (lang === 'en') return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      if (lang === 'ps') return ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"];
      return ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"];
  };
  const getWeekDays = () => {
      if (lang === 'en') return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      return ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  };

  const months = getMonths();
  const weekDays = getWeekDays();
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year, month) => new Date(year, month, 1).getDay();
  const changeMonth = (offset) => { const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1); setViewDate(newDate); };
  const renderMonth = (offset) => {
    const currentView = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    const year = currentView.getFullYear();
    const month = currentView.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month);
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
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 w-[650px] animate-in fade-in zoom-in-95 hidden md:block cursor-default" onClick={(e) => e.stopPropagation()} dir="ltr">
       <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
          <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
       </div>
       <div className="flex divide-x divide-gray-100 divide-x-reverse">{renderMonth(0)}{renderMonth(1)}</div>
       <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-lg">
            {lang === 'en' ? 'Cancel' : (lang === 'ps' ? 'لغوه' : 'انصراف')}
          </button>
       </div>
    </div>
  );
};

const TopFilterBtn = ({ label, active, onClick, icon: Icon }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all relative ${active ? 'bg-white text-[#058B8C] border border-gray-200' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'}`}>
    {Icon && <Icon size={16}/>} {label} <ChevronDown size={14} className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}/>
  </button>
);

export default function Home({ t, setPage, lang, onSearch, newsData, settings }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [stats, setStats] = useState({ customers: 0, flights: 0, visas: 0, experience: 0 });
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '', tripType: 'one_way', flightClass: 'economy', adults: 1, children: 0 });
  // اسلایدشو
  const [currentSlide, setCurrentSlide] = useState(0);
  const isLtr = lang === 'en';
  // اطمینان از اینکه تصاویر به صورت آرایه هستند
  const heroImages = settings?.hero?.images && settings.hero.images.length > 0 ? settings.hero.images : [settings.hero.image];

  const st = searchT[lang] || searchT.dr;
  const getLt = () => {
    if (lang === 'en') return {
        search: 'Search Flights',
        select_date: 'Depart Date',
        return_date: 'Return Date',
        services_title: 'Our Services',
        news_title: 'News & Announcements',
        stat_customers: 'Happy Customers',
        stat_flights: 'Successful Flights',
        stat_visas: 'Visas Issued',
        stat_experience: 'Years Experience'
    };
    if (lang === 'ps') return {
        search: 'د الوتنې لټون',
        select_date: "نیټه وټاکئ",
        return_date: "راستنیدو نیټه",
        services_title: "زموږ خدمتونه",
        news_title: "خبرونه او خبرتیاوې",
        stat_customers: "راضی پیرودونکي",
        stat_flights: "بریالۍ الوتنې",
        stat_visas: "صادر شوي ویزې",
        stat_experience: "کال تجربه"
    };
    return {
        search: 'جستجوی پرواز',
        select_date: "تاریخ رفت",
        return_date: "تاریخ برگشت",
        services_title: "خدمات ما",
        news_title: "اخبار و اعلامیه‌ها",
        stat_customers: "مشتریان راضی",
        stat_flights: "پرواز موفق",
        stat_visas: "ویزای صادر شده",
        stat_experience: "سال تجربه"
    };
  };

  const lt = getLt();

  // تابع کمکی برای دریافت متن چندزبانه از آبجکت
  const getLangContent = (obj, field) => {
      if (!obj) return '';
      if (lang === 'en') return obj[`${field}_en`] || obj[field];
      if (lang === 'ps') return obj[`${field}_ps`] || obj[`${field}_dr`] || obj[field];
      return obj[`${field}_dr`] || obj[field];
  };

  // تایمر اسلایدشو
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [heroImages]);

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
       const msg = lang === 'en' ? "Please select origin and destination" : (lang === 'dr' ? "لطفا مبدا و مقصد را وارد کنید" : "مهربانی وکړئ مبدا او مقصد دننه کړئ");
       alert(msg);
       return;
    }
    if (onSearch) onSearch(formData);
  };

  const getServiceTitle = (srv) => getLangContent(srv, 'title');
  const getServiceDesc = (srv) => getLangContent(srv, 'desc');

  const sortedNews = newsData ? [...newsData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-[Vazirmatn] -mt-24" dir={isLtr ? 'ltr' : 'rtl'}>
      
     {/* 1. Hero Section + Search Bar */}
      <div className="relative w-screen mx-[calc(50%-50vw)] h-[90vh] min-h-[600px] -mt-32">
        
        {/* لایه پس‌زمینه (عکس‌ها و گرادیانت) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            {heroImages.map((img, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                     <img 
                        src={img} 
                        className={`w-full h-full object-cover transform transition-transform duration-[10000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`} 
                        alt={`Slide ${index}`} 
                    />
                </div>
            ))}
            
            {/* لایه تاریک برای خوانایی متن */}
            <div className="absolute inset-0 bg-black/40 z-10" />
            
            {/* گرادیانت پایین - هم‌عرض صفحه */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#058B8C] via-[#058B8C]/80 to-transparent z-20 w-full" />
        </div>

        {/* محتوای متنی هیرو - وسط‌چین عمودی */}
        {/* pt-20 برای فاصله گرفتن از ناوبار */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pb-12 pt-20">
             <div className="space-y-6">
                 {/* متن هیرو که از دیتابیس خوانده می‌شود و کاملا وابسته به زبان است */}
                 <div className="flex flex-col items-center gap-2">
                    <h2 className="text-4xl md:text-7xl font-black text-white drop-shadow-lg leading-tight">
                        {getLangContent(settings.hero, 'title')}
                    </h2>
                    <p className="text-lg md:text-3xl font-medium text-white/90 drop-shadow-md">
                        {getLangContent(settings.hero, 'subtitle')}
                    </p>
                 </div>
                 
                 {/* خط جداکننده */}
                 <div className="w-20 h-1.5 bg-white/40 rounded-full mx-auto"></div>
             </div>
        </div>

        {/* کانتینر جستجوگر */}
        <div className="absolute bottom-0 left-0 right-0 z-40 translate-y-1/2 px-4">
          <div className="max-w-6xl mx-auto" ref={dropdownRef}>
            
            <div className="bg-[#058B8C] p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/20 space-y-4 backdrop-blur-sm">
            
            {/* دکمه‌های فیلتر بالای سرچ */}
            <div className="flex flex-wrap items-center gap-3 relative z-50">
               {/* نوع سفر */}
               <div className="relative">
                  <TopFilterBtn label={st[formData.tripType]} icon={ArrowRightLeft} active={activeDropdown === 'type'} onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')} />
                  {activeDropdown === 'type' && (
                    <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 ${isLtr ? 'left-0' : 'right-0'}`}>
                      {['round_trip', 'one_way'].map(k => (
                         <button key={k} onClick={() => {setFormData({...formData, tripType: k}); setActiveDropdown(null)}} className={`w-full px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between ${isLtr ? 'text-left' : 'text-right'}`}>
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
                    <div className={`absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl p-4 animate-in zoom-in-95 cursor-default ${isLtr ? 'left-0' : 'right-0'}`}>
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
                    <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 ${isLtr ? 'left-0' : 'right-0'}`}>
                      {['economy', 'business', 'first'].map(k => (
                           <button key={k} onClick={() => {setFormData({...formData, flightClass: k}); setActiveDropdown(null)}} className={`w-full px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between ${isLtr ? 'text-left' : 'text-right'}`}>{st[k]}</button>
                      ))}
                    </div>
                  )}
               </div>
            </div>

            {/* فرم اصلی جستجو */}
            <div className={`bg-white rounded-[1.5rem] p-2 flex flex-col lg:flex-row items-stretch shadow-lg relative z-30 min-h-[80px] ${isLtr ? 'divide-y lg:divide-y-0 lg:divide-x divide-gray-100' : 'divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gray-100'}`}>
               
               {/* مبدا */}
               <div className="flex-1 h-20 lg:h-auto">
                   <AirportSearch lang={lang} icon={Plane} value={formData.origin} onChange={(val)=>setFormData({...formData, origin: val})} placeholder={lang==='dr'?"مبدا (شهر یا فرودگاه)":(lang==='en'?"Origin (City or Airport)":"له کوم ځای؟")} />
               </div>
               
               {/* مقصد (همراه با دکمه سویچ شناور) */}
               <div className="flex-1 h-20 lg:h-auto relative">
                   {/* دکمه سویچ */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:right-0 lg:left-auto lg:translate-x-1/2 lg:-translate-y-1/2 z-20">
                      <button 
                        type="button" 
                        onClick={() => setFormData(p => ({...p, origin: p.destination, destination: p.origin}))} 
                        className="bg-white p-2 rounded-full text-gray-500 hover:bg-[#058B8C] hover:text-white transition shadow-md border border-gray-100"
                      >
                        <ArrowRightLeft size={16} />
                      </button>
                   </div>
                   <AirportSearch lang={lang} icon={MapPin} value={formData.destination} onChange={(val)=>setFormData({...formData, destination: val})} placeholder={lang==='dr'?"مقصد (شهر یا فرودگاه)":(lang==='en'?"Destination (City or Airport)":"چیرته؟")} />
               </div>
               
               {/* تاریخ رفت */}
               <div className={`flex-1 relative h-20 lg:h-auto ${isLtr ? 'border-l border-gray-100' : 'border-r border-gray-100'}`}>
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
               <div className={`flex-1 relative h-20 lg:h-auto ${isLtr ? 'border-l border-gray-100' : 'border-r border-gray-100'}`}>
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
               <div className="p-2 lg:w-auto w-full h-20 lg:h-auto">
                 <button onClick={handleSearch} className="w-full lg:w-auto h-full min-w-[140px] bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all transform active:scale-95">
                    {lt.search}
                 </button>
               </div>
            </div>
          </div>
          </div>
       </div>
      </div>

      {/* فاصله اضافه */}
      <div className="h-20 md:h-24"></div>

      {/* 2. اخبار و اطلاعیه‌ها */}
      <div className="max-w-7xl mx-auto px-4 py-6">
         <h2 className="text-3xl font-black text-center text-[#058B8C] mb-8 relative">
            {lt.news_title}
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#D4AF37] rounded-full"></span>
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
             {sortedNews.slice(0, 5).map((news) => (
               <div key={news.id} onClick={() => setPage('news')} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative">
                  {news.pinned && <div className={`absolute top-2 bg-yellow-400 text-white p-1 rounded-full shadow-sm z-10 ${isLtr ? 'right-2' : 'left-2'}`}><Pin size={12} fill="white"/></div>}
                  <div className="h-32 overflow-hidden">
                      <img src={news.image_url} alt={getLangContent(news, 'title')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                         <Megaphone size={14} />
                        <span className="text-[10px] font-bold bg-yellow-50 px-2 py-0.5 rounded-full">{lang === 'en' ? "Notice" : "اطلاعیه"}</span>
                     </div>
                     <h3 className="font-black text-gray-800 text-sm mb-2 line-clamp-1">{getLangContent(news, 'title')}</h3>
                      <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{getLangContent(news, 'description')}</p>
                  </div>
               </div>
             ))}
         </div>
      </div>

      {/* 3. خدمات ما */}
      <div className="max-w-7xl mx-auto px-4 py-6">
         <h2 className="text-3xl font-black text-center text-[#058B8C] mb-8 relative">
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
                     <h3 className="text-lg font-black text-gray-800 mb-2">{getServiceTitle(srv)}</h3>
                     <p className="text-gray-500 text-xs leading-relaxed">{getServiceDesc(srv)}</p>
                  </div>
               );
            })}
         </div>
      </div>

      {/* 4. آمار */}
      <div className="bg-[#058B8C] py-8 text-white relative overflow-hidden my-6 rounded-[2rem] mx-4 shadow-xl">
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

      {/* 5. آب و هوا */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
         <WeatherBlock cities={settings?.weather_cities} lang={lang} />
      </div>

      {/* 6. ویژگی‌های شرکت */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-6">
          <ServiceCard icon={ShieldCheck} title={lang === 'en' ? "Security & Trust" : (lang === 'dr' ? "امنیت و اعتماد" : "امنیت او باور")} desc={t.home.why_desc} color='#058B8C' />
          <ServiceCard icon={Clock} title={lang === 'en' ? "Speed of Execution" : (lang === 'dr' ? "سرعت در اجرا" : "په کار کې چټکتیا")} desc={t.home.why_desc} color='#f97316' />
          <ServiceCard icon={Globe} title={lang === 'en' ? "Global Coverage" : (lang === 'dr' ? "پوشش جهانی" : "نړیوال پوښښ")} desc={t.home.why_desc} color='#058B8C' />
      </div>
    </div>
  );
}