import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface WithdrawModalProps {
  availableBalance: number;
  onClose: () => void;
  onSuccess: (amount: number, method: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  availableBalance,
  onClose,
  onSuccess
}) => {
  const { language, l } = useLanguage();
  const [amount, setAmount] = useState<string>(availableBalance.toString());
  const [method, setMethod] = useState<'sbi' | 'upi'>('sbi');
  const [upiId, setUpiId] = useState<string>('gitanjali.devi@oksbi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [txnRef, setTxnRef] = useState<string>('');

  const numAmount = parseFloat(amount) || 0;
  const isValid = numAmount > 0 && numAmount <= availableBalance;

  const handleWithdraw = () => {
    if (!isValid) return;
    setIsProcessing(true);
    const ref = `NPCI-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTxnRef(ref);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess(numAmount, method === 'sbi' ? 'SBI A/C •••• 4892' : `UPI (${upiId})`);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border-t-2 sm:border-2 border-[#004526]/20">
        <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#1b5e3a] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <div>
              <h2 className="font-['Noto_Sans'] font-bold text-lg text-[#1e1b16]">
                {l('खाते में निकालें (Withdraw)', 'Withdraw Funds to Bank')}
              </h2>
              <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                {l('तत्काल सुरक्षित बैंक अंतरण (NPCI / IMPS Instant)', 'Instant Bank Transfer via NPCI / IMPS')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] hover:bg-[#eee7de] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {isDone ? (
          <div className="p-6 text-center space-y-3 bg-[#aef2c2]/30 rounded-2xl border-2 border-[#004526]">
            <div className="w-16 h-16 rounded-full bg-[#004526] text-white flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-3xl font-bold">check</span>
            </div>
            <h3 className="font-['Noto_Sans'] font-bold text-xl text-[#004526]">
              {l('निकासी सफल! (Transfer Successful)', 'Withdrawal Successful!')}
            </h3>
            <p className="font-['Noto_Sans'] text-2xl font-extrabold text-[#1e1b16]">
              ₹{numAmount.toLocaleString('en-IN')}
            </p>
            <p className="font-['Noto_Sans'] text-xs text-[#404942]">
              {method === 'sbi'
                ? l('भारतीय स्टेट बैंक (SBI) खाता •••• 4892 में भेज दिए गए हैं।', 'Transferred to State Bank of India account •••• 4892.')
                : l(`UPI (${upiId}) में भेज दिए गए हैं।`, `Transferred to UPI ID: ${upiId}.`)}
            </p>
            <div className="p-2 bg-white rounded-lg border border-[#c0c9bf] text-[11px] font-mono text-[#404942]">
              {l('रेफरेंस संख्या:', 'Reference No:')} {txnRef}
            </div>
            <p className="text-xs text-[#004526] font-bold">
              {l('बैंक द्वारा SMS भेजा जा रहा है...', 'Bank confirmation SMS initiated...')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Balance info */}
            <div className="p-3 bg-[#faf3e9] rounded-xl border border-[#c0c9bf]/40 flex items-center justify-between">
              <span className="text-xs text-[#404942] font-medium">{l('कुल उपलब्ध बैलेंस:', 'Available Balance:')}</span>
              <span className="font-['Noto_Sans'] text-base font-extrabold text-[#004526]">
                ₹{availableBalance.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold text-[#1e1b16] mb-1.5" htmlFor="withdraw-amt">
                {l('निकासी राशि दर्ज करें (Enter Amount in ₹)', 'Enter Withdrawal Amount (₹)')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#404942]">
                  ₹
                </span>
                <input
                  id="withdraw-amt"
                  type="number"
                  max={availableBalance}
                  min={100}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full h-14 pl-10 pr-20 bg-white border-2 border-[#c0c9bf] focus:border-[#004526] rounded-xl font-['Noto_Sans'] text-2xl font-extrabold text-[#1e1b16] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance.toString())}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1b5e3a]/10 hover:bg-[#1b5e3a]/20 text-[#004526] rounded-lg text-xs font-bold cursor-pointer"
                >
                  {l('पूरा (All)', 'All')}
                </button>
              </div>
            </div>

            {/* Payout method choice */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1e1b16]">
                {l('भुगतान माध्यम चुनें (Select Bank / UPI)', 'Select Payout Channel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('sbi')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    method === 'sbi'
                      ? 'border-2 border-[#004526] bg-[#aef2c2]/20 shadow-xs'
                      : 'border-[#c0c9bf] bg-white'
                  }`}
                >
                  <p className="font-['Noto_Sans'] font-bold text-xs text-[#1e1b16]">
                    SBI Bank •••• 4892
                  </p>
                  <p className="text-[11px] text-[#404942]">{l('डिफ़ॉल्ट DBT खाता', 'Default DBT A/C')}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    method === 'upi'
                      ? 'border-2 border-[#004526] bg-[#aef2c2]/20 shadow-xs'
                      : 'border-[#c0c9bf] bg-white'
                  }`}
                >
                  <p className="font-['Noto_Sans'] font-bold text-xs text-[#1e1b16]">BHIM UPI</p>
                  <p className="text-[11px] text-[#404942]">gitanjali.devi@oksbi</p>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-13 rounded-xl bg-[#f4ede4] text-[#404942] font-['Noto_Sans'] font-bold text-sm hover:bg-[#eee7de] cursor-pointer"
              >
                {l('रद्द करें', 'Cancel')}
              </button>
              <button
                type="button"
                disabled={!isValid || isProcessing}
                onClick={handleWithdraw}
                className={`flex-2 h-13 rounded-xl font-['Noto_Sans'] font-bold text-sm shadow-md active:scale-98 transition-transform flex items-center justify-center gap-2 cursor-pointer ${
                  isValid && !isProcessing
                    ? 'bg-[#004526] text-white hover:bg-[#1b5e3a]'
                    : 'bg-[#c0c9bf] text-white cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">sync</span>
                    <span>{l('अंतरण हो रहा है...', 'Processing Transfer...')}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">send</span>
                    <span>
                      {l('तुरंत निकालें (Confirm Transfer)', 'Confirm Transfer')}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
