import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, User, Plus, Edit, Trash2, Save, X, CheckCircle, Search, Key, Check, Loader2, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AVAILABLE_MODULES = [
  { id: 'reservations', name: 'مدیریت رزروها و پروازها', actions: ['view', 'add', 'edit', 'delete'] },
  { id: 'finance', name: 'امور مالی و نرخ اسعار', actions: ['view', 'add', 'approve'] },
  { id: 'visas', name: 'مدیریت ویزاها (آینده)', actions: ['view', 'add', 'edit', 'delete'] },
  { id: 'content', name: 'محتوای سایت و اخبار', actions: ['view', 'edit'] },
  { id: 'settings', name: 'تنظیمات قالب و سیستم', actions: ['view', 'edit'] }
];

const ACTION_LABELS = {
    'view': 'مشاهده',
    'add': 'افزودن',
    'edit': 'ویرایش',
    'delete': 'حذف',
    'approve': 'تایید مالی'
};

// <--- دریافت currentUser در پراپ --->
export default function AdminsTab({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    id: null, name: '', email: '', password: '', role: 'admin', permissions: {}
  });

  useEffect(() => {
    // فقط اگر سوپر ادمین بود دیتا را از سرور بگیر
    if (currentUser?.role === 'super_admin') {
        fetchAdmins();
    }
  }, [currentUser]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
        const { data, error } = await supabase.from('admins').select('*').order('id', { ascending: true });
        if (error) throw error;
        setAdmins(data || []);
    } catch (error) {
        console.error("Error fetching admins:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({ id: null, name: '', email: '', password: '', role: 'admin', permissions: {} });
    setIsModalOpen(true);
  };

  const handleEdit = (admin) => {
    setFormData({ ...admin, password: '' }); 
    setIsModalOpen(true);
  };

  const handlePermissionChange = (moduleId, action) => {
    setFormData(prev => {
        const modulePerms = prev.permissions[moduleId] || [];
        let newModulePerms;
        
        if (modulePerms.includes(action)) {
            newModulePerms = modulePerms.filter(a => a !== action);
        } else {
            newModulePerms = [...modulePerms, action];
        }

        return {
            ...prev,
            permissions: { ...prev.permissions, [moduleId]: newModulePerms }
        };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        const payload = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            permissions: formData.permissions
        };

        if (formData.password) payload.password = formData.password;

        if (formData.id) {
            const { error } = await supabase.from('admins').update(payload).eq('id', formData.id);
            if (error) throw error;
            alert('اطلاعات مدیر با موفقیت بروزرسانی شد.');
        } else {
            const { error } = await supabase.from('admins').insert([payload]);
            if (error) throw error;
            alert('مدیر جدید با موفقیت به سیستم اضافه شد.');
        }

        setIsModalOpen(false);
        fetchAdmins(); 
    } catch (error) {
        alert('خطا در ذخیره اطلاعات: ' + error.message);
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    // جلوگیری از حذف اکانت خودش!
    if (id === currentUser?.id) {
        alert('شما نمی‌توانید حساب کاربری خودتان را حذف کنید!');
        return;
    }

    if(window.confirm('آیا از حذف این مدیر و قطع دسترسی او اطمینان دارید؟')) {
        setIsLoading(true);
        try {
            const { error } = await supabase.from('admins').delete().eq('id', id);
            if (error) throw error;
            setAdmins(admins.filter(a => a.id !== id));
            alert('دسترسی مدیر مورد نظر به طور کامل قطع شد.');
        } catch (error) {
            alert('خطا در حذف مدیر.');
        } finally {
            setIsLoading(false);
        }
    }
  };

  // ==========================================
  // ⛔ دیوار امنیتی: جلوگیری از دسترسی ادمین‌های محدود
  // ==========================================
  if (currentUser?.role !== 'super_admin') {
      return (
          <div className="flex flex-col items-center justify-center h-[70vh] bg-red-50 rounded-3xl border border-red-100 animate-in zoom-in-95">
              <ShieldAlert size={80} className="text-red-400 mb-6 drop-shadow-lg" />
              <h2 className="text-3xl font-black text-red-600 mb-3">دسترسی مسدود شد!</h2>
              <p className="text-red-500 font-bold text-lg">شما ادمین محدود هستید و به هیچ وجه اجازه مشاهده یا ویرایش سایر مدیران را ندارید.</p>
          </div>
      );
  }

  const filteredAdmins = admins.filter(a => a.name.includes(searchQuery) || a.email.includes(searchQuery));

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <Shield className="text-[#058B8C]"/> مدیریت مدیران و سطوح دسترسی
            </h2>
            <p className="text-sm text-gray-500 mt-1">تعریف کارمندان جدید و تعیین دقیق دسترسی آن‌ها به بخش‌های مختلف سیستم.</p>
        </div>
        <button onClick={handleAddNew} className="bg-[#058B8C] hover:bg-[#047070] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-[#058B8C]/30">
            <Plus size={18}/> افزودن مدیر جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center relative">
         <Search size={18} className="absolute right-6 text-gray-400"/>
         <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام یا ایمیل مدیران..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-12 pl-4 py-2.5 outline-none focus:border-[#058B8C] text-sm font-bold"
         />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm relative min-h-[200px]">
         {isLoading && (
             <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                 <Loader2 className="animate-spin text-[#058B8C]" size={32} />
             </div>
         )}
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-right">
                 <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                     <tr>
                         <th className="p-4">نام و مشخصات</th>
                         <th className="p-4">نقش سیستمی</th>
                         <th className="p-4">خلاصه دسترسی‌ها</th>
                         <th className="p-4 text-center">عملیات</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                     {filteredAdmins.length === 0 && !isLoading ? (
                         <tr><td colSpan="4" className="p-8 text-center text-gray-400">هیچ مدیری یافت نشد.</td></tr>
                     ) : (
                         filteredAdmins.map(admin => (
                             <tr key={admin.id} className="hover:bg-blue-50/50 transition-colors group">
                                 <td className="p-4">
                                     <div className="font-bold text-gray-800 flex items-center gap-2">
                                         <User size={16} className="text-gray-400"/> {admin.name}
                                     </div>
                                     <div className="text-[10px] text-gray-500 font-mono mt-1" dir="ltr">{admin.email}</div>
                                 </td>
                                 <td className="p-4">
                                     {admin.role === 'super_admin' ? (
                                         <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 w-max"><ShieldAlert size={14}/> سوپر ادمین</span>
                                     ) : (
                                         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold w-max">ادمین محدود</span>
                                     )}
                                 </td>
                                 <td className="p-4">
                                     {admin.role === 'super_admin' ? (
                                         <span className="text-xs text-gray-500">دسترسی کامل به تمام سیستم</span>
                                     ) : (
                                         <div className="flex flex-wrap gap-1">
                                             {admin.permissions && Object.keys(admin.permissions).map(mod => (
                                                 <span key={mod} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] border border-gray-200">
                                                     {AVAILABLE_MODULES.find(m => m.id === mod)?.name || mod}
                                                 </span>
                                             ))}
                                         </div>
                                     )}
                                 </td>
                                 <td className="p-4 text-center">
                                     <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button onClick={() => handleEdit(admin)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="ویرایش دسترسی"><Edit size={16}/></button>
                                         {admin.id !== currentUser?.id && admin.role !== 'super_admin' && (
                                             <button onClick={() => handleDelete(admin.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" title="حذف کاربر"><Trash2 size={16}/></button>
                                         )}
                                     </div>
                                 </td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
         </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
             <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                 
                 <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                     <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                         {formData.id ? <Edit className="text-[#058B8C]"/> : <Plus className="text-[#058B8C]"/>}
                         {formData.id ? 'ویرایش مشخصات و دسترسی مدیر' : 'تعریف مدیر جدید'}
                     </h3>
                     <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="p-2 hover:bg-gray-200 rounded-full transition disabled:opacity-50"><X size={20}/></button>
                 </div>

                 <div className="p-6 overflow-y-auto flex-1">
                     <form id="adminForm" onSubmit={handleSave} className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                             <div className="md:col-span-2 text-sm font-black text-gray-700 flex items-center gap-2 border-b pb-2"><User size={16}/> اطلاعات کاربری</div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">نام و نام خانوادگی</label>
                                 <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#058B8C]" required/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">ایمیل (نام کاربری)</label>
                                 <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#058B8C] dir-ltr text-left" required/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">رمز عبور {formData.id && <span className="text-[10px] text-orange-500">(فقط در صورت نیاز به تغییر وارد کنید)</span>}</label>
                                 <input type="password" placeholder={formData.id ? '***' : 'رمز عبور...'} value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#058B8C] dir-ltr text-left" {...(!formData.id ? {required: true} : {})}/>
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                                     سطح دسترسی کلی 
                                     {formData.id === currentUser?.id && <Lock size={12} className="text-orange-500"/>}
                                 </label>
                                 <select 
                                    value={formData.role} 
                                    onChange={e=>setFormData({...formData, role: e.target.value})} 
                                    disabled={formData.id === currentUser?.id} // سوپر ادمین نمی‌تواند نقش خودش را عوض کند!
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#058B8C] disabled:bg-gray-100 disabled:text-gray-400"
                                 >
                                     <option value="admin">ادمین محدود (بر اساس تیک‌ها)</option>
                                     <option value="super_admin">سوپر ادمین (دسترسی کامل و بلامانع)</option>
                                 </select>
                                 {formData.id === currentUser?.id && (
                                     <span className="text-[10px] text-orange-500 mt-1 block">شما نمی‌توانید نقش خودتان را کاهش دهید.</span>
                                 )}
                             </div>
                         </div>

                         {formData.role === 'admin' && (
                             <div className="space-y-4 animate-in fade-in">
                                 <div className="text-sm font-black text-gray-700 flex items-center gap-2"><Key size={16}/> تعیین دقیق دسترسی‌های ماژولار (Matrix Permissions)</div>
                                 <div className="border border-gray-200 rounded-2xl overflow-hidden">
                                     <table className="w-full text-sm">
                                         <thead className="bg-gray-100 text-gray-600">
                                             <tr>
                                                 <th className="p-3 text-right border-l border-gray-200 w-1/3">بخش / ماژول</th>
                                                 <th className="p-3 text-right">دسترسی‌های مجاز (تیک بزنید)</th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-gray-100 bg-white">
                                             {AVAILABLE_MODULES.map(module => (
                                                 <tr key={module.id} className="hover:bg-gray-50">
                                                     <td className="p-3 font-bold text-gray-800 border-l border-gray-100 bg-gray-50/50">
                                                         {module.name}
                                                     </td>
                                                     <td className="p-3">
                                                         <div className="flex flex-wrap gap-4">
                                                             {module.actions.map(action => {
                                                                 const isChecked = formData.permissions[module.id]?.includes(action) || false;
                                                                 return (
                                                                     <label key={action} className="flex items-center gap-2 cursor-pointer group">
                                                                         <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isChecked ? 'bg-[#058B8C] border-[#058B8C] text-white' : 'bg-white border-gray-300 text-transparent group-hover:border-[#058B8C]'}`}>
                                                                             <Check size={14}/>
                                                                         </div>
                                                                         <span className={`text-xs ${isChecked ? 'font-bold text-[#058B8C]' : 'text-gray-600'}`}>
                                                                             {ACTION_LABELS[action]}
                                                                         </span>
                                                                         <input 
                                                                             type="checkbox" 
                                                                             className="hidden"
                                                                             checked={isChecked}
                                                                             onChange={() => handlePermissionChange(module.id, action)}
                                                                         />
                                                                     </label>
                                                                 )
                                                             })}
                                                         </div>
                                                     </td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                                 <p className="text-xs text-orange-600 font-bold bg-orange-50 p-3 rounded-lg flex items-center gap-2">
                                     <ShieldAlert size={14}/> توجه: بدون داشتن تیک «مشاهده»، ادمین مورد نظر اصلاً تب مربوطه را در سایدبار نخواهد دید.
                                 </p>
                             </div>
                         )}
                     </form>
                 </div>

                 <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                     <button type="button" disabled={isSaving} onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition disabled:opacity-50">انصراف</button>
                     <button type="submit" disabled={isSaving} form="adminForm" className="bg-[#058B8C] hover:bg-[#047070] text-white px-8 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg transition disabled:opacity-70">
                         {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} 
                         {isSaving ? 'در حال ذخیره...' : 'ذخیره و اعمال دسترسی'}
                     </button>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
}