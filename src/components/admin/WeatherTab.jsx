import React, { useState, useEffect } from 'react';
import { GripVertical, Image, Edit, Trash, Copy, Plus, Check, X, Save, Loader2 } from 'lucide-react';

const VALID_TIMEZONES = [
  { label: "کابل (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "هرات (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "مزار شریف (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "قندهار (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "جلال‌آباد (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "بامیان (Asia/Kabul)", value: "Asia/Kabul" },

  { label: "تهران (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "مشهد (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "قم (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "اصفهان (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "شیراز (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "تبریز (Asia/Tehran)", value: "Asia/Tehran" },

  { label: "مکه (Asia/Riyadh)", value: "Asia/Riyadh" },
  { label: "مدینه (Asia/Riyadh)", value: "Asia/Riyadh" },
  { label: "ریاض (Asia/Riyadh)", value: "Asia/Riyadh" },
  { label: "جده (Asia/Riyadh)", value: "Asia/Riyadh" },

  { label: "نجف (Asia/Baghdad)", value: "Asia/Baghdad" },
  { label: "کربلا (Asia/Baghdad)", value: "Asia/Baghdad" },
  { label: "بغداد (Asia/Baghdad)", value: "Asia/Baghdad" },

  { label: "دمشق (Asia/Damascus)", value: "Asia/Damascus" },
  { label: "حلب (Asia/Damascus)", value: "Asia/Damascus" },

  { label: "استانبول (Europe/Istanbul)", value: "Europe/Istanbul" },
  { label: "آنکارا (Europe/Istanbul)", value: "Europe/Istanbul" },
  { label: "آنتالیا (Europe/Istanbul)", value: "Europe/Istanbul" },

  { label: "دبی (Asia/Dubai)", value: "Asia/Dubai" },
  { label: "ابوظبی (Asia/Dubai)", value: "Asia/Dubai" },
  { label: "شارجه (Asia/Dubai)", value: "Asia/Dubai" },

  { label: "دوحه (Asia/Qatar)", value: "Asia/Qatar" },
  { label: "کویت (Asia/Kuwait)", value: "Asia/Kuwait" },
  { label: "منامه (Asia/Bahrain)", value: "Asia/Bahrain" },
  { label: "مسقط (Asia/Muscat)", value: "Asia/Muscat" },

  { label: "دهلی (Asia/Kolkata)", value: "Asia/Kolkata" },
  { label: "بمبئی (Asia/Kolkata)", value: "Asia/Kolkata" },
  { label: "کشمیر (Asia/Kolkata)", value: "Asia/Kolkata" },

  { label: "اسلام‌آباد (Asia/Karachi)", value: "Asia/Karachi" },
  { label: "کراچی (Asia/Karachi)", value: "Asia/Karachi" },
  { label: "لاهور (Asia/Karachi)", value: "Asia/Karachi" },

  { label: "پکن (Asia/Shanghai)", value: "Asia/Shanghai" },
  { label: "شانگهای (Asia/Shanghai)", value: "Asia/Shanghai" },

  { label: "کوالالامپور (Asia/Kuala_Lumpur)", value: "Asia/Kuala_Lumpur" },
  { label: "جاکارتا (Asia/Jakarta)", value: "Asia/Jakarta" },

  { label: "سنگاپور (Asia/Singapore)", value: "Asia/Singapore" },
  { label: "بانکوک (Asia/Bangkok)", value: "Asia/Bangkok" },

  { label: "توکیو (Asia/Tokyo)", value: "Asia/Tokyo" },
  { label: "سئول (Asia/Seoul)", value: "Asia/Seoul" },

  { label: "پاریس (Europe/Paris)", value: "Europe/Paris" },
  { label: "لندن (Europe/London)", value: "Europe/London" },
  { label: "رم (Europe/Rome)", value: "Europe/Rome" },
  { label: "برلین (Europe/Berlin)", value: "Europe/Berlin" },
  { label: "مادرید (Europe/Madrid)", value: "Europe/Madrid" },
  { label: "بارسلونا (Europe/Madrid)", value: "Europe/Madrid" },
  { label: "آمستردام (Europe/Amsterdam)", value: "Europe/Amsterdam" },
  { label: "وین (Europe/Vienna)", value: "Europe/Vienna" },
  { label: "ژنو (Europe/Zurich)", value: "Europe/Zurich" },
  { label: "زوریخ (Europe/Zurich)", value: "Europe/Zurich" },

  { label: "مسکو (Europe/Moscow)", value: "Europe/Moscow" },

  { label: "نیویورک (America/New_York)", value: "America/New_York" },
  { label: "واشنگتن (America/New_York)", value: "America/New_York" },
  { label: "لس‌آنجلس (America/Los_Angeles)", value: "America/Los_Angeles" },
  { label: "شیکاگو (America/Chicago)", value: "America/Chicago" },

  { label: "تورنتو (America/Toronto)", value: "America/Toronto" },
  { label: "ونکوور (America/Vancouver)", value: "America/Vancouver" },

  { label: "سائوپائولو (America/Sao_Paulo)", value: "America/Sao_Paulo" },
  { label: "ریودوژانیرو (America/Sao_Paulo)", value: "America/Sao_Paulo" },

  { label: "سیدنی (Australia/Sydney)", value: "Australia/Sydney" },
  { label: "ملبورن (Australia/Melbourne)", value: "Australia/Melbourne" }
];

export default function WeatherTab({ cities, onBatchUpdate, showAlert, setHasUnsavedChanges }) {
  const [localCities, setLocalCities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalCities(cities || []);
  }, [cities]);

  // ذخیره نهایی در دیتابیس
  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
        await onBatchUpdate([{ section: 'weather_cities', field: null, value: localCities }]);
        if (setHasUnsavedChanges) setHasUnsavedChanges(false);
        if (showAlert) showAlert('success', 'ذخیره موفق', 'اطلاعات شهرها با موفقیت در دیتابیس ذخیره شد.');
    } catch (e) {
        if (showAlert) showAlert('danger', 'خطا', 'مشکلی در ذخیره اطلاعات پیش آمد.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleEditClick = (city) => {
    setEditForm({ ...city });
    setEditingId(city.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // فقط تایید موقت در لیست (بدون رفرش صفحه)
  const handleSaveEdit = () => {
    const updated = localCities.map(c => c.id === editingId ? editForm : c);
    setLocalCities(updated);
    setEditingId(null);
    if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleDelete = (id) => {
    if (showAlert) {
        showAlert(
            'danger', 
            'حذف شهر', 
            'آیا از حذف این شهر از لیست اطمینان دارید؟', 
            () => {
                const updated = localCities.filter(c => c.id !== id);
                setLocalCities(updated);
                if (setHasUnsavedChanges) setHasUnsavedChanges(true);
            },
            true
        );
    } else {
        if(window.confirm('آیا مطمئن هستید؟')) {
            const updated = localCities.filter(c => c.id !== id);
            setLocalCities(updated);
            if (setHasUnsavedChanges) setHasUnsavedChanges(true);
        }
    }
  };

  const handleDuplicate = (city) => {
      const newCity = { ...city, id: Date.now(), faName: `${city.faName} (کپی)` };
      setLocalCities([...localCities, newCity]);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleAddCity = () => {
      const newCity = { 
          id: Date.now(), 
          name: "Kabul", 
          faName: "کابل جدید", 
          countryName: "افغانستان", 
          timezone: "Asia/Kabul", 
          image: "" 
      };
      // شهر جدید مستقیماً به بالای لیست اضافه می‌شود تا نیاز به اسکرول نباشد
      setLocalCities([newCity, ...localCities]);
      setEditForm(newCity);
      setEditingId(newCity.id);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleChange = (key, value) => {
      setEditForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24">
        <h2 className="text-2xl font-black text-gray-800">مدیریت شهرهای آب‌وهوا</h2>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col gap-6 w-full relative">
            <div className="flex justify-between items-center border-b pb-4">
                <span className="font-bold text-gray-500">لیست شهرها</span>
                <button onClick={handleAddCity} className="text-xs bg-green-50 text-green-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 hover:bg-green-100 transition shadow-sm active:scale-95">
                    <Plus size={16}/> افزودن شهر جدید
                </button>
            </div>

            <div className="space-y-3">
               {localCities.length === 0 && (
                   <p className="text-center text-gray-400 font-bold py-10 bg-gray-50 rounded-2xl border border-dashed">شهری در لیست وجود ندارد.</p>
               )}
               {localCities.map((city, index) => (
                  <div key={city.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md w-full">
                      
                      {editingId === city.id ? (
                          <div className="p-4 bg-blue-50/30">
                              <div className="flex justify-between items-center mb-4 border-b pb-2">
                                  <span className="text-sm font-black text-blue-600">ویرایش شهر</span>
                                  <div className="flex gap-2">
                                      <button onClick={handleSaveEdit} className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600 shadow-sm"><Check size={14}/> تایید موقت</button>
                                      <button onClick={handleCancelEdit} className="text-xs bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300 shadow-sm"><X size={14}/> انصراف</button>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs text-gray-500 font-bold block mb-1">نام انگلیسی (برای API)</label>
                                      <input 
                                          value={editForm.name || ''}
                                          onChange={e => handleChange('name', e.target.value)}
                                          className="input-admin ltr"
                                          placeholder="e.g. Kabul"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-500 font-bold block mb-1">نام فارسی (نمایش)</label>
                                      <input 
                                          value={editForm.faName || ''}
                                          onChange={e => handleChange('faName', e.target.value)}
                                          className="input-admin"
                                          placeholder="مثلا: کابل"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-500 font-bold block mb-1">کشور (نمایش)</label>
                                      <input 
                                          value={editForm.countryName || ''}
                                          onChange={e => handleChange('countryName', e.target.value)}
                                          className="input-admin"
                                          placeholder="مثلا: افغانستان"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-500 font-bold block mb-1">تایم‌زون</label>
                                      <select 
                                          value={editForm.timezone || 'Asia/Kabul'}
                                          onChange={e => handleChange('timezone', e.target.value)}
                                          className="input-admin ltr text-sm"
                                      >
                                          {VALID_TIMEZONES.map(tz => (
                                              <option key={tz.value} value={tz.value}>{tz.label}</option>
                                          ))}
                                      </select>
                                  </div>
                                   <div className="md:col-span-2">
                                      <label className="text-xs text-gray-500 font-bold block mb-1">لینک تصویر پس‌زمینه کارت آب‌وهوا در سایت</label>
                                      <input 
                                          value={editForm.image || ''}
                                          onChange={e => handleChange('image', e.target.value)}
                                          className="input-admin ltr text-blue-600"
                                          placeholder="https://..."
                                      />
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="p-3 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                  <div className="cursor-grab text-gray-300 p-1 hover:text-gray-500 transition"><GripVertical size={18}/></div>
                                  <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                                      {city.image ? <img src={city.image} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-gray-400"><Image size={20}/></div>}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-800 text-sm">{city.faName || city.name}</h4>
                                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 dir-ltr flex gap-2">
                                          <span>{city.name}</span>
                                          <span className="text-gray-300">|</span>
                                          <span>{city.timezone}</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleDuplicate(city)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="کپی"><Copy size={16}/></button>
                                  <button onClick={() => handleEditClick(city)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition" title="ویرایش"><Edit size={16}/></button>
                                  <button onClick={() => handleDelete(city.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="حذف"><Trash size={16}/></button>
                              </div>
                          </div>
                      )}
                  </div>
               ))}
            </div>
        </div>

        {/* نوار چسبان پایین برای ذخیره نهایی */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-64 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 flex justify-end px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <button 
                onClick={handleSaveAllToDatabase} 
                disabled={isSaving} 
                className="w-full md:w-auto bg-[#058B8C] text-white px-10 py-3.5 rounded-2xl font-black shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 hover:bg-[#047070] active:scale-95 transition-all disabled:opacity-70"
            >
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                {isSaving ? 'در حال ثبت در دیتابیس...' : 'ذخیره نهایی در دیتابیس سایت'}
            </button>
        </div>

    </div>
  );
}