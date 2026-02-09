import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ t }) {
  return (
    <a 
      href="https://wa.me/93700000000" 
      target="_blank" 
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">
        {t.common.whatsapp}
      </span>
      <MessageCircle size={28} />
    </a>
  );
}