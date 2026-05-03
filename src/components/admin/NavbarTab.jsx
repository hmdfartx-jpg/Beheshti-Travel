import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Globe, AlertTriangle, Layers, GripVertical, Check, X, Edit3, ChevronDown, Sparkles, Loader2, Save } from 'lucide-react';

export default function NavbarTab({ settings, onBatchUpdate, fetchTranslation }) {
  const [editingMenuIndex, setEditingMenuIndex] = useState(null);
  const [transLoading, setTransLoading] = useState(null);
  const [dragEnabledIdx, setDragEnabledIdx] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const dragItem = useRef();
  const dragOverItem = useRef();

  const [localMenus, setLocalMenus] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [logoText, setLogoText] = useState('');
  const [logoDr, setLogoDr] = useState('');
  const [logoEn, setLogoEn] = useState('');

  useEffect(() => {
    setLocalMenus(settings?.navbar?.menus || []);
    setBrandName(settings?.general?.brandName || '');
    setLogoText(settings?.general?.logoText || '');
    setLogoDr(settings?.navbar?.logo_dr || '');
    setLogoEn(settings?.navbar?.logo_en || '');
  }, [settings]);

  // رفع مشکل چرخش بی‌نهایت: استفاده از سیستم ذخیره‌سازی دسته‌ای (Batch Update)
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
        const updates = [
            { section: 'navbar', field: null, value: { menus: localMenus, logo_dr: logoDr, logo_en: logoEn } },
            { section: 'general', field: 'brandName', value: brandName },
            { section: 'general', field: 'logoText', value: logoText }
        ];
        await onBatchUpdate(updates);
        alert('تنظیمات ناوبار و منوها با موفقیت ذخیره شد.');
    } catch (error) {
        console.error("Error saving navbar:", error);
        alert('خطا در ذخیره‌سازی! لطفاً اتصال اینترنت را بررسی کنید.');
    } finally {
        setIsSaving(false);
    }
  };

  // --- سیستم ترجمه هوشمند مستقیماً از هسته مدیریت ---
  const handleSmartTranslateMenu = async (idx, sourceText, lang, field) => {
      if(!sourceText) return alert('لطفاً ابتدا نام منو را به زبان دری بنویسید.');
      setTransLoading(`menu_${idx}_${lang}`);
      const t = await fetchTranslation(sourceText, lang);
      if (t) {
          const newMenus = [...localMenus];
          newMenus[idx][field] = t;
          setLocalMenus(newMenus);
      }
      setTransLoading(null);
  };

  const handleSmartTranslateSub = async (mIdx, sIdx, sourceText, lang, field) => {
      if(!sourceText) return alert('لطفاً ابتدا نام زیرمنو را بنویسید.');
      setTransLoading(`sub_${mIdx}_${sIdx}_${lang}`);
      const t = await fetchTranslation(sourceText, lang);
      if (t) {
          const newMenus = [...localMenus];
          newMenus[mIdx].submenus[sIdx][field] = t;
          setLocalMenus(newMenus);
      }
      setTransLoading(null);
  };

  // --- سیستم درگ اند دراپ ---
  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _menus = [...localMenus];
    const item = _menus[dragItem.current];
    _menus.splice(dragItem.current, 1);
    _menus.splice(dragOverItem.current, 0, item);
    dragItem.current = null;
    dragOverItem.current = null;
    setLocalMenus(_menus);
    setDragEnabledIdx(null);
  };

  const addMenu = () => {
    const newMenu = {
      id: Date.now(), title_dr: 'منوی جدید', title_ps: '', title_en: '',
      url: '/', isExternal: false, isComingSoon: false, submenus: []
    };
    const updatedMenus = [...localMenus, newMenu];
    setLocalMenus(updatedMenus);
    setEditingMenuIndex(updatedMenus.length - 1);
  };

  const updateMenuField = (index, field, value) => {
    const newMenus = [...localMenus];
    newMenus[index][field] = value;
    setLocalMenus(newMenus);
  };

  const deleteMenu = (index) => {
    if (window.confirm('آیا از حذف کامل این منو مطمئن هستید؟')) {
      const newMenus = localMenus.filter((_, i) => i !== index);
      setLocalMenus(newMenus);
      setEditingMenuIndex(null);
    }
  };

  const addSubmenu = (menuIndex) => {
    const newMenus = [...localMenus];
    if(!newMenus[menuIndex].submenus) newMenus[menuIndex].submenus = [];
    newMenus[menuIndex].submenus.push({
        id: Date.now() + Math.random(), title_dr: 'زیرمنوی جدید', title_ps: '', title_en: '',
        url: '/', isExternal: false, isComingSoon: false
    });
    setLocalMenus(newMenus);
  };

  const updateSubmenuField = (mIdx, sIdx, field, value) => {
    const newMenus = [...localMenus];
    newMenus[mIdx].submenus[sIdx][field] = value;
    setLocalMenus(newMenus);
  };

  const deleteSubmenu = (mIdx, sIdx) => {
    const newMenus = [...localMenus];
    newMenus[mIdx].submenus.splice(sIdx, 1);
    setLocalMenus(newMenus);
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24" dir="rtl">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-800">تنظیمات ناوبار و مدیریت منوها</h2>
            <button onClick={addMenu} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-200 transition active:scale-95 border border-gray-200">
                <Plus size={20}/> افزودن منوی داینامیک
            </button>
        </div>
        
        {/* برند و لوگو */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-400 text-xs tracking-widest uppercase mb-4">تنظیمات برند و تصویر لوگو</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 border-l border-gray-100 pl-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-500 block mb-1">نام برند (فارسی)</label>
                        <input value={brandName} onChange={e => setBrandName(e.target.value)} className="input-admin" placeholder="مثلاً: بهشتی تراول"/>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-500 block mb-1">متن لوگو (در صورت نداشتن عکس)</label>
                        <input value={logoText} onChange={e => setLogoText(e.target.value)} className="input-admin font-black" placeholder="B"/>
                    </div>
                </div>
                <div className="space-y-4 pr-2">
                    <div>
                        <label className="text-[10px] font-black text-blue-600 block mb-1">لینک لوگو (نسخه دری و پشتو)</label>
                        <input value={logoDr} onChange={e => setLogoDr(e.target.value)} className="input-admin ltr" placeholder="https://..."/>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-orange-600 block mb-1">لینک لوگو (نسخه انگلیسی)</label>
                        <input value={logoEn} onChange={e => setLogoEn(e.target.value)} className="input-admin ltr" placeholder="https://..."/>
                    </div>
                </div>
            </div>
        </div>

        {/* لیست منوها */}
        <div className="space-y-4 pb-20">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <p className="text-blue-800 font-bold text-sm flex items-center gap-2">
                 <AlertTriangle size={18}/>
                 منوهای «صفحه اصلی» و «درباره شرکت» ثابت هستند. سایر منوهایی که اینجا می‌سازید در میان آن‌ها قرار می‌گیرند.
               </p>
            </div>

            {localMenus.length === 0 && (
                <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Layers size={40}/>
                    </div>
                    <p className="text-gray-400 font-bold">هیچ منوی داینامیکی اضافه نشده است.</p>
                </div>
            )}

            {localMenus.map((menu, idx) => (
                <div 
                  key={menu.id} 
                  className={`bg-white rounded-[2rem] border transition-all ${editingMenuIndex === idx ? 'border-[#058B8C] shadow-2xl ring-4 ring-[#058B8C]/5' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
                  draggable={dragEnabledIdx === idx}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* دستگیره درگ اند دراپ - فقط روی این قسمت کار می‌کند */}
                            <div 
                                className={`p-3 rounded-2xl cursor-grab transition ${dragEnabledIdx === idx ? 'bg-[#058B8C] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-200'}`}
                                onMouseEnter={() => setDragEnabledIdx(idx)}
                                onMouseLeave={() => setDragEnabledIdx(null)}
                            >
                                <GripVertical size={20}/>
                            </div>
                            
                            <div>
                                <span className="font-black text-gray-800 text-lg">{menu.title_dr}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                                        <LinkIcon size={10}/> {menu.url}
                                    </span>
                                    {menu.isComingSoon && <span className="text-[9px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-black flex items-center gap-1"><AlertTriangle size={10}/> بزودی</span>}
                                    {menu.isExternal && <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-black flex items-center gap-1"><Globe size={10}/> خارجی</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setEditingMenuIndex(editingMenuIndex === idx ? null : idx)} className={`p-3 rounded-2xl transition ${editingMenuIndex === idx ? 'bg-[#058B8C] text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                                {editingMenuIndex === idx ? <ChevronDown size={20}/> : <Edit3 size={20}/>}
                            </button>
                            <button onClick={() => deleteMenu(idx)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition"><Trash2 size={20}/></button>
                        </div>
                    </div>

                    {editingMenuIndex === idx && (
                        <div className="p-8 border-t border-gray-50 space-y-8 animate-in slide-in-from-top-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-blue-600 block mr-1">نام منو (دری)</label>
                                    <input value={menu.title_dr} onChange={e => updateMenuField(idx, 'title_dr', e.target.value)} className="input-admin" placeholder="مثلاً: پروازها"/>
                                </div>
                                <div className="space-y-2 border-l border-gray-100 pl-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-green-600">پشتو</label>
                                        <button onClick={() => handleSmartTranslateMenu(idx, menu.title_dr, 'ps', 'title_ps')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-green-200 transition">
                                            {transLoading === `menu_${idx}_ps` ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} ترجمه خودکار
                                        </button>
                                    </div>
                                    <input value={menu.title_ps} onChange={e => updateMenuField(idx, 'title_ps', e.target.value)} className="input-admin text-right" placeholder="مثلاً: الوتنې"/>
                                </div>
                                <div className="space-y-2" dir="ltr">
                                    <div className="flex justify-between items-center px-1" dir="rtl">
                                        <label className="text-[10px] font-black text-orange-600">English</label>
                                        <button onClick={() => handleSmartTranslateMenu(idx, menu.title_dr, 'en', 'title_en')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition">
                                            {transLoading === `menu_${idx}_en` ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} Auto Translate
                                        </button>
                                    </div>
                                    <input value={menu.title_en} onChange={e => updateMenuField(idx, 'title_en', e.target.value)} className="input-admin ltr" placeholder="Flights"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-700 flex items-center gap-1"><LinkIcon size={14}/> مسیر یا آدرس سایت (URL)</label>
                                    <input value={menu.url} onChange={e => updateMenuField(idx, 'url', e.target.value)} className="input-admin ltr text-blue-600 font-mono" placeholder="https://flights.beheshtitravel.com"/>
                                    <p className="text-[10px] text-gray-400">اگر سایت داخلی است از `/` استفاده کنید. برای ساب‌دامین آدرس کامل را بنویسید.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pt-4">
                                    <label className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition ${menu.isExternal ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                        <input type="checkbox" checked={menu.isExternal} onChange={e => updateMenuField(idx, 'isExternal', e.target.checked)} className="w-5 h-5 accent-blue-600"/>
                                        <div>
                                            <span className="text-sm font-black text-gray-800 block">سایت خارجی / ساب‌دامین</span>
                                            <span className="text-[10px] text-gray-500">لینک در تب جدید باز می‌شود</span>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition ${menu.isComingSoon ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                        <input type="checkbox" checked={menu.isComingSoon} onChange={e => updateMenuField(idx, 'isComingSoon', e.target.checked)} className="w-5 h-5 accent-orange-600"/>
                                        <div>
                                            <span className="text-sm font-black text-gray-800 block">فعال‌سازی حالت «بزودی»</span>
                                            <span className="text-[10px] text-orange-600/70">نمایش پاپ‌آپ در حال تعمیر به جای باز شدن لینک</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* زیرمنوها */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-black text-gray-700 flex items-center gap-2"><Layers size={20} className="text-[#058B8C]"/> مدیریت زیرمجموعه‌ها</h4>
                                    <button onClick={() => addSubmenu(idx)} className="text-xs bg-[#058B8C]/10 text-[#058B8C] px-4 py-2 rounded-xl font-black hover:bg-[#058B8C]/20 transition border border-[#058B8C]/20">
                                        + افزودن زیرمنو جدید
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 mr-4 pr-6 border-r-2 border-gray-100">
                                    {menu.submenus?.map((sub, sIdx) => (
                                        <div key={sub.id} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 relative group hover:bg-white transition-colors">
                                            <button onClick={() => deleteSubmenu(idx, sIdx)} className="absolute top-4 left-4 text-red-300 hover:text-red-500 transition"><X size={20}/></button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-blue-500 font-bold ml-1">نام (دری)</label>
                                                    <input value={sub.title_dr} onChange={e => updateSubmenuField(idx, sIdx, 'title_dr', e.target.value)} className="input-admin text-xs bg-white" placeholder="نام دری"/>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between px-1">
                                                        <label className="text-[9px] text-green-500 font-bold">نام (پشتو)</label>
                                                        <button onClick={() => handleSmartTranslateSub(idx, sIdx, sub.title_dr, 'ps', 'title_ps')} className="text-[8px] bg-green-100 text-green-700 px-1.5 py-1 rounded flex items-center gap-1 hover:bg-green-200 transition">
                                                            {transLoading === `sub_${idx}_${sIdx}_ps` ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}
                                                        </button>
                                                    </div>
                                                    <input value={sub.title_ps} onChange={e => updateSubmenuField(idx, sIdx, 'title_ps', e.target.value)} className="input-admin text-xs bg-white text-right" placeholder="نام پشتو"/>
                                                </div>
                                                <div className="space-y-1" dir="ltr">
                                                    <div className="flex justify-between px-1" dir="rtl">
                                                        <label className="text-[9px] text-orange-500 font-bold">Name (EN)</label>
                                                        <button onClick={() => handleSmartTranslateSub(idx, sIdx, sub.title_dr, 'en', 'title_en')} className="text-[8px] bg-orange-100 text-orange-700 px-1.5 py-1 rounded flex items-center gap-1 hover:bg-orange-200 transition">
                                                            {transLoading === `sub_${idx}_${sIdx}_en` ? <Loader2 size={10} className="animate-spin"/> : 'Trans'}
                                                        </button>
                                                    </div>
                                                    <input value={sub.title_en} onChange={e => updateSubmenuField(idx, sIdx, 'title_en', e.target.value)} className="input-admin text-xs bg-white ltr" placeholder="English Name"/>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4">
                                                <input value={sub.url} onChange={e => updateSubmenuField(idx, sIdx, 'url', e.target.value)} className="input-admin text-xs ltr bg-white flex-1" placeholder="لینک (URL)"/>
                                                <div className="flex gap-2 shrink-0">
                                                    <label className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border text-[9px] font-bold cursor-pointer hover:bg-gray-50"><input type="checkbox" checked={sub.isExternal} onChange={e => updateSubmenuField(idx, sIdx, 'isExternal', e.target.checked)} className="accent-blue-500"/> خارجی</label>
                                                    <label className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border text-[9px] font-bold cursor-pointer text-orange-600 hover:bg-gray-50"><input type="checkbox" checked={sub.isComingSoon} onChange={e => updateSubmenuField(idx, sIdx, 'isComingSoon', e.target.checked)} className="accent-orange-500"/> بزودی</label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!menu.submenus || menu.submenus.length === 0) && <p className="text-center text-gray-300 text-xs font-bold py-4">این منو زیرمجموعه‌ای ندارد.</p>}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* نوار چسبان پایین برای ذخیره تنظیمات */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-72 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40 flex justify-end items-center px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <button 
                onClick={handleSaveAll} 
                disabled={isSaving} 
                className="w-full md:w-auto bg-[#058B8C] text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 hover:bg-[#047070] transition active:scale-95 disabled:opacity-70"
            >
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات ناوبار'}
            </button>
        </div>
    </div>
  );
}