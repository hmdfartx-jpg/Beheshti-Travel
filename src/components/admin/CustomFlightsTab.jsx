import React, { useState, useEffect, useRef } from 'react';
import { Plane, Plus, Trash2, Save, Calendar, MapPin, PlaneTakeoff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SmartCalendar from '../common/SmartCalendar';
import AirportSearch from '../common/AirportSearch';
import AirlineSearch from '../common/AirlineSearch';
import CustomAlert from './CustomAlert';

export default function CustomFlightsTab({ currentUser }) {
  const [manualFlights, setManualFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  
  // رفع مشکل زیرِ فرم رفتن پاپ‌آپ با برداشتن z-index های اضافی از صفحه
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null, showCancel: false });

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [newFlight, setNewFlight] = useState({
    airline_name: '', airline_code: '', flight_no: '', 
    origin: '', destination: '',
    departure_date: '', departure_time: '', 
    price: '', capacity: '100', flight_class: 'اکونومی'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('custom_flights').select('*').order('created_at', { ascending: false });
    if (data) setManualFlights(data);
    setLoading(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) setShowCalendar(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const extractIATA = (text) => {
    if (!text) return '';
    const exactMatch = text.match(/\(([A-Za-z]{3})\)/);
    if (exactMatch) return exactMatch[1].toUpperCase();
    const wordMatch = text.match(/\b([A-Za-z]{3})\b/);
    if (wordMatch) return wordMatch[1].toUpperCase();
    return text.trim().toUpperCase();
  };

  const handleAddFlight = async () => {
    if (!newFlight.origin || !newFlight.destination || !newFlight.price || !newFlight.departure_date || !newFlight.airline_name) {
        return setAlertConfig({ open: true, type: 'warning', title: 'فیلد ناقص', message: 'لطفاً ایرلاین، مسیر و تاریخ را انتخاب کنید.' });
    }

    const originCode = extractIATA(newFlight.origin);
    const destCode = extractIATA(newFlight.destination);

    const flightData = {
        airline: newFlight.airline_name,
        airline_code: newFlight.airline_code,
        flight_no: newFlight.flight_no,
        origin: newFlight.origin, 
        origin_code: originCode,
        destination: newFlight.destination, 
        destination_code: destCode,
        departure_date: newFlight.departure_date,
        departure_time: newFlight.departure_time,
        price: parseFloat(newFlight.price),
        capacity: parseInt(newFlight.capacity),
        flight_class: newFlight.flight_class,
        logo_url: `https://pics.avs.io/200/200/${newFlight.airline_code}.png`
    };

    const { error } = await supabase.from('custom_flights').insert([flightData]);
    
    if (error) {
        setAlertConfig({ open: true, type: 'danger', title: 'خطا', message: 'خطا در اتصال به دیتابیس.' });
    } else {
        setAlertConfig({ open: true, type: 'success', title: 'ثبت شد', message: 'پرواز با موفقیت در دیتابیس ذخیره شد.' });
        setNewFlight({ airline_name: '', airline_code: '', flight_no: '', origin: '', destination: '', departure_date: '', departure_time: '', price: '', capacity: '100', flight_class: 'اکونومی' });
        fetchData();
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = async () => {
        const { error } = await supabase.from('custom_flights').delete().eq('id', item.id);
        if (!error) {
            setAlertConfig({ open: true, type: 'success', title: 'حذف شد', message: 'پرواز حذف گردید.' });
            fetchData();
        }
    };
    setAlertConfig({ open: true, type: 'danger', title: 'تایید حذف', message: `آیا از حذف پرواز ${item.flight_no} مطمئن هستید؟`, onConfirm: confirmDelete, showCancel: true });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#058B8C]" size={40}/></div>;

  return (
    // لایه‌بندی مخرب قبلی پاک شد تا در اسکرول کردن به مشکل نخورید
    <div className="space-y-8 animate-in fade-in font-[Vazirmatn]" dir="rtl">
      <CustomAlert open={alertConfig.open} config={alertConfig} onClose={() => setAlertConfig({ ...alertConfig, open: false })} />

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-black text-gray-800 flex items-center gap-2 border-b pb-4">
            <Plus size={20} className="text-[#058B8C]"/> افزودن پرواز چارتر (دستی)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* مقدارهای Z-Index به صورت نزولی تنظیم شده تا هیچ دراپ‌داونی زیر دیگری نرود */}
          <div className="h-[50px] relative z-[80]">
            <AirlineSearch value={newFlight.airline_name} onChange={(name) => setNewFlight({...newFlight, airline_name: name, airline_code: name === 'Kam Air' ? 'RQ' : (name === 'Ariana Afghan Airlines' ? 'FG' : 'XX')})} placeholder="جستجوی ایرلاین..." icon={PlaneTakeoff} />
          </div>
          <div className="relative z-10">
            <input type="text" value={newFlight.flight_no} onChange={e=>setNewFlight({...newFlight, flight_no: e.target.value})} placeholder="شماره پرواز (FG-101)" className="input-admin font-mono ltr w-full" />
          </div>
          <div className="h-[50px] relative z-[70]">
            <AirportSearch value={newFlight.origin} onChange={(val)=>setNewFlight({...newFlight, origin: val})} placeholder="فرودگاه مبدا" icon={Plane} />
          </div>
          <div className="h-[50px] relative z-[60]">
            <AirportSearch value={newFlight.destination} onChange={(val)=>setNewFlight({...newFlight, destination: val})} placeholder="فرودگاه مقصد" icon={MapPin} />
          </div>
          
          <div className="relative z-[50]" ref={calendarRef}>
             <div onClick={() => setShowCalendar(!showCalendar)} className="input-admin flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors w-full">
                <span className={newFlight.departure_date ? 'text-gray-800 font-bold' : 'text-gray-400 font-bold'} dir="ltr">
                    {newFlight.departure_date || 'تاریخ پرواز'}
                </span>
                <Calendar size={18} className="text-[#058B8C]"/>
             </div>
             {showCalendar && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px', zIndex: 9999, minWidth: '300px' }}>
                    <SmartCalendar selectedDate={newFlight.departure_date} onSelect={(d) => { setNewFlight({...newFlight, departure_date: d}); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} />
                </div>
             )}
          </div>
          
          <div className="relative z-10">
             <input type="time" value={newFlight.departure_time} onChange={e=>setNewFlight({...newFlight, departure_time: e.target.value})} className="input-admin w-full" />
          </div>
          <div className="relative z-10">
             <input type="number" value={newFlight.price} onChange={e=>setNewFlight({...newFlight, price: e.target.value})} placeholder="قیمت فروش (دلار)" className="input-admin font-bold text-[#058B8C] w-full" />
          </div>
          <div className="relative z-10">
             <input type="number" value={newFlight.capacity} onChange={e=>setNewFlight({...newFlight, capacity: e.target.value})} placeholder="ظرفیت صندلی" className="input-admin w-full" />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
           <button onClick={handleAddFlight} className="bg-[#058B8C] text-white px-10 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-[#047070] transition shadow-lg shadow-[#058B8C]/20 active:scale-95">
              <Save size={20}/> ذخیره در دیتابیس
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-400 font-bold">
            <tr>
              <th className="p-5">ایرلاین / شماره</th>
              <th className="p-5 text-center">مسیر (IATA)</th>
              <th className="p-5 text-center">تاریخ و ساعت</th>
              <th className="p-5 text-center">قیمت</th>
              <th className="p-5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             {manualFlights.map(f => (
               <tr key={f.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img src={f.logo_url} className="w-8 h-8 rounded-lg bg-white object-contain border" onError={e => e.target.src = 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png'} />
                        <div>
                            <div className="font-black text-gray-800">{f.airline}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{f.flight_no}</div>
                        </div>
                      </div>
                  </td>
                  <td className="p-5 text-center font-black text-gray-600 tracking-widest uppercase">
                    {f.origin_code} <span className="text-gray-300 mx-2">→</span> {f.destination_code}
                  </td>
                  <td className="p-5 text-center">
                      <div className="font-bold text-gray-700">{f.departure_date}</div>
                      <div className="text-[10px] text-gray-400">{f.departure_time}</div>
                  </td>
                  <td className="p-5 text-center font-black text-[#058B8C] text-lg">${f.price}</td>
                  <td className="p-5 text-center">
                      <button onClick={() => handleDelete(f)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                  </td>
               </tr>
             ))}
             {manualFlights.length === 0 && <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">دیتابیس خالی است.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}