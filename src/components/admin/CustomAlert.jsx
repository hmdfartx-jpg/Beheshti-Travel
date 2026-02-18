import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, Trash2, Copy, AlertOctagon } from 'lucide-react';

export default function CustomAlert({ open, config, onClose }) {
  if (!open) return null;

  const { title, message, type, onConfirm, showCancel, confirmText, cancelText } = config;

  // تنظیمات استایل بر اساس نوع پیام
  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle size={32} className="text-white" />,
          bgIcon: 'bg-green-500',
          titleColor: 'text-green-700',
          btnColor: 'bg-green-600 hover:bg-green-700',
          ringColor: 'ring-green-100'
        };
      case 'danger': // برای حذف
        return {
          icon: <Trash2 size={32} className="text-white" />,
          bgIcon: 'bg-red-500',
          titleColor: 'text-red-700',
          btnColor: 'bg-red-600 hover:bg-red-700',
          ringColor: 'ring-red-100'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={32} className="text-white" />,
          bgIcon: 'bg-orange-500',
          titleColor: 'text-orange-700',
          btnColor: 'bg-orange-600 hover:bg-orange-700',
          ringColor: 'ring-orange-100'
        };
      case 'copy':
        return {
          icon: <Copy size={32} className="text-white" />,
          bgIcon: 'bg-blue-500',
          titleColor: 'text-blue-700',
          btnColor: 'bg-blue-600 hover:bg-blue-700',
          ringColor: 'ring-blue-100'
        };
      default: // info
        return {
          icon: <Info size={32} className="text-white" />,
          bgIcon: 'bg-[#058B8C]',
          titleColor: 'text-[#058B8C]',
          btnColor: 'bg-[#058B8C] hover:bg-[#047070]',
          ringColor: 'ring-teal-100'
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* پس‌زمینه بلر شده */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* باکس اصلی آلرت */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative transform transition-all animate-[popup-scale_0.3s_ease-out]">
        
        {/* دکمه بستن بالا */}
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-6 text-center">
          {/* آیکون متحرک */}
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gray-200 ${style.bgIcon} animate-[icon-bounce_0.5s_ease-out]`}>
            {style.icon}
          </div>

          <h3 className={`text-xl font-black mb-2 ${style.titleColor}`}>
            {title}
          </h3>
          
          <p className="text-gray-500 text-sm font-bold leading-relaxed mb-6">
            {message}
          </p>

          {/* دکمه‌ها */}
          <div className="flex gap-3 justify-center">
            {showCancel && (
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-200 transition active:scale-95"
              >
                {cancelText || 'انصراف'}
              </button>
            )}
            
            <button 
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-gray-200 transition transform active:scale-95 ${style.btnColor}`}
            >
              {confirmText || 'تایید'}
            </button>
          </div>
        </div>
        
        {/* نوار پایین رنگی */}
        <div className={`h-1.5 w-full ${style.bgIcon} opacity-20`}></div>
      </div>

      <style>{`
        @keyframes popup-scale {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes icon-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}