import React from 'react';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NotificationDrawerProps {
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenBids: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  onClose,
  onNavigateTab,
  onOpenBids
}) => {
  const { language, l } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-2xl max-w-sm w-full p-4 shadow-2xl border-2 border-[#1b5e3a]/20 mt-16 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d8] mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#004526]">notifications_active</span>
            <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
              {l('सूचनाएं (Notifications)', 'Notifications')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Notification 1: Soybean Bids */}
          <div
            onClick={() => {
              onClose();
              onOpenBids();
            }}
            className="p-3 bg-white border-2 border-[#feb316] rounded-xl cursor-pointer hover:shadow-xs active:scale-98 transition-all"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#feb316]/30 text-[#6a4800] flex items-center justify-center font-bold text-sm shrink-0">
                🏷️
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#6a4800] uppercase tracking-wide">
                  {l('नई बोलियां (3 New Bids)', '3 New Buyer Bids')}
                </span>
                <h4 className="font-['Noto_Sans'] font-bold text-xs text-[#1e1b16] mt-0.5">
                  {l('सोयाबीन पर ₹4,850 की उच्चतम बोली प्राप्त', 'Highest bid of ₹4,850 received for Soybean')}
                </h4>
                <p className="text-[11px] text-[#404942] mt-0.5">
                  {l('खंडवा कृषि ट्रेडर्स ने 40 क्विंटल के लिए नई बोली लगाई है।', 'Khandwa Agri Traders placed a new bid for 40 quintals.')}
                </p>
                <span className="text-[10px] text-[#707971] block mt-1">{l('15 मिनट पहले', '15 mins ago')}</span>
              </div>
            </div>
          </div>

          {/* Notification 2: Insurance Approval */}
          <div
            onClick={() => {
              onClose();
              onNavigateTab('wallet');
            }}
            className="p-3 bg-white border border-[#c0c9bf] rounded-xl cursor-pointer hover:border-[#004526] active:scale-98 transition-all"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#aef2c2] text-[#004526] flex items-center justify-center font-bold text-sm shrink-0">
                🛡️
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#004526] uppercase tracking-wide">
                  {l('बीमा दावा स्वीकृत', 'Claim Approved (DBT)')}
                </span>
                <h4 className="font-['Noto_Sans'] font-bold text-xs text-[#1e1b16] mt-0.5">
                  {l('₹18,400 सीधे आपके SBI खाते में जमा', '₹18,400 credited directly to your SBI account')}
                </h4>
                <p className="text-[11px] text-[#404942] mt-0.5">
                  {l('दावा संख्या #CLM-9021 का त्वरित निपटान किया गया।', 'Fast-track settlement for claim #CLM-9021 completed.')}
                </p>
                <span className="text-[10px] text-[#707971] block mt-1">{l('4 अक्टूबर · 01:15 PM', '4 Oct · 01:15 PM')}</span>
              </div>
            </div>
          </div>

          {/* Notification 3: Weather Alert */}
          <div
            onClick={() => {
              onClose();
              onNavigateTab('learn');
            }}
            className="p-3 bg-white border border-[#c0c9bf] rounded-xl cursor-pointer hover:border-[#004526] active:scale-98 transition-all"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold text-sm shrink-0">
                🌧️
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wide">
                  {l('मौसम चेतावनी (Weather Alert)', 'Agro-Weather Alert')}
                </span>
                <h4 className="font-['Noto_Sans'] font-bold text-xs text-[#1e1b16] mt-0.5">
                  {l('खंडवा जिले में अतिवृष्टि की संभावना', 'Risk of heavy rain in Khandwa district')}
                </h4>
                <p className="text-[11px] text-[#404942] mt-0.5">
                  {l('कटाई की गई उपज को सुरक्षित स्थान पर रखें।', 'Keep harvested grain bags covered with tarpaulin.')}
                </p>
                <span className="text-[10px] text-[#707971] block mt-1">{l('आज सुबह 08:30 AM', 'Today, 08:30 AM')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
