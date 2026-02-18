import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, RefreshCw } from 'lucide-react';

const loginTranslations = {
  dr: {
    title: "ورود به پنل مدیریت",
    subtitle: "امنیت بالا، مدیریت آسان",
    user: "نام کاربری",
    pass: "رمز عبور",
    captcha: "کد امنیتی",
    btn: "ورود به سیستم",
    back: "بازگشت به صفحه اصلی",
    error_captcha: "کد امنیتی اشتباه است!",
    error_auth: "نام کاربری یا رمز عبور اشتباه است",
    ph_user: "نام کاربری",
    ph_pass: "رمز عبور"
  },
  ps: {
    title: "د مدیریت پینل ته ننوتل",
    subtitle: "لوړ امنیت، اسانه مدیریت",
    user: "کارن نوم",
    pass: "پټ نوم",
    captcha: "امنیتي کوډ",
    btn: "سیستم ته ننوتل",
    back: "اصلي پاڼې ته ستنیدل",
    error_captcha: "امنیتي کوډ غلط دی!",
    error_auth: "کارن نوم یا پټ نوم غلط دی",
    ph_user: "کارن نوم",
    ph_pass: "پټ نوم"
  },
  en: {
    title: "Admin Panel Login",
    subtitle: "High Security, Easy Management",
    user: "Username",
    pass: "Password",
    captcha: "Security Code",
    btn: "Login to System",
    back: "Back to Home",
    error_captcha: "Invalid Security Code!",
    error_auth: "Invalid Username or Password",
    ph_user: "Username",
    ph_pass: "Password"
  }
};

export default function Login({ onLogin, lang = 'dr', setPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const currentLang = lang || 'dr';
  const t = loginTranslations[currentLang];
  const dir = currentLang === 'en' ? 'ltr' : 'rtl';
  const alignClass = currentLang === 'en' ? 'text-left' : 'text-right';

  const generateCaptcha = () => {
    const chars = "0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (captchaInput !== generatedCaptcha) {
      alert(t.error_captcha);
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    if (username === 'admin' && password === '123456') {
      // ذخیره سشن برای ۲۴ ساعت
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
      const sessionData = { token: 'valid_admin_token', expiry: expiry };
      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      
      onLogin(); 
    } else {
      alert(t.error_auth);
      generateCaptcha();
      setPassword('');
      setCaptchaInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4 font-[Vazirmatn]" dir={dir}>
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#058B8C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={40} className="text-[#058B8C]" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">{t.title}</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-sm font-bold text-gray-700 block ${alignClass}`}>{t.user}</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-5 py-4 ${currentLang === 'en' ? 'pl-12' : 'pr-12'} rounded-xl bg-gray-50 border border-gray-100 focus:border-[#058B8C] focus:ring-2 focus:ring-[#058B8C]/20 outline-none transition-all font-bold text-gray-700 ${alignClass}`}
                dir="ltr"
                placeholder={t.ph_user}
              />
              <User className={`absolute ${currentLang === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold text-gray-700 block ${alignClass}`}>{t.pass}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-4 ${currentLang === 'en' ? 'pl-12' : 'pr-12'} rounded-xl bg-gray-50 border border-gray-100 focus:border-[#058B8C] focus:ring-2 focus:ring-[#058B8C]/20 outline-none transition-all font-bold text-gray-700 ${alignClass}`}
                dir="ltr"
                placeholder={t.ph_pass}
              />
              <Lock className={`absolute ${currentLang === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${currentLang === 'en' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#058B8C]`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
              <label className={`text-sm font-bold text-gray-700 block ${alignClass}`}>{t.captcha}</label>
              <div className="flex gap-3">
                 <div className="flex-1 relative">
                    <input 
                        type="tel" 
                        maxLength={4} 
                        value={captchaInput} 
                        onChange={e => setCaptchaInput(e.target.value)} 
                        className={`w-full px-5 py-4 ${currentLang === 'en' ? 'pl-12' : 'pr-12'} rounded-xl bg-gray-50 border border-gray-100 focus:border-[#058B8C] outline-none font-bold text-gray-800 tracking-widest text-center`}
                        placeholder="_ _ _ _"
                    />
                    <CheckCircle className={`absolute ${currentLang === 'en' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
                 </div>
                 <div 
                    className="bg-[#f0f9ff] border border-blue-100 rounded-xl px-4 flex items-center justify-center gap-3 min-w-[120px] select-none cursor-pointer hover:bg-blue-50 transition" 
                    onClick={generateCaptcha} 
                    title="Refresh"
                 >
                    <span className="font-mono text-xl font-black text-blue-600 tracking-widest">{generatedCaptcha}</span>
                    <RefreshCw size={16} className="text-blue-400"/>
                 </div>
              </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#058B8C] hover:bg-[#047070] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#058B8C]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {t.btn} <ArrowRight size={20} className={currentLang === 'en' ? "" : "rotate-180"}/>
          </button>

          <button 
            type="button" 
            onClick={() => setPage('home')}
            className="w-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
             {t.back}
          </button>
        </form>
      </div>
    </div>
  );
}