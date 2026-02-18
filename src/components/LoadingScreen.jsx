import React from 'react';

export default function LoadingScreen() {
  const brandColor = "#207273";
  const goldColor = "#D4AF37";

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center font-[Vazirmatn]" dir="ltr">
      
      <style>{`
        /* انیمیشن ترکیبی: رسم خط -> پر شدن -> محو شدن -> تکرار */
        @keyframes draw-fill-loop {
          0% {
            stroke-dashoffset: 2000; /* شروع: خط کشیده نشده */
            fill-opacity: 0;         /* داخل خالی */
            stroke-opacity: 1;       /* خط دیده شود */
            opacity: 0;              /* کلا محو */
          }
          10% {
            opacity: 1;              /* ظاهر شدن */
          }
          40% {
            stroke-dashoffset: 0;    /* پایان رسم خط */
            fill-opacity: 0;
            stroke-opacity: 1;
          }
          60% {
            fill-opacity: 1;         /* پر شدن رنگ داخل */
            stroke-opacity: 0;       /* محو شدن خط دور */
          }
          85% {
            opacity: 1;              /* مکث */
            transform: scale(1);
          }
          95% {
            opacity: 0;              /* محو شدن برای شروع مجدد */
            transform: scale(0.95);
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 2000; /* ریست */
          }
        }

        /* انیمیشن ملایم برای متن */
        @keyframes text-fade-loop {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        
        {/* لوگو با انیمیشن تکرار شونده */}
        <div className="w-24 md:w-28">
          <svg 
            viewBox="0 0 190.86 242.57" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-xl"
          >
            <path 
              d="M170.05,114.22c3.82,10.08,7.39,24.1,7.39,33.75,0,43.93-35.94,79.87-79.87,79.87H12.47l.96-.92c-.37.31-.73.61-1.1.91h-.35v-123.63l-2.33-2.87C-.14,89.94-6.9,66.47,11.98,59.81V9.46h96.31c33.71,0,61.68,27,61.68,60.14,0,17.29-6.9,33.04-18.08,44.64-22.07,20.68-73.72,30.16-94.41.63l31.31-13.03c-3.38-4.84-6.06-7.33-12.04-6.82l-31.48,2.68c-4.91-8.46-19.01-31.51-31.72-25.53h0c-8.1,11.83,12.9,29.82,19.81,35.58l-7.96,30.58c-1.5,5.81.49,8.86,4.69,13.02l18.13-28.66c4.22,7.58,18.8,19.83,7.14,53.13h0c-2.39,5.57-5.5,11-9.07,16.21h51.28c24.16,0,43.78-19.59,44.04-44.04.02-2.21-.26-5.71-1.28-9.22,7.67-3.58,14.83-8.29,21.19-14.25l.26-.25.25-.26c2.95-3.06,5.63-6.33,8.02-9.78h0Z"
              fill={brandColor}
              fillRule="evenodd" 
              stroke={brandColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2000"
              style={{
                animation: 'draw-fill-loop 4s infinite ease-in-out'
              }}
            />
          </svg>
        </div>

        {/* نام شرکت */}
        <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-[#207273] tracking-wider uppercase" style={{ animation: 'text-fade-loop 4s infinite ease-in-out' }}>
                Beheshti
            </h1>
            <h2 className="text-xs font-bold text-[#D4AF37] tracking-[0.4em] uppercase">
                Travel Agency
            </h2>
        </div>

      </div>
    </div>
  );
}