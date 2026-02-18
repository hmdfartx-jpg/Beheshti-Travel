import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Ticket, FileText, GraduationCap, Package, Search, Menu, X, Globe, Megaphone, User, ChevronDown, Check, Info, Phone } from 'lucide-react';

export default function Navbar({ lang, setLang, settings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);

  // هوک‌های روتینگ
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

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

  // هندل کردن کلیک روی منوی آبشاری (هدایت به صفحه درباره ما)
  const handleNavClick = (sectionId) => {
    setIsAboutMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    // اول به صفحه درباره ما می‌رویم
    if (currentPath !== '/about') {
        navigate('/about');
        // اسکرول با تاخیر برای لود شدن صفحه
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    } else {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <nav className="bg-[#058B8C] shadow-lg sticky top-0 z-50 border-b border-[#047070] w-screen mx-[calc(50%-50vw)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* لوگو و نام برند */}
          <Link 
            to="/" 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* لوگو با سایز جدید h-10 */}
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
          </Link>

          {/* منوی دسکتاپ */}
          <div className="hidden xl:flex items-center gap-1 bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
            <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Home size={18} className={currentPath === '/' ? 'text-[#f97316]' : 'text-white/80'} /> 
                {getText('خانه', 'کور', 'Home')}
            </Link>

            <Link to="/tickets" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/tickets' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Ticket size={18} className={currentPath === '/tickets' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('تکت', 'ټکټ', 'Tickets')}
            </Link>
            
            <Link to="/visa" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath.startsWith('/visa') ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <FileText size={18} className={currentPath.startsWith('/visa') ? 'text-[#f97316]' : 'text-white/80'} /> {getText('ویزا', 'ویزه', 'Visas')}
            </Link>
            
            <Link to="/news" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/news' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Megaphone size={18} className={currentPath === '/news' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('اخبار', 'خبرونه', 'News')}
            </Link>
            
            <Link to="/scholarship" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/scholarship' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <GraduationCap size={18} className={currentPath === '/scholarship' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('بورسیه', 'بورسونه', 'Scholarships')}
            </Link>
            
            <Link to="/cargo" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/cargo' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Package size={18} className={currentPath === '/cargo' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('کارگو', 'کارګو', 'Cargo')}
            </Link>
            
            <Link to="/tracking" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/tracking' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                <Search size={18} className={currentPath === '/tracking' ? 'text-[#f97316]' : 'text-white/80'} /> {getText('پیگیری', 'تعقیب', 'Tracking')}
            </Link>
            
            {/* منوی آبشاری درباره ما */}
            <div className="relative" ref={aboutMenuRef}>
                <button onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/about' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                    <Info size={18} className={currentPath === '/about' ? 'text-[#f97316]' : 'text-white/80'} /> 
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
                {/* اصلاح فونت اینجا: 
                   چک می‌کنیم اگر زبان انگلیسی است، برای نمایش متن زبان فعلی (اگر دری یا پشتو باشد) فونت وزیر را اعمال کن
                */}
                <span className={lang !== 'en' ? 'font-[Vazirmatn]' : ''}>
                    {getText('دری', 'پښتو', 'EN')}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
                  <button 
                    onClick={() => {setLang('dr'); setIsLangMenuOpen(false)}} 
                    className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center border-b border-gray-50 ${alignClass}`}
                  >
                      {/* اضافه کردن کلاس font-[Vazirmatn] برای اجبار فونت فارسی */}
                      <span className="font-[Vazirmatn]">دری</span>
                      {lang === 'dr' && <Check size={14} className="text-[#058B8C]"/>}
                  </button>
                  <button 
                    onClick={() => {setLang('ps'); setIsLangMenuOpen(false)}} 
                    className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center border-b border-gray-50 ${alignClass}`}
                  >
                      {/* اضافه کردن کلاس font-[Vazirmatn] برای اجبار فونت پشتو */}
                      <span className="font-[Vazirmatn]">پښتو</span>
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
            <Link 
              to="/admin"
              className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-transparent hover:border-white/30"
              title={getText('حساب کاربری', 'خپل حساب', 'Account')}
            >
              <User size={18} />
            </Link>
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
               {/* اصلاح فونت دکمه تغییر زبان در موبایل */}
               <span className={lang !== 'en' ? 'font-[Vazirmatn]' : ''}>
                  {getText('Fa', 'Ps', 'EN')}
               </span>
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
            
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <Home size={20} /> {getText('خانه', 'کور', 'Home')}
            </Link>
            
            <div className="bg-gray-50 rounded-xl p-2">
                <div className="text-xs font-bold text-gray-400 px-2 mb-1">{getText('درباره ما', 'زموږ په اړه', 'About')}</div>
                <button onClick={() => handleNavClick('about')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white">
                    <Info size={18} /> {getText('درباره شرکت', 'د شرکت په اړه', 'Company Info')}
                </button>
                <button onClick={() => handleNavClick('contact')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white">
                    <Phone size={18} /> {getText('تماس با ما', 'موږ سره اړیکه', 'Contact Us')}
                </button>
            </div>

            <Link to="/tickets" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <Ticket size={20} /> {getText('تکت', 'ټکټ', 'Tickets')}
            </Link>
            <Link to="/visa" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <FileText size={20} /> {getText('ویزا', 'ویزه', 'Visas')}
            </Link>
            <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <Megaphone size={20} /> {getText('اخبار', 'خبرونه', 'News')}
            </Link>
            <Link to="/scholarship" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <GraduationCap size={20} /> {getText('بورسیه', 'بورسونه', 'Scholarships')}
            </Link>
            <Link to="/cargo" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <Package size={20} /> {getText('کارگو', 'کارګو', 'Cargo')}
            </Link>
            <Link to="/tracking" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <Search size={20} /> {getText('پیگیری', 'تعقیب', 'Tracking')}
            </Link>
            <div className="h-px bg-gray-100 my-2"></div>
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                <User size={20} /> {getText('حساب کاربری', 'خپل حساب', 'Account')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}