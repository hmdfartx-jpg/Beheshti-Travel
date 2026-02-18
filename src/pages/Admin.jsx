import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Loader2, Menu } from 'lucide-react';

// Components
import Login from '../components/admin/Login';
import Sidebar from '../components/admin/Sidebar';

// Tab Components
import Dashboard from '../components/admin/Dashboard';
import BookingsTab from '../components/admin/BookingsTab';
import HeroTab from '../components/admin/HeroTab';
import ServicesTab from '../components/admin/ServicesTab';
import WeatherTab from '../components/admin/WeatherTab';
import NewsTab from '../components/admin/NewsTab';
import AboutTab from '../components/admin/AboutTab';
import ContactTab from '../components/admin/ContactTab';
import NavbarTab from '../components/admin/NavbarTab';
import FooterTab from '../components/admin/FooterTab';
import ReportsTab from '../components/admin/ReportsTab';
import AdminsTab from '../components/admin/AdminsTab';

// اسکریپت ترجمه گوگل
const GOOGLE_TRANSLATE_URL = "https://script.google.com/macros/s/AKfycbyz_6Zw2PmqIFv5LFlx0ebLF0j52o0tEpFZ7Lw-W_kqRLTajbLazK9H5Wgzjmo5bd895w/exec";

export default function Admin({ news, bookings, settings, onUpdate, setPage, lang }) {
  // --- بررسی وضعیت لاگین (با حافظه سشن) ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      const parsed = JSON.parse(session);
      const now = new Date().getTime();
      // اگر هنوز منقضی نشده (۲۴ ساعت)
      if (now < parsed.expiry) return true;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State های داخلی برای مدیریت تغییرات قبل از ذخیره
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [teamMembers, setTeamMembers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // سینک کردن پراپ‌ها با استیت داخلی
  useEffect(() => {
    if (settings) {
       setLocalSettings(settings);
       setTeamMembers(settings.team || []);
       setAgencies(settings.agencies || []);
    }
  }, [settings]);

  // --- تابع کمکی ترجمه ---
  const fetchTranslation = async (text, targetLang) => {
    if (!text) return "";
    try {
        const url = `${GOOGLE_TRANSLATE_URL}?q=${encodeURIComponent(text)}&target=${targetLang}&source=fa`;
        const response = await fetch(url);
        const json = await response.json();
        return json.text || text;
    } catch (error) {
        console.error("Translation Error:", error);
        return text;
    }
  };

  // --- هندلرها ---

  const handleLogout = () => {
    if(window.confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
        localStorage.removeItem('admin_session');
        setIsAuthenticated(false);
        setPage('home');
    }
  };

  const handleSettingChange = (section, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section] || {},
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleServicesChange = (index, key, value) => {
     const newServices = [...(localSettings.services || [])];
     newServices[index] = { ...newServices[index], [key]: value };
     setLocalSettings(prev => ({ ...prev, services: newServices }));
     setHasChanges(true);
  };
  
  const handleWeatherUpdate = (newCities) => {
      setLocalSettings(prev => ({ ...prev, weather_cities: newCities }));
      setHasChanges(true);
  };

  // هندلرهای تیم
  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now(), name: '', role_dr: '', role_ps: '', role_en: '', image: '' }]);
    setHasChanges(true);
  };
  const handleTeamChange = (id, key, value) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [key]: value } : m));
    setHasChanges(true);
  };
  const handleDeleteMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    setHasChanges(true);
  };
  const handleTeamListUpdate = (newList) => {
      setTeamMembers(newList);
      setHasChanges(true);
  };

  // هندلرهای نمایندگی
  const handleAddAgency = () => {
    setAgencies([...agencies, { id: Date.now(), city_dr: '', address_dr: '', phone: '' }]);
    setHasChanges(true);
  };
  const handleAgencyChange = (id, key, value) => {
    setAgencies(agencies.map(a => a.id === id ? { ...a, [key]: value } : a));
    setHasChanges(true);
  };
  const handleDeleteAgency = (id) => {
    setAgencies(agencies.filter(a => a.id !== id));
    setHasChanges(true);
  };

  const handleStatusUpdate = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    if(onUpdate) onUpdate();
  };

  // ذخیره کلی تنظیمات در دیتابیس
  const saveSettings = async () => {
    setLoading(true);
    const finalSettings = {
        ...localSettings,
        team: teamMembers,
        agencies: agencies
    };
    
    try {
        const { data } = await supabase.from('site_settings').select('id').order('id', { ascending: true });
        // همیشه ردیف اول را آپدیت کن یا اگر نبود بساز
        if (data && data.length > 0) {
            await supabase.from('site_settings').update({ config: finalSettings }).eq('id', data[0].id);
        } else {
            await supabase.from('site_settings').insert([{ config: finalSettings }]);
        }
        alert('تنظیمات با موفقیت ذخیره شد!');
        setHasChanges(false);
        if(onUpdate) onUpdate();
    } catch (err) {
        alert('خطا در ذخیره سازی: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} lang={lang} setPage={setPage} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-[Vazirmatn]" dir="rtl">
      
      {/* سایدبار دسکتاپ */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setPage={setPage} 
        onLogout={handleLogout} 
      />

      {/* بخش اصلی محتوا:
         pt-20: دقیقاً ارتفاع ناوبار (80px).
         px-4 md:px-8: فاصله از چپ و راست.
         pb-8: فاصله از پایین.
         md:mr-64: برای سایدبار راست چین.
      */}
      <main className="flex-1 md:mr-64 px-4 md:px-8 pb-8 overflow-x-hidden transition-all pt-10"> 
        
        {/* هدر موبایل */}
        <div className="md:hidden mb-6 flex items-center justify-between pt-4">
           <h1 className="font-black text-gray-800 text-xl">پنل مدیریت</h1>
           <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="p-2 bg-white shadow rounded-lg text-[#058B8C]">
             <Menu />
           </button>
        </div>

        {/* دکمه ذخیره شناور */}
        {hasChanges && (
            <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-10">
                <button 
                  onClick={saveSettings}
                  disabled={loading}
                  className="bg-[#058B8C] text-white px-8 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform border-4 border-white/20"
                >
                   {loading ? <Loader2 className="animate-spin"/> : <Save size={20} />}
                   ذخیره تغییرات
                </button>
            </div>
        )}

        {/* کانتینر تب‌ها:
           w-full و max-w-7xl برای یکسان‌سازی عرض تمام تب‌ها
        */}
        <div className="w-full max-w-7xl mx-auto pb-20">
            {activeTab === 'dashboard' && <Dashboard bookings={bookings} news={news} />}
            {activeTab === 'bookings' && <BookingsTab bookings={bookings} onStatusUpdate={handleStatusUpdate} />}
            
            {activeTab === 'hero' && <HeroTab settings={localSettings} onUpdate={handleSettingChange} fetchTranslation={fetchTranslation} />}
            {activeTab === 'services' && <ServicesTab services={localSettings.services} onServiceUpdate={handleServicesChange} fetchTranslation={fetchTranslation} />}
            {activeTab === 'weather' && <WeatherTab cities={localSettings.weather_cities} onUpdateCities={handleWeatherUpdate} />}
            {activeTab === 'news' && <NewsTab news={news} onUpdate={onUpdate} fetchTranslation={fetchTranslation} />}
            
            {activeTab === 'about' && (
                <AboutTab 
                  settings={localSettings} 
                  team={teamMembers} 
                  onUpdate={handleSettingChange}
                  onTeamAdd={handleAddMember}
                  onTeamChange={handleTeamChange}
                  onTeamDelete={handleDeleteMember}
                  onTeamListUpdate={handleTeamListUpdate}
                  fetchTranslation={fetchTranslation}
                />
            )}
            {activeTab === 'contact_branches' && (
                <ContactTab 
                  settings={localSettings} 
                  agencies={agencies}
                  onUpdate={handleSettingChange}
                  onAgencyAdd={handleAddAgency}
                  onAgencyChange={handleAgencyChange}
                  onAgencyDelete={handleDeleteAgency}
                  fetchTranslation={fetchTranslation}
                />
            )}

            {activeTab === 'navbar' && <NavbarTab settings={localSettings} onUpdate={handleSettingChange} />}
            {activeTab === 'footer' && <FooterTab settings={localSettings} onUpdate={handleSettingChange} fetchTranslation={fetchTranslation} />}

            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'admins' && <AdminsTab />}
        </div>

      </main>

      <style jsx>{`
        .input-admin {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #F9FAFB;
          border-radius: 0.75rem;
          outline: none;
          font-size: 0.875rem;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .input-admin:focus {
          background-color: white;
          border-color: #058B8C;
          box-shadow: 0 0 0 3px rgba(5, 139, 140, 0.1);
        }
        .ltr { direction: ltr; text-align: left; }
      `}</style>
    </div>
  );
}