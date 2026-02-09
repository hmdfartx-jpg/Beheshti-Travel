import React from 'react';

export default function ServiceCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-black mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}