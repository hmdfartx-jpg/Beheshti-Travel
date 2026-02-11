import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash, Megaphone, Ticket, User, Phone, CheckCircle, XCircle, Edit, Copy, X, Save, Settings, GripVertical, Check, CreditCard, Clock, Calendar, Lock, ArrowRight, RefreshCw, Eye, EyeOff, Image, LogOut, Layout, Globe, Sparkles, Loader2, Pin } from 'lucide-react';

// لیست تایم‌زون‌ها
const VALID_TIMEZONES = [
  { label: "کابل (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "تهران (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "دبی (Asia/Dubai)", value: "Asia/Dubai" },
  { label: "استانبول (Europe/Istanbul)", value: "Europe/Istanbul" },
  { label: "لندن (Europe/London)", value: "Europe/London" },
  { label: "برلین (Europe/Berlin)", value: "Europe/Berlin" },
  { label: "نیویورک (America/New_York)", value: "America/New_York" },
  { label: "تورنتو (America/Toronto)", value: "America/Toronto" },
];

// 🔴🔴🔴 لینک اسکریپت گوگل خود را اینجا قرار دهید 🔴🔴🔴
const GOOGLE_TRANSLATE_URL = "https://script.google.com/macros/s/AKfycbyz_6Zw2PmqIFv5LFlx0ebLF0j52o0tEpFZ7Lw-W_kqRLTajbLazK9H5Wgzjmo5bd895w/exec";

// دیکشنری ترجمه برای صفحه لاگین
const loginTranslations = {
  dr: {
    title: "ورود به پنل مدیریت",
    subtitle: "امنیت بالا، مدیریت آسان",
    user: "نام کاربری",
    pass: "رمز عبور",
    captcha: "کد امنیتی",
    btn: "ورود به سیستم",
    back: "بازگشت به صفحه اصلی",
    error_captcha: "کد امنیتی اشتباه است!",
    error_auth: "نام کاربری یا رمز عبور اشتباه است",
    ph_user: "نام کاربری",
    ph_pass: "رمز عبور"
  },
  ps: {
    title: "د مدیریت پینل ته ننوتل",
    subtitle: "لوړ امنیت، اسانه مدیریت",
    user: "کارن نوم",
    pass: "پټ نوم",
    captcha: "امنیتي کوډ",
    btn: "سیستم ته ننوتل",
    back: "اصلي پاڼې ته ستنیدل",
    error_captcha: "امنیتي کوډ غلط دی!",
    error_auth: "کارن نوم یا پټ نوم غلط دی",
    ph_user: "کارن نوم",
    ph_pass: "پټ نوم"
  },
  en: {
    title: "Admin Panel Login",
    subtitle: "High Security, Easy Management",
    user: "Username",
    pass: "Password",
    captcha: "Security Code",
    btn: "Login to System",
    back: "Back to Home",
    error_captcha: "Invalid Security Code!",
    error_auth: "Invalid Username or Password",
    ph_user: "Username",
    ph_pass: "Password"
  }
};

export default function Admin({ news, bookings, settings, onUpdate, setPage, lang }) {
  // 1. ابتدا تعریف تمام Stateها و هوک‌ها
  // --- مدیریت لاگین ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '', captcha: '' });
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- مدیریت تب‌ها و داده‌ها ---
  const [activeTab, setActiveTab] = useState('bookings');
  const [settingsTab, setSettingsTab] = useState('general');
  const [localSettings, setLocalSettings] = useState(settings || {});
  
  // استیت اخبار (با فیلدهای سه زبانه)
  const [newNews, setNewNews] = useState({ 
    title: '', desc: '', 
    title_ps: '', desc_ps: '', 
    title_en: '', desc_en: '',
    img: '' 
  });
  
  const [editingId, setEditingId] = useState(null);
  const [editingCityId, setEditingCityId] = useState(null);
  const [tempSliderImage, setTempSliderImage] = useState('');
  const [translatingField, setTranslatingField] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // 2. سپس توابع کمکی و افکت‌ها
  // --- تابع ترجمه واقعی با استفاده از اسکریپت گوگل ---
  const fetchTranslation = async (text, targetLang) => {
    if (!text) return "";
    if (GOOGLE_TRANSLATE_URL.includes("PASTE_YOUR")) {
        alert("لطفا ابتدا لینک اسکریپت گوگل را در فایل Admin.jsx قرار دهید!");
        return text;
    }

    try {
        const url = `${GOOGLE_TRANSLATE_URL}?q=${encodeURIComponent(text)}&target=${targetLang}&source=fa`;
        const response = await fetch(url);
        const json = await response.json();
        return json.text || text;
    } catch (error) {
        console.error("Translation Error:", error);
        alert("خطا در ترجمه. لطفا اتصال اینترنت یا لینک اسکریپت را چک کنید.");
        return text;
    }
  };

  // هندلر دکمه ترجمه هوشمند برای اخبار
  const handleSmartFillNews = async (targetLang) => {
    if (!newNews.title) return alert("لطفا ابتدا تیتر فارسی را وارد کنید.");
    setTranslatingField(targetLang); 
    
    try {
        const transTitle = await fetchTranslation(newNews.title, targetLang);
        const transDesc = newNews.desc ? await fetchTranslation(newNews.desc, targetLang) : "";

        // استفاده از callback برای اطمینان از اینکه آخرین state را داریم
        setNewNews(prev => ({
            ...prev,
            [`title_${targetLang}`]: transTitle,
            [`desc_${targetLang}`]: transDesc
        }));
    } catch (e) {
        console.error(e);
    } finally {
        setTranslatingField(null);
    }
  };

  // هندلر ترجمه برای تنظیمات (هیرو)
  const handleSmartFillHero = async (targetLang) => {
      const title = localSettings.hero?.title_dr;
      const subtitle = localSettings.hero?.subtitle_dr;
      
      if (!title) return alert("لطفا ابتدا تیتر فارسی را وارد کنید.");
      setTranslatingField(`hero_${targetLang}`);
      
      const tTitle = await fetchTranslation(title, targetLang);
      const tSub = subtitle ? await fetchTranslation(subtitle, targetLang) : "";
      
      setLocalSettings(prev => ({
          ...prev,
          hero: {
              ...(prev.hero || {}),
              [`title_${targetLang}`]: tTitle,
              [`subtitle_${targetLang}`]: tSub
          }
      }));
      setTranslatingField(null);
  };

  // هندلر ترجمه برای سرویس‌ها
  const handleSmartFillService = async (index, targetLang) => {
      const service = localSettings.services[index];
      if (!service.title) return alert("عنوان فارسی خالی است.");
      setTranslatingField(`service_${index}_${targetLang}`);
      
      const tTitle = await fetchTranslation(service.title, targetLang);
      const tDesc = service.desc ? await fetchTranslation(service.desc, targetLang) : "";

      setLocalSettings(prev => {
          const updatedServices = [...(prev.services || [])];
          updatedServices[index] = {
              ...updatedServices[index],
              [`title_${targetLang}`]: tTitle,
              [`desc_${targetLang}`]: tDesc
          };
          return { ...prev, services: updatedServices };
      });
      setTranslatingField(null);
  };

  // هندلر ترجمه برای فوتر
  const handleSmartFillFooter = async (targetLang) => {
      const aboutTitle = localSettings.about?.title || localSettings.about?.title_dr;
      const aboutDesc = localSettings.about?.desc || localSettings.about?.desc_dr;
      const address = localSettings.contact?.address || localSettings.contact?.address_dr;
      const copyright = localSettings.contact?.copyright || localSettings.contact?.copyright_dr;
      
      if (!aboutTitle && !address) return alert("لطفا اطلاعات فارسی را وارد کنید.");
      
      setTranslatingField(`footer_${targetLang}`);

      const tAboutTitle = aboutTitle ? await fetchTranslation(aboutTitle, targetLang) : "";
      const tAboutDesc = aboutDesc ? await fetchTranslation(aboutDesc, targetLang) : "";
      const tAddress = address ? await fetchTranslation(address, targetLang) : "";
      const tCopyright = copyright ? await fetchTranslation(copyright, targetLang) : "";

      setLocalSettings(prev => ({
          ...prev,
          about: {
              ...(prev.about || {}),
              [`title_${targetLang}`]: tAboutTitle,
              [`desc_${targetLang}`]: tAboutDesc
          },
          contact: {
              ...(prev.contact || {}),
              [`address_${targetLang}`]: tAddress,
              [`copyright_${targetLang}`]: tCopyright
          }
      }));
      setTranslatingField(null);
  };

  const generateCaptcha = () => {
    const chars = "0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
    // فقط اگر ستینگز جدیدی آمد و لوکال ستینگز خالی بود آپدیت کن تا تغییرات دستی نپرد
    if(settings && Object.keys(settings).length > 0) {
        setLocalSettings(settings);
    }
  }, [settings]);

  const handleLogin = (e) => {
    e.preventDefault();
    const t = loginTranslations[lang || 'dr'];
    if (loginData.captcha !== generatedCaptcha) {
      alert(t.error_captcha);
      generateCaptcha();
      setLoginData({ ...loginData, captcha: '' });
      return;
    }
    
    if (loginData.username === 'admin' && loginData.password === '123456') {
      setIsAuthenticated(true);
    } else {
      alert(t.error_auth);
      generateCaptcha();
      setLoginData({ ...loginData, password: '', captcha: '' });
    }
  };

  // توابع ذخیره تنظیمات
  const saveSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('id').limit(1).single();
      if (data) {
        const { error } = await supabase.from('site_settings').update({ config: localSettings }).eq('id', data.id);
        if (!error) { alert('تنظیمات با موفقیت ذخیره شد!'); onUpdate(); } else { alert('خطا در ذخیره تنظیمات'); }
      } else {
        await supabase.from('site_settings').insert([{ config: localSettings }]);
        onUpdate();
      }
    } catch (err) { console.error(err); }
  };

  const handleSettingChange = (section, key, value) => {
    setLocalSettings(prev => {
      if (key === null) return { ...prev, [section]: value };
      return { ...prev, [section]: { ...prev[section], [key]: value } };
    });
  };

  const handleAddSliderImage = () => {
      if (!tempSliderImage) return;
      const currentImages = localSettings.hero?.images || [];
      handleSettingChange('hero', 'images', [...currentImages, tempSliderImage]);
      setTempSliderImage('');
  };

  const handleRemoveSliderImage = (index) => {
      const currentImages = localSettings.hero?.images || [];
      const updated = currentImages.filter((_, i) => i !== index);
      handleSettingChange('hero', 'images', updated);
  };

  const handleServiceChange = (index, key, value) => {
    setLocalSettings(prev => {
        const updatedServices = [...(prev.services || [])];
        updatedServices[index] = { ...updatedServices[index], [key]: value };
        return { ...prev, services: updatedServices };
    });
  };

  // توابع شهرها
  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
  const handleSort = () => {
    const _cities = [...(localSettings.weather_cities || [])];
    const item = _cities[dragItem.current];
    _cities.splice(dragItem.current, 1);
    _cities.splice(dragOverItem.current, 0, item);
    dragItem.current = null; dragOverItem.current = null;
    handleSettingChange('weather_cities', null, _cities);
  };
  const handleDuplicateCity = (city) => {
    const newCity = { ...city, id: Date.now(), name: city.name, faName: city.faName + ' (کپی)', countryName: city.countryName || '' };
    const updated = [...(localSettings.weather_cities || []), newCity];
    handleSettingChange('weather_cities', null, updated);
  };
  const handleDeleteCity = (index) => {
    if(window.confirm('آیا مطمئن هستید؟')) {
      const updated = localSettings.weather_cities.filter((_, i) => i !== index);
      handleSettingChange('weather_cities', null, updated);
    }
  };

  // توابع اخبار
  const handleSubmitNews = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    
    // استفاده از مقادیر موجود در state
    // توجه: کلیدهای آبجکت باید دقیقا با نام ستون‌های دیتابیس که در مرحله اول ساختید یکی باشند
    const newsData = {
        title: newNews.title, 
        description: newNews.desc,
        title_ps: newNews.title_ps,
        description_ps: newNews.desc_ps, // نگاشت state به نام ستون دیتابیس
        title_en: newNews.title_en,
        description_en: newNews.desc_en, // نگاشت state به نام ستون دیتابیس
        image_url: newNews.img
    };

    if (editingId) {
      // هنگام ویرایش، تاریخ را تغییر نمی‌دهیم
      const { error } = await supabase.from('news').update(newsData).eq('id', editingId);
      if (!error) { alert('ویرایش شد'); setEditingId(null); onUpdate(); } else { alert('خطا در ویرایش: ' + error.message); }
    } else {
      const { error } = await supabase.from('news').insert([{ ...newsData, pinned: false, created_at: currentDate }]);
      if (!error) { alert('ثبت شد'); onUpdate(); } else { alert('خطا در ثبت: ' + error.message); }
    }
    setNewNews({ title: '', desc: '', title_ps: '', desc_ps: '', title_en: '', desc_en: '', img: '' });
  };

  const handleDeleteNews = async (id) => { if(window.confirm('حذف؟')) { await supabase.from('news').delete().eq('id', id); onUpdate(); }};
  const handleTogglePin = async (id, status) => { await supabase.from('news').update({ pinned: !status }).eq('id', id); onUpdate(); };
  const handleDuplicateNews = async (item) => { 
      await supabase.from('news').insert([{ 
          title: `${item.title} (کپی)`, 
          description: item.description,
          title_ps: item.title_ps,
          description_ps: item.description_ps,
          title_en: item.title_en,
          description_en: item.description_en,
          image_url: item.image_url, 
          pinned: false 
      }]); 
      onUpdate();
  };
  const handleEditNews = (item) => { 
      setNewNews({ 
          title: item.title, desc: item.description, 
          title_ps: item.title_ps || '', desc_ps: item.description_ps || '',
          title_en: item.title_en || '', desc_en: item.description_en || '',
          img: item.image_url 
      });
      setEditingId(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // توابع رزرو
  const handleChangeStatus = async (id, s) => { if(window.confirm('تغییر وضعیت؟')) { await supabase.from('bookings').update({ status: s }).eq('id', id); onUpdate(); }};
  const handleDeleteBooking = async (id) => { if(window.confirm('حذف؟')) { await supabase.from('bookings').delete().eq('id', id); onUpdate(); }};
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">تایید شده</span>;
      case 'pending_verification': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200 animate-pulse">منتظر تایید</span>;
      case 'pending_payment': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">منتظر پرداخت</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">لغو شده</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  // 3. بخش رندر شرطی لاگین
  if (!isAuthenticated) {
    const currentLoginLang = lang || 'dr';
    const t = loginTranslations[currentLoginLang];
    const dir = currentLoginLang === 'en' ? 'ltr' : 'rtl';
    const alignClass = currentLoginLang === 'en' ? 'text-left' : 'text-right';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-[Vazirmatn]" dir={dir}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-300 relative">
          
          <div className="bg-[#1e3a8a] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
               <Lock className="text-white" size={32}/>
            </div>
            <h2 className="text-2xl font-black text-white">{t.title}</h2>
            <p className="text-blue-200 text-sm mt-2">{t.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className={`block text-xs font-bold text-gray-500 mb-1 ${alignClass}`}>{t.user}</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <User size={18} className="text-gray-400"/>
                <input 
                  type="text" 
                  value={loginData.username}
                  onChange={e => setLoginData({...loginData, username: e.target.value})}
                  className={`bg-transparent outline-none w-full text-sm font-bold text-gray-800 ${alignClass}`}
                  placeholder={t.ph_user}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold text-gray-500 mb-1 ${alignClass}`}>{t.pass}</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-white transition-all">
                 <Lock size={18} className="text-gray-400"/>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  className={`bg-transparent outline-none w-full text-sm font-bold text-gray-800 ${alignClass}`}
                  placeholder={t.ph_pass}
               />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold text-gray-500 mb-1 ${alignClass}`}>{t.captcha}</label>
              <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <CheckCircle size={18} className="text-gray-400"/>
                    <input 
                      type="tel" 
                      maxLength={4}
                      value={loginData.captcha}
                      onChange={e => setLoginData({...loginData, captcha: e.target.value})}
                      className="bg-transparent outline-none w-full text-sm font-bold text-gray-800 tracking-widest text-center"
                      placeholder="_ _ _ _"
                    />
                 </div>
                 <div 
                    className="bg-[#f0f9ff] border border-blue-100 rounded-xl px-4 flex items-center justify-center gap-3 min-w-[120px] select-none cursor-pointer hover:bg-blue-50 transition" 
                    onClick={generateCaptcha} 
                    title="Refresh"
                 >
                    <span className="font-mono text-xl font-black text-blue-600 tracking-widest">{generatedCaptcha}</span>
                    <RefreshCw size={16} className="text-blue-400"/>
                 </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1e3a8a] hover:bg-blue-900 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4">
               {t.btn} <ArrowRight size={18} className={currentLoginLang === 'en' ? "" : "rotate-180"}/>
            </button>

            <button 
              type="button" 
              onClick={() => setPage && setPage('home')}
              className="w-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
               {t.back}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. رندر اصلی پنل مدیریت
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px] font-[Vazirmatn]" dir="rtl">
      <div className="bg-[#058B8C] p-6 text-white flex justify-between items-center">
        <h1 className="text-2xl font-black">پنل مدیریت (فارسی)</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition font-bold flex items-center gap-2">
           <LogOut size={16}/> خروج
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-full">
         {/* منوی راست */}
        <div className="w-full md:w-64 bg-gray-50 p-4 border-l border-gray-200 space-y-2 shrink-0">
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Ticket size={20}/> رزروها</button>
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'news' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Megaphone size={20}/> اخبار</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Settings size={20}/> تنظیمات</button>
        </div>

        {/* محتوای اصلی */}
        <div className="flex-1 p-6 bg-gray-50/50 overflow-x-auto">
          
          {/* بخش تنظیمات */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in pb-20">
               <div className="flex gap-2 overflow-x-auto pb-2 border-b">
                {['general', 'navbar', 'hero', 'weather', 'services', 'footer'].map(tab => (
                  <button key={tab} onClick={() => setSettingsTab(tab)} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${settingsTab === tab ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {tab === 'general' ? 'عمومی' : tab === 'navbar' ? 'ناوبار (منو)' : tab === 'hero' ? 'هیرو و آمار' : tab === 'weather' ? 'آب و هوا' : tab === 'services' ? 'خدمات' : 'فوتر'}
                  </button>
                ))}
              </div>

              {settingsTab === 'general' && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                  <h3 className="font-bold border-b pb-2">تنظیمات اصلی</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">نام برند</label><input value={localSettings.general?.brandName || ''} onChange={e => handleSettingChange('general', 'brandName', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">متن لوگو</label><input value={localSettings.general?.logoText || ''} onChange={e => handleSettingChange('general', 'logoText', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                  </div>
                </div>
              )}

              {/* تنظیمات ناوبار */}
              {settingsTab === 'navbar' && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                  <h3 className="font-bold border-b pb-2 text-[#058B8C]">تنظیمات ناوبار (سه زبانه)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                      {/* دری */}
                      <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl">
                          <h4 className="font-bold text-xs text-blue-600 mb-2">نسخه دری</h4>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">عنوان (دری)</label><input value={localSettings.navbar?.title_dr || ''} onChange={e => handleSettingChange('navbar', 'title_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان (دری)</label><input value={localSettings.navbar?.subtitle_dr || ''} onChange={e => handleSettingChange('navbar', 'subtitle_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                      </div>
                      {/* پشتو */}
                      <div className="space-y-3 bg-green-50/50 p-4 rounded-xl">
                           <h4 className="font-bold text-xs text-green-600 mb-2">نسخه پشتو</h4>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">عنوان (پشتو)</label><input value={localSettings.navbar?.title_ps || ''} onChange={e => handleSettingChange('navbar', 'title_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان (پشتو)</label><input value={localSettings.navbar?.subtitle_ps || ''} onChange={e => handleSettingChange('navbar', 'subtitle_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                      </div>
                      {/* انگلیسی */}
                      <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl" dir="ltr">
                          <h4 className="font-bold text-xs text-orange-600 mb-2">English Version</h4>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">Title (En)</label><input value={localSettings.navbar?.title_en || ''} onChange={e => handleSettingChange('navbar', 'title_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">Subtitle (En)</label><input value={localSettings.navbar?.subtitle_en || ''} onChange={e => handleSettingChange('navbar', 'subtitle_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                      </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                      <label className="block text-xs font-bold text-gray-500 mb-1">متن داخل لوگو (مشترک)</label>
                      <input value={localSettings.navbar?.logoText || ''} onChange={e => handleSettingChange('navbar', 'logoText', e.target.value)} className="w-full md:w-1/2 p-2 border rounded-lg font-mono text-center"/>
                  </div>
                </div>
              )}

              {settingsTab === 'hero' && (
                <div className="space-y-6">
                   {/* تنظیمات متن سه زبانه هیرو */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2 text-[#058B8C]">متن‌های هیرو (سه زبانه)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* دری */}
                        <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl">
                            <h4 className="font-bold text-xs text-blue-600 mb-2">نسخه دری</h4>
                             <div><label className="block text-xs font-bold text-gray-500 mb-1">تیتر اصلی</label><input value={localSettings.hero?.title_dr || ''} onChange={e => handleSettingChange('hero', 'title_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان</label><input value={localSettings.hero?.subtitle_dr || ''} onChange={e => handleSettingChange('hero', 'subtitle_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                        {/* پشتو */}
                        <div className="space-y-3 bg-green-50/50 p-4 rounded-xl">
                             <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs text-green-600">نسخه پشتو</h4>
                                <button type="button" onClick={() => handleSmartFillHero('ps')} className="text-[9px] flex items-center gap-1 bg-green-200 text-green-800 px-2 py-0.5 rounded hover:bg-green-300">
                                    {translatingField === 'hero_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه
                                </button>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">تیتر اصلی</label><input value={localSettings.hero?.title_ps || ''} onChange={e => handleSettingChange('hero', 'title_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان</label><input value={localSettings.hero?.subtitle_ps || ''} onChange={e => handleSettingChange('hero', 'subtitle_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                        {/* انگلیسی */}
                        <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl" dir="ltr">
                             <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs text-orange-600">English Version</h4>
                                <button type="button" onClick={() => handleSmartFillHero('en')} className="text-[9px] flex items-center gap-1 bg-orange-200 text-orange-800 px-2 py-0.5 rounded hover:bg-orange-300">
                                    {translatingField === 'hero_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Translate
                                </button>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Main Title</label><input value={localSettings.hero?.title_en || ''} onChange={e => handleSettingChange('hero', 'title_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label><input value={localSettings.hero?.subtitle_en || ''} onChange={e => handleSettingChange('hero', 'subtitle_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                    </div>
                  </div>

                  {/* تنظیمات اسلایدر تصاویر */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2 flex justify-between items-center text-[#058B8C]">
                        تصاویر اسلایدر هیرو
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">تعداد: {localSettings.hero?.images?.length || 0}</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {(localSettings.hero?.images || []).map((imgUrl, idx) => (
                             <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                <img src={imgUrl} alt="Slide" className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                     <button onClick={() => handleRemoveSliderImage(idx)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg" title="حذف تصویر">
                                        <Trash size={16}/>
                                     </button>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">اسلاید {idx + 1}</div>
                             </div>
                          ))}
                    </div>
                    <div className="flex gap-2 items-end pt-4 border-t border-gray-100">
                         <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1">لینک تصویر جدید</label>
                            <div className="flex items-center gap-2 bg-gray-50 border rounded-lg p-2">
                                 <Image size={16} className="text-gray-400"/>
                                <input value={tempSliderImage} onChange={e => setTempSliderImage(e.target.value)} className="bg-transparent w-full text-sm outline-none dir-ltr" placeholder="https://example.com/image.jpg"/>
                            </div>
                         </div>
                        <button onClick={handleAddSliderImage} disabled={!tempSliderImage} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition">
                            <Plus size={18}/> افزودن
                        </button>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2">آمار</h3>
                     <div className="grid grid-cols-4 gap-4">
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">مشتریان</label><input type="number" value={localSettings.stats?.customers || 0} onChange={e => handleSettingChange('stats', 'customers', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">پروازها</label><input type="number" value={localSettings.stats?.flights || 0} onChange={e => handleSettingChange('stats', 'flights', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">ویزاها</label><input type="number" value={localSettings.stats?.visas || 0} onChange={e => handleSettingChange('stats', 'visas', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">تجربه</label><input type="number" value={localSettings.stats?.experience || 0} onChange={e => handleSettingChange('stats', 'experience', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'weather' && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
                  <h3 className="font-bold border-b pb-2 flex justify-between items-center">
                    <span>لیست شهرها (جابجایی با درگ)</span>
                    <button onClick={() => {
                         const newCity = { id: Date.now(), name: "London", faName: "لندن", countryName: "انگلستان", timezone: "Europe/London", image: "" };
                       const updated = [...(localSettings.weather_cities || []), newCity];
                       handleSettingChange('weather_cities', null, updated); 
                   }} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-100 transition">
                      <Plus size={14}/> افزودن شهر
                    </button>
                  </h3>
                  <div className="space-y-3">
                      {(localSettings.weather_cities || []).map((city, index) => (
                      <div 
                        key={city.id || index}
                        className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                         draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleSort}
                         onDragOver={(e) => e.preventDefault()}
                      >
                        <div className="cursor-grab text-gray-300 hover:text-gray-600 active:cursor-grabbing p-1"><GripVertical size={20}/></div>
                        <div className="flex-1">
                            {editingCityId === city.id ? (
                             <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                               <input value={city.name} onChange={e => { const updated = [...localSettings.weather_cities]; updated[index].name = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm" placeholder="نام انگلیسی"/>
                               <input value={city.faName} onChange={e => { const updated = [...localSettings.weather_cities]; updated[index].faName = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm" placeholder="نام شهر (فارسی)"/>
                               <input value={city.countryName || ''} onChange={e => { const updated = [...localSettings.weather_cities]; updated[index].countryName = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm" placeholder="نام کشور (فارسی)"/>
                               <select value={city.timezone} onChange={e => { const updated = [...localSettings.weather_cities]; updated[index].timezone = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm dir-ltr bg-white">
                                {VALID_TIMEZONES.map(tz => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
                               </select>
                                <input value={city.image} onChange={e => { const updated = [...localSettings.weather_cities]; updated[index].image = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm dir-ltr" placeholder="لینک عکس"/>
                             </div>
                          ) : (
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
                                 {city.image ? <img src={city.image} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-gray-300"><Image size={20}/></div>}
                                 </div>
                               <div>
                                <h4 className="font-bold text-gray-800 text-sm">{city.faName} <span className="text-xs text-gray-500 mr-1">({city.countryName || city.name})</span></h4>
                                  <div className="text-[10px] text-gray-400 font-mono mt-0.5 dir-ltr">{city.timezone}</div>
                              </div>
                            </div>
                           )}
                        </div>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                           {editingCityId === city.id ? (
                            <button onClick={() => setEditingCityId(null)} className="p-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition"><Check size={16}/></button>
                          ) : (
                            <>
                                <button onClick={() => handleDuplicateCity(city)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Copy size={16}/></button>
                              <button onClick={() => setEditingCityId(city.id)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"><Edit size={16}/></button>
                               <button onClick={() => handleDeleteCity(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash size={16}/></button>
                            </>
                          )}
                        </div>
                        </div>
                    ))}
                 </div>
                </div>
              )}

              {settingsTab === 'services' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                  <h3 className="font-bold border-b pb-2">ویرایش خدمات (سه زبانه)</h3>
                   <div className="space-y-6">
                    {localSettings.services?.map((srv, index) => (
                       <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                        <div className="flex justify-between mb-2">
                            <div className="font-bold text-gray-400">سرویس #{index+1}</div>
                         </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* دری */}
                            <div className="space-y-2 border-l pl-2">
                                 <label className="text-[10px] font-bold text-blue-600 block">دری</label>
                                <input value={srv.title} onChange={e => handleServiceChange(index, 'title', e.target.value)} className="w-full p-2 border rounded bg-white font-bold text-xs" placeholder="عنوان"/>
                                <input value={srv.desc} onChange={e => handleServiceChange(index, 'desc', e.target.value)} className="w-full p-2 border rounded bg-white text-xs" placeholder="توضیحات"/>
                            </div>
                            {/* پشتو */}
                             <div className="space-y-2 border-l pl-2">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                                     <button onClick={() => handleSmartFillService(index, 'ps')} className="text-[9px] flex items-center gap-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded hover:bg-green-200">
                                        {translatingField === `service_${index}_ps` ? <Loader2 size={8} className="animate-spin"/> : <Sparkles size={8}/>} ترجمه
                                    </button>
                                </div>
                                <input value={srv.title_ps || ''} onChange={e => handleServiceChange(index, 'title_ps', e.target.value)} className="w-full p-2 border rounded bg-white font-bold text-xs" placeholder="عنوان پشتو"/>
                                <input value={srv.desc_ps || ''} onChange={e => handleServiceChange(index, 'desc_ps', e.target.value)} className="w-full p-2 border rounded bg-white text-xs" placeholder="توضیحات پشتو"/>
                            </div>
                            {/* انگلیسی */}
                            <div className="space-y-2" dir="ltr">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-orange-600 block">English</label>
                                    <button onClick={() => handleSmartFillService(index, 'en')} className="text-[9px] flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded hover:bg-orange-200">
                                        {translatingField === `service_${index}_en` ? <Loader2 size={8} className="animate-spin"/> : <Sparkles size={8}/>} Translate
                                    </button>
                                </div>
                                <input value={srv.title_en || ''} onChange={e => handleServiceChange(index, 'title_en', e.target.value)} className="w-full p-2 border rounded bg-white font-bold text-xs" placeholder="Title"/>
                                <input value={srv.desc_en || ''} onChange={e => handleServiceChange(index, 'desc_en', e.target.value)} className="w-full p-2 border rounded bg-white text-xs" placeholder="Description"/>
                            </div>
                        </div>
                      </div>
                     ))}
                  </div>
                </div>
               )}

              {settingsTab === 'footer' && (
                <div className="space-y-6">
                   {/* تنظیمات درباره ما (فوتر) */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2 text-[#058B8C]">متن «درباره ما» در فوتر (سه زبانه)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         
                        {/* دری */}
                        <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl">
                            <h4 className="font-bold text-xs text-blue-600 mb-2">نسخه دری</h4>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">عنوان (درباره ما)</label><input value={localSettings.about?.title || localSettings.about?.title_dr || ''} onChange={e => handleSettingChange('about', 'title', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">متن توضیحات</label><textarea value={localSettings.about?.desc || localSettings.about?.desc_dr || ''} onChange={e => handleSettingChange('about', 'desc', e.target.value)} className="w-full p-2 border rounded-lg h-24"/></div>
                        </div>

                        {/* پشتو */}
                        <div className="space-y-3 bg-green-50/50 p-4 rounded-xl">
                             <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs text-green-600">نسخه پشتو</h4>
                                <button type="button" onClick={() => handleSmartFillFooter('ps')} className="text-[9px] flex items-center gap-1 bg-green-200 text-green-800 px-2 py-0.5 rounded hover:bg-green-300">
                                    {translatingField === 'footer_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه
                                </button>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">عنوان</label><input value={localSettings.about?.title_ps || ''} onChange={e => handleSettingChange('about', 'title_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">متن توضیحات</label><textarea value={localSettings.about?.desc_ps || ''} onChange={e => handleSettingChange('about', 'desc_ps', e.target.value)} className="w-full p-2 border rounded-lg h-24"/></div>
                        </div>

                        {/* انگلیسی */}
                        <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl" dir="ltr">
                             <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs text-orange-600">English Version</h4>
                                <button type="button" onClick={() => handleSmartFillFooter('en')} className="text-[9px] flex items-center gap-1 bg-orange-200 text-orange-800 px-2 py-0.5 rounded hover:bg-orange-300">
                                    {translatingField === 'footer_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Translate
                                </button>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Title</label><input value={localSettings.about?.title_en || ''} onChange={e => handleSettingChange('about', 'title_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea value={localSettings.about?.desc_en || ''} onChange={e => handleSettingChange('about', 'desc_en', e.target.value)} className="w-full p-2 border rounded-lg h-24"/></div>
                        </div>
                    </div>
                  </div>

                  {/* تنظیمات تماس و کپی‌رایت */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2 text-[#058B8C]">اطلاعات تماس و کپی‌رایت</h3>
                     
                     {/* فیلدهای مشترک */}
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">شماره تماس (مشترک)</label><input value={localSettings.contact?.phone || ''} onChange={e => handleSettingChange('contact', 'phone', e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">ایمیل (مشترک)</label><input value={localSettings.contact?.email || ''} onChange={e => handleSettingChange('contact', 'email', e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                     </div>

                     {/* فیلدهای آدرس و کپی‌رایت (سه زبانه) */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                         {/* دری */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-xs text-blue-600">دری</h4>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">آدرس</label><input value={localSettings.contact?.address || ''} onChange={e => handleSettingChange('contact', 'address', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">متن کپی‌رایت</label><input value={localSettings.contact?.copyright || ''} onChange={e => handleSettingChange('contact', 'copyright', e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                        </div>
                        {/* پشتو */}
                        <div className="space-y-3">
                             <h4 className="font-bold text-xs text-green-600">پشتو</h4>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">پته (آدرس)</label><input value={localSettings.contact?.address_ps || ''} onChange={e => handleSettingChange('contact', 'address_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">د کاپي حق</label><input value={localSettings.contact?.copyright_ps || ''} onChange={e => handleSettingChange('contact', 'copyright_ps', e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                        </div>
                        {/* انگلیسی */}
                        <div className="space-y-3" dir="ltr">
                             <h4 className="font-bold text-xs text-orange-600">English</h4>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Address</label><input value={localSettings.contact?.address_en || ''} onChange={e => handleSettingChange('contact', 'address_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Copyright</label><input value={localSettings.contact?.copyright_en || ''} onChange={e => handleSettingChange('contact', 'copyright_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                     </div>
                  </div>
                </div>
               )}

              <div className="fixed bottom-6 left-6 z-50">
                <button onClick={saveSettings} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-2xl font-black flex items-center gap-2 animate-in slide-in-from-bottom-5">
                  <Save size={20}/> ذخیره تغییرات
                </button>
               </div>
            </div>
          )}

          {/* بخش رزروها */}
          {activeTab === 'bookings' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                   <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                       <tr>
                        <th className="p-4 font-bold">زمان</th>
                        <th className="p-4 font-bold">مشتری</th>
                        <th className="p-4 font-bold">پرواز</th>
                        <th className="p-4 font-bold">پرداخت</th>
                        <th className="p-4 font-bold">وضعیت</th>
                        <th className="p-4 font-bold text-center">عملیات</th>
                      </tr>
                     </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings && bookings.length > 0 ? bookings.map(b => (
                         <tr key={b.id} className="hover:bg-gray-50 transition">
                            <td className="p-4 text-gray-500 text-xs">
                               <div dir="ltr" className="font-bold">{new Date(b.created_at).toLocaleDateString('fa-IR')}</div>
                                <div dir="ltr" className="opacity-70 mt-1">{new Date(b.created_at).toLocaleTimeString('fa-IR')}</div>
                            </td>
                            <td className="p-4">
                                  <div className="font-bold text-gray-800 flex items-center gap-1"><User size={14}/> {b.customer_name}</div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={14}/> {b.customer_phone}</div>
                             </td>
                             <td className="p-4">
                               <div className="flex items-center gap-3">
                                   <span className="text-2xl">{b.flight_info?.logo}</span>
                                   <div>
                                     <div className="font-bold text-xs text-gray-800">{b.flight_info?.airline}</div>
                                      <div className="text-[10px] text-gray-500 dir-ltr mt-0.5">{b.flight_info?.origin} → {b.flight_info?.dest}</div>
                                   </div>
                               </div>
                              </td>
                            <td className="p-4">
                               <div className="flex flex-col gap-1">
                                  <div className="font-black text-blue-600">{(b.amount || 0).toLocaleString()} <span className="text-[9px] text-gray-400">افغانی</span></div>
                                   {b.transaction_id && <div className="text-[10px] font-mono text-gray-500 select-all bg-yellow-50 px-2 rounded border border-yellow-100 w-fit">ID: {b.transaction_id}</div>}
                               </div>
                              </td>
                             <td className="p-4">{getStatusBadge(b.status)}</td>
                            <td className="p-4">
                                 <div className="flex justify-center gap-2">
                                   {b.status === 'pending_verification' && (
                                    <button onClick={() => handleChangeStatus(b.id, 'confirmed')} title="تایید" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 border border-green-200 transition"><Check size={16}/></button>
                                    )}
                                  {b.status !== 'cancelled' && (
                                       <button onClick={() => handleChangeStatus(b.id, 'cancelled')} title="لغو" className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100 transition"><X size={16}/></button>
                                   )}
                                  <button onClick={() => handleDeleteBooking(b.id)} title="حذف" className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition"><Trash size={16}/></button>
                               </div>
                             </td>
                         </tr>
                         )) : (
                         <tr><td colSpan="6" className="p-10 text-center text-gray-400">موردی یافت نشد</td></tr>
                       )}
                    </tbody>
                   </table>
                </div>
              </div>
          )}

          {/* بخش اخبار (با پشتیبانی چند زبانه و ترجمه هوشمند) */}
          {activeTab === 'news' && (
             <div className="space-y-6">
                <form onSubmit={handleSubmitNews} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                   <h3 className="font-bold text-gray-700">افزودن / ویرایش خبر</h3>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                       {/* فارسی */}
                       <div className="space-y-2 bg-white p-3 rounded-lg border">
                           <div className="text-xs font-bold text-blue-600 mb-1">فارسی (دری)</div>
                           <input placeholder="تیتر خبر" value={newNews.title} onChange={e=>setNewNews({...newNews, title: e.target.value})} className="w-full p-2 rounded border text-sm font-bold"/>
                           <textarea placeholder="متن کامل خبر..." value={newNews.desc} onChange={e=>setNewNews({...newNews, desc: e.target.value})} className="w-full p-2 rounded border h-32 text-sm"/>
                       </div>

                       {/* پشتو */}
                        <div className="space-y-2 bg-white p-3 rounded-lg border">
                           <div className="text-xs font-bold text-green-600 mb-1 flex justify-between items-center">
                               <span>پشتو</span>
                                <button type="button" onClick={() => handleSmartFillNews('ps')} className="text-[9px] flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded hover:bg-green-200 transition">
                                   {translatingField === 'ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه هوشمند
                               </button>
                           </div>
                           <input placeholder="د خبر سرلیک" value={newNews.title_ps || ''} onChange={e=>setNewNews({...newNews, title_ps: e.target.value})} className="w-full p-2 rounded border text-sm font-bold"/>
                           <textarea placeholder="د خبر بشپړ متن..." value={newNews.desc_ps || ''} onChange={e=>setNewNews({...newNews, desc_ps: e.target.value})} className="w-full p-2 rounded border h-32 text-sm"/>
                       </div>

                       {/* انگلیسی */}
                       <div className="space-y-2 bg-white p-3 rounded-lg border" dir="ltr">
                            <div className="text-xs font-bold text-orange-600 mb-1 flex justify-between items-center">
                               <span>English</span>
                               <button type="button" onClick={() => handleSmartFillNews('en')} className="text-[9px] flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded hover:bg-orange-200 transition">
                                   {translatingField === 'en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Auto Translate
                               </button>
                           </div>
                           <input placeholder="News Title" value={newNews.title_en || ''} onChange={e=>setNewNews({...newNews, title_en: e.target.value})} className="w-full p-2 rounded border text-sm font-bold"/>
                           <textarea placeholder="Full news content..." value={newNews.desc_en || ''} onChange={e=>setNewNews({...newNews, desc_en: e.target.value})} className="w-full p-2 rounded border h-32 text-sm"/>
                       </div>
                   </div>

                   <div className="flex items-center gap-2">
                        <Image size={20} className="text-gray-400"/>
                         <input placeholder="لینک عکس" value={newNews.img} onChange={e=>setNewNews({...newNews, img: e.target.value})} className="flex-1 p-2 rounded border dir-ltr text-left"/>
                   </div>
    
                   <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold w-full shadow-lg hover:bg-blue-700 transition">{editingId ? 'ذخیره تغییرات' : 'انتشار خبر جدید'}</button>
                </form>

                <div className="grid gap-3">
                  {news.map(n => (
                    <div key={n.id} className="flex gap-4 p-3 border rounded-xl items-center bg-white hover:shadow-md transition">
                        <img src={n.image_url} className="w-20 h-20 rounded-lg object-cover bg-gray-100"/>
                       <div className="flex-1 space-y-1">
                         <h3 className="font-bold text-sm">{n.title}</h3>
                         <div className="text-xs text-gray-400 flex gap-2">
                              {n.title_ps && <span className="bg-green-50 text-green-600 px-1 rounded">PS</span>}
                             {n.title_en && <span className="bg-orange-50 text-orange-600 px-1 rounded">EN</span>}
                         </div>
                          {n.pinned && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 rounded mt-1 inline-block">پین شده</span>}
                       </div>
                       <div className="flex gap-2">
                          <button onClick={()=>handleTogglePin(n.id, n.pinned)} title={n.pinned ? "برداشتن پین" : "پین کردن"}><Pin size={18} className={n.pinned ? "text-yellow-500" : "text-gray-400"}/></button>
                         <button onClick={()=>handleEditNews(n)} title="ویرایش"><Edit size={18} className="text-blue-500"/></button>
                         <button onClick={()=>handleDuplicateNews(n)} title="کپی"><Copy size={18} className="text-gray-500"/></button>
                         <button onClick={()=>handleDeleteNews(n.id)} title="حذف"><Trash size={18} className="text-red-500"/></button>
                        </div>
                    </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}