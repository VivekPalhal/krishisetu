import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface KycModalProps {
  onClose: () => void;
  onVerified: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({ onClose, onVerified }) => {
  const { language, l } = useLanguage();
  const [aadhaar, setAadhaar] = useState('5839 2049 8812');
  const [accountNo, setAccountNo] = useState('389401204892');
  const [ifsc, setIfsc] = useState('SBIN0001248');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedDone, setVerifiedDone] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedDone(true);
      setTimeout(() => {
        onVerified();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border-t-2 sm:border-2 border-[#004526]/20">
        <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#004526] text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <h2 className="font-['Noto_Sans'] font-bold text-lg text-[#1e1b16]">
                {l('पहचान व बैंक सत्यापन (KYC)', 'Identity & Bank Verification (e-KYC)')}
              </h2>
              <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                {l('आधार व बैंक खाता लिंकिंग (DBT सक्षम)', 'Aadhaar & Bank Account Linkage (DBT Enabled)')}
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

        {verifiedDone ? (
          <div className="p-6 text-center space-y-3 bg-[#aef2c2]/30 rounded-2xl border-2 border-[#004526]">
            <div className="w-14 h-14 rounded-full bg-[#004526] text-white flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl font-bold">check</span>
            </div>
            <h3 className="font-['Noto_Sans'] font-bold text-lg text-[#004526]">
              {l('खाता व पहचान 100% सत्यापित!', 'Account & Identity 100% Verified!')}
            </h3>
            <p className="font-['Noto_Sans'] text-xs text-[#1e1b16]">
              {l(
                'अब सभी सरकारी योजनाएं, बीमा भुगतान और फसल बिक्री राशि सीधे आपके इस खाते में बिना रुकावट आएगी।',
                'All government schemes, crop insurance payouts, and produce sales will credit directly to this account with zero delays.'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-[#faf3e9] rounded-xl border border-[#c0c9bf]/40 flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-[#004526]">badge</span>
              <div>
                <p className="font-['Noto_Sans'] font-bold text-xs text-[#004526]">
                  {l('NPCI एवं UIDAI प्रत्यक्ष लाभ अंतरण', 'NPCI & UIDAI Direct Benefit Transfer')}
                </p>
                <p className="text-[11px] text-[#404942]">
                  {l('किसान का नाम:', 'Farmer Name:')} <strong>{l('गीतांजलि देवी (Gitanjali Devi)', 'Gitanjali Devi')}</strong>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1b16] mb-1" htmlFor="kyc-aadhaar">
                {l('आधार संख्या (Aadhaar Number)', 'Aadhaar Card Number')}
              </label>
              <input
                id="kyc-aadhaar"
                type="text"
                value={aadhaar}
                onChange={e => setAadhaar(e.target.value)}
                className="w-full h-12 px-3 bg-white border-2 border-[#c0c9bf] focus:border-[#004526] rounded-xl font-mono text-sm font-bold text-[#1e1b16] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1b16] mb-1" htmlFor="kyc-account">
                {l('SBI बैंक खाता संख्या (Account Number)', 'SBI Bank Account Number')}
              </label>
              <input
                id="kyc-account"
                type="text"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value)}
                className="w-full h-12 px-3 bg-white border-2 border-[#c0c9bf] focus:border-[#004526] rounded-xl font-mono text-sm font-bold text-[#1e1b16] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1b16] mb-1" htmlFor="kyc-ifsc">
                {l('IFSC कोड (Branch: खंडवा मुख्य शाखा)', 'IFSC Code (Branch: Khandwa Main Branch)')}
              </label>
              <input
                id="kyc-ifsc"
                type="text"
                value={ifsc}
                onChange={e => setIfsc(e.target.value)}
                className="w-full h-12 px-3 bg-white border-2 border-[#c0c9bf] focus:border-[#004526] rounded-xl font-mono text-sm font-bold text-[#1e1b16] outline-none"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full min-h-[56px] rounded-xl bg-[#004526] text-white font-['Noto_Sans'] font-extrabold text-base flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform cursor-pointer"
              type="button"
            >
              {isVerifying ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                  <span>{l('सत्यापन हो रहा है...', 'Verifying with NPCI & UIDAI...')}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                  <span>{l('सत्यापित करें (Verify Now)', 'Verify Now')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
