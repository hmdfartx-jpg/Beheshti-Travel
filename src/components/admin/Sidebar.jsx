import React, { useState } from 'react';
import { Layout, Ticket, Home, Info, Settings, FileText, Users, ChevronDown, ChevronLeft, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const [expandedMenus, setExpandedMenus] = useState({
    home: false,
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
    // top-20 باعث می‌شود سایدبار دقیقاً زیر ناوبار (که h-20 است) بچسبد
    <aside className="w-64 bg-white border-l border-gray-100 hidden md:flex flex-col fixed top-20 right-0 h-[calc(100vh-80px)] z-40 shadow-lg">
      
      {/* بخش اسکرول‌خور منوها */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 pb-4 scrollbar-hide">
        <MenuItem id="dashboard" label="اورویو" icon={Layout} onClick={() => setActiveTab('dashboard')} />
        <MenuItem id="bookings" label="رزروها" icon={Ticket} onClick={() => setActiveTab('bookings')} />

        <MenuItem label="صفحه اصلی" icon={Home} hasSub subKey="home" onClick={() => toggleMenu('home')} />
        {expandedMenus.home && (
          <div className="space-y-1 mb-2 bg-gray-50/50 rounded-xl p-1 animate-in slide-in-from-top-2">
            <SubItem id="hero" label="هیرو (Hero)" />
            <SubItem id="services" label="خدمات" />
            <SubItem id="weather" label="آب و هوا" />
            <SubItem id="news" label="اخبار و مقالات" />
          </div>
        )}

        <MenuItem label="درباره ما و تماس" icon={Info} hasSub subKey="about" onClick={() => toggleMenu('about')} />
        {expandedMenus.about && (
          <div className="space-y-1 mb-2 bg-gray-50/50 rounded-xl p-1 animate-in slide-in-from-top-2">
            <SubItem id="about" label="درباره ما / تیم" />
            <SubItem id="contact_branches" label="تماس با ما (شعب)" />
          </div>
        )}

        <MenuItem label="تنظیمات سایت" icon={Settings} hasSub subKey="settings" onClick={() => toggleMenu('settings')} />
        {expandedMenus.settings && (
          <div className="space-y-1 mb-2 bg-gray-50/50 rounded-xl p-1 animate-in slide-in-from-top-2">
            <SubItem id="navbar" label="تنظیمات ناوبار" />
            <SubItem id="footer" label="تنظیمات فوتر" />
          </div>
        )}

        <MenuItem id="reports" label="گزارش ها" icon={FileText} onClick={() => setActiveTab('reports')} />
        <MenuItem id="admins" label="ادمین ها" icon={Users} onClick={() => setActiveTab('admins')} />
      </nav>
      
      {/* بخش خروج - ثابت در پایین */}
      <div className="p-4 border-t border-gray-50 bg-white shrink-0">
        <button onClick={onLogout} className="w-full bg-red-50 text-red-500 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <LogOut size={20} /> خروج از پنل
        </button>
      </div>
    </aside>
  );
}