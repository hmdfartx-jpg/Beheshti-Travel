import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, FileText, ExternalLink, ArrowRight, ArrowLeft, Loader2, Link as LinkIcon, Globe, Home } from 'lucide-react';

export default function Search({ t, lang, newsData, settings }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filter, setFilter] = useState('all'); // all, news, services, links
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(true);

  // تابع کمکی برای حذف تگ‌های HTML از محتوای اخبار تا هایلایت کردن خراب نشود
  const stripHtml = (html) => {
      if (!html) return '';
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
  };

  const getText = (dr, ps, en) => {
      if (lang === 'en') return en;
      if (lang === 'ps') return ps;
      return dr;
  };

  useEffect(() => {
     if(!query) {
         setResults([]);
         setIsSearching(false);
         return;
     }

     setIsSearching(true);
     const q = query.toLowerCase();
     let tempResults = [];

     // ۱. جستجو در اخبار (عنوان و متن)
     if (newsData && newsData.length > 0) {
         newsData.forEach(item => {
             const title = (item.title || '').toLowerCase();
             const cleanContent = stripHtml(item.content).toLowerCase();
             
             if (title.includes(q) || cleanContent.includes(q)) {
                 tempResults.push({
                     id: `news-${item.id}`,
                     type: 'news',
                     typeTitle: getText('اخبار و مقالات', 'خبرونه او مقالې', 'News & Articles'),
                     title: item.title,
                     desc: stripHtml(item.content),
                     url: `/news/${item.id}`,
                     isExternal: false,
                     icon: <FileText size={20} className="text-blue-500" />
                 });
             }
         });
     }

     // ۲. جستجو در خدمات سایت (از تنظیمات)
     if (settings?.services && settings.services.length > 0) {
         settings.services.forEach((srv, idx) => {
             const title = (lang === 'en' ? srv.title_en : lang === 'ps' ? srv.title_ps : srv.title) || '';
             const desc = (lang === 'en' ? srv.desc_en : lang === 'ps' ? srv.desc_ps : srv.desc) || '';
             
             if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
                 tempResults.push({
                     id: `srv-${idx}`,
                     type: 'services',
                     typeTitle: getText('خدمات سایت', 'د سایټ خدمات', 'Services'),
                     title: title,
                     desc: desc,
                     url: '/', // یا لینک به بخش خدمات
                     isExternal: false,
                     icon: <Globe size={20} className="text-orange-500" />
                 });
             }
         });
     }

     // ۳. جستجو در لینک‌های خارجی (ناوبار و لینک‌های مفید فوتر)
     let linksToSearch = [...(settings?.useful_links || [])];
     if (settings?.navbar?.menus) {
         settings.navbar.menus.forEach(m => {
             if(m.isExternal) linksToSearch.push(m);
             if(m.submenus) {
                 m.submenus.forEach(sub => {
                     if(sub.isExternal) linksToSearch.push(sub);
                 });
             }
         });
     }

     linksToSearch.forEach((lnk, idx) => {
         const title = (lang === 'en' ? lnk.title_en : lang === 'ps' ? lnk.title_ps : (lnk.title_dr || lnk.title)) || '';
         const url = lnk.url || '';
         
         if (title.toLowerCase().includes(q) || url.toLowerCase().includes(q)) {
             tempResults.push({
                 id: `lnk-${idx}`,
                 type: 'links',
                 typeTitle: getText('لینک‌های خارجی', 'بهرني لینکونه', 'External Links'),
                 title: title,
                 desc: url,
                 url: url,
                 isExternal: true,
                 icon: <ExternalLink size={20} className="text-green-500" />
             });
         }
     });

     // شبیه‌سازی یک لودینگ کوتاه برای حس بهتر کاربری
     setTimeout(() => {
         setResults(tempResults);
         setIsSearching(false);
     }, 400);

  }, [query, newsData, settings, lang]);

  // تابع هوشمند برای بُرش متن (Snippet) و هایلایت کردن کلمه جستجو شده
  const highlightText = (text, highlight) => {
     if (!text) return '';
     if (!highlight.trim()) return text;
     
     let processText = text;
     const matchIndex = processText.toLowerCase().indexOf(highlight.toLowerCase());
     
     // اگر کلمه در متن بود و متن طولانی بود، ۵۰ کاراکتر قبل و بعدش رو میبریم
     if (matchIndex > -1 && processText.length > 150) {
         const start = Math.max(0, matchIndex - 60);
         const end = Math.min(processText.length, matchIndex + highlight.length + 60);
         processText = (start > 0 ? '... ' : '') + processText.substring(start, end) + (end < processText.length ? ' ...' : '');
     } else if (processText.length > 150) {
         processText = processText.substring(0, 150) + '...';
     }

     // اعمال هایلایت زرد
     const parts = processText.split(new RegExp(`(${highlight})`, 'gi'));
     return parts.map((part, i) => 
         part.toLowerCase() === highlight.toLowerCase() ? 
         <mark key={i} className="bg-yellow-200 text-gray-900 px-1 rounded font-bold shadow-sm">{part}</mark> : part
     );
  };

  const filteredResults = filter === 'all' ? results : results.filter(r => r.type === filter);
  const alignClass = lang === 'en' ? 'text-left' : 'text-right';
  const dirClass = lang === 'en' ? 'ltr' : 'rtl';

  return (
    <div className="min-h-[70vh] bg-[#F8FAFB] py-12" dir={dirClass}>
        <div className="max-w-4xl mx-auto px-4">
            
            {/* هدر جستجو */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                        <SearchIcon size={24} className="text-[#058B8C]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800">
                            {getText('نتایج جستجو', 'د لټون پایلې', 'Search Results')}
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            {getText('برای کلمه:', 'لپاره کلمه:', 'For keyword:')} <span className="font-bold text-[#058B8C] bg-teal-50 px-3 py-1 rounded-lg">"{query}"</span>
                        </p>
                    </div>
                </div>

                {/* تب‌های فیلتر */}
                {!isSearching && results.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-8 border-t border-gray-100 pt-6">
                        <span className="text-sm font-bold text-gray-400 ml-2">{getText('فیلتر نتایج:', 'د پایلو فلټر:', 'Filter results:')}</span>
                        
                        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'all' ? 'bg-[#058B8C] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {getText('همه موارد', 'ټول موارد', 'All')} ({results.length})
                        </button>
                        
                        {results.some(r => r.type === 'news') && (
                            <button onClick={() => setFilter('news')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'news' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {getText('اخبار', 'خبرونه', 'News')} ({results.filter(r => r.type === 'news').length})
                            </button>
                        )}
                        
                        {results.some(r => r.type === 'services') && (
                            <button onClick={() => setFilter('services')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'services' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {getText('خدمات سایت', 'خدمات', 'Services')} ({results.filter(r => r.type === 'services').length})
                            </button>
                        )}

                        {results.some(r => r.type === 'links') && (
                            <button onClick={() => setFilter('links')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === 'links' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {getText('لینک‌های خارجی', 'بهرني لینکونه', 'External Links')} ({results.filter(r => r.type === 'links').length})
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* لیست نتایج */}
            <div className="space-y-4">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 size={40} className="animate-spin mb-4 text-[#058B8C]" />
                        <p className="font-bold text-lg">{getText('در حال جستجو...', 'د لټون په حال کې...', 'Searching...')}</p>
                    </div>
                ) : filteredResults.length > 0 ? (
                    filteredResults.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <div className={`flex-1 ${alignClass}`}>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md">
                                            {item.typeTitle}
                                        </span>
                                    </div>
                                    
                                    {item.isExternal ? (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-block text-lg font-bold text-gray-800 hover:text-[#058B8C] mb-2 transition-colors">
                                            {highlightText(item.title, query)}
                                        </a>
                                    ) : (
                                        <Link to={item.url} className="inline-block text-lg font-bold text-gray-800 hover:text-[#058B8C] mb-2 transition-colors">
                                            {highlightText(item.title, query)}
                                        </Link>
                                    )}

                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                        {highlightText(item.desc, query)}
                                    </p>

                                    {item.isExternal ? (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#058B8C] hover:text-[#047070] transition-colors">
                                            <LinkIcon size={16} /> {getText('مشاهده لینک', 'لینک وګورئ', 'Visit Link')}
                                        </a>
                                    ) : (
                                        <Link to={item.url} className="inline-flex items-center gap-2 text-sm font-bold text-[#058B8C] hover:text-[#047070] transition-colors bg-teal-50 px-4 py-2 rounded-xl">
                                            {getText('مشاهده کامل', 'بشپړ وګورئ', 'Read More')} {lang === 'en' ? <ArrowRight size={16}/> : <ArrowLeft size={16}/>}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchIcon size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-2">
                            {getText('نتیجه‌ای یافت نشد', 'پایله ونه موندل شوه', 'No results found')}
                        </h3>
                        <p className="text-gray-500 font-bold mb-6">
                            {getText(`برای کلمه "${query}" هیچ محتوایی در سایت پیدا نکردیم.`, `د "${query}" لپاره په سایټ کې هیڅ مینځپانګه ونه موندل شوه.`, `We couldn't find anything for "${query}".`)}
                        </p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-[#058B8C] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#047070] transition-colors">
                            <Home size={18} /> {getText('بازگشت به خانه', 'بیرته کور ته', 'Back to Home')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}