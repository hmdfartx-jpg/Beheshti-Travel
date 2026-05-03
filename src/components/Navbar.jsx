import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Search, Menu, X, Globe, User, ChevronDown, Check, Info, Phone, Hammer, Newspaper } from 'lucide-react'; // Newspaper اضافه شد

export default function Navbar({ lang, setLang, settings }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [comingSoonModal, setComingSoonModal] = useState(false);
  
  // استیت‌های مربوط به باکس جستجو
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const langMenuRef = useRef(null);
  const aboutMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const dynamicMenus = settings?.navbar?.menus || [];

  // بستن منوها وقتی بیرونشان کلیک شود
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) setIsLangMenuOpen(false);
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target)) setIsAboutMenuOpen(false);
      // بستن باکس جستجو اگر بیرونش کلیک شد و متنی داخلش نبود
      if (searchRef.current && !searchRef.current.contains(event.target) && !searchQuery) {
          setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  // وقتی باکس جستجو باز میشه، فوکوس روی اینپوت بره
  useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
          searchInputRef.current.focus();
      }
  }, [isSearchOpen]);

  const getText = (dr, ps, en) => {
    if (lang === 'dr') return dr;
    if (lang === 'ps') return ps;
    return en;
  };

  const getMenuTitle = (menu) => {
      if (lang === 'en') return menu.title_en || menu.title_dr;
      if (lang === 'ps') return menu.title_ps || menu.title_dr;
      return menu.title_dr || 'منو';
  };

  const handleMenuClick = (e, menu) => {
      if (menu.isComingSoon) {
          e.preventDefault();
          setComingSoonModal(true);
      } else {
          setIsMobileMenuOpen(false);
      }
  };

  const handleNavClick = (sectionId) => {
    setIsAboutMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    if (currentPath !== '/about') {
        navigate(`/about#${sectionId}`);
    } else {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // تابع اجرای جستجو
  const executeSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          setIsSearchOpen(false);
          setIsMobileMenuOpen(false);
          navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
          setSearchQuery(''); // پاک کردن فرم بعد از ارسال
      }
  };

  const logoSrc = lang === 'en' ? (settings?.navbar?.logo_en || '') : (settings?.navbar?.logo_dr || '');
  const alignClass = lang === 'dr' || lang === 'ps' ? 'text-right' : 'text-left';

  return (
    <>
      <nav className={`shadow-lg sticky top-0 z-50 border-b border-[#047070] w-screen mx-[calc(50%-50vw)] bg-[#058B8C] transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            
            {/* لوگو */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
              {logoSrc ? (
                  <img src={logoSrc} alt="Logo" className="h-10 w-auto object-contain drop-shadow-md" />
              ) : (
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#058B8C] font-black text-xl shadow-lg">
                    {settings?.general?.logoText || 'B'}
                  </div>
              )}
            </Link>

            {/* منوی دسکتاپ (فقط اگر سرچ باز نباشد یا اسکرین بزرگ باشد نشان داده میشود) */}
            <div className={`hidden xl:flex items-center gap-1 bg-white/10 p-1 rounded-2xl backdrop-blur-sm border border-white/10 transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 relative'}`}>
              
              <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                  <Home size={18} className={currentPath === '/' ? 'text-[#f97316]' : 'text-white/80'} /> 
                  {getText('خانه', 'کور', 'Home')}
              </Link>

              {dynamicMenus.map(menu => {
                 const title = getMenuTitle(menu);
                 const hasSubmenus = menu.submenus && menu.submenus.length > 0;
                 const isActive = currentPath === menu.url;
                 
                 if (hasSubmenus) {
                    return (
                        <div key={menu.id} className="relative group">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${isActive ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                                {title} <ChevronDown size={14}/>
                            </div>
                            <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${lang === 'en' ? 'left-0' : 'right-0'}`}>
                                {menu.submenus.map(sub => (
                                    <a key={sub.id} href={sub.url} target={sub.isExternal ? "_blank" : "_self"} rel="noreferrer" onClick={(e) => handleMenuClick(e, sub)} className="block px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700">
                                        {getMenuTitle(sub)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    );
                 }

                 return menu.isExternal ? (
                    <a key={menu.id} href={menu.url} target="_blank" rel="noreferrer" onClick={(e) => handleMenuClick(e, menu)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 text-white hover:bg-white/10`}>
                        {title}
                    </a>
                 ) : (
                    <Link key={menu.id} to={menu.url} onClick={(e) => handleMenuClick(e, menu)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                        {title}
                    </Link>
                 );
              })}
              
               {/* لینک وبلاگ (اخبار) اضافه شد */}
               <Link to="/news" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/news' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                  <Newspaper size={18} className={currentPath === '/news' ? 'text-[#f97316]' : 'text-white/80'} /> 
                  {getText('وبلاگ', 'وبلاګ', 'Blog')}
              </Link>

              <div className="relative" ref={aboutMenuRef}>
                  <button onClick={() => setIsAboutMenuOpen(!isAboutMenuOpen)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${currentPath === '/about' ? 'bg-white text-[#058B8C] shadow-sm' : 'text-white hover:bg-white/10'}`}>
                      <Info size={18} className={currentPath === '/about' ? 'text-[#f97316]' : 'text-white/80'} /> 
                      {getText('درباره ما', 'زموږ په اړه', 'About Us')}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isAboutMenuOpen ? 'rotate-180' : ''}`}/>
                  </button>
                  {isAboutMenuOpen && (
                      <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 z-50">
                          <button onClick={() => handleNavClick('company')} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex items-center gap-2 ${alignClass}`}>
                              <Info size={16} className="text-[#058B8C]"/> {getText('درباره شرکت', 'د شرکت په اړه', 'Company')}
                          </button>
                          <button onClick={() => handleNavClick('team')} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex items-center gap-2 ${alignClass}`}>
                              <User size={16} className="text-[#058B8C]"/> {getText('تیم متخصص ما', 'زموږ مسلکي ټیم', 'Our Team')}
                          </button>
                          <button onClick={() => handleNavClick('clients')} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex items-center gap-2 ${alignClass}`}>
                              <Check size={16} className="text-[#058B8C]"/> {getText('مشتریان ما', 'زموږ پیرودونکي', 'Our Clients')}
                          </button>
                          <button onClick={() => handleNavClick('contact')} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex items-center gap-2 ${alignClass}`}>
                              <Phone size={16} className="text-[#058B8C]"/> {getText('تماس با ما', 'موږ سره اړیکه', 'Contact Us')}
                          </button>
                      </div>
                  )}
              </div>
            </div>

            {/* بخش سمت چپ ناوبار (سرچ، زبان، پروفایل) */}
            <div className="hidden xl:flex items-center gap-3">
              
              {/* باکس جستجوی هوشمند (داینامیک) */}
              <div ref={searchRef} className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-80' : 'w-10'}`}>
                  <form onSubmit={executeSearch} className={`flex items-center bg-white/10 rounded-xl border transition-all duration-300 overflow-hidden w-full ${isSearchOpen ? 'border-white/50 bg-white/20 shadow-inner' : 'border-transparent hover:border-white/30 hover:bg-white/20'}`}>
                      <button 
                         type={isSearchOpen ? "submit" : "button"} 
                         onClick={(e) => {
                             if (!isSearchOpen) {
                                 e.preventDefault();
                                 setIsSearchOpen(true);
                             }
                         }}
                         className="flex items-center justify-center p-2.5 text-white outline-none shrink-0" 
                         title={getText('جستجو', 'لټون', 'Search')}
                      >
                         <Search size={18} />
                      </button>
                      
                      <input 
                         ref={searchInputRef}
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder={getText('جستجو در سایت...', 'په سایټ کې لټون...', 'Search website...')}
                         className={`bg-transparent text-white text-sm font-bold placeholder-white/50 outline-none h-10 transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full px-2 opacity-100' : 'w-0 px-0 opacity-0'}`}
                      />
                      
                      {isSearchOpen && (
                          <button 
                             type="button" 
                             onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                             className="p-2.5 text-white/50 hover:text-white shrink-0"
                          >
                             <X size={16} />
                          </button>
                      )}
                  </form>
              </div>

              {/* وقتی سرچ باز باشه بقیه دکمه‌ها محو میشن تا جا باز بشه */}
              <div className={`flex items-center gap-3 transition-all duration-300 ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden translate-x-10' : 'opacity-100 w-auto translate-x-0'}`}>
                  <div className="relative" ref={langMenuRef}>
                    <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-transparent hover:border-white/30">
                      <Globe size={18} />
                      <span className={lang !== 'en' ? 'font-[Vazirmatn]' : ''}>{getText('دری', 'پښتو', 'EN')}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLangMenuOpen && (
                      <div className="absolute top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 z-50 left-0">
                        <button onClick={() => {setLang('dr'); setIsLangMenuOpen(false)}} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center border-b border-gray-50 ${alignClass}`}>
                            <span className="font-[Vazirmatn]">دری</span>
                            {lang === 'dr' && <Check size={14} className="text-[#058B8C]"/>}
                        </button>
                        <button onClick={() => {setLang('ps'); setIsLangMenuOpen(false)}} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center border-b border-gray-50 ${alignClass}`}>
                            <span className="font-[Vazirmatn]">پښتو</span>
                            {lang === 'ps' && <Check size={14} className="text-[#058B8C]"/>}
                        </button>
                        <button onClick={() => {setLang('en'); setIsLangMenuOpen(false)}} className={`w-full px-4 py-3 hover:bg-blue-50 text-sm font-bold text-gray-700 flex justify-between items-center ${alignClass}`}>
                            <span>EN</span>
                            {(lang === 'en' || !lang) && <Check size={14} className="text-[#058B8C]"/>}
                        </button>
                      </div>
                    )}
                  </div>

                  <Link to="/admin" className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-transparent hover:border-white/30" title={getText('حساب کاربری', 'خپل حساب', 'Account')}>
                    <User size={18} />
                  </Link>
              </div>
            </div>

            {/* حالت موبایل */}
            <div className="xl:hidden flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20">
                 <Search size={20} />
              </button>
              <button onClick={() => { if (lang === 'en' || !lang) setLang('dr'); else if (lang === 'dr') setLang('ps'); else setLang('en'); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white font-black text-xs hover:bg-white/20">
                 <span className={lang !== 'en' ? 'font-[Vazirmatn]' : ''}>{getText('Fa', 'Ps', 'EN')}</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#058B8C]">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top-5">
            <div className="p-4 space-y-2 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* سرچ باکس موبایل */}
              <div className="mb-4">
                  <form onSubmit={executeSearch} className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder={getText('جستجو در سایت...', 'په سایټ کې لټون...', 'Search...')}
                         className="flex-1 bg-transparent text-gray-700 text-sm font-bold outline-none px-4 h-12"
                      />
                      <button type="submit" className="p-3 text-[#058B8C] bg-blue-50">
                         <Search size={20} />
                      </button>
                  </form>
              </div>

              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <Home size={20} /> {getText('خانه', 'کور', 'Home')}
              </Link>

              {dynamicMenus.map(menu => {
                 const title = getMenuTitle(menu);
                 return menu.isExternal ? (
                    <a key={menu.id} href={menu.url} target="_blank" rel="noreferrer" onClick={(e) => handleMenuClick(e, menu)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                        <Globe size={20}/> {title}
                    </a>
                 ) : (
                    <Link key={menu.id} to={menu.url} onClick={(e) => handleMenuClick(e, menu)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                        <FileText size={20}/> {title}
                    </Link>
                 );
              })}
              
               {/* لینک وبلاگ (اخبار) موبایل */}
               <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <Newspaper size={20} /> {getText('وبلاگ', 'وبلاګ', 'Blog')}
              </Link>
              
              <div className="bg-gray-50 rounded-xl p-2 mt-2">
                  <div className="text-xs font-bold text-gray-400 px-2 mb-1">{getText('درباره ما', 'زموږ په اړه', 'About')}</div>
                  <button onClick={() => handleNavClick('company')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white">
                      <Info size={18} /> {getText('درباره شرکت', 'د شرکت په اړه', 'Company Info')}
                  </button>
                  <button onClick={() => handleNavClick('team')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white">
                      <User size={18} /> {getText('تیم متخصص ما', 'زموږ مسلکي ټیم', 'Our Team')}
                  </button>
                  <button onClick={() => handleNavClick('clients')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white">
                      <Check size={18} /> {getText('مشتریان ما', 'زموږ پیرودونکي', 'Our Clients')}
                  </button>
                  <button onClick={() => handleNavClick('contact')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-white">
                      <Phone size={18} /> {getText('تماس با ما', 'موږ سره اړیکه', 'Contact Us')}
                  </button>
              </div>

              <div className="h-px bg-gray-100 my-2"></div>
              
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <User size={20} /> {getText('حساب کاربری', 'خپل حساب', 'Account')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {comingSoonModal && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setComingSoonModal(false)}>
            <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl transform transition-all animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Hammer size={32} className="text-orange-500 animate-pulse"/>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">{getText('در حال بروزرسانی', 'سیسټم تازه کیږي', 'Coming Soon')}</h3>
                <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8">{getText('این بخش از سیستم در حال توسعه است.', 'د سیسټم دا برخه د پراختیا په حال کې ده.', 'This section is under development.')}</p>
                <button onClick={() => setComingSoonModal(false)} className="w-full bg-[#058B8C] text-white py-3.5 rounded-xl font-black shadow-lg active:scale-95 transition-transform">
                    {getText('متوجه شدم', 'پوه شوم', 'Got it')}
                </button>
            </div>
         </div>
      )}
    </>
  );
}