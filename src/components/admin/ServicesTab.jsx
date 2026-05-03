import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Plane, FileText, GraduationCap, Package, Hotel, ShieldCheck, Clock, CheckCircle, Globe, MapPin, Search, Briefcase, DollarSign, Umbrella, Bus, GripVertical, Edit3, Trash2, Check, X, Plus, Save } from 'lucide-react';

const ICON_MAP = {
  'Plane': Plane, 'FileText': FileText, 'GraduationCap': GraduationCap, 'Package': Package,
  'Hotel': Hotel, 'ShieldCheck': ShieldCheck, 'Clock': Clock, 'CheckCircle': CheckCircle,
  'Globe': Globe, 'MapPin': MapPin, 'Search': Search, 'Briefcase': Briefcase,
  'DollarSign': DollarSign, 'Umbrella': Umbrella, 'Bus': Bus, 'Sparkles': Sparkles
};

export default function ServicesTab({ services, onBatchUpdate, fetchTranslation, setHasUnsavedChanges, showAlert }) {
  const [localServices, setLocalServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [openIconSelector, setOpenIconSelector] = useState(false);
  const [loadingField, setLoadingField] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    // مقداردهی اولیه با دادن ID به سرویس‌هایی که ممکن است ID نداشته باشند
    const initialServices = (services || []).map((s, i) => ({ ...s, id: s.id || `srv_${i}_${Date.now()}` }));
    setLocalServices(initialServices);
  }, [services]);

  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
        await onBatchUpdate([{ section: 'services', field: null, value: localServices }]);
        if (setHasUnsavedChanges) setHasUnsavedChanges(false);
        if (showAlert) showAlert('success', 'ذخیره موفق', 'اطلاعات خدمات با موفقیت در دیتابیس سایت ذخیره شد.');
    } catch (e) {
        if (showAlert) showAlert('danger', 'خطا', 'مشکلی در ذخیره اطلاعات پیش آمد.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleSort = () => {
      if(dragItem.current === null || dragOverItem.current === null) return;
      const _items = [...localServices];
      const item = _items[dragItem.current];
      _items.splice(dragItem.current, 1);
      _items.splice(dragOverItem.current, 0, item);
      dragItem.current = null;
      dragOverItem.current = null;
      setLocalServices(_items);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleEditClick = (service) => {
    setEditForm({ ...service });
    setEditingId(service.id);
    setOpenIconSelector(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setOpenIconSelector(false);
  };

  const handleSaveEdit = () => {
    const updated = localServices.map(s => s.id === editingId ? editForm : s);
    setLocalServices(updated);
    setEditingId(null);
    setOpenIconSelector(false);
    if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleDelete = (id) => {
    if (showAlert) {
        showAlert('danger', 'حذف خدمت', 'آیا از حذف این خدمت اطمینان دارید؟', () => {
            const updated = localServices.filter(s => s.id !== id);
            setLocalServices(updated);
            if (setHasUnsavedChanges) setHasUnsavedChanges(true);
        }, true);
    }
  };

  const handleAddService = () => {
      const newService = { 
          id: `srv_new_${Date.now()}`, 
          title: "خدمت جدید", 
          desc: "", 
          title_ps: "", desc_ps: "", 
          title_en: "", desc_en: "",
          icon: "Sparkles", 
          color: "#058B8C" 
      };
      setLocalServices([newService, ...localServices]);
      setEditForm(newService);
      setEditingId(newService.id);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleChange = (key, value) => {
      setEditForm(prev => ({ ...prev, [key]: value }));
  };

  const handleTranslate = async (sourceText, lang, fieldKey) => {
      if(!sourceText) return;
      setLoadingField(fieldKey);
      const text = await fetchTranslation(sourceText, lang);
      handleChange(fieldKey, text);
      setLoadingField(null);
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24">
        
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">ویرایش خدمات</h2>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 w-full">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="font-bold text-gray-500">لیست خدمات</span>
                <button onClick={handleAddService} className="text-sm bg-green-50 text-green-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 hover:bg-green-100 transition shadow-sm active:scale-95">
                    <Plus size={16}/> افزودن خدمت جدید
                </button>
            </div>

            <div className="space-y-3">
               {localServices.length === 0 && (
                   <p className="text-center text-gray-400 font-bold py-10 bg-gray-50 rounded-2xl border border-dashed">خدمتی یافت نشد.</p>
               )}
               {localServices.map((service, index) => {
                  const CurrentIcon = ICON_MAP[service.icon] || Sparkles;
                  return (
                      <div 
                          key={service.id} 
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md w-full"
                          draggable 
                          onDragStart={(e) => handleDragStart(e, index)} 
                          onDragEnter={(e) => dragOverItem.current = index} 
                          onDragEnd={handleSort} 
                          onDragOver={(e) => e.preventDefault()}
                      >
                          {editingId === service.id ? (
                              <div className="p-5 bg-blue-50/30">
                                  <div className="flex justify-between items-center mb-4 border-b pb-3">
                                      <span className="text-sm font-black text-[#058B8C]">ویرایش مشخصات خدمت</span>
                                      <div className="flex gap-2">
                                          <button onClick={handleSaveEdit} className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600 shadow-sm"><Check size={14}/> تایید موقت</button>
                                          <button onClick={handleCancelEdit} className="text-xs bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300 shadow-sm"><X size={14}/> انصراف</button>
                                      </div>
                                  </div>
                                  
                                  {/* هدر ویرایش (آیکون و رنگ) */}
                                  <div className="flex flex-col gap-4 mb-4 border-b border-white pb-4">
                                      <div className="flex items-center gap-4">
                                          <div className="flex flex-col items-center gap-2">
                                              <button 
                                                  onClick={() => setOpenIconSelector(!openIconSelector)}
                                                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform ring-4 ring-white" 
                                                  style={{backgroundColor: editForm.color || '#058B8C'}}
                                              >
                                                  <CurrentIcon size={28} />
                                              </button>
                                              <span className="text-[10px] text-gray-500 font-bold">تغییر آیکون</span>
                                          </div>
                                          <div className="flex-1">
                                              <div className="flex items-center gap-2 mt-2">
                                                  <label className="text-xs font-bold text-gray-500">رنگ برند:</label>
                                                  <input 
                                                      type="color" 
                                                      value={editForm.color || '#058B8C'} 
                                                      onChange={(e) => handleChange('color', e.target.value)}
                                                      className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                                  />
                                              </div>
                                          </div>
                                      </div>

                                      {openIconSelector && (
                                          <div className="bg-white p-4 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2 shadow-sm">
                                              <p className="text-xs font-bold text-gray-500 mb-3 block">یک آیکون انتخاب کنید:</p>
                                              <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                                                  {Object.keys(ICON_MAP).map(iconName => {
                                                      const IconComp = ICON_MAP[iconName];
                                                      return (
                                                          <button 
                                                              key={iconName}
                                                              onClick={() => { handleChange('icon', iconName); setOpenIconSelector(false); }}
                                                              className={`p-3 rounded-xl flex items-center justify-center transition-all ${editForm.icon === iconName ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-gray-50 text-gray-500 hover:bg-gray-200'}`}
                                                          >
                                                              <IconComp size={20} />
                                                          </button>
                                                      )
                                                  })}
                                              </div>
                                          </div>
                                      )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div>
                                          <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">دری (فارسی)</label></div>
                                          <input value={editForm.title || ''} onChange={e => handleChange('title', e.target.value)} className="input-admin mb-2" placeholder="عنوان" />
                                          <textarea value={editForm.desc || ''} onChange={e => handleChange('desc', e.target.value)} className="input-admin text-xs" rows={3} placeholder="توضیحات" />
                                      </div>
                                      <div>
                                          <div className="flex justify-between items-center h-[26px] mb-1">
                                              <label className="text-[10px] font-bold text-green-600">پشتو</label>
                                              <button onClick={()=>{handleTranslate(editForm.title, 'ps', 'title_ps'); handleTranslate(editForm.desc, 'ps', 'desc_ps');}} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ترجمه هردو</button>
                                          </div>
                                          <input value={editForm.title_ps || ''} onChange={e => handleChange('title_ps', e.target.value)} className="input-admin mb-2 text-right" placeholder="عنوان پشتو" />
                                          <textarea value={editForm.desc_ps || ''} onChange={e => handleChange('desc_ps', e.target.value)} className="input-admin text-xs text-right" rows={3} placeholder="توضیحات پشتو" />
                                      </div>
                                      <div dir="ltr">
                                          <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                                              <label className="text-[10px] font-bold text-orange-600">English</label>
                                              <button onClick={()=>{handleTranslate(editForm.title, 'en', 'title_en'); handleTranslate(editForm.desc, 'en', 'desc_en');}} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Translate</button>
                                          </div>
                                          <input value={editForm.title_en || ''} onChange={e => handleChange('title_en', e.target.value)} className="input-admin mb-2 ltr" placeholder="Title EN" />
                                          <textarea value={editForm.desc_en || ''} onChange={e => handleChange('desc_en', e.target.value)} className="input-admin text-xs ltr" rows={3} placeholder="Description EN" />
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="p-4 flex items-center justify-between group bg-white hover:bg-gray-50 transition">
                                  <div className="flex items-center gap-4">
                                      <div className="cursor-grab text-gray-300 p-1 hover:text-gray-500 transition"><GripVertical size={18}/></div>
                                      <div 
                                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                                          style={{backgroundColor: service.color || '#058B8C'}}
                                      >
                                          <CurrentIcon size={24}/>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-800 text-sm">{service.title}</h4>
                                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{service.desc}</p>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => handleEditClick(service)} className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition" title="ویرایش"><Edit3 size={18}/></button>
                                      <button onClick={() => handleDelete(service.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition" title="حذف"><Trash2 size={18}/></button>
                                  </div>
                              </div>
                          )}
                      </div>
                   )
               })}
            </div>
        </div>

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