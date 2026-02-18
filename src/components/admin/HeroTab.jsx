import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function HeroTab({ settings, onUpdate, fetchTranslation }) {
  const [loadingField, setLoadingField] = useState(null);

  const handleSmartTranslate = async (text, lang, key) => {
      if(!text) return alert('لطفا متن فارسی را وارد کنید');
      setLoadingField(key);
      const translated = await fetchTranslation(text, lang);
      onUpdate('hero', key, translated);
      setLoadingField(null);
  };

  return (
    // تغییر: max-w-3xl حذف شد و w-full اضافه شد
    <div className="space-y-8 w-full animate-in fade-in">
        <h2 className="text-2xl font-black text-gray-800">تنظیمات هیرو (Hero)</h2>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-6 w-full">
            <h3 className="font-bold text-gray-400 mb-2">متن‌های اصلی (صفحه اول)</h3>
            
            {/* عنوان‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 border-l pl-2">
                    <label className="text-[10px] font-bold text-blue-600 block">تیتر اصلی (دری)</label>
                    <input 
                      value={settings.hero?.title_dr || ''}
                      onChange={e => onUpdate('hero', 'title_dr', e.target.value)}
                      className="input-admin"
                      placeholder="متن فارسی..."
                    />
                </div>
                <div className="space-y-2 border-l pl-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                        <button onClick={() => handleSmartTranslate(settings.hero?.title_dr, 'ps', 'title_ps')} className="text-[9px] bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                            {loadingField === 'title_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه
                        </button>
                    </div>
                    <input 
                      value={settings.hero?.title_ps || ''}
                      onChange={e => onUpdate('hero', 'title_ps', e.target.value)}
                      className="input-admin"
                    />
                </div>
                <div className="space-y-2" dir="ltr">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-orange-600 block">English</label>
                        <button onClick={() => handleSmartTranslate(settings.hero?.title_dr, 'en', 'title_en')} className="text-[9px] bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1">
                            {loadingField === 'title_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Translate
                        </button>
                    </div>
                    <input 
                      value={settings.hero?.title_en || ''}
                      onChange={e => onUpdate('hero', 'title_en', e.target.value)}
                      className="input-admin ltr"
                    />
                </div>
            </div>
            
            {/* زیرنویس‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="space-y-2 border-l pl-2">
                    <label className="text-[10px] font-bold text-blue-600 block">زیرنویس (دری)</label>
                    <input 
                      value={settings.hero?.subtitle_dr || ''}
                      onChange={e => onUpdate('hero', 'subtitle_dr', e.target.value)}
                      className="input-admin"
                    />
                </div>
                <div className="space-y-2 border-l pl-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                        <button onClick={() => handleSmartTranslate(settings.hero?.subtitle_dr, 'ps', 'subtitle_ps')} className="text-[9px] bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                            {loadingField === 'subtitle_ps' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} ترجمه
                        </button>
                    </div>
                    <input 
                      value={settings.hero?.subtitle_ps || ''}
                      onChange={e => onUpdate('hero', 'subtitle_ps', e.target.value)}
                      className="input-admin"
                    />
                </div>
                <div className="space-y-2" dir="ltr">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-orange-600 block">English</label>
                        <button onClick={() => handleSmartTranslate(settings.hero?.subtitle_dr, 'en', 'subtitle_en')} className="text-[9px] bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1">
                            {loadingField === 'subtitle_en' ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} Translate
                        </button>
                    </div>
                    <input 
                      value={settings.hero?.subtitle_en || ''}
                      onChange={e => onUpdate('hero', 'subtitle_en', e.target.value)}
                      className="input-admin ltr"
                    />
                </div>
            </div>
            
             <div className="space-y-3 pt-4 border-t border-gray-50">
                <label className="text-xs font-bold text-gray-400">تصویر پس‌زمینه (تک عکس)</label>
                <input 
                  value={settings.hero?.image || ''}
                  onChange={e => onUpdate('hero', 'image', e.target.value)}
                  placeholder="لینک تصویر (https://...)"
                  className="input-admin ltr"
                  dir="ltr"
                />
            </div>
        </div>
    </div>
  );
}