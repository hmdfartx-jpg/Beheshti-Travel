import React from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

export default function Scholarship({ t, lang, setPage }) {
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('gpa') + ' - ' + fd.get('major'), // ذخیره اطلاعات در فیلدهای موجود
      phone: fd.get('phone'),
      type: 'scholarship_counseling',
      status: 'pending',
      timestamp: Date.now(),
      trackingCode: Math.random().toString(36).substring(7).toUpperCase()
    };
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), data);
      alert(`${lang === 'dr' ? 'درخواست ثبت شد. کد پیگیری:' : 'غوښتنه ثبت شوه. کوډ:'} ${data.trackingCode}`);
      setPage('tracking');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in">
      <div className="bg-[#058B8C] rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-black">{t.scholarship.smart_title}</h2>
          <p className="opacity-80 leading-relaxed">{lang === 'dr' ? "با وارد کردن اطلاعات تحصیلی خود، بهترین بورسیه‌های دانشگاه‌های معتبر را دریافت کنید." : "خپل تحصیلي معلومات دننه کړئ او غوره بورسونه ترلاسه کړئ."}</p>
        </div>
        <form className="w-full md:w-80 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] space-y-4 border border-white/20" onSubmit={handleSubmitRequest}>
          <input name="gpa" placeholder={t.scholarship.gpa} className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 outline-none border border-transparent focus:border-white/40" />
          <input name="major" placeholder={t.scholarship.major} className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 outline-none border border-transparent focus:border-white/40" />
          <input name="phone" placeholder={t.common.phone} className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/60 outline-none border border-transparent focus:border-white/40" />
          <button className="w-full py-4 bg-[#D4AF37] text-black font-black rounded-xl hover:bg-white transition-all">
             {t.scholarship.result_btn}
          </button>
        </form>
      </div>
    </div>
  );
}