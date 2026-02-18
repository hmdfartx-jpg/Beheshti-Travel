import React, { useState } from 'react';
import { GripVertical, Image, Edit, Trash, Copy, Plus, Check, X } from 'lucide-react';

const VALID_TIMEZONES = [
  { label: "کابل (Asia/Kabul)", value: "Asia/Kabul" },
  { label: "تهران (Asia/Tehran)", value: "Asia/Tehran" },
  { label: "دبی (Asia/Dubai)", value: "Asia/Dubai" },
  { label: "استانبول (Europe/Istanbul)", value: "Europe/Istanbul" },
  { label: "لندن (Europe/London)", value: "Europe/London" },
  { label: "نیویورک (America/New_York)", value: "America/New_York" },
  { label: "تورنتو (America/Toronto)", value: "America/Toronto" },
];

// دریافت showAlert از props
export default function WeatherTab({ cities, onUpdateCities, showAlert }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (city) => {
    setEditForm({ ...city });
    setEditingId(city.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    const updated = cities.map(c => c.id === editingId ? editForm : c);
    onUpdateCities(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    // استفاده از آلرت سفارشی اگر موجود باشد، وگرنه کانفرم معمولی (برای اطمینان)
    if (showAlert) {
        showAlert({
            title: "حذف شهر",
            message: "آیا از حذف این شهر از لیست اطمینان دارید؟",
            type: "danger",
            showCancel: true,
            confirmText: "بله، حذف کن",
            onConfirm: () => {
                const updated = cities.filter(c => c.id !== id);
                onUpdateCities(updated);
            }
        });
    } else if(window.confirm('آیا مطمئن هستید؟')) {
        const updated = cities.filter(c => c.id !== id);
        onUpdateCities(updated);
    }
  };

  const handleDuplicate = (city) => {
      const newCity = { ...city, id: Date.now(), faName: `${city.faName} (کپی)` };
      onUpdateCities([...cities, newCity]);
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
      onUpdateCities([...(cities || []), newCity]);
      setEditForm(newCity);
      setEditingId(newCity.id);
  };

  const handleChange = (key, value) => {
      setEditForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in">
        <h2 className="text-2xl font-black text-gray-800">مدیریت شهرهای آب‌وهوا</h2>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col gap-6 w-full">
            <div className="flex justify-between items-center border-b pb-4">
                <span className="font-bold text-gray-500">لیست شهرها</span>
                <button onClick={handleAddCity} className="text-xs bg-green-50 text-green-600 px-3 py-2 rounded-xl font-bold flex items-center gap-1 hover:bg-green-100 transition">
                    <Plus size={14}/> افزودن شهر جدید
                </button>
            </div>

            <div className="space-y-3">
               {(cities || []).map((city, index) => (
                  <div key={city.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md w-full">
                      
                      {editingId === city.id ? (
                          <div className="p-4 bg-blue-50/30">
                              <div className="flex justify-between items-center mb-4 border-b pb-2">
                                  <span className="text-sm font-black text-blue-600">ویرایش شهر</span>
                                  <div className="flex gap-2">
                                      <button onClick={handleSaveEdit} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-600"><Check size={14}/> ذخیره</button>
                                      <button onClick={handleCancelEdit} className="text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-300"><X size={14}/> انصراف</button>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs text-gray-400 block mb-1">نام انگلیسی (برای API)</label>
                                      <input 
                                          value={editForm.name}
                                          onChange={e => handleChange('name', e.target.value)}
                                          className="input-admin ltr"
                                          placeholder="e.g. Kabul"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-400 block mb-1">نام فارسی (نمایش)</label>
                                      <input 
                                          value={editForm.faName}
                                          onChange={e => handleChange('faName', e.target.value)}
                                          className="input-admin"
                                          placeholder="مثلا: کابل"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-400 block mb-1">کشور (نمایش)</label>
                                      <input 
                                          value={editForm.countryName}
                                          onChange={e => handleChange('countryName', e.target.value)}
                                          className="input-admin"
                                          placeholder="مثلا: افغانستان"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-400 block mb-1">تایم‌زون</label>
                                      <select 
                                          value={editForm.timezone}
                                          onChange={e => handleChange('timezone', e.target.value)}
                                          className="input-admin ltr text-sm"
                                      >
                                          {VALID_TIMEZONES.map(tz => (
                                              <option key={tz.value} value={tz.value}>{tz.label}</option>
                                          ))}
                                      </select>
                                  </div>
                                   <div className="md:col-span-2">
                                      <label className="text-xs text-gray-400 block mb-1">لینک تصویر پس‌زمینه</label>
                                      <input 
                                          value={editForm.image}
                                          onChange={e => handleChange('image', e.target.value)}
                                          className="input-admin ltr text-xs text-gray-500"
                                          placeholder="https://..."
                                      />
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="p-3 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                  <div className="cursor-grab text-gray-300 p-1"><GripVertical size={18}/></div>
                                  <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                                      {city.image ? <img src={city.image} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-gray-400"><Image size={20}/></div>}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-800 text-sm">{city.faName}</h4>
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
    </div>
  );
}