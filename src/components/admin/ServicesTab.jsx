import React, { useState } from 'react';
import { Sparkles, Loader2, Plane, FileText, GraduationCap, Package, Hotel, ShieldCheck, Clock, CheckCircle, Globe, MapPin, Search, Briefcase, DollarSign, Umbrella, Bus } from 'lucide-react';

// لیست تمام آیکون‌های قابل انتخاب
const ICON_MAP = {
  'Plane': Plane,
  'FileText': FileText,
  'GraduationCap': GraduationCap,
  'Package': Package,
  'Hotel': Hotel,
  'ShieldCheck': ShieldCheck,
  'Clock': Clock,
  'CheckCircle': CheckCircle,
  'Globe': Globe,
  'MapPin': MapPin,
  'Search': Search,
  'Briefcase': Briefcase,
  'DollarSign': DollarSign,
  'Umbrella': Umbrella,
  'Bus': Bus,
  'Sparkles': Sparkles
};

export default function ServicesTab({ services, onServiceUpdate, fetchTranslation }) {
  const [loadingField, setLoadingField] = useState(null);
  // استیت برای باز کردن پنل انتخاب آیکون برای یک سرویس خاص
  const [openIconSelector, setOpenIconSelector] = useState(null);

  const handleTranslate = async (index, sourceText, lang, field) => {
      if(!sourceText) return;
      setLoadingField(`${index}_${field}`);
      const text = await fetchTranslation(sourceText, lang);
      onServiceUpdate(index, field, text);
      setLoadingField(null);
  };

  const handleIconSelect = (idx, iconName) => {
      onServiceUpdate(idx, 'icon', iconName);
      setOpenIconSelector(null); // بستن پنل بعد از انتخاب
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in">
        <h2 className="text-2xl font-black text-gray-800">ویرایش خدمات</h2>
        
        <div className="grid gap-6 w-full">
           {services?.map((service, idx) => {
              // پیدا کردن آیکون فعلی (اگر نبود Sparkles نشان بده)
              const CurrentIcon = ICON_MAP[service.icon] || Sparkles;
              const isSelectorOpen = openIconSelector === idx;

              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-50 space-y-4 shadow-sm hover:shadow-md transition-shadow w-full">
                   
                   {/* هدر باکس سرویس */}
                   <div className="flex flex-col gap-4 mb-4 border-b pb-4">
                       <div className="flex items-center gap-4">
                           {/* دکمه آیکون فعلی */}
                           <div className="flex flex-col items-center gap-2">
                               <button 
                                 onClick={() => setOpenIconSelector(isSelectorOpen ? null : idx)}
                                 className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform ring-4 ring-white" 
                                 style={{backgroundColor: service.color}}
                                 title="برای تغییر آیکون کلیک کنید"
                               >
                                 <CurrentIcon size={28} />
                               </button>
                               <span className="text-[10px] text-gray-400 font-bold">تغییر آیکون</span>
                           </div>
                           
                           <div className="flex-1">
                               <h3 className="font-bold text-gray-700 text-lg">سرویس شماره {idx+1}</h3>
                               <div className="flex items-center gap-2 mt-2">
                                   <label className="text-xs text-gray-400">رنگ برند:</label>
                                   <input 
                                     type="color" 
                                     value={service.color} 
                                     onChange={(e) => onServiceUpdate(idx, 'color', e.target.value)}
                                     className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                   />
                               </div>
                           </div>
                       </div>

                       {/* پنل انتخاب آیکون (بازشونده) */}
                       {isSelectorOpen && (
                           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2">
                               <p className="text-xs font-bold text-gray-500 mb-3 block">یک آیکون انتخاب کنید:</p>
                               <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                                   {Object.keys(ICON_MAP).map(iconName => {
                                       const IconComp = ICON_MAP[iconName];
                                       return (
                                           <button 
                                             key={iconName}
                                             onClick={() => handleIconSelect(idx, iconName)}
                                             className={`p-3 rounded-xl flex items-center justify-center transition-all ${service.icon === iconName ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white text-gray-500 hover:bg-gray-200'}`}
                                             title={iconName}
                                           >
                                               <IconComp size={20} />
                                           </button>
                                       )
                                   })}
                               </div>
                           </div>
                       )}
                   </div>
                   
                   {/* فیلدهای متنی (سه زبانه) */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* دری */}
                      <div className="space-y-2 border-l pl-2">
                         <label className="text-[10px] font-bold text-blue-600 block">دری</label>
                         <input 
                           value={service.title}
                           onChange={e => onServiceUpdate(idx, 'title', e.target.value)}
                           className="input-admin" placeholder="عنوان"
                         />
                         <textarea 
                           value={service.desc}
                           onChange={e => onServiceUpdate(idx, 'desc', e.target.value)}
                           className="input-admin h-24" placeholder="توضیحات"
                         />
                      </div>

                      {/* پشتو */}
                      <div className="space-y-2 border-l pl-2">
                         <div className="flex justify-between">
                             <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                             <button onClick={() => { handleTranslate(idx, service.title, 'ps', 'title_ps'); handleTranslate(idx, service.desc, 'ps', 'desc_ps'); }} className="text-[9px] bg-green-100 px-2 rounded flex items-center gap-1">
                                  {loadingField?.startsWith(`${idx}_`) && loadingField.includes('ps') ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}
                             </button>
                         </div>
                         <input 
                           value={service.title_ps || ''}
                           onChange={e => onServiceUpdate(idx, 'title_ps', e.target.value)}
                           className="input-admin" placeholder="عنوان"
                         />
                         <textarea 
                           value={service.desc_ps || ''}
                           onChange={e => onServiceUpdate(idx, 'desc_ps', e.target.value)}
                           className="input-admin h-24" placeholder="توضیحات"
                         />
                      </div>

                      {/* انگلیسی */}
                      <div className="space-y-2" dir="ltr">
                         <div className="flex justify-between">
                             <label className="text-[10px] font-bold text-orange-600 block">English</label>
                             <button onClick={() => { handleTranslate(idx, service.title, 'en', 'title_en'); handleTranslate(idx, service.desc, 'en', 'desc_en'); }} className="text-[9px] bg-orange-100 px-2 rounded flex items-center gap-1">
                                  {loadingField?.startsWith(`${idx}_`) && loadingField.includes('en') ? <Loader2 size={10} className="animate-spin"/> : 'Translate'}
                             </button>
                         </div>
                         <input 
                           value={service.title_en || ''}
                           onChange={e => onServiceUpdate(idx, 'title_en', e.target.value)}
                           className="input-admin" placeholder="Title"
                         />
                         <textarea 
                           value={service.desc_en || ''}
                           onChange={e => onServiceUpdate(idx, 'desc_en', e.target.value)}
                           className="input-admin h-24" placeholder="Description"
                         />
                      </div>
                   </div>
                </div>
              );
           })}
        </div>
    </div>
  );
}