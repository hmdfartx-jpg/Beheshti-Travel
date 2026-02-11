import React, { useState, useRef, useEffect } from 'react';
import { Home, Ticket, FileText, GraduationCap, Package, Search, Menu, X, Globe, Megaphone, User, ChevronDown, Check } from 'lucide-react';

export default function Navbar({ lang, setLang, page, setPage, settings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  // بستن منوی زبان وقتی بیرون از آن کلیک شود
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تابع کمکی برای دریافت متن بر اساس زبان (با اولویت و پیش‌فرض انگلیسی)
  const getText = (dr, ps, en) => {
    if (lang === 'dr') return dr;
    if (lang === 'ps') return ps;
    return en; // پیش‌فرض: انگلیسی
  };

  // تعیین جهت متن برای منوها (انگلیسی چپ‌چین، بقیه راست‌چین)
  const alignClass = lang === 'en' ? 'text-left' : 'text-right';

  // انتخاب لوگو بر اساس زبان
  // اگر زبان انگلیسی بود لوگوی انگلیسی، در غیر این صورت لوگوی دری/پشتو
  const logoSrc = lang === 'en' 
    ? (settings?.navbar?.logo_en || '') 
    : (settings?.navbar?.logo_dr || '');

  // لیست منوها
  const navItems = [
    { id: 'home', label: getText('خانه', 'کور', 'Home'), icon: Home },
    { id: 'tickets', label: getText('تکت', 'ټکټ', 'Tickets'), icon: Ticket },
    { id: 'visa', label: getText('ویزا', 'ویزه', 'Visa'), icon: FileText },
    { id: 'news', label: getText('اخبار', 'خبرونه', 'News'), icon: Megaphone },
    { id: 'scholarship', label: getText('بورسیه', 'بورسونه', 'Scholarship'), icon: GraduationCap },
    { id: 'cargo', label: getText('کارگو', 'کارګو', 'Cargo'), icon: Package },
    { id: 'tracking', label: getText('پیگیری', 'تعقیب', 'Tracking'), icon: Search },
  ];

  return (
    // ✅ تغییر مهم: اضافه کردن w-screen و mx-[calc(50%-50vw)] برای اطمینان از تمام عرض بودن ناوبار و پوشاندن لبه‌ها
    <nav className="bg-[#058B8C] shadow-lg sticky top-0 z-50 border-b border-[#047070] w-screen mx-[calc(50%-50vw)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* لوگو (تصویر آپلود شده) */}
          <div 
            onClick={() => setPage('home')} 
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
          >
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="h-14 w-auto object-contain" 
              />
            ) : (
              // اگر لوگویی آپلود نشده بود، یک متن پیش‌فرض نمایش بده
              <span className="text-white font-black text-xl">LOGO</span>
            )}
          </div>

          {/* منوی دسکتاپ */}
          <div className="hidden lg:flex items-center gap-1 bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  page === item.id 
                    ? 'bg-white text-[#058B8C] shadow-sm' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={18} className={page === item.id ? 'text-[#f97316]' : 'text-white/80'} />
                {item.label}
              </button>
            ))}
          </div>

          {/* دکمه‌های سمت چپ (زبان و ورود) */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* انتخاب زبان (دراپ‌داون) */}
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-transparent hover:border-white/30"
              >
                <Globe size={18} />
                <span>{getText('دری', 'پښتو', 'English')}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* منوی بازشو زبان */}
              {isLangMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
                  <button 
                    onClick={() => {setLang('dr'); setIsLangMenuOpen(false)}} 
                    className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center border-b border-gray-50 ${alignClass}`}
                  >
                      <span>دری</span>
                      {lang === 'dr' && <Check size={14} className="text-[#058B8C]"/>}
                  </button>
                  <button 
                    onClick={() => {setLang('ps'); setIsLangMenuOpen(false)}} 
                    className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center border-b border-gray-50 ${alignClass}`}
                  >
                      <span>پښتو</span>
                      {lang === 'ps' && <Check size={14} className="text-[#058B8C]"/>}
                  </button>
                   <button 
                    onClick={() => {setLang('en'); setIsLangMenuOpen(false)}} 
                    className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center ${alignClass}`}
                  >
                      <span>English</span>
                      {(lang === 'en' || !lang) && <Check size={14} className="text-[#058B8C]"/>}
                  </button>
                </div>
              )}
            </div>

            {/* دکمه ادمین/ورود (فقط آیکون) */}
            <button 
              onClick={() => setPage('admin')}
              className="flex items-center justify-center p-3 rounded-xl bg-white text-[#058B8C] hover:bg-gray-100 font-bold shadow-lg shadow-black/10 transition-all active:scale-95 group"
              title={getText('ورود ادمین', 'د اډمین ننوتل', 'Admin Login')}
            >
              <User size={20} className="group-hover:scale-110 transition-transform"/>
            </button>
          </div>

          {/* دکمه همبرگری موبایل */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={() => {
                // چرخش بین سه زبان
                if (lang === 'en' || !lang) setLang('dr');
                else if (lang === 'dr') setLang('ps');
                else setLang('en');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white font-black text-xs hover:bg-white/20"
            >
               {getText('Fa', 'Ps', 'En')}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#058B8C]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top-5">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  page === item.id 
                    ? 'bg-blue-50 text-[#058B8C]' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            <button 
              onClick={() => {
                setPage('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              <User size={20} />
              {getText('ورود ادمین', 'د اډمین ننوتل', 'Admin Login')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}