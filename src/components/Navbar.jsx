import React, { useState } from 'react';
// تغییر ۱: اضافه کردن Ticket به لیست ایمپورت‌ها
import { Home, Ticket, FileText, GraduationCap, Package, Search, Menu, X, Globe, Megaphone, User } from 'lucide-react';

export default function Navbar({ lang, setLang, page, setPage, t }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // لیست منوها
  const navItems = [
    { id: 'home', label: lang === 'dr' ? 'خانه' : 'کور', icon: Home },
    // تغییر ۲: جایگزینی Plane با Ticket در اینجا
    { id: 'tickets', label: lang === 'dr' ? 'تکت' : 'ټکټ', icon: Ticket },
    { id: 'visa', label: lang === 'dr' ? 'ویزا' : 'ویزه', icon: FileText },
    { id: 'news', label: lang === 'dr' ? 'اخبار' : 'خبرونه', icon: Megaphone },
    { id: 'scholarship', label: lang === 'dr' ? 'بورسیه' : 'بورسونه', icon: GraduationCap },
    { id: 'cargo', label: lang === 'dr' ? 'کارگو' : 'کارګو', icon: Package },
    { id: 'tracking', label: lang === 'dr' ? 'پیگیری' : 'تعقیب', icon: Search },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* لوگو و نام برند */}
          <div 
            onClick={() => setPage('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-black text-gray-800 text-lg leading-tight">بهشتی</span>
              <span className="text-[10px] text-gray-500 font-bold tracking-wider">TRAVEL AGENCY</span>
            </div>
          </div>

          {/* منوی دسکتاپ */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50 p-1 rounded-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  page === item.id 
                    ? 'bg-white text-[#1e3a8a] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} className={page === item.id ? 'text-[#f97316]' : ''} />
                {item.label}
              </button>
            ))}
          </div>

          {/* دکمه‌های سمت چپ (زبان و ورود) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* تغییر زبان */}
            <button 
              onClick={() => setLang(lang === 'dr' ? 'ps' : 'dr')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs transition-colors"
            >
              <Globe size={16} />
              <span>{lang === 'dr' ? 'پښتو' : 'دری'}</span>
            </button>

            {/* دکمه ادمین/ورود */}
            <button 
              onClick={() => setPage('admin')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <User size={18} />
              <span>{lang === 'dr' ? 'حساب کاربری' : 'خپل حساب'}</span>
            </button>
          </div>

          {/* دکمه همبرگری موبایل */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'dr' ? 'ps' : 'dr')}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 font-black text-xs"
            >
              {lang === 'dr' ? 'Fa' : 'Ps'}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-800"
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
                    ? 'bg-blue-50 text-[#1e3a8a]' 
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
              {lang === 'dr' ? 'حساب کاربری' : 'خپل حساب'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}