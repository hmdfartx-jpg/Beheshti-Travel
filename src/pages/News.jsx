import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Megaphone, Tag, ChevronRight, ChevronLeft, Share2, MessageCircle, Send, Facebook, Twitter, Link } from 'lucide-react';

const translations = {
  dr: {
    pageTitle: "آخرین اخبار و اعلامیه‌ها",
    empty: "در حال حاضر خبری برای نمایش وجود ندارد...",
    back: "بازگشت به لیست",
    home: "خانه",
    readMore: "ادامه مطلب",
    related: "اخبار مرتبط",
    comments: "نظرات کاربران",
    writeComment: "ارسال نظر",
    placeholder: "نظر خود را اینجا بنویسید...",
    share: "اشتراک‌گذاری",
    copyLink: "کپی لینک",
    linkCopied: "لینک کپی شد!"
  },
  ps: {
    pageTitle: "وروستي خبرونه او خبرتیاوې",
    empty: "اوس مهال د ښودلو لپاره هیڅ خبر نشته...",
    back: "لیست ته ستنیدل",
    home: "کور",
    readMore: "نور ولولئ",
    related: "اړوند خبرونه",
    comments: "د کاروونکو نظریات",
    writeComment: "نظر واستوئ",
    placeholder: "خپل نظر دلته ولیکئ...",
    share: "شریکول",
    copyLink: "لینک کاپي کړئ",
    linkCopied: "لینک کاپي شو!"
  },
  en: {
    pageTitle: "Latest News & Announcements",
    empty: "No news to display at the moment...",
    back: "Back to List",
    home: "Home",
    readMore: "Read More",
    related: "Related News",
    comments: "User Comments",
    writeComment: "Post Comment",
    placeholder: "Write your comment here...",
    share: "Share",
    copyLink: "Copy Link",
    linkCopied: "Link Copied!"
  }
};

export default function News({ newsList, setPage, lang, viewId }) {
  // اگر زبان نامعتبر بود، فال‌بک به انگلیسی
  const currentLang = (lang === 'dr' || lang === 'ps' || lang === 'en') ? lang : 'en';
  const t = translations[currentLang];
  const isLtr = currentLang === 'en';
  
  const [comment, setComment] = useState("");
  const sortedNews = (newsList && Array.isArray(newsList)) 
    ? [...newsList].sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1) || b.id - a.id) 
    : [];

  useEffect(() => {
    if (viewId) window.scrollTo(0, 0);
  }, [viewId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t.linkCopied);
  };

  // تابع فرمت تاریخ بر اساس زبان
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    if (currentLang === 'en') return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (currentLang === 'ps') return date.toLocaleDateString('ps-AF');
    return date.toLocaleDateString('fa-IR');
  };

  // تابع کمکی برای دریافت متن خبر بر اساس زبان
  const getNewsContent = (item, field) => {
    if (!item) return '';
    if (currentLang === 'en') return item[`${field}_en`] || item[field];
    if (currentLang === 'ps') return item[`${field}_ps`] || item[field];
    return item[field];
  };

  // --- حالت نمایش تک خبر ---
  if (viewId) {
    const currentItem = sortedNews.find(n => String(n.id) === String(viewId));
    const relatedNews = sortedNews.filter(n => String(n.id) !== String(viewId)).slice(0, 3);

    if (!currentItem) return <div className="text-center py-20 text-gray-500 font-bold">News not found.</div>;
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 font-[Vazirmatn]" dir={isLtr ? 'ltr' : 'rtl'}>
        <button 
          onClick={() => setPage('news')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] mb-8 font-bold transition"
        >
          {/* فلش بازگشت: در LTR چپ، در RTL راست */}
          {isLtr ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
          {t.back}
        </button>

        <article className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-12">
          {currentItem.image_url && (
            <img src={currentItem.image_url} className="w-full h-[450px] object-cover" alt={getNewsContent(currentItem, 'title')} />
          )}
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-400 text-xs font-bold bg-gray-50 px-4 py-2 rounded-full">
                <Calendar size={16} className="text-[#f97316]"/>
                <span dir="ltr">{getFormattedDate(currentItem.created_at)}</span>
                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-1"></span>
                <Tag size={16} className="text-[#1e3a8a]"/>
                <span>{isLtr ? "Beheshti Travel" : "بهشتی تراول"}</span>
              </div>
              
              {/* بخش اشتراک گذاری */}
              <div className="flex items-center gap-2">
                <button onClick={handleCopyLink} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition" title={t.copyLink}><Link size={18}/></button>
                 <button className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-blue-600 hover:text-white transition"><Facebook size={18}/></button>
                <button className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-sky-400 hover:text-white transition"><Twitter size={18}/></button>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-8 leading-tight">{getNewsContent(currentItem, 'title')}</h1>
            <div className={`text-gray-600 text-lg leading-10 whitespace-pre-wrap mb-12 ${isLtr ? 'text-left' : 'text-justify'}`}>
              {getNewsContent(currentItem, 'description')}
            </div>

            {/* بخش نظرات */}
            <div className="border-t border-gray-100 pt-12">
              <div className="flex items-center gap-3 mb-8 text-[#1e3a8a]">
                <MessageCircle size={28}/>
                <h3 className="text-2xl font-black">{t.comments}</h3>
              </div>
              
              <div className="bg-gray-50 rounded-[2rem] p-6 mb-8">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-[#1e3a8a] transition-all h-32 resize-none"
                />
                <div className={`flex mt-4 ${isLtr ? 'justify-end' : 'justify-end'}`}>
                  <button className="flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#172554] transition shadow-lg shadow-blue-100">
                    <Send size={18} className={isLtr ? "rotate-0" : "rotate-180"}/> {t.writeComment}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* بخش اخبار مرتبط */}
         {relatedNews.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-black text-gray-800">{t.related}</h3>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {relatedNews.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setPage(`view-news-${item.id}`)}
                  className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                 >
                  <div className="h-44 rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50">
                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={getNewsContent(item, 'title')} />
                  </div>
                  <h4 className="font-black text-gray-800 text-sm line-clamp-2 leading-7 group-hover:text-[#1e3a8a] transition-colors px-2">{getNewsContent(item, 'title')}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- حالت نمایش لیست اخبار ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-[Vazirmatn]" dir={isLtr ? 'ltr' : 'rtl'}>
      <div className="flex justify-between items-center mb-12 border-b-2 border-gray-100 pb-6">
        <div>
          <h1 className="text-4xl font-black text-[#1e3a8a] mb-2">{t.pageTitle}</h1>
          <div className="h-1.5 w-20 bg-[#f97316] rounded-full"></div>
        </div>
        <button onClick={() => setPage('home')} className="bg-gray-50 text-gray-600 px-5 py-2 rounded-xl font-bold text-sm transition hover:bg-gray-100"> {t.home} </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sortedNews.length > 0 ? (
          sortedNews.map((item) => (
            <div key={item.id} className={`bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-all duration-500 group border-r-4 border-r-transparent ${isLtr ? 'hover:border-l-[#1e3a8a] border-l-4 border-l-transparent border-r-0' : 'hover:border-r-[#1e3a8a]'}`}>
              {item.image_url && (
                 <div className="w-full md:w-[320px] h-[260px] shrink-0 overflow-hidden relative cursor-pointer" onClick={() => setPage(`view-news-${item.id}`)}>
                  <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={getNewsContent(item, 'title')} />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-4 text-gray-400 text-[11px] mb-4 font-bold">
                  <Calendar size={14} className="text-[#f97316]"/>
                  <span dir="ltr">{getFormattedDate(item.created_at)}</span>
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-4 group-hover:text-[#1e3a8a] transition-colors leading-tight line-clamp-2 cursor-pointer" onClick={() => setPage(`view-news-${item.id}`)}>{getNewsContent(item, 'title')}</h2>
                <p className={`text-gray-500 leading-8 text-sm line-clamp-2 mb-6 ${isLtr ? 'text-left' : 'text-justify'}`}>{getNewsContent(item, 'description')}</p>
                <div className="mt-auto pt-4 border-t border-gray-50">
                   <button 
                    onClick={() => setPage(`view-news-${item.id}`)}
                    className="text-[#1e3a8a] font-black text-sm flex items-center gap-2 hover:gap-3 transition-all"
                   >
                      {t.readMore}
                      {/* جهت فلش بر اساس زبان */}
                      {isLtr ? <ArrowRight size={16}/> : <ArrowLeft size={16}/>}
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center text-gray-400 font-bold text-xl">{t.empty}</div>
        )}
      </div>
    </div>
  );
}