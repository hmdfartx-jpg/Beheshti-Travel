// src/components/SEO.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PRIMARY_DOMAIN = 'https://www.beheshtigroup.com';

export default function SEO({ title, description, keywords, image, lang = 'dr' }) {
    const location = useLocation();

    const defaultTitle = lang === 'en'
        ? 'Beheshti Travel Agency & Beheshti Group | شرکت سیاحتی بهشتی'
        : (lang === 'ps'
            ? 'بهشتي سیاحتي شرکت او بهشتي ګروپ | شرکت سیاحتی بهشتی'
            : 'شرکت سیاحتی بهشتی | بهشتی گروپ و آژانس مسافرتی بهشتی تراول');

    const defaultDesc = lang === 'en'
        ? 'Official website of Beheshti Travel Agency (Beheshti Group - شرکت سیاحتی بهشتی): Online flight ticket booking, visa services, scholarships, and cargo services in Kabul, Afghanistan.'
        : (lang === 'ps'
            ? 'د بهشتي سیاحتي شرکت (بهشتي ګروپ / بهشتي ټراول) رسمي ویب پاڼه: د الوتکې ټکټونو آنلاین بکینګ، د ویزې خدمات، تحصیلي بورسونه او کارګو خدمات.'
            : 'وب‌سایت رسمی شرکت سیاحتی بهشتی (بهشتی گروپ / بهشتی تراول)؛ رزرو آنلاین تکت طیاره، اخذ ویزا، بورسیه تحصیلی و خدمات کارگو در کابل و سراسر افغانستان.');

    const defaultKeywords = 'شرکت سیاحتی بهشتی, شرکت سیاحتی و توریستی بهشتی, بهشتی تراول, بهشتی گروپ, آژانس مسافرتی بهشتی, تکت طیاره کابل, ویزای ایران, ویزای پاکستان, ویزای ترکیه, بورسیه تحصیلی, کارگو افغانستان, Beheshti Travel, Beheshti Group';

    const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    const finalDesc = description || defaultDesc;
    const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

    // آدرس استاندارد و یکتا بر اساس دامنه اصلی beheshtigroup.com
    const canonicalUrl = `${PRIMARY_DOMAIN}${location.pathname === '/' ? '' : location.pathname}`;

    useEffect(() => {
        // ۱. تغییر عنوان تب مرورگر
        document.title = finalTitle;

        // ۲. تنظیم زبان و جهت صفحه
        document.documentElement.lang = lang === 'dr' ? 'fa-AF' : (lang === 'ps' ? 'ps-AF' : 'en');
        document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

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
        setMetaTag('name', 'keywords', finalKeywords);

        // تگ‌های Open Graph
        setMetaTag('property', 'og:title', finalTitle);
        setMetaTag('property', 'og:description', finalDesc);
        setMetaTag('property', 'og:url', canonicalUrl);
        setMetaTag('property', 'og:site_name', 'شرکت سیاحتی بهشتی | Beheshti Travel & Group');
        setMetaTag('property', 'og:type', 'website');
        if (image) setMetaTag('property', 'og:image', image);

        // تگ Canonical برای معرفی دامنه اصلی به گوگل
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', canonicalUrl);

    }, [finalTitle, finalDesc, finalKeywords, image, lang, canonicalUrl]);

    return null;
}