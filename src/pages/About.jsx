import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Send, Globe, Shield, Users, Award, Map, Target, Eye, Clock, CheckCircle, Save, Plane, Briefcase } from 'lucide-react';

export default function About({ t, lang, settings }) {
  const isLtr = lang === 'en';
  const { hash } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  const staticLabels = {
    aboutTitle: { dr: "درباره بهشتی تراول", ps: "د بهشتي ټراول په اړه", en: "About Beheshti Travel" },
    activitiesTitle: { dr: "عرصه‌های فعالیت ما", ps: "زموږ د فعالیت ساحې", en: "Our Areas of Activity" },
    ourTeam: { dr: "تیم متخصص ما", ps: "زموږ مسلکي ټیم", en: "Our Professional Team" },
    whyUs: { dr: "چرا ما را انتخاب کنید؟", ps: "ولې موږ غوره کړئ؟", en: "Why Choose Us?" },
    ourClients: { dr: "مشتریان ما", ps: "زموږ پیرودونکي", en: "Our Clients" },
    clientsSub: { 
      dr: "افتخار همکاری با سازمان‌ها و شرکت‌های معتبر جهانی", 
      ps: "د معتبرو نړیوالو سازمانونو او شرکتونو سره د همکارۍ ویاړ", 
      en: "Proud to collaborate with reputable global organizations" 
    },
    contactUs: { dr: "ارتباط با ما", ps: "موږ سره اړیکه", en: "Get In Touch" },
    contactSub: { 
      dr: "ما در تمامی شعبات آماده پاسخگویی هستیم", 
      ps: "موږ په ټولو څانګو کې ستاسو ځواب ویلو ته چمتو یو", 
      en: "We are always available to assist you in all branches" 
    },
    headOffice: { dr: "دفتر مرکزی", ps: "مرکزی دفتر", en: "Head Office" },
    agencies: { dr: "نمایندگی‌", ps: "نمایندګۍ", en: "Our Branches" },
    address: { dr: "آدرس", ps: "پته", en: "Address" },
    phone: { dr: "تلفن", ps: "تلیفون", en: "Phone" },
    map: { dr: "موقعیت روی نقشه", ps: "په نقشه کې موقعیت", en: "Location on Map" },
    saveContact: { dr: "ذخیره شماره", ps: "شمیره خوندي کړئ", en: "Save Contact" },
    mission: { dr: "ماموریت ما", ps: "زموږ ماموریت", en: "Our Mission" },
    vision: { dr: "چشم‌انداز ما", ps: "زموږ لیدلوری", en: "Our Vision" },
    mainBranch: { dr: "شعبه مرکزی", ps: "مرکزی څانګه", en: "Main Branch" },
    agencyTag: { dr: "شعبه رسمی", ps: "رسمی څانګه", en: "Official Branch" },
    viewMore: { dr: "مشاهده خدمات", ps: "نور وګورئ", en: "View Services" },
    defaultMissionDesc: { 
      dr: "ارائه خدمات مسافرتی با بالاترین کیفیت و قیمت مناسب برای هموطنان با تکیه بر استانداردهای جهانی.", 
      ps: "هیوادوالو ته د لوړ کیفیت او مناسب قیمت سره د سفر خدمات وړاندې کول.", 
      en: "Providing travel services with the highest quality and reasonable prices for our citizens."
    },
    defaultVisionDesc: { 
      dr: "تبدیل شدن به معتبرترین برند گردشگری و مسافرتی در سطح منطقه.", 
      ps: "په سیمه کې د ګرځندوی ترټولو معتبر برانډ بدلیدل.", 
      en: "Becoming the most trusted tourism brand in the region."
    },
    defaultDesc: {
      dr: "شرکت خدمات مسافرتی بهشتی تراول با سال‌ها تجربه درخشان در زمینه ارائه بهترین خدمات گردشگری، صدور ویزا، رزرو هتل و پروازهای داخلی و خارجی، همواره در تلاش است تا مطمئن‌ترین، سریع‌ترین و راحت‌ترین مسیرها را برای سفرهای شما فراهم کند.",
      ps: "زموږ د سفر خدماتو شرکت د غوره ګرځندوی خدماتو په وړاندې کولو کې د کلونو تجربې سره...",
      en: "Beheshti Travel Agency, with years of brilliant experience in providing the best tourism services, always strives to provide the safest routes for your journeys."
    }
  };

  const L = (key) => {
    if (lang === 'en') return staticLabels[key].en;
    if (lang === 'ps') return staticLabels[key].ps;
    return staticLabels[key].dr;
  };

  const getDbText = (obj, field) => {
    if (!obj) return "";
    if (lang === 'en' && obj[`${field}_en`]) return obj[`${field}_en`];
    if (lang === 'ps' && obj[`${field}_ps`]) return obj[`${field}_ps`];
    return obj[`${field}_dr`] || obj[field] || "";
  };

  const handleSaveContact = (name, phone, address, email, website) => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;TYPE=WORK,VOICE:${phone}\nADR;TYPE=WORK:;;${address};;;;\nEMAIL:${email || ''}\nURL:${website || 'beheshtitravel.com'}\nEND:VCARD`;
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
  const clientsData = settings?.clients || [];
  
  const activitiesData = (settings?.activities && settings.activities.length > 0) ? settings.activities : [
    { id: 1, title_dr: 'سفر و پرواز', desc_dr: 'رزرو آنلاین بلیط پروازهای داخلی و خارجی', image: '', link: '/' },
    { id: 2, title_dr: 'خدمات پرداخت', desc_dr: 'پرداخت‌های ارزی و بین‌المللی', image: '', link: '/' },
    { id: 3, title_dr: 'کارگو و باربری', desc_dr: 'ارسال و دریافت سریع بار', image: '', link: '/' },
    { id: 4, title_dr: 'فروشگاه آنلاین', desc_dr: 'خرید تجهیزات سفر و ملزومات', image: '', link: '/' }
  ];

  const whyUsData = (settings?.why_us && settings.why_us.length > 0) ? settings.why_us : [
    { id: 1, title_dr: "پشتیبانی ۲۴ ساعته", desc_dr: "تیم پشتیبانی ما آماده پاسخگویی است.", icon: "Clock" },
    { id: 2, title_dr: "بهترین قیمت‌ها", desc_dr: "تضمین مناسب‌ترین قیمت برای خدمات.", icon: "Award" },
    { id: 3, title_dr: "امنیت و سرعت", desc_dr: "در سریع‌ترین زمان برنامه‌های سفر را به ما بسپارید.", icon: "Shield" }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 font-[Vazirmatn] ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} dir={isLtr ? 'ltr' : 'rtl'}>
      
      {/* 1. بخش هیرو (درباره شرکت) */}
      <section id="company" className="relative bg-gradient-to-br from-[#058B8C] to-[#046566] text-white pt-40 pb-24 rounded-b-[4rem] shadow-2xl overflow-hidden -mt-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-stretch gap-16">
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
                    {getDbText(aboutData, 'desc') || L('defaultDesc')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold">
                            <Target size={20}/> 
                            {getDbText(aboutData, 'mission_title') || L('mission')}
                        </div>
                        <p className="text-xs text-blue-50 leading-relaxed text-justify flex-1">
                            {getDbText(aboutData, 'mission_desc') || L('defaultMissionDesc')}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-bold">
                            <Eye size={20}/> 
                            {getDbText(aboutData, 'vision_title') || L('vision')}
                        </div>
                        <p className="text-xs text-blue-50 leading-relaxed text-justify flex-1">
                            {getDbText(aboutData, 'vision_desc') || L('defaultVisionDesc')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full relative min-h-[400px] lg:min-h-auto lg:h-auto">
                <div className="absolute inset-0 bg-[#D4AF37] rounded-[3rem] rotate-6 opacity-30 blur-sm scale-95 h-full"></div>
                <div className="h-full rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl relative z-10 bg-gray-100">
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

      {/* 2. بخش عرصه‌های فعالیت */}
      <section id="activities" className="max-w-7xl mx-auto px-4 mt-16 relative z-20">
          <div className="text-center mb-12">
              <span className="text-[#058B8C] font-bold text-sm tracking-widest uppercase mb-2 block">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800">{L('activitiesTitle')}</h2>
              <div className="w-16 h-1.5 bg-[#058B8C] rounded-full mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activitiesData.map((act, idx) => (
                  <div key={idx} className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-gray-100 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                      <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-5 bg-gray-100 relative">
                          <div className="absolute inset-0 bg-[#058B8C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          {act.image ? (
                              <img src={act.image} alt={act.title_dr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100"><Briefcase size={40}/></div>
                          )}
                      </div>
                      <div className="px-2 flex flex-col flex-1">
                          <h3 className="font-black text-xl text-gray-800 mb-2">{getDbText(act, 'title')}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{getDbText(act, 'desc')}</p>
                          <Link to={act.link || '#'} className="block w-full py-3.5 bg-[#058B8C]/10 text-[#058B8C] hover:bg-[#058B8C] hover:text-white rounded-2xl font-black text-center transition-colors">
                              {L('viewMore')}
                          </Link>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* 3. چرا ما */}
      <section className="max-w-7xl mx-auto px-4 mt-16 relative z-20">
        <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl border border-gray-100">
            <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-black text-gray-800">{L('whyUs')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {whyUsData.map((item, idx) => {
                    const IconMap = { Shield, Globe, Users, Award, Target, Eye, Clock, CheckCircle };
                    const IconComponent = IconMap[item.icon] || Shield; 

                    return (
                        <div key={idx} className="group text-center space-y-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="w-20 h-20 mx-auto bg-blue-50 text-[#058B8C] rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <IconComponent size={36}/> 
                            </div>
                            <h3 className="font-black text-xl text-gray-800 pt-2">
                                {getDbText(item, 'title')}
                            </h3>
                            <p className="text-base text-gray-500 leading-relaxed font-medium">
                                {getDbText(item, 'desc')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* 4. تیم ما */}
      <section id="team" className="py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center mb-16">
                <span className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase mb-2">Team</span>
                <h2 className="text-4xl font-black text-[#058B8C]">{L('ourTeam')}</h2>
                <div className="w-16 h-1.5 bg-[#058B8C] rounded-full mt-4"></div>
            </div>
            
            {teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-[3rem] p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                            <div className="aspect-square rounded-[2.5rem] overflow-hidden mb-6 relative bg-gray-100">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><Users size={64}/></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                                    <div className="flex gap-3">
                                        {member.whatsapp && (
                                            <a href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-[#25D366] cursor-pointer transition">
                                                <MessageCircle size={20}/>
                                            </a>
                                        )}
                                        {member.phone && (
                                            <a href={`tel:${member.phone}`} className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-[#058B8C] cursor-pointer transition">
                                                <Phone size={20}/>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pb-2">
                                <h3 className="text-xl font-black text-gray-800 group-hover:text-[#058B8C] transition-colors">
                                     {isLtr ? (member.name_en || member.name) : (member.name_fa || member.name)}
                                </h3>
                                <p className="text-sm font-bold text-[#058B8C] mt-2 uppercase tracking-wide bg-blue-50 inline-block px-4 py-1.5 rounded-xl">
                                     {getDbText(member, 'role')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 py-10 bg-white border-2 border-dashed border-gray-200 rounded-[3rem]">عضوی در دیتابیس یافت نشد.</div>
            )}
        </div>
      </section>

      {/* 5. مشتریان ما */}
      <section id="clients" className="px-4 py-20 overflow-hidden bg-white border-y border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-4xl font-black text-[#058B8C]">{L('ourClients')}</h2>
             <p className="text-gray-500 mt-4 font-bold text-lg">{L('clientsSub')}</p>
             <div className="w-16 h-1.5 bg-[#D4AF37] rounded-full mt-6"></div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {clientsData.length > 0 ? clientsData.map((client, idx) => {
                  
                  const ClientWrapper = client.url ? 'a' : 'div';
                  const wrapperProps = client.url ? { href: client.url, target: "_blank", rel: "noreferrer" } : {};
                  
                  // دریافت هوشمند نام بر اساس زبان انتخاب شده
                  const clientName = getDbText(client, 'name') || client.name || "مشتری";

                  return (
                      <ClientWrapper 
                          key={idx} 
                          {...wrapperProps}
                          className="flex flex-col items-center gap-4 transition-all duration-300 cursor-pointer group"
                      >
                          <div className="w-32 h-32 bg-white shadow-sm group-hover:shadow-xl border border-gray-100 rounded-[2rem] flex items-center justify-center p-4 transition-all duration-300 group-hover:-translate-y-2">
                              {client.logo ? (
                                  <img src={client.logo} alt={clientName} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                              ) : (
                                  <span className="font-black text-gray-300 text-3xl uppercase">{clientName.charAt(0)}</span>
                              )}
                          </div>
                          <span className="font-black text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg group-hover:text-[#058B8C] transition-colors">{clientName}</span>
                      </ClientWrapper>
                  )
              }) : (
                  <>
                      <div className="flex flex-col items-center gap-4 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group">
                          <div className="w-28 h-28 bg-gray-50 shadow-md group-hover:shadow-xl border border-gray-100 rounded-[2rem] flex items-center justify-center text-blue-500"><Globe size={48}/></div>
                          <span className="font-black text-xs text-gray-500 tracking-widest bg-gray-100 px-3 py-1 rounded-lg">LOGISTICS</span>
                      </div>
                      <div className="flex flex-col items-center gap-4 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group">
                          <div className="w-28 h-28 bg-gray-50 shadow-md group-hover:shadow-xl border border-gray-100 rounded-[2rem] flex items-center justify-center text-orange-500"><Plane size={48}/></div>
                          <span className="font-black text-xs text-gray-500 tracking-widest bg-gray-100 px-3 py-1 rounded-lg">AIRLINES</span>
                      </div>
                      <div className="flex flex-col items-center gap-4 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group">
                          <div className="w-28 h-28 bg-gray-50 shadow-md group-hover:shadow-xl border border-gray-100 rounded-[2rem] flex items-center justify-center text-green-500"><Users size={48}/></div>
                          <span className="font-black text-xs text-gray-500 tracking-widest bg-gray-100 px-3 py-1 rounded-lg">CORPORATE</span>
                      </div>
                  </>
              )}
          </div>
        </div>
      </section>

      {/* 6. تماس با ما */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-800">{L('contactUs')}</h2>
            <p className="text-gray-500 mt-4 font-bold text-lg">{L('contactSub')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* کارت دفتر مرکزی */}
            <div className="bg-white group hover:bg-[#058B8C] text-gray-800 hover:text-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden transition-all duration-500 flex flex-col h-full">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#058B8C]/10 rounded-bl-[3rem] transition-all group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:bg-[#058B8C] duration-500"></div>
                
               <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="w-20 h-20 bg-[#058B8C] text-white group-hover:bg-white group-hover:text-[#058B8C] rounded-[1.5rem] flex items-center justify-center shadow-lg transition-colors">
                             <Shield size={36}/>
                        </div>
                        <div>
                             <h3 className="text-3xl font-black">{L('headOffice')}</h3>
                             <span className="inline-block mt-2 px-3 py-1 bg-gray-100 group-hover:bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">{L('mainBranch')}</span>
                        </div>
                    </div>
                     
                    <div className="space-y-8 flex-1 border-t border-gray-100 group-hover:border-white/20 pt-8 transition-colors">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors">
                               <MapPin className="text-gray-600 group-hover:text-white"/>
                            </div>
                             <div>
                                <span className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">{L('address')}</span>
                                <p className="font-bold text-lg leading-relaxed">{getDbText(contactData, 'address') || "آدرس ثبت نشده"}</p>
                             </div>
                        </div>
                        
                        <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors">
                               <Phone className="text-gray-600 group-hover:text-white"/>
                             </div>
                            <div>
                                <span className="block text-xs font-bold opacity-60 mb-2 uppercase tracking-wider">{L('phone')}</span>
                                 <a href={`tel:${contactData.phone}`} className="font-black text-3xl dir-ltr block hover:opacity-80 transition-opacity">{contactData.phone || "---"}</a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="flex gap-4 mb-4">
                            {contactData.whatsapp && (
                                <a href={`https://wa.me/${contactData.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <MessageCircle size={22}/> WhatsApp
                                </a>
                            )}
                            {contactData.telegram && (
                                <a href={`https://t.me/${contactData.telegram}`} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-[#229ED9] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <Send size={22}/> Telegram
                                </a>
                            )}
                        </div>
                        
                        <div className="flex gap-4">
                            {contactData.map_link && (
                                <a href={contactData.map_link} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-gray-100 group-hover:bg-white/20 text-gray-600 group-hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 group-hover:border-white/30 transition-colors text-sm">
                                    <Map size={20}/> {L('map')}
                                </a>
                            )}
                            <button 
                                onClick={() => handleSaveContact("Beheshti Travel - Head Office", contactData.phone, getDbText(contactData, 'address'))}
                                className="flex-1 py-4 bg-gray-800 text-white group-hover:bg-white group-hover:text-[#058B8C] rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform text-sm"
                            >
                                <Save size={20}/> {L('saveContact')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* کارت شعبات */}
            {agencies.length > 0 ? agencies.map((agency, idx) => (
                <div key={idx} className="bg-[#058B8C] group hover:bg-white text-white hover:text-gray-800 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden transition-all duration-500 flex flex-col h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[3rem] transition-all group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:bg-white duration-500"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-20 h-20 bg-white text-[#058B8C] group-hover:bg-[#058B8C] group-hover:text-white rounded-[1.5rem] flex items-center justify-center shadow-lg transition-colors">
                                <Globe size={36}/>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black">{L('agencies')}</h3>
                                <span className="inline-block mt-2 px-3 py-1 bg-white/20 group-hover:bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest">{L('agencyTag')}</span>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1 border-t border-white/20 group-hover:border-gray-100 pt-8 transition-colors">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors">
                                   <MapPin className="text-white group-hover:text-gray-600"/>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold opacity-70 mb-2 uppercase tracking-wider">{L('address')}</span>
                                    <h4 className="font-black text-xl mb-1">{getDbText(agency, 'name')}</h4>
                                    <p className="font-bold text-base leading-relaxed opacity-90">{getDbText(agency, 'address')}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors">
                                   <Phone className="text-white group-hover:text-gray-600"/>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold opacity-70 mb-2 uppercase tracking-wider">{L('phone')}</span>
                                    {agency.phone ? (
                                        <a href={`tel:${agency.phone}`} className="font-black text-3xl dir-ltr block hover:opacity-80 transition-opacity">{agency.phone}</a>
                                    ) : (
                                        <span className="opacity-50 font-bold">---</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="flex gap-4 mb-4">
                                {agency.whatsapp && (
                                    <a href={`https://wa.me/${agency.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                        <MessageCircle size={22}/> WhatsApp
                                    </a>
                                )}
                                {agency.telegram && (
                                    <a href={`https://t.me/${agency.telegram}`} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-[#229ED9] text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                        <Send size={22}/> Telegram
                                    </a>
                                )}
                            </div>

                            <div className="flex gap-4">
                                {agency.map_link && (
                                    <a href={agency.map_link} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-white/20 group-hover:bg-gray-100 text-white group-hover:text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-dashed border-white/20 group-hover:border-gray-200 transition-colors text-sm">
                                        <Map size={20}/> {L('map')}
                                    </a>
                                )}
                                <button 
                                    onClick={() => handleSaveContact(getDbText(agency, 'name'), agency.phone, getDbText(agency, 'address'))}
                                    className="flex-1 py-4 bg-white group-hover:bg-gray-800 text-[#058B8C] group-hover:text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform text-sm"
                                >
                                    <Save size={20}/> {L('saveContact')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center py-20 border-4 border-dashed border-gray-200 rounded-[3rem] bg-gray-50 flex items-center justify-center h-full">
                    <span className="text-gray-400 font-bold text-lg">
                        {isLtr ? "No agencies listed." : "هنوز نمایندگی ثبت نشده است."}
                    </span>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}