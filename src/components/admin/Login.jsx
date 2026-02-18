// src/components/admin/Login.jsx
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // در آینده می‌توانید این بخش را به دیتابیس متصل کنید
    if (username === 'admin' && password === 'beh123456') {
      onLogin(); // اطلاع به کامپوننت والد که لاگین موفق بود
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#058B8C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={40} className="text-[#058B8C]" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">پنل مدیریت</h1>
          <p className="text-gray-400 mt-2 font-bold text-sm">بهشتی تراول اجنسی</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">نام کاربری</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#058B8C] focus:ring-2 focus:ring-[#058B8C]/20 outline-none transition-all font-bold text-gray-700 text-left"
                dir="ltr"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block text-right">رمز عبور</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#058B8C] focus:ring-2 focus:ring-[#058B8C]/20 outline-none transition-all font-bold text-gray-700 text-left"
                dir="ltr"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#058B8C]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#058B8C] hover:bg-[#047070] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#058B8C]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            ورود به پنل <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}