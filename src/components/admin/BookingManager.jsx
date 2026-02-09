import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // مسیر ایمپورت را چک کنید
import { Check, X, Clock, Eye, Phone, User, Plane, CreditCard, Calendar } from 'lucide-react';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت لیست رزروها از دیتابیس
  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching bookings:', error);
    else setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // تغییر وضعیت (مثلا تایید پرداخت)
  const updateStatus = async (id, newStatus) => {
    if(!window.confirm('آیا از تغییر وضعیت اطمینان دارید؟')) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('خطا در بروزرسانی');
    } else {
      fetchBookings(); // رفرش لیست
    }
  };

  // تابع کمکی برای رنگ وضعیت
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">تایید شده</span>;
      case 'pending_verification': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">منتظر تایید پرداخت</span>;
      case 'pending_payment': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">منتظر پرداخت</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">لغو شده</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">مدیریت رزروها و تراکنش‌ها</h2>
        <button onClick={fetchBookings} className="text-sm text-blue-600 hover:underline">بروزرسانی لیست</button>
      </div>

      {loading ? (
        <div className="text-center py-10">در حال دریافت اطلاعات...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="p-4 rounded-tr-xl">زمان</th>
                <th className="p-4">مشتری</th>
                <th className="p-4">پرواز</th>
                <th className="p-4">مبلغ / روش</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">کد پیگیری</th>
                <th className="p-4 rounded-tl-xl">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  {/* زمان */}
                  <td className="p-4 text-gray-500" dir="ltr">
                    {new Date(item.created_at).toLocaleDateString('fa-IR')}
                    <br/>
                    <span className="text-xs">{new Date(item.created_at).toLocaleTimeString('fa-IR')}</span>
                  </td>

                  {/* مشتری */}
                  <td className="p-4">
                    <div className="font-bold text-gray-800 flex items-center gap-1"><User size={14}/> {item.customer_name}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={14}/> {item.customer_phone}</div>
                  </td>

                  {/* پرواز */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <span className="text-lg">{item.flight_info?.logo}</span>
                       <div>
                          <div className="font-bold text-xs">{item.flight_info?.airline}</div>
                          <div className="text-[10px] text-gray-500" dir="ltr">{item.flight_info?.origin} &rarr; {item.flight_info?.dest}</div>
                       </div>
                    </div>
                  </td>

                  {/* مبلغ */}
                  <td className="p-4">
                    <div className="font-bold text-blue-600">{(item.amount || 0).toLocaleString()} <span className="text-[10px]">افغانی</span></div>
                    <div className="text-xs text-gray-500 mt-1">{item.payment_method || '-'}</div>
                  </td>

                  {/* وضعیت */}
                  <td className="p-4">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* کد پیگیری */}
                  <td className="p-4 font-mono text-xs">
                    {item.transaction_id ? (
                        <span className="bg-gray-100 px-2 py-1 rounded select-all">{item.transaction_id}</span>
                    ) : '-'}
                  </td>

                  {/* عملیات */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      {item.status === 'pending_verification' && (
                        <button 
                          onClick={() => updateStatus(item.id, 'confirmed')}
                          title="تایید پرداخت"
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-200"
                        >
                          <Check size={16}/>
                        </button>
                      )}
                      
                      {(item.status !== 'cancelled' && item.status !== 'confirmed') && (
                         <button 
                           onClick={() => updateStatus(item.id, 'cancelled')}
                           title="لغو سفارش"
                           className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
                         >
                           <X size={16}/>
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan="7" className="text-center py-8 text-gray-400">هیچ رزروی یافت نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}