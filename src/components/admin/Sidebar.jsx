import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  PlaneTakeoff, 
  Image, 
  Layers, 
  CloudSun, 
  FileText, 
  Info, 
  PhoneCall, 
  Layout, 
  PanelBottom, 
  BarChart, 
  Users, 
  LogOut, 
  Home, 
  ChevronDown, 
  DollarSign 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  setPage, 
  onLogout, 
  currentUser 
}) {
  
  // استیت باز و بسته بودن منوهای کشویی
  const [openMenus, setOpenMenus] = useState({
    reservations: true, 
    content: false, 
    about: false, 
    theme: false, 
    system: false
  });

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({ 
      ...prev, 
      [menuKey]: !prev[menuKey] 
    }));
  };

  // --- سیستم چک کردن دسترسی‌ها (دیوار امنیتی سایدبار) ---
  const hasAccess = (moduleId) => {
    if (!currentUser) return false;
    
    // سوپر ادمین همیشه به همه چیز دسترسی دارد
    if (currentUser.role === 'super_admin') return true;
    
    // برای ادمین‌های محدود، چک کن آیا تیک 'view' برای این ماژول را دارند یا نه
    if (
      currentUser.permissions && 
      currentUser.permissions[moduleId]?.includes('view')
    ) {
      return true;
    }
    
    return false;
  };

  // بررسی اینکه آیا کاربر سوپر ادمین است (برای بخش‌های خاص مثل مدیریت مدیران)
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // کامپوننت دکمه اصلی (بدون زیرمجموعه)
  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-[#058B8C] text-white shadow-lg shadow-[#058B8C]/30' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-[#058B8C]'
      }`}
    >
      <Icon size={20}/> 
      <span className="font-black text-sm">{label}</span>
    </button>
  );

  // کامپوننت دکمه‌های زیرمجموعه
  const SubMenuItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-[#058B8C]/10 text-[#058B8C] font-black' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-bold'
      }`}
    >
      <Icon size={18} /> 
      <span className="text-sm">{label}</span>
      {activeTab === id && (
        <div className="mr-auto w-1.5 h-1.5 rounded-full bg-[#058B8C]"></div>
      )}
    </button>
  );

  return (
    <aside 
      className="w-72 bg-white border-l border-gray-200 fixed right-0 top-0 bottom-0 z-40 flex flex-col shadow-xl font-[Vazirmatn]" 
      dir="rtl"
    >
      
      {/* --- هدر سایدبار --- */}
      <div className="p-6 border-b border-gray-100 flex flex-col items-center justify-center sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-black text-[#058B8C]">
            پنل مدیریت
        </h2>
        
        {/* این بخش نام و نقش کاربر را نشان می‌دهد */}
        <span className="text-[10px] font-bold text-gray-400 mt-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
           {currentUser?.name || 'مدیر'} ({isSuperAdmin ? 'سوپر ادمین' : 'ادمین محدود'})
        </span>
      </div>

      {/* --- لیست منوهای هوشمند --- */}
      <div className="p-4 flex-1 space-y-3 overflow-y-auto custom-scrollbar">
        
        {/* داشبورد: اگر دسترسی به رزرو یا مالی داشته باشد نشان داده می‌شود */}
        {(hasAccess('reservations') || hasAccess('finance')) && (
           <NavItem 
              id="dashboard" 
              icon={LayoutDashboard} 
              label="داشبورد آماری" 
           />
        )}

        {/* --- گروه ۱: مدیریت رزروها --- */}
        {(hasAccess('reservations') || hasAccess('finance')) && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button 
              onClick={() => toggleMenu('reservations')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-800 font-black">
                <Ticket size={20} className="text-[#058B8C]" /> 
                مدیریت رزروها
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${
                  openMenus.reservations ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openMenus.reservations 
                  ? 'max-h-64 opacity-100 p-3 space-y-1' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              {hasAccess('reservations') && (
                <SubMenuItem 
                  id="bookings" 
                  icon={Ticket} 
                  label="لیست رزروها" 
                />
              )}
              {hasAccess('reservations') && (
                <SubMenuItem 
                  id="custom_flights" 
                  icon={PlaneTakeoff} 
                  label="مدیریت پروازهای دستی" 
                />
              )}
              {hasAccess('finance') && (
                <SubMenuItem 
                  id="exchange_rates" 
                  icon={DollarSign} 
                  label="نرخ اسعار روزانه" 
                />
              )}
            </div>
          </div>
        )}

        {/* --- گروه ۲: محتوای صفحه اصلی --- */}
        {hasAccess('content') && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button 
              onClick={() => toggleMenu('content')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-800 font-black">
                <Layout size={20} className="text-gray-400" /> 
                محتوای سایت
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${
                  openMenus.content ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openMenus.content 
                  ? 'max-h-64 opacity-100 p-3 space-y-1' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <SubMenuItem 
                id="hero" 
                icon={Image} 
                label="هیرو سکشن (اسلایدر)" 
              />
              <SubMenuItem 
                id="services" 
                icon={Layers} 
                label="خدمات ما" 
              />
              <SubMenuItem 
                id="weather" 
                icon={CloudSun} 
                label="آب و هوا" 
              />
              <SubMenuItem 
                id="news" 
                icon={FileText} 
                label="اخبار و اطلاعیه‌ها" 
              />
            </div>
          </div>
        )}

        {/* --- گروه ۳: ارتباطات --- */}
        {hasAccess('settings') && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button 
              onClick={() => toggleMenu('about')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-800 font-black">
                <Info size={20} className="text-gray-400" /> 
                ارتباطات و معرفی
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${
                  openMenus.about ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openMenus.about 
                  ? 'max-h-40 opacity-100 p-3 space-y-1' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <SubMenuItem 
                id="about" 
                icon={Info} 
                label="تنظیمات درباره ما" 
              />
              <SubMenuItem 
                id="contact_branches" 
                icon={PhoneCall} 
                label="تماس و نمایندگی‌ها" 
              />
            </div>
          </div>
        )}

        {/* --- گروه ۴: تنظیمات قالب --- */}
        {hasAccess('settings') && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button 
              onClick={() => toggleMenu('theme')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-800 font-black">
                <PanelBottom size={20} className="text-gray-400" /> 
                تنظیمات قالب
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${
                  openMenus.theme ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openMenus.theme 
                  ? 'max-h-40 opacity-100 p-3 space-y-1' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <SubMenuItem 
                id="navbar" 
                icon={Layout} 
                label="منوی بالا (Navbar)" 
              />
              <SubMenuItem 
                id="footer" 
                icon={PanelBottom} 
                label="پاورقی (Footer)" 
              />
            </div>
          </div>
        )}

        {/* --- گروه ۵: سیستم --- */}
        {/* این گروه فقط به کسانی نمایش داده می‌شود که دسترسی ستینگ دارند یا سوپر ادمین هستند */}
        {(hasAccess('settings') || isSuperAdmin) && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button 
              onClick={() => toggleMenu('system')} 
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3 text-gray-800 font-black">
                <Users size={20} className="text-gray-400" /> 
                سیستم و ادمین
              </div>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform duration-300 ${
                  openMenus.system ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openMenus.system 
                  ? 'max-h-40 opacity-100 p-3 space-y-1' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              {hasAccess('settings') && (
                <SubMenuItem 
                  id="reports" 
                  icon={BarChart} 
                  label="گزارش‌ها و آمار" 
                />
              )}
              
              {/* تب مدیریت مدیران فقط و فقط برای سوپر ادمین باز می‌شود */}
              {isSuperAdmin && (
                <SubMenuItem 
                  id="admins" 
                  icon={Users} 
                  label="مدیریت مدیران" 
                />
              )}
            </div>
          </div>
        )}

      </div>

      {/* --- فوتر سایدبار --- */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-2 sticky bottom-0">
         <button 
            onClick={() => setPage('home')} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition font-bold text-sm"
         >
            <Home size={18}/> 
            مشاهده سایت
         </button>
         
         <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition font-bold text-sm"
         >
            <LogOut size={18}/> 
            خروج از حساب
         </button>
      </div>
      
      {/* استایل‌های اسکرول‌بار مخفی */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { 
            width: 4px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
            background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: #E5E7EB; 
            border-radius: 10px; 
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { 
            background: #D1D5DB; 
        }
      `}</style>
    </aside>
  );
}