import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

export default function PayButton({ amount, orderId, onPaymentSuccess }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        💳 پرداخت نهایی: {amount.toLocaleString()} افغانی
      </button>

      {/* نمایش مودال فقط وقتی دکمه زده شود */}
      {showModal && (
        <PaymentModal 
          amount={amount} 
          orderId={orderId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
             setShowModal(false);
             if (onPaymentSuccess) onPaymentSuccess();
          }}
        />
      )}
    </>
  );
}