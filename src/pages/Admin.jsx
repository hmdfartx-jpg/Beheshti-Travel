import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash, Megaphone, Ticket, User, Phone, CheckCircle, XCircle, Edit, Copy, X, Save, Settings, GripVertical, Check, CreditCard, Clock, Calendar, Lock, ArrowRight, RefreshCw, Eye, EyeOff, Image, LogOut, Layout, Globe, Sparkles, Loader2, Pin, MapPin, Instagram, MessageCircle, Send, Facebook, Info, Building2, Shield, Users, Award, Target } from 'lucide-react';

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
  { label: "پکن (Asia/Shanghai)", value: "Asia/Shanghai" },
  { label: "بغداد (Asia/Baghdad)", value: "Asia/Baghdad" },
  { label: "اسلام‌آباد (Asia/Karachi)", value: "Asia/Karachi" },
  { label: "ریاض (Asia/Riyadh)", value: "Asia/Riyadh" }
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth_token') === 'true';
  });
  const [loginData, setLoginData] = useState({ username: '', password: '', captcha: '' });
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- مدیریت تب‌ها و داده‌ها ---
  const [activeTab, setActiveTab] = useState('bookings');
  const [settingsTab, setSettingsTab] = useState('general');
  // تب داخلی برای بخش جدید "درباره ما و تماس"
  const [aboutContactTab, setAboutContactTab] = useState('about'); // 'about' or 'contact'

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
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingAgencyId, setEditingAgencyId] = useState(null);
  const [editingWhyUsId, setEditingWhyUsId] = useState(null);

  const [tempSliderImage, setTempSliderImage] = useState('');
  const [translatingField, setTranslatingField] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // 2. توابع کمکی و ترجمه
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

  // --- هندلرهای ترجمه هوشمند ---

  // اخبار
  const handleSmartFillNews = async (targetLang) => {
    if (!newNews.title) return alert("لطفا ابتدا تیتر فارسی را وارد کنید.");
    setTranslatingField(targetLang); 
    try {
        const transTitle = await fetchTranslation(newNews.title, targetLang);
        const transDesc = newNews.desc ? await fetchTranslation(newNews.desc, targetLang) : "";
        setNewNews(prev => ({
            ...prev,
            [`title_${targetLang}`]: transTitle,
            [`desc_${targetLang}`]: transDesc
        }));
    } catch (e) { console.error(e); } finally { setTranslatingField(null); }
  };

  // هیرو
  const handleSmartFillHero = async (targetLang) => {
      const title = localSettings.hero?.title_dr;
      const subtitle = localSettings.hero?.subtitle_dr;
      if (!title) return alert("لطفا ابتدا تیتر فارسی را وارد کنید.");
      setTranslatingField(`hero_${targetLang}`);
      const tTitle = await fetchTranslation(title, targetLang);
      const tSub = subtitle ? await fetchTranslation(subtitle, targetLang) : "";
      setLocalSettings(prev => ({
          ...prev, hero: { ...(prev.hero || {}), [`title_${targetLang}`]: tTitle, [`subtitle_${targetLang}`]: tSub }
      }));
      setTranslatingField(null);
  };

  // خدمات
  const handleSmartFillService = async (index, targetLang) => {
      const service = localSettings.services[index];
      if (!service.title) return alert("عنوان فارسی خالی است.");
      setTranslatingField(`service_${index}_${targetLang}`);
      const tTitle = await fetchTranslation(service.title, targetLang);
      const tDesc = service.desc ? await fetchTranslation(service.desc, targetLang) : "";
      setLocalSettings(prev => {
          const updatedServices = [...(prev.services || [])];
          updatedServices[index] = { ...updatedServices[index], [`title_${targetLang}`]: tTitle, [`desc_${targetLang}`]: tDesc };
          return { ...prev, services: updatedServices };
      });
      setTranslatingField(null);
  };

  // لینک‌های مفید
  const handleSmartFillLink = async (index, targetLang) => {
      const link = (localSettings.useful_links || [])[index];
      if (!link.title_dr) return alert("عنوان فارسی خالی است.");
      setTranslatingField(`link_${index}_${targetLang}`);
      const tTitle = await fetchTranslation(link.title_dr, targetLang);
      setLocalSettings(prev => {
          const updatedLinks = [...(prev.useful_links || [])];
          updatedLinks[index] = { ...updatedLinks[index], [`title_${targetLang}`]: tTitle };
          return { ...prev, useful_links: updatedLinks };
      });
      setTranslatingField(null);
  };

  // --- هندلرهای ترجمه بخش "درباره ما و تماس" ---

  // 1. عمومی (توضیحات درباره ما)
  const handleSmartFillAboutGeneral = async (targetLang) => {
      const title = localSettings.about?.title_dr || localSettings.about?.title;
      const desc = localSettings.about?.desc_dr || localSettings.about?.desc;
      if (!title && !desc) return alert("لطفا اطلاعات فارسی را وارد کنید.");
      setTranslatingField(`about_general_${targetLang}`);
      const tTitle = title ? await fetchTranslation(title, targetLang) : "";
      const tDesc = desc ? await fetchTranslation(desc, targetLang) : "";
      handleSettingChange('about', `title_${targetLang}`, tTitle);
      handleSettingChange('about', `desc_${targetLang}`, tDesc);
      setTranslatingField(null);
  };

  // 2. ماموریت و چشم‌انداز
  const handleSmartFillMissionVision = async (type, targetLang) => {
     const title = localSettings.about?.[`${type}_title_dr`];
     const desc = localSettings.about?.[`${type}_desc_dr`];
     
     if (!title && !desc) return alert("اطلاعات فارسی خالی است.");
     setTranslatingField(`${type}_${targetLang}`);

     const tTitle = title ? await fetchTranslation(title, targetLang) : "";
     const tDesc = desc ? await fetchTranslation(desc, targetLang) : "";

     handleSettingChange('about', `${type}_title_${targetLang}`, tTitle);
     handleSettingChange('about', `${type}_desc_${targetLang}`, tDesc);
     setTranslatingField(null);
  };

  // 3. "چرا ما" (Why Us)
  const handleSmartFillWhyUs = async (index, targetLang) => {
      const item = (localSettings.why_us || [])[index];
      if (!item.title_dr) return alert("عنوان فارسی را وارد کنید.");
      setTranslatingField(`whyus_${index}_${targetLang}`);

      const tTitle = await fetchTranslation(item.title_dr, targetLang);
      const tDesc = item.desc_dr ? await fetchTranslation(item.desc_dr, targetLang) : "";

      setLocalSettings(prev => {
          const updated = [...(prev.why_us || [])];
          updated[index] = { ...updated[index], [`title_${targetLang}`]: tTitle, [`desc_${targetLang}`]: tDesc };
          return { ...prev, why_us: updated };
      });
      setTranslatingField(null);
  };

  // 4. تیم ما
  const handleSmartFillTeam = async (index, targetLang) => {
      const member = (localSettings.team || [])[index];
      if (!member.role_dr) return alert("سمت فارسی را وارد کنید.");
      setTranslatingField(`team_${index}_${targetLang}`);
      
      const tRole = await fetchTranslation(member.role_dr, targetLang);
      setLocalSettings(prev => {
          const updatedTeam = [...(prev.team || [])];
          updatedTeam[index] = { ...updatedTeam[index], [`role_${targetLang}`]: tRole };
          return { ...prev, team: updatedTeam };
      });
      setTranslatingField(null);
  };

  // 5. آدرس دفتر مرکزی
  const handleSmartFillAddress = async (targetLang) => {
      const address = localSettings.contact?.address || localSettings.contact?.address_dr;
      const copyright = localSettings.contact?.copyright || localSettings.contact?.copyright_dr;
      
      if (!address) return alert("آدرس فارسی را وارد کنید.");
      setTranslatingField(`contact_${targetLang}`);
      const tAddress = await fetchTranslation(address, targetLang);
      const tCopyright = copyright ? await fetchTranslation(copyright, targetLang) : "";

      handleSettingChange('contact', `address_${targetLang}`, tAddress);
      handleSettingChange('contact', `copyright_${targetLang}`, tCopyright);
      setTranslatingField(null);
  };

  // 6. نمایندگی‌ها (Agencies)
  const handleSmartFillAgency = async (index, targetLang) => {
      const agency = (localSettings.agencies || [])[index];
      if (!agency.name_dr && !agency.address_dr) return alert("نام یا آدرس فارسی را وارد کنید.");
      setTranslatingField(`agency_${index}_${targetLang}`);

      const tName = agency.name_dr ? await fetchTranslation(agency.name_dr, targetLang) : "";
      const tAddress = agency.address_dr ? await fetchTranslation(agency.address_dr, targetLang) : "";
      setLocalSettings(prev => {
          const updated = [...(prev.agencies || [])];
          updated[index] = { ...updated[index], [`name_${targetLang}`]: tName, [`address_${targetLang}`]: tAddress };
          return { ...prev, agencies: updated };
      });
      setTranslatingField(null);
  };

  // 7. متن کوتاه درباره ما در فوتر (جدید)
  const handleSmartFillFooterAbout = async (targetLang) => {
      const text = localSettings.contact?.footer_about_dr;
      if (!text) return alert("لطفا ابتدا متن فارسی را وارد کنید.");
      setTranslatingField(`footer_about_${targetLang}`);
      
      const tText = await fetchTranslation(text, targetLang);
      
      handleSettingChange('contact', `footer_about_${targetLang}`, tText);
      setTranslatingField(null);
  };


  // ---------------------------------------------
  // توابع مدیریت اعضای تیم
  const handleAddTeamMember = () => {
    setLocalSettings(prev => ({ 
        ...prev, 
        team: [...(prev.team || []), { name_fa: '', name_en: '', role_dr: '', role_ps: '', role_en: '', image: '', phone: '', whatsapp: '' }] 
    }));
  };

  const handleDeleteTeamMember = (index) => {
    if(window.confirm('حذف این عضو؟')) {
      const updated = (localSettings.team || []).filter((_, i) => i !== index);
      handleSettingChange('team', null, updated);
    }
  };

  const handleSortTeam = () => {
    const _team = [...(localSettings.team || [])];
    const item = _team[dragItem.current];
    _team.splice(dragItem.current, 1);
    _team.splice(dragOverItem.current, 0, item);
    dragItem.current = null; dragOverItem.current = null;
    handleSettingChange('team', null, _team);
  };
  const handleTeamChange = (index, key, value) => {
    setLocalSettings(prev => {
        const updated = [...(prev.team || [])];
        updated[index] = { ...updated[index], [key]: value };
        return { ...prev, team: updated };
    });
  };

  // ---------------------------------------------
  // توابع مدیریت "چرا ما"
  const handleAddWhyUs = () => {
      setLocalSettings(prev => ({
          ...prev,
          why_us: [...(prev.why_us || []), { title_dr: '', desc_dr: '', icon: 'Shield' }]
      }));
  };
  
  const handleDeleteWhyUs = (index) => {
      if(window.confirm('حذف شود؟')) {
          const updated = (localSettings.why_us || []).filter((_, i) => i !== index);
          handleSettingChange('why_us', null, updated);
      }
  };

  const handleWhyUsChange = (index, key, value) => {
      setLocalSettings(prev => {
          const updated = [...(prev.why_us || [])];
          updated[index] = { ...updated[index], [key]: value };
          return { ...prev, why_us: updated };
      });
  };

  // ---------------------------------------------
  // توابع مدیریت نمایندگی‌ها
  const handleAddAgency = () => {
      setLocalSettings(prev => ({
          ...prev,
          agencies: [...(prev.agencies || []), { name_dr: '', address_dr: '', phone: '', whatsapp: '', telegram: '', facebook: '', instagram: '', map_link: '' }]
      }));
  };

  const handleDeleteAgency = (index) => {
      if(window.confirm('حذف نمایندگی؟')) {
          const updated = (localSettings.agencies || []).filter((_, i) => i !== index);
          handleSettingChange('agencies', null, updated);
      }
  };

  const handleAgencyChange = (index, key, value) => {
      setLocalSettings(prev => {
          const updated = [...(prev.agencies || [])];
          updated[index] = { ...updated[index], [key]: value };
          return { ...prev, agencies: updated };
      });
  };


  // ---------------------------------------------
  // سایر توابع (لینک‌ها، شهرها، لاگین و ...)

  const handleLinkChange = (index, key, value) => {
    setLocalSettings(prev => {
        const updatedLinks = [...(prev.useful_links || [])];
        updatedLinks[index] = { ...updatedLinks[index], [key]: value };
        return { ...prev, useful_links: updatedLinks };
    });
  };

  const handleAddLink = () => {
      setLocalSettings(prev => ({ ...prev, useful_links: [...(prev.useful_links || []), { title_dr: '', title_ps: '', title_en: '', url: '' }] }));
  };

  const handleDeleteLink = (index) => {
      if(window.confirm('حذف شود؟')) {
        const updatedLinks = (localSettings.useful_links || []).filter((_, i) => i !== index);
        setLocalSettings(prev => ({ ...prev, useful_links: updatedLinks }));
      }
  };
  const handleSortLinks = () => {
    const _links = [...(localSettings.useful_links || [])];
    const item = _links[dragItem.current];
    _links.splice(dragItem.current, 1);
    _links.splice(dragOverItem.current, 0, item);
    dragItem.current = null; dragOverItem.current = null;
    handleSettingChange('useful_links', null, _links);
  };
  const handleDuplicateLink = (link) => {
    const newLink = { ...link, title_dr: (link.title_dr || '') + ' (کپی)' };
    const updated = [...(localSettings.useful_links || []), newLink];
    handleSettingChange('useful_links', null, updated);
  };
  const generateCaptcha = () => {
    const chars = "0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedCaptcha(result);
  };
  useEffect(() => {
    generateCaptcha();
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
      localStorage.setItem('admin_auth_token', 'true');
      setIsAuthenticated(true);
    } else {
      alert(t.error_auth);
      generateCaptcha();
      setLoginData({ ...loginData, password: '', captcha: '' });
    }
  };

  const handleLogout = () => {
    if(window.confirm('آیا مطمئن هستید؟')) {
        localStorage.removeItem('admin_auth_token');
        setIsAuthenticated(false);
    }
  };

  // ✅ اصلاح تابع ذخیره برای جلوگیری از ایجاد ردیف اضافه
  const saveSettings = async () => {
    try {
      // 1. دریافت همه ردیف‌ها و مرتب‌سازی
      const { data, error } = await supabase
        .from('site_settings')
        .select('id')
        .order('id', { ascending: true });
      if (error) throw error;

      if (data && data.length > 0) {
        // 2. همیشه و فقط ردیف اول را آپدیت کن
        const firstRowId = data[0].id;
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ config: localSettings })
          .eq('id', firstRowId);
        if (!updateError) {
           alert('تنظیمات با موفقیت ذخیره شد!');
           onUpdate();
        } else {
           alert('خطا در ذخیره: ' + updateError.message);
        }
      } else {
        // 3. فقط اگر جدول کاملاً خالی بود، ردیف جدید بساز
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert([{ config: localSettings }]);
        if (!insertError) {
            onUpdate();
        }
      }
    } catch (err) { 
      console.error(err);
      alert('خطا در ارتباط با دیتابیس');
    }
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

  const handleSubmitNews = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    const newsData = {
        title: newNews.title, 
        description: newNews.desc,
        title_ps: newNews.title_ps,
        description_ps: newNews.desc_ps,
        title_en: newNews.title_en,
        description_en: newNews.desc_en,
        image_url: newNews.img
    };
    if (editingId) {
      const { error } = await supabase.from('news').update(newsData).eq('id', editingId);
      if (!error) { alert('ویرایش شد'); setEditingId(null); onUpdate(); } else { alert('خطا در ویرایش: ' + error.message);
      }
    } else {
      const { error } = await supabase.from('news').insert([{ ...newsData, pinned: false, created_at: currentDate }]);
      if (!error) { alert('ثبت شد'); onUpdate(); } else { alert('خطا در ثبت: ' + error.message);
      }
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

  const handleChangeStatus = async (id, s) => { if(window.confirm('تغییر وضعیت؟')) { await supabase.from('bookings').update({ status: s }).eq('id', id);
  onUpdate(); }};
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
  // 3. رندر شرطی لاگین
  if (!isAuthenticated) {
    const currentLoginLang = lang || 'dr';
    const t = loginTranslations[currentLoginLang];
    const dir = currentLoginLang === 'en' ? 'ltr' : 'rtl';
    const alignClass = currentLoginLang === 'en' ? 'text-left' : 'text-right';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-[Vazirmatn]" dir={dir}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-300 relative">
          <div className="bg-[#058B8C] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
               <Lock className="text-white" size={32}/>
            </div>
            <h2 className="text-2xl font-black text-white">{t.title}</h2>
            <p className="text-blue-100 text-sm mt-2">{t.subtitle}</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className={`block text-xs font-bold text-gray-500 mb-1 ${alignClass}`}>{t.user}</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-[#058B8C] focus-within:bg-white transition-all">
                <User size={18} className="text-gray-400"/>
                <input type="text" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className={`bg-transparent outline-none w-full text-sm font-bold text-gray-800 ${alignClass}`} placeholder={t.ph_user} autoFocus/>
              </div>
            </div>
            <div>
              <label className={`block text-xs font-bold text-gray-500 mb-1 ${alignClass}`}>{t.pass}</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-[#058B8C] focus-within:bg-white transition-all">
                <Lock size={18} className="text-gray-400"/>
                <input type={showPassword ?
                "text" : "password"} value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className={`bg-transparent outline-none w-full text-sm font-bold text-gray-800 ${alignClass}`} placeholder={t.ph_pass}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                  {showPassword ?
                  <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-xs font-bold text-gray-500 mb-1 ${alignClass}`}>{t.captcha}</label>
              <div className="flex gap-3">
                 <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:border-[#058B8C] focus-within:bg-white transition-all">
                    <CheckCircle size={18} className="text-gray-400"/>
                    <input type="tel" maxLength={4} value={loginData.captcha} onChange={e => setLoginData({...loginData, captcha: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold text-gray-800 tracking-widest text-center" placeholder="_ _ _ _"/>
                 </div>
                 <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl px-4 flex items-center justify-center gap-3 min-w-[120px] select-none cursor-pointer hover:bg-blue-50 transition" onClick={generateCaptcha} title="Refresh">
                    <span className="font-mono text-xl font-black text-blue-600 tracking-widest">{generatedCaptcha}</span>
                    <RefreshCw size={16} className="text-blue-400"/>
                 </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#058B8C] hover:bg-[#047070] text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 mt-4">
               {t.btn} <ArrowRight size={18} className={currentLoginLang === 'en' ?
                "" : "rotate-180"}/>
            </button>
            <button type="button" onClick={() => setPage && setPage('home')} className="w-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
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
        <button onClick={handleLogout} className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition font-bold flex items-center gap-2">
           <LogOut size={16}/> خروج
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-full">
         {/* منوی راست */}
        <div className="w-full md:w-64 bg-gray-50 p-4 border-l border-gray-200 space-y-2 shrink-0">
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Ticket size={20}/> رزروها</button>
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'news' ?
          'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Megaphone size={20}/> اخبار</button>
          
          {/* ✅ دکمه جدید در سایدبار: درباره ما و تماس */}
          <button onClick={() => setActiveTab('about_contact')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'about_contact' ?
          'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Info size={20}/> درباره ما و تماس</button>
          
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ?
          'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Settings size={20}/> تنظیمات سایت</button>
        </div>

        {/* محتوای اصلی */}
        <div className="flex-1 p-6 bg-gray-50/50 overflow-x-auto">
          
          {/* 🟢 بخش جدید: درباره ما و تماس با ما */}
          {activeTab === 'about_contact' && (
              <div className="space-y-6 animate-in fade-in pb-10">
                  {/* تب‌های داخلی */}
                  <div className="flex gap-2 border-b pb-2">
                      <button onClick={() => setAboutContactTab('about')} className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${aboutContactTab === 'about' ? 'bg-white border-b-2 border-[#058B8C] text-[#058B8C]' : 'text-gray-500 hover:bg-white/50'}`}>درباره ما</button>
                      <button onClick={() => setAboutContactTab('contact')} className={`px-6 py-2 rounded-t-lg font-bold transition-colors ${aboutContactTab === 'contact' ? 'bg-white border-b-2 border-[#058B8C] text-[#058B8C]' : 'text-gray-500 hover:bg-white/50'}`}>تماس با ما (شعب)</button>
                  </div>

                  {aboutContactTab === 'about' && (
                      <div className="space-y-6">
                          {/* 1. تنظیمات عمومی درباره ما (هیرو) */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                            <h3 className="font-bold border-b pb-2 text-[#058B8C]">متن‌های اصلی صفحه «درباره ما»</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* دری */}
                                <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl">
                                    <h4 className="font-bold text-xs text-blue-600 mb-2">دری</h4>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">عنوان (Header)</label><input value={localSettings.about?.title_dr ||
                                    localSettings.about?.title || ''} onChange={e => handleSettingChange('about', 'title_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">توضیحات</label><textarea value={localSettings.about?.desc_dr ||
                                    localSettings.about?.desc || ''} onChange={e => handleSettingChange('about', 'desc_dr', e.target.value)} className="w-full p-2 border rounded-lg h-32"/></div>
                                </div>
                                {/* پشتو */}
                                <div className="space-y-3 bg-green-50/50 p-4 rounded-xl">
                                    <div className="flex justify-between mb-2"><h4 className="font-bold text-xs text-green-600">پشتو</h4><button type="button" onClick={() => handleSmartFillAboutGeneral('ps')} className="text-[9px] bg-green-200 px-2 rounded">{translatingField === 'about_general_ps' ?
                                    <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">عنوان</label><input value={localSettings.about?.title_ps ||
                                    ''} onChange={e => handleSettingChange('about', 'title_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">توضیحات</label><textarea value={localSettings.about?.desc_ps ||
                                    ''} onChange={e => handleSettingChange('about', 'desc_ps', e.target.value)} className="w-full p-2 border rounded-lg h-32"/></div>
                                </div>
                                {/* انگلیسی */}
                                <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl" dir="ltr">
                                    <div className="flex justify-between mb-2"><h4 className="font-bold text-xs text-orange-600">English</h4><button type="button" onClick={() => handleSmartFillAboutGeneral('en')} className="text-[9px] bg-orange-200 px-2 rounded">{translatingField === 'about_general_en' ?
                                    <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Title</label><input value={localSettings.about?.title_en ||
                                    ''} onChange={e => handleSettingChange('about', 'title_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea value={localSettings.about?.desc_en ||
                                    ''} onChange={e => handleSettingChange('about', 'desc_en', e.target.value)} className="w-full p-2 border rounded-lg h-32"/></div>
                            </div>
                        </div>

                        {/* فیلد جدید: تصویر درباره ما */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 mb-2">لینک تصویر اختصاصی صفحه درباره ما</label>
                            <div className="flex items-center gap-2 bg-gray-50 border rounded-lg p-2">
                                <Image size={20} className="text-gray-400"/>
                                <input 
                                    value={localSettings.about?.image ||
                                    ''} 
                                    onChange={e => handleSettingChange('about', 'image', e.target.value)} 
                                    className="w-full bg-transparent text-sm outline-none dir-ltr" 
                                    placeholder="https://example.com/about-image.jpg"
                                />
                            </div>
                        </div>
                      </div>

                          {/* 2. ماموریت و چشم‌انداز */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
                              <h3 className="font-bold border-b pb-2 text-[#058B8C]">ماموریت و چشم‌انداز</h3>
                              {/* بخش ماموریت */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2 bg-blue-50/30 p-3 rounded-xl"><label className="text-xs font-bold text-blue-600">ماموریت (دری)</label><input placeholder="عنوان" value={localSettings.about?.mission_title_dr ||
                                  ''} onChange={e => handleSettingChange('about', 'mission_title_dr', e.target.value)} className="w-full p-2 border rounded text-sm"/><textarea placeholder="توضیحات..." value={localSettings.about?.mission_desc_dr ||
                                  ''} onChange={e => handleSettingChange('about', 'mission_desc_dr', e.target.value)} className="w-full p-2 border rounded text-sm h-20"/></div>
                                  <div className="space-y-2 bg-green-50/30 p-3 rounded-xl"><div className="flex justify-between items-center"><label className="text-xs font-bold text-green-600">پشتو</label><button onClick={() => handleSmartFillMissionVision('mission', 'ps')} className="text-[9px] bg-green-200 px-2 rounded">{translatingField === 'mission_ps' ?
                                  <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button></div><input placeholder="عنوان" value={localSettings.about?.mission_title_ps || ''} onChange={e => handleSettingChange('about', 'mission_title_ps', e.target.value)} className="w-full p-2 border rounded text-sm"/><textarea placeholder="توضیحات..." value={localSettings.about?.mission_desc_ps ||
                                  ''} onChange={e => handleSettingChange('about', 'mission_desc_ps', e.target.value)} className="w-full p-2 border rounded text-sm h-20"/></div>
                                  <div className="space-y-2 bg-orange-50/30 p-3 rounded-xl" dir="ltr"><div className="flex justify-between items-center"><label className="text-xs font-bold text-orange-600">English</label><button onClick={() => handleSmartFillMissionVision('mission', 'en')} className="text-[9px] bg-orange-200 px-2 rounded">{translatingField === 'mission_en' ?
                                  <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button></div><input placeholder="Title" value={localSettings.about?.mission_title_en || ''} onChange={e => handleSettingChange('about', 'mission_title_en', e.target.value)} className="w-full p-2 border rounded text-sm"/><textarea placeholder="Description..." value={localSettings.about?.mission_desc_en ||
                                  ''} onChange={e => handleSettingChange('about', 'mission_desc_en', e.target.value)} className="w-full p-2 border rounded text-sm h-20"/></div>
                              </div>
                              {/* بخش چشم‌انداز */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-4">
                                  <div className="space-y-2 bg-blue-50/30 p-3 rounded-xl"><label className="text-xs font-bold text-blue-600">چشم‌انداز (دری)</label><input placeholder="عنوان" value={localSettings.about?.vision_title_dr ||
                                  ''} onChange={e => handleSettingChange('about', 'vision_title_dr', e.target.value)} className="w-full p-2 border rounded text-sm"/><textarea placeholder="توضیحات..." value={localSettings.about?.vision_desc_dr ||
                                  ''} onChange={e => handleSettingChange('about', 'vision_desc_dr', e.target.value)} className="w-full p-2 border rounded text-sm h-20"/></div>
                                  <div className="space-y-2 bg-green-50/30 p-3 rounded-xl"><div className="flex justify-between items-center"><label className="text-xs font-bold text-green-600">پشتو</label><button onClick={() => handleSmartFillMissionVision('vision', 'ps')} className="text-[9px] bg-green-200 px-2 rounded">{translatingField === 'vision_ps' ?
                                  <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button></div><input placeholder="عنوان" value={localSettings.about?.vision_title_ps || ''} onChange={e => handleSettingChange('about', 'vision_title_ps', e.target.value)} className="w-full p-2 border rounded text-sm"/><textarea placeholder="توضیحات..." value={localSettings.about?.vision_desc_ps ||
                                  ''} onChange={e => handleSettingChange('about', 'vision_desc_ps', e.target.value)} className="w-full p-2 border rounded text-sm h-20"/></div>
                                  <div className="space-y-2 bg-orange-50/30 p-3 rounded-xl" dir="ltr"><div className="flex justify-between items-center"><label className="text-xs font-bold text-orange-600">English</label><button onClick={() => handleSmartFillMissionVision('vision', 'en')} className="text-[9px] bg-orange-200 px-2 rounded">{translatingField === 'vision_en' ?
                                  <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button></div><input placeholder="Title" value={localSettings.about?.vision_title_en || ''} onChange={e => handleSettingChange('about', 'vision_title_en', e.target.value)} className="w-full p-2 border rounded text-sm"/><textarea placeholder="Description..." value={localSettings.about?.vision_desc_en ||
                                  ''} onChange={e => handleSettingChange('about', 'vision_desc_en', e.target.value)} className="w-full p-2 border rounded text-sm h-20"/></div>
                              </div>
                          </div>

                          {/* 3. چرا بهشتی تراول (داینامیک) */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                               <h3 className="font-bold border-b pb-2 flex justify-between items-center text-[#058B8C]">
                                  چرا بهشتی تراول؟ (Why Us)
                                  <button onClick={handleAddWhyUs} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-100 transition"><Plus size={14}/> افزودن آیتم</button>
                              </h3>
                              <div className="space-y-4">
                                  {(localSettings.why_us || []).map((item, index) => (
                                      <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                                          
                                          {/* --- بخش جدید: انتخاب آیکون --- */}
                                          <div className="flex flex-col gap-3 mb-4">
                                              <div className="flex justify-between items-center border-b pb-2 border-gray-200">
                                                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                                      <span className="font-bold text-gray-500 text-xs ml-2">آیکون:</span>
                                                      {['Shield', 'Globe', 'Users', 'Award', 'Target', 'Eye', 'Clock', 'CheckCircle'].map(iconName => (
                                                          <button 
                                                              key={iconName}
                                                              onClick={() => handleWhyUsChange(index, 'icon', iconName)}
                                                              className={`p-1.5 rounded-lg border transition-all ${item.icon === iconName ?
                                                              'bg-[#058B8C] text-white border-[#058B8C] scale-110 shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                                                              title={iconName}
                                                          >
                                                              {iconName === 'Shield' && <Shield size={16}/>}
                                                              {iconName === 'Globe' && <Globe size={16}/>}
                                                              {iconName === 'Users' && <Users size={16}/>}
                                                              {iconName === 'Award' && <Award size={16}/>}
                                                              {iconName === 'Target' && <Target size={16}/>}
                                                              {iconName === 'Eye' && <Eye size={16}/>}
                                                              {iconName === 'Clock' && <Clock size={16}/>}
                                                              {iconName === 'CheckCircle' && <CheckCircle size={16}/>}
                                                          </button>
                                                      ))}
                                                  </div>
                                                  <button onClick={() => handleDeleteWhyUs(index)} className="text-red-500 hover:bg-red-50 p-1.5 rounded shrink-0"><Trash size={16}/></button>
                                              </div>
                                          </div>
                                          {/* ----------------------------- */}

                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                              <div className="space-y-2 border-l pl-2">
                                                  <label className="text-[10px] font-bold text-blue-600">دری</label>
                                                  <input value={item.title_dr ||
                                                  ''} onChange={e => handleWhyUsChange(index, 'title_dr', e.target.value)} placeholder="عنوان (مثلا: امنیت)" className="w-full p-2 border rounded text-sm font-bold"/>
                                                  <textarea value={item.desc_dr ||
                                                  ''} onChange={e => handleWhyUsChange(index, 'desc_dr', e.target.value)} placeholder="توضیحات" className="w-full p-2 border rounded text-sm"/>
                                              </div>
                                              <div className="space-y-2 border-l pl-2">
                                                   <div className="flex justify-between items-center"><label className="text-[10px] font-bold text-green-600">پشتو</label><button onClick={() => handleSmartFillWhyUs(index, 'ps')} className="text-[9px] bg-green-100 px-2 rounded">{translatingField === `whyus_${index}_ps` ?
                                                   <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button></div>
                                                  <input value={item.title_ps ||
                                                  ''} onChange={e => handleWhyUsChange(index, 'title_ps', e.target.value)} placeholder="عنوان" className="w-full p-2 border rounded text-sm font-bold"/>
                                                  <textarea value={item.desc_ps ||
                                                  ''} onChange={e => handleWhyUsChange(index, 'desc_ps', e.target.value)} placeholder="توضیحات" className="w-full p-2 border rounded text-sm"/>
                                              </div>
                                              <div className="space-y-2" dir="ltr">
                                                   <div className="flex justify-between items-center"><label className="text-[10px] font-bold text-orange-600">English</label><button onClick={() => handleSmartFillWhyUs(index, 'en')} className="text-[9px] bg-orange-100 px-2 rounded">{translatingField === `whyus_${index}_en` ?
                                                   <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button></div>
                                                  <input value={item.title_en ||
                                                  ''} onChange={e => handleWhyUsChange(index, 'title_en', e.target.value)} placeholder="Title" className="w-full p-2 border rounded text-sm font-bold"/>
                                                  <textarea value={item.desc_en ||
                                                  ''} onChange={e => handleWhyUsChange(index, 'desc_en', e.target.value)} placeholder="Description" className="w-full p-2 border rounded text-sm"/>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>


                          {/* 4. اعضای تیم (تیم ما - آپدیت شده) */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                              <h3 className="font-bold border-b pb-2 flex justify-between items-center text-[#058B8C]">
                                اعضای تیم (تیم ما)
                                <button onClick={handleAddTeamMember} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-100 transition"><Plus size={14}/> افزودن عضو</button>
                            </h3>
                            <div className="space-y-3">
                                {(localSettings.team || []).map((member, index) => (
                                    <div key={index} className={`bg-gray-50 p-3 rounded-xl border transition-all ${editingTeamId === index ? 'ring-2 ring-[#058B8C] bg-white shadow-md' : 'hover:shadow-md'}`} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleSortTeam} onDragOver={(e) => e.preventDefault()}>
                                        {editingTeamId === index ? (
                                            <div className="space-y-4 animate-in fade-in">
                                                <div className="flex justify-between items-center border-b pb-2 mb-2"><span className="text-xs font-bold text-[#058B8C]">ویرایش عضو: {member.name_fa || member.name}</span><button onClick={() => setEditingTeamId(null)} className="text-xs bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600"><Check size={12}/> ذخیره</button></div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div><label className="text-[10px] font-bold text-gray-500 block mb-1">نام (فارسی)</label><input value={member.name_fa || member.name || ''} onChange={e => handleTeamChange(index, 'name_fa', e.target.value)} className="w-full p-2 border rounded text-sm"/></div>
                                                        <div dir="ltr"><label className="text-[10px] font-bold text-gray-500 block mb-1">Name (English)</label><input value={member.name_en ||
                                                        ''} onChange={e => handleTeamChange(index, 'name_en', e.target.value)} className="w-full p-2 border rounded text-sm"/></div>
                                                        <div className="flex items-center gap-2"><Image size={16} className="text-gray-400"/><input value={member.image ||
                                                        ''} onChange={e => handleTeamChange(index, 'image', e.target.value)} className="w-full p-2 border rounded text-sm dir-ltr" placeholder="لینک عکس پروفایل"/></div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500 block">سمت (سه زبانه)</label>
                                                        <input value={member.role_dr ||
                                                        ''} onChange={e => handleTeamChange(index, 'role_dr', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="سمت (دری)"/>
                                                        <div className="flex gap-1"><input value={member.role_ps ||
                                                        ''} onChange={e => handleTeamChange(index, 'role_ps', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="سمت (پشتو)"/><button onClick={()=>handleSmartFillTeam(index, 'ps')} className="bg-green-100 px-2 rounded hover:bg-green-200">{translatingField === `team_${index}_ps` ?
                                                        <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}</button></div>
                                                        <div className="flex gap-1" dir="ltr"><input value={member.role_en ||
                                                        ''} onChange={e => handleTeamChange(index, 'role_en', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Role (English)"/><button onClick={()=>handleSmartFillTeam(index, 'en')} className="bg-orange-100 px-2 rounded hover:bg-orange-200">{translatingField === `team_${index}_en` ?
                                                        <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}</button></div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                                    <div><label className="text-[10px] font-bold text-gray-500 block mb-1">شماره تماس (دیپ لینک)</label><input value={member.phone ||
                                                    ''} onChange={e => handleTeamChange(index, 'phone', e.target.value)} className="w-full p-2 border rounded text-sm dir-ltr" placeholder="+93..."/></div>
                                                    <div><label className="text-[10px] font-bold text-green-600 block mb-1">واتساپ (دیپ لینک)</label><input value={member.whatsapp ||
                                                    ''} onChange={e => handleTeamChange(index, 'whatsapp', e.target.value)} className="w-full p-2 border rounded text-sm dir-ltr" placeholder="+93..."/></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="cursor-grab text-gray-300 hover:text-gray-600 active:cursor-grabbing p-1"><GripVertical size={20}/></div>
                                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">{member.image ? <img src={member.image} className="w-full h-full object-cover"/> : <User size={24} className="m-2 text-gray-400"/>}</div>
                                                <div className="flex-1"><h4 className="font-bold text-gray-800 text-sm">{member.name_fa || member.name || 'نامشخص'} <span className="text-[10px] text-gray-400 font-normal">({member.name_en})</span></h4><div className="text-[10px] text-gray-400">{member.role_dr} / {member.role_en}</div></div>
                                                <div className="flex items-center gap-1"><button onClick={() => setEditingTeamId(index)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"><Edit size={16}/></button><button onClick={() => handleDeleteTeamMember(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash size={16}/></button></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                          </div>
                      </div>
                  )}

                  {aboutContactTab === 'contact' && (
                      <div className="space-y-6">
                           {/* 1. دفتر مرکزی */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                            <h3 className="font-bold border-b pb-2 text-[#058B8C] flex items-center gap-2"><Building2 size={20}/> دفتر مرکزی (Main Branch)</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">شماره تماس اصلی</label><div className="flex items-center gap-2 border rounded-lg p-2"><Phone size={16} className="text-gray-400"/><input value={localSettings.contact?.phone ||
                                ''} onChange={e => handleSettingChange('contact', 'phone', e.target.value)} className="w-full bg-transparent outline-none dir-ltr" placeholder="+93..."/></div></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">ایمیل رسمی</label><div className="flex items-center gap-2 border rounded-lg p-2"><span className="text-gray-400">@</span><input value={localSettings.contact?.email ||
                                ''} onChange={e => handleSettingChange('contact', 'email', e.target.value)} className="w-full bg-transparent outline-none dir-ltr" placeholder="info@..."/></div></div>
                                <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1">لینک گوگل مپ</label><div className="flex items-center gap-2 border rounded-lg p-2"><MapPin size={16} className="text-gray-400"/><input value={localSettings.contact?.map_link ||
                                ''} onChange={e => handleSettingChange('contact', 'map_link', e.target.value)} className="w-full bg-transparent outline-none dir-ltr" placeholder="https://maps.google..."/></div></div>
                            </div>

                            {/* شبکه‌های اجتماعی دفتر مرکزی */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <label className="text-xs font-bold text-gray-500 mb-3 block">شبکه‌های اجتماعی دفتر مرکزی</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] text-green-600 mb-1 flex items-center gap-1 font-bold">
                                            <MessageCircle size={10}/> WhatsApp
                                        </label>
                                        <input value={localSettings.contact?.whatsapp ||
                                        ''} onChange={e => handleSettingChange('contact', 'whatsapp', e.target.value)} className="w-full p-2 border rounded text-xs dir-ltr" placeholder="Number"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-blue-500 mb-1 flex items-center gap-1 font-bold">
                                            <Send size={10}/> Telegram
                                        </label>
                                        <input value={localSettings.contact?.telegram ||
                                        ''} onChange={e => handleSettingChange('contact', 'telegram', e.target.value)} className="w-full p-2 border rounded text-xs dir-ltr" placeholder="ID"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-pink-600 mb-1 flex items-center gap-1 font-bold">
                                            <Instagram size={10}/> Instagram
                                        </label>
                                        <input value={localSettings.contact?.instagram ||
                                        ''} onChange={e => handleSettingChange('contact', 'instagram', e.target.value)} className="w-full p-2 border rounded text-xs dir-ltr" placeholder="ID"/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-blue-800 mb-1 flex items-center gap-1 font-bold">
                                            <Facebook size={10}/> Facebook
                                        </label>
                                        <input value={localSettings.contact?.facebook ||
                                        ''} onChange={e => handleSettingChange('contact', 'facebook', e.target.value)} className="w-full p-2 border rounded text-xs dir-ltr" placeholder="Page ID"/>
                                    </div>
                                </div>
                            </div>

                            {/* آدرس و کپی‌رایت */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                                <div className="space-y-3">
                                    <h4 className="font-bold text-xs text-blue-600">دری</h4>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">آدرس دقیق</label><input value={localSettings.contact?.address ||
                                    localSettings.contact?.address_dr || ''} onChange={e => handleSettingChange('contact', 'address', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">کپی‌رایت</label><input value={localSettings.contact?.copyright ||
                                    localSettings.contact?.copyright_dr || ''} onChange={e => handleSettingChange('contact', 'copyright', e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center"><h4 className="font-bold text-xs text-green-600">پشتو</h4><button onClick={() => handleSmartFillAddress('ps')} className="text-[9px] bg-green-200 px-2 rounded">ترجمه</button></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">پته</label><input value={localSettings.contact?.address_ps ||
                                    ''} onChange={e => handleSettingChange('contact', 'address_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">حق کاپي</label><input value={localSettings.contact?.copyright_ps ||
                                    ''} onChange={e => handleSettingChange('contact', 'copyright_ps', e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                                </div>
                                <div className="space-y-3" dir="ltr">
                                    <div className="flex justify-between items-center"><h4 className="font-bold text-xs text-orange-600">English</h4><button onClick={() => handleSmartFillAddress('en')} className="text-[9px] bg-orange-200 px-2 rounded">Translate</button></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Address</label><input value={localSettings.contact?.address_en ||
                                    ''} onChange={e => handleSettingChange('contact', 'address_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Copyright</label><input value={localSettings.contact?.copyright_en ||
                                    ''} onChange={e => handleSettingChange('contact', 'copyright_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                                </div>
                            </div>
                          </div>

                          {/* 2. لیست نمایندگی‌ها */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                              <h3 className="font-bold border-b pb-2 flex justify-between items-center text-[#058B8C]">
                                  نمایندگی‌ها (Agencies)
                                  <button onClick={handleAddAgency} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-100 transition"><Plus size={14}/> افزودن نمایندگی</button>
                              </h3>
                              <div className="space-y-4">
                                  {(localSettings.agencies || []).map((agency, index) => (
                                      <div key={index} className="bg-gray-50 p-4 rounded-xl border">
                                          {editingAgencyId === index ?
                                          (
                                              <div className="space-y-4 animate-in fade-in bg-white p-4 rounded-lg shadow-sm">
                                                  <div className="flex justify-between items-center border-b pb-2"><span className="text-xs font-bold text-[#058B8C]">ویرایش نمایندگی</span><button onClick={() => setEditingAgencyId(null)} className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">ذخیره</button></div>
                                                  
                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                      {/* دری */}
                                                      <div className="space-y-2 border-l pl-2">
                                                          <label className="text-[10px] text-blue-600 font-bold">دری</label>
                                                          <input value={agency.name_dr ||
                                                          ''} onChange={e => handleAgencyChange(index, 'name_dr', e.target.value)} placeholder="نام نمایندگی" className="w-full p-2 border rounded text-xs font-bold"/>
                                                          <textarea value={agency.address_dr ||
                                                          ''} onChange={e => handleAgencyChange(index, 'address_dr', e.target.value)} placeholder="آدرس" className="w-full p-2 border rounded text-xs"/>
                                                      </div>
                                                      {/* پشتو */}
                                                      <div className="space-y-2 border-l pl-2">
                                                          <div className="flex justify-between"><label className="text-[10px] text-green-600 font-bold">پشتو</label><button onClick={()=>handleSmartFillAgency(index, 'ps')} className="text-[9px] bg-green-100 px-2 rounded">ترجمه</button></div>
                                                          <input value={agency.name_ps || ''} onChange={e => handleAgencyChange(index, 'name_ps', e.target.value)} placeholder="نوم" className="w-full p-2 border rounded text-xs font-bold"/>
                                                          <textarea value={agency.address_ps ||
                                                          ''} onChange={e => handleAgencyChange(index, 'address_ps', e.target.value)} placeholder="پته" className="w-full p-2 border rounded text-xs"/>
                                                      </div>
                                                      {/* انگلیسی */}
                                                      <div className="space-y-2" dir="ltr">
                                                          <div className="flex justify-between"><label className="text-[10px] text-orange-600 font-bold">English</label><button onClick={()=>handleSmartFillAgency(index, 'en')} className="text-[9px] bg-orange-100 px-2 rounded">Translate</button></div>
                                                          <input value={agency.name_en || ''} onChange={e => handleAgencyChange(index, 'name_en', e.target.value)} placeholder="Name" className="w-full p-2 border rounded text-xs font-bold"/>
                                                          <textarea value={agency.address_en ||
                                                          ''} onChange={e => handleAgencyChange(index, 'address_en', e.target.value)} placeholder="Address" className="w-full p-2 border rounded text-xs"/>
                                                      </div>
                                                  </div>

                                                  <div className="bg-gray-100 p-3 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
                                                      <input value={agency.phone ||
                                                      ''} onChange={e => handleAgencyChange(index, 'phone', e.target.value)} placeholder="Phone" className="p-2 rounded text-xs dir-ltr"/>
                                                      <input value={agency.whatsapp ||
                                                      ''} onChange={e => handleAgencyChange(index, 'whatsapp', e.target.value)} placeholder="WhatsApp" className="p-2 rounded text-xs dir-ltr"/>
                                                      <input value={agency.telegram ||
                                                      ''} onChange={e => handleAgencyChange(index, 'telegram', e.target.value)} placeholder="Telegram" className="p-2 rounded text-xs dir-ltr"/>
                                                      <input value={agency.instagram ||
                                                      ''} onChange={e => handleAgencyChange(index, 'instagram', e.target.value)} placeholder="Instagram" className="p-2 rounded text-xs dir-ltr"/>
                                                      <input value={agency.facebook ||
                                                      ''} onChange={e => handleAgencyChange(index, 'facebook', e.target.value)} placeholder="Facebook" className="p-2 rounded text-xs dir-ltr"/>
                                                      <input value={agency.map_link ||
                                                      ''} onChange={e => handleAgencyChange(index, 'map_link', e.target.value)} placeholder="Map Link" className="p-2 rounded text-xs dir-ltr col-span-3"/>
                                                  </div>
                                              </div>
                                          ) : (
                                              <div className="flex justify-between items-center">
                                                  <div>
                                                      <h4 className="font-bold text-gray-800 text-sm">{agency.name_dr || 'نمایندگی جدید'}</h4>
                                                      <p className="text-xs text-gray-500 mt-1">{agency.address_dr}</p>
                                                  </div>
                                                  <div className="flex gap-2">
                                                      <button onClick={() => setEditingAgencyId(index)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"><Edit size={16}/></button>
                                                      <button onClick={() => handleDeleteAgency(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash size={16}/></button>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="mt-8 flex justify-end">
                      <button onClick={saveSettings} className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl shadow-lg font-black flex items-center gap-2 transition-transform transform active:scale-95">
                          <Save size={20}/> ذخیره تغییرات
                       </button>
                  </div>
              </div>
          )}

          {/* بخش تنظیمات سایت (قدیمی) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in pb-20">
              <div className="flex gap-2 overflow-x-auto pb-2 border-b custom-scrollbar">
                {['general', 'navbar', 'hero', 'weather', 'services', 'footer'].map(tab => (
                  <button key={tab} onClick={() => setSettingsTab(tab)} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${settingsTab === tab ?
                  'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {tab === 'general' ?
                    'عمومی' : 
                     tab === 'navbar' ?
                    'ناوبار (لوگو)' : 
                     tab === 'hero' ?
                    'هیرو و آمار' : 
                     tab === 'weather' ?
                    'آب و هوا' : 
                     tab === 'services' ?
                    'خدمات' : 
                     'فوتر (لینک‌ها)'}
                  </button>
                ))}
              </div>

              {settingsTab === 'general' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                  <h3 className="font-bold border-b pb-2">تنظیمات اصلی</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">نام برند</label><input value={localSettings.general?.brandName || ''} onChange={e => handleSettingChange('general', 'brandName', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                  </div>
                </div>
              )}

              {settingsTab === 'navbar' && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                   <h3 className="font-bold border-b pb-2 text-[#058B8C]">تنظیمات لوگو و ناوبار</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl">
                          <h4 className="font-bold text-xs text-blue-600 mb-2">لوگوی پیش‌فرض (دری و پشتو)</h4>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">لینک لوگو (Dr/Ps)</label>
                            <div className="flex gap-2 items-center">
                              <Image size={18} className="text-gray-400" />
                              <input value={localSettings.navbar?.logo_dr ||
                              ''} onChange={e => handleSettingChange('navbar', 'logo_dr', e.target.value)} className="w-full p-2 border rounded-lg dir-ltr text-left" placeholder="https://..."/>
                            </div>
                          </div>
                          {localSettings.navbar?.logo_dr && (
                              <div className="mt-2 p-2 bg-white rounded border border-blue-100 flex justify-center"><img src={localSettings.navbar?.logo_dr} alt="Preview" className="h-10 object-contain"/></div>
                          )}
                      </div>
                      <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl" dir="ltr">
                          <h4 className="font-bold text-xs text-orange-600 mb-2">English Logo</h4>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Logo Link (En)</label>
                            <div className="flex gap-2 items-center">
                              <Image size={18} className="text-gray-400" />
                              <input value={localSettings.navbar?.logo_en ||
                              ''} onChange={e => handleSettingChange('navbar', 'logo_en', e.target.value)} className="w-full p-2 border rounded-lg" placeholder="https://..."/>
                            </div>
                          </div>
                          {localSettings.navbar?.logo_en && (
                              <div className="mt-2 p-2 bg-white rounded border border-orange-100 flex justify-center"><img src={localSettings.navbar?.logo_en} alt="Preview" className="h-10 object-contain"/></div>
                          )}
                      </div>
                  </div>
                </div>
              )}

              {settingsTab === 'hero' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                     <h3 className="font-bold border-b pb-2 text-[#058B8C]">متن‌های هیرو (سه زبانه)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl">
                            <h4 className="font-bold text-xs text-blue-600 mb-2">نسخه دری</h4>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">تیتر اصلی</label><input value={localSettings.hero?.title_dr ||
                            ''} onChange={e => handleSettingChange('hero', 'title_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان</label><input value={localSettings.hero?.subtitle_dr ||
                            ''} onChange={e => handleSettingChange('hero', 'subtitle_dr', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                        <div className="space-y-3 bg-green-50/50 p-4 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs text-green-600">نسخه پشتو</h4>
                                <button type="button" onClick={() => handleSmartFillHero('ps')} className="text-[9px] flex items-center gap-1 bg-green-200 text-green-800 px-2 py-0.5 rounded hover:bg-green-300">
                                    {translatingField === 'hero_ps' ?
                                    <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه
                                </button>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">تیتر اصلی</label><input value={localSettings.hero?.title_ps || ''} onChange={e => handleSettingChange('hero', 'title_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان</label><input value={localSettings.hero?.subtitle_ps ||
                            ''} onChange={e => handleSettingChange('hero', 'subtitle_ps', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                        <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl" dir="ltr">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-xs text-orange-600">English Version</h4>
                                <button type="button" onClick={() => handleSmartFillHero('en')} className="text-[9px] flex items-center gap-1 bg-orange-200 text-orange-800 px-2 py-0.5 rounded hover:bg-orange-300">
                                    {translatingField === 'hero_en' ?
                                    <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Translate
                                </button>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Main Title</label><input value={localSettings.hero?.title_en || ''} onChange={e => handleSettingChange('hero', 'title_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label><input value={localSettings.hero?.subtitle_en ||
                            ''} onChange={e => handleSettingChange('hero', 'subtitle_en', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                        </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                     <h3 className="font-bold border-b pb-2 flex justify-between items-center text-[#058B8C]">
                        تصاویر اسلایدر هیرو
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">تعداد: {localSettings.hero?.images?.length ||
                        0}</span>
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
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">مشتریان</label><input type="number" value={localSettings.stats?.customers ||
                      0} onChange={e => handleSettingChange('stats', 'customers', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">پروازها</label><input type="number" value={localSettings.stats?.flights ||
                      0} onChange={e => handleSettingChange('stats', 'flights', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">ویزاها</label><input type="number" value={localSettings.stats?.visas ||
                      0} onChange={e => handleSettingChange('stats', 'visas', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
                      <div><label className="block text-xs font-bold text-gray-500 mb-1">تجربه</label><input type="number" value={localSettings.stats?.experience ||
                      0} onChange={e => handleSettingChange('stats', 'experience', Number(e.target.value))} className="w-full p-2 border rounded-lg"/></div>
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
                               <input value={city.name} onChange={e => { const updated = [...localSettings.weather_cities];
                               updated[index].name = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm" placeholder="نام انگلیسی"/>
                               <input value={city.faName} onChange={e => { const updated = [...localSettings.weather_cities];
                               updated[index].faName = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm" placeholder="نام شهر (فارسی)"/>
                               <input value={city.countryName ||
                               ''} onChange={e => { const updated = [...localSettings.weather_cities]; updated[index].countryName = e.target.value; handleSettingChange('weather_cities', null, updated);
                                }} className="p-2 rounded border text-sm" placeholder="نام کشور (فارسی)"/>
                               <select value={city.timezone} onChange={e => { const updated = [...localSettings.weather_cities];
                               updated[index].timezone = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm dir-ltr bg-white">
                                {VALID_TIMEZONES.map(tz => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
                               </select>
                               <input value={city.image} onChange={e => { const updated = [...localSettings.weather_cities];
                               updated[index].image = e.target.value; handleSettingChange('weather_cities', null, updated); }} className="p-2 rounded border text-sm dir-ltr" placeholder="لینک عکس"/>
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
                           {editingCityId 
                            === city.id ? (
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
                            <div className="space-y-2 border-l pl-2">
                                 <label className="text-[10px] font-bold text-blue-600 block">دری</label>
                                <input value={srv.title} onChange={e => handleServiceChange(index, 'title', e.target.value)} className="w-full p-2 border rounded bg-white font-bold text-xs" placeholder="عنوان"/>
                                <input value={srv.desc} onChange={e => handleServiceChange(index, 'desc', e.target.value)} className="w-full p-2 border rounded bg-white text-xs" placeholder="توضیحات"/>
                             </div>
                            <div className="space-y-2 border-l pl-2">
                                <div className="flex justify-between items-center mb-1">
                                     <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                                     <button onClick={() => handleSmartFillService(index, 'ps')} className="text-[9px] flex items-center gap-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded hover:bg-green-200">
                                         {translatingField === `service_${index}_ps` ?
                                         <Loader2 size={8} className="animate-spin"/> : <Sparkles size={8}/>} ترجمه
                                    </button>
                                </div>
                                <input value={srv.title_ps ||
                                ''} onChange={e => handleServiceChange(index, 'title_ps', e.target.value)} className="w-full p-2 border rounded bg-white font-bold text-xs" placeholder="عنوان پشتو"/>
                                <input value={srv.desc_ps ||
                                ''} onChange={e => handleServiceChange(index, 'desc_ps', e.target.value)} className="w-full p-2 border rounded bg-white text-xs" placeholder="توضیحات پشتو"/>
                            </div>
                            <div className="space-y-2" dir="ltr">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[10px] font-bold text-orange-600 block">English</label>
                                    <button onClick={() => handleSmartFillService(index, 'en')} className="text-[9px] flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded hover:bg-orange-200">
                                        {translatingField === `service_${index}_en` ?
                                        <Loader2 size={8} className="animate-spin"/> : <Sparkles size={8}/>} Translate
                                    </button>
                                </div>
                                <input value={srv.title_en ||
                                ''} onChange={e => handleServiceChange(index, 'title_en', e.target.value)} className="w-full p-2 border rounded bg-white font-bold text-xs" placeholder="Title"/>
                                <input value={srv.desc_en ||
                                ''} onChange={e => handleServiceChange(index, 'desc_en', e.target.value)} className="w-full p-2 border rounded bg-white text-xs" placeholder="Description"/>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
               )}

              {/* تب فوتر: لینک‌های مفید + متن درباره ما */}
              {settingsTab === 'footer' && (
                 <div className="space-y-6 animate-in fade-in">
                   
                   {/* بخش جدید: متن درباره ما در فوتر */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                      <h3 className="font-bold border-b pb-2 text-[#058B8C]">متن کوتاه «درباره ما» در فوتر</h3>
                      <p className="text-xs text-gray-400 mb-2">این متن فقط در پایین سایت نمایش داده می‌شود. پیشنهاد می‌شود کوتاه باشد (حدود 30 تا 50 کلمه).</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* دری */}
                          <div className="space-y-2 border-l pl-2">
                              <label className="text-[10px] font-bold text-blue-600 block">دری (فارسی)</label>
                              <textarea 
                                value={localSettings.contact?.footer_about_dr || ''} 
                                onChange={e => handleSettingChange('contact', 'footer_about_dr', e.target.value)} 
                                className="w-full p-2 border rounded-lg h-24 text-sm"
                                placeholder="متن کوتاه معرفی شرکت..."
                              />
                          </div>
                          
                          {/* پشتو */}
                          <div className="space-y-2 border-l pl-2">
                              <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                                  <button onClick={() => handleSmartFillFooterAbout('ps')} className="text-[9px] flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded hover:bg-green-200">
                                      {translatingField === 'footer_about_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه
                                  </button>
                              </div>
                              <textarea 
                                value={localSettings.contact?.footer_about_ps || ''} 
                                onChange={e => handleSettingChange('contact', 'footer_about_ps', e.target.value)} 
                                className="w-full p-2 border rounded-lg h-24 text-sm"
                                placeholder="لنډ متن..."
                              />
                          </div>

                          {/* انگلیسی */}
                          <div className="space-y-2" dir="ltr">
                              <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-orange-600 block">English</label>
                                  <button onClick={() => handleSmartFillFooterAbout('en')} className="text-[9px] flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded hover:bg-orange-200">
                                      {translatingField === 'footer_about_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Translate
                                  </button>
                              </div>
                              <textarea 
                                value={localSettings.contact?.footer_about_en || ''} 
                                onChange={e => handleSettingChange('contact', 'footer_about_en', e.target.value)} 
                                className="w-full p-2 border rounded-lg h-24 text-sm"
                                placeholder="Short description..."
                              />
                          </div>
                      </div>
                   </div>

                   {/* بخش لینک‌های مفید */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2 text-[#058B8C] flex justify-between items-center">
                        لینک‌های مفید فوتر (با قابلیت جابجایی)
                        <button onClick={handleAddLink} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-100 transition">
                            <Plus size={14}/> افزودن لینک
                        </button>
                    </h3>
                    <div className="space-y-3">
                        {(localSettings.useful_links || []).map((link, index) => (
                            <div 
                                key={index} 
                                className={`bg-white p-3 rounded-xl border transition-all ${editingLinkId === index ? 'ring-2 ring-[#058B8C] shadow-md' : 'hover:shadow-md'}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleSortLinks}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {editingLinkId === index ? (
                                    <div className="space-y-4 animate-in fade-in">
                                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                                            <span className="text-xs font-bold text-[#058B8C]">ویرایش لینک #{index + 1}</span>
                                            <button onClick={() => setEditingLinkId(null)} className="text-xs bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600">
                                                <Check size={12}/> ذخیره
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-blue-600 block">عنوان (دری) و لینک</label>
                                                <input value={link.title_dr || ''} onChange={e => handleLinkChange(index, 'title_dr', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-xs font-bold" placeholder="مثلا: ریاست پاسپورت"/>
                                                <div className="flex items-center gap-1">
                                                    <Globe size={14} className="text-gray-400"/>
                                                    <input value={link.url || ''} onChange={e => handleLinkChange(index, 'url', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-xs dir-ltr" placeholder="https://..."/>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex gap-1 items-center">
                                                    <input value={link.title_ps || ''} onChange={e => handleLinkChange(index, 'title_ps', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-xs" placeholder="پشتو"/>
                                                    <button onClick={() => handleSmartFillLink(index, 'ps')} className="shrink-0 bg-green-100 text-green-700 px-2 h-8 rounded hover:bg-green-200 flex items-center justify-center" title="ترجمه هوشمند">
                                                        {translatingField === `link_${index}_ps` ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                                                    </button>
                                                </div>
                                                <div className="flex gap-1 items-center" dir="ltr">
                                                    <input value={link.title_en || ''} onChange={e => handleLinkChange(index, 'title_en', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-xs" placeholder="English"/>
                                                    <button onClick={() => handleSmartFillLink(index, 'en')} className="shrink-0 bg-orange-100 text-orange-700 px-2 h-8 rounded hover:bg-orange-200 flex items-center justify-center" title="Smart Translate">
                                                        {translatingField === `link_${index}_en` ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="cursor-grab text-gray-300 hover:text-gray-600 active:cursor-grabbing p-1"><GripVertical size={20}/></div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                                {link.title_dr || 'بدون عنوان'}
                                                <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded dir-ltr">{link.url}</span>
                                            </h4>
                                            <div className="text-[10px] text-gray-400 mt-0.5 flex gap-2">
                                                {link.title_ps && <span>PS: {link.title_ps}</span>}
                                                {link.title_en && <span>EN: {link.title_en}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDuplicateLink(link)} className="p-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 transition" title="کپی"><Copy size={16}/></button>
                                            <button onClick={() => setEditingLinkId(index)} className="p-2 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-200 transition" title="ویرایش"><Edit size={16}/></button>
                                            <button onClick={() => handleDeleteLink(index)} className="p-2 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 transition" title="حذف"><Trash size={16}/></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {(localSettings.useful_links || []).length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                <div className="text-gray-400 text-sm mb-2">هنوز لینکی اضافه نشده است</div>
                                <button onClick={handleAddLink} className="text-xs text-[#058B8C] font-bold hover:underline">اولین لینک را اضافه کنید</button>
                            </div>
                        )}
                    </div>
                  </div>
                 </div>
              )}

              <div className="mt-8 flex justify-end">
                <button onClick={saveSettings} className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl shadow-lg font-black flex items-center gap-2 transition-transform transform active:scale-95">
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
                       {bookings && bookings.length > 0 ?
                       bookings.map(b => (
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
                                   <div className="font-black text-blue-600">{(b.amount ||
                                   0).toLocaleString()} <span className="text-[9px] text-gray-400">افغانی</span></div>
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

          {/* بخش اخبار */}
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
                                   {translatingField === 'ps' ?
                                   <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه هوشمند
                               </button>
                           </div>
                           <input placeholder="د خبر سرلیک" value={newNews.title_ps ||
                           ''} onChange={e=>setNewNews({...newNews, title_ps: e.target.value})} className="w-full p-2 rounded border text-sm font-bold"/>
                           <textarea placeholder="د خبر بشپړ متن..." value={newNews.desc_ps ||
                           ''} onChange={e=>setNewNews({...newNews, desc_ps: e.target.value})} className="w-full p-2 rounded border h-32 text-sm"/>
                       </div>
                       {/* انگلیسی */}
                       <div className="space-y-2 bg-white p-3 rounded-lg border" dir="ltr">
                           <div className="text-xs font-bold text-orange-600 mb-1 flex justify-between items-center">
                               <span>English</span>
                               <button type="button" onClick={() => handleSmartFillNews('en')} className="text-[9px] flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded hover:bg-orange-200 transition">
                                   {translatingField === 'en' ?
                                   <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Auto Translate
                               </button>
                           </div>
                           <input placeholder="News Title" value={newNews.title_en ||
                           ''} onChange={e=>setNewNews({...newNews, title_en: e.target.value})} className="w-full p-2 rounded border text-sm font-bold"/>
                           <textarea placeholder="Full news content..." value={newNews.desc_en ||
                           ''} onChange={e=>setNewNews({...newNews, desc_en: e.target.value})} className="w-full p-2 rounded border h-32 text-sm"/>
                       </div>
                   </div>

                   <div className="flex items-center gap-2">
                        <Image size={20} className="text-gray-400"/>
                        <input placeholder="لینک عکس" value={newNews.img} onChange={e=>setNewNews({...newNews, img: e.target.value})} className="flex-1 p-2 rounded border dir-ltr text-left"/>
                   </div>
    
                   <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold w-full shadow-lg hover:bg-blue-700 transition">{editingId ?
                   'ذخیره تغییرات' : 'انتشار خبر جدید'}</button>
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
                          <button onClick={()=>handleTogglePin(n.id, n.pinned)} title={n.pinned ?
                          "برداشتن پین" : "پین کردن"}><Pin size={18} className={n.pinned ? "text-yellow-500" : "text-gray-400"}/></button>
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