import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CachedDataModalProps {
  onClose: () => void;
  onSimulateSync: () => void;
  isOffline: boolean;
}

export const CachedDataModal: React.FC<CachedDataModalProps> = ({
  onClose,
  onSimulateSync,
  isOffline
}) => {
  const { language, l } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border-t-2 sm:border-2 border-[#feb316] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d8] mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                offline_pin
              </span>
            </div>
            <div>
              <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                {l('स्थानीय रूप से सुरक्षित डेटा (Cached Data)', 'Locally Cached Data')}
              </h3>
              <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                {l('फोन मेमोरी में 100% सुरक्षित (Saved On-Device)', '100% Safe On-Device Storage')}
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

        {/* Big Reassurance Card */}
        <div className="p-3.5 bg-[#feb316]/20 rounded-xl border border-[#feb316] mb-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[#6a4800] font-['Noto_Sans'] font-bold text-xs">
            <span className="material-symbols-outlined text-base">shield</span>
            <span>{l('किसान सुरक्षा गारंटी (Zero Data Loss)', 'Zero Data Loss Guarantee')}</span>
          </div>
          <p className="font-['Noto_Sans'] text-xs text-[#1e1b16] leading-relaxed">
            {l(
              'इंटरनेट न होने पर भी आपका कोई डेटा गायब नहीं होगा। जैसे ही आपका फोन किसी नेटवर्क से जुड़ेगा, यह डेटा बिना किसी कार्रवाई के स्वतः सरकारी सर्वर पर सिंक हो जाएगा।',
              'None of your draft listings or claims will be lost if connection drops. Everything syncs silently with the e-NAM & PMFBY server once online.'
            )}
          </p>
        </div>

        {/* Cached Items Checklist */}
        <div className="space-y-2.5 mb-5 text-xs font-['Noto_Sans']">
          <h4 className="font-bold text-[#1e1b16] text-xs uppercase tracking-wider">
            {l('वर्तमान में फोन में सुरक्षित सामग्री (3 Items in Local Cache):', '3 Items Cached on Device:')}
          </h4>

          {/* Item 1 */}
          <div className="p-3 bg-white rounded-xl border border-[#c0c9bf] flex items-start justify-between gap-2 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-xl text-[#004526] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div>
                <strong className="text-sm text-[#1e1b16] block">{l('गेहूं फसल ड्राफ्ट (Wheat Listing)', 'Wheat Produce Draft')}</strong>
                <p className="text-[#404942] mt-0.5">{l('मात्रा: 50 क्विंटल · ग्रेड A (उत्कृष्ट) · भाव: ₹2,350', 'Qty: 50 Quintals · Grade A (Superior) · Rate: ₹2,350')}</p>
                <span className="text-[10px] text-[#707971] block mt-1">{l('स्थान: बोरगांव बुजुर्ग, खंडवा · ड्राफ्ट मोड', 'Location: Borgaon Buzurg, Khandwa · Draft Mode')}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#aef2c2] text-[#09522f] text-[10px] font-bold rounded-full shrink-0">
              {l('सुरक्षित', 'Cached')}
            </span>
          </div>

          {/* Item 2 */}
          <div className="p-3 bg-white rounded-xl border border-[#c0c9bf] flex items-start justify-between gap-2 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-xl text-[#004526] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div>
                <strong className="text-sm text-[#1e1b16] block">{l('बीमा दावा तस्वीरें व GPS टैग', 'Crop Damage Photos & GPS Coordinates')}</strong>
                <p className="text-[#404942] mt-0.5">{l('2 जियो-टैग्ड तस्वीरें · GPS: 28.384° N, 77.123° E', '2 Geo-tagged photos · GPS: 28.384° N, 77.123° E')}</p>
                <span className="text-[10px] text-[#707971] block mt-1">{l('नुकसान कारण: अतिवृष्टि / बाढ़', 'Cause: Excess Rain & Flood')}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#aef2c2] text-[#09522f] text-[10px] font-bold rounded-full shrink-0">
              {l('सुरक्षित', 'Cached')}
            </span>
          </div>

          {/* Item 3 */}
          <div className="p-3 bg-white rounded-xl border border-[#c0c9bf] flex items-start justify-between gap-2 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-xl text-[#004526] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div>
                <strong className="text-sm text-[#1e1b16] block">{l('मंडी भाव कैश (Offline Mandi Cache)', 'Offline Mandi Rate Cache')}</strong>
                <p className="text-[#404942] mt-0.5">{l('खंडवा, इंदौर व खरगोन मंडी के आज के ताज़ा भाव', 'Khandwa, Indore & Khargone Mandi Rates')}</p>
                <span className="text-[10px] text-[#707971] block mt-1">{l('अंतिम सिंक: आज सुबह 10:30 AM', 'Last synced: Today 10:30 AM')}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#aef2c2] text-[#09522f] text-[10px] font-bold rounded-full shrink-0">
              {l('उपलब्ध', 'Available')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {isOffline ? (
            <button
              onClick={() => {
                onSimulateSync();
                onClose();
              }}
              className="w-full min-h-[52px] bg-[#004526] text-white rounded-xl font-['Noto_Sans'] font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">cloud_sync</span>
              <span>{l('नेटवर्क जोड़ें व सिंक करें (Reconnect & Sync)', 'Reconnect & Sync Now')}</span>
            </button>
          ) : (
            <div className="p-2.5 bg-[#aef2c2]/30 rounded-xl text-center text-xs font-bold text-[#004526]">
              {l('✓ आपका डिवाइस ऑनलाइन है, सभी रिकॉर्ड सर्वर से समन्वयित हैं', '✓ Device online: All cached records synchronized with server')}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs font-['Noto_Sans'] text-[#404942] font-bold hover:text-[#1e1b16] cursor-pointer"
            type="button"
          >
            {l('बंद करें (Close)', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
