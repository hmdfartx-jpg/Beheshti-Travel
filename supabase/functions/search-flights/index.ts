import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const origin = body.origin?.toUpperCase();
    const destination = body.destination?.toUpperCase();
    const date = body.date; 

    if (!origin || !destination) {
      return new Response(JSON.stringify({ error: 'مبدا و مقصد الزامی است' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // تغییر بسیار مهم: استفاده از کلید SERVICE_ROLE برای عبور از قفل‌های امنیتی دیتابیس
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' 
    );

    const AIRLABS_KEY = Deno.env.get('AIRLABS_API_KEY');
    const AVIATION_EDGE_KEY = Deno.env.get('AVIATION_EDGE_API_KEY');

    // ۱. دریافت پروازهای دستی
    const { data: dbFlights, error: dbErr } = await supabase
      .from('custom_flights')
      .select('*')
      .eq('origin_code', origin)
      .eq('destination_code', destination)
      .eq('status', 'active');

    if (dbErr) console.error("DB Error:", dbErr);

    const now = new Date();
    // فیلتر کردن دقیق در داخل جاوا اسکریپت
    const validManualFlights = (dbFlights || []).filter(f => {
       if (f.capacity <= 0) return false;
       if (date && f.departure_date !== date) return false; // بررسی تاریخ
       
       if (f.departure_date && f.departure_time) {
           const flightDate = new Date(`${f.departure_date}T${f.departure_time}:00`);
           if (flightDate < now) return false; // بررسی منقضی نشدن ساعت
       }
       return true;
    }).map(f => ({
        id: `db-${f.id}`,
        origin: f.origin_code,
        dest: f.destination_code,
        airline: f.airline,
        logo: f.airline_code || 'XX',
        flightNo: f.flight_no,
        dep: f.departure_time,
        arr: '---', 
        duration: 'پرواز چارتر',
        price: f.price, 
        em: f.flight_class || 'اکونومی',
        source: 'manual'
    }));

    // ۲. پروازهای Aviation Edge
    let aviationEdgeFlights = [];
    if (AVIATION_EDGE_KEY) {
        try {
            const res = await fetch(`https://aviation-edge.com/v2/public/timetable?iataCode=${origin}&type=departure&api_key=${AVIATION_EDGE_KEY}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                const filtered = data.filter((f: any) => f.arrival?.iataCode === destination);
                aviationEdgeFlights = filtered.map((f: any, idx: number) => ({
                    id: `ae-${idx}`,
                    origin: f.departure?.iataCode,
                    dest: f.arrival?.iataCode,
                    airline: f.airline?.name || 'Aviation Edge',
                    logo: f.airline?.iataCode || 'XX',
                    flightNo: f.flight?.iataNumber || 'Unknown',
                    dep: f.departure?.scheduledTime ? new Date(f.departure.scheduledTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}) : 'نامشخص',
                    arr: f.arrival?.scheduledTime ? new Date(f.arrival.scheduledTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}) : 'نامشخص',
                    duration: 'API',
                    price: Math.floor(Math.random() * (450 - 150 + 1)) + 150, 
                    em: 'اکونومی',
                    source: 'aviation_edge'
                }));
            }
        } catch (e) {}
    }

    // ۳. پروازهای AirLabs
    let airlabsFlights = [];
    if (AIRLABS_KEY) {
        try {
            const res = await fetch(`https://airlabs.co/api/v9/schedules?dep_iata=${origin}&arr_iata=${destination}&api_key=${AIRLABS_KEY}`);
            const data = await res.json();
            if (data.response) {
                airlabsFlights = data.response.map((f: any, idx: number) => ({
                    id: `al-${idx}`,
                    origin: f.dep_iata,
                    dest: f.arr_iata,
                    airline: f.airline_iata || 'AirLabs',
                    logo: f.airline_iata || 'XX',
                    flightNo: f.flight_iata || f.flight_number,
                    dep: f.dep_time ? f.dep_time.split(' ')[1] : 'نامشخص',
                    arr: f.arr_time ? f.arr_time.split(' ')[1] : 'نامشخص',
                    duration: f.duration ? `${Math.floor(f.duration / 60)}h ${f.duration % 60}m` : 'API',
                    price: Math.floor(Math.random() * (450 - 150 + 1)) + 150,
                    em: 'اکونومی',
                    source: 'airlabs'
                }));
            }
        } catch (e) {}
    }

    // ۴. ترکیب نتایج
    const finalFlights: any[] = [];
    const seenFlightNumbers = new Set();

    const addFlightIfNotExists = (flight: any) => {
        const uniqueId = flight.flightNo; 
        if (!seenFlightNumbers.has(uniqueId) && uniqueId !== 'Unknown') {
            seenFlightNumbers.add(uniqueId);
            finalFlights.push(flight);
        }
    };

    validManualFlights.forEach(addFlightIfNotExists);
    aviationEdgeFlights.forEach(addFlightIfNotExists);
    airlabsFlights.forEach(addFlightIfNotExists);

    return new Response(JSON.stringify({ flights: finalFlights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})