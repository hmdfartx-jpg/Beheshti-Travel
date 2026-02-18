import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { translations } from './constants/translations';
import { supabase } from './lib/supabase';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Visa from './pages/Visa';
import Scholarship from './pages/Scholarship';
import Cargo from './pages/Cargo';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import News from './pages/News';
import About from './pages/About';

// تنظیمات پیش‌فرض برای جلوگیری از ارور قبل از لود شدن دیتابیس
const DEFAULT_SETTINGS = {
  general: { brandName: "بهشتی تراول", logoText: "B" },
  hero: { 
    title: "", 
    subtitle: "", 
    
    // فیلدهای دوزبانه/سه‌زبانه
    title_dr: "سفر آگاهانه، آینده درخشان", 
    title_ps: "پوه سفر، روښانه راتلونکې",
    title_en: "Conscious Travel, Bright Future",

    subtitle_dr: "از کابل تا دورترین نقاط جهان، ما همراه شما هستیم.",
    subtitle_ps: "له کابل څخه تر نړۍ لرې ځایونو پورې، موږ ستاسو سره یو.",
    subtitle_en: "From Kabul to the farthest corners of the world, we are with you.",

    // عکس پیش‌فرض (تک عکس)
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    // آرایه تصاویر اسلایدر
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
    ]
  },
  stats: { customers: 1200, flights: 3500, visas: 850, experience: 10 },
  services: [
    { icon: 'Plane', title: 'تکت طیاره', title_en: 'Flight Ticket', desc: 'رزرو سریع و ارزان پروازهای داخلی و خارجی', desc_en: 'Fast and cheap booking of domestic and international flights', color: 'blue' },
    { icon: 'FileText', title: 'اخذ ویزا', title_en: 'Visa Services', desc: 'خدمات ویزای ایران، پاکستان، ترکیه و روسیه', desc_en: 'Visa services for Iran, Pakistan, Turkey, and Russia', color: 'orange' },
    { icon: 'GraduationCap', title: 'بورسیه تحصیلی', title_en: 'Scholarships', desc: 'مشاوره رایگان و اخذ پذیرش از دانشگاه‌ها', desc_en: 'Free consultation and admission from universities', color: 'green' },
    { icon: 'Package', title: 'خدمات باربری', title_en: 'Cargo Services', desc: 'ارسال امانات و بارهای تجاری به سراسر جهان', desc_en: 'Sending consignments and commercial cargo worldwide', color: 'purple' },
    { icon: 'Hotel', title: 'رزرو هتل', title_en: 'Hotel Booking', desc: 'اقامت راحت در بهترین هتل‌های جهان', desc_en: 'Comfortable stay in the best hotels in the world', color: 'teal' },
  ],
  weather_cities: [
    { id: 1, name: 'Kabul', faName: 'کابل', countryName: 'افغانستان', timezone: 'Asia/Kabul', image: 'https://images.unsplash.com/photo-1626016335087-433b24855dd4' },
    { id: 2, name: 'Herat', faName: 'هرات', countryName: 'افغانستان', timezone: 'Asia/Kabul', image: 'https://images.unsplash.com/photo-1626016335087-433b24855dd4' },
    { id: 3, name: 'Tehran', faName: 'تهران', countryName: 'ایران', timezone: 'Asia/Tehran', image: 'https://images.unsplash.com/photo-1580843410777-6c8a74df6296' },
    { id: 4, name: 'Istanbul', faName: 'استانبول', countryName: 'ترکیه', timezone: 'Europe/Istanbul', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200' },
    { id: 5, name: 'Dubai', faName: 'دبی', countryName: 'امارات', timezone: 'Asia/Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea932a23518' },
  ],
  contact: {
    phone: "+93 700 000 000",
    email: "info@beheshtitravel.com",
    address_dr: "کابل، شهر نو، چهارراهی انصاری",
    address_ps: "کابل، شهر نو، څلور لارې انصاري",
    address_en: "Ansari Square, Shahr-e Naw, Kabul",
    whatsapp: "",
    telegram: "",
    instagram: "",
    facebook: "",
    map_link: "",
    copyright_dr: "تمام حقوق برای بهشتی تراول محفوظ است © ۲۰۲۴",
    copyright_en: "All rights reserved © 2024 Beheshti Travel"
  },
  useful_links: [
    { title_dr: "ریاست پاسپورت", title_ps: "د پاسپورت ریاست", title_en: "Passport Directorate", url: "https://passport.gov.af/" }
  ],
  navbar: {
    logo_dr: "", 
    logo_en: ""  
  },
  about: {
    title: "سفر رویایی شما از اینجا آغاز می‌شود",
    title_dr: "سفر رویایی شما از اینجا آغاز می‌شود",
    title_ps: "ستاسو خوب سفر له دې ځایه پیلیږي",
    title_en: "Your Dream Journey Begins Here",
    
    desc: "ما در بهشتی تراول با بیش از ۱۰ سال تجربه، متعهد به ارائه بهترین خدمات مسافرتی هستیم...",
    desc_dr: "ما در بهشتی تراول با بیش از ۱۰ سال تجربه، متعهد به ارائه بهترین خدمات مسافرتی هستیم...",
    desc_ps: "موږ په بهشتي ټراول کې د ۱۰ کلونو تجربې سره ژمن یو چې غوره خدمات وړاندې کړو...",
    desc_en: "At Beheshti Travel, with over 10 years of experience, we are committed to providing the best travel services...",
    
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
    
    mission_title_dr: "ماموریت ما",
    mission_title_ps: "زموږ ماموریت",
    mission_title_en: "Our Mission",
    mission_desc_dr: "ارائه خدمات با کیفیت و قیمت مناسب",
    mission_desc_ps: "د کیفیت لرونکي خدماتو او مناسب قیمت وړاندې کول",
    mission_desc_en: "Providing quality services at reasonable prices",

    vision_title_dr: "چشم‌انداز",
    vision_title_ps: "لیدلوری",
    vision_title_en: "Our Vision",
    vision_desc_dr: "تبدیل شدن به برند برتر منطقه",
    vision_desc_ps: "په سیمه کې مخکښ برانډ کیدل",
    vision_desc_en: "Becoming the region's top brand"
  },
  team: [],
  why_us: [],
  agencies: []
};

export default function App() {
  // زبان پیش‌فرض: انگلیسی
  const [lang, setLang] = useState('en');
  
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [news, setNews] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // استفاده از هوک location برای اسکرول به بالا در تغییر صفحه
  const location = useLocation();

  const t = translations[lang] || translations.dr;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. دریافت تنظیمات سایت
      let { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1);

      if (settingsData && settingsData.length > 0) {
        const dbConfig = settingsData[0].config;
        setSettings(prev => ({
           ...prev,
           ...dbConfig,
           hero: { ...prev.hero, ...dbConfig.hero },
           contact: { ...prev.contact, ...dbConfig.contact },
           about: { ...prev.about, ...dbConfig.about },
           services: dbConfig.services || prev.services,
           weather_cities: dbConfig.weather_cities || prev.weather_cities,
           team: dbConfig.team || [],
           why_us: dbConfig.why_us || [],
           agencies: dbConfig.agencies || [],
           useful_links: dbConfig.useful_links || prev.useful_links,
           navbar: { ...prev.navbar, ...dbConfig.navbar }
        }));
      } else {
        await supabase.from('site_settings').insert([{ config: DEFAULT_SETTINGS }]);
      }

      // 2. دریافت اخبار
      let { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      setNews(newsData || []);

      // 3. دریافت رزروها
      let { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      setBookings(bookingsData || []);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // پایان عملیات لودینگ
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // شرط نمایش لودینگ
  if (loading) {
    return <LoadingScreen />;
  }

  // بررسی اینکه آیا در صفحه ادمین هستیم (برای مخفی کردن هدر و فوتر)
const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col font-[Vazirmatn] ${lang === 'en' ? 'font-sans' : ''}`} dir={lang === 'en' ? 'ltr' : 'rtl'}>      

        <Navbar 
        lang={lang} 
        setLang={setLang} 
        settings={settings} 
      />
    

      <main className="flex-1 pt-24 pb-12">
        <Routes>
          <Route path="/" element={
            <Home 
              t={t} 
              lang={lang} 
              newsData={news}
              settings={settings}
            />
          } />
          
          <Route path="/tickets" element={
            <Tickets 
              t={t} 
              lang={lang} 
              onBookSuccess={fetchData} 
            />
          } />
          
          <Route path="/news" element={
            <News 
              newsList={news} 
              lang={lang} 
            />
          } />

          <Route path="/news/:id" element={
            <News 
              newsList={news} 
              lang={lang} 
            />
          } />

          <Route path="/about" element={<About t={t} lang={lang} settings={settings} />} />
          
          <Route path="/admin" element={
            <Admin 
              t={t} 
              user={user} 
              news={news} 
              bookings={bookings} 
              settings={settings} 
              onUpdate={fetchData}
              lang={lang} 
            />
          } />
          
          <Route path="/visa" element={<Visa t={t} lang={lang} />} />
          <Route path="/scholarship" element={<Scholarship t={t} lang={lang} />} />
          <Route path="/cargo" element={<Cargo t={t} lang={lang} />} />
          <Route path="/tracking" element={<Tracking t={t} lang={lang} />} />

          {/* صفحه ۴۰۴ */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
              <p className="text-xl text-gray-500 font-bold">صفحه مورد نظر یافت نشد</p>
              <p className="text-gray-400 mt-2">Page Not Found</p>
            </div>
          } />
        </Routes>
      </main>

      {!isAdminPage && (
        <>
          <WhatsAppButton t={t} />
          <Footer t={t} lang={lang} settings={settings} />
        </>
      )}
    </div>
  );
}