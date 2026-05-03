import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Loader2, MessageCircle, Send, Instagram, Facebook, MapPin, Check, X, Edit3, GripVertical, Save } from 'lucide-react';

const SOCIAL_CONFIG = {
  whatsapp: { prefix: 'https://wa.me/', label: 'واتساپ', placeholder: '93700123456', icon: MessageCircle, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'focus-within:border-green-500' },
  telegram: { prefix: 'https://t.me/', label: 'تلگرام', placeholder: 'username', icon: Send, color: 'text-blue-400', bgColor: 'bg-blue-50', borderColor: 'focus-within:border-blue-400' },
  instagram: { prefix: 'https://instagram.com/', label: 'اینستاگرام', placeholder: 'username', icon: Instagram, color: 'text-pink-500', bgColor: 'bg-pink-50', borderColor: 'focus-within:border-pink-500' },
  facebook: { prefix: 'https://facebook.com/', label: 'فیسبوک', placeholder: 'username', icon: Facebook, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'focus-within:border-blue-700' }
};

export default function ContactTab({ settings, agencies, onBatchUpdate, fetchTranslation, setHasUnsavedChanges, showAlert }) {
  const [localContact, setLocalContact] = useState({});
  const [localAgencies, setLocalAgencies] = useState([]);
  
  const [editingAgencyId, setEditingAgencyId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loadingField, setLoadingField] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    setLocalContact(settings?.contact || {});
    const initialAgencies = (agencies || []).map((a, i) => ({ ...a, id: a.id || `agn_${i}_${Date.now()}` }));
    setLocalAgencies(initialAgencies);
  }, [settings, agencies]);

  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
        await onBatchUpdate([
            { section: 'contact', field: null, value: localContact },
            { section: 'agencies', field: null, value: localAgencies }
        ]);
        if (setHasUnsavedChanges) setHasUnsavedChanges(false);
        if (showAlert) showAlert('success', 'ذخیره موفق', 'تنظیمات تماس و شعبات با موفقیت ذخیره شد.');
    } catch (e) {
        if (showAlert) showAlert('danger', 'خطا', 'مشکلی در ذخیره اطلاعات پیش آمد.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleContactChange = (key, value) => {
      setLocalContact(prev => ({ ...prev, [key]: value }));
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleTranslateContact = async (sourceText, lang, fieldKey) => {
      if(!sourceText) return;
      setLoadingField(`contact_${fieldKey}`);
      const text = await fetchTranslation(sourceText, lang);
      handleContactChange(fieldKey, text);
      setLoadingField(null);
  };

  const handleTranslateAgency = async (sourceText, lang, fieldKey) => {
      if(!sourceText) return;
      setLoadingField(`agency_${fieldKey}`);
      const text = await fetchTranslation(sourceText, lang);
      setEditForm(prev => ({ ...prev, [fieldKey]: text }));
      setLoadingField(null);
  };

  // مدیریت شعبات
  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleSort = () => {
      if(dragItem.current === null || dragOverItem.current === null) return;
      const _items = [...localAgencies];
      const item = _items[dragItem.current];
      _items.splice(dragItem.current, 1);
      _items.splice(dragOverItem.current, 0, item);
      dragItem.current = null;
      dragOverItem.current = null;
      setLocalAgencies(_items);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleEditClick = (agency) => { setEditForm({ ...agency }); setEditingAgencyId(agency.id); };
  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleSaveEdit = () => {
    const updated = localAgencies.map(a => a.id === editingAgencyId ? editForm : a);
    setLocalAgencies(updated);
    setEditingAgencyId(null);
    if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleDelete = (id) => {
    if (showAlert) {
        showAlert('danger', 'حذف شعبه', 'آیا از حذف این شعبه اطمینان دارید؟', () => {
            setLocalAgencies(localAgencies.filter(a => a.id !== id));
            if (setHasUnsavedChanges) setHasUnsavedChanges(true);
        }, true);
    }
  };

  const handleAddAgency = () => {
      const newAgency = { 
          id: `agn_new_${Date.now()}`, 
          name_dr: "شعبه جدید", name_ps: "", name_en: "",
          address_dr: "", address_ps: "", address_en: "",
          phone: "", map: "", whatsapp: "", telegram: "", facebook: "", instagram: ""
      };
      setLocalAgencies([newAgency, ...localAgencies]);
      setEditForm(newAgency);
      setEditingAgencyId(newAgency.id);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const SmartSocialInput = ({ platformKey, value, onChange }) => {
      const config = SOCIAL_CONFIG[platformKey];
      const Icon = config.icon;
      const getDisplayValue = (fullLink) => {
          if (!fullLink) return '';
          if (fullLink.startsWith(config.prefix)) return fullLink.replace(config.prefix, '');
          return fullLink; 
      };
      const handleChange = (e) => {
          const val = e.target.value;
          const finalValue = val.startsWith('http') ? val : config.prefix + val;
          onChange(finalValue);
      };

      return (
          <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor} ${config.color}`}><Icon size={20}/></div>
              <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">{config.label}</label>
                  <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white transition-all ${config.borderColor} focus-within:ring-1 focus-within:ring-opacity-50`}>
                      <div className="bg-gray-50 px-3 py-2 text-[10px] text-gray-400 font-mono border-r border-gray-100 select-none hidden sm:block" dir="ltr">{config.prefix.replace('https://', '')}</div>
                      <input value={getDisplayValue(value)} onChange={handleChange} placeholder={config.placeholder} className="w-full px-3 py-2 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300 font-mono" dir="ltr"/>
                  </div>
              </div>
          </div>
      );
  };

  const SocialInputsGroup = ({ data, onChange }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
          <SmartSocialInput platformKey="whatsapp" value={data?.whatsapp} onChange={(val) => onChange('whatsapp', val)} />
          <SmartSocialInput platformKey="telegram" value={data?.telegram} onChange={(val) => onChange('telegram', val)} />
          <SmartSocialInput platformKey="instagram" value={data?.instagram} onChange={(val) => onChange('instagram', val)} />
          <SmartSocialInput platformKey="facebook" value={data?.facebook} onChange={(val) => onChange('facebook', val)} />
      </div>
  );

  return (
    <div className="space-y-12 w-full animate-in fade-in pb-24" dir="rtl">
        
        {/* دفتر مرکزی */}
        <div className="space-y-6 w-full">
            <h2 className="text-2xl font-black text-gray-800">اطلاعات تماس دفتر مرکزی</h2>
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">شماره تماس اصلی (نمایش در هدر)</label>
                        <input value={localContact.phone || ''} onChange={e => handleContactChange('phone', e.target.value)} className="input-admin ltr font-mono" placeholder="+93..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">ایمیل رسمی</label>
                        <input value={localContact.email || ''} onChange={e => handleContactChange('email', e.target.value)} className="input-admin ltr font-mono" placeholder="info@example.com" />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600 block">آدرس (دری)</label></div>
                        <textarea value={localContact.address_dr || ''} onChange={e => handleContactChange('address_dr', e.target.value)} className="input-admin h-24 text-xs" placeholder="آدرس کامل به فارسی دری..." />
                    </div>
                    <div className="space-y-2 border-l border-r border-gray-100 px-4">
                        <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-green-600 block">پشتو</label><button onClick={()=>handleTranslateContact(localContact.address_dr, 'ps', 'address_ps')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">{loadingField === 'contact_address_ps' ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button></div>
                        <textarea value={localContact.address_ps || ''} onChange={e => handleContactChange('address_ps', e.target.value)} className="input-admin h-24 text-right text-xs" placeholder="پته..." />
                    </div>
                    <div className="space-y-2" dir="ltr">
                        <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl"><label className="text-[10px] font-bold text-orange-600 block">English</label><button onClick={()=>handleTranslateContact(localContact.address_dr, 'en', 'address_en')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">{loadingField === 'contact_address_en' ? <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button></div>
                        <textarea value={localContact.address_en || ''} onChange={e => handleContactChange('address_en', e.target.value)} className="input-admin h-24 ltr text-xs" placeholder="Full Address..." />
                    </div>
                </div>

                <div className="pt-4">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">لینک نقشه گوگل (موقعیت دفتر مرکزی)</label>
                    <input value={localContact.map_link || ''} onChange={e => handleContactChange('map_link', e.target.value)} className="input-admin ltr text-blue-500" placeholder="https://maps.google.com/..." />
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">شبکه‌های اجتماعی دفتر مرکزی</h3>
                    <SocialInputsGroup data={localContact} onChange={handleContactChange} />
                </div>
            </div>
        </div>

        {/* لیست شعبات */}
        <div className="space-y-6 w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-800">مدیریت نمایندگی‌ها (شعب)</h2>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6 w-full">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="font-bold text-gray-500">لیست شعب</span>
                    <button onClick={handleAddAgency} className="text-sm bg-green-50 text-green-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 hover:bg-green-100 transition active:scale-95">
                        <Plus size={16}/> افزودن شعبه جدید
                    </button>
                </div>

                <div className="space-y-3">
                   {localAgencies.length === 0 && (
                       <p className="text-center text-gray-400 font-bold py-10 bg-gray-50 rounded-2xl border border-dashed">شعبه‌ای یافت نشد.</p>
                   )}
                   {localAgencies.map((agency, index) => (
                      <div 
                          key={agency.id} 
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md w-full"
                          draggable 
                          onDragStart={(e) => handleDragStart(e, index)} 
                          onDragEnter={(e) => dragOverItem.current = index} 
                          onDragEnd={handleSort} 
                          onDragOver={(e) => e.preventDefault()}
                      >
                          {editingAgencyId === agency.id ? (
                              <div className="p-5 bg-blue-50/30">
                                  <div className="flex justify-between items-center mb-4 border-b pb-3">
                                      <span className="text-sm font-black text-[#058B8C]">ویرایش مشخصات شعبه</span>
                                      <div className="flex gap-2">
                                          <button onClick={handleSaveEdit} className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600 shadow-sm"><Check size={14}/> تایید موقت</button>
                                          <button onClick={() => setEditingAgencyId(null)} className="text-xs bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300 shadow-sm"><X size={14}/> انصراف</button>
                                      </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white pb-6 mb-6">
                                      <div>
                                          <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">دری (فارسی)</label></div>
                                          <input value={editForm.name_dr || ''} onChange={e => setEditForm({...editForm, name_dr: e.target.value})} className="input-admin mb-2" placeholder="نام شعبه (مثلا شعبه کابل)" />
                                          <textarea value={editForm.address_dr || ''} onChange={e => setEditForm({...editForm, address_dr: e.target.value})} className="input-admin text-xs" rows={2} placeholder="آدرس شعبه" />
                                      </div>
                                      <div>
                                          <div className="flex justify-between items-center h-[26px] mb-1">
                                              <label className="text-[10px] font-bold text-green-600">پشتو</label>
                                              <button type="button" onClick={()=>{handleTranslateAgency(editForm.name_dr, 'ps', 'name_ps'); handleTranslateAgency(editForm.address_dr, 'ps', 'address_ps');}} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ترجمه هردو</button>
                                          </div>
                                          <input value={editForm.name_ps || ''} onChange={e => setEditForm({...editForm, name_ps: e.target.value})} className="input-admin mb-2 text-right" placeholder="نام شعبه پشتو" />
                                          <textarea value={editForm.address_ps || ''} onChange={e => setEditForm({...editForm, address_ps: e.target.value})} className="input-admin text-xs text-right" rows={2} placeholder="آدرس پشتو" />
                                      </div>
                                      <div dir="ltr">
                                          <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                                              <label className="text-[10px] font-bold text-orange-600">English</label>
                                              <button type="button" onClick={()=>{handleTranslateAgency(editForm.name_dr, 'en', 'name_en'); handleTranslateAgency(editForm.address_dr, 'en', 'address_en');}} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Translate</button>
                                          </div>
                                          <input value={editForm.name_en || ''} onChange={e => setEditForm({...editForm, name_en: e.target.value})} className="input-admin mb-2 ltr" placeholder="Branch Name EN" />
                                          <textarea value={editForm.address_en || ''} onChange={e => setEditForm({...editForm, address_en: e.target.value})} className="input-admin text-xs ltr" rows={2} placeholder="Address EN" />
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                      <div><label className="text-xs font-bold text-gray-500 block mb-1">تلفن شعبه</label><input value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="input-admin ltr font-mono" placeholder="+93..." /></div>
                                      <div><label className="text-xs font-bold text-gray-500 block mb-1">لینک نقشه گوگل</label><input value={editForm.map || ''} onChange={e => setEditForm({...editForm, map: e.target.value})} className="input-admin ltr text-blue-500" placeholder="https://maps..." /></div>
                                  </div>

                                  <div>
                                      <label className="text-xs font-bold text-gray-500 block mb-2">شبکه‌های اجتماعی شعبه</label>
                                      <SocialInputsGroup data={editForm} onChange={(k, v) => setEditForm(prev => ({...prev, [k]: v}))} />
                                  </div>
                              </div>
                          ) : (
                              <div className="p-4 flex items-center justify-between group bg-white hover:bg-gray-50 transition">
                                  <div className="flex items-center gap-4">
                                      <div className="cursor-grab text-gray-300 p-1 hover:text-gray-500 transition"><GripVertical size={18}/></div>
                                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 text-orange-500">
                                          <MapPin size={24}/>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-800 text-sm">{agency.name_dr || agency.city_dr || `شعبه شماره ${index+1}`}</h4>
                                          <p className="text-[10px] text-gray-500 mt-1 font-mono dir-ltr">{agency.phone}</p>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => handleEditClick(agency)} className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition" title="ویرایش"><Edit3 size={18}/></button>
                                      <button onClick={() => handleDelete(agency.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition" title="حذف"><Trash2 size={18}/></button>
                                  </div>
                              </div>
                          )}
                      </div>
                   ))}
                </div>
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