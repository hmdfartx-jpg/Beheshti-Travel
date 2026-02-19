import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, XCircle, Eye, User, Phone, MapPin, 
  Plane, Calendar, CreditCard, FileText, Clock, 
  Receipt, X, PlaneTakeoff, Users, Search, Filter 
} from 'lucide-react';

// --- لیست جامع فرودگاه‌ها برای تبدیل کد به نام شهر ---
const AIRPORTS = [
  { code: 'KBL', name: 'Kabul International', city: 'Kabul', fa: 'کابل', ps: 'کابل', country: 'Afghanistan' },
  { code: 'HER', name: 'Herat International', city: 'Herat', fa: 'هرات', ps: 'هرات', country: 'Afghanistan' },
  { code: 'MZD', name: 'Mazar-i-Sharif International', city: 'Mazar-i-Sharif', fa: 'مزارشریف', ps: 'مزارشریف', country: 'Afghanistan' },
  { code: 'KDH', name: 'Kandahar International', city: 'Kandahar', fa: 'قندهار', ps: 'کندهار', country: 'Afghanistan' },
  { code: 'KHT', name: 'Khost International', city: 'Khost', fa: 'خوست', ps: 'خوست', country: 'Afghanistan' },
  { code: 'BST', name: 'Bost Airport', city: 'Lashkar Gah', fa: 'لشکرگاه', ps: 'لشکرګاه', country: 'Afghanistan' },
  { code: 'BNA', name: 'Bamyan Airport', city: 'Bamyan', fa: 'بامیان', ps: 'بامیان', country: 'Afghanistan' },
  { code: 'UND', name: 'Kunduz Airport', city: 'Kunduz', fa: 'قندوز', ps: 'کندز', country: 'Afghanistan' },
  { code: 'FBD', name: 'Faizabad Airport', city: 'Faizabad', fa: 'فیض‌آباد', ps: 'فیض‌اباد', country: 'Afghanistan' },
  { code: 'TII', name: 'Tarin Kowt Airport', city: 'Tarin Kowt', fa: 'ترین‌کوت', ps: 'ترینکوټ', country: 'Afghanistan' },
  { code: 'ZAJ', name: 'Zaranj Airport', city: 'Zaranj', fa: 'زرنج', ps: 'زرنج', country: 'Afghanistan' },
  { code: 'CCN', name: 'Chaghcharan Airport', city: 'Chaghcharan', fa: 'چغچران', ps: 'چغچران', country: 'Afghanistan' },
  { code: 'IKA', name: 'Imam Khomeini International', city: 'Tehran', fa: 'تهران', ps: 'تهران', country: 'Iran' },
  { code: 'THR', name: 'Mehrabad International', city: 'Tehran', fa: 'تهران', ps: 'تهران', country: 'Iran' },
  { code: 'MHD', name: 'Mashhad International', city: 'Mashhad', fa: 'مشهد', ps: 'مشهد', country: 'Iran' },
  { code: 'SYZ', name: 'Shiraz International', city: 'Shiraz', fa: 'شیراز', ps: 'شیراز', country: 'Iran' },
  { code: 'TBZ', name: 'Tabriz International', city: 'Tabriz', fa: 'تبریز', ps: 'تبریز', country: 'Iran' },
  { code: 'IFN', name: 'Isfahan International', city: 'Isfahan', fa: 'اصفهان', ps: 'اصفهان', country: 'Iran' },
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', fa: 'اسلام‌آباد', ps: 'اسلام‌اباد', country: 'Pakistan' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', fa: 'لاهور', ps: 'لاهور', country: 'Pakistan' },
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', fa: 'کراچی', ps: 'کراچۍ', country: 'Pakistan' },
  { code: 'PEW', name: 'Bacha Khan International', city: 'Peshawar', fa: 'پیشاور', ps: 'پېښور', country: 'Pakistan' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', fa: 'استانبول', ps: 'استانبول', country: 'Turkey' },
  { code: 'SAW', name: 'Sabiha Gokcen', city: 'Istanbul', fa: 'استانبول', ps: 'استانبول', country: 'Turkey' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', fa: 'دبی', ps: 'دوبۍ', country: 'UAE' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', fa: 'شارجه', ps: 'شارجه', country: 'UAE' },
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', fa: 'جده', ps: 'جده', country: 'Saudi Arabia' },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', fa: 'ریاض', ps: 'ریاض', country: 'Saudi Arabia' },
  { code: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', fa: 'دهلی نو', ps: 'نوی ډیلي', country: 'India' }
];

// --- الگوریتم قدرتمند و دقیق برای تبدیل تاریخ میلادی به شمسی ---
const jalaali = {
  toJalaali: (gy, gm, gd) => {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979; 
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * parseInt(days / 12053); 
    days %= 12053; 
    jy += 4 * parseInt(days / 1461); 
    days %= 1461;
    jy += parseInt((days - 1) / 365); 
    if (days > 365) days = (days - 1) % 365;
    let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { jy, jm, jd };
  }
};

export default function BookingsTab({ bookings, onStatusUpdate }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // استیت‌های جستجو و فیلتر
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('');

  // ماه‌های شمسی افغانی
  const afghanMonths = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"];
  
  // تابع تبدیل اعداد انگلیسی به فارسی
  const toNativeNum = (num) => String(num).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

  // تابع تبدیل تاریخ به شمسی افغانی و میلادی
  const formatDualDate = (dateString) => {
    if (!dateString) return { solar: '---', greg: '---', time: '---' };
    const d = new Date(dateString);
    
    // تاریخ میلادی
    const greg = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // محاسبه تاریخ شمسی
    const jDate = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const solar = `${toNativeNum(jDate.jd)} ${afghanMonths[jDate.jm - 1]} ${toNativeNum(jDate.jy)}`;
    
    // زمان
    const time = d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    
    return { solar, greg, time };
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed': 
        return { text: 'تایید و نهایی شده', color: 'bg-green-100 text-green-600', border: 'border-green-200' };
      case 'pending_payment': 
        return { text: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200' };
      case 'pending_verification': 
        return { text: 'در حال بررسی فیش', color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' };
      case 'rejected': 
        return { text: 'لغو شده', color: 'bg-red-100 text-red-600', border: 'border-red-200' };
      default: 
        return { text: 'در انتظار بررسی', color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' };
    }
  };

  // تابع کمکی برای پیدا کردن نام شهر از روی کد فرودگاه
  const getCityName = (val) => {
    if (!val) return '---';
    const airport = AIRPORTS.find(a => a.code === val.toUpperCase() || a.name === val || a.city === val);
    return airport ? airport.fa : val;
  };

  // اعمال فیلترها و جستجو روی لیست رزروها
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter(b => {
      // جستجو در نام، موبایل یا کد پیگیری
      const matchesSearch = 
        (b.customer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (b.customer_phone || '').includes(searchQuery) ||
        String(b.id).includes(searchQuery);
      
      // فیلتر وضعیت
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      
      // فیلتر مسیر (مبدا یا مقصد) هوشمند
      let matchesRoute = true;
      if (routeFilter !== '') {
          const q = routeFilter.toLowerCase();
          if (b.flight_info) {
              const originRaw = b.flight_info.origin || b.flight_info.dep || '';
              const destRaw = b.flight_info.destination || b.flight_info.dest || b.flight_info.arr || '';
              
              // تبدیل کدها به نام فارسی برای جستجوی دقیق‌تر
              const originName = getCityName(originRaw).toLowerCase();
              const destName = getCityName(destRaw).toLowerCase();

              // بررسی اینکه آیا متن جستجو شده در کد انگلیسی یا نام فارسی وجود دارد یا خیر
              matchesRoute = originRaw.toLowerCase().includes(q) || 
                             destRaw.toLowerCase().includes(q) || 
                             originName.includes(q) || 
                             destName.includes(q);
          } else {
              matchesRoute = false; // اگر پرواز نیست و کاربر مسیر را سرچ کرده، نمایش داده نشود
          }
      }

      return matchesSearch && matchesStatus && matchesRoute;
    });
  }, [bookings, searchQuery, statusFilter, routeFilter]);

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-gray-800">
            لیست رزروها
        </h2>
      </div>

      {/* --- نوار جستجو و فیلتر --- */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="flex-1 w-full relative">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="جستجو با نام، موبایل یا کد سفارش..." 
               className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 outline-none focus:border-[#058B8C] transition-all text-sm font-bold"
            />
         </div>
         <div className="w-full md:w-48 relative">
            <input 
               type="text" 
               value={routeFilter}
               onChange={(e) => setRouteFilter(e.target.value)}
               placeholder="جستجوی مسیر (کابل...)" 
               className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#058B8C] transition-all text-sm font-bold"
            />
         </div>
         <div className="w-full md:w-48">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#058B8C] transition-all text-sm font-bold appearance-none cursor-pointer"
            >
               <option value="all">همه وضعیت‌ها</option>
               <option value="confirmed">تایید شده‌ها</option>
               <option value="pending_payment">در انتظار پرداخت</option>
               <option value="pending_verification">در انتظار بررسی فیش</option>
               <option value="rejected">لغو شده‌ها</option>
            </select>
         </div>
      </div>

      {/* --- جدول اصلی --- */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 text-right">کد سفارش</th>
                <th className="p-4 text-right">نام مشتری</th>
                <th className="p-4 text-right">مسیر پرواز</th>
                <th className="p-4 text-right">تاریخ ثبت</th>
                <th className="p-4 text-center">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((b) => {
                const statusInfo = getStatusInfo(b.status);
                const dates = formatDualDate(b.created_at);
                
                return (
                  <tr 
                    key={b.id} 
                    onClick={() => setSelectedBooking(b)} 
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono font-black text-gray-700">
                        {String(b.id).slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                        {b.customer_name || '---'}
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5" dir="ltr">
                            {b.customer_phone}
                        </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {b.flight_info ? (
                          <div className="flex items-center gap-2">
                             <Plane size={14} className="text-[#058B8C]"/>
                             <span className="font-bold text-gray-700" dir="ltr">
                               {getCityName(b.flight_info.origin || b.flight_info.dep)} &rarr; {getCityName(b.flight_info.destination || b.flight_info.dest || b.flight_info.arr)}
                             </span>
                          </div>
                      ) : (
                          'سایر خدمات'
                      )}
                    </td>
                    <td className="p-4 text-right">
                        <div className="text-xs font-bold text-gray-700">
                            {dates.solar}
                        </div>
                        <div className="text-[10px] text-gray-400" dir="ltr">
                            {dates.greg} | {dates.time}
                        </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${statusInfo.color} ${statusInfo.border}`}>
                          {statusInfo.text}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                        <button 
                          className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-[#058B8C] hover:text-white transition-colors" 
                          title="مشاهده جزئیات"
                        >
                          <Eye size={18}/>
                        </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredBookings.length === 0 && (
                  <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-400 font-bold text-lg">
                          هیچ رزروی با این مشخصات یافت نشد.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- مودال (پاپ‌آپ) جزئیات کامل رزرو --- */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" 
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-[#F8FAFB] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            
            {/* هدر مودال */}
            <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
               <div>
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                      جزئیات سفارش 
                      <span className="text-[#058B8C] font-mono text-lg">
                          #{String(selectedBooking.id).slice(0, 8).toUpperCase()}
                      </span>
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                     <span className="font-bold">ثبت شده در:</span>
                     <span>{formatDualDate(selectedBooking.created_at).solar}</span>
                     <span>|</span>
                     <span dir="ltr">{formatDualDate(selectedBooking.created_at).greg}</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusInfo(selectedBooking.status).color} ${getStatusInfo(selectedBooking.status).border}`}>
                     {getStatusInfo(selectedBooking.status).text}
                  </span>
                  <button 
                    onClick={() => setSelectedBooking(null)} 
                    className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-500 transition"
                  >
                      <X size={20}/>
                  </button>
               </div>
            </div>

            {/* محتوای مودال */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* اطلاعات مشتری */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                     <h4 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                         <User size={18} className="text-[#058B8C]"/> 
                         اطلاعات مسافر / خریدار
                     </h4>
                     <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold block">
                                نام و نام خانوادگی
                            </label>
                            <div className="font-bold text-gray-800">
                                {selectedBooking.customer_name || 'نامشخص'}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold block">
                                شماره تماس
                            </label>
                            <div className="font-mono text-gray-800 font-bold" dir="ltr">
                                {selectedBooking.customer_phone || '---'}
                            </div>
                        </div>
                     </div>
                  </div>

                  {/* اطلاعات مالی */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                     <h4 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                         <CreditCard size={18} className="text-[#058B8C]"/> 
                         وضعیت مالی و پرداخت
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold block">
                                مبلغ کل قابل پرداخت
                            </label>
                            <div className="font-black text-lg text-blue-600">
                                {selectedBooking.amount ? Number(selectedBooking.amount).toLocaleString() : '---'} 
                                <span className="text-xs text-gray-500 mr-1">افغانی</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold block">
                                روش پرداخت
                            </label>
                            <div className="font-bold text-gray-800">
                                {selectedBooking.payment_method || 'تعیین نشده'}
                            </div>
                        </div>
                        <div className="col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
                           <label className="text-[10px] text-gray-400 font-bold block mb-1">
                               کد پیگیری تراکنش بانکی (Transaction ID)
                           </label>
                           <div className="font-mono text-gray-800 font-bold flex flex-wrap items-center justify-between gap-2">
                               <span>
                                   {selectedBooking.transaction_id || 'هنوز ثبت نشده است'}
                               </span>
                               {selectedBooking.receipt_url ? (
                                   <a 
                                      href={selectedBooking.receipt_url} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-xs bg-[#058B8C] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#047070] transition shadow-md"
                                   >
                                      <Receipt size={14}/> مشاهده رسید پرداختی
                                   </a>
                               ) : (
                                   <span className="text-[10px] text-gray-400 font-normal">
                                       رسید آپلود نشده
                                   </span>
                               )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* جزئیات پرواز */}
               {selectedBooking.flight_info && (
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <Plane size={150} className="absolute -left-10 -bottom-10 text-gray-50 opacity-50 rotate-45 pointer-events-none"/>
                    
                    <h4 className="text-sm font-black text-gray-800 mb-6 flex items-center gap-2 border-b pb-2 relative z-10">
                        <PlaneTakeoff size={18} className="text-[#058B8C]"/> 
                        جزئیات دقیق سفر
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                       <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between relative">
                          <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-gray-300 border-t-2 border-dashed border-gray-300"></div>
                          <Plane size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#058B8C] bg-gray-50 px-1"/>
                          
                          <div className="text-center z-10 bg-gray-50 px-2">
                              <div className="text-[10px] text-gray-400 font-bold mb-1">
                                  مبدا
                              </div>
                              <div className="font-black text-xl text-gray-800" dir="ltr">
                                  {getCityName(selectedBooking.flight_info.origin || selectedBooking.flight_info.dep)}
                              </div>
                          </div>
                          
                          <div className="text-center z-10 bg-gray-50 px-2">
                              <div className="text-[10px] text-gray-400 font-bold mb-1">
                                  مقصد
                              </div>
                              <div className="font-black text-xl text-gray-800" dir="ltr">
                                  {getCityName(selectedBooking.flight_info.destination || selectedBooking.flight_info.dest || selectedBooking.flight_info.arr)}
                              </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                           <div>
                               <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                   <Calendar size={12}/> تاریخ درخواستی پرواز
                               </label>
                               <div className="font-bold text-gray-800" dir="ltr">
                                   {selectedBooking.flight_info.date || '---'}
                               </div>
                           </div>
                           <div>
                               <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                   <Clock size={12}/> مدت زمان پرواز
                               </label>
                               <div className="font-bold text-gray-800">
                                   {selectedBooking.flight_info.duration || '---'}
                               </div>
                           </div>
                       </div>

                       <div className="space-y-4">
                           <div>
                               <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                   <Users size={12}/> تعداد مسافر
                               </label>
                               <div className="font-bold text-gray-800">
                                   {selectedBooking.flight_info.passengers || '1'} نفر
                               </div>
                           </div>
                           <div>
                               <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                   <FileText size={12}/> ایرلاین / کلاس
                               </label>
                               <div className="font-bold text-gray-800">
                                   {selectedBooking.flight_info.airline || '---'} 
                                   <span className="text-xs text-gray-400 mr-1">
                                       ({selectedBooking.flight_info.flightClass || 'اکونومی'})
                                   </span>
                               </div>
                           </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* فوتر مودال (عملیات ادمین) */}
            <div className="bg-white p-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 sticky bottom-0">
               <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  {selectedBooking.status !== 'confirmed' && (
                      <button 
                          onClick={() => { 
                              onStatusUpdate(selectedBooking.id, 'confirmed'); 
                              setSelectedBooking({...selectedBooking, status: 'confirmed'}); 
                          }} 
                          className="flex-1 md:flex-none px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg"
                      >
                          <CheckCircle size={18}/> تایید نهایی
                      </button>
                  )}
                  {selectedBooking.status !== 'rejected' && (
                      <button 
                          onClick={() => { 
                              onStatusUpdate(selectedBooking.id, 'rejected'); 
                              setSelectedBooking({...selectedBooking, status: 'rejected'}); 
                          }} 
                          className="flex-1 md:flex-none px-6 py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >
                          <XCircle size={18}/> لغو سفارش
                      </button>
                  )}
               </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}