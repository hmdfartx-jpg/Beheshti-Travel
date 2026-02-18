import React from 'react';
import { Ticket, Clock, Megaphone } from 'lucide-react';

export default function Dashboard({ bookings, news }) {
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-black text-gray-800">داشبورد وضعیت</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Ticket size={24}/></div>
              <span className="text-2xl font-black text-gray-800">{bookings?.length || 0}</span>
           </div>
           <p className="text-gray-400 font-bold text-sm">کل رزروها</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Clock size={24}/></div>
              <span className="text-2xl font-black text-gray-800">{bookings?.filter(b=>b.status==='pending').length || 0}</span>
           </div>
           <p className="text-gray-400 font-bold text-sm">در انتظار بررسی</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Megaphone size={24}/></div>
              <span className="text-2xl font-black text-gray-800">{news?.length || 0}</span>
           </div>
           <p className="text-gray-400 font-bold text-sm">تعداد اخبار</p>
        </div>
      </div>
    </div>
  );
}