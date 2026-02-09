import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, CheckCircle, Copy, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const translations = {
  dr: {
    selectMethod: 'انتخاب روش پرداخت',
    payAmount: 'مبلغ قابل پرداخت',
    afn: 'افغانی',
    back: 'بازگشت به لیست',
    hesabPayTitle: 'حساب‌پی (آنلاین)',
    bankTitle: 'واریز به حساب بانکی',
    sarafiTitle: 'حواله صرافی',
    mpaisaTitle: 'ام‌پیسه (روشن)',
    mhawalaTitle: 'ام‌حواله (اتصالات)',
    momoTitle: 'مومو (ام‌تی‌ان)',
    pulemaTitle: 'پول‌ما (افغان بیسیم)',
    manualDesc: 'لطفا مبلغ را واریز کرده و کد پیگیری را در زیر وارد کنید:',
    trxLabel: 'شماره تراکنش / کد پیگیری',
    trxPlaceholder: 'مثلا: 192830...',
    btnSubmit: 'ثبت پرداخت',
    btnLoading: 'در حال ثبت...',
    hesabPayDesc: 'شما به درگاه امن حساب‌پی هدایت خواهید شد.',
    btnHesabPay: 'ورود به درگاه پرداخت',
    copy: 'کپی',
    errorTrx: 'لطفا شماره تراکنش را وارد کنید.',
    successMsg: 'پرداخت شما ثبت شد! پس از تایید حسابداری، بلیط صادر می‌شود.',
    errorLink: 'خطا در دریافت لینک پرداخت',
    sarafiDetails: 'صرافی سرای شهزاده',
    sarafiNote: 'لطفا تصویر رسید حواله را نگه دارید.'
  },
  ps: {
    selectMethod: 'د تادیې طریقه غوره کړئ',
    payAmount: 'د تادیې وړ مقدار',
    afn: 'افغانۍ',
    back: 'لیست ته راستنیدل',
    hesabPayTitle: 'حساب‌پی (آنلاین)',
    bankTitle: 'بانکي حساب ته جمع کول',
    sarafiTitle: 'د صرافۍ حواله',
    mpaisaTitle: 'ام‌پیسه (روشن)',
    mhawalaTitle: 'ام‌حواله (اتصالات)',
    momoTitle: 'مومو (ام‌تی‌ان)',
    pulemaTitle: 'پول‌ما (افغان بیسیم)',
    manualDesc: 'مهرباني وکړئ پیسې واستوئ او د تعقیب کوډ لاندې دننه کړئ:',
    trxLabel: 'د راکړې ورکړې شمېره / تعقیب کوډ',
    trxPlaceholder: 'مثلا: 192830...',
    btnSubmit: 'تادیه ثبت کړئ',
    btnLoading: 'د ثبت په حال کې...',
    hesabPayDesc: 'تاسو به د حساب‌پی امن درگاه ته ولېږدول شئ.',
    btnHesabPay: 'د تادیې درگاه ته ننوتل',
    copy: 'کاپی',
    errorTrx: 'مهرباني وکړئ د راکړې ورکړې شمېره دننه کړئ.',
    successMsg: 'ستاسو تادیه ثبت شوه! د تایید وروسته به ټکټ صادر شي.',
    errorLink: 'د تادیې لینک ترلاسه کولو کې ستونزه',
    sarafiDetails: 'د شهزاده سرای صرافي',
    sarafiNote: 'مهرباني وکړئ د حوالې رسید وساتئ.'
  }
};

const PAYMENT_METHODS = [
  { id: 'hesabpay', key: 'hesabPayTitle', icon: <CreditCard className="text-blue-500"/>, type: 'online' },
  { id: 'bank', key: 'bankTitle', icon: <Banknote className="text-green-600"/>, type: 'manual', 
    details: { bankName: 'Azizi Bank', accountName: 'Beheshti Travel', accountNumber: '123-456-789', card: '6037-9918-....' } },
  { id: 'sarafi', key: 'sarafiTitle', icon: <Banknote className="text-gray-600"/>, type: 'manual',
    details: { isSarafi: true } },
  { id: 'mpaisa', key: 'mpaisaTitle', icon: <Smartphone className="text-red-500"/>, type: 'manual',
    details: { number: '0799 123 456', provider: 'Roshan M-Paisa' } },
  { id: 'mhawala', key: 'mhawalaTitle', icon: <Smartphone className="text-green-500"/>, type: 'manual',
    details: { number: '0788 123 456', provider: 'Etisalat M-Hawala' } },
  { id: 'momo', key: 'momoTitle', icon: <Smartphone className="text-yellow-500"/>, type: 'manual',
    details: { number: '0777 123 456', provider: 'MTN MoMo' } },
  { id: 'pulema', key: 'pulemaTitle', icon: <Smartphone className="text-orange-500"/>, type: 'manual',
    details: { number: '0700 123 456', provider: 'AWCC My Money' } },
];

export default function PaymentModal({ amount, orderId, onClose, onSuccess, lang = 'dr' }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trxId, setTrxId] = useState('');
  const txt = translations[lang] || translations.dr;

  const handleHesabPay = async () => {
    setLoading(true);
    try {
      const currentURL = window.location.origin;
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount, 
          orderId,
          successUrl: `${currentURL}/payment/success`,
          failureUrl: `${currentURL}/payment/failed`
        }
      });

      if (error) throw error;
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(txt.errorLink);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!trxId) return alert(txt.errorTrx);
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
            status: 'pending_verification',
            payment_method: selectedMethod.key, // ذخیره کلید متد
            transaction_id: trxId,
            payment_date: new Date()
        })
        .eq('id', orderId);

      if (error) throw error;

      alert(txt.successMsg);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in font-[Vazirmatn]">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-gray-50 p-4 border-b flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg text-gray-800">
            {selectedMethod ? txt[selectedMethod.key] : txt.selectMethod}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!selectedMethod && (
             <div className="text-center mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <span className="text-xs text-gray-500 font-bold">{txt.payAmount}</span>
                <div className="text-3xl font-black text-blue-600 mt-1">{amount.toLocaleString()} <span className="text-sm">{txt.afn}</span></div>
             </div>
          )}

          {!selectedMethod ? (
            <div className="space-y-2">
              {PAYMENT_METHODS.map(method => (
                <button 
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className="w-full flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-right shadow-sm"
                >
                  <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                    {method.icon}
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-blue-700 flex-1">{txt[method.key]}</span>
                  <ArrowLeft size={16} className="text-gray-300 group-hover:text-blue-500 flip-rtl"/>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-10">
              
              <button onClick={() => setSelectedMethod(null)} className="text-xs text-gray-500 hover:text-black flex items-center gap-1 mb-2">
                 <ArrowLeft size={12} className="rotate-180"/> {txt.back}
              </button>

              {selectedMethod.type === 'manual' ? (
                <>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-dashed border-gray-300 text-center space-y-3">
                      <div className="font-bold text-gray-800 text-lg">
                          {selectedMethod.details.isSarafi ? txt.sarafiDetails : (selectedMethod.details.provider || selectedMethod.details.bankName)}
                      </div>
                      
                      {selectedMethod.details.isSarafi && <p className="text-xs text-gray-500">{txt.sarafiNote}</p>}

                      {selectedMethod.details.number && (
                        <div onClick={() => navigator.clipboard.writeText(selectedMethod.details.number)} className="cursor-pointer active:scale-95 transition">
                          <code className="text-2xl font-mono font-black tracking-wider block bg-white p-2 rounded border">{selectedMethod.details.number}</code>
                          <span className="text-[10px] text-gray-400 mt-1 flex justify-center gap-1"><Copy size={10}/> {txt.copy}</span>
                        </div>
                      )}
                      
                      {selectedMethod.details.accountNumber && (
                        <div className="text-sm bg-white p-2 rounded border font-mono font-bold select-all">{selectedMethod.details.accountNumber}</div>
                      )}
                      
                      <p className="text-xs text-gray-500 leading-relaxed mt-2">
                        {txt.manualDesc.replace('{amount}', amount.toLocaleString())}
                        <br/>
                        <b className="text-black text-sm">{amount.toLocaleString()} {txt.afn}</b>
                      </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">{txt.trxLabel}</label>
                            <input 
                            type="text" 
                            placeholder={txt.trxPlaceholder} 
                            className="w-full p-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition font-mono text-left dir-ltr"
                            value={trxId}
                            onChange={e => setTrxId(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleManualSubmit}
                            disabled={loading || !trxId}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-200"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : <><CheckCircle size={18}/> {txt.btnSubmit}</>}
                        </button>
                    </div>
                </>
              ) : (
                <div className="text-center space-y-4 pt-4">
                    <p className="text-sm text-gray-600">{txt.hesabPayDesc}</p>
                    <button 
                    onClick={handleHesabPay}
                    disabled={loading}
                    className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
                    >
                    {loading ? <Loader2 className="animate-spin"/> : txt.btnHesabPay}
                    </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}