import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ArrowRightLeft, ChevronDown, User, Calendar, Plus, Minus, Check, Plane, ChevronLeft, ChevronRight, X, Phone, Loader2, Users, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PaymentModal from '../components/PaymentModal';

// --- لیست جامع و کامل فرودگاه‌ها (بدون حذفیات) ---
const AIRPORTS = [
  // --- افغانستان (Afghanistan) ---
  { code: 'KBL', name: 'Kabul International', city: 'Kabul', fa: 'کابل', ps: 'کابل', country: 'Afghanistan' },
  { code: 'HER', name: 'Herat International', city: 'Herat', fa: 'هرات', ps: 'هرات', country: 'Afghanistan' },
  { code: 'MZD', name: 'Mazar-i-Sharif International', city: 'Mazar-i-Sharif', fa: 'مزارشریف', ps: 'مزارشریف', country: 'Afghanistan' },
  { code: 'KDH', name: 'Kandahar International', city: 'Kandahar', fa: 'قندهار', ps: 'کندهار', country: 'Afghanistan' },
  { code: 'KHT', name: 'Khost International', city: 'Khost', fa: 'خوست', ps: 'خوست', country: 'Afghanistan' },
  { code: 'BST', name: 'Bost Airport', city: 'Lashkar Gah', fa: 'لشکرگاه', ps: 'لشکرګاه', country: 'Afghanistan' },
  { code: 'BNA', name: 'Bamyan Airport', city: 'Bamyan', fa: 'بامیان', ps: 'بامیان', country: 'Afghanistan' },
  { code: 'UND', name: 'Kunduz Airport', city: 'Kunduz', fa: 'قندوز', ps: 'کندز', country: 'Afghanistan' },
  { code: 'FBD', name: 'Faizabad Airport', city: 'Faizabad', fa: 'فیض‌آباد', ps: 'فیض‌اباد', country: 'Afghanistan' },
  { code: 'TII', name: 'Tarin Kowt Airport', city: 'Tarin Kowt', fa: 'ترین‌کوت', ps: 'ترینکوټ', country: 'Afghanistan' },
  { code: 'ZAJ', name: 'Zaranj Airport', city: 'Zaranj', fa: 'زرنج', ps: 'زرنج', country: 'Afghanistan' },
  { code: 'CCN', name: 'Chaghcharan Airport', city: 'Chaghcharan', fa: 'چغچران', ps: 'چغچران', country: 'Afghanistan' },

  // --- ایران (Iran) ---
  { code: 'IKA', name: 'Imam Khomeini International', city: 'Tehran', fa: 'تهران (امام خمینی)', ps: 'تهران (امام خمیني)', country: 'Iran' },
  { code: 'THR', name: 'Mehrabad International', city: 'Tehran', fa: 'تهران (مهرآباد)', ps: 'تهران (مهرآباد)', country: 'Iran' },
  { code: 'MHD', name: 'Mashhad International', city: 'Mashhad', fa: 'مشهد', ps: 'مشهد', country: 'Iran' },
  { code: 'SYZ', name: 'Shiraz International', city: 'Shiraz', fa: 'شیراز', ps: 'شیراز', country: 'Iran' },
  { code: 'TBZ', name: 'Tabriz International', city: 'Tabriz', fa: 'تبریز', ps: 'تبریز', country: 'Iran' },
  { code: 'IFN', name: 'Isfahan International', city: 'Isfahan', fa: 'اصفهان', ps: 'اصفهان', country: 'Iran' },
  { code: 'AWZ', name: 'Ahvaz International', city: 'Ahvaz', fa: 'اهواز', ps: 'اهواز', country: 'Iran' },
  { code: 'KIH', name: 'Kish International', city: 'Kish Island', fa: 'کیش', ps: 'کیش', country: 'Iran' },
  { code: 'GSM', name: 'Qeshm International', city: 'Qeshm Island', fa: 'قشم', ps: 'قشم', country: 'Iran' },
  { code: 'BND', name: 'Bandar Abbas International', city: 'Bandar Abbas', fa: 'بندرعباس', ps: 'بندرعباس', country: 'Iran' },
  { code: 'ZAH', name: 'Zahedan International', city: 'Zahedan', fa: 'زاهدان', ps: 'زاهدان', country: 'Iran' },
  { code: 'KER', name: 'Kerman Airport', city: 'Kerman', fa: 'کرمان', ps: 'کرمان', country: 'Iran' },
  { code: 'RAS', name: 'Rasht Airport', city: 'Rasht', fa: 'رشت', ps: 'رشت', country: 'Iran' },
  { code: 'OMH', name: 'Urmia Airport', city: 'Urmia', fa: 'ارومیه', ps: 'ارومیه', country: 'Iran' },
  { code: 'AZD', name: 'Yazd Airport', city: 'Yazd', fa: 'یزد', ps: 'یزد', country: 'Iran' },

  // --- پاکستان (Pakistan) ---
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', fa: 'اسلام‌آباد', ps: 'اسلام‌اباد', country: 'Pakistan' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', fa: 'لاهور', ps: 'لاهور', country: 'Pakistan' },
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', fa: 'کراچی', ps: 'کراچۍ', country: 'Pakistan' },
  { code: 'PEW', name: 'Bacha Khan International', city: 'Peshawar', fa: 'پیشاور', ps: 'پېښور', country: 'Pakistan' },
  { code: 'UET', name: 'Quetta International', city: 'Quetta', fa: 'کویته', ps: 'کوټه', country: 'Pakistan' },
  { code: 'MUX', name: 'Multan International', city: 'Multan', fa: 'مولتان', ps: 'ملتان', country: 'Pakistan' },
  { code: 'SKT', name: 'Sialkot International', city: 'Sialkot', fa: 'سیالکوت', ps: 'سیالکوټ', country: 'Pakistan' },

  // --- ترکیه (Turkey) ---
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', fa: 'استانبول (اصلی)', ps: 'استانبول', country: 'Turkey' },
  { code: 'SAW', name: 'Sabiha Gokcen', city: 'Istanbul', fa: 'استانبول (صبیحه)', ps: 'استانبول (صبیحه)', country: 'Turkey' },
  { code: 'ESB', name: 'Ankara Esenboga', city: 'Ankara', fa: 'آنکارا', ps: 'انقره', country: 'Turkey' },
  { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', fa: 'آنتالیا', ps: 'انتالیا', country: 'Turkey' },
  { code: 'ADB', name: 'Izmir Adnan Menderes', city: 'Izmir', fa: 'ازمیر', ps: 'ازمیر', country: 'Turkey' },
  { code: 'TZX', name: 'Trabzon Airport', city: 'Trabzon', fa: 'ترابزون', ps: 'ترابزون', country: 'Turkey' },

  // --- امارات متحده عربی (UAE) ---
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', fa: 'دبی', ps: 'دوبۍ', country: 'UAE' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', fa: 'شارجه', ps: 'شارجه', country: 'UAE' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', fa: 'ابوظبی', ps: 'ابوظبۍ', country: 'UAE' },
  { code: 'RKT', name: 'Ras Al Khaimah', city: 'Ras Al Khaimah', fa: 'راس‌الخیمه', ps: 'راس‌الخیمه', country: 'UAE' },
  { code: 'AAN', name: 'Al Ain International', city: 'Al Ain', fa: 'العین', ps: 'العین', country: 'UAE' },

  // --- عربستان سعودی (Saudi Arabia) ---
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', fa: 'جده', ps: 'جده', country: 'Saudi Arabia' },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', fa: 'ریاض', ps: 'ریاض', country: 'Saudi Arabia' },
  { code: 'DMM', name: 'King Fahd', city: 'Dammam', fa: 'دمام', ps: 'دمام', country: 'Saudi Arabia' },
  { code: 'MED', name: 'Prince Mohammad', city: 'Medina', fa: 'مدینه', ps: 'مدینه', country: 'Saudi Arabia' },

  // --- هند (India) ---
  { code: 'DEL', name: 'Indira Gandhi', city: 'New Delhi', fa: 'دهلی نو', ps: 'نوی ډیلي', country: 'India' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', fa: 'مبئی', ps: 'ممبۍ', country: 'India' },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee', city: 'Amritsar', fa: 'آمریتسار', ps: 'امریتسار', country: 'India' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', fa: 'چنای', ps: 'چنای', country: 'India' },
  { code: 'BLR', name: 'Kempegowda', city: 'Bangalore', fa: 'بنگلور', ps: 'بنګلور', country: 'India' },
  { code: 'HYD', name: 'Rajiv Gandhi', city: 'Hyderabad', fa: 'حیدرآباد', ps: 'حیدرآباد', country: 'India' },

  // --- آسیای میانه (Central Asia) ---
  { code: 'DYU', name: 'Dushanbe International', city: 'Dushanbe', fa: 'دوشنبه', ps: 'دوشنبه', country: 'Tajikistan' },
  { code: 'TAS', name: 'Islam Karimov', city: 'Tashkent', fa: 'تاشکند', ps: 'تاشکند', country: 'Uzbekistan' },
  { code: 'ASB', name: 'Ashgabat International', city: 'Ashgabat', fa: 'عشق‌آباد', ps: 'عشق اباد', country: 'Turkmenistan' },
  { code: 'ALA', name: 'Almaty International', city: 'Almaty', fa: 'آلماتی', ps: 'الماتی', country: 'Kazakhstan' },
  { code: 'FRU', name: 'Manas International', city: 'Bishkek', fa: 'بیشکک', ps: 'بیشکک', country: 'Kyrgyzstan' },
  { code: 'LBD', name: 'Khujand Airport', city: 'Khujand', fa: 'خجند', ps: 'خجند', country: 'Tajikistan' },

  // --- خاورمیانه و خلیج فارس (Middle East) ---
  { code: 'DOH', name: 'Hamad International', city: 'Doha', fa: 'دوحه', ps: 'دوحه', country: 'Qatar' },
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait', fa: 'کویت', ps: 'کویت', country: 'Kuwait' },
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', fa: 'مسقط', ps: 'مسقط', country: 'Oman' },
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', fa: 'منامه', ps: 'منامه', country: 'Bahrain' },
  { code: 'BGW', name: 'Baghdad International', city: 'Baghdad', fa: 'بغداد', ps: 'بغداد', country: 'Iraq' },
  { code: 'NJF', name: 'Al Najaf International', city: 'Najaf', fa: 'نجف', ps: 'نجف', country: 'Iraq' },
  { code: 'AMM', name: 'Queen Alia', city: 'Amman', fa: 'امان', ps: 'امان', country: 'Jordan' },

  // --- اروپا (Europe) ---
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', fa: 'فرانکفورت', ps: 'فرانکفورت', country: 'Germany' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', fa: 'مونیخ', ps: 'مونیخ', country: 'Germany' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', fa: 'برلین', ps: 'برلین', country: 'Germany' },
  { code: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', fa: 'هامبورگ', ps: 'هامبورګ', country: 'Germany' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', fa: 'لندن (هیترو)', ps: 'لندن (هیترو)', country: 'UK' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', fa: 'لندن (گت‌ویک)', ps: 'لندن (ګت‌ویک)', country: 'UK' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', fa: 'منچستر', ps: 'منچستر', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', fa: 'پاریس', ps: 'پاریس', country: 'France' },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', fa: 'آمستردام', ps: 'امستردام', country: 'Netherlands' },
  { code: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', fa: 'رم', ps: 'روم', country: 'Italy' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', fa: 'میلان', ps: 'میلان', country: 'Italy' },
  { code: 'MAD', name: 'Adolfo Suarez', city: 'Madrid', fa: 'مادرید', ps: 'مادرید', country: 'Spain' },
  { code: 'BCN', name: 'El Prat', city: 'Barcelona', fa: 'بارسلونا', ps: 'بارسلونا', country: 'Spain' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', fa: 'وین', ps: 'وین', country: 'Austria' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', fa: 'زوریخ', ps: 'زوریخ', country: 'Switzerland' },
  { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', fa: 'بروکسل', ps: 'بروکسل', country: 'Belgium' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', fa: 'کپنهاگ', ps: 'کوپنهاګ', country: 'Denmark' },
  { code: 'ARN', name: 'Arlanda Airport', city: 'Stockholm', fa: 'استکهلم', ps: 'ستوکهولم', country: 'Sweden' },
  { code: 'OSL', name: 'Gardermoen', city: 'Oslo', fa: 'اسلو', ps: 'اسلو', country: 'Norway' },
  { code: 'SVO', name: 'Sheremetyevo', city: 'Moscow', fa: 'مسکو (شرمتیوو)', ps: 'مسکو', country: 'Russia' },
  { code: 'VKO', name: 'Vnukovo', city: 'Moscow', fa: 'مسکو (ونوکوو)', ps: 'مسکو', country: 'Russia' },

  // --- آمریکای شمالی (North America) ---
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', fa: 'نیویورک', ps: 'نیویارک', country: 'USA' },
  { code: 'IAD', name: 'Dulles International', city: 'Washington DC', fa: 'واشنگتن', ps: 'واشنګټن', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', fa: 'لس‌آنجلس', ps: 'لاس انجلس', country: 'USA' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', fa: 'شیکاگو', ps: 'شیکاګو', country: 'USA' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', fa: 'سان‌فرانسیسکو', ps: 'سان فرانسیسکو', country: 'USA' },
  { code: 'YYZ', name: 'Pearson International', city: 'Toronto', fa: 'تورنتو', ps: 'تورنتو', country: 'Canada' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', fa: 'ونکوور', ps: 'ونکوور', country: 'Canada' },
  { code: 'YUL', name: 'Trudeau International', city: 'Montreal', fa: 'مونترال', ps: 'مونتریال', country: 'Canada' },

  // --- شرق آسیا و اقیانوسیه (Asia Pacific) ---
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', fa: 'بانکوک', ps: 'بانکوک', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', fa: 'کوالالامپور', ps: 'کوالالمپور', country: 'Malaysia' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', fa: 'سنگاپور', ps: 'سنګاپور', country: 'Singapore' },
  { code: 'CAN', name: 'Baiyun International', city: 'Guangzhou', fa: 'گوانگجو', ps: 'ګوانګجو', country: 'China' },
  { code: 'PEK', name: 'Capital International', city: 'Beijing', fa: 'پکن', ps: 'بیجینګ', country: 'China' },
  { code: 'URC', name: 'Diwopu International', city: 'Urumqi', fa: 'ارومچی', ps: 'ارومچی', country: 'China' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', fa: 'سئول', ps: 'سیول', country: 'South Korea' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', fa: 'توکیو', ps: 'توکیو', country: 'Japan' },
  { code: 'SYD', name: 'Kingsford Smith', city: 'Sydney', fa: 'سیدنی', ps: 'سیډني', country: 'Australia' },
  { code: 'MEL', name: 'Tullamarine', city: 'Melbourne', fa: 'ملبورن', ps: 'ملبورن', country: 'Australia' }
];

// --- توابع تبدیل تاریخ (Jalaali Logic) ---
const jalaali = {
  toJalaali: (gy, gm, gd) => {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = (365 * gy) + parseInt((gy2 + 3) / 4) - parseInt((gy2 + 99) / 100) + parseInt((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * parseInt(days / 12053);
    days %= 12053;
    jy += 4 * parseInt(days / 1461);
    days %= 1461;
    jy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    let jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { jy, jm, jd };
  },
  toGregorian: (jy, jm, jd) => {
    let gy = (jy <= 979) ? 621 : 1600;
    jy -= (jy <= 979) ? 0 : 979;
    let days = (365 * jy) + (parseInt(jy / 33) * 8) + parseInt(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * parseInt(days / 146097);
    days %= 146097;
    if (days > 36524) {
      days--;
      gy += 100 * parseInt(days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * parseInt(days / 1461);
    days %= 1461;
    gy += parseInt((days - 1) / 365);
    if (days > 365) days = (days - 1) % 365;
    let gd = days + 1;
    let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm;
    for (gm = 0; gm < 13; gm++) {
      let v = sal_a[gm];
      if (gd <= v) break;
      gd -= v;
    }
    return new Date(gy, gm - 1, gd);
  },
  jalaaliMonthLength: (jy, jm) => {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    const isLeap = (jy % 33 === 1 || jy % 33 === 5 || jy % 33 === 9 || jy % 33 === 13 || jy % 33 === 17 || jy % 33 === 22 || jy % 33 === 26 || jy % 33 === 30);
    return isLeap ? 30 : 29;
  }
};

// --- نام ماه‌ها (با نام‌های افغانی برای شمسی) ---
const MONTH_NAMES = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  dr_gregorian: ["جنوری", "فبروری", "مارچ", "اپریل", "می", "جون", "جولای", "آگوست", "سپتامبر", "اکتوبر", "نوامبر", "دسامبر"],
  ps_gregorian: ["جنوري", "فبروري", "مارچ", "اپریل", "می", "جون", "جولای", "اګست", "سپتمبر", "اکتوبر", "نومبر", "دسمبر"],
  dr_solar: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت"],
  ps_solar: ["وری", "غویی", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "لیندۍ", "مرغومی", "سلواغه", "کب"]
};

// --- ترجمه‌ها ---
const translations = {
  dr: {
    one_way: "یک طرفه", round_trip: "رفت و برگشت",
    economy: "اکونومی", business: "بیزنس", first: "فرست کلاس",
    adults: "بزرگسال", children: "کودک", passenger: "مسافر", confirm: "تایید",
    modalInfoTitle: "اطلاعات مسافر",
    modalInfoDesc: "برای رزرو پرواز، لطفاً مشخصات زیر را وارد کنید.",
    labelName: "نام و نام خانوادگی", labelPhone: "شماره تماس",
    placeName: "مثلا: احمد محمدی", placePhone: "0799...",
    btnSubmit: "ثبت و ادامه جهت پرداخت", btnLoading: "در حال ثبت...",
    modalSuccessTitle: "رزرو اولیه انجام شد!", labelOrderId: "شماره سفارش",
    modalPayDesc: "برای نهایی کردن بلیط، لطفاً پرداخت را انجام دهید.",
    paySuccessMsg: "پرداخت با موفقیت انجام شد و بلیط صادر گردید!",
    errorEmpty: "لطفا نام و شماره تماس را وارد کنید",
    errorBooking: "خطا در ثبت رزرو. لطفا دوباره تلاش کنید.",
    searching: "در حال جستجو در ایرلاین‌ها...",
    noResult: "پروازی یافت نشد. لطفاً مسیر دیگری را امتحان کنید.",
    originLabel: "مبدا (شهر یا فرودگاه)", destLabel: "مقصد (شهر یا فرودگاه)",
    select_date: "تاریخ رفت", return_date: "تاریخ برگشت", close: "بستن", today: "برو به امروز"
  },
  ps: {
    one_way: "یو طرفه", round_trip: "تګ راتګ",
    economy: "اکونومي", business: "بیزنس", first: "لومړۍ درجه",
    adults: "لویان", children: "ماشومان", passenger: "مسافر", confirm: "تایید",
    modalInfoTitle: "د مسافر معلومات", modalInfoDesc: "د الوتنې د ثبت لپاره، مهرباني وکړئ لاندې مشخصات دننه کړئ.",
    labelName: "بشپړ نوم", labelPhone: "د اړیکې شمېره",
    placeName: "مثلا: احمد محمدي", placePhone: "0799...",
    btnSubmit: "ثبت او د تادیې لپاره دوام", btnLoading: "د ثبت په حال کې...",
    modalSuccessTitle: "لومړنی ثبت ترسره شو!", labelOrderId: "د سپارښتنې شمېره",
    modalPayDesc: "د ټکټ نهایي کولو لپاره، مهرباني وکړئ تادیه ترسره کړئ.",
    paySuccessMsg: "تادیه په بریالیتوب سره ترسره شوه!",
    errorEmpty: "مهرباني وکړئ نوم او د اړیکې شمېره دننه کړئ",
    errorBooking: "د ثبت پرمهال ستونزه. مهرباني وکړئ بیا هڅه وکړئ.",
    searching: "د الوتنو پلټنه...", noResult: "هیڅ الوتنه ونه موندل شوه.",
    originLabel: "مبدا (ښار یا هوايي ډګر)", destLabel: "مقصد (ښار یا هوايي ډګر)",
    select_date: "د تګ نیټه", return_date: "د راستنیدو نیټه", close: "بندول", today: "نن ورځ"
  },
  en: {
    one_way: "One Way", round_trip: "Round Trip",
    economy: "Economy", business: "Business", first: "First Class",
    adults: "Adults", children: "Children", passenger: "Passenger", confirm: "Confirm",
    modalInfoTitle: "Passenger Info", modalInfoDesc: "Please enter your details to book the flight.",
    labelName: "Full Name", labelPhone: "Phone Number",
    placeName: "Ex: John Doe", placePhone: "+93...",
    btnSubmit: "Register & Pay", btnLoading: "Registering...",
    modalSuccessTitle: "Booking Initiated!", labelOrderId: "Order ID",
    modalPayDesc: "Please proceed with payment to finalize your ticket.",
    paySuccessMsg: "Payment successful! Ticket has been issued.",
    errorEmpty: "Please enter your name and phone number.",
    errorBooking: "Booking failed. Please try again.",
    searching: "Searching airlines...", noResult: "No flights found. Please try another route.",
    originLabel: "Origin (City or Airport)", destLabel: "Destination (City or Airport)",
    select_date: "Depart Date", return_date: "Return Date", close: "Close", today: "Go to Today"
  }
};

const AirportSearch = ({ value, onChange, placeholder, icon: Icon, lang = 'dr' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const isLtr = lang === 'en';

  const getDisplayName = (a) => lang === 'en' ? `${a.name} (${a.code})` : lang === 'ps' ? `${a.ps} (${a.code})` : `${a.fa} (${a.code})`;

  useEffect(() => {
    const found = AIRPORTS.find(a => a.code === value);
    if (found) setSearch(getDisplayName(found));
    else if (!value) setSearch('');
  }, [value, lang]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        const found = AIRPORTS.find(a => a.code === value);
        setSearch(found ? getDisplayName(found) : '');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, lang]);

  const filteredAirports = AIRPORTS.filter(a => 
    a.city.toLowerCase().includes(search.toLowerCase()) || 
    a.code.toLowerCase().includes(search.toLowerCase()) ||
    a.fa.includes(search) || a.ps.includes(search) ||
    (lang === 'en' && a.name.toLowerCase().includes(search.toLowerCase()))
  );

  const isCentered = !search && !isOpen;

  return (
    <div className="relative w-full h-full" ref={wrapperRef}>
      <div 
        className="relative w-full h-full hover:bg-gray-50 rounded-xl transition-colors duration-300 cursor-text group"
        onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
      >
        <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 px-2 rounded-full
            ${isCentered 
               ? 'top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold bg-transparent'
               : 'top-0 -translate-y-1/2 text-[11px] text-[#058B8C] font-black bg-white shadow-sm'
             }`}
        >
             {placeholder}
        </div>

        <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-10
            ${isCentered 
               ? (isLtr ? 'left-1/2 -translate-x-[110px] text-gray-400' : 'left-1/2 translate-x-[85px] text-gray-400')
               : (isLtr ? 'left-4 text-[#058B8C]' : 'left-[calc(100%-25px)] -translate-x-1/2 text-[#058B8C]')
            }`}
        >
            <Icon size={20}/>
        </div>

        <input 
          ref={inputRef}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          className={`w-full h-full bg-transparent outline-none font-black text-gray-800 text-lg transition-all duration-300 px-10
            ${isCentered ? 'opacity-0' : 'opacity-100'} ${isLtr ? 'text-left' : 'text-right'}`}
          autoComplete="off"
          dir={isLtr ? 'ltr' : 'rtl'}
        />

        {value && (
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onChange(''); 
                    setSearch(''); 
                    inputRef.current?.focus(); 
                }} 
                className={`absolute top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full animate-in fade-in z-20 ${isLtr ? 'right-3' : 'left-3'}`}
             >
                <X size={14} className="text-gray-400"/>
            </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95">
           {filteredAirports.length > 0 ?
          filteredAirports.map(item => (
            <div 
              key={item.code} 
              className={`px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-50 last:border-0 ${isLtr ? 'flex-row text-left justify-between' : 'flex-row-reverse text-right justify-between'}`}
              onClick={() => {
                onChange(item.code);
                setSearch(getDisplayName(item));
                setIsOpen(false);
              }}
            >
              <div>
                <div className="font-bold text-gray-800 text-sm">
                   {lang === 'en' ? item.name : (lang === 'ps' ? item.ps : item.fa)} 
                   <span className="text-xs text-gray-500 font-normal mx-1">({item.city})</span>
                </div>
                <div className="text-[10px] text-gray-400">{item.country}</div>
              </div>
              <span className="font-mono font-black text-[#058B8C] bg-blue-50 px-2 py-1 rounded text-xs">{item.code}</span>
            </div>
          )) : (
            <div className="p-4 text-center text-gray-400 text-xs">
                {lang === 'en' ? "No results found" : "موردی یافت نشد"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- کامپوننت هوشمند تقویم (Smart Calendar) ---
const SmartCalendar = ({ selectedDate, onSelect, onClose, lang }) => {
  const isLtr = lang === 'en';
  const today = new Date();
  today.setHours(0,0,0,0);

  // استیت نمایش فعلی: اگر انگلیسی باشد میلادی، اگر فارسی/پشتو باشد شمسی
  const [currentView, setCurrentView] = useState(() => {
      if (isLtr) {
          return { year: today.getFullYear(), month: today.getMonth() }; // Gregorian (0-11)
      } else {
          const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
          return { year: jToday.jy, month: jToday.jm - 1 }; // Jalaali (0-11)
      }
  });

  const changeMonth = (offset) => {
      let newMonth = currentView.month + offset;
      let newYear = currentView.year;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      else if (newMonth < 0) { newMonth = 11; newYear--; }
      
      // جلوگیری از رفتن به ماه قبل از ماه جاری
      if (isLtr) {
          if (new Date(newYear, newMonth, 1) < new Date(today.getFullYear(), today.getMonth(), 1)) return;
      } else {
          const jToday = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
          if (newYear < jToday.jy || (newYear === jToday.jy && newMonth < jToday.jm - 1)) return;
      }
      setCurrentView({ year: newYear, month: newMonth });
  };

  const generateDays = () => {
      const days = [];
      let daysInMonth, startDayOfWeek;

      if (isLtr) {
          // --- حالت انگلیسی (اصلی: میلادی) ---
          daysInMonth = new Date(currentView.year, currentView.month + 1, 0).getDate();
          startDayOfWeek = new Date(currentView.year, currentView.month, 1).getDay(); // 0=Sun
      } else {
          // --- حالت دری/پشتو (اصلی: شمسی) ---
          daysInMonth = jalaali.jalaaliMonthLength(currentView.year, currentView.month + 1);
          // پیدا کردن روز هفته اول ماه شمسی
          const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
          const jsDay = gDate.getDay(); // 0=Sun ... 6=Sat
          // برای تقویم فارسی که شنبه اول است (0)، باید شیفت دهیم:
          // Sat(6)->0, Sun(0)->1, Mon(1)->2, ... Fri(5)->6
          startDayOfWeek = (jsDay + 1) % 7; 
      }

      for (let i = 0; i < startDayOfWeek; i++) days.push({ empty: true });

      for (let i = 1; i <= daysInMonth; i++) {
          let dateObj, isPast, dateString, secondaryDay;
          
          if (isLtr) {
              dateObj = new Date(currentView.year, currentView.month, i);
              isPast = dateObj < today;
              const jDate = jalaali.toJalaali(currentView.year, currentView.month + 1, i);
              secondaryDay = jDate.jd;
              dateString = `${currentView.year}-${String(currentView.month + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
          } else {
              const gDate = jalaali.toGregorian(currentView.year, currentView.month + 1, i);
              dateObj = gDate;
              isPast = gDate < today;
              secondaryDay = gDate.getDate();
              dateString = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2,'0')}-${String(gDate.getDate()).padStart(2,'0')}`;
          }

          days.push({
              day: i,
              secondaryDay: secondaryDay,
              dateString: dateString,
              isPast: isPast,
              isSelected: selectedDate === dateString,
              isToday: dateObj.getTime() === today.getTime()
          });
      }
      return days;
  };

  const getSecondaryMonthRange = () => {
      if (isLtr) {
          // انگلیسی: زیرش نام ماه شمسی (افغانی) بیاید
          const startJ = jalaali.toJalaali(currentView.year, currentView.month + 1, 1);
          const endJ = jalaali.toJalaali(currentView.year, currentView.month + 1, 28); 
          const m1 = MONTH_NAMES.dr_solar[startJ.jm - 1]; 
          const m2 = MONTH_NAMES.dr_solar[endJ.jm - 1];
          return startJ.jm === endJ.jm ? m1 : `${m1} - ${m2}`;
      } else {
          // دری/پشتو: زیرش نام ماه میلادی بیاید (به خط دری/پشتو)
          const startG = jalaali.toGregorian(currentView.year, currentView.month + 1, 1);
          const endG = jalaali.toGregorian(currentView.year, currentView.month + 1, 28);
          const mArr = lang === 'ps' ? MONTH_NAMES.ps_gregorian : MONTH_NAMES.dr_gregorian;
          const m1 = mArr[startG.getMonth()];
          const m2 = mArr[endG.getMonth()];
          return startG.getMonth() === endG.getMonth() ? m1 : `${m1} - ${m2}`;
      }
  };

  const daysGrid = generateDays();
  const weekDayNames = isLtr ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  
  const primaryMonthName = isLtr 
      ? MONTH_NAMES.en[currentView.month] 
      : (lang === 'ps' ? MONTH_NAMES.ps_solar[currentView.month] : MONTH_NAMES.dr_solar[currentView.month]);

  const toNativeNum = (num) => isLtr ? num : String(num).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

  return (
    <div className="absolute top-full left-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 w-[340px] md:w-[360px] animate-in zoom-in-95 origin-top-left" onClick={e => e.stopPropagation()} dir={isLtr ? 'ltr' : 'rtl'}>
        
        {/* هدر تقویم */}
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-2xl">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition disabled:opacity-30">
                {isLtr ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
            </button>
            <div className="text-center">
                <span className="font-black text-lg text-gray-800 block leading-none">
                    {primaryMonthName} {toNativeNum(currentView.year)}
                </span>
                <span className="text-xs font-bold text-[#058B8C] mt-1 block">
                    {getSecondaryMonthRange()}
                </span>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow rounded-full text-gray-600 transition">
                {isLtr ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
            </button>
        </div>

        {/* روزهای هفته */}
        <div className="grid grid-cols-7 text-center mb-2">
            {weekDayNames.map((d, i) => (
                <div key={i} className={`text-xs font-black ${i===0 || i===6 ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>
            ))}
        </div>

        {/* شبکه روزها */}
        <div className="grid grid-cols-7 gap-1.5">
            {daysGrid.map((d, idx) => {
                if (d.empty) return <div key={idx}></div>;
                return (
                    <button 
                        key={idx}
                        disabled={d.isPast}
                        onClick={() => !d.isPast && onSelect(d.dateString)}
                        className={`
                            h-12 rounded-xl flex flex-col items-center justify-center relative transition-all border border-transparent
                            ${d.isPast ? 'text-gray-300 cursor-not-allowed bg-gray-50/50' : 'hover:bg-blue-50 hover:border-blue-200 cursor-pointer text-gray-700'}
                            ${d.isSelected ? '!bg-[#058B8C] !text-white shadow-lg shadow-[#058B8C]/30 transform scale-105 z-10' : ''}
                            ${d.isToday && !d.isSelected ? 'border border-[#058B8C] text-[#058B8C] font-bold' : ''}
                        `}
                    >
                        {/* عدد اصلی (بزرگ) */}
                        <span className="text-sm font-black leading-none mb-0.5">{toNativeNum(d.day)}</span>
                        {/* عدد فرعی (کوچک) */}
                        <span className={`text-[9px] font-bold ${d.isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            {toNativeNum(d.secondaryDay)}
                        </span>
                    </button>
                )
            })}
        </div>

        {/* فوتر */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
            <button onClick={onClose} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                {translations[lang].close}
            </button>
        </div>
    </div>
  );
};

const TopFilterBtn = ({ label, active, onClick, icon: Icon }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all relative ${active ? 'bg-white text-[#1e3a8a] border border-gray-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}> {Icon && <Icon size={16}/>} {label} <ChevronDown size={14} className={`transition-transform duration-200 ${active ? 'rotate-180' : ''}`}/> </button>
);

export default function Tickets({ t, setPage, lang, initialData, onBookSuccess }) {
  const [searchState, setSearchState] = useState('idle');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [bookedOrder, setBookedOrder] = useState(null);
  const isLtr = lang === 'en';

  const txt = translations[lang] || translations.dr;
  const lt = { 
      search: lang==='en'?'Search':(lang==='dr'?'جستجوی پرواز':'لټون'), 
      select_date: lang==='en'?'Depart Date':(lang==='dr'?'تاریخ رفت':'نیټه'), 
      return_date: lang==='en'?'Return Date':(lang==='dr'?'تاریخ برگشت':'راستنیدو نیټه') 
  };
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '', tripType: 'one_way', flightClass: 'economy', adults: 1, children: 0 });
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      performSearch(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (data) => {
    setSearchState('loading');
    setResults([]);
    try {
        const { data: resData, error } = await supabase.functions.invoke('search-flights', {
            body: { 
                origin: data.origin.toUpperCase(), 
                destination: data.destination.toUpperCase() 
            }
        });
        if (error) throw error;
        
        if (resData.flights && resData.flights.length > 0) {
            setResults(resData.flights);
            setSearchState('results');
        } else {
            setSearchState('empty');
        }

    } catch (err) {
        console.error("Search Error:", err);
        setSearchState('empty');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(!formData.origin || !formData.destination) {
        alert(txt.errorEmpty);
        return;
    }
    performSearch(formData);
  };

  const openInfoModal = (flight) => {
    setSelectedFlight(flight);
    setCustomerInfo({ name: '', phone: '' });
  };

  const handleSubmitBooking = async (e) => {
     e.preventDefault();
     if(!customerInfo.name || !customerInfo.phone) {
         alert(txt.errorEmpty);
         return;
     }
     
     setBookingLoading(true);
     const { data, error } = await supabase.from('bookings').insert([{ 
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        flight_info: selectedFlight, 
        status: 'pending_payment',
        amount: selectedFlight.price * 70 
     }]).select();
     setBookingLoading(false);

     if (error) {
       console.error("Error booking:", error);
       alert(`${txt.errorBooking}`);
     } else {
       if (data && data.length > 0) {
           const newOrder = data[0];
           setBookedOrder({
               id: newOrder.id,
               amount: newOrder.amount
           });
           setSelectedFlight(null);
       }
     }
  };

  return (
    <div className="space-y-8 animate-in fade-in font-[Vazirmatn]" dir={isLtr ? 'ltr' : 'rtl'}>
       
       {selectedFlight && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative" dir={isLtr ? 'ltr' : 'rtl'}>
                <button onClick={() => setSelectedFlight(null)} className={`absolute top-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 ${isLtr ? 'right-4' : 'left-4'}`}><X size={20}/></button>
                <h3 className="text-xl font-black text-gray-800 mb-1">{txt.modalInfoTitle}</h3>
                <p className="text-sm text-gray-500 mb-6">{txt.modalInfoDesc}</p>
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{txt.labelName}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-3">
                            <User size={18} className="text-gray-400"/>
                            <input autoFocus value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold" placeholder={txt.placeName}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">{txt.labelPhone}</label>
                        <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-3">
                            <Phone size={18} className="text-gray-400"/>
                            <input type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="bg-transparent outline-none w-full text-sm font-bold text-left dir-ltr" placeholder={txt.placePhone}/>
                        </div>
                    </div>
                    <button type="submit" disabled={bookingLoading} className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-200">
                        {bookingLoading ? txt.btnLoading : txt.btnSubmit}
                    </button>
                </form>
            </div>
         </div>
       )}

       {bookedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95">
             <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative" dir={isLtr ? 'ltr' : 'rtl'}>
                <button onClick={() => setBookedOrder(null)} className={`absolute top-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 ${isLtr ? 'right-4' : 'left-4'}`}><X size={20}/></button>
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><Check size={40}/></div>
                    <h3 className="text-2xl font-black text-gray-800">{txt.modalSuccessTitle}</h3>
                    <p className="text-gray-500 mt-2 text-sm">{txt.labelOrderId}: <span className="font-mono bg-gray-100 px-2 rounded mx-1 font-bold">{String(bookedOrder.id).slice(0,8)}</span></p>
                    <p className="text-gray-600 mt-4 text-sm">{txt.modalPayDesc}</p>
                </div>
                <PaymentModal lang={lang} amount={bookedOrder.amount} orderId={bookedOrder.id} onClose={() => setBookedOrder(null)} onSuccess={() => { alert(txt.paySuccessMsg); setBookedOrder(null); if(onBookSuccess) onBookSuccess(); }}/>
            </div>
         </div>
       )}

       <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 space-y-6 relative z-30" ref={dropdownRef}>
          <div className="flex flex-wrap items-center gap-3 relative z-50">
             
             {/* نوع سفر */}
             <div className="relative">
                <TopFilterBtn label={txt[formData.tripType]} icon={ArrowRightLeft} active={activeDropdown === 'type'} onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')} />
                {activeDropdown === 'type' && (
                  <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 z-50 ${isLtr ? 'left-0' : 'right-0'}`}>
                    {['round_trip', 'one_way'].map(k => (
                      <button key={k} onClick={() => {setFormData({...formData, tripType: k}); setActiveDropdown(null)}} className={`w-full px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between ${isLtr ? 'text-left' : 'text-right'}`}>
                        {txt[k]} {formData.tripType === k && <Check size={16} className="text-[#1e3a8a]"/>}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             {/* مسافران */}
             <div className="relative">
                  <TopFilterBtn label={`${formData.adults + formData.children} ${txt.passenger}`} icon={Users} active={activeDropdown === 'pax'} onClick={() => setActiveDropdown(activeDropdown === 'pax' ? null : 'pax')} />
                  {activeDropdown === 'pax' && (
                    <div className={`absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl p-4 animate-in zoom-in-95 cursor-default z-50 ${isLtr ? 'left-0' : 'right-0'}`}>
                       {['adults', 'children'].map(k => (
                         <div key={k} className="flex justify-between items-center mb-4 last:mb-0">
                           <span className="font-bold text-gray-700">{txt[k]}</span>
                           <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                               <button onClick={() => setFormData(p => ({...p, [k]: Math.max(0, p[k]-1)}))} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-gray-600 hover:text-red-500"><Minus size={14}/></button>
                             <span className="w-4 text-center font-bold text-sm">{formData[k]}</span>
                             <button onClick={() => setFormData(p => ({...p, [k]: p[k]+1}))} className="w-8 h-8 flex items-center justify-center bg-[#058B8C] text-white rounded shadow"><Plus size={14}/></button>
                           </div>
                         </div>
                       ))}
                       <button onClick={() => setActiveDropdown(null)} className="w-full mt-2 py-2 text-[#058B8C] font-black text-sm hover:bg-blue-50 rounded-lg">{txt.confirm}</button>
                    </div>
                  )}
             </div>

             {/* کلاس پروازی */}
             <div className="relative">
                  <TopFilterBtn label={txt[formData.flightClass]} icon={Plane} active={activeDropdown === 'class'} onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')} />
                  {activeDropdown === 'class' && (
                    <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 overflow-hidden animate-in zoom-in-95 z-50 ${isLtr ? 'left-0' : 'right-0'}`}>
                      {['economy', 'business', 'first'].map(k => (
                          <button key={k} onClick={() => {setFormData({...formData, flightClass: k}); setActiveDropdown(null)}} className={`w-full px-4 py-3 hover:bg-gray-50 text-sm font-bold text-gray-700 flex justify-between ${isLtr ? 'text-left' : 'text-right'}`}>{txt[k]}</button>
                      ))}
                    </div>
                  )}
             </div>
          </div>

          <div className={`bg-white rounded-[1.5rem] p-2 flex flex-col lg:flex-row items-stretch shadow-lg relative z-30 min-h-[80px] ${isLtr ? 'divide-y lg:divide-y-0 lg:divide-x divide-gray-100' : 'divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gray-100'}`}>
             
             <div className="flex-1 h-20 lg:h-auto">
                <AirportSearch lang={lang} icon={Plane} value={formData.origin} onChange={(val)=>setFormData({...formData, origin: val})} placeholder={txt.originLabel} />
             </div>
             
             <div className="relative h-0 lg:h-auto lg:w-0 z-40 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <button 
                        type="button" 
                        onClick={() => setFormData(p => ({...p, origin: p.destination, destination: p.origin}))} 
                        className="bg-white p-2.5 rounded-full text-gray-500 hover:bg-[#058B8C] hover:text-white transition shadow-md border border-gray-100 flex items-center justify-center"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                </div>
             </div>

             <div className="flex-1 h-20 lg:h-auto">
                 <AirportSearch lang={lang} icon={MapPin} value={formData.destination} onChange={(val)=>setFormData({...formData, destination: val})} placeholder={txt.destLabel} />
             </div>

             <div className={`flex-1 relative h-20 lg:h-auto ${isLtr ? 'border-l border-gray-100' : 'border-r border-gray-100'}`}>
                <div onClick={()=>setActiveDropdown(activeDropdown==='date'?null:'date')} className="flex items-center gap-3 px-4 py-3 cursor-pointer h-full hover:bg-gray-50 rounded-xl transition">
                   <Calendar size={20} className="text-gray-400"/>
                   <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold">{lt.select_date}</span>
                        <span className={`text-sm font-black ${formData.date?'text-gray-800':'text-gray-300'}`}>{formData.date || '---'}</span>
                   </div>
                </div>
                {activeDropdown==='date' && <SmartCalendar lang={lang} selectedDate={formData.date} onSelect={(d)=>{setFormData({...formData, date:d});setActiveDropdown(null)}} onClose={()=>setActiveDropdown(null)} />}
             </div>

             <div className={`flex-1 relative h-20 lg:h-auto ${isLtr ? 'border-l border-gray-100' : 'border-r border-gray-100'}`}>
                <div onClick={()=>formData.tripType==='round_trip' && setActiveDropdown(activeDropdown==='date_ret'?null:'date_ret')} className={`flex items-center gap-3 px-4 py-3 cursor-pointer h-full ${formData.tripType==='round_trip'?'hover:bg-gray-50 rounded-xl transition':'opacity-50 cursor-not-allowed bg-gray-50 rounded-xl'}`}>
                   <Calendar size={20} className="text-gray-400"/>
                   <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold">{lt.return_date}</span>
                        <span className={`text-sm font-black ${formData.returnDate?'text-gray-800':'text-gray-300'}`}>{formData.returnDate || (formData.tripType === 'round_trip' ? '---' : txt.one_way)}</span>
                   </div>
                </div>
                {activeDropdown==='date_ret' && <SmartCalendar lang={lang} selectedDate={formData.returnDate} onSelect={(d)=>{setFormData({...formData, returnDate:d});setActiveDropdown(null)}} onClose={()=>setActiveDropdown(null)} />}
             </div>

             <div className="p-2 lg:w-auto w-full h-20 lg:h-auto">
                <button onClick={handleSearch} disabled={searchState==='loading'} className="w-full lg:w-auto h-full min-w-[140px] bg-[#f97316] text-white rounded-xl font-bold px-8 py-3 flex items-center justify-center gap-2 transition disabled:opacity-70 shadow-lg shadow-orange-200 active:scale-95 transform">
                   {searchState==='loading' ? <Loader2 className="animate-spin"/> : <><Search size={20}/> {lt.search}</>}
                </button>
             </div>
          </div>
       </div>

       {searchState === 'results' && (
          <div className="space-y-4">
             {results.map(flight => (
                <div key={flight.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-[#1e3a8a] transition-all flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg">
                   <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg p-2">
                          <img src={`https://pics.avs.io/200/200/${flight.logo}.png`} alt={flight.airline} className="max-w-full max-h-full object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png'}/>
                      </div>
                      <div>
                         <div className="font-black text-xl" dir="ltr">{flight.dep} - {flight.arr}</div>
                         <div className="text-xs text-gray-500 font-bold">{flight.airline} | {flight.flightNo}</div>
                         <div className="text-[10px] text-gray-400 mt-1">{flight.duration}</div>
                      </div>
                   </div>
                   <div className="font-black text-2xl text-[#1e3a8a]">${flight.price}</div>
                   <button onClick={()=>openInfoModal(flight)} className="px-6 py-2 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-full font-bold hover:bg-[#1e3a8a] hover:text-white transition">
                     {txt.confirm}
                   </button>
                </div>
             ))}
          </div>
       )}
       {searchState === 'empty' && <div className="text-center text-gray-400 py-10">{txt.noResult}</div>}
       {searchState === 'loading' && <div className="text-center text-gray-500 py-20 flex flex-col items-center gap-4"><Loader2 size={40} className="animate-spin text-[#058B8C]"/><span>{txt.searching}</span></div>}

       <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-6 -left-6 opacity-5 rotate-12">
             <AlertTriangle size={150} className="text-[#f97316]"/>
          </div>

          <div className="relative z-10">
             <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3 border-b border-orange-200 pb-4">
                <div className="bg-orange-100 p-2 rounded-lg text-[#f97316]">
                    <AlertTriangle size={24}/>
                </div>
                <div>
                   <div className="text-base">{lang === 'en' ? "Important Pre-Flight Notes" : "تذکرات مهم قبل از پرواز"}</div>
                   <div className="text-xs text-gray-500 font-normal mt-1">{lang === 'en' ? "Essential information for your journey" : "د الوتنې دمخه مهم یادداشتونه"}</div>
                </div>
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lang === 'en' ? (
                   <>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                           <p className="text-sm text-gray-600 leading-relaxed text-left">
                              <span className="font-bold text-gray-800 block mb-1">Passport Validity:</span>
                              Ensure your passport is valid for at least <span className="text-red-500 font-bold">6 months</span>.
                           </p>
                        </div>
                        <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                           <p className="text-sm text-gray-600 leading-relaxed text-left">
                               <span className="font-bold text-gray-800 block mb-1">Visa & Documents:</span>
                               The passenger is responsible for verifying visa validity and travel documents.
                           </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                           <p className="text-sm text-gray-600 leading-relaxed text-left">
                               <span className="font-bold text-gray-800 block mb-1">Check-in Time:</span>
                               Please arrive at the airport 3 hours before international flights and 2 hours before domestic flights.
                           </p>
                        </div>
                    </div>
                   </>
                ) : (
                   <>
                    <div className="space-y-4">
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                             <span className="font-bold text-gray-800 block mb-1">اعتبار پاسپورت:</span>
                             اطمینان حاصل کنید که پاسپورت شما حداقل <span className="text-red-500 font-bold">۶ ماه</span> اعتبار دارد.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">ویزا و مدارک:</span>
                              مسئولیت کنترل ویزا و صحت مدارک به عهده مسافر می‌باشد.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#058B8C] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">زمان حضور:</span>
                             برای پروازهای خارجی ۳ ساعت و داخلی ۲ ساعت قبل از پرواز در فرودگاه حاضر باشید.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-4 text-right" dir="rtl">
                       <div className="flex gap-3 items-start">
                           <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">د پاسپورټ اعتبار:</span>
                             ډاډ ترلاسه کړئ چې ستاسو پاسپورټ لږترلږه <span className="text-red-500 font-bold">۶ میاشتې</span> اعتبار لري.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">ویزه او اسناد:</span>
                             د ویزې او اسنادو د سموالي مسؤلیت د مسافر په غاړه دی.
                          </p>
                       </div>
                       <div className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#f97316] shrink-0"></div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                              <span className="font-bold text-gray-800 block mb-1">د شتون وخت:</span>
                             د بهرنیو الوتنو لپاره ۳ ساعته او د کورنیو لپاره ۲ ساعته مخکې په هوایی ډګر کې حاضر اوسئ.
                          </p>
                       </div>
                    </div>
                   </>
                )}
             </div>
          </div>
       </div>

    </div>
  );
}