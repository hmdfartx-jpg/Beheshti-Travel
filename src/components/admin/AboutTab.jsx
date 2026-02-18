import React, { useState, useRef } from 'react';
import { Plus, Trash, User, Sparkles, Loader2, Image, Edit, Copy, GripVertical, Check, X } from 'lucide-react';

export default function AboutTab({ settings, team, onUpdate, onTeamAdd, onTeamChange, onTeamDelete, onTeamListUpdate, fetchTranslation }) {
  const [loading, setLoading] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const dragItem = useRef();
  const dragOverItem = useRef();

  const translateAbout = async (lang) => {
      const title = settings.about?.title_dr;
      if(!title) return;
      setLoading('about_'+lang);
      const tTitle = await fetchTranslation(title, lang);
      const tDesc = await fetchTranslation(settings.about?.desc_dr, lang);
      onUpdate('about', `title_${lang}`, tTitle);
      onUpdate('about', `desc_${lang}`, tDesc);
      setLoading(null);
  };

  const handleEditClick = (member) => {
      setEditForm({...member});
      setEditingId(member.id);
  };

  const handleSaveMember = () => {
      const updatedList = team.map(m => m.id === editingId ? editForm : m);
      onTeamListUpdate(updatedList);
      setEditingId(null);
  };

  const handleDeleteMember = (id) => {
      if(window.confirm('حذف شود؟')) onTeamDelete(id);
  };

  const handleDuplicateMember = (member) => {
      const newMember = { ...member, id: Date.now(), name: `${member.name} (کپی)` };
      onTeamListUpdate([...team, newMember]);
  };

  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
  const handleSort = () => {
      const _team = [...team];
      const item = _team[dragItem.current];
      _team.splice(dragItem.current, 1);
      _team.splice(dragOverItem.current, 0, item);
      dragItem.current = null;
      dragOverItem.current = null;
      onTeamListUpdate(_team);
  };

  const handleAddMemberLocal = () => {
      const newMem = { id: Date.now(), name: 'عضو جدید', role_dr: '', role_en: '', image: '' };
      onTeamListUpdate([...team, newMem]);
      setEditForm(newMem);
      setEditingId(newMem.id);
  };

  const handleMemberFormChange = (key, value) => {
      setEditForm(prev => ({ ...prev, [key]: value }));
  };

  const translateMemberRole = async (lang) => {
      if(!editForm.role_dr) return;
      setLoading(`role_${lang}`);
      const tRole = await fetchTranslation(editForm.role_dr, lang);
      handleMemberFormChange(`role_${lang}`, tRole);
      setLoading(null);
  };

  return (
    <div className="space-y-12 w-full animate-in fade-in">
       {/* بخش محتوا */}
       <div className="space-y-6 w-full">
          <h2 className="text-2xl font-black text-gray-800">محتوای صفحه درباره ما</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-6 w-full">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* دری */}
                 <div className="space-y-3 border-l pl-2">
                     <label className="text-[10px] font-bold text-blue-600 block">دری</label>
                     <input value={settings.about?.title_dr || ''} onChange={e => onUpdate('about', 'title_dr', e.target.value)} placeholder="عنوان" className="input-admin" />
                     <textarea rows={4} value={settings.about?.desc_dr || ''} onChange={e => onUpdate('about', 'desc_dr', e.target.value)} placeholder="توضیحات" className="input-admin" />
                 </div>
                 {/* پشتو */}
                 <div className="space-y-3 border-l pl-2">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-green-600 block">پشتو</label>
                        <button onClick={()=>translateAbout('ps')} className="text-[9px] bg-green-100 px-2 rounded">{loading === 'about_ps' ? <Loader2 size={10} className="animate-spin"/> : 'ترجمه'}</button>
                     </div>
                     <input value={settings.about?.title_ps || ''} onChange={e => onUpdate('about', 'title_ps', e.target.value)} placeholder="عنوان" className="input-admin" />
                     <textarea rows={4} value={settings.about?.desc_ps || ''} onChange={e => onUpdate('about', 'desc_ps', e.target.value)} placeholder="توضیحات" className="input-admin" />
                 </div>
                 {/* انگلیسی */}
                 <div className="space-y-3" dir="ltr">
                     <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-orange-600 block">English</label>
                        <button onClick={()=>translateAbout('en')} className="text-[9px] bg-orange-100 px-2 rounded">{loading === 'about_en' ? <Loader2 size={10} className="animate-spin"/> : 'Translate'}</button>
                     </div>
                     <input value={settings.about?.title_en || ''} onChange={e => onUpdate('about', 'title_en', e.target.value)} placeholder="Title" className="input-admin" />
                     <textarea rows={4} value={settings.about?.desc_en || ''} onChange={e => onUpdate('about', 'desc_en', e.target.value)} placeholder="Description" className="input-admin" />
                 </div>
             </div>
             
             <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
                 <label className="text-xs font-bold text-gray-400">تصویر درباره ما:</label>
                 <input value={settings.about?.image || ''} onChange={e => onUpdate('about', 'image', e.target.value)} placeholder="https://..." className="input-admin ltr flex-1"/>
             </div>
          </div>
       </div>

       {/* بخش تیم */}
       <div className="space-y-6 w-full border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-800">مدیریت اعضای تیم</h2>
              <button onClick={handleAddMemberLocal} className="bg-[#058B8C] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#047070]">
                  <Plus size={16} /> افزودن عضو
              </button>
          </div>

          <div className="space-y-3 w-full">
             {team?.map((member, index) => (
                <div 
                    key={member.id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all w-full"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {editingId === member.id ? (
                        <div className="p-4 bg-blue-50/30">
                            <div className="flex justify-between mb-4 border-b pb-2">
                                <span className="text-sm font-black text-blue-600">ویرایش عضو</span>
                                <div className="flex gap-2">
                                    <button onClick={handleSaveMember} className="text-xs bg-green-500 text-white px-3 py-1 rounded flex gap-1 hover:bg-green-600"><Check size={14}/> ذخیره</button>
                                    <button onClick={() => setEditingId(null)} className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded flex gap-1 hover:bg-gray-300"><X size={14}/> انصراف</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input value={editForm.name} onChange={e => handleMemberFormChange('name', e.target.value)} placeholder="نام (فارسی)" className="input-admin"/>
                                <input value={editForm.name_en || ''} onChange={e => handleMemberFormChange('name_en', e.target.value)} placeholder="Name (En)" className="input-admin ltr"/>
                                
                                <input value={editForm.role_dr || ''} onChange={e => handleMemberFormChange('role_dr', e.target.value)} placeholder="سمت (دری)" className="input-admin"/>
                                <div className="flex gap-1">
                                    <input value={editForm.role_ps || ''} onChange={e => handleMemberFormChange('role_ps', e.target.value)} placeholder="سمت (پشتو)" className="input-admin"/>
                                    <button onClick={()=>translateMemberRole('ps')} className="bg-green-100 px-2 rounded text-[10px]">{loading==='role_ps' ? '...' : 'T'}</button>
                                </div>
                                <div className="flex gap-1 col-span-2">
                                    <input value={editForm.role_en || ''} onChange={e => handleMemberFormChange('role_en', e.target.value)} placeholder="Role (En)" className="input-admin ltr"/>
                                    <button onClick={()=>translateMemberRole('en')} className="bg-orange-100 px-2 rounded text-[10px]">{loading==='role_en' ? '...' : 'T'}</button>
                                </div>
                                
                                <input value={editForm.image} onChange={e => handleMemberFormChange('image', e.target.value)} placeholder="لینک عکس" className="input-admin ltr col-span-2"/>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="cursor-grab text-gray-300 p-1"><GripVertical size={18}/></div>
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                                   {member.image ? <img src={member.image} className="w-full h-full object-cover"/> : <User className="w-full h-full p-3 text-gray-300"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{member.name}</h4>
                                    <div className="text-[10px] text-gray-400">{member.role_dr} {member.role_en && `| ${member.role_en}`}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDuplicateMember(member)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="کپی"><Copy size={16}/></button>
                                <button onClick={() => handleEditClick(member)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100" title="ویرایش"><Edit size={16}/></button>
                                <button onClick={() => handleDeleteMember(member.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="حذف"><Trash size={16}/></button>
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