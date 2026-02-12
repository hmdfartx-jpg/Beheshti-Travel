// رنگ‌ها
export const PRIMARY_COLOR = '#058B8C';
export const ACCENT_GOLD = '#D4AF37';

// ترجمه‌ها
export const translations = {
  dr: {
    title: "بهشتی تراول اجنسی",
    subtitle: "نماینده معتبر خدمات مسافرتی و تحصیلی در کابل",
    nav: { 
      home: "صفحه اصلی", 
      about: "درباره ما", // اضافه شد
      visa: "ویزای کشورها", 
      tickets: "رزرو تکت", 
      scholarship: "بورسیه", 
      cargo: "کارگو", 
      tracking: "پیگیری", 
      news: "اخبار",
      admin: "مدیریت" 
    },
    home: {
      hero_title: "سفر آگاهانه، آینده درخشان",
      hero_sub: "از کابل تا دورترین نقاط جهان، ما همراه شما هستیم.",
      why_us: "چرا بهشتی تراول؟",
      why_desc: "تضمین امنیت، سرعت در صدور ویزا و شفافیت در هزینه‌ها.",
      quick_search: "جستجوی پرواز",
      origin: "مبدأ (کابل، هرات...)",
      destination: "مقصد",
    },
    visa: {
      iran: { name: "ایران", docs: "پاسپورت، ۲ قطعه عکس، تذکره الکترونیکی" },
      pakistan: { name: "پاکستان", docs: "پاسپورت، تذکره، اسکن عکس" },
      turkey: { name: "ترکیه", docs: "پاسپورت، حساب بانکی، عکس بیومتریک، سند ملک" },
      russia: { name: "روسیه", docs: "پاسپورت، دعوت‌نامه رسمی، عکس" }
    },
    scholarship: {
      smart_title: "مشاوره هوشمند بورسیه",
      gpa: "معدل (از ۴ یا ۱۰۰)",
      major: "رشته تحصیلی",
      result_btn: "بررسی شانس قبولی"
    },
    cargo: {
      estimate: "تخمین هزینه کارگو",
      weight: "وزن (کیلوگرم)",
      type: "نوع کالا",
      calculate: "محاسبه هزینه"
    },
    status: { pending: "در حال بررسی", approved: "تایید شده (آماده)", rejected: "رد شده", processing: "در حال طی مراحل" },
    common: { submit: "ثبت درخواست", phone: "شماره تماس", name: "نام کامل", tracking_code: "کد پیگیری", whatsapp: "مشاوره واتس‌اپ" },
    // --- بخش فوتر ---
    footer: {
      about_desc: "آژانس مسافرتی بهشتی با سال‌ها تجربه در زمینه خدمات مسافرتی، ویزا و تورهای گردشگری، همواره در تلاش است تا بهترین خدمات را با مناسب‌ترین قیمت به هموطنان عزیز ارائه دهد.",
      quick_links: "دسترسی سریع",
      contact_us: "تماس با ما"
    }
  },
  ps: {
    title: "بهشتی ټراول اجنسي",
    subtitle: "په کابل کې د سفر او تحصیلي خدمتونو معتبره اداره",
    nav: { 
      home: "اصلي پاڼه", 
      about: "زموږ په اړه", // اضافه شد
      visa: "د هیوادونو ویزې", 
      tickets: "ټکټ ریزرو", 
      scholarship: "بورسونه", 
      cargo: "کارګو", 
      tracking: "تعقیب", 
      news: "خبرونه",
      admin: "مدیریت" 
    },
    home: {
      hero_title: "باخبره سفر، روښانه راتلونکی",
      hero_sub: "له کابل څخه د نړۍ تر ټولو لیرې نقطو پورې، موږ ستاسو ملګري یو.",
      why_us: "ولې بهشتي ټراول؟",
      why_desc: "د امنیت تضمین، د ویزو په صدور کې سرعت او په لګښتونو کې شفافیت.",
      quick_search: "د الوتنې لټون",
      origin: "مبدأ",
      destination: "مقصد",
    },
    visa: {
      iran: { name: "ایران", docs: "پاسپورټ، ۲ عکسونه، برېښنايي تذکره" },
      pakistan: { name: "پاکستان", docs: "پاسپورټ، تذکره، د عکس سکین" },
      turkey: { name: "ترکیه", docs: "پاسپورټ، بانکي حساب، بیومټریک عکس" },
      russia: { name: "روسیه", docs: "پاسپورټ، رسمي بلنه، عکس" }
    },
    scholarship: {
      smart_title: "د بورسونو هوښیاره مشوره",
      gpa: "معدل (له ۴ یا ۱۰۰ څخه)",
      major: "تحصیلي څانګه",
      result_btn: "د چانس ارزونه"
    },
    cargo: {
      estimate: "د کارګو لګښت اټکل",
      weight: "وزن (کیلوګرام)",
      type: "د مال نوعیت",
      calculate: "د لګښت محاسبه"
    },
    status: { pending: "د ارزونې لاندې", approved: "تایید شوی", rejected: "رد شوی", processing: "د کار لاندې" },
    common: { submit: "غوښتنه ثبتول", phone: "د اړیکې شمیره", name: "بشپړ نوم", tracking_code: "د تعقیب کوډ", whatsapp: "واټس‌اپ مشوره" },
    // --- بخش فوتر ---
    footer: {
      about_desc: "د بهشتی سفر ایجنسۍ د سفر خدماتو، ویزې او سیاحت په برخه کې د کلونو تجربې سره، تل هڅه کوي چې خپلو هیوادوالو ته غوره خدمات په مناسب قیمت وړاندې کړي.",
      quick_links: "چټک لاسرسی",
      contact_us: "موږ سره اړیکه"
    }
  },
  en: {
    title: "Beheshti Travel Agency",
    subtitle: "Trusted Representative for Travel and Educational Services in Kabul",
    nav: { 
      home: "Home", 
      about: "About Us", // Added
      visa: "Visas", 
      tickets: "Tickets", 
      scholarship: "Scholarship", 
      cargo: "Cargo", 
      tracking: "Tracking", 
      news: "News",
      admin: "Admin" 
    },
    home: {
      hero_title: "Conscious Travel, Bright Future",
      hero_sub: "From Kabul to the furthest corners of the world, we are with you.",
      why_us: "Why Beheshti Travel?",
      why_desc: "Guaranteed security, speed in visa issuance, and transparency in costs.",
      quick_search: "Flight Search",
      origin: "Origin (Kabul, Herat...)",
      destination: "Destination",
    },
    visa: {
      iran: { name: "Iran", docs: "Passport, 2 Photos, E-Tazkira" },
      pakistan: { name: "Pakistan", docs: "Passport, Tazkira, Scanned Photo" },
      turkey: { name: "Turkey", docs: "Passport, Bank Statement, Biometric Photo, Property Deed" },
      russia: { name: "Russia", docs: "Passport, Official Invitation, Photo" }
    },
    scholarship: {
      smart_title: "Smart Scholarship Consulting",
      gpa: "GPA (out of 4 or 100)",
      major: "Field of Study",
      result_btn: "Check Admission Chance"
    },
    cargo: {
      estimate: "Cargo Cost Estimate",
      weight: "Weight (kg)",
      type: "Type of Goods",
      calculate: "Calculate Cost"
    },
    status: { pending: "Pending", approved: "Approved (Ready)", rejected: "Rejected", processing: "Processing" },
    common: { submit: "Submit Request", phone: "Phone Number", name: "Full Name", tracking_code: "Tracking Code", whatsapp: "WhatsApp Consult" },
    // --- Footer Section ---
    footer: {
      about_desc: "Beheshti Travel Agency, with years of experience in travel services, visas, and tourism tours, always strives to provide the best services at the most reasonable prices to our dear compatriots.",
      quick_links: "Quick Links",
      contact_us: "Contact Us"
    }
  }
};