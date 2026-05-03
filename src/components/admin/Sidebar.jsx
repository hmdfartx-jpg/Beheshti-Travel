import React, { useState } from 'react';
import { 
  Image, Layers, CloudSun, FileText, Info, PhoneCall, 
  Layout, PanelBottom, Users, LogOut, Home, ChevronDown, MenuSquare
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, setPage, onLogout, currentUser }) {
  
  const [openMenus, setOpenMenus] = useState({
    content: true, 
    theme: true
  });

  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
        activeTab === id 
          ? 'bg-[#058B8C] text-white shadow-lg shadow-[#058B8C]/30 translate-x-1' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1'
      }`}
    >
      <Icon size={18} className={activeTab === id ? 'text-white' : 'text-gray-400'} />
      {label}
    </button>
  );

  return (
    <div className="w-72 bg-white border-l border-gray-100 h-screen flex flex-col shadow-2xl font-[Vazirmatn] relative z-50">
      
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-[#058B8C] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#058B8C]/30">
          B
        </div>
        <div>
          <h1 className="font-black text-gray-800 text-lg tracking-tight">بهشتی تراول</h1>
          <p className="text-[10px] text-gray-400 font-bold">پورتال مدیریت مرکزی</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">

        {/* محتوای سایت */}
        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
          <button onClick={() => toggleMenu('content')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
             <div className="flex items-center gap-2 font-black text-gray-700 text-sm">
                <FileText size={18} className="text-[#058B8C]"/> محتوای سایت
             </div>
             <ChevronDown size={16} className={`text-gray-400 transition-transform ${openMenus.content ? 'rotate-180' : ''}`}/>
          </button>
          
          {openMenus.content && (
            <div className="p-3 pt-0 space-y-1">
              <NavItem id="hero" icon={Image} label="هیرو (صفحه اصلی)" />
              <NavItem id="services" icon={Layers} label="خدمات ما" />
              <NavItem id="news" icon={FileText} label="مدیریت اخبار" />
              <NavItem id="about" icon={Info} label="درباره ما و تیم" />
              <NavItem id="contact" icon={PhoneCall} label="تماس و شعبات" />
            </div>
          )}
        </div>

        {/* تنظیمات قالب و منوها */}
        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
          <button onClick={() => toggleMenu('theme')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
             <div className="flex items-center gap-2 font-black text-gray-700 text-sm">
                <Layout size={18} className="text-[#058B8C]"/> تنظیمات سایت
             </div>
             <ChevronDown size={16} className={`text-gray-400 transition-transform ${openMenus.theme ? 'rotate-180' : ''}`}/>
          </button>
          
          {openMenus.theme && (
            <div className="p-3 pt-0 space-y-1">
              <NavItem id="navbar" icon={MenuSquare} label="ناوبار و منوها" />
              <NavItem id="footer" icon={PanelBottom} label="فوتر (Footer)" />
              <NavItem id="weather" icon={CloudSun} label="ویجت آب و هوا" />
            </div>
          )}
        </div>

      </div>

      <div className="p-4 border-t border-gray-100 bg-white space-y-2 sticky bottom-0">
         <button onClick={() => setPage('home')} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition font-bold text-sm">
            <Home size={18}/> مشاهده سایت
         </button>
         <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition font-bold text-sm">
            <LogOut size={18}/> خروج از حساب
         </button>
      </div>
    </div>
  );
}