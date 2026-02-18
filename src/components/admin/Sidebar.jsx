import React, { useState } from 'react';
import { Layout, Ticket, Home, Info, Settings, FileText, Users, ChevronDown, ChevronLeft, LogOut, Megaphone } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, setPage }) {
  const [expandedMenus, setExpandedMenus] = useState({
    home: true,
    about: false,
    settings: false
  });

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const MenuItem = ({ id, label, icon: Icon, hasSub, subKey, onClick }) => {
    const isActive = activeTab === id;
    const isExpanded = expandedMenus[subKey];
    
    return (
      <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all text-sm ${
          isActive ? 'bg-[#058B8C]/10 text-[#058B8C]' : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} />}
          <span>{label}</span>
        </div>
        {hasSub && (
          isExpanded ? <ChevronDown size={16} /> : <ChevronLeft size={16} />
        )}
      </button>
    );
  };

  const SubItem = ({ id, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-8 py-2.5 rounded-lg text-xs font-bold transition-all ${
        activeTab === id ? 'text-[#058B8C] bg-[#058B8C]/5' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${activeTab === id ? 'bg-[#058B8C]' : 'bg-gray-300'}`}></div>
      {label}
    </button>
  );

  return (
    <aside className="w-64 bg-white border-l border-gray-100 hidden md:flex flex-col fixed h-full z-10 overflow-y-auto pb-20 scrollbar-hide">
      <div className="p-6 border-b border-gray-50 flex items-center gap-3 sticky top-0 bg-white z-20">
         <div className="w-10 h-10 bg-[#058B8C] rounded-xl flex items-center justify-center text-white font-black">A</div>
         <div>
           <h1 className="font-black text-gray-800">پنل مدیریت</h1>
           <p className="text-xs text-gray-400">بهشتی تراول</p>
         </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {/* 1. Overview */}
        <MenuItem id="dashboard" label="اورویو" icon={Layout} onClick={() => setActiveTab('dashboard')} />

        {/* 2. Bookings */}
        <MenuItem id="bookings" label="رزروها" icon={Ticket} onClick={() => setActiveTab('bookings')} />

        {/* 3. Home Page (Tree) */}
        <MenuItem 
          label="صفحه اصلی" 
          icon={Home} 
          hasSub 
          subKey="home" 
          onClick={() => toggleMenu('home')} 
        />
        {expandedMenus.home && (
          <div className="space-y-1 mb-2 animate-in slide-in-from-top-2">
            <SubItem id="hero" label="هیرو (Hero)" />
            <SubItem id="services" label="خدمات" />
            <SubItem id="weather" label="آب و هوا" />
            {/* منوی اخبار را اینجا اضافه کردم چون مربوط به محتوای اصلی است */}
            <SubItem id="news" label="اخبار و مقالات" />
          </div>
        )}

        {/* 4. About & Contact (Tree) */}
        <MenuItem 
          label="درباره ما و تماس" 
          icon={Info} 
          hasSub 
          subKey="about" 
          onClick={() => toggleMenu('about')} 
        />
        {expandedMenus.about && (
          <div className="space-y-1 mb-2 animate-in slide-in-from-top-2">
            <SubItem id="about" label="درباره ما / تیم" />
            <SubItem id="contact_branches" label="تماس با ما (شعب)" />
          </div>
        )}

        {/* 5. Site Settings (Tree) */}
        <MenuItem 
          label="تنظیمات سایت" 
          icon={Settings} 
          hasSub 
          subKey="settings" 
          onClick={() => toggleMenu('settings')} 
        />
        {expandedMenus.settings && (
          <div className="space-y-1 mb-2 animate-in slide-in-from-top-2">
            <SubItem id="navbar" label="تنظیمات ناوبار" />
            <SubItem id="footer" label="تنظیمات فوتر" />
          </div>
        )}

        {/* 6. Reports */}
        <MenuItem id="reports" label="گزارش ها" icon={FileText} onClick={() => setActiveTab('reports')} />

        {/* 7. Admins */}
        <MenuItem id="admins" label="ادمین ها" icon={Users} onClick={() => setActiveTab('admins')} />
      </nav>
      
      <div className="p-4 border-t border-gray-50 mt-auto bg-white sticky bottom-0">
        <button onClick={() => setPage('home')} className="w-full bg-red-50 text-red-500 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <LogOut size={20} /> خروج
        </button>
      </div>
    </aside>
  );
}