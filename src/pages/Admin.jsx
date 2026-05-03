import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, limit, addDoc } from 'firebase/firestore';
import { Loader2, Menu } from 'lucide-react';

import Login from '../components/admin/Login';
import Sidebar from '../components/admin/Sidebar';
import CustomAlert from '../components/admin/CustomAlert';

import HeroTab from '../components/admin/HeroTab';
import ServicesTab from '../components/admin/ServicesTab';
import WeatherTab from '../components/admin/WeatherTab';
import NewsTab from '../components/admin/NewsTab';
import AboutTab from '../components/admin/AboutTab';
import ContactTab from '../components/admin/ContactTab';
import NavbarTab from '../components/admin/NavbarTab';
import FooterTab from '../components/admin/FooterTab';
import AdminsTab from '../components/admin/AdminsTab';
import ClientsTab from '../components/admin/ClientsTab';

const GOOGLE_TRANSLATE_URL = "https://script.google.com/macros/s/AKfycbyz_6Zw2PmqIFv5LFlx0ebLF0j52o0tEpFZ7Lw-W_kqRLTajbLazK9H5Wgzjmo5bd895w/exec";

export default function Admin({ t, news, settings, onUpdate, lang, setPage }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('admin_active_tab') || 'hero'); 
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'info', title: '', message: '' });

  // مسدود کردن تمام آلرت‌های زشت و پیش‌فرض مرورگر در محیط مدیریت
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = () => {}; // خفه کردن آلرت‌ها
    
    return () => {
      window.alert = originalAlert; // بازگرداندن به حالت عادی هنگام خروج از ادمین
    };
  }, []);

  const showAlert = (type, title, message, onConfirm = null, showCancel = false, confirmText = 'تایید', cancelText = 'انصراف') => {
      setAlertConfig({ open: true, type, title, message, onConfirm, showCancel, confirmText, cancelText });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, open: false }));

  const requestTabChange = (tab) => {
      if (hasUnsavedChanges) {
          showAlert(
              'warning', 
              'تغییرات ذخیره نشده!', 
              'شما اطلاعاتی را وارد کرده‌اید اما دکمه ذخیره نهایی را نزده‌اید. با خروج از این بخش اطلاعات پاک می‌شوند. آیا خارج می‌شوید؟', 
              () => {
                  setHasUnsavedChanges(false);
                  changeTab(tab);
              }, 
              true, 
              'بله، خارج شو', 
              'می‌مانم'
          );
      } else {
          changeTab(tab);
      }
  };

  const changeTab = (tab) => {
      setActiveTab(tab);
      sessionStorage.setItem('admin_active_tab', tab);
      setIsMobileSidebarOpen(false);
  };
  
  const [localSettings, setLocalSettings] = useState(settings || {});

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    const sessionStr = localStorage.getItem('admin_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.expiry > new Date().getTime()) {
        setCurrentUser(session.user);
      } else {
        localStorage.removeItem('admin_session');
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    const sessionStr = localStorage.getItem('admin_session');
    if (sessionStr) setCurrentUser(JSON.parse(sessionStr).user);
  };

  const handleLogout = () => {
      showAlert('warning', 'خروج از حساب', 'آیا مایلید از پنل مدیریت خارج شوید؟', () => {
          localStorage.removeItem('admin_session');
          setCurrentUser(null);
          setPage('home');
      }, true, 'خروج', 'انصراف');
  };

  const fetchTranslation = async (text, targetLang) => {
      if(!text) return '';
      try {
          const res1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=fa&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
          if (res1.ok) {
              const data1 = await res1.json();
              const translated1 = data1[0].map(item => item[0]).join('');
              if (translated1 && translated1 !== text) return translated1;
          }
      } catch (e1) { console.warn("لایه اول ترجمه پاسخ نداد، سوییچ به لایه دوم..."); }

      try {
          const res2 = await fetch(`${GOOGLE_TRANSLATE_URL}?text=${encodeURIComponent(text)}&target=${targetLang}`);
          if (res2.ok) {
              const data2 = await res2.json();
              if (data2.translatedText && data2.translatedText !== text) return data2.translatedText;
          }
      } catch (e2) { console.warn("لایه دوم ترجمه هم پاسخ نداد."); }

      showAlert('danger', 'خطای ترجمه', `ارتباط با سرور مترجم برای زبان (${targetLang}) برقرار نشد. لطفاً اینترنت را چک کنید.`);
      return ''; 
  };

  const saveSettingsToFirebase = async (newConfig) => {
    try {
        const q = query(collection(db, 'site_settings'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
            const docId = snap.docs[0].id;
            await updateDoc(doc(db, 'site_settings', docId), { config: newConfig });
        } else {
            await addDoc(collection(db, 'site_settings'), { config: newConfig });
        }
    } catch (error) {
        console.error("Error saving to Firebase:", error);
        showAlert('danger', 'خطا', 'مشکلی در ارتباط با دیتابیس پیش آمد!');
        throw error; 
    }
  };

  const handleSettingChange = async (section, field, value) => {
      const newSettings = { ...localSettings };
      if (!newSettings[section]) newSettings[section] = {};
      if (field === null) newSettings[section] = value;
      else newSettings[section][field] = value;
      setLocalSettings(newSettings);
      
      try {
          await saveSettingsToFirebase(newSettings);
          // اجرای آپدیت سایت در پس‌زمینه و بدون نیاز به رفرش
          if (onUpdate) onUpdate();
          showAlert('success', 'ذخیره موفق', 'تغییرات با موفقیت در دیتابیس سایت ذخیره شد.');
      } catch (err) {
          console.error(err);
      }
  };

  const handleBatchUpdate = async (updatesArray) => {
      const newSettings = { ...localSettings };
      updatesArray.forEach(u => {
          if (!newSettings[u.section]) newSettings[u.section] = {};
          if (u.field === null) newSettings[u.section] = u.value;
          else newSettings[u.section][u.field] = u.value;
      });
      setLocalSettings(newSettings);
      
      try {
          await saveSettingsToFirebase(newSettings);
          setHasUnsavedChanges(false);
          // اجرای آپدیت سایت در پس‌زمینه
          if (onUpdate) onUpdate();
          showAlert('success', 'ذخیره موفق', 'اطلاعات با موفقیت در دیتابیس سایت ذخیره شد.');
      } catch (err) {
          throw err;
      }
  };

  const handleServiceUpdate = async (index, field, value) => {
      const newServices = [...(localSettings.services || [])];
      newServices[index][field] = value;
      handleSettingChange('services', null, newServices);
  };
  
  const handleAddAgency = async () => {
      const newAgency = { id: Date.now(), name_dr: 'شعبه جدید', name_ps: '', name_en: '', address_dr: '', address_ps: '', address_en: '', phone: '', map: '', whatsapp: '', telegram: '', instagram: '', facebook: '' };
      handleSettingChange('agencies', null, [...(localSettings.agencies || []), newAgency]);
  };
  
  const handleAgencyChange = async (id, field, value) => {
      const newAgencies = (localSettings.agencies || []).map(a => a.id === id ? { ...a, [field]: value } : a);
      handleSettingChange('agencies', null, newAgencies);
  };
  
  const handleDeleteAgency = async (id) => {
      showAlert('danger', 'حذف شعبه', 'آیا از حذف این شعبه مطمئن هستید؟', () => {
          const newAgencies = (localSettings.agencies || []).filter(a => a.id !== id);
          handleSettingChange('agencies', null, newAgencies);
      }, true);
  };

  if (isCheckingAuth) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]"><Loader2 className="animate-spin text-[#058B8C]" size={40} /></div>;
  if (!currentUser) return <Login onLogin={handleLogin} lang={lang} setPage={setPage} />;

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-[Vazirmatn]" dir="rtl">
        
        <CustomAlert open={alertConfig.open} config={alertConfig} onClose={closeAlert} />

        <div className={`fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-100 transform transition-transform duration-300 lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <Sidebar 
            activeTab={activeTab} 
            setActiveTab={requestTabChange} 
            setPage={setPage} 
            onLogout={handleLogout} 
            currentUser={currentUser} 
            />
        </div>

        {isMobileSidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>}

        <main className="flex-1 relative z-20 lg:mr-72 px-4 md:px-8 pb-32 pt-20 overflow-x-hidden transition-all custom-scrollbar"> 
            
            <div className="lg:hidden mb-6 flex items-center justify-between pt-4">
                <h1 className="font-black text-gray-800 text-xl">پنل مدیریت</h1>
                <button onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="p-2 bg-white shadow rounded-lg text-[#058B8C]">
                    <Menu />
                </button>
            </div>
            
            <div className="w-full max-w-7xl mx-auto">
                <div className="mt-4">
                    {activeTab === 'hero' && <HeroTab settings={localSettings} onUpdate={handleSettingChange} fetchTranslation={fetchTranslation} showAlert={showAlert} />}
                    
                    {activeTab === 'services' && <ServicesTab services={localSettings.services || []} onBatchUpdate={handleBatchUpdate} fetchTranslation={fetchTranslation} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}
                    {activeTab === 'contact' && <ContactTab settings={localSettings} agencies={localSettings.agencies || []} onBatchUpdate={handleBatchUpdate} fetchTranslation={fetchTranslation} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}
                    {activeTab === 'footer' && <FooterTab settings={localSettings} onBatchUpdate={handleBatchUpdate} fetchTranslation={fetchTranslation} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}

                    {activeTab === 'weather' && <WeatherTab cities={localSettings.weather_cities || []} onBatchUpdate={handleBatchUpdate} showAlert={showAlert} setHasUnsavedChanges={setHasUnsavedChanges} />}
                    {activeTab === 'about' && <AboutTab settings={localSettings} team={localSettings.team || []} onBatchUpdate={handleBatchUpdate} fetchTranslation={fetchTranslation} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}
                    {activeTab === 'clients' && <ClientsTab clients={localSettings.clients || []} onBatchUpdate={handleBatchUpdate} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}
                    {activeTab === 'navbar' && <NavbarTab settings={localSettings} onBatchUpdate={handleBatchUpdate} fetchTranslation={fetchTranslation} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}
                    
                    {activeTab === 'news' && <NewsTab onUpdate={onUpdate} fetchTranslation={fetchTranslation} setHasUnsavedChanges={setHasUnsavedChanges} showAlert={showAlert} />}
                    {activeTab === 'admins' && <AdminsTab currentUser={currentUser} showAlert={showAlert} />}
                </div>
            </div>
        </main>

      <style>{`
        .input-admin { width: 100%; padding: 0.75rem 1rem; background-color: #F9FAFB; border-radius: 0.75rem; outline: none; font-size: 0.875rem; transition: all 0.2s; border: 1px solid transparent; }
        .input-admin:focus { background-color: white; border-color: #058B8C; box-shadow: 0 0 0 3px rgba(5, 139, 140, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  );
}