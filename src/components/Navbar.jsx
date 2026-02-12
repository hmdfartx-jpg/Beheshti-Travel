import React, { useState, useRef, useEffect } from 'react';
import { Home, Ticket, FileText, GraduationCap, Package, Search, Menu, X, Globe, Megaphone, User, ChevronDown, Check, Info, Phone } from 'lucide-react';

export default function Navbar({ lang, setLang, page, setPage, settings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);

  // بستن منوها وقتی بیرون از آن‌ها کلیک شود
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target)) {
        setIsAboutMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تابع کمکی برای دریافت متن بر اساس زبان
  const getText = (dr, ps, en) => {
    if (lang === 'dr') return dr;
    if (lang === 'ps') return ps;
    return en;
  };

  // انتخاب لوگو بر اساس زبان
  const logoSrc = lang === 'en' 
    ? (settings?.navbar?.logo_en || '') 
    : (settings?.navbar?.logo_dr || '');

  const alignClass = lang === 'dr' || lang === 'ps' ? 'text-right' : 'text-left';

  // هندل کردن کلیک روی منوی آبشاری
  const handleNavClick = (sectionId) => {
    setPage('about');
    setIsAboutMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  return (
    <nav className="bg-[#058B8C] shadow-lg sticky top-0 z-50 border-b border-[#047070] w-screen mx-[calc(50%-50vw)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* لوگو و نام برند */}
          <div 
            onClick={() => setPage('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* لوگو با سایز جدید h-10 (افزایش 25 درصدی نسبت به h-8) */}
            {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
            ) : (
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#058B8C] font-black text-xl shadow-lg">
                  {settings?.navbar?.logoText || 'B'}
                </div>
            )}
          </div>

          {/* منوی دسکتاپ - اصلاح ارتفاع (py-2) برای هم‌اندازه شدن با دکمه زبان */}
          <div className="hidden xl:flex items-center gap-1 bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
            <button onClick={() => setPage('home')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'home' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Home size={18} className={page === 'home' ? 'text-[#f97316]' : 'text-white/80'} /> 
                {getText('خانه', 'کور', 'Home')}
            </button>

            <button onClick={() => setPage('tickets')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'tickets' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Ticket size={18} className={page === 'tickets' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('تکت', 'ټکټ', 'Tickets')}
            </button>
            <button onClick={() => setPage('visa')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page.startsWith('visa') ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <FileText size={18} className={page.startsWith('visa') ? 'text-[#f97316]' : 'text-white/80'} /> {getText('ویزا', 'ویزه', 'Visas')}
            </button>
            <button onClick={() => setPage('news')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'news' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Megaphone size={18} className={page === 'news' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('اخبار', 'خبرونه', 'News')}
            </button>
            <button onClick={() => setPage('scholarship')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'scholarship' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <GraduationCap size={18} className={page === 'scholarship' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('بورسیه', 'بورسونه', 'Scholarships')}
            </button>
            <button onClick={() => setPage('cargo')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'cargo' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Package size={18} className={page === 'cargo' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('کارگو', 'کارګو', 'Cargo')}
            </button>
            <button onClick={() => setPage('tracking')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'tracking' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Search size={18} className={page === 'tracking' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('پیگیری', 'تعقیب', 'Tracking')}
            </button>
            
            {/* منوی آبشاری درباره ما */}
            <div className="relative" ref={aboutMenuRef}>
                <button onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${page === 'about' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                    <Info size={18} className={page === 'about' ? 'text-[#f97316]' : 'text-white/80'} /> 
                    {getText('درباره ما', 'زموږ په اړه', 'About Us')}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isAboutMenuOpen ? 'rotate-180' : ''}`}/>
                </button>
                {isAboutMenuOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 z-50">
                        <button onClick={() => handleNavClick('about')} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex items-center gap-2 ${alignClass}`}>
                            <Info size={16} className="text-[#058B8C]"/> 
                            {getText('درباره ما', 'زموږ په اړه', 'About Company')}
                        </button>
                        <button onClick={() => handleNavClick('contact')} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex items-center gap-2 ${alignClass}`}>
                            <Phone size={16} className="text-[#058B8C]"/> 
                            {getText('تماس با ما', 'موږ سره اړیکه', 'Contact Us')}
                        </button>
                    </div>
                )}
            </div>
          </div>

          {/* دکمه‌های سمت چپ (زبان و ورود) */}
          <div className="hidden xl:flex items-center gap-3">
            
            {/* انتخاب زبان */}
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-transparent hover:border-white/30"
              >
                <Globe size={18} />
                <span>{getText('دری', 'پښتو', 'EN')}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

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
                      <span>EN</span>
                      {(lang === 'en' || !lang) && <Check size={14} className="text-[#058B8C]"/>}
                  </button>
                </div>
              )}
            </div>

            {/* دکمه ادمین/ورود */}
            <button 
              onClick={() => setPage('admin')}
              // کلاس‌ها دقیقاً مشابه دکمه زبان تنظیم شدند (ارتفاع، رنگ، حاشیه)
              className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-transparent hover:border-white/30"
              title={getText('حساب کاربری', 'خپل حساب', 'Account')}
            >
              {/* سایز آیکون هم ۱۸ شد تا با کره زمین دکمه زبان برابر شود */}
              <User size={18} />
            </button>
          </div>

          {/* دکمه همبرگری موبایل */}
          <div className="xl:hidden flex items-center gap-3">
            <button 
              onClick={() => {
                if (lang === 'en' || !lang) setLang('dr');
                else if (lang === 'dr') setLang('ps');
                else setLang('en');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white font-black text-xs hover:bg-white/20"
            >
               {getText('Fa', 'Ps', 'EN')}
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
        <div className="xl:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top-5">
          <div className="p-4 space-y-2">
            <button onClick={() => {setPage('home'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Home size={20} /> {getText('خانه', 'کور', 'Home')}</button>
            
            <div className="bg-gray-50 rounded-xl p-2">
                <div className="text-xs font-bold text-gray-400 px-2 mb-1">{getText('درباره ما', 'زموږ په اړه', 'About')}</div>
                <button onClick={() => handleNavClick('about')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white"><Info size={18} /> {getText('درباره شرکت', 'د شرکت په اړه', 'Company Info')}</button>
                <button onClick={() => handleNavClick('contact')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white"><Phone size={18} /> {getText('تماس با ما', 'موږ سره اړیکه', 'Contact Us')}</button>
            </div>

            <button onClick={() => {setPage('tickets'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Ticket size={20} /> {getText('تکت', 'ټکټ', 'Tickets')}</button>
            <button onClick={() => {setPage('visa'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><FileText size={20} /> {getText('ویزا', 'ویزه', 'Visas')}</button>
            <button onClick={() => {setPage('news'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Megaphone size={20} /> {getText('اخبار', 'خبرونه', 'News')}</button>
            <button onClick={() => {setPage('scholarship'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><GraduationCap size={20} /> {getText('بورسیه', 'بورسونه', 'Scholarships')}</button>
            <button onClick={() => {setPage('cargo'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Package size={20} /> {getText('کارگو', 'کارګو', 'Cargo')}</button>
            <button onClick={() => {setPage('tracking'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Search size={20} /> {getText('پیگیری', 'تعقیب', 'Tracking')}</button>
            <div className="h-px bg-gray-100 my-2"></div>
            <button onClick={() => {setPage('admin'); setIsMobileMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><User size={20} /> {getText('حساب کاربری', 'خپل حساب', 'Account')}</button>
          </div>
        </div>
      )}
    </nav>
  );
}