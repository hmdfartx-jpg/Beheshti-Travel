import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Loader2, Menu } from 'lucide-react';

// Components
import Login from '../components/admin/Login';
import Sidebar from '../components/admin/Sidebar';
import CustomAlert from '../components/admin/CustomAlert'; // <--- ایمپورت جدید

// Tab Components
import Dashboard from '../components/admin/Dashboard';
import BookingsTab from '../components/admin/BookingsTab';
import CustomFlightsTab from '../components/admin/CustomFlightsTab';
import ExchangeRatesTab from '../components/admin/ExchangeRatesTab';
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


const GOOGLE_TRANSLATE_URL = "https://script.google.com/macros/s/AKfycbyz_6Zw2PmqIFv5LFlx0ebLF0j52o0tEpFZ7Lw-W_kqRLTajbLazK9H5Wgzjmo5bd895w/exec";

export default function Admin({ news, bookings, settings, onUpdate, setPage, lang }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      const parsed = JSON.parse(session);
      const now = new Date().getTime();
      if (now < parsed.expiry) return true;
    }
    return false;
  });

  // --- مدیریت سیستم آلرت (پاپ‌آپ) ---
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info', // success, danger, warning, info, copy
    showCancel: false,
    onConfirm: null,
    confirmText: 'تایید',
    cancelText: 'لغو'
  });

  // تابع کمکی برای نمایش آلرت
  const showAlert = ({ title, message, type = 'info', showCancel = false, onConfirm = null, confirmText = 'تایید', cancelText = 'انصراف' }) => {
    setAlertConfig({ open: true, title, message, type, showCancel, onConfirm, confirmText, cancelText });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, open: false }));
  };
  // -----------------------------------

  const [activeTab, setActiveTab] = useState('dashboard');
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [teamMembers, setTeamMembers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (settings) {
       setLocalSettings(settings);
       setTeamMembers(settings.team || []);
       setAgencies(settings.agencies || []);
    }
  }, [settings]);

  const fetchTranslation = async (text, targetLang) => {
    if (!text) return "";
    try {
        const url = `${GOOGLE_TRANSLATE_URL}?q=${encodeURIComponent(text)}&target=${targetLang}&source=fa`;
        const response = await fetch(url);
        const json = await response.json();
        return json.text || text;
    } catch (error) {
        console.error("Translation Error:", error);
        showAlert({ title: "خطا", message: "خطا در ترجمه خودکار", type: "warning" });
        return text;
    }
  };

  // --- هندلر خروج با آلرت کاستوم ---
  const handleLogout = () => {
    showAlert({
      title: "خروج از پنل",
      message: "آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید؟",
      type: "warning",
      showCancel: true,
      confirmText: "بله، خارج شو",
      onConfirm: () => {
        localStorage.removeItem('admin_session');
        setIsAuthenticated(false);
        setPage('home');
      }
    });
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

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now(), name: '', role_dr: '', role_ps: '', role_en: '', image: '' }]);
    setHasChanges(true);
  };
  const handleTeamChange = (id, key, value) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [key]: value } : m));
    setHasChanges(true);
  };
  
  // --- هندلر حذف عضو با آلرت کاستوم ---
  const handleDeleteMember = (id) => {
    showAlert({
      title: "حذف عضو تیم",
      message: "آیا از حذف این عضو اطمینان دارید؟ این عملیات قابل بازگشت نیست.",
      type: "danger",
      showCancel: true,
      confirmText: "حذف کن",
      onConfirm: () => {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
        setHasChanges(true);
        // showAlert({ title: "انجام شد", message: "عضو با موفقیت حذف شد", type: "success" }); // اختیاری
      }
    });
  };

  const handleTeamListUpdate = (newList) => {
      setTeamMembers(newList);
      setHasChanges(true);
  };

  const handleAddAgency = () => {
    setAgencies([...agencies, { id: Date.now(), city_dr: '', address_dr: '', phone: '' }]);
    setHasChanges(true);
  };
  const handleAgencyChange = (id, key, value) => {
    setAgencies(agencies.map(a => a.id === id ? { ...a, [key]: value } : a));
    setHasChanges(true);
  };

  // --- هندلر حذف نمایندگی با آلرت کاستوم ---
  const handleDeleteAgency = (id) => {
    showAlert({
      title: "حذف نمایندگی",
      message: "آیا از حذف این شعبه اطمینان دارید؟",
      type: "danger",
      showCancel: true,
      confirmText: "بله، حذف شود",
      onConfirm: () => {
        setAgencies(agencies.filter(a => a.id !== id));
        setHasChanges(true);
      }
    });
  };

  const handleStatusUpdate = async (id, status) => {
    // برای تغییر وضعیت رزرو هم می‌توان تاییدیه گرفت
    const statusText = status === 'confirmed' ? 'تایید' : 'رد';
    const type = status === 'confirmed' ? 'success' : 'warning';
    
    showAlert({
      title: `تغییر وضعیت به ${statusText}`,
      message: `آیا می‌خواهید وضعیت این رزرو را به "${statusText}" تغییر دهید؟`,
      type: type,
      showCancel: true,
      onConfirm: async () => {
        await supabase.from('bookings').update({ status }).eq('id', id);
        if(onUpdate) onUpdate();
      }
    });
  };

  // --- ذخیره تنظیمات با آلرت موفقیت/خطا ---
  const saveSettings = async () => {
    setLoading(true);
    const finalSettings = {
        ...localSettings,
        team: teamMembers,
        agencies: agencies
    };
    
    try {
        const { data } = await supabase.from('site_settings').select('id').order('id', { ascending: true });
        if (data && data.length > 0) {
            await supabase.from('site_settings').update({ config: finalSettings }).eq('id', data[0].id);
        } else {
            await supabase.from('site_settings').insert([{ config: finalSettings }]);
        }
        
        showAlert({
          title: "ذخیره موفق",
          message: "تمام تغییرات با موفقیت در سیستم ذخیره شدند.",
          type: "success"
        });
        
        setHasChanges(false);
        if(onUpdate) onUpdate();
    } catch (err) {
        showAlert({
          title: "خطا در ذخیره",
          message: "مشکلی در ذخیره اطلاعات پیش آمد: " + err.message,
          type: "warning"
        });
    } finally {
        setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} lang={lang} setPage={setPage} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-[Vazirmatn]" dir="rtl">
      
      {/* کامپوننت پاپ‌آپ سراسری */}
      <CustomAlert 
        open={alertConfig.open} 
        config={alertConfig} 
        onClose={closeAlert} 
      />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setPage={setPage} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 md:mr-64 px-4 md:px-8 pb-8 overflow-x-hidden transition-all pt-20"> 
        
        <div className="md:hidden mb-6 flex items-center justify-between pt-4">
           <h1 className="font-black text-gray-800 text-xl">پنل مدیریت</h1>
           <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="p-2 bg-white shadow rounded-lg text-[#058B8C]">
             <Menu />
           </button>
        </div>

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

        <div className="w-full max-w-7xl mx-auto pb-20">
            <div className="mt-4">
                {activeTab === 'dashboard' && <Dashboard bookings={bookings} news={news} />}
                {activeTab === 'bookings' && <BookingsTab bookings={bookings} onStatusUpdate={handleStatusUpdate} />}
                {activeTab === 'custom_flights' && <CustomFlightsTab />}
                {activeTab === 'exchange_rates' && <ExchangeRatesTab />}

                {activeTab === 'hero' && <HeroTab settings={localSettings} onUpdate={handleSettingChange} fetchTranslation={fetchTranslation} showAlert={showAlert} />}
                {activeTab === 'services' && <ServicesTab services={localSettings.services} onServiceUpdate={handleServicesChange} fetchTranslation={fetchTranslation} />}
                {activeTab === 'weather' && <WeatherTab cities={localSettings.weather_cities} onUpdateCities={handleWeatherUpdate} showAlert={showAlert} />}
                {activeTab === 'news' && <NewsTab news={news} onUpdate={onUpdate} fetchTranslation={fetchTranslation} showAlert={showAlert} />}
                
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