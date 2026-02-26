import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

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

export default function AirportSearch({ value, onChange, placeholder, icon: Icon, lang = 'dr' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const isLtr = lang === 'en';

  const getDisplayName = (a) => lang === 'en' ? `${a.name} (${a.code})` : lang === 'ps' ? `${a.ps} (${a.code})` : `${a.fa} (${a.code})`;

  useEffect(() => {
    const found = AIRPORTS.find(a => a.code === value);
    if (found) setSearch(getDisplayName(found));
    else if (!value) setSearch('');
  }, [value, lang]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
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
    a.fa.includes(search) || a.ps.includes(search) ||
    (lang === 'en' && a.name.toLowerCase().includes(search.toLowerCase()))
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
           {filteredAirports.length > 0 ? filteredAirports.map(item => (
            <div 
              key={item.code} 
              className={`px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-50 last:border-0 ${isLtr ? 'flex-row text-left justify-between' : 'flex-row-reverse text-right justify-between'}`}
              onClick={() => {
                onChange(item.code);
                setSearch(getDisplayName(item));
                setIsOpen(false);
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
}