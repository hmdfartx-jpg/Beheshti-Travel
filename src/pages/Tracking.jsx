import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

export default function Tracking({ t, lang }) {
  const [trackResult, setTrackResult] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    const code = new FormData(e.target).get('code');
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), where('trackingCode', '==', code.trim().toUpperCase()));
    const s = await getDocs(q);
    setTrackResult(s.docs.map(d => d.data()));
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black">{t.nav.tracking}</h2>
        <p className="text-gray-400 font-medium">{lang === 'dr' ? "کد پیگیری خود را وارد کنید" : "خپل تعقیب کوډ دننه کړئ"}</p>
      </div>
      <form className="flex gap-2" onSubmit={handleTrack}>
        <input name="code" className="flex-1 px-8 py-5 rounded-3xl bg-white shadow-xl border-none outline-none focus:ring-2 focus:ring-[#058B8C] text-center font-black text-xl uppercase tracking-widest" placeholder="E.G. AB123" required />
        <button className="bg-[#058B8C] text-white px-8 rounded-3xl shadow-xl hover:scale-105 transition-transform"><Search /></button>
      </form>

      <div className="space-y-4 mt-10">
        {trackResult?.map((res, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border flex items-center justify-between">
            <div>
              <h4 className="font-black text-xl">{t.nav[res.type] || res.type}</h4>
              <p className="text-sm text-gray-400 mt-1">{res.name}</p>
            </div>
            <div className={`px-6 py-2 rounded-full text-xs font-black ${res.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
              {t.status[res.status]}
            </div>
          </div>
        ))}
        {trackResult && trackResult.length === 0 && <p className="text-center text-red-500">یافت نشد / ونه موندل شو</p>}
      </div>
    </div>
  );
}