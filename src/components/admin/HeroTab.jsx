import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Save, Plus, Trash2 } from 'lucide-react';

export default function HeroTab({ settings, onUpdate, fetchTranslation, showAlert }) {
  const [localHero, setLocalHero] = useState({
      title_dr: '', title_ps: '', title_en: '',
      subtitle_dr: '', subtitle_ps: '', subtitle_en: '',
      images: [] 
  });
  
  // State جدید برای آمار سایت
  const [localStats, setLocalStats] = useState({ customers: 0, flights: 0, visas: 0, experience: 0 });
  
  const [loadingField, setLoadingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.hero) {
      setLocalHero({
          ...settings.hero,
          images: settings.hero.images || (settings.hero.image ? [settings.hero.image] : [])
      });
    }
    // خواندن آمار از دیتابیس
    if (settings?.stats) {
      setLocalStats({
          customers: Number(settings.stats.customers) || 0,
          flights: Number(settings.stats.flights) || 0,
          visas: Number(settings.stats.visas) || 0,
          experience: Number(settings.stats.experience) || 0
      });
    }
  }, [settings]);

  const handleSmartTranslate = async (text, lang, key) => {
      if(!text) return showAlert('warning', 'خطا', 'لطفا ابتدا متن فارسی را وارد کنید');
      setLoadingField(key);
      try {
          const translated = await fetchTranslation(text, lang);
          setLocalHero(prev => ({ ...prev, [key]: translated }));
      } catch (e) {
          console.error(e);
      }
      setLoadingField(null);
  };

  const handleChange = (key, value) => {
      setLocalHero(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (index, value) => {
      const newImages = [...localHero.images];
      newImages[index] = value;
      setLocalHero(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
      setLocalHero(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index) => {
      const newImages = localHero.images.filter((_, i) => i !== index);
      setLocalHero(prev => ({ ...prev, images: newImages }));
  };

  const handleSave = async () => {
      setIsSaving(true);
      
      const finalHeroData = { ...localHero };
      delete finalHeroData.image; 

      try {
          // ذخیره هیرو
          await onUpdate('hero', null, finalHeroData);
          // ذخیره آمار
          await onUpdate('stats', null, {
              customers: Number(localStats.customers) || 0,
              flights: Number(localStats.flights) || 0,
              visas: Number(localStats.visas) || 0,
              experience: Number(localStats.experience) || 0
          });
      } catch (e) {
          console.error("Error saving hero:", e);
      } finally {
          setIsSaving(false);
      }
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24" dir="rtl">
        <h2 className="text-2xl font-black text-gray-800">تنظیمات هیرو (Hero)</h2>
        
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 w-full">
            
            {/* بخش متون */}
            <div>
                <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#058B8C] rounded-full inline-block"></span>
                    متن‌های اصلی (صفحه اول)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 border-l border-gray-100 pl-4">
                        <label className="text-[10px] font-black text-blue-600 block">تیتر اصلی (دری)</label>
                        <input 
                          value={localHero.title_dr || ''}
                          onChange={e => handleChange('title_dr', e.target.value)}
                          className="input-admin"
                          placeholder="متن فارسی..."
                        />
                    </div>
                    <div className="space-y-2 border-l border-gray-100 pl-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-green-600 block">پشتو</label>
                            <button onClick={() => handleSmartTranslate(localHero.title_dr, 'ps', 'title_ps')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-green-200 transition">
                                {loadingField === 'title_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه خودکار
                            </button>
                        </div>
                        <input 
                          value={localHero.title_ps || ''}
                          onChange={e => handleChange('title_ps', e.target.value)}
                          className="input-admin text-right"
                        />
                    </div>
                    <div className="space-y-2" dir="ltr">
                        <div className="flex justify-between items-center px-1" dir="rtl">
                            <label className="text-[10px] font-black text-orange-600 block">English</label>
                            <button onClick={() => handleSmartTranslate(localHero.title_dr, 'en', 'title_en')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition">
                                {loadingField === 'title_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Auto Translate
                            </button>
                        </div>
                        <input 
                          value={localHero.title_en || ''}
                          onChange={e => handleChange('title_en', e.target.value)}
                          className="input-admin ltr"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-100">
                    <div className="space-y-2 border-l border-gray-100 pl-4">
                        <label className="text-[10px] font-black text-blue-600 block">زیرنویس (دری)</label>
                        <input 
                          value={localHero.subtitle_dr || ''}
                          onChange={e => handleChange('subtitle_dr', e.target.value)}
                          className="input-admin"
                        />
                    </div>
                    <div className="space-y-2 border-l border-gray-100 pl-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-green-600 block">پشتو</label>
                            <button onClick={() => handleSmartTranslate(localHero.subtitle_dr, 'ps', 'subtitle_ps')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-green-200 transition">
                                {loadingField === 'subtitle_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه خودکار
                            </button>
                        </div>
                        <input 
                          value={localHero.subtitle_ps || ''}
                          onChange={e => handleChange('subtitle_ps', e.target.value)}
                          className="input-admin text-right"
                        />
                    </div>
                    <div className="space-y-2" dir="ltr">
                        <div className="flex justify-between items-center px-1" dir="rtl">
                            <label className="text-[10px] font-black text-orange-600 block">English</label>
                            <button onClick={() => handleSmartTranslate(localHero.subtitle_dr, 'en', 'subtitle_en')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-orange-200 transition">
                                {loadingField === 'subtitle_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Auto Translate
                            </button>
                        </div>
                        <input 
                          value={localHero.subtitle_en || ''}
                          onChange={e => handleChange('subtitle_en', e.target.value)}
                          className="input-admin ltr"
                        />
                    </div>
                </div>
            </div>

            {/* بخش تصاویر اسلایدر */}
            <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#058B8C] rounded-full inline-block"></span>
                            تصاویر اسلایدر (Slider)
                        </h3>
                        <p className="text-[11px] text-gray-500 font-bold mt-1">شما می‌توانید چند لینک تصویر وارد کنید تا در صفحه اول به صورت اسلایدر عوض شوند.</p>
                    </div>
                    <button onClick={addImage} className="bg-teal-50 text-[#058B8C] hover:bg-[#058B8C] hover:text-white px-3 py-2 rounded-xl text-sm font-bold transition flex items-center gap-1">
                        <Plus size={16} /> افزودن تصویر
                    </button>
                </div>

                <div className="space-y-3">
                    {localHero.images?.length > 0 ? (
                        localHero.images.map((imgUrl, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <div className="w-8 text-center text-xs font-black text-gray-400">{index + 1}</div>
                                <input 
                                  value={imgUrl}
                                  onChange={e => handleImageChange(index, e.target.value)}
                                  placeholder="لینک تصویر (https://...)"
                                  className="input-admin ltr text-blue-600 flex-1"
                                  dir="ltr"
                                />
                                <button onClick={() => removeImage(index)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                            <p className="text-gray-400 font-bold text-sm">هیچ تصویری برای اسلایدر ثبت نشده است.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* بخش آمار سایت */}
            <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-6">
                    <span className="w-1.5 h-6 bg-[#058B8C] rounded-full inline-block"></span>
                    آمار سایت (نمایش در صفحه اصلی)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600">مشتریان راضی</label>
                        <input type="number" value={localStats.customers} onChange={e => setLocalStats({...localStats, customers: e.target.value})} className="input-admin ltr" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600">پروازهای موفق</label>
                        <input type="number" value={localStats.flights} onChange={e => setLocalStats({...localStats, flights: e.target.value})} className="input-admin ltr" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600">ویزاهای صادر شده</label>
                        <input type="number" value={localStats.visas} onChange={e => setLocalStats({...localStats, visas: e.target.value})} className="input-admin ltr" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600">سال‌های تجربه</label>
                        <input type="number" value={localStats.experience} onChange={e => setLocalStats({...localStats, experience: e.target.value})} className="input-admin ltr" dir="ltr" />
                    </div>
                </div>
            </div>

        </div>

        {/* نوار چسبان پایین برای ذخیره تنظیمات */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-72 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40 flex justify-between items-center px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <span className="text-gray-500 font-bold text-sm hidden md:block">پس از پایان تغییرات، دکمه ذخیره را بزنید.</span>
            <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full md:w-auto bg-[#058B8C] text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 hover:bg-[#047070] transition active:scale-95 disabled:opacity-70"
            >
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات هیرو'}
            </button>
        </div>
    </div>
  );
}