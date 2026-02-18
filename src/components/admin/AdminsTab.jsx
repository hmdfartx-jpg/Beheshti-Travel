import React from 'react';
import { Users } from 'lucide-react';

export default function AdminsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 animate-in fade-in">
      <Users size={64} className="mb-4 opacity-20" />
      <h2 className="text-2xl font-black">مدیریت ادمین‌ها</h2>
      <p>این بخش در به‌روزرسانی‌های بعدی فعال خواهد شد.</p>
    </div>
  );
}