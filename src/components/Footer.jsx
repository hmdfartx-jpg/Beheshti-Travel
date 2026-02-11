import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Send } from 'lucide-react';

export default function Footer({ t, lang, settings }) {
  // استفاده از تنظیمات دریافتی یا پیش‌فرض
  const contact = settings?.contact || {};
  const about = settings?.about || {};
  const general = settings?.general || {};

  // تابع کمکی برای ترجمه متون هاردکد شده در فوتر که در فایل translations نیستند
  const getText = (dr, ps, en) => {
    if (lang === 'en') return en;
    if (lang === 'ps') return ps;
    return dr;
  };

  return (
    // تغییر رنگ پس‌زمینه به رنگ سازمانی (#058B8C)
    // جهت صفحه (ltr/rtl) به صورت خودکار از کامپوننت والد (App) به ارث برده می‌شود
    <footer className="bg-[#058B8C] text-white pt-16 pb-8 mt-20 rounded-t-[3rem] relative overflow-hidden">
      {/* پترن پس‌زمینه */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* ستون اول: درباره ما */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-inner">
                  {general.logoText || 'B'}
               </div>
               <div className="flex flex-col">
                 <span className="font-black text-xl tracking-tight">
                    {/* اگر نام برند چندزبانه در تنظیمات بود استفاده کن، وگرنه پیش‌فرض */}
                    {getText(general.brandName || "بهشتی تراول", general.brandName || "بهشتی تراول", "Beheshti Travel")}
                 </span>
                 <span className="text-[10px] text-white/80 font-bold tracking-widest opacity-90">TRAVEL AGENCY</span>
               </div>
            </div>
            {/* عنوان "درباره ما" را اگر در ترجمه موجود بود از آنجا بردار، وگرنه از settings */}
            <h4 className="font-bold text-white text-sm">
                {about.title || getText("درباره ما", "زموږ په اړه", "About Us")}
            </h4>
            <p className="text-white/90 text-xs leading-6 text-justify">
              {/* استفاده از ترجمه موجود در t.footer یا فال‌بک به تنظیمات */}
              {t.footer?.about_desc || about.desc || "..."}
            </p>
            <div className="flex gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors"><Instagram size={18}/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors"><Facebook size={18}/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors"><Send size={18}/></a>
            </div>
          </div>

          {/* ستون دوم: دسترسی سریع */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
               <span className="w-8 h-1 bg-[#D4AF37] rounded-full"></span>
               {t.footer?.quick_links || getText("دسترسی سریع", "چټک لاسرسی", "Quick Links")}
            </h3>
            <ul className="space-y-4 text-sm text-white/90">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-current rounded-full"></span> {t.nav?.home}</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-current rounded-full"></span> {t.nav?.tickets}</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-current rounded-full"></span> {t.nav?.visa}</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-current rounded-full"></span> {t.nav?.news}</a></li>
            </ul>
          </div>

          {/* ستون سوم: تماس با ما */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#D4AF37] rounded-full"></span>
               {t.footer?.contact_us || getText("تماس با ما", "موږ سره اړیکه", "Contact Us")}
            </h3>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors shrink-0">
                   <Phone size={18}/>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/70 mb-1">{t.common?.phone}</span>
                   {/* شماره تلفن معمولاً چپ به راست است */}
                   <span className="font-bold dir-ltr text-right" style={{ direction: 'ltr', textAlign: lang === 'en' ? 'left' : 'right' }}>
                       {contact.phone}
                   </span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors shrink-0">
                   <Mail size={18}/>
                 </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/70 mb-1">
                       {getText("ایمیل", "بریښنالیک", "Email")}
                   </span>
                   <span className="font-bold">{contact.email}</span>
                </div>
               </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors shrink-0">
                   <MapPin size={18}/>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/70 mb-1">
                       {getText("آدرس", "پته", "Address")}
                   </span>
                   <span className="font-bold leading-relaxed">{contact.address}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* ستون چهارم: نماد اعتماد */}
          <div className="bg-white/5 rounded-3xl p-6 text-center border border-white/10">
             <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛡️</div>
             <h4 className="font-bold mb-2">
                 {getText("ضمانت بهترین قیمت", "د غوره قیمت تضمین", "Best Price Guarantee")}
             </h4>
             <p className="text-xs text-white/80 mb-4">
                 {getText(
                     "ما تضمین می‌کنیم که بهترین نرخ بلیط و خدمات ویزا را ارائه می‌دهیم.",
                     "موږ تضمین کوو چې د ټکټ او ویزې خدماتو غوره نرخ وړاندې کوو.",
                     "We guarantee the best rates for tickets and visa services."
                 )}
             </p>
           </div>
        </div>

        {/* کپی رایت */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>{contact.copyright}</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white">
                 {getText("قوانین و مقررات", "قوانین او مقررات", "Terms & Conditions")}
             </a>
             <a href="#" className="hover:text-white">
                 {getText("حریم خصوصی", "محرمیت", "Privacy Policy")}
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}