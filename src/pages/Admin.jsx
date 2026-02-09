import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash, Megaphone, Ticket, User, Phone, CheckCircle, XCircle, Edit, Copy, X, Save, Settings, Layout, Image, Type, Pin, Globe, FileText, Briefcase, GripVertical, Check, CreditCard, Clock, Calendar } from 'lucide-react';

// لیست تایم‌زون‌های معتبر برای جلوگیری از تایپ اشتباه
const VALID_TIMEZONES = [
  { label: "کابل (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "تهران (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "دبی (Asia/Dubai)", value: "Asia/Dubai" },
  { label: "استانبول (Europe/Istanbul)", value: "Europe/Istanbul" },
  { label: "کراچی/اسلام‌آباد (Asia/Karachi)", value: "Asia/Karachi" },
  { label: "لندن (Europe/London)", value: "Europe/London" },
  { label: "برلین (Europe/Berlin)", value: "Europe/Berlin" },
  { label: "مسکو (Europe/Moscow)", value: "Europe/Moscow" },
  { label: "نیویورک (America/New_York)", value: "America/New_York" },
  { label: "تورنتو (America/Toronto)", value: "America/Toronto" },
  { label: "سیدنی (Australia/Sydney)", value: "Australia/Sydney" },
  { label: "توکیو (Asia/Tokyo)", value: "Asia/Tokyo" },
];

export default function Admin({ user, news, bookings, settings, onUpdate }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [settingsTab, setSettingsTab] = useState('general');

  const [localSettings, setLocalSettings] = useState(settings);
  const [newNews, setNewNews] = useState({ title: '', desc: '', img: '' });
  const [editingId, setEditingId] = useState(null);
  
  // استیت‌های مربوط به بخش آب و هوا
  const [editingCityId, setEditingCityId] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!user || !user.isAdmin) return <div className="text-center py-20 text-red-500 font-bold">دسترسی محدود است.</div>;

  const saveSettings = async () => {
    try {
      const { data } = await supabase.from('site_settings').select('id').limit(1).single();
      if (data) {
        const { error } = await supabase
          .from('site_settings')
          .update({ config: localSettings })
          .eq('id', data.id);
        if (!error) {
          alert('تنظیمات با موفقیت ذخیره شد!');
          onUpdate();
        } else {
          alert('خطا در ذخیره تنظیمات');
        }
      } else {
        await supabase.from('site_settings').insert([{ config: localSettings }]);
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSettingChange = (section, key, value) => {
    setLocalSettings(prev => {
      if (key === null) {
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: { ...prev[section], [key]: value }
      };
    });
  };

  const handleServiceChange = (index, key, value) => {
    const updatedServices = [...localSettings.services];
    updatedServices[index] = { ...updatedServices[index], [key]: value };
    setLocalSettings(prev => ({ ...prev, services: updatedServices }));
  };

  // --- توابع مدیریت شهرها (درگ، کپی، حذف) ---
  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleSort = () => {
    const _weather_cities = [...(localSettings.weather_cities || [])];
    const draggedItemContent = _weather_cities[dragItem.current];
    _weather_cities.splice(dragItem.current, 1);
    _weather_cities.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    handleSettingChange('weather_cities', null, _weather_cities);
  };

  const handleDuplicateCity = (city) => {
    const newCity = { 
      ...city, 
      id: Date.now(), 
      name: city.name, 
      faName: city.faName + ' (کپی)',
      countryName: city.countryName || '' 
    };
    const updated = [...(localSettings.weather_cities || []), newCity];
    handleSettingChange('weather_cities', null, updated);
  };

  const handleDeleteCity = (index) => {
    if(window.confirm('آیا مطمئن هستید؟')) {
      const updated = localSettings.weather_cities.filter((_, i) => i !== index);
      handleSettingChange('weather_cities', null, updated);
    }
  };

  // --- توابع اخبار ---
  const handleSubmitNews = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('news').update({ title: newNews.title, description: newNews.desc, image_url: newNews.img }).eq('id', editingId);
      if (!error) { alert('ویرایش شد'); setEditingId(null); onUpdate(); }
    } else {
      const { error } = await supabase.from('news').insert([{ title: newNews.title, description: newNews.desc, image_url: newNews.img, pinned: false }]);
      if (!error) { alert('ثبت شد'); onUpdate(); }
    }
    setNewNews({ title: '', desc: '', img: '' });
  };

  const handleDeleteNews = async (id) => { if(window.confirm('حذف؟')) { await supabase.from('news').delete().eq('id', id); onUpdate(); }};
  const handleTogglePin = async (id, status) => { await supabase.from('news').update({ pinned: !status }).eq('id', id); onUpdate(); };
  const handleDuplicateNews = async (item) => { await supabase.from('news').insert([{ title: `${item.title} (کپی)`, description: item.description, image_url: item.image_url, pinned: false }]); onUpdate(); };
  const handleEditNews = (item) => { setNewNews({ title: item.title, desc: item.description, img: item.image_url }); setEditingId(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleCancelEdit = () => { setNewNews({ title: '', desc: '', img: '' }); setEditingId(null); };

  // --- توابع رزرو ---
  const handleChangeStatus = async (id, s) => { 
      if(window.confirm('آیا از تغییر وضعیت اطمینان دارید؟')) {
        await supabase.from('bookings').update({ status: s }).eq('id', id);
        onUpdate(); 
      }
  };
  const handleDeleteBooking = async (id) => { if(window.confirm('حذف؟')) { await supabase.from('bookings').delete().eq('id', id); onUpdate(); }};

  // تابع کمکی برای نمایش وضعیت رزرو
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">تایید شده</span>;
      case 'pending_verification': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200 animate-pulse">منتظر تایید پرداخت</span>;
      case 'pending_payment': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">منتظر پرداخت</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">لغو شده</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
      <div className="bg-[#058B8C] p-6 text-white flex justify-between items-center">
        <h1 className="text-2xl font-black">پنل مدیریت {localSettings.general?.brandName}</h1>
        <div className="text-sm opacity-80">{user.email}</div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 p-4 border-l border-gray-200 space-y-2 shrink-0">
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Ticket size={20}/> رزروها و پرداخت</button>
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'news' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Megaphone size={20}/> اخبار</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#058B8C] text-white' : 'hover:bg-gray-200'}`}><Settings size={20}/> تنظیمات سایت</button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-gray-50/50 overflow-x-auto">
          
          {/* Tab: Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in pb-20">
              <div className="flex gap-2 overflow-x-auto pb-2 border-b">
                {['general', 'hero', 'weather', 'services', 'footer'].map(tab => (
                  <button key={tab} onClick={() => setSettingsTab(tab)} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${settingsTab === tab ? 'bg-blue-100 text-blue-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {tab === 'general' ? 'عمومی' : tab === 'hero' ? 'هیرو و آمار' : tab === 'weather' ? 'آب و هوا' : tab === 'services' ? 'خدمات' : 'فوتر'}
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

              {settingsTab === 'hero' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2">بخش هیرو</h3>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">تیتر اصلی</label><input value={localSettings.hero?.title || ''} onChange={e => handleSettingChange('hero', 'title', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">زیرعنوان</label><input value={localSettings.hero?.subtitle || ''} onChange={e => handleSettingChange('hero', 'subtitle', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">لینک عکس</label><input value={localSettings.hero?.image || ''} onChange={e => handleSettingChange('hero', 'image', e.target.value)} className="w-full p-2 border rounded-lg dir-ltr"/></div>
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
                        <div className="cursor-grab text-gray-300 hover:text-gray-600 active:cursor-grabbing p-1">
                           <GripVertical size={20}/>
                        </div>

                        <div className="flex-1">
                           {editingCityId === city.id ? (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                               <input 
                                value={city.name} 
                                onChange={e => {
                                  const updated = [...localSettings.weather_cities];
                                  updated[index].name = e.target.value;
                                  handleSettingChange('weather_cities', null, updated);
                                }} 
                                className="p-2 rounded border text-sm" placeholder="نام انگلیسی (London)"
                              />
                              <input 
                                value={city.faName} 
                                onChange={e => {
                                  const updated = [...localSettings.weather_cities];
                                  updated[index].faName = e.target.value;
                                  handleSettingChange('weather_cities', null, updated);
                                }} 
                                className="p-2 rounded border text-sm" placeholder="نام شهر (فارسی)"
                              />
                              <input 
                                value={city.countryName || ''} 
                                onChange={e => {
                                  const updated = [...localSettings.weather_cities];
                                  updated[index].countryName = e.target.value;
                                  handleSettingChange('weather_cities', null, updated);
                                }} 
                                className="p-2 rounded border text-sm" placeholder="نام کشور (فارسی)"
                              />
                              <select 
                                value={city.timezone} 
                                onChange={e => {
                                  const updated = [...localSettings.weather_cities];
                                  updated[index].timezone = e.target.value;
                                  handleSettingChange('weather_cities', null, updated);
                                }} 
                                className="p-2 rounded border text-sm dir-ltr bg-white"
                              >
                                {VALID_TIMEZONES.map(tz => (
                                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                                ))}
                              </select>
                              <input 
                                value={city.image} 
                                onChange={e => {
                                  const updated = [...localSettings.weather_cities];
                                  updated[index].image = e.target.value;
                                  handleSettingChange('weather_cities', null, updated);
                                }} 
                                className="p-2 rounded border text-sm dir-ltr" placeholder="لینک عکس"
                              />
                           </div>
                          ) : (
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
                                {city.image ? <img src={city.image} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-gray-300"><Image size={20}/></div>}
                               </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-sm">
                                  {city.faName} 
                                  <span className="text-xs text-gray-500 mr-1">({city.countryName || city.name})</span>
                                </h4>
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5 dir-ltr">{city.timezone}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                           {editingCityId === city.id ? (
                            <button onClick={() => setEditingCityId(null)} className="p-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition" title="ذخیره">
                              <Check size={16}/>
                            </button>
                          ) : (
                            <>
                              <button onClick={() => handleDuplicateCity(city)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="کپی">
                                <Copy size={16}/>
                              </button>
                              <button onClick={() => setEditingCityId(city.id)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition" title="ویرایش">
                                <Edit size={16}/>
                              </button>
                              <button onClick={() => handleDeleteCity(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="حذف">
                                <Trash size={16}/>
                              </button>
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
                  <h3 className="font-bold border-b pb-2">ویرایش خدمات</h3>
                  <div className="space-y-4">
                    {localSettings.services?.map((srv, index) => (
                      <div key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg border">
                        <div className="w-10 pt-2 font-bold text-gray-400">#{index+1}</div>
                        <div className="flex-1 space-y-2">
                          <input value={srv.title} onChange={e => handleServiceChange(index, 'title', e.target.value)} className="w-full p-2 border rounded bg-white font-bold" placeholder="عنوان"/>
                          <input value={srv.desc} onChange={e => handleServiceChange(index, 'desc', e.target.value)} className="w-full p-2 border rounded bg-white text-sm" placeholder="توضیحات"/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settingsTab === 'footer' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2">تماس</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['phone', 'email', 'address', 'copyright'].map(k => (
                        <div key={k} className={k === 'address' || k === 'copyright' ? 'col-span-2' : ''}><label className="block text-xs font-bold text-gray-500 mb-1">{k}</label><input value={localSettings.contact?.[k] || ''} onChange={e => handleSettingChange('contact', k, e.target.value)} className="w-full p-2 border rounded-lg" dir="ltr"/></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h3 className="font-bold border-b pb-2">درباره ما</h3>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">تیتر</label><input value={localSettings.about?.title || ''} onChange={e => handleSettingChange('about', 'title', e.target.value)} className="w-full p-2 border rounded-lg"/></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">متن</label><textarea value={localSettings.about?.desc || ''} onChange={e => handleSettingChange('about', 'desc', e.target.value)} className="w-full p-2 border rounded-lg h-24"/></div>
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

          {/* --- تب مدیریت رزروها (کد جدید) --- */}
          {activeTab === 'bookings' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                      <tr>
                        <th className="p-4 font-bold">زمان ثبت</th>
                        <th className="p-4 font-bold">مشتری</th>
                        <th className="p-4 font-bold">پرواز</th>
                        <th className="p-4 font-bold">جزئیات پرداخت</th>
                        <th className="p-4 font-bold">وضعیت</th>
                        <th className="p-4 font-bold text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {bookings && bookings.length > 0 ? bookings.map(b => (
                         <tr key={b.id} className="hover:bg-gray-50 transition">
                            {/* زمان */}
                            <td className="p-4 text-gray-500 text-xs">
                               <div dir="ltr" className="font-bold">{new Date(b.created_at).toLocaleDateString('fa-IR')}</div>
                               <div dir="ltr" className="opacity-70 mt-1">{new Date(b.created_at).toLocaleTimeString('fa-IR')}</div>
                            </td>
                            {/* مشتری */}
                            <td className="p-4">
                               <div className="font-bold text-gray-800 flex items-center gap-1"><User size={14}/> {b.customer_name}</div>
                               <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={14}/> {b.customer_phone}</div>
                            </td>
                            {/* پرواز */}
                            <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <span className="text-2xl">{b.flight_info?.logo}</span>
                                  <div>
                                     <div className="font-bold text-xs text-gray-800">{b.flight_info?.airline}</div>
                                     <div className="text-[10px] text-gray-500 dir-ltr mt-0.5">{b.flight_info?.origin} → {b.flight_info?.dest}</div>
                                  </div>
                               </div>
                            </td>
                            {/* جزئیات پرداخت */}
                            <td className="p-4">
                               <div className="flex flex-col gap-1">
                                   <div className="font-black text-blue-600">{(b.amount || 0).toLocaleString()} <span className="text-[9px] text-gray-400">افغانی</span></div>
                                   {b.payment_method && <div className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 flex items-center gap-1 w-fit"><CreditCard size={10}/> {b.payment_method}</div>}
                                   {b.transaction_id && <div className="text-[10px] font-mono text-gray-500 select-all bg-yellow-50 px-2 rounded border border-yellow-100 w-fit">ID: {b.transaction_id}</div>}
                               </div>
                            </td>
                            {/* وضعیت */}
                            <td className="p-4">
                               {getStatusBadge(b.status)}
                            </td>
                            {/* عملیات */}
                            <td className="p-4">
                               <div className="flex justify-center gap-2">
                                  {b.status === 'pending_verification' && (
                                    <button onClick={() => handleChangeStatus(b.id, 'confirmed')} title="تایید پرداخت" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 border border-green-200 transition">
                                        <Check size={16}/>
                                    </button>
                                  )}
                                  
                                  {b.status !== 'cancelled' && (
                                     <button onClick={() => handleChangeStatus(b.id, 'cancelled')} title="لغو/رد کردن" className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100 transition">
                                        <X size={16}/>
                                     </button>
                                  )}
                                  
                                  <button onClick={() => handleDeleteBooking(b.id)} title="حذف کامل" className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition">
                                    <Trash size={16}/>
                                  </button>
                               </div>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                            <td colSpan="6" className="p-10 text-center text-gray-400">
                               <div className="flex flex-col items-center gap-2">
                                  <Ticket size={40} className="opacity-20"/>
                                  <span>هیچ درخواست رزروی یافت نشد.</span>
                               </div>
                            </td>
                         </tr>
                       )}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

          {activeTab === 'news' && (
             <div className="space-y-6">
                <form onSubmit={handleSubmitNews} className="p-4 border rounded-xl bg-gray-50 space-y-3">
                   <input placeholder="تیتر" value={newNews.title} onChange={e=>setNewNews({...newNews, title: e.target.value})} className="w-full p-2 rounded border"/>
                   <input placeholder="لینک عکس" value={newNews.img} onChange={e=>setNewNews({...newNews, img: e.target.value})} className="w-full p-2 rounded border"/>
                   <textarea placeholder="متن" value={newNews.desc} onChange={e=>setNewNews({...newNews, desc: e.target.value})} className="w-full p-2 rounded border"/>
                   <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">{editingId ? 'ذخیره' : 'انتشار'}</button>
                </form>
                <div className="grid gap-3">
                  {news.map(n => (
                    <div key={n.id} className="flex gap-4 p-3 border rounded-xl items-center">
                       <img src={n.image_url} className="w-16 h-16 rounded object-cover"/>
                       <div className="flex-1">
                         <h3 className="font-bold">{n.title}</h3>
                         {n.pinned && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 rounded">پین شده</span>}
                       </div>
                       <div className="flex gap-2">
                         <button onClick={()=>handleTogglePin(n.id, n.pinned)}><Pin size={18}/></button>
                         <button onClick={()=>handleEditNews(n)}><Edit size={18}/></button>
                         <button onClick={()=>handleDuplicateNews(n)}><Copy size={18}/></button>
                         <button onClick={()=>handleDeleteNews(n.id)} className="text-red-500"><Trash size={18}/></button>
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