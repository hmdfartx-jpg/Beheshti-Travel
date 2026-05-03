import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Save, Plus, Check, X, Edit3, Trash2, GripVertical, Link as LinkIcon } from 'lucide-react';

export default function FooterTab({ settings, onBatchUpdate, fetchTranslation, setHasUnsavedChanges, showAlert }) {
  const [localContact, setLocalContact] = useState({});
  const [localLinks, setLocalLinks] = useState([]);
  
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  const [isSaving, setIsSaving] = useState(false);
  const [loadingField, setLoadingField] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    setLocalContact(settings?.contact || {});
    // دادن ID به لینک‌هایی که ممکن است از قبل بدون ID ذخیره شده باشند
    const initialLinks = (settings?.useful_links || []).map((l, i) => ({ ...l, id: l.id || `link_${i}_${Date.now()}` }));
    setLocalLinks(initialLinks);
  }, [settings]);

  // ذخیره نهایی کل اطلاعات فوتر (شبکه‌های اجتماعی، کپی‌رایت، لینک‌های مفید) در دیتابیس
  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
        await onBatchUpdate([
            { section: 'contact', field: null, value: localContact },
            { section: 'useful_links', field: null, value: localLinks }
        ]);
        if (setHasUnsavedChanges) setHasUnsavedChanges(false);
        if (showAlert) showAlert('success', 'ذخیره موفق', 'تنظیمات فوتر و لینک‌های مفید با موفقیت ذخیره شد.');
    } catch (e) {
        if (showAlert) showAlert('danger', 'خطا', 'مشکلی در ذخیره اطلاعات پیش آمد.');
    } finally {
        setIsSaving(false);
    }
  };

  // ------------------------------------
  // مدیریت لینک‌های مفید (Useful Links)
  // ------------------------------------
  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleSort = () => {
      if(dragItem.current === null || dragOverItem.current === null) return;
      const _items = [...localLinks];
      const item = _items[dragItem.current];
      _items.splice(dragItem.current, 1);
      _items.splice(dragOverItem.current, 0, item);
      dragItem.current = null;
      dragOverItem.current = null;
      setLocalLinks(_items);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleEditClick = (link) => { setEditForm({ ...link }); setEditingLinkId(link.id); };
  const handleCancelEdit = () => { setEditingLinkId(null); setEditForm({}); };

  const handleSaveEdit = () => {
    const updated = localLinks.map(l => l.id === editingLinkId ? editForm : l);
    setLocalLinks(updated);
    setEditingLinkId(null);
    if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleDeleteLink = (id) => {
    if (showAlert) {
        showAlert('danger', 'حذف لینک', 'آیا از حذف این لینک از فوتر اطمینان دارید؟', () => {
            setLocalLinks(localLinks.filter(l => l.id !== id));
            if (setHasUnsavedChanges) setHasUnsavedChanges(true);
        }, true);
    }
  };

  const handleAddLink = () => {
      const newLink = { 
          id: `link_new_${Date.now()}`, 
          title_dr: "لینک جدید", title_ps: "", title_en: "",
          url: "/"
      };
      setLocalLinks([newLink, ...localLinks]);
      setEditForm(newLink);
      setEditingLinkId(newLink.id);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleTranslateLink = async (sourceText, lang, fieldKey) => {
      if(!sourceText) return;
      setLoadingField(`link_${fieldKey}`);
      const text = await fetchTranslation(sourceText, lang);
      setEditForm(prev => ({ ...prev, [fieldKey]: text }));
      setLoadingField(null);
  };

  // ------------------------------------
  // تنظیمات عمومی فوتر (تماس و کپی‌رایت)
  // ------------------------------------
  const handleChange = (key, value) => {
      setLocalContact(prev => ({ ...prev, [key]: value }));
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleTranslate = async (sourceText, lang, key) => {
      if(!sourceText) return;
      setLoadingField(`general_${key}`);
      const t = await fetchTranslation(sourceText, lang);
      handleChange(key, t);
      setLoadingField(null);
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24" dir="rtl">
        <h2 className="text-2xl font-black text-gray-800">تنظیمات فوتر (Footer)</h2>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-10 w-full">
            
            {/* ۱. شبکه‌های اجتماعی فوتر */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">۱. لینک شبکه‌های اجتماعی فوتر</h3>
                <p className="text-[10px] text-gray-400 font-bold mb-4">نکته: لینک‌ها را به صورت کامل (با https) وارد کنید. اگر فیلدی خالی باشد آیکون آن در فوتر نمایش داده نمی‌شود.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">لینک WhatsApp</label><input value={localContact.whatsapp || ''} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="https://wa.me/..." className="input-admin ltr"/></div>
                    <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">لینک Telegram</label><input value={localContact.telegram || ''} onChange={e => handleChange('telegram', e.target.value)} placeholder="https://t.me/..." className="input-admin ltr"/></div>
                    <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">لینک Instagram</label><input value={localContact.instagram || ''} onChange={e => handleChange('instagram', e.target.value)} placeholder="https://instagram.com/..." className="input-admin ltr"/></div>
                    <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">لینک Facebook</label><input value={localContact.facebook || ''} onChange={e => handleChange('facebook', e.target.value)} placeholder="https://facebook.com/..." className="input-admin ltr"/></div>
                </div>
            </div>

            {/* ۲. مدیریت لینک‌های مفید */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">۲. لیست لینک‌های مفید (Useful Links)</h3>
                    <button onClick={handleAddLink} className="text-xs bg-green-50 text-green-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 hover:bg-green-100 transition shadow-sm active:scale-95">
                        <Plus size={16}/> افزودن لینک
                    </button>
                </div>
                
                <div className="space-y-3">
                   {localLinks.length === 0 && (
                       <p className="text-center text-gray-400 font-bold py-8 bg-gray-50 rounded-2xl border border-dashed">هیچ لینکی اضافه نشده است.</p>
                   )}
                   {localLinks.map((link, index) => (
                      <div 
                          key={link.id} 
                          className="bg-gray-50 rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:bg-white hover:border-blue-100 hover:shadow-md w-full"
                          draggable 
                          onDragStart={(e) => handleDragStart(e, index)} 
                          onDragEnter={(e) => dragOverItem.current = index} 
                          onDragEnd={handleSort} 
                          onDragOver={(e) => e.preventDefault()}
                      >
                          {editingLinkId === link.id ? (
                              <div className="p-5 bg-blue-50/30">
                                  <div className="flex justify-between items-center mb-4 border-b pb-3">
                                      <span className="text-sm font-black text-[#058B8C]">ویرایش لینک</span>
                                      <div className="flex gap-2">
                                          <button onClick={handleSaveEdit} className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600 shadow-sm"><Check size={14}/> تایید موقت</button>
                                          <button onClick={handleCancelEdit} className="text-xs bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300 shadow-sm"><X size={14}/> انصراف</button>
                                      </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                      <div>
                                          <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">عنوان (دری)</label></div>
                                          <input value={editForm.title_dr || ''} onChange={e => setEditForm({...editForm, title_dr: e.target.value})} className="input-admin" placeholder="مثلا: قوانین و مقررات" />
                                      </div>
                                      <div>
                                          <div className="flex justify-between items-center h-[26px] mb-1">
                                              <label className="text-[10px] font-bold text-green-600">پشتو</label>
                                              <button type="button" onClick={()=>handleTranslateLink(editForm.title_dr, 'ps', 'title_ps')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ترجمه</button>
                                          </div>
                                          <input value={editForm.title_ps || ''} onChange={e => setEditForm({...editForm, title_ps: e.target.value})} className="input-admin text-right" placeholder="پشتو" />
                                      </div>
                                      <div dir="ltr">
                                          <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                                              <label className="text-[10px] font-bold text-orange-600">English</label>
                                              <button type="button" onClick={()=>handleTranslateLink(editForm.title_dr, 'en', 'title_en')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Translate</button>
                                          </div>
                                          <input value={editForm.title_en || ''} onChange={e => setEditForm({...editForm, title_en: e.target.value})} className="input-admin ltr" placeholder="Title EN" />
                                      </div>
                                  </div>

                                  <div className="border-t border-white pt-4 mt-2">
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">آدرس لینک (URL)</label>
                                      <input value={editForm.url || ''} onChange={e => setEditForm({...editForm, url: e.target.value})} className="input-admin ltr text-blue-500 font-mono" placeholder="مثلاً /terms یا https://..." />
                                  </div>
                              </div>
                          ) : (
                              <div className="p-4 flex items-center justify-between group">
                                  <div className="flex items-center gap-4">
                                      <div className="cursor-grab text-gray-300 p-1 hover:text-gray-500 transition"><GripVertical size={18}/></div>
                                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-500">
                                          <LinkIcon size={20}/>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-800 text-sm">{link.title_dr}</h4>
                                          <p className="text-[10px] text-gray-500 mt-0.5 font-mono dir-ltr truncate max-w-xs">{link.url}</p>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => handleEditClick(link)} className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl hover:bg-yellow-100 transition" title="ویرایش"><Edit3 size={18}/></button>
                                      <button onClick={() => handleDeleteLink(link.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition" title="حذف"><Trash2 size={18}/></button>
                                  </div>
                              </div>
                          )}
                      </div>
                   ))}
                </div>
            </div>

            {/* ۳. متن کپی‌رایت */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">۳. متن کپی‌رایت (Copy Right)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">دری</label></div>
                        <input value={localContact.copyright_dr || ''} onChange={e => handleChange('copyright_dr', e.target.value)} className="input-admin" placeholder="تمامی حقوق محفوظ است..."/>
                    </div>
                    <div className="space-y-2 border-l border-r border-gray-100 px-4">
                        <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-green-600">پشتو</label><button onClick={()=>handleTranslate(localContact.copyright_dr, 'ps', 'copyright_ps')} type="button" className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">{loadingField === 'general_copyright_ps' ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button></div>
                        <input value={localContact.copyright_ps || ''} onChange={e => handleChange('copyright_ps', e.target.value)} className="input-admin text-right" placeholder="ټول حقونه خوندي دي..."/>
                    </div>
                    <div className="space-y-2" dir="ltr">
                        <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl"><label className="text-[10px] font-bold text-orange-600">English</label><button onClick={()=>handleTranslate(localContact.copyright_dr, 'en', 'copyright_en')} type="button" className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">{loadingField === 'general_copyright_en' ? <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button></div>
                        <input value={localContact.copyright_en || ''} onChange={e => handleChange('copyright_en', e.target.value)} className="input-admin ltr" placeholder="All rights reserved..."/>
                    </div>
                </div>
            </div>

        </div>

        {/* نوار چسبان ذخیره نهایی */}
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