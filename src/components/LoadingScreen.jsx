import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [fillCompleted, setFillCompleted] = useState(false);

  useEffect(() => {
    // تنظیم زمان‌بندی: بعد از 2.5 ثانیه (پایان رسم خط)، داخل لوگو رنگ شود
    const timer = setTimeout(() => {
      setFillCompleted(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // رنگ اصلی لوگو
  const logoColor = "#207273"; 

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F8FAFB] flex flex-col items-center justify-center font-[Vazirmatn]" dir="ltr">
      
      <style>{`
        @keyframes draw-icon {
          0% { stroke-dashoffset: 2000; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes fill-icon {
          from { fill-opacity: 0; stroke-opacity: 1; }
          to { fill-opacity: 1; stroke-opacity: 0; }
        }

        @keyframes loader-bar {
          0% { width: 0%; left: 0; }
          50% { width: 50%; }
          100% { width: 100%; left: 100%; }
        }
        
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div className="relative w-32 md:w-40 mb-8">
        {/* SVG لوگو */}
        <svg 
          viewBox="0 0 190.86 242.57" 
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-auto drop-shadow-2xl ${fillCompleted ? 'animate-[pulse-logo_3s_infinite_ease-in-out]' : ''}`}
        >
          <path 
            d="M170.05,114.22c3.82,10.08,7.39,24.1,7.39,33.75,0,43.93-35.94,79.87-79.87,79.87H12.47l.96-.92c-.37.31-.73.61-1.1.91h-.35v-123.63l-2.33-2.87C-.14,89.94-6.9,66.47,11.98,59.81V9.46h96.31c33.71,0,61.68,27,61.68,60.14,0,17.29-6.9,33.04-18.08,44.64-22.07,20.68-73.72,30.16-94.41.63l31.31-13.03c-3.38-4.84-6.06-7.33-12.04-6.82l-31.48,2.68c-4.91-8.46-19.01-31.51-31.72-25.53h0c-8.1,11.83,12.9,29.82,19.81,35.58l-7.96,30.58c-1.5,5.81.49,8.86,4.69,13.02l18.13-28.66c4.22,7.58,18.8,19.83,7.14,53.13h0c-2.39,5.57-5.5,11-9.07,16.21h51.28c24.16,0,43.78-19.59,44.04-44.04.02-2.21-.26-5.71-1.28-9.22,7.67-3.58,14.83-8.29,21.19-14.25l.26-.25.25-.26c2.95-3.06,5.63-6.33,8.02-9.78h0Z"
            fill={logoColor}
            fillRule="evenodd" 
            stroke={logoColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2000"
            strokeDashoffset="2000"
            style={{
              animation: 'draw-icon 2.5s ease-in-out forwards',
              fillOpacity: fillCompleted ? 1 : 0,
              strokeOpacity: fillCompleted ? 0 : 1,
              transition: 'all 1s ease'
            }}
          />
        </svg>
      </div>

      {/* نام برند */}
      <h1 className="text-3xl font-black text-[#207273] tracking-wider mb-1 uppercase">
        Beheshti
      </h1>
      <h2 className="text-sm font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-8">
        Travel Agency
      </h2>

      {/* نوار لودینگ */}
      <div className="flex flex-col items-center gap-3 w-64">
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-[#207273] rounded-full"
            style={{ animation: 'loader-bar 2s infinite ease-in-out' }}
          ></div>
        </div>
        
        <p className="text-[#207273] text-[10px] font-bold tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>

    </div>
  );
}