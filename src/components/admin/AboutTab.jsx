import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, User, Sparkles, Loader2, Edit3, Copy, GripVertical, Check, Save, Shield, Globe, Users, Award, Target, Eye, Clock, CheckCircle, Briefcase, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function AboutTab({ settings, team, clients, onBatchUpdate, fetchTranslation }) {
  const [localAbout, setLocalAbout] = useState({});
  const [localWhyUs, setLocalWhyUs] = useState([]);
  const [localTeam, setLocalTeam] = useState([]);
  const [localActivities, setLocalActivities] = useState([]);
  const [localClients, setLocalClients] = useState([]);
  
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingWhyUsId, setEditingWhyUsId] = useState(null);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  const [loadingField, setLoadingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const teamDragItem = useRef(null);
  const teamDragOverItem = useRef(null);
  const clientDragItem = useRef(null);
  const clientDragOverItem = useRef(null);

  useEffect(() => {
    setLocalAbout(settings?.about || {});
    setLocalWhyUs(settings?.why_us || []);
    setLocalTeam(team || []);
    setLocalClients(clients || settings?.clients || []);
    
    const defaultActs = [
      { id: 1, title_dr: 'سفر و پرواز', desc_dr: 'رزرو آنلاین بلیط پروازهای داخلی و خارجی', title_ps: '', desc_ps: '', title_en: '', desc_en: '', image: '', link: '/' },
      { id: 2, title_dr: 'خدمات پرداخت', desc_dr: 'پرداخت‌های ارزی و بین‌المللی', title_ps: '', desc_ps: '', title_en: '', desc_en: '', image: '', link: '/' },
      { id: 3, title_dr: 'کارگو و باربری', desc_dr: 'ارسال و دریافت سریع بار', title_ps: '', desc_ps: '', title_en: '', desc_en: '', image: '', link: '/' },
      { id: 4, title_dr: 'فروشگاه آنلاین', desc_dr: 'خرید تجهیزات سفر و ملزومات', title_ps: '', desc_ps: '', title_en: '', desc_en: '', image: '', link: '/' }
    ];
    setLocalActivities(settings?.activities && settings.activities.length > 0 ? settings.activities : defaultActs);
  }, [settings, team, clients]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updates = [
        { section: 'about', field: null, value: localAbout },
        { section: 'why_us', field: null, value: localWhyUs },
        { section: 'team', field: null, value: localTeam },
        { section: 'activities', field: null, value: localActivities },
        { section: 'clients', field: null, value: localClients }
    ];
    await onBatchUpdate(updates);
    setIsSaving(false);
  };

  const handleSmartTranslate = async (text, lang, key, section) => {
    if (!text) return alert('لطفاً ابتدا متن را وارد کنید.');
    setLoadingField(`${section}_${key}_${lang}`);
    try {
        const t = await fetchTranslation(text, lang);
        if (t) {
            if (section === 'about') setLocalAbout(prev => ({ ...prev, [key]: t }));
            else if (section === 'editForm') setEditForm(prev => ({ ...prev, [key]: t }));
        }
    } catch (e) { console.error(e); }
    setLoadingField(null);
  };

  const handleAboutChange = (key, value) => setLocalAbout(prev => ({ ...prev, [key]: value }));

  // ========================================
  // درگ اند دراپ
  // ========================================
  const handleDragStart = (e, position) => { teamDragItem.current = position; };
  const handleTeamSort = () => {
      if(teamDragItem.current === null || teamDragOverItem.current === null) return;
      const _team = [...localTeam];
      const item = _team[teamDragItem.current];
      _team.splice(teamDragItem.current, 1);
      _team.splice(teamDragOverItem.current, 0, item);
      teamDragItem.current = null;
      teamDragOverItem.current = null;
      setLocalTeam(_team);
  };

  const handleClientDragStart = (e, position) => { clientDragItem.current = position; };
  const handleClientSort = () => {
      if(clientDragItem.current === null || clientDragOverItem.current === null) return;
      const _clients = [...localClients];
      const item = _clients[clientDragItem.current];
      _clients.splice(clientDragItem.current, 1);
      _clients.splice(clientDragOverItem.current, 0, item);
      clientDragItem.current = null;
      clientDragOverItem.current = null;
      setLocalClients(_clients);
  };

  // ========================================
  // عملیات‌های لوکال
  // ========================================
  const handleEditTeam = (member) => { setEditForm({ ...member }); setEditingTeamId(member.id); };
  const handleSaveTeam = () => { setLocalTeam(localTeam.map(m => m.id === editingTeamId ? editForm : m)); setEditingTeamId(null); };
  const handleDeleteTeam = (id) => { if (window.confirm('حذف شود؟')) setLocalTeam(localTeam.filter(m => m.id !== id)); };
  const handleAddTeam = () => {
    const newMem = { id: Date.now(), name: 'عضو جدید', role_dr: '', image: '' };
    setLocalTeam([...localTeam, newMem]);
    setEditForm(newMem);
    setEditingTeamId(newMem.id);
  };

  const handleEditWhyUs = (item) => { setEditForm({ ...item }); setEditingWhyUsId(item.id); };
  const handleSaveWhyUs = () => { setLocalWhyUs(localWhyUs.map(m => m.id === editingWhyUsId ? editForm : m)); setEditingWhyUsId(null); };
  const handleDeleteWhyUs = (id) => { if (window.confirm('ویژگی حذف شود؟')) setLocalWhyUs(localWhyUs.filter(m => m.id !== id)); };
  const handleAddWhyUs = () => {
    const newItem = { id: Date.now(), title_dr: 'ویژگی جدید', desc_dr: '', title_ps: '', desc_ps: '', title_en: '', desc_en: '', icon: 'Shield' };
    setLocalWhyUs([...localWhyUs, newItem]);
    setEditForm(newItem);
    setEditingWhyUsId(newItem.id);
  };

  const handleEditActivity = (item) => { setEditForm({ ...item }); setEditingActivityId(item.id); };
  const handleSaveActivity = () => { setLocalActivities(localActivities.map(m => m.id === editingActivityId ? editForm : m)); setEditingActivityId(null); };
  const handleDeleteActivity = (id) => { if (window.confirm('عرصه فعالیت حذف شود؟')) setLocalActivities(localActivities.filter(m => m.id !== id)); };
  const handleAddActivity = () => {
    const newItem = { id: Date.now(), title_dr: 'بخش جدید', desc_dr: '', title_ps: '', desc_ps: '', title_en: '', desc_en: '', image: '', link: '/' };
    setLocalActivities([...localActivities, newItem]);
    setEditForm(newItem);
    setEditingActivityId(newItem.id);
  };

  // عملیات مشتریان (۳ زبانه)
  const handleEditClient = (client) => { setEditForm({ ...client }); setEditingClientId(client.id); };
  const handleSaveClient = () => { setLocalClients(localClients.map(c => c.id === editingClientId ? editForm : c)); setEditingClientId(null); };
  const handleDeleteClient = (id) => { if (window.confirm('مشتری حذف شود؟')) setLocalClients(localClients.filter(c => c.id !== id)); };
  const handleAddClient = () => {
    const newClient = { id: Date.now(), name_dr: 'شرکت همکار', name_ps: '', name_en: '', logo: '', url: '' };
    setLocalClients([...localClients, newClient]);
    setEditForm(newClient);
    setEditingClientId(newClient.id);
  };

  const copyToClipboard = (text) => {
      if(!text) return;
      navigator.clipboard.writeText(text);
      alert('کپی شد!');
  };

  const AVAILABLE_ICONS = ['Shield', 'Globe', 'Users', 'Award', 'Target', 'Eye', 'Clock', 'CheckCircle'];

  return (
    <div className="space-y-12 w-full animate-in fade-in pb-24" dir="rtl">
       <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-800">محتوای صفحه درباره ما</h2>
       </div>

       {/* 1. معرفی شرکت، ماموریت و چشم‌انداز */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-10 w-full">
           
           <div className="space-y-4">
               <h3 className="font-bold text-gray-400 border-b pb-2">۱. معرفی اصلی شرکت</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-3">
                       <div className="flex justify-between items-center h-[26px]">
                           <label className="text-[10px] font-bold text-blue-600">دری (فارسی)</label>
                       </div>
                       <input value={localAbout.title_dr || ''} onChange={e => handleAboutChange('title_dr', e.target.value)} placeholder="عنوان" className="input-admin" />
                       <textarea rows={4} value={localAbout.desc_dr || ''} onChange={e => handleAboutChange('desc_dr', e.target.value)} placeholder="توضیحات کامل..." className="input-admin" />
                   </div>
                   <div className="space-y-3 border-l border-r border-gray-100 px-4">
                       <div className="flex justify-between items-center h-[26px]">
                           <label className="text-[10px] font-bold text-green-600">پشتو</label>
                           <div className="flex gap-1">
                               <button onClick={()=>handleSmartTranslate(localAbout.title_dr, 'ps', 'title_ps', 'about')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded">{loadingField === 'about_title_ps_ps' ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه عنوان'}</button>
                               <button onClick={()=>handleSmartTranslate(localAbout.desc_dr, 'ps', 'desc_ps', 'about')} className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded">{loadingField === 'about_desc_ps_ps' ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه متن'}</button>
                           </div>
                       </div>
                       <input value={localAbout.title_ps || ''} onChange={e => handleAboutChange('title_ps', e.target.value)} className="input-admin text-right" />
                       <textarea rows={4} value={localAbout.desc_ps || ''} onChange={e => handleAboutChange('desc_ps', e.target.value)} className="input-admin text-right" />
                   </div>
                   <div className="space-y-3" dir="ltr">
                       <div className="flex justify-between items-center h-[26px]" dir="rtl">
                           <label className="text-[10px] font-bold text-orange-600">English</label>
                           <div className="flex gap-1">
                               <button onClick={()=>handleSmartTranslate(localAbout.title_dr, 'en', 'title_en', 'about')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded">T-Title</button>
                               <button onClick={()=>handleSmartTranslate(localAbout.desc_dr, 'en', 'desc_en', 'about')} className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded">T-Desc</button>
                           </div>
                       </div>
                       <input value={localAbout.title_en || ''} onChange={e => handleAboutChange('title_en', e.target.value)} className="input-admin ltr" />
                       <textarea rows={4} value={localAbout.desc_en || ''} onChange={e => handleAboutChange('desc_en', e.target.value)} className="input-admin ltr" />
                   </div>
               </div>
               <div className="pt-2">
                   <label className="text-xs font-bold text-gray-500">تصویر اصلی درباره ما (لینک)</label>
                   <input value={localAbout.image || ''} onChange={e => handleAboutChange('image', e.target.value)} placeholder="https://..." className="input-admin ltr mt-1"/>
               </div>
           </div>

           {/* ماموریت و چشم انداز */}
           <div className="space-y-4 pt-6 border-t border-gray-100">
               <h3 className="font-bold text-gray-400 border-b pb-2">۲. ماموریت و چشم‌انداز (Mission & Vision)</h3>
               
               <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-50 space-y-4">
                   <h4 className="font-black text-sm text-blue-800">ماموریت ما</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                           <div className="flex justify-between items-center h-[26px] mb-1">
                               <label className="text-[10px] text-gray-500">دری</label>
                           </div>
                           <input value={localAbout.mission_title_dr || ''} onChange={e => handleAboutChange('mission_title_dr', e.target.value)} className="input-admin mb-2" placeholder="عنوان ماموریت"/>
                           <textarea value={localAbout.mission_desc_dr || ''} onChange={e => handleAboutChange('mission_desc_dr', e.target.value)} className="input-admin text-xs" rows={2} placeholder="متن ماموریت"/>
                       </div>
                       <div>
                           <div className="flex justify-between items-center h-[26px] mb-1">
                               <label className="text-[10px] text-gray-500">پشتو</label>
                               <button onClick={()=>{handleSmartTranslate(localAbout.mission_title_dr,'ps','mission_title_ps','about');handleSmartTranslate(localAbout.mission_desc_dr,'ps','mission_desc_ps','about')}} className="text-[9px] text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold">ترجمه هردو</button>
                           </div>
                           <input value={localAbout.mission_title_ps || ''} onChange={e => handleAboutChange('mission_title_ps', e.target.value)} className="input-admin mb-2 text-right"/>
                           <textarea value={localAbout.mission_desc_ps || ''} onChange={e => handleAboutChange('mission_desc_ps', e.target.value)} className="input-admin text-xs text-right" rows={2}/>
                       </div>
                       <div dir="ltr">
                           <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                               <label className="text-[10px] text-gray-500">English</label>
                               <button onClick={()=>{handleSmartTranslate(localAbout.mission_title_dr,'en','mission_title_en','about');handleSmartTranslate(localAbout.mission_desc_dr,'en','mission_desc_en','about')}} className="text-[9px] text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold">Translate</button>
                           </div>
                           <input value={localAbout.mission_title_en || ''} onChange={e => handleAboutChange('mission_title_en', e.target.value)} className="input-admin mb-2 ltr"/>
                           <textarea value={localAbout.mission_desc_en || ''} onChange={e => handleAboutChange('mission_desc_en', e.target.value)} className="input-admin text-xs ltr" rows={2}/>
                       </div>
                   </div>
               </div>

               <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-50 space-y-4">
                   <h4 className="font-black text-sm text-orange-800">چشم‌انداز ما</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                           <div className="flex justify-between items-center h-[26px] mb-1">
                               <label className="text-[10px] text-gray-500">دری</label>
                           </div>
                           <input value={localAbout.vision_title_dr || ''} onChange={e => handleAboutChange('vision_title_dr', e.target.value)} className="input-admin mb-2" placeholder="عنوان چشم‌انداز"/>
                           <textarea value={localAbout.vision_desc_dr || ''} onChange={e => handleAboutChange('vision_desc_dr', e.target.value)} className="input-admin text-xs" rows={2} placeholder="متن چشم‌انداز"/>
                       </div>
                       <div>
                           <div className="flex justify-between items-center h-[26px] mb-1">
                               <label className="text-[10px] text-gray-500">پشتو</label>
                               <button onClick={()=>{handleSmartTranslate(localAbout.vision_title_dr,'ps','vision_title_ps','about');handleSmartTranslate(localAbout.vision_desc_dr,'ps','vision_desc_ps','about')}} className="text-[9px] text-orange-600 bg-orange-100 px-2 py-1 rounded font-bold">ترجمه هردو</button>
                           </div>
                           <input value={localAbout.vision_title_ps || ''} onChange={e => handleAboutChange('vision_title_ps', e.target.value)} className="input-admin mb-2 text-right"/>
                           <textarea value={localAbout.vision_desc_ps || ''} onChange={e => handleAboutChange('vision_desc_ps', e.target.value)} className="input-admin text-xs text-right" rows={2}/>
                       </div>
                       <div dir="ltr">
                           <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                               <label className="text-[10px] text-gray-500">English</label>
                               <button onClick={()=>{handleSmartTranslate(localAbout.vision_title_dr,'en','vision_title_en','about');handleSmartTranslate(localAbout.vision_desc_dr,'en','vision_desc_en','about')}} className="text-[9px] text-orange-600 bg-orange-100 px-2 py-1 rounded font-bold">Translate</button>
                           </div>
                           <input value={localAbout.vision_title_en || ''} onChange={e => handleAboutChange('vision_title_en', e.target.value)} className="input-admin mb-2 ltr"/>
                           <textarea value={localAbout.vision_desc_en || ''} onChange={e => handleAboutChange('vision_desc_en', e.target.value)} className="input-admin text-xs ltr" rows={2}/>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* 2. عرصه‌های فعالیت */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 w-full">
           <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-black text-gray-800">۳. عرصه‌های فعالیت شرکت (۴ بخش)</h2>
              <button onClick={handleAddActivity} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200">
                  <Plus size={16} /> افزودن عرصه جدید
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {localActivities.map(item => (
                 <div key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    {editingActivityId === item.id ? (
                        <div className="p-6 bg-gray-50 space-y-4">
                            <div className="flex justify-between items-center mb-2 pb-4 border-b border-gray-200">
                               <span className="font-bold text-sm text-[#058B8C]">ویرایش عرصه فعالیت</span>
                               <button onClick={handleSaveActivity} type="button" className="text-sm bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-green-600 transition"><Check size={16}/> تایید موقت</button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">دری</label></div>
                                    <input value={editForm.title_dr || ''} onChange={e => setEditForm({...editForm, title_dr: e.target.value})} placeholder="عنوان (دری)" className="input-admin mb-2"/>
                                    <textarea value={editForm.desc_dr || ''} onChange={e => setEditForm({...editForm, desc_dr: e.target.value})} placeholder="توضیح کوتاه (دری)" className="input-admin mb-2 text-xs" rows={2}/>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center h-[26px] mb-1">
                                        <label className="text-[10px] font-bold text-green-600">پشتو</label>
                                        <button onClick={()=>{handleSmartTranslate(editForm.title_dr,'ps','title_ps','editForm');handleSmartTranslate(editForm.desc_dr,'ps','desc_ps','editForm')}} type="button" className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded">ترجمه هردو</button>
                                    </div>
                                    <input value={editForm.title_ps || ''} onChange={e => setEditForm({...editForm, title_ps: e.target.value})} placeholder="عنوان (پشتو)" className="input-admin mb-2 text-right"/>
                                    <textarea value={editForm.desc_ps || ''} onChange={e => setEditForm({...editForm, desc_ps: e.target.value})} placeholder="توضیح (پشتو)" className="input-admin mb-2 text-xs text-right" rows={2}/>
                                </div>
                                <div dir="ltr">
                                    <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                                        <label className="text-[10px] font-bold text-orange-600">English</label>
                                        <button onClick={()=>{handleSmartTranslate(editForm.title_dr,'en','title_en','editForm');handleSmartTranslate(editForm.desc_dr,'en','desc_en','editForm')}} type="button" className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded">Translate</button>
                                    </div>
                                    <input value={editForm.title_en || ''} onChange={e => setEditForm({...editForm, title_en: e.target.value})} placeholder="Title (EN)" className="input-admin mb-2 ltr"/>
                                    <textarea value={editForm.desc_en || ''} onChange={e => setEditForm({...editForm, desc_en: e.target.value})} placeholder="Description (EN)" className="input-admin mb-2 text-xs ltr" rows={2}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div><label className="text-[10px] text-gray-500 mb-1 block">لینک تصویر</label><input value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} placeholder="https://..." className="input-admin ltr"/></div>
                                <div><label className="text-[10px] text-gray-500 mb-1 block">لینک دکمه هدایت</label><input value={editForm.link || ''} onChange={e => setEditForm({...editForm, link: e.target.value})} placeholder="مثلاً: /tickets" className="input-admin ltr"/></div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 flex items-center justify-between bg-white hover:bg-gray-50 md:w-1/2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 border border-gray-300">
                                   {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <Briefcase className="w-full h-full p-3 text-gray-400"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{item.title_dr}</h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc_dr}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleEditActivity(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                                <button onClick={() => handleDeleteActivity(item.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    )}
                 </div>
              ))}
           </div>
       </div>

       {/* 3. ویژگی‌ها (چرا ما) */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 w-full">
           <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-black text-gray-800">۴. ویژگی‌ها (چرا ما را انتخاب کنید؟)</h2>
              <button onClick={handleAddWhyUs} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200">
                  <Plus size={16} /> افزودن ویژگی
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {localWhyUs.map(item => (
                 <div key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    {editingWhyUsId === item.id ? (
                        <div className="p-6 bg-gray-50 space-y-4">
                            <div className="flex justify-between items-center mb-2 pb-4 border-b border-gray-200">
                               <span className="font-bold text-sm text-[#058B8C]">ویرایش ویژگی</span>
                               <button onClick={handleSaveWhyUs} type="button" className="text-sm bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-green-600 transition"><Check size={16}/> تایید موقت</button>
                            </div>
                            
                            <div className="mb-4">
                                <label className="text-[10px] text-gray-500 block mb-1">انتخاب آیکون</label>
                                <select value={editForm.icon || 'Shield'} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="input-admin w-1/4">
                                   {AVAILABLE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="flex justify-between items-center h-[26px] mb-1"><label className="text-[10px] font-bold text-blue-600">دری</label></div>
                                    <input value={editForm.title_dr || ''} onChange={e => setEditForm({...editForm, title_dr: e.target.value})} placeholder="عنوان (دری)" className="input-admin mb-2"/>
                                    <textarea value={editForm.desc_dr || ''} onChange={e => setEditForm({...editForm, desc_dr: e.target.value})} placeholder="توضیح کوتاه (دری)" className="input-admin mb-2 text-xs" rows={2}/>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center h-[26px] mb-1">
                                        <label className="text-[10px] font-bold text-green-600">پشتو</label>
                                        <button onClick={()=>{handleSmartTranslate(editForm.title_dr,'ps','title_ps','editForm');handleSmartTranslate(editForm.desc_dr,'ps','desc_ps','editForm')}} type="button" className="text-[9px] bg-green-100 text-green-700 px-2 py-1 rounded">ترجمه هردو</button>
                                    </div>
                                    <input value={editForm.title_ps || ''} onChange={e => setEditForm({...editForm, title_ps: e.target.value})} placeholder="عنوان (پشتو)" className="input-admin mb-2 text-right"/>
                                    <textarea value={editForm.desc_ps || ''} onChange={e => setEditForm({...editForm, desc_ps: e.target.value})} placeholder="توضیح (پشتو)" className="input-admin mb-2 text-xs text-right" rows={2}/>
                                </div>
                                <div dir="ltr">
                                    <div className="flex justify-between items-center h-[26px] mb-1" dir="rtl">
                                        <label className="text-[10px] font-bold text-orange-600">English</label>
                                        <button onClick={()=>{handleSmartTranslate(editForm.title_dr,'en','title_en','editForm');handleSmartTranslate(editForm.desc_dr,'en','desc_en','editForm')}} type="button" className="text-[9px] bg-orange-100 text-orange-700 px-2 py-1 rounded">Translate</button>
                                    </div>
                                    <input value={editForm.title_en || ''} onChange={e => setEditForm({...editForm, title_en: e.target.value})} placeholder="Title (EN)" className="input-admin mb-2 ltr"/>
                                    <textarea value={editForm.desc_en || ''} onChange={e => setEditForm({...editForm, desc_en: e.target.value})} placeholder="Description (EN)" className="input-admin mb-2 text-xs ltr" rows={2}/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 flex items-center justify-between bg-white hover:bg-gray-50 md:w-1/2">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{item.title_dr}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc_dr}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEditWhyUs(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                                <button onClick={() => handleDeleteWhyUs(item.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    )}
                 </div>
              ))}
           </div>
       </div>

       {/* 4. بخش تیم */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 w-full">
          <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-black text-gray-800">۵. مدیریت اعضای تیم</h2>
              <button onClick={handleAddTeam} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200">
                  <Plus size={16} /> افزودن عضو
              </button>
          </div>

          <div className="space-y-3">
             {localTeam.map((member, index) => (
                <div 
                    key={member.id} 
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
                    draggable 
                    onDragStart={(e) => handleDragStart(e, index)} 
                    onDragEnter={(e) => teamDragOverItem.current = index} 
                    onDragEnd={handleTeamSort} 
                    onDragOver={(e) => e.preventDefault()}
                >
                    {editingTeamId === member.id ? (
                        <div className="p-5 bg-blue-50/30">
                            <div className="flex justify-between mb-4 border-b pb-2">
                                <span className="text-sm font-black text-blue-600">ویرایش عضو تیم</span>
                                <button onClick={handleSaveTeam} type="button" className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600"><Check size={14}/> تایید موقت</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] text-gray-500">نام (فارسی/پشتو)</label><input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input-admin"/></div>
                                <div dir="ltr"><label className="text-[10px] text-gray-500 text-right w-full block">Name (EN)</label><input value={editForm.name_en || ''} onChange={e => setEditForm({...editForm, name_en: e.target.value})} className="input-admin ltr"/></div>
                                
                                <div><label className="text-[10px] text-gray-500">سمت (دری)</label><input value={editForm.role_dr || ''} onChange={e => setEditForm({...editForm, role_dr: e.target.value})} className="input-admin"/></div>
                                <div>
                                   <div className="flex justify-between items-center h-[24px]"><label className="text-[10px] text-gray-500">سمت (پشتو)</label><button onClick={()=>handleSmartTranslate(editForm.role_dr,'ps','role_ps','editForm')} type="button" className="text-[9px] text-blue-600">ترجمه</button></div>
                                   <input value={editForm.role_ps || ''} onChange={e => setEditForm({...editForm, role_ps: e.target.value})} className="input-admin text-right"/>
                                </div>
                                <div className="col-span-2" dir="ltr">
                                   <div className="flex justify-between items-center h-[24px]" dir="rtl"><label className="text-[10px] text-gray-500">Role (EN)</label><button onClick={()=>handleSmartTranslate(editForm.role_dr,'en','role_en','editForm')} type="button" className="text-[9px] text-blue-600">Translate</button></div>
                                   <input value={editForm.role_en || ''} onChange={e => setEditForm({...editForm, role_en: e.target.value})} className="input-admin ltr"/>
                                </div>
                                
                                <div className="col-span-2"><label className="text-[10px] text-gray-500">لینک عکس</label><input value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} className="input-admin ltr text-blue-600"/></div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="cursor-grab text-gray-300 p-2 hover:bg-gray-100 rounded-lg transition" onMouseDown={(e)=> teamDragItem.current = index}><GripVertical size={20}/></div>
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                   {member.image ? <img src={member.image} className="w-full h-full object-cover"/> : <User className="w-full h-full p-3 text-gray-400"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{member.name || member.name_dr}</h4>
                                    <div className="text-[10px] font-bold text-gray-500 mt-0.5">{member.role_dr} {member.role_en && `| ${member.role_en}`}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => copyToClipboard(JSON.stringify(member))} className="p-2 text-gray-400 hover:text-gray-600"><Copy size={16}/></button>
                                <button onClick={() => handleEditTeam(member)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit3 size={16}/></button>
                                <button onClick={() => handleDeleteTeam(member.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    )}
                </div>
             ))}
          </div>
       </div>

       {/* 5. مدیریت مشتریان (تبدیل به ۳ زبانه کامل) */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 w-full">
          <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-black text-gray-800">۶. مدیریت مشتریان و همکاران</h2>
              <button onClick={handleAddClient} className="bg-teal-50 text-[#058B8C] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#058B8C] hover:text-white transition">
                  <Plus size={16} /> افزودن مشتری
              </button>
          </div>

          <div className="space-y-3">
             {localClients.map((client, index) => (
                <div 
                    key={client.id} 
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
                    draggable 
                    onDragStart={(e) => handleClientDragStart(e, index)} 
                    onDragEnter={(e) => clientDragOverItem.current = index} 
                    onDragEnd={handleClientSort} 
                    onDragOver={(e) => e.preventDefault()}
                >
                    {editingClientId === client.id ? (
                        <div className="p-5 bg-teal-50/30">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <span className="text-sm font-black text-[#058B8C]">ویرایش اطلاعات مشتری</span>
                                <button onClick={handleSaveClient} type="button" className="text-xs bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-green-600"><Check size={14}/> تایید موقت</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                <div>
                                   <label className="text-[10px] font-black text-blue-600 block mb-1">نام مشتری (دری)</label>
                                   <input value={editForm.name_dr || editForm.name || ''} onChange={e => setEditForm({...editForm, name_dr: e.target.value, name: e.target.value})} className="input-admin font-bold text-gray-800" />
                                </div>
                                <div>
                                   <div className="flex justify-between items-center mb-1">
                                       <label className="text-[10px] font-black text-green-600">پشتو</label>
                                       <button onClick={()=>handleSmartTranslate(editForm.name_dr || editForm.name,'ps','name_ps','editForm')} type="button" className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold hover:bg-green-100">ترجمه خودکار</button>
                                   </div>
                                   <input value={editForm.name_ps || ''} onChange={e => setEditForm({...editForm, name_ps: e.target.value})} className="input-admin font-bold text-gray-800 text-right" />
                                </div>
                                <div dir="ltr">
                                   <div className="flex justify-between items-center mb-1" dir="rtl">
                                       <label className="text-[10px] font-black text-orange-600">English</label>
                                       <button onClick={()=>handleSmartTranslate(editForm.name_dr || editForm.name,'en','name_en','editForm')} type="button" className="text-[9px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold hover:bg-orange-100">Auto Translate</button>
                                   </div>
                                   <input value={editForm.name_en || ''} onChange={e => setEditForm({...editForm, name_en: e.target.value})} className="input-admin font-bold text-gray-800 ltr" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500">لینک لوگو</label>
                                    <input value={editForm.logo || ''} onChange={e => setEditForm({...editForm, logo: e.target.value})} placeholder="https://..." className="input-admin ltr text-xs text-blue-600" dir="ltr" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-500">لینک وب‌سایت (اختیاری)</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LinkIcon size={14}/></div>
                                        <input value={editForm.url || ''} onChange={e => setEditForm({...editForm, url: e.target.value})} placeholder="https://..." className="input-admin ltr text-xs pl-8 text-green-600" dir="ltr" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="cursor-grab text-gray-300 p-2 hover:bg-gray-100 rounded-lg transition" onMouseDown={(e)=> clientDragItem.current = index}><GripVertical size={20}/></div>
                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 p-1">
                                   {client.logo ? <img src={client.logo} className="w-full h-full object-contain"/> : <ImageIcon className="w-6 h-6 text-gray-300"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{client.name_dr || client.name}</h4>
                                    {client.url && <div className="text-[10px] font-bold text-green-500 mt-0.5">{client.url}</div>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => copyToClipboard(JSON.stringify(client))} className="p-2 text-gray-400 hover:text-gray-600"><Copy size={16}/></button>
                                <button onClick={() => handleEditClient(client)} className="p-2 bg-teal-50 text-[#058B8C] rounded-lg hover:bg-teal-100"><Edit3 size={16}/></button>
                                <button onClick={() => handleDeleteClient(client.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    )}
                </div>
             ))}
             {localClients.length === 0 && (
                <div className="text-center py-6 text-sm font-bold text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    هیچ مشتری‌ای ثبت نشده است
                </div>
             )}
          </div>
       </div>

       {/* نوار چسبان ذخیره نهایی به دیتابیس */}
       <div className="fixed bottom-0 left-0 right-0 lg:right-72 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40 flex justify-end px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <button onClick={handleSaveAll} disabled={isSaving} type="button" className="w-full md:w-auto bg-[#058B8C] text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 hover:bg-[#047070] active:scale-95 transition-all disabled:opacity-70">
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                {isSaving ? 'در حال ارتباط با دیتابیس...' : 'ذخیره تمام تنظیمات در دیتابیس'}
            </button>
        </div>
    </div>
  );
}