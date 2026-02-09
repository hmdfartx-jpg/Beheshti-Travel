import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Clock, MapPin, Loader2, Droplets, Wind, CalendarDays, ArrowLeftRight, Sunrise, Sunset, ThermometerSnowflake, ArrowUp, ArrowDown } from 'lucide-react';

// دریافت کلید API
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; 

// --- تابع تمیزکننده نام شهر ---
const cleanCityName = (name) => {
  if (!name) return '';
  const cleaned = name.trim();
  if (cleaned.toLowerCase().includes('mazar') && (cleaned.toLowerCase().includes('sharif'))) {
      return 'Mazar-i-Sharif';
  }
  return cleaned;
};

// --- نام ماه‌های شمسی ---
const solarMonths = {
  dr: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"],
  ps: ["وری", "غویی", "غبرګولی", "چونګاښ", "زمری", "وږی", "تله", "لړم", "لیندۍ", "مرغومی", "سلواغه", "کب"]
};

// --- استایل‌های انیمیشن و فونت ---
const customStyles = `
  @import url('https://fonts.cdnfonts.com/css/ds-digital'); /* فونت دیجیتال جدید */
  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700;900&display=swap');

  @keyframes typewriterRTL { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
  @keyframes zoomBg { 0% { transform: scale(1); } 100% { transform: scale(1.4); } }
  @keyframes weatherFadeUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
  @keyframes cubeRotate { 
    0% { opacity: 0; transform: perspective(500px) rotateX(-90deg) translateY(-20px); } 
    100% { opacity: 1; transform: perspective(500px) rotateX(0deg) translateY(0); } 
  }

  .typewriter-text {
    overflow: hidden; white-space: nowrap; display: inline-block; direction: rtl;
    animation: typewriterRTL 1.5s steps(40, end) forwards;
  }
  .anim-zoom { animation: zoomBg 20s linear infinite alternate; }
  .anim-weather-smooth { animation: weatherFadeUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .anim-cube { animation: cubeRotate 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; backface-visibility: hidden; }
  
  .font-digital { font-family: 'DS-Digital', sans-serif; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

// --- دیکشنری ترجمه‌ها ---
const t = {
  dr: {
    title: "آب و هوا و ساعت جهانی", subtitle: "اطلاعات دقیق زمانی و جوی",
    today: "امروز", tomorrow: "فردا",
    diffKabul: "کابل", diffLondon: "لندن",
    hour: "ساعت", minute: "دقیقه", and: "و", ahead: "جلوتر از", behind: "عقب‌تر از", same: "همزمان با",
    weekDays: ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"],
    humidity: "رطوبت", wind: "باد",
    cold: "سرد", cool: "خنک", warm: "گرم", hot: "داغ", boneChilling: "سوزدار",
    clear: "آفتابی", clouds: "ابری", rain: "بارانی", snow: "برفی", separator: "•"
  },
  ps: {
    title: "د هوا حالات او نړیوال ساعت", subtitle: "د دقیق وخت او د هوا معلومات",
    today: "نن", tomorrow: "سبا",
    diffKabul: "کابل", diffLondon: "لندن",
    hour: "ساعت", minute: "دقیقه", and: "او", ahead: "مخکې له", behind: "وروسته له", same: "یوځای له",
    weekDays: ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"],
    humidity: "لندبل", wind: "باد",
    cold: "سرد", cool: "سوړ", warm: "تود", hot: "Garam", boneChilling: "یخنی",
    clear: "شنه آسمان", clouds: "وریش", rain: "باران", snow: "واوره", separator: "•"
  }
};

// --- توابع کمکی ---
const getSafeTimezone = (tz) => { try { Intl.DateTimeFormat(undefined, { timeZone: tz }); return tz; } catch (e) { return 'UTC'; } };

const getSolarDate = (date, lang) => {
  const format = new Intl.DateTimeFormat('en-US-u-ca-persian', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const parts = format.formatToParts(date);
  const day = parts.find(p => p.type === 'day').value;
  const monthIndex = parseInt(parts.find(p => p.type === 'month').value) - 1;
  const year = parts.find(p => p.type === 'year').value;
  const txt = t[lang] || t.dr;
  const weekDay = txt.weekDays[date.getDay()];
  const months = lang === 'dr' ? solarMonths.dr : solarMonths.ps;
  return `${weekDay} ${day} ${months[monthIndex] || months[0]} ${year}`;
};

const formatDate = (date, isAfghan, lang) => {
  if (isAfghan) return getSolarDate(date, lang);
  const d = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' }).formatToParts(date);
  return `${d.find(p=>p.type==='weekday').value} ${d.find(p=>p.type==='day').value} ${d.find(p=>p.type==='month').value.toUpperCase()} ${d.find(p=>p.type==='year').value}`;
};

const formatTimeDiff = (diffMinutes, targetName, langCode) => {
  const txt = t[langCode] || t.dr;
  const absDiff = Math.abs(diffMinutes);
  const h = Math.floor(absDiff / 60);
  const m = absDiff % 60;
  const targetLabel = targetName === 'Kabul' ? txt.diffKabul : txt.diffLondon;
  if (diffMinutes === 0) return `${txt.same} ${targetLabel}`;
  
  const timeStr = `${h > 0 ? h + ' ' + txt.hour + ' ' + txt.and + ' ' : ''}${m} ${txt.minute}`;
  const dir = diffMinutes > 0 ? txt.ahead : txt.behind;
  return `${timeStr} ${dir} ${targetLabel}`; 
};

const getWeatherSentence = (temp, condition, langCode) => {
    const txt = t[langCode] || t.dr;
    let tDesc = temp <= 0 ? txt.boneChilling : temp <= 15 ? txt.cold : temp <= 25 ? txt.cool : temp <= 35 ? txt.warm : txt.hot;
    let cDesc = condition === 'Clear' ? txt.clear : condition === 'Clouds' ? txt.clouds : condition.includes('Rain') ? txt.rain : condition.includes('Snow') ? txt.snow : condition;
    return `${cDesc} ${txt.separator} ${tDesc}`;
};

// --- ساعت آنالوگ ---
const AnalogClock = ({ timeZone }) => {
  const [date, setDate] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setDate(new Date()), 1000); return () => clearInterval(i); }, []);
  
  const cityDate = new Date(date.toLocaleString("en-US", { timeZone: getSafeTimezone(timeZone) }));
  const [s, m, h] = [cityDate.getSeconds(), cityDate.getMinutes(), cityDate.getHours()];
  const sDeg = (s/60)*360; const mDeg = ((m + s/60)/60)*360; const hDeg = (((h%12) + m/60)/12)*360;

  return (
    <div className="relative w-24 h-24 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center shrink-0">
      <div className="absolute w-2 h-2 bg-white rounded-full z-20 shadow-sm"></div>
      <div className="absolute w-1.5 h-6 bg-white rounded-full z-10 origin-bottom" style={{ transform: `translateX(-50%) rotate(${hDeg}deg)`, bottom: '50%', left: '50%' }}></div>
      <div className="absolute w-1 h-8 bg-white/90 rounded-full z-10 origin-bottom" style={{ transform: `translateX(-50%) rotate(${mDeg}deg)`, bottom: '50%', left: '50%' }}></div>
      <div className="absolute w-0.5 h-10 bg-[#f97316] z-10 origin-bottom" style={{ transform: `translateX(-50%) rotate(${sDeg}deg)`, bottom: '50%', left: '50%' }}></div>
      {[0, 90, 180, 270].map(deg => <div key={deg} className="absolute w-1 h-2 bg-white/60" style={{ transform: `rotate(${deg}deg) translateY(-40px)` }}></div>)}
    </div>
  );
};

// --- متن تایپ‌رایتر ---
const TypewriterText = ({ text }) => <div className="typewriter-text" key={text} dir="rtl">{text}</div>;

// --- اسلایدر منطقه ---
const RegionSlider = ({ cities, isAfghan, lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const txt = t[lang] || t.dr;

  useEffect(() => {
    if (!cities.length) return;
    const i = setInterval(() => setCurrentIndex(p => (p + 1) % cities.length), 10000);
    return () => clearInterval(i);
  }, [cities.length]);

  const currentCity = cities[currentIndex];

  useEffect(() => {
    if (!currentCity) return;
    const fetchWeather = async () => {
      setLoading(true);
      setErrorMsg(null);
      const queryName = cleanCityName(currentCity.name);
      
      console.log(`%c[Weather Debug] Fetching for: ${queryName}`, 'color: cyan');

      if (!API_KEY) {
        console.error("API Key is missing!");
        setWeatherData(null);
        setLoading(false);
        return;
      }

      const cached = localStorage.getItem(`forecast_${queryName}`);

      const processData = (data) => {
        if (!data.list || data.list.length === 0) return;
        
        const current = data.list[0];
        const todayItems = data.list.slice(0, 8); 

        const todayMax = Math.max(...todayItems.map(i => i.main.temp_max));
        const todayMin = Math.min(...todayItems.map(i => i.main.temp_min));

        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowDay = tomorrowDate.getDate();
        
        const tmItems = data.list.filter(i => new Date(i.dt * 1000).getDate() === tomorrowDay);
        
        let tmStats = null;
        if (tmItems.length > 0) {
            const tmMax = Math.max(...tmItems.map(i => i.main.temp_max));
            const tmMin = Math.min(...tmItems.map(i => i.main.temp_min));
            const midIndex = Math.floor(tmItems.length / 2);
            const midItem = tmItems[midIndex];
            
            tmStats = {
                max: Math.round(tmMax),
                min: Math.round(tmMin),
                icon: midItem.weather[0].main,
                condition: midItem.weather[0].main,
                temp: Math.round(midItem.main.temp)
            };
        }

        const hourly = todayItems.slice(1, 6).map(item => ({
            time: new Date(item.dt * 1000).getHours() + ':00',
            temp: Math.round(item.main.temp),
            icon: item.weather[0].main
        }));

        setWeatherData({
          currentTemp: Math.round(current.main.temp),
          condition: current.weather[0].main,
          humidity: current.main.humidity,
          wind: Math.round(current.wind.speed),
          todayMax: Math.round(todayMax),
          todayMin: Math.round(todayMin),
          hourlyForecast: hourly,
          tomorrow: tmStats,
          countryCode: data.city?.country,
          sunrise: data.city?.sunrise,
          sunset: data.city?.sunset
        });
      };

      if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 7200000) { 
                processData(parsed.data);
                setLoading(false);
                return;
            } else { localStorage.removeItem(`forecast_${queryName}`); }
        } catch(e) { localStorage.removeItem(`forecast_${queryName}`); }
      }

      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${queryName}&units=metric&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
            processData(data);
            localStorage.setItem(`forecast_${queryName}`, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
            console.error(`API Error (${res.status}):`, data.message);
            setErrorMsg(`Error: ${data.message}`);
            setWeatherData(null);
        }
      } catch (err) {
        console.error("Network Error:", err);
        setErrorMsg("Network Err");
        setWeatherData(null);
      } finally { setLoading(false); }
    };
    fetchWeather();
  }, [currentCity]);

  const [timeInfo, setTimeInfo] = useState({ digital: '', date: '', diff: '', sunrise: '', sunset: '', tmDayName: '' });
  
  useEffect(() => {
    if (!currentCity) return;
    const safeTZ = getSafeTimezone(currentCity.timezone);

    const updateTime = () => {
      const now = new Date();
      // فرمت ساعت دیجیتال با ثانیه
      const dTime = new Intl.DateTimeFormat('en-US', {
        timeZone: safeTZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(now);

      const dateStr = formatDate(now, isAfghan, lang);
      
      const targetTZ = isAfghan ? "Europe/London" : "Asia/Kabul";
      const targetName = isAfghan ? "London" : "Kabul";
      const refTime = new Date(now.toLocaleString("en-US", { timeZone: targetTZ }));
      const localTime = new Date(now.toLocaleString("en-US", { timeZone: safeTZ }));
      const diffMins = Math.round((localTime - refTime) / 60000);
      const diffStr = formatTimeDiff(diffMins, targetName, lang);

      const tm = new Date(now); tm.setDate(tm.getDate() + 1);
      const tmDayName = txt.weekDays[tm.getDay()];

      let sr = '--:--', ss = '--:--';
      if (weatherData?.sunrise) sr = new Intl.DateTimeFormat('en-US', { timeZone: safeTZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(weatherData.sunrise * 1000));
      if (weatherData?.sunset) ss = new Intl.DateTimeFormat('en-US', { timeZone: safeTZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(weatherData.sunset * 1000));

      setTimeInfo({ digital: dTime, date: dateStr, diff: diffStr, sunrise: sr, sunset: ss, tmDayName });
    };

    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, [currentCity, lang, weatherData, isAfghan]);

  const getWeatherIcon = (status, size = 32) => {
    if (status?.includes('Rain')) return <CloudRain size={size} className="text-blue-300 drop-shadow-md"/>;
    if (status?.includes('Clouds')) return <Cloud size={size} className="text-gray-300 drop-shadow-md"/>;
    if (status?.includes('Snow')) return <ThermometerSnowflake size={size} className="text-white drop-shadow-md"/>;
    return <Sun size={size} className="text-yellow-400 drop-shadow-md animate-pulse"/>;
  };

  if (!currentCity) return null;

  return (
    <div className="relative h-[350px] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl bg-gray-900 group transition-all duration-500 hover:shadow-orange-500/20">
      <style>{customStyles}</style>
      
      {/* Background */}
      <div key={currentCity.image} className="absolute inset-0 overflow-hidden">
         <img src={currentCity.image} className="w-full h-full object-cover opacity-100 anim-zoom" alt={currentCity.name} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#1e3a8a]/50 to-black/70 mix-blend-multiply opacity-90"></div>
      </div>

      <div className="absolute inset-0 p-5 flex flex-col justify-between z-10 text-white">
        
        {/* --- TOP ROW --- */}
        <div className="flex items-center justify-between">
           <div className="flex flex-col items-start min-w-[120px]">
              {!isAfghan && (
                 <span className="text-sm font-bold opacity-80 mb-[-4px] drop-shadow-md tracking-wider">
                    {currentCity.countryName || weatherData?.countryCode || 'WORLD'}
                 </span>
              )}
              <h2 className={`font-black drop-shadow-lg leading-tight text-left ${isAfghan ? 'text-4xl' : 'text-3xl'}`}>
                 <TypewriterText text={currentCity.faName} />
              </h2>
              {errorMsg && <span className="text-[10px] text-red-200 bg-red-900/50 px-2 rounded mt-1 border border-red-500/30">{errorMsg}</span>}
           </div>

           <div key={currentCity.id} className="flex flex-col items-center gap-1 mx-2 flex-1 w-[240px] anim-cube">
              {/* ساعت دیجیتال با فونت DS-Digital */}
              <div className="text-6xl font-digital tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] leading-none mt-1">
                 {timeInfo.digital}
              </div>
              <div className="flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap mb-0.5">
                 <ArrowLeftRight size={10} className="text-orange-400"/>
                 <span>{timeInfo.diff}</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-bold text-white/90 border border-white/10 whitespace-nowrap">
                 {timeInfo.date}
              </div>
           </div>

           <div className="scale-90 origin-right"><AnalogClock timeZone={currentCity.timezone} /></div>
        </div>

        {/* --- BOTTOM ROW (Swapped Layout: Left=Temp/Sun, Right=Details/Hourly) --- */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 border border-white/10 shadow-lg grid grid-cols-[1.3fr_1fr] gap-4 mt-2 anim-weather-smooth" key={`weather-${currentCity.id}`}>
           
           {/* سمت چپ (قبلا راست): دما + وضعیت + طلوع/غروب */}
           <div className="flex flex-col justify-between">
               
               <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                       {loading ? <Loader2 size={36} className="animate-spin"/> : getWeatherIcon(weatherData?.condition, 48)}
                       <div className="flex flex-col">
                           <span className="text-5xl font-black tracking-tighter leading-none">{weatherData?.currentTemp ?? '--'}°</span>
                           <span className="text-xs font-bold opacity-60 dir-ltr mt-1">{weatherData?.todayMax ?? '-'}° / {weatherData?.todayMin ?? '-'}°</span>
                       </div>
                   </div>
                   
                   {/* طلوع و غروب: عمودی و بدون متن */}
                   <div className="flex flex-col gap-2 bg-black/20 p-1.5 rounded-lg border border-white/5">
                       <div className="flex items-center gap-1 font-mono font-bold text-xs text-yellow-100">
                           <Sunrise size={16} className="text-yellow-300"/> {timeInfo.sunrise}
                       </div>
                       <div className="flex items-center gap-1 font-mono font-bold text-xs text-orange-100">
                           <Sunset size={16} className="text-orange-400"/> {timeInfo.sunset}
                       </div>
                   </div>
               </div>

               <div className="text-orange-200 font-bold text-sm opacity-90 mt-1">
                   {weatherData ? getWeatherSentence(weatherData.currentTemp, weatherData.condition, lang) : "..."}
               </div>

               <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 px-3 flex items-center justify-between mt-2">
                   <span className="text-[10px] font-bold opacity-80">{txt.tomorrow} {timeInfo.tmDayName}</span>
                   <div className="flex items-center gap-2">
                       {weatherData?.tomorrow ? (
                           <>
                               <span className="text-[9px] text-orange-100 font-bold hidden sm:block">
                                   {getWeatherSentence(weatherData.tomorrow.temp, weatherData.tomorrow.condition, lang)}
                               </span>
                               <span className="text-[10px] dir-ltr font-mono font-bold opacity-90 border-l border-white/10 pl-2 ml-1">
                                   {weatherData.tomorrow.max}° / {weatherData.tomorrow.min}°
                               </span>
                               {getWeatherIcon(weatherData.tomorrow.icon, 18)}
                           </>
                       ) : <span className="text-[9px]">...</span>}
                   </div>
               </div>
           </div>

           {/* سمت راست (قبلا چپ): جزئیات + ساعتی (افقی/سطری) */}
           <div className="flex flex-col justify-between gap-2 border-r border-white/5 pr-2">
               <div className="flex items-center justify-between text-xs bg-black/20 p-2 rounded-xl border border-white/5 h-full max-h-[50px]">
                   <div className="flex items-center gap-1"><Wind size={16} className="opacity-70"/> <span className="dir-ltr font-bold text-sm">{weatherData?.wind ?? '-'} m/s</span></div>
                   <div className="w-[1px] h-4 bg-white/20"></div>
                   <div className="flex items-center gap-1"><Droplets size={16} className="opacity-70 text-blue-300"/> <span className="dir-ltr font-bold text-sm">{weatherData?.humidity ?? '-'}%</span></div>
               </div>
               
               {/* نمودار ساعتی: سطری (Row) با اسکرول */}
               <div className="flex flex-col gap-1 mt-auto">
                   <span className="text-[10px] opacity-50 px-1 font-bold">{txt.today} (ساعتی):</span>
                   <div className="flex gap-2 overflow-x-auto no-scrollbar dir-ltr pb-1">
                       {weatherData?.hourlyForecast?.slice(0, 6).map((h, i) => (
                           <div key={i} className="flex flex-col items-center gap-0.5 bg-white/5 p-1.5 rounded-lg border border-white/5 min-w-[35px]">
                               <span className="text-[9px] opacity-50 font-mono">{h.time}</span>
                               {getWeatherIcon(h.icon, 16)}
                               <span className="text-[11px] font-bold">{h.temp}°</span>
                           </div>
                       ))}
                   </div>
               </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default function WeatherBlock({ cities, lang }) {
  const txt = t[lang] || t.dr;
  if (!cities || !Array.isArray(cities) || cities.length === 0) return null;

  const afghanCities = cities.filter(c => 
    c.timezone.toLowerCase().includes('kabul') || 
    c.timezone.toLowerCase().includes('afghanistan') || 
    c.name.toLowerCase() === 'kabul' ||
    (c.countryName && (c.countryName.includes('افغانستان') || c.countryName.toLowerCase().includes('afghanistan')))
  );
  
  const worldCities = cities.filter(c => !afghanCities.includes(c));

  if (afghanCities.length === 0 && cities.length > 0) afghanCities.push(cities[0]);
  if (worldCities.length === 0 && cities.length > 1) worldCities.push(cities[1]);

  return (
    <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center gap-3 mb-6 px-4">
        <div className="w-1.5 h-8 bg-[#f97316] rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
        <div>
            <h2 className="text-xl font-black text-[#1e3a8a]">{txt.title}</h2>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{txt.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        <RegionSlider cities={afghanCities} isAfghan={true} lang={lang} />
        <RegionSlider cities={worldCities} isAfghan={false} lang={lang} />
      </div>
    </div>
  );
}