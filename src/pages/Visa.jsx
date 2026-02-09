import React, { useState } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

export default function Visa({ t, lang, setPage }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      type: `visa_${selectedCountry}`,
      status: 'pending',
      timestamp: Date.now(),
      trackingCode: Math.random().toString(36).substring(7).toUpperCase()
    };
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), data);
      alert(`${lang === 'dr' ? 'درخواست ثبت شد. کد پیگیری:' : 'غوښتنه ثبت شوه. کوډ:'} ${data.trackingCode}`);
      setPage('tracking');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  if (selectedCountry) {
    // فرم درخواست ویزا
    return (
      <div className="max-w-xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
        <button onClick={() => setSelectedCountry(null)} className="mb-6 text-gray-400 flex items-center gap-2 hover:text-[#058B8C]">
          <ArrowLeft size={18}/> {lang === 'dr' ? 'بازگشت' : 'شاته'}
        </button>
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#058B8C]/10 text-[#058B8C] rounded-xl flex items-center justify-center"><FileText /></div>
          {t.common.submit} - {t.visa[selectedCountry]?.name}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmitRequest}>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2">{t.common.name}</label>
            <input name="name" required className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#058B8C]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 mr-2">{t.common.phone}</label>
            <input name="phone" required type="tel" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#058B8C]" />
          </div>
          <button disabled={loading} className="w-full py-5 bg-[#058B8C] text-white font-black rounded-2xl text-lg shadow-lg shadow-[#058B8C]/20 hover:scale-[1.02] active:scale-95 transition-all">
            {loading ? '...' : t.common.submit}
          </button>
        </form>
      </div>
    );
  }

  // لیست ویزاها
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-[#058B8C]">{t.nav.visa}</h2>
        <p className="text-gray-500">{lang === 'dr' ? "خدمات اخذ ویزا با کمترین ریسک ریجکتی" : "د ویزو ترلاسه کول په خورا ډاډ سره"}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(t.visa).map(([key, val]) => (
          <div key={key} className="bg-white rounded-3xl p-8 border hover:border-[#D4AF37] transition-all group">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <span className="text-3xl">📍</span> {val.name}
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{lang === 'dr' ? "مدارک لازم" : "اړین اسناد"}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{val.docs}</p>
              </div>
              <button onClick={() => setSelectedCountry(key)} className="w-full py-3 bg-[#058B8C] text-white rounded-xl font-bold group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                {t.common.submit}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}