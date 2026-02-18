import React from 'react';

export default function NavbarTab({ settings, onUpdate }) {
  return (
    <div className="space-y-8 w-full animate-in fade-in">
        <h2 className="text-2xl font-black text-gray-800">تنظیمات ناوبار (Navbar)</h2>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-6 w-full">
            
            <div className="space-y-4">
                <h3 className="font-bold text-gray-400">برند و لوگو متنی</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">نام برند (فارسی)</label>
                        <input 
                          value={settings.general?.brandName || ''}
                          onChange={e => onUpdate('general', 'brandName', e.target.value)}
                          className="input-admin"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">متن لوگو (تک حرف)</label>
                        <input 
                          value={settings.general?.logoText || ''}
                          onChange={e => onUpdate('general', 'logoText', e.target.value)}
                          className="input-admin"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
                <h3 className="font-bold text-gray-400">تصویر لوگو</h3>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 block">لینک لوگو (نسخه فارسی/انگلیسی)</label>
                    <input 
                      value={settings.navbar?.logo_dr || ''}
                      onChange={e => onUpdate('navbar', 'logo_dr', e.target.value)}
                      placeholder="لینک لوگو (پیش‌فرض)"
                      className="input-admin ltr"
                    />
                    <input 
                      value={settings.navbar?.logo_en || ''}
                      onChange={e => onUpdate('navbar', 'logo_en', e.target.value)}
                      placeholder="لینک لوگو (نسخه انگلیسی)"
                      className="input-admin ltr"
                    />
                </div>
            </div>

        </div>
    </div>
  );
}