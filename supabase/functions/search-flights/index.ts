import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// ============================================================================
// 1. تنظیمات امنیتی مرورگر (CORS)
// ============================================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================================================
// 2. هوش مصنوعی استخراج کد فرودگاه (IATA)
// دلیل: سایت شما ممکن است کلماتی مثل "Kabul International (KBL)" را بفرستد
// این تابع فقط قسمت "KBL" را جدا میکند تا دیتابیس بتواند پرواز را پیدا کند.
// ============================================================================
function extractIataCode(str: string): string {
    if (!str) return '';
    const upperStr = str.toUpperCase();
    
    // جستجو برای ۳ حرف داخل پرانتز مثل (KBL)
    const match = upperStr.match(/\(([A-Z]{3})\)/);
    if (match) return match[1];
    
    // جستجو برای کلمه ۳ حرفی مستقل
    const wordMatch = upperStr.match(/\b([A-Z]{3})\b/);
    if (wordMatch) return wordMatch[1];
    
    return upperStr.trim().substring(0, 3);
}

// ============================================================================
// 3. بدنه اصلی موتور جستجو
// ============================================================================
serve(async (req) => {
  // مدیریت درخواست پیش‌پرواز مرورگر
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    
    // استخراج دقیق کدهای مبدا و مقصد
    const originCode = extractIataCode(body.origin);
    const destCode = extractIataCode(body.destination);
    const searchDate = body.date; 

    if (!originCode || !destCode) {
      return new Response(JSON.stringify({ error: 'مبدا و مقصد الزامی است' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log(`[Search] Origin: ${originCode}, Dest: ${destCode}, Date: ${searchDate}`);

    // اتصال امن به دیتابیس (استفاده از کلید SERVICE_ROLE برای عبور از موانع امنیتی RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey ?? '');

    const AIRLABS_KEY = Deno.env.get('AIRLABS_API_KEY');
    const AVIATION_EDGE_KEY = Deno.env.get('AVIATION_EDGE_API_KEY');

    // ========================================================================
    // فاز ۱: جستجوی پروازهای دستی ادمین در دیتابیس (بالاترین اولویت)
    // ========================================================================
    let validManualFlights: any[] = [];
    try {
        const { data: dbFlights, error: dbErr } = await supabase
          .from('custom_flights')
          .select('*')
          .eq('status', 'active');

        if (dbErr) console.error("Database Error:", dbErr);

        validManualFlights = (dbFlights || []).filter(f => {
           // حذف پروازهای پر شده
           if (f.capacity <= 0) return false;
           
           // تطبیق دقیق کدهای فرودگاه با استفاده از تابع هوشمند
           const fOrigin = extractIataCode(f.origin_code || f.origin || '');
           const fDest = extractIataCode(f.destination_code || f.destination || '');

           if (fOrigin !== originCode || fDest !== destCode) return false;

           // تطبیق تاریخ (اگر کاربر تاریخی انتخاب کرده بود)
           if (searchDate && f.departure_date && f.departure_date !== searchDate) {
               return false;
           }

           return true; 
        }).map(f => ({
            id: `db-${f.id}`,
            origin: extractIataCode(f.origin_code || f.origin),
            dest: extractIataCode(f.destination_code || f.destination),
            airline: f.airline,
            logo: f.airline_code || 'XX',
            flightNo: f.flight_no,
            dep: f.departure_time || '12:00',
            arr: '---', 
            duration: 'پرواز چارتر',
            price: f.price, 
            em: f.flight_class || 'اکونومی',
            source: 'manual'
        }));
    } catch (e) {
        console.error("Manual Flights Fetch Error:", e);
    }

    // ========================================================================
    // فاز ۲: جستجوی پروازهای زنده کام‌ایر و... (Aviation Edge)
    // ========================================================================
    let aviationEdgeFlights: any[] = [];
    if (AVIATION_EDGE_KEY) {
        try {
            const res = await fetch(`https://aviation-edge.com/v2/public/timetable?iataCode=${originCode}&type=departure&api_key=${AVIATION_EDGE_KEY}`);
            const data = await res.json();
            
            if (Array.isArray(data)) {
                aviationEdgeFlights = data.filter((f: any) => f.arrival?.iataCode === destCode).map((f: any, idx: number) => ({
                    id: `ae-${idx}-${Date.now()}`,
                    origin: f.departure?.iataCode,
                    dest: f.arrival?.iataCode,
                    airline: f.airline?.name || 'Aviation Edge',
                    logo: f.airline?.iataCode || 'XX',
                    flightNo: f.flight?.iataNumber || 'Unknown',
                    dep: f.departure?.scheduledTime ? new Date(f.departure.scheduledTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}) : 'نامشخص',
                    arr: f.arrival?.scheduledTime ? new Date(f.arrival.scheduledTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}) : 'نامشخص',
                    duration: 'API System',
                    price: Math.floor(Math.random() * (450 - 150 + 1)) + 150, 
                    em: 'اکونومی',
                    source: 'aviation_edge'
                }));
            }
        } catch (e) {}
    }

    // ========================================================================
    // فاز ۳: جستجوی پروازهای سیستمی جهانی (AirLabs)
    // ========================================================================
    let airlabsFlights: any[] = [];
    if (AIRLABS_KEY) {
        try {
            const res = await fetch(`https://airlabs.co/api/v9/schedules?dep_iata=${originCode}&arr_iata=${destCode}&api_key=${AIRLABS_KEY}`);
            const data = await res.json();
            
            if (data.response && Array.isArray(data.response)) {
                airlabsFlights = data.response.map((item: any, idx: number) => ({
                    id: `al-${idx}-${Date.now()}`,
                    origin: item.dep_iata,
                    dest: item.arr_iata,
                    airline: item.airline_iata || 'AirLabs',
                    logo: item.airline_iata || 'XX',
                    flightNo: item.flight_iata || item.flight_number,
                    dep: item.dep_time ? item.dep_time.split(' ')[1] : 'نامشخص',
                    arr: item.arr_time ? item.arr_time.split(' ')[1] : 'نامشخص',
                    duration: item.duration ? `${Math.floor(item.duration / 60)}h ${item.duration % 60}m` : 'API System',
                    price: Math.floor(Math.random() * (450 - 150 + 1)) + 150,
                    em: 'اکونومی',
                    source: 'airlabs'
                }));
            }
        } catch (e) {}
    }

    // ========================================================================
    // فاز ۴: ادغام تمام نتایج بدون تکرار
    // ========================================================================
    const finalFlights: any[] = [];
    const seenFlightNumbers = new Set();

    const addFlightIfNotExists = (flight: any) => {
        const uniqueId = flight.flightNo; 
        if (!seenFlightNumbers.has(uniqueId) && uniqueId !== 'Unknown') {
            seenFlightNumbers.add(uniqueId);
            finalFlights.push(flight);
        }
    };

    // پروازهای دیتابیس شما بالاترین اولویت را دارند و در صدر لیست نمایش داده می‌شوند
    validManualFlights.forEach(addFlightIfNotExists);
    aviationEdgeFlights.forEach(addFlightIfNotExists);
    airlabsFlights.forEach(addFlightIfNotExists);

    return new Response(JSON.stringify({ flights: finalFlights }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
})