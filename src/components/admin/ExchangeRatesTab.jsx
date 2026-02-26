import React, { useState, useEffect, useRef } from 'react';
import { Save, Calendar, Trash2, TrendingUp, RefreshCw, PlusCircle, Edit3, Check, X, AlertCircle, Clock, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SmartCalendar from '../common/SmartCalendar';
import CustomAlert from './CustomAlert'; // <--- استفاده از کامپوننت آلارم خودتان

export default function ExchangeRatesTab({ currentUser }) {
  const [history, setHistory] = useState([]); 
  const [pendingRequests, setPendingRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const calendarRef = useRef(null);

  // استیت مربوط به پاپ‌آپ آلارم
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null, showCancel: false });

  const [newRate, setNewRate] = useState({
      date: '', usd_buy: 0, usd_sell: 0, eur_buy: 0, eur_sell: 0, irr_buy: 0, irr_sell: 0, pkr_buy: 0, pkr_sell: 0
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
      setLoading(true);
      try {
        const { data: rates } = await supabase.from('exchange_rates').select('*').order('date', { ascending: false });
        if (rates) setHistory(rates);
        const { data: requests } = await supabase.from('exchange_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false });
        if (requests) setPendingRequests(requests);
      } catch (err) { console.error("Fetch Error:", err); }
      setLoading(false);
  };

  // تابع کمکی برای نمایش آلارم سفارشی بجای alert مرورگر
  const showAlert = (type, title, message, onConfirm = null, showCancel = false) => {
      setAlertConfig({ open: true, type, title, message, onConfirm, showCancel });
  };

  // تابع چک کردن اینکه آیا تاریخ مربوط به امروز است یا خیر
  const isDateToday = (dateStr) => {
      const today = new Date().toISOString().split('T')[0]; // فرمت YYYY-MM-DD
      return dateStr === today;
  };

  const handleSaveRate = async () => {
      if (!newRate.date) return showAlert('warning', 'خطا', 'لطفاً ابتدا تاریخ را انتخاب کنید.');

      // ۱. چک کردن تکراری نبودن (فقط هنگام ثبت جدید)
      if (!editingId) {
          const exists = history.find(h => h.date === newRate.date);
          if (exists) return showAlert('danger', 'تاریخ تکراری', `نرخ اسعار برای تاریخ ${newRate.date} قبلاً ثبت شده است. هر روز فقط یک بار امکان ثبت دارد.`);
      }

      // ۲. منطق ذخیره‌سازی
      const isPastDate = !isDateToday(newRate.date);

      if (isSuperAdmin || !isPastDate) {
          // اگر سوپر ادمین باشد یا تاریخ مربوط به امروز باشد -> ثبت مستقیم
          try {
              if (editingId) {
                  await supabase.from('exchange_rates').update(newRate).eq('id', editingId);
                  showAlert('success', 'موفقیت', 'تغییرات با موفقیت اعمال شد.');
              } else {
                  await supabase.from('exchange_rates').insert([newRate]);
                  showAlert('success', 'ثبت شد', 'نرخ جدید با موفقیت ذخیره گردید.');
              }
          } catch (e) { showAlert('danger', 'خطا', 'مشکلی در لود دیتابیس پیش آمد.'); }
      } else {
          // اگر ادمین معمولی باشد و بخواهد تاریخ گذشته را تغییر دهد -> ایجاد درخواست
          const request = {
              type: editingId ? 'edit' : 'create',
              target_id: editingId || null,
              data: newRate,
              requested_by: currentUser?.email || 'Admin',
              request_date: new Date().toLocaleString('fa-IR'),
              status: 'pending'
          };
          await supabase.from('exchange_requests').insert([request]);
          showAlert('warning', 'نیاز به تایید', 'ویرایش تاریخ‌های گذشته نیاز به تایید سوپر ادمین دارد. درخواست شما ارسال شد.');
      }
      
      resetForm();
      fetchData();
  };

  const handleDeleteClick = async (item) => {
      const performDelete = async () => {
          const isPastDate = !isDateToday(item.date);
          if (isSuperAdmin || !isPastDate) {
              await supabase.from('exchange_rates').delete().eq('id', item.id);
              showAlert('success', 'حذف شد', 'آیتم مورد نظر با موفقیت پاک شد.');
          } else {
              const request = {
                  type: 'delete',
                  target_id: item.id,
                  data: item,
                  requested_by: currentUser?.email || 'Admin',
                  request_date: new Date().toLocaleString('fa-IR'),
                  status: 'pending'
              };
              await supabase.from('exchange_requests').insert([request]);
              showAlert('warning', 'ارسال درخواست', 'درخواست حذف این مورد برای سوپر ادمین ارسال شد.');
          }
          fetchData();
      };

      showAlert('danger', 'تایید حذف', `آیا از حذف نرخ تاریخ ${item.date} مطمئن هستید؟`, performDelete, true);
  };

  const handleApprove = async (req) => {
      if (req.type === 'create') await supabase.from('exchange_rates').insert([req.data]);
      else if (req.type === 'edit') await supabase.from('exchange_rates').update(req.data).eq('id', req.target_id);
      else if (req.type === 'delete') await supabase.from('exchange_rates').delete().eq('id', req.target_id);
      
      await supabase.from('exchange_requests').update({ status: 'approved' }).eq('id', req.id);
      showAlert('success', 'تایید شد', 'درخواست با موفقیت تایید و اعمال گردید.');
      fetchData();
  };

  const handleReject = async (reqId) => {
      await supabase.from('exchange_requests').update({ status: 'rejected' }).eq('id', reqId);
      showAlert('info', 'رد شد', 'درخواست مورد نظر رد شد.');
      fetchData();
  };

  const handleEditClick = (item) => {
      setNewRate({ ...item });
      setEditingId(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setNewRate({ date: '', usd_buy:0, usd_sell:0, eur_buy:0, eur_sell:0, irr_buy:0, irr_sell:0, pkr_buy:0, pkr_sell:0 });
      setEditingId(null);
  };

  if (loading) return <div className="flex flex-col items-center justify-center h-64 gap-4 font-[Vazirmatn]"><Loader2 className="animate-spin text-[#058B8C]" size={40}/><p className="text-gray-500 font-bold">در حال بروزرسانی...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in font-[Vazirmatn]" dir="rtl">
        
        {/* کامپوننت آلارم سفارشی */}
        <CustomAlert 
            open={alertConfig.open} 
            config={alertConfig} 
            onClose={() => setAlertConfig({...alertConfig, open: false})} 
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-2xl font-black text-gray-800">مدیریت صرافی و نرخ اسعار</h2>
               <p className="text-sm text-gray-500 mt-1">امروز: {new Date().toLocaleDateString('fa-IR')}</p>
            </div>
            <button onClick={fetchData} className="bg-white border-2 border-gray-100 text-gray-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition">
                <RefreshCw size={18}/> بروزرسانی لیست
            </button>
        </div>

        {/* درخواست‌های منتظر تایید (فقط سوپر ادمین) */}
        {isSuperAdmin && pendingRequests.length > 0 && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <h3 className="flex items-center gap-2 text-orange-700 font-black"><Clock size={20}/> نیاز به تایید مدیریت ({pendingRequests.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingRequests.map(req => (
                        <div key={req.id} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between gap-4">
                            <div className="text-xs space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className={`px-2 py-0.5 rounded font-black ${req.type==='delete'?'bg-red-100 text-red-600':'bg-blue-100 text-blue-600'}`}>
                                        {req.type === 'delete' ? 'درخواست حذف' : 'درخواست ویرایش'}
                                    </span>
                                    <span className="text-gray-400">{req.request_date}</span>
                                </div>
                                <p className="text-gray-700">توسط: <span className="font-bold">{req.requested_by}</span></p>
                                {req.type !== 'delete' && (
                                    <div className="bg-gray-50 p-2 rounded-lg font-mono text-[10px] text-gray-500">
                                        تغییر به {"->"} USD: {req.data.usd_buy}/{req.data.usd_sell} | IRR: {req.data.irr_buy}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 border-t pt-3">
                                <button onClick={() => handleApprove(req)} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-green-700"><Check size={14}/> تایید و اعمال</button>
                                <button onClick={() => handleReject(req.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 hover:bg-red-100"><X size={14}/> رد</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* فرم ثبت نرخ */}
        <div className={`bg-white p-6 rounded-3xl border-2 shadow-sm space-y-6 relative z-[110] ...`}>
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {editingId ? <Edit3 size={18} className="text-blue-600"/> : <TrendingUp size={18} className="text-[#058B8C]"/>}
                    {editingId ? `ویرایش نرخ ${newRate.date}` : 'ثبت نرخ‌های امروز'}
                </h3>
                {editingId && <button onClick={resetForm} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg">لغو ویرایش</button>}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-1 border-l pl-6 space-y-2 relative z-[120]" ref={calendarRef}>
                    <label className="text-xs font-bold text-gray-400 mb-2 block tracking-tighter">۱. انتخاب تاریخ</label>
                    <div onClick={() => !editingId && setShowCalendar(!showCalendar)} className={`w-full bg-gray-50 border border-transparent px-4 py-3 rounded-xl flex justify-between items-center ${editingId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}>
                        <span className="font-bold text-gray-800" dir="ltr">{newRate.date || '---'}</span>
                        <Calendar size={18} className="text-[#058B8C]"/>
                    </div>
                    {showCalendar && !editingId && <SmartCalendar selectedDate={newRate.date} onSelect={(d) => { setNewRate({...newRate, date: d}); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} />}
                </div>
                
                <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {/* فیلدها با برچسب خرید و فروش */}
                   {[
                     {id:'usd', label:'دلار (USD)', sub:'۱ دلار', bg:'bg-blue-50', border:'border-blue-100', text:'text-blue-900'},
                     {id:'eur', label:'یورو (EUR)', sub:'۱ یورو', bg:'bg-orange-50', border:'border-orange-100', text:'text-orange-900'},
                     {id:'irr', label:'تومان (IRR)', sub:'۱ میلیون', bg:'bg-emerald-50', border:'border-emerald-100', text:'text-emerald-900'},
                     {id:'pkr', label:'کلدار (PKR)', sub:'۱ هزار', bg:'bg-rose-50', border:'border-rose-100', text:'text-rose-900'}
                   ].map(coin => (
                    <div key={coin.id} className={`${coin.bg}/50 p-4 rounded-3xl border ${coin.border} space-y-3`}>
                        <div className="flex justify-between items-center font-black">
                            <span className={`text-[11px] ${coin.text}`}>{coin.label}</span>
                            <span className="text-[9px] opacity-50">{coin.sub}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-right">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-green-600 flex items-center gap-1"><ArrowDownCircle size={10}/> خرید</label>
                                <input type="number" step="0.01" value={newRate[`${coin.id}_buy`]} onChange={e=>setNewRate({...newRate, [`${coin.id}_buy`]: Number(e.target.value)})} className="w-full p-2 rounded-xl border-none outline-none text-center font-bold text-sm shadow-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-blue-600 flex items-center gap-1"><ArrowUpCircle size={10}/> فروش</label>
                                <input type="number" step="0.01" value={newRate[`${coin.id}_sell`]} onChange={e=>setNewRate({...newRate, [`${coin.id}_sell`]: Number(e.target.value)})} className="w-full p-2 rounded-xl border-none outline-none text-center font-bold text-sm shadow-sm text-blue-600" />
                            </div>
                        </div>
                    </div>
                   ))}
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button onClick={handleSaveRate} className={`px-10 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#058B8C] hover:bg-[#047070]'} text-white`}>
                    {editingId ? <Check size={20}/> : <PlusCircle size={20}/>}
                    {editingId ? 'ذخیره تغییرات' : 'انتشار نرخ‌های جدید'}
                </button>
            </div>
        </div>

        {/* لیست نهایی */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative z-10">
            <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                 <thead className="bg-gray-50 text-gray-500 font-bold">
                     <tr>
                         <th className="p-4 text-right">تاریخ</th>
                         <th className="p-2 text-center">دلار ($)</th>
                         <th className="p-2 text-center">یورو (€)</th>
                         <th className="p-2 text-center">تومان (۱م)</th>
                         <th className="p-2 text-center">کلدار (۱ه)</th>
                         <th className="p-4 text-center">عملیات</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-center">
                     {history.map((item) => (
                         <tr key={item.id} className="hover:bg-blue-50/20 group transition-colors">
                             <td className="p-4 text-right font-bold text-gray-800" dir="ltr">{item.date}</td>
                             <td className="p-3 font-mono">
                                 <span className="text-green-600">{item.usd_buy}</span>
                                 <span className="mx-1 text-gray-300">/</span>
                                 <span className="text-blue-600 font-bold">{item.usd_sell}</span>
                             </td>
                             <td className="p-3 font-mono">
                                 <span className="text-green-600">{item.eur_buy}</span>
                                 <span className="mx-1 text-gray-300">/</span>
                                 <span className="text-orange-600 font-bold">{item.eur_sell}</span>
                             </td>
                             <td className="p-3 font-mono text-green-700 font-bold">{item.irr_sell}</td>
                             <td className="p-3 font-mono text-rose-700 font-bold">{item.pkr_sell}</td>
                             <td className="p-3">
                                 <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleEditClick(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Edit3 size={15}/></button>
                                     <button onClick={() => handleDeleteClick(item)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"><Trash2 size={15}/></button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
                 </table>
            </div>
        </div>

    </div>
  );
}