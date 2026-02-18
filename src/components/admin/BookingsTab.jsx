import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function BookingsTab({ bookings, onStatusUpdate }) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-black text-gray-800">لیست رزروها</h2>
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 text-right">نوع</th>
                <th className="p-4 text-right">نام مشتری</th>
                <th className="p-4 text-right">جزئیات</th>
                <th className="p-4 text-right">تماس</th>
                <th className="p-4 text-center">وضعیت</th>
                <th className="p-4 text-center">کد پیگیری</th>
                <th className="p-4">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings?.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-400">{b.type}</td>
                  <td className="p-4 font-bold">{b.name}</td>
                  <td className="p-4 text-gray-500 max-w-xs truncate" title={b.details}>{b.details}</td>
                  <td className="p-4 font-mono text-gray-600" dir="ltr">{b.phone}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      b.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {b.status === 'confirmed' ? 'تایید شده' : b.status === 'rejected' ? 'رد شده' : 'در انتظار'}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-blue-600">{b.trackingCode}</td>
                  <td className="p-4 flex gap-2 justify-center">
                    {b.status === 'pending' && (
                      <>
                        <button onClick={()=>onStatusUpdate(b.id, 'confirmed')} className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-100"><CheckCircle size={18}/></button>
                        <button onClick={()=>onStatusUpdate(b.id, 'rejected')} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><XCircle size={18}/></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-400">هیچ رزروی یافت نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}