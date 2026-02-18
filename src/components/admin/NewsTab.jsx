import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash, Copy, Pin, Loader2, Image, Sparkles } from 'lucide-react';

export default function NewsTab({ news, onUpdate, fetchTranslation, showAlert }) {
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDesc, setNewsDesc] = useState('');
  const [newsImage, setNewsImage] = useState('');
  
  const [newsTitlePs, setNewsTitlePs] = useState('');
  const [newsDescPs, setNewsDescPs] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsDescEn, setNewsDescEn] = useState('');

  const [editingNews, setEditingNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transLoading, setTransLoading] = useState(null);

  const resetForm = () => {
    setNewsTitle(''); setNewsDesc(''); setNewsImage('');
    setNewsTitlePs(''); setNewsDescPs('');
    setNewsTitleEn(''); setNewsDescEn('');
    setEditingNews(null); setLoading(false);
  };

  const handleSmartFill = async (lang) => {
      if(!newsTitle) return; // اگر showAlert دارید می‌توانید اینجا خطا دهید
      setTransLoading(lang);
      
      const tTitle = await fetchTranslation(newsTitle, lang);
      const tDesc = newsDesc ? await fetchTranslation(newsDesc, lang) : '';
      
      if(lang === 'ps') { setNewsTitlePs(tTitle); setNewsDescPs(tDesc); }
      if(lang === 'en') { setNewsTitleEn(tTitle); setNewsDescEn(tDesc); }
      
      setTransLoading(null);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    if (!newsTitle || !newsDesc) return;
    setLoading(true);

    const newsData = {
      title: newsTitle, description: newsDesc,
      title_ps: newsTitlePs, description_ps: newsDescPs,
      title_en: newsTitleEn, description_en: newsDescEn,
      image_url: newsImage,
      pinned: false 
    };

    if (editingNews) {
       await supabase.from('news').update(newsData).eq('id', editingNews.id);
    } else {
       await supabase.from('news').insert([newsData]);
    }
    
    // نمایش پیام موفقیت با آلرت جدید
    if (showAlert) {
        showAlert({
            title: "موفق",
            message: editingNews ? "خبر با موفقیت ویرایش شد" : "خبر جدید با موفقیت منتشر شد",
            type: "success"
        });
    }

    resetForm();
    if(onUpdate) onUpdate();
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setNewsTitle(item.title); setNewsDesc(item.description);
    setNewsTitlePs(item.title_ps || ''); setNewsDescPs(item.description_ps || '');
    setNewsTitleEn(item.title_en || ''); setNewsDescEn(item.description_en || '');
    setNewsImage(item.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const performDelete = async () => {
        await supabase.from('news').delete().eq('id', id);
        if(onUpdate) onUpdate();
    };

    if (showAlert) {
        showAlert({
            title: "حذف خبر",
            message: "آیا از حذف این خبر مطمئن هستید؟",
            type: "danger",
            showCancel: true,
            confirmText: "بله، حذف کن",
            onConfirm: performDelete
        });
    } else if (window.confirm('حذف شود؟')) {
        performDelete();
    }
  };

  const handleTogglePin = async (id, currentStatus) => {
    await supabase.from('news').update({ pinned: !currentStatus }).eq('id', id);
    if(onUpdate) onUpdate();
  };

  return (
    <div className="space-y-8 animate-in fade-in">
       <h2 className="text-2xl font-black text-gray-800">مدیریت اخبار</h2>

       {/* فرم */}
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
         <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
           {editingNews ? <Edit size={20} className="text-blue-500"/> : <Plus size={20} className="text-green-500"/>}
           {editingNews ? 'ویرایش خبر' : 'افزودن خبر جدید'}
         </h3>
         <form onSubmit={handleAddNews} className="space-y-4">
           {/* ... (کد فرم بدون تغییر) ... */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 border-l pl-2">
                  <span className="text-xs font-bold text-blue-600">فارسی</span>
                  <input value={newsTitle} onChange={e => setNewsTitle(e.target.value)} placeholder="عنوان" className="input-admin"/>
                  <textarea value={newsDesc} onChange={e => setNewsDesc(e.target.value)} placeholder="متن" className="input-admin h-24"/>
              </div>
              <div className="space-y-2 border-l pl-2">
                  <div className="flex justify-between"><span className="text-xs font-bold text-green-600">پشتو</span><button type="button" onClick={()=>handleSmartFill('ps')} className="text-[9px] bg-green-100 px-2 rounded">{transLoading === 'ps' ? '...' : 'ترجمه'}</button></div>
                  <input value={newsTitlePs} onChange={e => setNewsTitlePs(e.target.value)} placeholder="عنوان" className="input-admin"/>
                  <textarea value={newsDescPs} onChange={e => setNewsDescPs(e.target.value)} placeholder="متن" className="input-admin h-24"/>
              </div>
              <div className="space-y-2" dir="ltr">
                  <div className="flex justify-between"><span className="text-xs font-bold text-orange-600">English</span><button type="button" onClick={()=>handleSmartFill('en')} className="text-[9px] bg-orange-100 px-2 rounded">{transLoading === 'en' ? '...' : 'Translate'}</button></div>
                  <input value={newsTitleEn} onChange={e => setNewsTitleEn(e.target.value)} placeholder="Title" className="input-admin"/>
                  <textarea value={newsDescEn} onChange={e => setNewsDescEn(e.target.value)} placeholder="Description" className="input-admin h-24"/>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
               <Image size={20} className="text-gray-400"/>
               <input value={newsImage} onChange={e => setNewsImage(e.target.value)} placeholder="لینک تصویر" className="input-admin ltr"/>
           </div>

           <div className="flex gap-2 justify-end">
              {editingNews && <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold">انصراف</button>}
              <button disabled={loading} className="px-8 py-3 rounded-xl bg-[#058B8C] text-white font-bold flex items-center gap-2 hover:bg-[#047070]">
                {loading ? <Loader2 className="animate-spin"/> : (editingNews ? 'بروزرسانی' : 'انتشار')}
              </button>
           </div>
         </form>
       </div>

       {/* لیست */}
       <div className="space-y-3">
         {news?.map(n => (
           <div key={n.id} className={`bg-white p-4 rounded-2xl border flex items-center gap-4 ${n.pinned ? 'border-yellow-400 bg-yellow-50/30' : 'border-gray-50'}`}>
              <img src={n.image_url} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1">
                <h3 className="font-bold text-sm">{n.title}</h3>
                <div className="text-[10px] text-gray-400 flex gap-2 mt-1">
                    {n.title_ps && <span className="bg-green-50 text-green-600 px-1 rounded">PS</span>}
                    {n.title_en && <span className="bg-orange-50 text-orange-600 px-1 rounded">EN</span>}
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={()=>handleTogglePin(n.id, n.pinned)}><Pin size={18} className={n.pinned ? "text-yellow-500" : "text-gray-400"}/></button>
                <button onClick={()=>handleEdit(n)}><Edit size={18} className="text-blue-500"/></button>
                <button onClick={()=>handleDelete(n.id)}><Trash size={18} className="text-red-500"/></button>
               </div>
           </div>
         ))}
       </div>
    </div>
  );
}