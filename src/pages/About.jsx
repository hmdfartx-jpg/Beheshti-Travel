import React, { useEffect } from 'react';
import { MapPin, Phone, MessageCircle, Send, Globe, Shield, Users, Award, Map, Target, Eye, Facebook, Instagram } from 'lucide-react';

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
    agencies: { dr: "نمایندگی‌ها", ps: "نمایندګۍ", en: "Our Branches" },
    address: { dr: "آدرس", ps: "پته", en: "Address" },
    phone: { dr: "تلفن", ps: "تلیفون", en: "Phone" },
    map: { dr: "مسیریابی", ps: "نقشه", en: "Map" },
    mission: { dr: "ماموریت ما", ps: "زموږ ماموریت", en: "Our Mission" },
    vision: { dr: "چشم‌انداز ما", ps: "زموږ لیدلوری", en: "Our Vision" },
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

  // تابع کمکی برای انتخاب متن از دیکشنری بالا
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
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-start">
                <span className="inline-block bg-[#D4AF37] text-black px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-lg shadow-yellow-500/20">
                    {L('aboutTitle')}
                </span>
                <h1 className="text-4xl lg:text-6xl font-black leading-tight drop-shadow-md">
                    {getDbText(aboutData, 'title') || (isLtr ? "Your Journey Begins Here" : "سفر رویایی شما از اینجا آغاز می‌شود")}
                </h1>
                <p className="text-lg text-blue-50 leading-loose text-justify opacity-90 whitespace-pre-line">
                    {getDbText(aboutData, 'desc') || "..."}
                </p>
                
                {/* ماموریت و چشم‌انداز (از دیتابیس اگر باشد، وگرنه پیش‌فرض) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition">
                        <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold">
                            <Target size={20}/> 
                            {getDbText(aboutData, 'mission_title') || L('mission')}
                        </div>
                        <p className="text-xs text-blue-50 leading-relaxed">
                            {getDbText(aboutData, 'mission_desc') || L('missionDesc')}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition">
                        <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold">
                            <Eye size={20}/> 
                            {getDbText(aboutData, 'vision_title') || L('vision')}
                        </div>
                        <p className="text-xs text-blue-50 leading-relaxed">
                            {getDbText(aboutData, 'vision_desc') || L('visionDesc')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full max-w-lg relative">
                <div className="absolute inset-0 bg-[#D4AF37] rounded-[3rem] rotate-6 opacity-30 blur-sm scale-95"></div>
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl relative z-10">
                    <img 
                        src={settings?.hero?.image || "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1974"} 
                        alt="About" 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#058B8C]/80 to-transparent"></div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. چرا ما (داینامیک از دیتابیس) */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
            <div className="text-center mb-10">
                 <h2 className="text-2xl md:text-3xl font-black text-gray-800">{L('whyUs')}</h2>
            </div>
            
            {whyUsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {whyUsData.map((item, idx) => (
                        <div key={idx} className="group text-center space-y-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-blue-50 text-[#058B8C] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <Shield size={32}/> {/* آیکون ثابت برای سادگی، یا می‌شود از نام آیکون استفاده کرد */}
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                {getDbText(item, 'title')}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {getDbText(item, 'desc')}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                // فال‌بک استاتیک اگر دیتابیس خالی بود
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group text-center space-y-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 mx-auto bg-blue-50 text-[#058B8C] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                           <Shield size={32}/>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{isLtr ? "Secure & Reliable" : (lang==='ps'?"خوندي او باوري":"امن و مطمئن")}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{isLtr ? "Guaranteed services with official licenses." : (lang==='ps'?"تضمین شوي خدمتونه د رسمي جوازونو سره.":"خدمات تضمینی با مجوزهای رسمی.")}</p>
                    </div>
                    {/* ... سایر آیتم‌های استاتیک ... */}
                     <div className="group text-center space-y-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 mx-auto bg-orange-50 text-[#f97316] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                           <Globe size={32}/>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{isLtr ? "Global Coverage" : (lang==='ps'?"نړیوال پوښښ":"پوشش جهانی")}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{isLtr ? "Visa and tickets for all countries." : (lang==='ps'?"د ټولو هیوادونو لپاره ویزې او ټکټونه.":"ویزا و تکت برای تمام کشورها.")}</p>
                    </div>
                     <div className="group text-center space-y-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 mx-auto bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                           <Users size={32}/>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{isLtr ? "Expert Team" : (lang==='ps'?"مسلکي ټیم":"تیم متخصص")}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{isLtr ? "Consultants ready to help 24/7." : (lang==='ps'?"مشاورین ۲۴/۷ ستاسو مرستې ته چمتو دي.":"مشاورین آماده پاسخگویی ۲۴/۷.")}</p>
                    </div>
                </div>
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
                                {/* اورلی شبکه‌های اجتماعی */}
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
                                {/* اصلاح: نمایش نام بر اساس زبان انتخاب شده */}
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

      {/* 4. تماس با ما (۲ کارت اصلی) */}
      <section id="contact" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-black text-gray-800">{L('contactUs')}</h2>
            <p className="text-gray-500 mt-2 font-medium">
                 {lang==='en'?"We are always available to answer you":"ما همیشه در دسترس هستیم"}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* کارت ۱: دفتر مرکزی */}
            <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#058B8C]/10 rounded-bl-[3rem] transition-all group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:bg-[#058B8C] duration-500"></div>
                <div className="relative z-10 group-hover:text-white transition-colors duration-500">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-[#058B8C] text-white group-hover:bg-white group-hover:text-[#058B8C] rounded-2xl flex items-center justify-center shadow-lg transition-colors">
                            <Shield size={32}/>
                        </div>
                        <div>
                             <h3 className="text-2xl font-black">{L('headOffice')}</h3>
                            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Main Branch</span>
                        </div>
                    </div>
                     
                    <div className="space-y-6">
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

                        {/* دکمه‌های شبکه اجتماعی دفتر مرکزی */}
                        <div className="flex gap-3 pt-4">
                            {contactData.whatsapp && (
                                <a href={`https://wa.me/${contactData.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#25D366] text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition">
                                     <MessageCircle size={20}/> WhatsApp
                                </a>
                            )}
                            {contactData.telegram && (
                                <a href={`https://t.me/${contactData.telegram}`} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#229ED9] text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition">
                                     <Send size={20}/> Telegram
                                </a>
                            )}
                        </div>
                         
                        {/* مپ دفتر مرکزی */}
                        {contactData.map_link && (
                            <a href={contactData.map_link} target="_blank" rel="noreferrer" className="block w-full py-3 bg-gray-100 text-gray-600 group-hover:bg-white/20 group-hover:text-white rounded-xl font-bold text-center border-2 border-dashed border-gray-200 group-hover:border-white/30 transition">
                                {L('map')}
                             </a>
                        )}
                    </div>
                </div>
            </div>

            {/* کارت ۲: نمایندگی‌ها (لیست) */}
            <div className="bg-[#1e3a8a] text-white rounded-[3rem] p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-[-30%] translate-y-[-30%]"></div>
                
                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-2xl flex items-center justify-center shadow-lg">
                       <Globe size={32}/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">{L('agencies')}</h3>
                        <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Global Reach</span>
                    </div>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                    {agencies.length > 0 ? agencies.map((agency, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-colors">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                                  {getDbText(agency, 'name')}
                            </h4>
                        
                             <p className="text-sm text-blue-100 mb-4 opacity-80 flex items-start gap-2">
                                <MapPin size={14} className="mt-1 shrink-0"/>
                                {getDbText(agency, 'address')}
                             </p>
                            
                            {/* 🔥 اصلاح بخش تلفن: بجای map از یک فیلد تکی استفاده می‌کنیم چون در ادمین تک فیلد است */}
                            {agency.phone && (
                                <div className="mb-3">
                                    <a href={`tel:${agency.phone}`} className="text-xs font-bold bg-black/20 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/40 transition dir-ltr w-fit">
                                        <Phone size={12}/> {agency.phone}
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {agency.whatsapp && (
                                    <a href={`https://wa.me/${agency.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-[#25D366]/90 hover:bg-[#25D366] text-white rounded-lg flex items-center justify-center text-xs font-bold transition">
                                        <MessageCircle size={14}/>
                                    </a>
                                 )}
                                {agency.telegram && (
                                    <a href={`https://t.me/${agency.telegram}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-[#229ED9]/90 hover:bg-[#229ED9] text-white rounded-lg flex items-center justify-center text-xs font-bold transition">
                                        <Send size={14}/>
                                    </a>
                                 )}
                                {agency.instagram && (
                                    <a href={`https://instagram.com/${agency.instagram}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-pink-600/90 hover:bg-pink-600 text-white rounded-lg flex items-center justify-center text-xs font-bold transition">
                                        <Instagram size={14}/>
                                    </a>
                                 )}
                                {agency.facebook && (
                                    <a href={`https://facebook.com/${agency.facebook}`} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-blue-800/90 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center text-xs font-bold transition">
                                        <Facebook size={14}/>
                                    </a>
                                 )}
                                {agency.map_link && (
                                    <a href={agency.map_link} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center text-xs font-bold transition">
                                        <Map size={14}/>
                                    </a>
                                )}
                            </div>
                        </div>
                    )) : (
                         <div className="text-center py-10 border-2 border-dashed border-white/20 rounded-2xl">
                            <span className="text-blue-200 text-sm">
                                {isLtr ? "No agencies listed." : "هنوز نمایندگی ثبت نشده است."}
                            </span>
                        </div>
                    )}
                </div>
             </div>
        </div>
      </section>
    </div>
  );
}