import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ClientsTab({ clients, onBatchUpdate, setHasUnsavedChanges, showAlert }) {
  const [localClients, setLocalClients] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalClients(clients || []);
  }, [clients]);

  const handleAddClient = () => {
    setLocalClients([...localClients, { id: Date.now(), name: '', logo: '', url: '' }]);
    setHasUnsavedChanges(true);
  };

  const handleChange = (index, field, value) => {
    const newClients = [...localClients];
    newClients[index][field] = value;
    setLocalClients(newClients);
    setHasUnsavedChanges(true);
  };

  const handleDelete = (index) => {
    showAlert('danger', 'حذف مشتری', 'آیا از حذف این مشتری مطمئن هستید؟', () => {
      const newClients = localClients.filter((_, i) => i !== index);
      setLocalClients(newClients);
      setHasUnsavedChanges(true);
      // بلافاصله بعد از حذف ذخیره میکنیم تا دیتابیس آپدیت شود
      onBatchUpdate([{ section: 'clients', field: null, value: newClients }]);
    }, true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onBatchUpdate([{ section: 'clients', field: null, value: localClients }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in pb-24" dir="rtl">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-800">مدیریت مشتریان و همکاران</h2>
          <button onClick={handleAddClient} className="bg-teal-50 text-[#058B8C] hover:bg-[#058B8C] hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
              <Plus size={18} /> افزودن مشتری جدید
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localClients.map((client, index) => (
          <div key={client.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
            <button onClick={() => handleDelete(index)} className="absolute top-4 left-4 p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition opacity-0 group-hover:opacity-100">
                <Trash2 size={16} />
            </button>
            
            <div className="mb-4">
               {client.logo ? (
                   <img src={client.logo} alt="logo" className="w-20 h-20 object-contain mx-auto rounded-xl border border-gray-100 p-2" />
               ) : (
                   <div className="w-20 h-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mx-auto flex items-center justify-center text-gray-300">
                       <ImageIcon size={24} />
                   </div>
               )}
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500">نام مشتری / شرکت</label>
                    <input 
                      value={client.name}
                      onChange={e => handleChange(index, 'name', e.target.value)}
                      placeholder="مثال: شرکت هواپیمایی..."
                      className="input-admin text-center font-bold text-gray-800"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500">لینک لوگو</label>
                    <input 
                      value={client.logo}
                      onChange={e => handleChange(index, 'logo', e.target.value)}
                      placeholder="https://..."
                      className="input-admin ltr text-xs text-blue-600"
                      dir="ltr"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500">لینک وب‌سایت (اختیاری)</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LinkIcon size={14}/></div>
                        <input 
                        value={client.url}
                        onChange={e => handleChange(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="input-admin ltr text-xs pl-8 text-green-600"
                        dir="ltr"
                        />
                    </div>
                </div>
            </div>
          </div>
        ))}

        {localClients.length === 0 && (
            <div className="col-span-full py-12 bg-white rounded-3xl border border-gray-100 text-center">
                <p className="text-gray-400 font-bold">هیچ مشتری‌ای ثبت نشده است. روی دکمه افزودن کلیک کنید.</p>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:right-72 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40 flex justify-between items-center px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <span className="text-gray-500 font-bold text-sm hidden md:block">پس از پایان تغییرات، دکمه ذخیره را بزنید.</span>
        <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto bg-[#058B8C] text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-[#058B8C]/20 flex items-center justify-center gap-2 hover:bg-[#047070] transition active:scale-95 disabled:opacity-70">
            {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </div>
    </div>
  );
}