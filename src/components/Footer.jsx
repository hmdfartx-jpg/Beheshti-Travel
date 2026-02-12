import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Send, Link as LinkIcon, MessageCircle } from 'lucide-react';

export default function Footer({ t, lang, settings }) {
  // استفاده از تنظیمات تماس که الان در بخش "درباره ما" ادمین تنظیم می‌شود
  const contact = settings?.contact || {};
  const about = settings?.about || {};
  const usefulLinks = settings?.useful_links || [];
  
  // انتخاب لوگو بر اساس زبان
  const logoSrc = lang === 'en' 
    ? (settings?.navbar?.logo_en || '') 
    : (settings?.navbar?.logo_dr || '');

  // تابع کمکی برای ترجمه متون هاردکد شده
  const getText = (dr, ps, en) => {
    if (lang === 'en') return en;
    if (lang === 'ps') return ps;
    return dr;
  };

  // تابع کمکی برای خواندن فیلدهای تنظیمات بر اساس زبان
  const getSettingText = (obj, field) => {
      if (!obj) return '';
      if (lang === 'en') return obj[`${field}_en`] || obj[field];
      if (lang === 'ps') return obj[`${field}_ps`] || obj[`${field}_dr`] || obj[field];
      return obj[`${field}_dr`] || obj[field];
  };

  return (
    <footer className="bg-[#058B8C] text-white pt-16 pb-8 mt-20 rounded-t-[3rem] relative overflow-hidden">
      {/* پترن پس‌زمینه */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* ستون اول: لوگو و درباره ما */}
          <div className="space-y-6">
            
            <div className="mb-4">
                 {logoSrc ? (
                    <img 
                        src={logoSrc} 
                        alt="Company Logo" 
                        className="h-20 w-auto object-contain bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10"
                    />
                ) : (
                    <div className="text-2xl font-black">LOGO</div>
                )}
             </div>

            {/* عنوان "درباره ما" */}
            <h4 className="font-bold text-white text-sm">
                {getSettingText(about, 'title') || getText("درباره ما", "زموږ په اړه", "About Us")}
            </h4>
            
            <p className="text-white/90 text-xs leading-6 text-justify">
              {getSettingText(about, 'desc') || "..."}
            </p>
            
            {/* دکمه‌های سوشال هوشمند (اگر در ادمین وارد شده باشند) */}
            <div className="flex gap-4">
               {contact.instagram && (
                   <a href={`https://instagram.com/${contact.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                       <Instagram size={18}/>
                   </a>
               )}
               {contact.whatsapp && (
                   <a href={`https://wa.me/${contact.whatsapp.replace(/\+/g,'')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors">
                       <MessageCircle size={18}/>
                   </a>
               )}
               {contact.telegram && (
                   <a href={`https://t.me/${contact.telegram.replace('@','')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#229ED9] transition-colors">
                       <Send size={18}/>
                   </a>
               )}
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

          {/* ستون سوم: تماس با ما (دیپ لینک و هوشمند) */}
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
                   {/* دیپ لینک تلفن */}
                   <a href={`tel:${contact.phone}`} className="font-bold dir-ltr text-right hover:text-[#D4AF37] transition-colors" style={{ direction: 'ltr', textAlign: lang === 'en' ? 'left' : 'right' }}>
                       {contact.phone || '...'}
                   </a>
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
                   {/* دیپ لینک ایمیل */}
                   <a href={`mailto:${contact.email}`} className="font-bold hover:text-[#D4AF37] transition-colors">{contact.email || '...'}</a>
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
                   {/* دیپ لینک آدرس به گوگل مپ */}
                   <a 
                     href={contact.map_link || '#'} 
                     target="_blank" 
                     rel="noreferrer"
                     className="font-bold leading-relaxed hover:text-[#D4AF37] transition-colors cursor-pointer"
                   >
                       {getSettingText(contact, 'address') || '...'}
                   </a>
                </div>
               </li>
            </ul>
          </div>

          {/* ستون چهارم: لینک‌های مفید (داینامیک از ادمین) */}
          <div>
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                 <span className="w-8 h-1 bg-[#D4AF37] rounded-full"></span>
                 {getText("لینک‌های مفید", "ګټور لینکونه", "Useful Links")}
             </h3>
             <ul className="space-y-4 text-sm text-white/90">
                {usefulLinks.length > 0 ? usefulLinks.map((link, idx) => (
                    <li key={idx}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 group">
                            <LinkIcon size={14} className="text-[#D4AF37] group-hover:rotate-45 transition-transform"/> 
                            {getSettingText(link, 'title') || link.title_dr}
                        </a>
                    </li>
                )) : (
                    // فال‌بک استاتیک اگر لینکی در ادمین نباشد
                    <>
                        <li>
                             <a href="https://passport.gov.af/" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2 group">
                                <LinkIcon size={14} className="text-[#D4AF37] group-hover:rotate-45 transition-transform"/> 
                                {getText("ریاست پاسپورت", "د پاسپورت ریاست", "Passport Directorate")}
                            </a>
                        </li>
                    </>
                )}
             </ul>
          </div>

        </div>

        {/* کپی رایت */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>{getSettingText(contact, 'copyright')}</p>
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