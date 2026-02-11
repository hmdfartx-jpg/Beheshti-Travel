import React, { useState, useEffect } from 'react';
import { translations } from './constants/translations';
import { supabase } from './lib/supabase';
// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Visa from './pages/Visa';
import Scholarship from './pages/Scholarship';
import Cargo from './pages/Cargo';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import News from './pages/News';

// تنظیمات پیش‌فرض برای جلوگیری از ارور قبل از لود شدن دیتابیس
const DEFAULT_SETTINGS = {
  general: { brandName: "بهشتی تراول", logoText: "B" },
  hero: { 
    // مقادیر قدیمی را خالی می‌گذاریم تا اگر دیتابیس پر بود، اولویت با آن باشد
    title: "", 
    subtitle: "", 
    
    // فیلدهای دوزبانه/سه‌زبانه
    title_dr: "", 
    title_ps: "",
    title_en: "", // اضافه شد برای انگلیسی

    subtitle_dr: "",
    subtitle_ps: "",
    subtitle_en: "", // اضافه شد برای انگلیسی

    // عکس پیش‌فرض (تک عکس)
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074",
    
    // آرایه تصاویر برای اسلایدر (خالی می‌گذاریم تا اگر در دیتابیس بود پر شود)
    images: [] 
  },
  stats: { customers: 1500, flights: 3200, visas: 850, experience: 12 },
  services: [],
  weather_cities: [], 
  about: { title: "درباره ما", desc: "توضیحات پیش‌فرض..." },
  contact: { phone: "+93 700 000 000", email: "info@example.com", address: "کابل", copyright: "حقوق محفوظ است" },
  
  // تنظیمات جدید ناوبار
  navbar: {
    logoText: "B",
    title_dr: "بهشتی",
    title_ps: "بهشتی",
    title_en: "Beheshti",
    subtitle_dr: "TRAVEL AGENCY",
    subtitle_ps: "TRAVEL AGENCY",
    subtitle_en: "TRAVEL AGENCY"
  }
};

export default function App() {
  const [lang, setLang] = useState('en'); // پیش‌فرض روی انگلیسی
  const [page, setPage] = useState('home');
  const [user, setUser] = useState({ uid: 'admin', email: 'admin@beheshti.com', isAdmin: true });
  // استیت‌های دیتابیس
  const [news, setNews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ticketSearchData, setTicketSearchData] = useState(null);

  const t = translations[lang];

  // تعیین جهت صفحه بر اساس زبان
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  // --- دریافت اطلاعات از Supabase ---
  const fetchData = async () => {
    try {
      // 1. تنظیمات سایت
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('config')
        .limit(1)
        .single();
      if (settingsData && settingsData.config) {
        // ادغام با دیفالت برای اطمینان
        setSettings({ ...DEFAULT_SETTINGS, ...settingsData.config });
      }

      // 2. اخبار
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      // 3. رزروها
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (bookingData) setBookings(bookingData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHomeSearch = (data) => {
    setTicketSearchData(data);
    setPage('tickets'); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-[Vazirmatn] selection:bg-[#058B8C]/20" dir={dir}>
      {/* کلاس‌های عمومی text-right یا text-left را حذف کردیم تا dir والد تصمیم بگیرد، مگر در موارد خاص */}
      <Navbar lang={lang} setLang={setLang} page={page} setPage={setPage} t={t} settings={settings} />
      <WhatsAppButton t={t} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {page === 'home' && (
          <Home 
            t={t} 
            setPage={setPage} 
            lang={lang} 
            onSearch={handleHomeSearch} 
            newsData={news} 
            settings={settings} 
          />
        )}
        
        {page === 'tickets' && (
          <Tickets 
            t={t} 
            setPage={setPage} 
            lang={lang} 
            initialData={ticketSearchData} 
            onBookSuccess={fetchData} 
          />
        )}
        
        {page === 'news' && (
          <News 
            newsList={news} 
            lang={lang} 
            setPage={setPage} 
          />
        )}

        {page.startsWith('view-news-') && (
          <News 
            newsList={news} 
            lang={lang} 
            setPage={setPage} 
            viewId={page.replace('view-news-', '')} 
          />
        )}
        
        {page === 'admin' && (
  <Admin 
    t={t} 
    user={user} 
    news={news} 
    bookings={bookings} 
    settings={settings} 
    onUpdate={fetchData}
    lang={lang}  // <--- این خط حتما اضافه شود
    setPage={setPage} // این هم برای دکمه بازگشت لازم است
  />
)}
        
        {page.startsWith('visa') && <Visa t={t} lang={lang} setPage={setPage} />}
        {page === 'scholarship' && <Scholarship t={t} lang={lang} setPage={setPage} />}
        {page === 'cargo' && <Cargo t={t} lang={lang} setPage={setPage} />}
        {page === 'tracking' && <Tracking t={t} lang={lang} />}
        {page.startsWith('apply-') && <Visa t={t} lang={lang} setPage={setPage} initialMode={page} />}
      </main>

      <Footer t={t} lang={lang} settings={settings} />
    </div>
  );
}