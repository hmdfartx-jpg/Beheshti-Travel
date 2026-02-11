import React from 'react';
import { Truck, Calculator } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

export default function Cargo({ t, lang, setPage }) {
  const isLtr = lang === 'en';

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: `${fd.get('weight')}kg - ${fd.get('type')}`,
      phone: "Not Provided", 
      type: 'cargo_estimate',
      status: 'pending',
      timestamp: Date.now(),
      trackingCode: Math.random().toString(36).substring(7).toUpperCase()
    };
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), data);
      
      // پیام موفقیت بر اساس زبان
      let successMsg = '';
      if (lang === 'en') successMsg = `Request submitted. Tracking Code: ${data.trackingCode}`;
      else if (lang === 'ps') successMsg = `غوښتنه ثبت شوه. کوډ: ${data.trackingCode}`;
      else successMsg = `درخواست تخمین ثبت شد. کد پیگیری: ${data.trackingCode}`;

      alert(successMsg);
      setPage('tracking');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100" dir={isLtr ? 'ltr' : 'rtl'}>
       <div className="flex items-center gap-4 mb-8">
         <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-2xl flex items-center justify-center">
           <Truck size={32} />
         </div>
         <h2 className="text-3xl font-black">{t.cargo.estimate}</h2>
       </div>
       <form className="space-y-6" onSubmit={handleSubmitRequest}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className={`text-sm font-bold text-gray-500 ${isLtr ? 'ml-2' : 'mr-2'}`}>{t.cargo.weight}</label>
               <input name="weight" type="number" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#D4AF37]" />
             </div>
             <div className="space-y-2">
               <label className={`text-sm font-bold text-gray-500 ${isLtr ? 'ml-2' : 'mr-2'}`}>{t.cargo.type}</label>
               <select name="type" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#D4AF37]">
                 <option value="Personal">Personal / شخصی</option>
                 <option value="Commercial">Commercial / تجاری</option>
                 <option value="Fragile">Fragile / شکستنی</option>
               </select>
             </div>
           </div>
           <button className="w-full py-5 bg-[#058B8C] text-white font-black rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-[#047070] transition-colors">
             <Calculator size={24} /> {t.cargo.calculate}
           </button>
       </form>
    </div>
  );
}