import React, { useState } from 'react';
import { Plus, Trash, Loader2, MessageCircle, Send, Instagram, Facebook, MapPin, Globe } from 'lucide-react';

// تنظیمات پلتفرم‌ها (پیشوندها و رنگ‌ها)
const SOCIAL_CONFIG = {
  whatsapp: {
    prefix: 'https://wa.me/',
    label: 'واتساپ',
    placeholder: '93700123456 (بدون +)',
    icon: MessageCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'focus-within:border-green-500'
  },
  telegram: {
    prefix: 'https://t.me/',
    label: 'تلگرام',
    placeholder: 'username',
    icon: Send,
    color: 'text-blue-400',
    bgColor: 'bg-blue-50',
    borderColor: 'focus-within:border-blue-400'
  },
  instagram: {
    prefix: 'https://instagram.com/',
    label: 'اینستاگرام',
    placeholder: 'username',
    icon: Instagram,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'focus-within:border-pink-500'
  },
  facebook: {
    prefix: 'https://facebook.com/',
    label: 'فیسبوک',
    placeholder: 'username یا profile.php?id=...',
    icon: Facebook,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'focus-within:border-blue-700'
  }
};

export default function ContactTab({ settings, agencies, onUpdate, onAgencyAdd, onAgencyChange, onAgencyDelete, fetchTranslation }) {
  const [loading, setLoading] = useState(null);

  // --- ترجمه‌ها ---
  const translateAgency = async (index, lang) => {
      const agency = agencies[index];
      if(!agency.city_dr && !agency.address_dr) return;
      setLoading(`agency_${index}_${lang}`);
      
      const tCity = agency.city_dr ? await fetchTranslation(agency.city_dr, lang) : '';
      const tAddress = agency.address_dr ? await fetchTranslation(agency.address_dr, lang) : '';
      
      if(tCity) onAgencyChange(agency.id, `city_${lang}`, tCity);
      if(tAddress) onAgencyChange(agency.id, `address_${lang}`, tAddress);
      
      setLoading(null);
  };

  const translateAddress = async (lang) => {
      const addr = settings.contact?.address_dr;
      if(!addr) return;
      setLoading('contact_'+lang);
      const tAddr = await fetchTranslation(addr, lang);
      onUpdate('contact', `address_${lang}`, tAddr);
      setLoading(null);
  };

  // --- کامپوننت داخلی: ورودی هوشمند شبکه اجتماعی ---
  const SmartSocialInput = ({ platformKey, value, onChange }) => {
      const config = SOCIAL_CONFIG[platformKey];
      const Icon = config.icon;

      // تابع برای استخراج آیدی از لینک کامل (برای نمایش در اینپوت)
      const getDisplayValue = (fullLink) => {
          if (!fullLink) return '';
          if (fullLink.startsWith(config.prefix)) {
              return fullLink.replace(config.prefix, '');
          }
          return fullLink; // اگر فرمت خاصی بود، خودش را نشان بده
      };

      // تابع برای ساختن لینک کامل هنگام تغییر
      const handleChange = (e) => {
          const val = e.target.value;
          // اگر کاربر خودش لینک کامل را پیست کرد، همان را ذخیره کن، در غیر این صورت پیشوند را اضافه کن
          const finalValue = val.startsWith('http') ? val : config.prefix + val;
          onChange(finalValue);
      };

      return (
          <div className="flex items-center gap-3">
              {/* آیکون بیرون فیلد */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor} ${config.color}`}>
                  <Icon size={20}/>
              </div>
              
              <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">{config.label}</label>
                  
                  {/* اینپوت گروپ هوشمند */}
                  <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white transition-all ${config.borderColor} focus-within:ring-1 focus-within:ring-opacity-50`}>
                      {/* بخش پیشوند ثابت (Read-only) */}
                      <div className="bg-gray-50 px-3 py-2 text-[10px] text-gray-400 font-mono border-r border-gray-100 select-none hidden sm:block" dir="ltr">
                          {config.prefix.replace('https://', '')}
                      </div>
                      
                      {/* ورودی اصلی */}
                      <input 
                          value={getDisplayValue(value)}
                          onChange={handleChange}
                          placeholder={config.placeholder}
                          className="w-full px-3 py-2 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300 font-mono"
                          dir="ltr"
                      />
                  </div>
              </div>
          </div>
      );
  };

  const SocialInputsGroup = ({ data, onChange, prefix = '' }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-white border border-gray-100 p-4 rounded-2xl">
          <SmartSocialInput 
              platformKey="whatsapp"
              value={data?.whatsapp}
              onChange={(val) => onChange(prefix ? prefix : 'whatsapp', val)}
          />
          <SmartSocialInput 
              platformKey="telegram"
              value={data?.telegram}
              onChange={(val) => onChange(prefix ? prefix : 'telegram', val)}
          />
          <SmartSocialInput 
              platformKey="instagram"
              value={data?.instagram}
              onChange={(val) => onChange(prefix ? prefix : 'instagram', val)}
          />
          <SmartSocialInput 
              platformKey="facebook"
              value={data?.facebook}
              onChange={(val) => onChange(prefix ? prefix : 'facebook', val)}
          />
      </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in w-full">
        
        {/* تماس اصلی (دفتر مرکزی) */}
        <div className="space-y-6 w-full">
            <h2 className="text-2xl font-black text-gray-800">اطلاعات تماس دفتر مرکزی</h2>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">شماره تماس اصلی (هدر سایت)</label>
                        <input value={settings.contact?.phone || ''} onChange={e => onUpdate('contact', 'phone', e.target.value)} className="input-admin ltr" placeholder="+93..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">ایمیل</label>
                        <input value={settings.contact?.email || ''} onChange={e => onUpdate('contact', 'email', e.target.value)} className="input-admin ltr" placeholder="info@example.com" />
                    </div>
                </div>
                
                {/* آدرس سه زبانه */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-600 block">آدرس (دری)</label>
                        <textarea value={settings.contact?.address_dr || ''} onChange={e => onUpdate('contact', 'address_dr', e.target.value)} className="input-admin h-24" placeholder="آدرس کامل به فارسی دری..." />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between"><label className="text-xs font-bold text-green-600 block">پشتو</label><button onClick={()=>translateAddress('ps')} className="text-[9px] bg-green-100 px-2 rounded">ترجمه</button></div>
                        <textarea value={settings.contact?.address_ps || ''} onChange={e => onUpdate('contact', 'address_ps', e.target.value)} className="input-admin h-24" placeholder="پته..." />
                    </div>
                    <div className="space-y-2" dir="ltr">
                        <div className="flex justify-between"><label className="text-xs font-bold text-orange-600 block">English</label><button onClick={()=>translateAddress('en')} className="text-[9px] bg-orange-100 px-2 rounded">Translate</button></div>
                        <textarea value={settings.contact?.address_en || ''} onChange={e => onUpdate('contact', 'address_en', e.target.value)} className="input-admin h-24" placeholder="Full Address..." />
                    </div>
                </div>

                {/* لوکیشن دفتر مرکزی */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center shrink-0"><MapPin size={20}/></div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-400 mb-1 block">لینک نقشه گوگل (دفتر مرکزی)</label>
                            <input value={settings.contact?.map_link || ''} onChange={e => onUpdate('contact', 'map_link', e.target.value)} className="input-admin ltr" placeholder="http://maps.google.com/..." />
                        </div>
                    </div>
                </div>

                {/* شبکه‌های اجتماعی دفتر مرکزی */}
                <div>
                    <label className="text-sm font-bold text-gray-800 block mb-3 px-1 border-r-4 border-[#058B8C] pr-2">شبکه‌های اجتماعی (دفتر مرکزی)</label>
                    <SocialInputsGroup data={settings.contact} onChange={(k, v) => onUpdate('contact', k, v)} />
                </div>
            </div>
        </div>

        {/* شعبات */}
        <div className="space-y-6 w-full border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-800">مدیریت نمایندگی‌ها (شعب)</h2>
                <button onClick={onAgencyAdd} className="bg-[#058B8C] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#047070]">
                    <Plus size={16} /> افزودن شعبه
                </button>
            </div>
            <div className="grid gap-6">
               {agencies?.map((agency, index) => (
                  <div key={agency.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group hover:border-[#058B8C] transition-colors w-full">
                      <div className="absolute top-4 left-4 flex gap-2">
                          <button onClick={() => onAgencyDelete(agency.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg"><Trash size={18}/></button>
                      </div>
                      
                      <div className="mb-4 pr-12">
                          <h3 className="font-bold text-gray-700 text-lg">شعبه شماره {index + 1}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {/* دری */}
                          <div className="space-y-2 border-l pl-2">
                             <label className="text-[10px] font-bold text-blue-600">دری</label>
                             <input value={agency.city_dr || ''} onChange={e => onAgencyChange(agency.id, 'city_dr', e.target.value)} placeholder="شهر" className="input-admin" />
                             <textarea value={agency.address_dr || ''} onChange={e => onAgencyChange(agency.id, 'address_dr', e.target.value)} placeholder="آدرس دقیق" className="input-admin h-20" rows={2}/>
                          </div>
                          {/* پشتو */}
                          <div className="space-y-2 border-l pl-2">
                             <div className="flex justify-between"><label className="text-[10px] font-bold text-green-600">پشتو</label><button onClick={()=>translateAgency(index, 'ps')} className="text-[9px] bg-green-100 px-2 rounded">{loading?.includes(`agency_${index}_ps`) ? '...' : 'ترجمه'}</button></div>
                             <input value={agency.city_ps || ''} onChange={e => onAgencyChange(agency.id, 'city_ps', e.target.value)} placeholder="ښار" className="input-admin" />
                             <textarea value={agency.address_ps || ''} onChange={e => onAgencyChange(agency.id, 'address_ps', e.target.value)} placeholder="پته" className="input-admin h-20" rows={2}/>
                          </div>
                          {/* انگلیسی */}
                          <div className="space-y-2" dir="ltr">
                             <div className="flex justify-between"><label className="text-[10px] font-bold text-orange-600">English</label><button onClick={()=>translateAgency(index, 'en')} className="text-[9px] bg-orange-100 px-2 rounded">{loading?.includes(`agency_${index}_en`) ? '...' : 'Translate'}</button></div>
                             <input value={agency.city_en || ''} onChange={e => onAgencyChange(agency.id, 'city_en', e.target.value)} placeholder="City" className="input-admin" />
                             <textarea value={agency.address_en || ''} onChange={e => onAgencyChange(agency.id, 'address_en', e.target.value)} placeholder="Address" className="input-admin h-20" rows={2}/>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                         <div>
                             <label className="text-[10px] font-bold text-gray-400 block mb-1">تلفن شعبه</label>
                             <input value={agency.phone} onChange={e => onAgencyChange(agency.id, 'phone', e.target.value)} className="input-admin ltr" placeholder="+93..." />
                         </div>
                         <div>
                             <label className="text-[10px] font-bold text-gray-400 block mb-1">لینک نقشه گوگل (شعبه)</label>
                             <div className="relative">
                                 <MapPin size={14} className="absolute top-3 left-3 text-gray-400"/>
                                 <input value={agency.map} onChange={e => onAgencyChange(agency.id, 'map', e.target.value)} className="input-admin ltr pl-8" placeholder="https://maps..." />
                             </div>
                         </div>
                      </div>

                      {/* سوشال شعبه */}
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                          <label className="text-xs font-bold text-gray-500 block mb-3">شبکه‌های اجتماعی شعبه</label>
                          <SocialInputsGroup data={agency} onChange={(k, v) => onAgencyChange(agency.id, k, v)} prefix="" />
                      </div>
                  </div>
               ))}
            </div>
        </div>
    </div>
  );
}