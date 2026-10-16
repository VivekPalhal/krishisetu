import React from 'react';
import { APP_IMAGES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface ProfileModalProps {
  onClose: () => void;
  onOpenKyc: () => void;
  isKycVerified: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  onOpenKyc,
  isKycVerified
}) => {
  const { language, l } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl border-t-2 sm:border-2 border-[#004526]/20">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d8] mb-4">
          <h2 className="font-['Noto_Sans'] font-bold text-lg text-[#1e1b16]">
            {l('किसान प्रोफाइल (Farmer Profile)', 'Farmer Profile')}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] hover:bg-[#eee7de] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Profile Avatar Card */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#c0c9bf]/60 shadow-xs mb-4">
          <img
            alt="Gitanjali Devi"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-[#004526]/20"
            src={APP_IMAGES.profile}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-['Noto_Sans'] font-bold text-lg text-[#1e1b16]">
                {l('गीतांजलि देवी', 'Gitanjali Devi')}
              </h3>
              <span className="material-symbols-outlined text-sm text-[#004526]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <p className="text-xs text-[#404942]">{l('Gitanjali Devi · महिला कृषक', 'Gitanjali Devi · Certified Woman Farmer')}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#aef2c2]/60 text-[#09522f] text-xs font-bold">
              {l('✓ प्रमाणित किसान (Verified Farmer)', '✓ Verified Farmer')}
            </span>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#e8e2d8] text-xs mb-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f4ede4]">
            <span className="text-[#404942]">{l('गांव व जिला:', 'Village & District:')}</span>
            <span className="font-bold text-[#1e1b16]">{l('बोरगांव बुजुर्ग, खंडवा (म.प्र.)', 'Borgaon Buzurg, Khandwa (M.P.)')}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#f4ede4]">
            <span className="text-[#404942]">{l('खसरा / भूमि क्षेत्र:', 'Land Holding / Plot:')}</span>
            <span className="font-bold text-[#1e1b16]">KH-409/22 (4.5 {l('एकड़', 'Acres')})</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#f4ede4]">
            <span className="text-[#404942]">{l('प्राथमिक बैंक खाता:', 'Primary Bank:')}</span>
            <span className="font-bold text-[#1e1b16]">{l('SBI ·••• 4892 (DBT चालू)', 'SBI •••• 4892 (DBT Active)')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#404942]">{l('PM-किसान स्थिति:', 'PM-Kisan Status:')}</span>
            <span className="font-bold text-[#004526]">{l('सक्रिय (E-KYC पूर्ण)', 'Active (e-KYC Complete)')}</span>
          </div>
        </div>

        {/* Action button */}
        {!isKycVerified ? (
          <button
            onClick={() => {
              onClose();
              onOpenKyc();
            }}
            className="w-full min-h-[52px] bg-[#feb316] text-[#6a4800] rounded-xl font-['Noto_Sans'] font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform mb-2 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl font-bold">add_card</span>
            <span>{l('बैंक खाता व E-KYC पूरा करें', 'Complete Bank & e-KYC Linkage')}</span>
          </button>
        ) : (
          <div className="p-3 bg-[#aef2c2]/30 rounded-xl border border-[#004526]/30 text-center text-xs font-bold text-[#004526] mb-2">
            {l('✓ आपके सभी दस्तावेज व खाता NPCI से जुड़े हैं', '✓ All credentials linked to NPCI DBT Gateway')}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 text-center text-xs font-bold text-[#404942] hover:text-[#1e1b16] cursor-pointer"
          type="button"
        >
          {l('वापस जाएं (Back)', 'Close Profile')}
        </button>
      </div>
    </div>
  );
};
