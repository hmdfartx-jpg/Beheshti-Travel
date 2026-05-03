import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Loader2, Sparkles, Image as ImageIcon, Check, X, Save, GripVertical, Edit3, Trash2, Pin } from 'lucide-react';

export default function NewsTab({ onUpdate, fetchTranslation, showAlert, setHasUnsavedChanges }) {
  const [localNews, setLocalNews] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]); // برای نگهداری ID اخباری که باید از دیتابیس حذف شوند
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loadingField, setLoadingField] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
     fetchNews();
  }, []);

  const fetchNews = async () => {
     try {
         const q = query(collection(db, 'news'), orderBy('created_at', 'desc'));
         const snap = await getDocs(q);
         setLocalNews(snap.docs.map(d => ({id: d.id, ...d.data()})));
     } catch (e) { 
         console.error(e);
         if (showAlert) showAlert('danger', 'خطا', 'مشکلی در دریافت اخبار پیش آمد.');
     }
  };

  // ذخیره نهایی تمام تغییرات (افزودن، ویرایش، حذف) در دیتابیس
  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
        // ۱. حذف اخباری که کاربر دلیت کرده
        for (const id of deletedIds) {
            await deleteDoc(doc(db, 'news', id));
        }
        
        // ۲. اضافه کردن یا آپدیت اخبار موجود در لیست
        for (const item of localNews) {
            const newsData = {
                title: item.title || '', desc: item.desc || '',
                title_ps: item.title_ps || '', desc_ps: item.desc_ps || '',
                title_en: item.title_en || '', desc_en: item.desc_en || '',
                image_url: item.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167',
                pinned: item.pinned || false,
                created_at: item.created_at || new Date().toISOString()
            };

            if (item.id.startsWith('temp_')) {
                // خبر جدید است (باید Add شود)
                await addDoc(collection(db, 'news'), newsData);
            } else {
                // خبر قدیمی است (باید Update شود)
                await updateDoc(doc(db, 'news', item.id), newsData);
            }
        }

        if (setHasUnsavedChanges) setHasUnsavedChanges(false);
        setDeletedIds([]); // پاکسازی لیست حذفی‌ها
        if (showAlert) showAlert('success', 'ذخیره موفق', 'اخبار با موفقیت در سایت منتشر و بروزرسانی شدند.');
        fetchNews(); // دریافت مجدد برای گرفتن ID های واقعی فایربیس
    } catch (e) {
        if (showAlert) showAlert('danger', 'خطا', 'مشکلی در ذخیره اخبار پیش آمد.');
    } finally {
        setIsSaving(false);
    }
  };

  // --- عملیات‌های لوکال ---
  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleSort = () => {
      if(dragItem.current === null || dragOverItem.current === null) return;
      const _items = [...localNews];
      const item = _items[dragItem.current];
      _items.splice(dragItem.current, 1);
      _items.splice(dragOverItem.current, 0, item);
      dragItem.current = null;
      dragOverItem.current = null;
      setLocalNews(_items);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleEditClick = (newsItem) => { setEditForm({ ...newsItem }); setEditingId(newsItem.id); };
  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleSaveEdit = () => {
    const updated = localNews.map(n => n.id === editingId ? editForm : n);
    setLocalNews(updated);
    setEditingId(null);
    if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleDelete = (id) => {
    if (showAlert) {
        showAlert('danger', 'حذف خبر', 'آیا از حذف این خبر اطمینان دارید؟', () => {
            setLocalNews(localNews.filter(n => n.id !== id));
            if (!id.startsWith('temp_')) {
                setDeletedIds([...deletedIds, id]); // اضافه کردن به صف حذف از دیتابیس
            }
            if (setHasUnsavedChanges) setHasUnsavedChanges(true);
        }, true);
    }
  };

  const handleAddNews = () => {
      const newNews = { 
          id: `temp_${Date.now()}`, 
          title: "عنوان خبر جدید", desc: "", 
          title_ps: "", desc_ps: "", 
          title_en: "", desc_en: "",
          image_url: "", pinned: false,
          created_at: new Date().toISOString()
      };
      setLocalNews([newNews, ...localNews]);
      setEditForm(newNews);
      setEditingId(newNews.id);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleTogglePin = (id) => {
      const updated = localNews.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
      setLocalNews(updated);
      if (setHasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleChange = (key, value) => {
      setEditForm(prev => ({ ...prev, [key]: value }));
  };

  const handleTranslate = async (sourceText, lang, fieldKey) => {
      if(!sourceText) return;
      setLoadingField(`${fieldKey}_${lang}`);
      const text = await fetchTranslation(sourceText, lang);
      handleChange(fieldKey, text);
      setLoadingField(null);
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24" dir="rtl">
        <h2 className="text-2xl font-black text-gray-800">مدیریت اخبار و اطلاعیه‌ها</h2>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6 w-full">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <span className="font-bold text-gray-500">لیست اخبار</span>
                <button onClick={handleAddNews} className="text-sm bg-green-50 text-green-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 hover:bg-green-100 transition active:scale-95">
                    <Plus size={16}/> افزودن خبر جدید
                </button>
            </div>

            <div className="space-y-3">
               {localNews.length === 0 && (
                   <p className="text-center text-gray-400 font-bold py-10 bg-gray-50 rounded-2xl border border-dashed">هیچ خبری در سیستم وجود ندارد.</p>
               )}
               {localNews.map((n, index) => (
                  <div 
                      key={n.id} 
                      className={`rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md w-full ${n.pinned && editingId !== n.id ? 'bg-yellow-50/30 border-yellow-300' : 'bg-white border-gray-100'}`}
                      draggable 
                      onDragStart={(e) => handleDragStart(e, index)} 
                      onDragEnter={(e) => dragOverItem.current = index} 
                      onDragEnd={handleSort} 
                      onDragOver={(e) => e.preventDefault()}
                  >
                      {editingId === n.id ? (
                          <div className="p-5 bg-blue-50/30">
                              <div className="flex justify-between items-center mb-4 border-b pb-3">
                                  <span className="text-sm font-black text-[#058B8C]">ویرایش خبر</span>
                                  <div className="flex gap-2">
                                      <button onClick={handleSaveEdit} className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600 shadow-sm"><Check size={14}/> تایید موقت</button>
                                      <button onClick={handleCancelEdit} className="text-xs bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-gray-300 shadow-sm"><X size={14}/> انصراف</button>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                  {/* دری */}
                                  <div>
                                      <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">عنوان و متن (دری)</label></div>
                                      <input value={editForm.title || ''} onChange={e => handleChange('title', e.target.value)} className="input-admin mb-2" placeholder="عنوان خبر..." />
                                      <textarea value={editForm.desc || ''} onChange={e => handleChange('desc', e.target.value)} className="input-admin text-xs" rows={4} placeholder="متن کامل خبر..." />
                                  </div>
                                  {/* پشتو */}
                                  <div>
                                      <div className="flex justify-between items-center h-[26px] mb-1">
                                          <label className="text-[10px] font-bold text-green-600">پشتو</label>
                                          <button type="button" onClick={()=>{handleTranslate(editForm.title, 'ps', 'title_ps'); handleTranslate(editForm.desc, 'ps', 'desc_ps');}} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ترجمه هردو</button>
                                      </div>
                                      <input value={editForm.title_ps || ''} onChange={e => handleChange('title_ps', e.target.value)} className="input-admin mb-2 text-right" placeholder="عنوان پشتو..." />
                                      <textarea value={editForm.desc_ps || ''} onChange={e => handleChange('desc_ps', e.target.value)} className="input-admin text-xs text-right" rows={4} placeholder="متن پشتو..." />
                                  </div>
                                  {/* انگلیسی */}
                                  <div dir="ltr">
                                      <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                                          <label className="text-[10px] font-bold text-orange-600">English</label>
                                          <button type="button" onClick={()=>{handleTranslate(editForm.title, 'en', 'title_en'); handleTranslate(editForm.desc, 'en', 'desc_en');}} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">Translate</button>
                                      </div>
                                      <input value={editForm.title_en || ''} onChange={e => handleChange('title_en', e.target.value)} className="input-admin mb-2 ltr" placeholder="Title EN..." />
                                      <textarea value={editForm.desc_en || ''} onChange={e => handleChange('desc_en', e.target.value)} className="input-admin text-xs ltr" rows={4} placeholder="Description EN..." />
                                  </div>
                              </div>

                              <div className="border-t border-white pt-4 mt-2 flex items-center gap-4">
                                  <ImageIcon className="text-gray-400 shrink-0"/>
                                  <input value={editForm.image_url || ''} onChange={e => handleChange('image_url', e.target.value)} className="input-admin flex-1 ltr" placeholder="لینک تصویر کاور خبر (اختیاری)" />
                              </div>
                          </div>
                      ) : (
                          <div className="p-4 flex items-center justify-between group hover:bg-gray-50 transition">
                              <div className="flex items-center gap-4">
                                  <div className="cursor-grab text-gray-300 p-1 hover:text-gray-500 transition"><GripVertical size={18}/></div>
                                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                      {n.image_url ? <img src={n.image_url} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon size={24}/></div>}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-gray-800 text-sm mb-1">{n.title}</h4>
                                      <div className="text-[10px] text-gray-400 flex gap-2">
                                          {n.title_ps && <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold">پشتو</span>}
                                          {n.title_en && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">English</span>}
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                  <button onClick={() => handleTogglePin(n.id)} className={`p-2.5 rounded-xl transition ${n.pinned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`} title={n.pinned ? "برداشتن سنجاق" : "سنجاق کردن خبر"}>
                                      <Pin size={18} className={n.pinned ? "fill-current" : ""}/>
                                  </button>
                                  <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
                                  <button onClick={() => handleEditClick(n)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition" title="ویرایش"><Edit3 size={18}/></button>
                                  <button onClick={() => handleDelete(n.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition" title="حذف"><Trash2 size={18}/></button>
                              </div>
                          </div>
                      )}
                  </div>
               ))}
            </div>
        </div>

        {/* نوار چسبان پایین */}
        <div className="fixed bottom-0 left-0 right-0 lg:right-64 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 flex justify-end px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <button 
                onClick={handleSaveAllToDatabase} 
                disabled={isSaving} 
                className="w-full md:w-auto bg-[#058B8C] text-white px-10 py-3.5 rounded-2xl font-black shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 hover:bg-[#047070] active:scale-95 transition-all disabled:opacity-70"
            >
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                {isSaving ? 'در حال انتشار...' : 'ذخیره نهایی و انتشار اخبار'}
            </button>
        </div>
    </div>
  );
}