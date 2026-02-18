import React from 'react';

export default function FooterTab({ settings, onUpdate, fetchTranslation }) {
  
  const handleTranslate = async (text, lang, key) => {
      if(!text) return;
      const t = await fetchTranslation(text, lang);
      onUpdate('contact', key, t);
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in">
        <h2 className="text-2xl font-black text-gray-800">تنظیمات فوتر (Footer)</h2>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-6 w-full">
            
            <div className="space-y-4">
                <h3 className="font-bold text-gray-400">شبکه‌های اجتماعی</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input value={settings.contact?.whatsapp || ''} onChange={e => onUpdate('contact', 'whatsapp', e.target.value)} placeholder="WhatsApp Link" className="input-admin ltr"/>
                    <input value={settings.contact?.instagram || ''} onChange={e => onUpdate('contact', 'instagram', e.target.value)} placeholder="Instagram Link" className="input-admin ltr"/>
                    <input value={settings.contact?.facebook || ''} onChange={e => onUpdate('contact', 'facebook', e.target.value)} placeholder="Facebook Link" className="input-admin ltr"/>
                    <input value={settings.contact?.telegram || ''} onChange={e => onUpdate('contact', 'telegram', e.target.value)} placeholder="Telegram Link" className="input-admin ltr"/>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
                <h3 className="font-bold text-gray-400">متن کپی‌رایت</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-600">دری</label>
                        <input value={settings.contact?.copyright_dr || ''} onChange={e => onUpdate('contact', 'copyright_dr', e.target.value)} className="input-admin"/>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between"><label className="text-xs font-bold text-green-600">پشتو</label><button onClick={()=>handleTranslate(settings.contact?.copyright_dr, 'ps', 'copyright_ps')} className="text-[9px] bg-green-100 px-2 rounded">ترجمه</button></div>
                        <input value={settings.contact?.copyright_ps || ''} onChange={e => onUpdate('contact', 'copyright_ps', e.target.value)} className="input-admin"/>
                    </div>
                    <div className="space-y-2" dir="ltr">
                        <div className="flex justify-between"><label className="text-xs font-bold text-orange-600">English</label><button onClick={()=>handleTranslate(settings.contact?.copyright_dr, 'en', 'copyright_en')} className="text-[9px] bg-orange-100 px-2 rounded">Translate</button></div>
                        <input value={settings.contact?.copyright_en || ''} onChange={e => onUpdate('contact', 'copyright_en', e.target.value)} className="input-admin"/>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}