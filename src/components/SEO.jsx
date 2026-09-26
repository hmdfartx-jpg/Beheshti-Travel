// src/components/SEO.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, keywords, image, lang = 'dr' }) {
    const location = useLocation();

    const defaultTitle = lang === 'en'
        ? 'Beheshti Travel Agency'
        : (lang === 'ps' ? 'بهشتي سیاحتي او مسافرتي شرکت' : 'آژانس مسافرتی بهشتی تراول');

    const defaultDesc = lang === 'en'
        ? 'Online flight ticket booking, visa services, scholarships, and cargo services in Afghanistan.'
        : (lang === 'ps'
            ? 'د الوتکې ټکټونو آنلاین بکینګ، د ویزې خدمات، تحصیلي بورسونه او کارګو خدمات.'
            : 'رزرو آنلاین تکت طیاره، اخذ ویزا، بورسیه تحصیلی و خدمات کارگو در افغانستان با بهشتی تراول.');

    const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    const finalDesc = description || defaultDesc;
    const currentUrl = window.location.origin + location.pathname;

    useEffect(() => {
        // ۱. تغییر عنوان تب مرورگر
        document.title = finalTitle;

        // ۲. تنظیم زبان و جهت صفحه برای موتورهای جستجو
        document.documentElement.lang = lang === 'dr' ? 'fa-AF' : (lang === 'ps' ? 'ps-AF' : 'en');
        document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

        // تابع کمکی برای ساخت یا آپدیت متاتگ‌ها
        const setMetaTag = (attrName, attrValue, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attrName, attrValue);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        setMetaTag('name', 'description', finalDesc);
        if (keywords) setMetaTag('name', 'keywords', keywords);

        // تگ‌های Open Graph برای پیش‌نمایش لینک در تلگرام، واتساپ و فیسبوک
        setMetaTag('property', 'og:title', finalTitle);
        setMetaTag('property', 'og:description', finalDesc);
        setMetaTag('property', 'og:url', currentUrl);
        setMetaTag('property', 'og:type', 'website');
        if (image) setMetaTag('property', 'og:image', image);

        // لینک Canonical برای جلوگیری از محتوای تکراری در گوگل
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);

    }, [finalTitle, finalDesc, keywords, image, lang, currentUrl]);

    return null;
}