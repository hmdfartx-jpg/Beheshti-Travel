import React, { useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Send, Globe, Shield, Users, Award, Map, Target, Eye, Facebook, Instagram, Clock, CheckCircle, Save } from 'lucide-react';

export default function About({ t, lang, settings }) {
  const isLtr = lang === 'en';

  // اسکرول به بالا هنگام بارگذاری
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- دیکشنری کلمات ثابت ---
  const staticLabels = {
    aboutTitle: { dr: "درباره بهشتی تراول", ps: "د بهشتي ټراول په اړه", en: "About Beheshti Travel" },
    ourTeam: { dr: "تیم متخصص ما", ps: "زموږ مسلکي ټیم", en: "Our Professional Team" },
    whyUs: { dr: "چرا ما را انتخاب کنید؟", ps: "ولې موږ غوره کړئ؟", en: "Why Choose Us?" },
    contactUs: { dr: "ارتباط با ما", ps: "موږ سره اړیکه", en: "Get In Touch" },
    headOffice: { dr: "دفتر مرکزی", ps: "مرکزی دفتر", en: "Head Office" },
    agencies: { dr: "نمایندگی‌", ps: "نمایندګۍ", en: "Our Branche" },
    address: { dr: "آدرس", ps: "پته", en: "Address" },
    phone: { dr: "تلفن", ps: "تلیفون", en: "Phone" },
    map: { dr: "موقعیت ما روی نقشه", ps: "په نقشه کې زموږ موقعیت", en: "Location on Map" },
    saveContact: { dr: "ذخیره در مخاطبین", ps: "په اړیکو کې خوندي کړئ", en: "Save Contact" },
    mission: { dr: "ماموریت ما", ps: "زموږ ماموریت", en: "Our Mission" },
    vision: { dr: "چشم‌انداز ما", ps: "زموږ لیدلوری", en: "Our Vision" },
    // 👇 عناوین جدید سه زبانه 👇
    mainBranch: { dr: "شعبه مرکزی", ps: "مرکزی څانګه", en: "Main Branch" },
    agencyTag: { dr: "شعبه گولایی دواخانه", ps: "د دواخانه ګولایی څانګه", en: "Golaei Dawakhana Branch" },
    
    missionDesc: { 
      dr: "ارائه خدمات مسافرتی با بالاترین کیفیت و قیمت مناسب برای هموطنان.", 
      ps: "هیوادوالو ته د لوړ کیفیت او مناسب قیمت سره د سفر خدمات وړاندې کول.", 
      en: "Providing travel services with the highest quality and reasonable prices."
    },
    visionDesc: { 
      dr: "تبدیل شدن به معتبرترین برند گردشگری در منطقه.", 
      ps: "په سیمه کې د ګرځندوی ترټولو معتبر برانډ بدلیدل.", 
      en: "Becoming the most trusted tourism brand in the region."
    }
  };

  // تابع کمکی برای انتخاب متن از دیکشنری
  const L = (key) => {
    if (lang === 'en') return staticLabels[key].en;
    if (lang === 'ps') return staticLabels[key].ps;
    return staticLabels[key].dr;
  };

  // تابع دریافت متن هوشمند از دیتابیس
  const getDbText = (obj, field) => {
    if (!obj) return "";
    if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
    if (lang === 'ps' && obj[`${field}_ps`]) return obj[`${field}_ps`];
    return obj[`${field}_dr`] || obj[field] || "";
  };

  // تابع تولید فایل vCard
  const handleSaveContact = (name, phone, address, email, website) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=WORK,VOICE:${phone}
ADR;TYPE=WORK:;;${address};;;;
EMAIL:${email || ''}
URL:${website || 'nvplast.com'}
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const teamMembers = settings?.team || [];
  const agencies = settings?.agencies || [];
  const aboutData = settings?.about || {};
  const contactData = settings?.contact || {};
  const whyUsData = settings?.why_us || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-[Vazirmatn]" dir={isLtr ? 'ltr' : 'rtl'}>
      
      {/* 1. بخش هیرو (درباره ما) */}
      <section id="about" className="relative bg-gradient-to-br from-[#058B8C] to-[#046566] text-white pt-32 pb-24 rounded-b-[4rem] shadow-2xl overflow-hidden -mt-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        {/* items-stretch: این کلاس حیاتی است تا ارتفاع ستون عکس با ستون متن برابر شود */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-stretch gap-16">
            
            {/* ستون متن: کلاس justify-center حذف شد تا ارتفاع بر اساس محتوا باشد */}
            <div className="flex-1 space-y-8 text-center lg:text-start flex flex-col">
                <div>
                    <span className="inline-block bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-lg shadow-yellow-500/20">
                        {L('aboutTitle')}
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black leading-tight drop-shadow-md mt-4">
                        {getDbText(aboutData, 'title') || (isLtr ? "Your Journey Begins Here" : "سفر رویایی شما از اینجا آغاز می‌شود")}
                    </h1>
                </div>
                
                <p className="text-lg text-blue-50 leading-loose text-justify opacity-90 whitespace-pre-line">
                    {getDbText(aboutData, 'desc') || "..."}
                </p>
                
                {/* ماموریت و چشم‌انداز: mt-auto حذف شد تا به متن بالا بچسبد و ارتفاع کاذب ایجاد نکند */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition h-full flex flex-col [cite: 1435]">
                        <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold">
                            <Target size={20}/> 
                            {getDbText(aboutData, 'mission_title') || L('mission')}
                        </div>
                        <p className="text-xs text-blue-50 leading-relaxed text-justify flex-1">
                            {getDbText(aboutData, 'mission_desc') || L('missionDesc')}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition h-full flex flex-col [cite: 1437]">
                        <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold">
                            <Eye size={20}/> 
                            {getDbText(aboutData, 'vision_title') || L('vision')}
                        </div>
                        <p className="text-xs text-blue-50 leading-relaxed text-justify flex-1">
                            {getDbText(aboutData, 'vision_desc') || L('visionDesc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* ستون عکس: ارتفاع خودکار روی دسکتاپ تا تابع متن باشد */}
            <div className="flex-1 w-full relative min-h-[400px] lg:min-h-auto lg:h-auto [cite: 1441]">
                {/* المان تزئینی پشت عکس */}
                <div className="absolute inset-0 bg-[#D4AF37] rounded-[3rem] rotate-6 opacity-30 blur-sm scale-95 h-full"></div>
                
                {/* کانتینر اصلی عکس با h-full */}
                <div className="h-full rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl relative z-10">
                    <img 
                        src={settings?.about?.image || settings?.hero?.image || "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1974"} 
                        alt="About" 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#058B8C]/80 to-transparent"></div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. چرا ما */}
      <section className="max-w-7xl mx-auto px-4 mt-12 relative z-20">
        <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-xl border border-gray-100">
            <div className="text-center mb-10">
                 <h2 className="text-2xl md:text-3xl font-black text-gray-800">{L('whyUs')}</h2>
            </div>
            
            {whyUsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {whyUsData.map((item, idx) => {
                        const IconMap = { Shield, Globe, Users, Award, Target, Eye, Clock, CheckCircle };
                        const IconComponent = IconMap[item.icon] || Shield; 

                        return (
                            <div key={idx} className="group text-center space-y-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-blue-50 text-[#058B8C] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <IconComponent size={32}/> 
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">
                                    {getDbText(item, 'title')}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {getDbText(item, 'desc')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400">اطلاعات در حال بارگذاری...</div>
            )}
        </div>
      </section>

      {/* 3. تیم ما */}
      <section id="team" className="py-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center mb-12">
                <span className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-2">Team</span>
                <h2 className="text-3xl font-black text-[#1e3a8a]">{L('ourTeam')}</h2>
                <div className="w-12 h-1.5 bg-[#058B8C] rounded-full mt-4"></div>
            </div>
            
            {teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-[2.5rem] p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative bg-gray-100">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Users size={64}/></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                                    <div className="flex gap-2">
                                        {member.whatsapp && (
                                            <a href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noreferrer" className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-[#25D366] cursor-pointer transition">
                                                <MessageCircle size={16}/>
                                            </a>
                                        )}
                                        {member.phone && (
                                            <a href={`tel:${member.phone}`} className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-[#058B8C] cursor-pointer transition">
                                                <Phone size={16}/>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-gray-800">
                                     {isLtr ? (member.name_en || member.name) : (member.name_fa || member.name)}
                                </h3>
                                <p className="text-sm font-bold text-[#058B8C] mt-1 uppercase tracking-wide">
                                     {getDbText(member, 'role')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-10">عضوی یافت نشد.</div>
            )}
        </div>
      </section>

      {/* 4. تماس با ما */}
      <section id="contact" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-black text-gray-800">{L('contactUs')}</h2>
            <p className="text-gray-500 mt-2 font-medium">
                 {lang==='en'?"We are always available to answer you":"ما همیشه در دسترس هستیم"}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* کارت ۱: دفتر مرکزی */}
            <div className="bg-white group hover:bg-[#058B8C] text-gray-800 hover:text-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-500 flex flex-col h-full">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#058B8C]/10 rounded-bl-[3rem] transition-all group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:bg-[#058B8C] duration-500"></div>
                
               <div className="relative z-10 flex flex-col h-full">
                    {/* بخش بالا: هدر */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-[#058B8C] text-white group-hover:bg-white group-hover:text-[#058B8C] rounded-2xl flex items-center justify-center shadow-lg transition-colors">
                             <Shield size={32}/>
                        </div>
                        <div>
                             <h3 className="text-2xl font-black">{L('headOffice')}</h3>
                             <span className="text-xs font-bold opacity-60 uppercase tracking-widest">{L('mainBranch')}</span>
                        </div>
                    </div>
                     
                    {/* بخش میانی: اطلاعات تماس (پر کننده فضا) */}
                    <div className="space-y-6 flex-1">
                        <div className="flex items-start gap-4">
                            <MapPin className="shrink-0 mt-1 opacity-70"/>
                             <div>
                                <span className="block text-xs font-bold opacity-60 mb-1">{L('address')}</span>
                                <p className="font-bold leading-relaxed">{getDbText(contactData, 'address')}</p>
                             </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                             <Phone className="shrink-0 opacity-70"/>
                            <div>
                                <span className="block text-xs font-bold opacity-60 mb-1">{L('phone')}</span>
                                 <a href={`tel:${contactData.phone}`} className="font-bold text-lg dir-ltr block hover:opacity-80">{contactData.phone}</a>
                            </div>
                        </div>
                    </div>

                    {/* بخش پایین: دکمه‌ها (چسبیده به پایین) */}
                    <div className="mt-6">
                        {/* دکمه‌های شبکه اجتماعی */}
                        <div className="flex gap-3 mb-3">
                            {contactData.whatsapp && (
                                <a href={`https://wa.me/${contactData.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#25D366] text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition border border-transparent">
                                    <MessageCircle size={20}/> WhatsApp
                                </a>
                            )}
                            {contactData.telegram && (
                                <a href={`https://t.me/${contactData.telegram}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#229ED9] text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition border border-transparent">
                                    <Send size={20}/> Telegram
                                </a>
                            )}
                        </div>
                        
                        <div className="flex gap-3">
                            {/* دکمه نقشه */}
                            {contactData.map_link && (
                                <a href={contactData.map_link} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-gray-100 group-hover:bg-white/20 text-gray-600 group-hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 group-hover:border-white/30 transition">
                                    <Map size={18}/> {L('map')}
                                </a>
                            )}
                            {/* دکمه ذخیره مخاطب */}
                            <button 
                                onClick={() => handleSaveContact("Beheshti Travel - Head Office", contactData.phone, getDbText(contactData, 'address'))}
                                className="flex-1 py-3 bg-gray-800 text-white group-hover:bg-white group-hover:text-[#058B8C] rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition"
                            >
                                <Save size={18}/> {L('saveContact')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* کارت ۲: نمایندگی (رنگی -> سفید) */}
            {agencies.length > 0 ? agencies.map((agency, idx) => (
                <div key={idx} className="bg-[#058B8C] group hover:bg-white text-white hover:text-gray-800 rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-500 flex flex-col h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[3rem] transition-all group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:bg-white duration-500"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        {/* بخش بالا: هدر */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-white text-[#058B8C] group-hover:bg-[#058B8C] group-hover:text-white rounded-2xl flex items-center justify-center shadow-lg transition-colors">
                                <Globe size={32}/>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">{L('agencies')}</h3>
                                <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{L('agencyTag')}</span>
                            </div>
                        </div>

                        {/* بخش میانی: اطلاعات تماس (پر کننده فضا) */}
                        <div className="space-y-6 flex-1">
                            <div className="flex items-start gap-4">
                                <MapPin className="shrink-0 mt-1 opacity-70"/>
                                <div>
                                    <span className="block text-xs font-bold opacity-60 mb-1">{L('address')}</span>
                                    <h4 className="font-bold text-lg mb-1">{getDbText(agency, 'name')}</h4>
                                    <p className="font-medium leading-relaxed opacity-90">{getDbText(agency, 'address')}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Phone className="shrink-0 opacity-70"/>
                                <div>
                                    <span className="block text-xs font-bold opacity-60 mb-1">{L('phone')}</span>
                                    {agency.phone ? (
                                        <a href={`tel:${agency.phone}`} className="font-bold text-lg dir-ltr block hover:opacity-80">{agency.phone}</a>
                                    ) : (
                                        <span className="opacity-50">---</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* بخش پایین: دکمه‌ها (چسبیده به پایین) */}
                        <div className="mt-6">
                            {/* شبکه‌های اجتماعی */}
                            <div className="flex gap-3 mb-3">
                                {agency.whatsapp && (
                                    <a href={`https://wa.me/${agency.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#25D366] text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition border border-transparent">
                                        <MessageCircle size={20}/> WhatsApp
                                    </a>
                                )}
                                {agency.telegram && (
                                    <a href={`https://t.me/${agency.telegram}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#229ED9] text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition border border-transparent">
                                        <Send size={20}/> Telegram
                                    </a>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {agency.map_link && (
                                    <a href={agency.map_link} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-white/20 text-white group-hover:bg-gray-100 group-hover:text-gray-600 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-dashed border-white/20 group-hover:border-gray-200 transition">
                                        <Map size={18}/> {L('map')}
                                    </a>
                                )}
                                <button 
                                    onClick={() => handleSaveContact(getDbText(agency, 'name'), agency.phone, getDbText(agency, 'address'))}
                                    className="flex-1 py-3 bg-white/20 text-white group-hover:bg-gray-800 group-hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition"
                                >
                                    <Save size={18}/> {L('saveContact')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-10 border-2 border-dashed border-white/20 rounded-[3rem] bg-gray-50 flex items-center justify-center h-full">
                    <span className="text-gray-400">
                        {isLtr ? "No agencies listed." : "هنوز نمایندگی ثبت نشده است."}
                    </span>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}