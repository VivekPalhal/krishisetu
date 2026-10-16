import React, { useState } from 'react';
import { TabType, UserListing } from '../types';
import { APP_IMAGES, USER_LISTINGS } from '../data/mockData';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface HomeScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenKyc: () => void;
  onOpenBids: (listing: UserListing) => void;
  onOpenVoice: () => void;
  isKycVerified: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenKyc,
  onOpenBids,
  onOpenVoice,
  isKycVerified
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeListing = USER_LISTINGS[0];
  const { language, l } = useLanguage();

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const text =
        language === 'en'
          ? 'Welcome Anjali Devi. Today wheat is 2,350 rupees, tomato is 38 rupees, and mustard is 5,420 rupees. You have received three new buyer bids for your soybean.'
          : 'नमस्ते अंजली जी। गेहूं का भाव दो हज़ार तीन सौ पचास रुपये, टमाटर अड़तीस रुपये और सरसों चौवन सौ बीस रुपये है। आपके सोयाबीन के लिए तीन नई बोलियां आई हैं।';
      const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
      speakText(text, voiceLang, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-7xl mx-auto gap-6">
      {/* 2-Column Responsive Layout on Desktop */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
        {/* Left / Main Workspace Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Greeting Card with Audio & Connectivity Status */}
          <section
            aria-label="Farmer Welcome and Audio Aid"
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-3.5 border border-[#e8e2d8]"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#aef2c2]/30 rounded-full text-[#09522f]">
                <span
                  className="material-symbols-outlined text-sm font-bold"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-['Noto_Sans'] text-xs font-bold tracking-wide">
                  {l('✓ प्रमाणित किसान (Verified)', '✓ Verified Farmer (Aadhaar & Land Linked)')}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eee7de] rounded-full text-[#404942]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004526] animate-pulse" />
                <span className="font-['Noto_Sans'] text-xs font-bold">
                  {l('फोन में सुरक्षित · ऑनलाइन', 'Saved on phone · Online')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex flex-col">
                <h1 className="font-['Noto_Sans'] font-extrabold text-2xl sm:text-3xl text-[#004526] leading-tight">
                  {l('नमस्ते, अंजली जी', 'Welcome, Anjali Devi')}
                </h1>
                <p className="font-['Noto_Sans'] text-[#404942] text-sm sm:text-base font-medium mt-0.5">
                  {l('Hello, Anjali Devi · खंडवा मंडी (Khandwa)', 'Hello, Anjali Devi · Khandwa Mandi Hub')}
                </p>
              </div>

              {/* Large tactile audio trigger */}
              <button
                onClick={handleToggleAudio}
                aria-label={l('स्क्रीन की जानकारी सुनें', 'Listen to Dashboard Overview')}
                className="h-14 min-w-[130px] px-4 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl font-bold">
                  {isSpeaking ? 'pause_circle' : 'volume_up'}
                </span>
                <span className="font-['Noto_Sans'] text-sm font-bold leading-none text-left">
                  {isSpeaking ? l('रोकें', 'Pause') : l('सुनें', 'Listen')}
                  <br />
                  <span className="text-xs font-normal">
                    {isSpeaking ? l('Pause', 'रोकें') : l('Listen', 'सुनें')}
                  </span>
                </span>
              </button>
            </div>

            {/* Audio Feedback Indicator Bar */}
            {isSpeaking && (
              <div className="flex items-center justify-between p-3.5 bg-[#ffdead]/60 rounded-xl text-[#281900] animate-in fade-in duration-200 border border-[#feb316]/50">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-xl animate-bounce text-[#004526]">
                    graphic_eq
                  </span>
                  <span className="font-['Noto_Sans'] text-xs sm:text-sm font-bold">
                    {l(
                      'डैशबोर्ड को हिंदी में पढ़ा जा रहा है...',
                      'Reading out dashboard in English...'
                    )}
                  </span>
                </div>
                <button
                  className="font-['Noto_Sans'] text-xs font-bold underline px-2 py-1 text-[#004526] hover:opacity-80"
                  onClick={handleToggleAudio}
                  type="button"
                >
                  {l('रोकें (Stop)', 'Stop')}
                </button>
              </div>
            )}
          </section>

          {/* KYC Checklist / Payout Alert */}
          {!isKycVerified ? (
            <section
              aria-label="Bank and KYC Verification Alert"
              className="bg-[#feb316]/20 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#feb316]/40"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl font-bold">account_balance</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="inline-flex items-center gap-1 text-[#7f5700] font-['Noto_Sans'] text-xs uppercase tracking-wider font-bold">
                    <span className="material-symbols-outlined text-base">info</span>{' '}
                    {l('जरूरी सूचना (ACTION REQUIRED)', 'ACTION REQUIRED')}
                  </div>
                  <h2 className="font-['Noto_Sans'] text-[#1e1b16] text-base sm:text-lg font-bold leading-snug mt-0.5">
                    {l('बैंक खाता और पहचान जोड़ें', 'Link Bank Account & Verify ID')}
                  </h2>
                  <p className="font-['Noto_Sans'] text-[#404942] text-xs sm:text-sm mt-0.5 leading-relaxed">
                    {l(
                      'मंडी बिक्री व बीमा राशि सीधे बैंक खाते में पाने के लिए आधार व बैंक सत्यापित करें।',
                      'Verify ID & Bank Account to receive direct sale payouts into your passbook without delay.'
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenKyc}
                aria-label="अभी जोड़ें - Verify Bank ID Now"
                className="w-full sm:w-auto h-14 min-h-[56px] px-6 bg-[#004526] text-white rounded-xl flex items-center justify-center gap-2 font-['Noto_Sans'] text-base font-bold shadow-md active:scale-98 transition-transform shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">add_card</span>
                <span>{l('अभी जोड़ें (Verify Now)', 'Verify Now (e-KYC)')}</span>
              </button>
            </section>
          ) : (
            <section className="bg-[#aef2c2]/30 rounded-2xl p-4 sm:p-5 border border-[#004526]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-[#004526]">verified</span>
                <div>
                  <p className="font-['Noto_Sans'] text-sm font-bold text-[#004526]">
                    {l('बैंक खाता व E-KYC 100% सक्रिय', 'Bank Account & E-KYC 100% Active')}
                  </p>
                  <p className="text-xs text-[#404942]">
                    State Bank of India •••• 4892 · {l('DBT प्रत्यक्ष लाभ चालू', 'Direct Benefit Transfer Active')}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#004526] text-white text-xs font-bold rounded-full">
                {l('सत्यापित', 'Verified')}
              </span>
            </section>
          )}

          {/* Big Touch Quick Actions (4-Column on Desktop) */}
          <section aria-label="मुख्य कार्य - Quick Actions" className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-['Noto_Sans'] font-bold text-[#1e1b16] text-base sm:text-lg">
                {l('त्वरित सुविधाएं', 'Quick Agricultural Tools')}{' '}
                <span className="text-[#404942] text-sm font-normal">
                  · {l('Quick Tools', 'Quick Tools')}
                </span>
              </h2>
              <span className="font-['Noto_Sans'] text-xs text-[#004526] font-bold">
                {l('स्पर्श करें (Tap)', 'Tap to open')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* 1. Sell Produce (Amber Highlighted) */}
              <button
                onClick={() => onNavigateTab('sell')}
                className="h-32 min-h-[64px] bg-[#feb316] text-[#6a4800] rounded-2xl p-4 flex flex-col justify-between shadow-md active:scale-95 hover:shadow-lg transition-all text-left border border-[#feb316]"
                type="button"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-4xl font-bold">shopping_bag_speed</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Noto_Sans'] text-lg leading-tight font-extrabold text-[#004526]">
                    {l('फसल बेचें', 'Sell Produce')}
                  </span>
                  <span className="font-['Noto_Sans'] text-xs opacity-90 leading-none mt-1 font-bold">
                    {l('Sell Produce', 'फसल बेचें')}
                  </span>
                </div>
              </button>

              {/* 2. Mandi Prices */}
              <button
                onClick={() => onNavigateTab('market')}
                className="h-32 min-h-[64px] bg-white text-[#1e1b16] rounded-2xl p-4 flex flex-col justify-between shadow-xs active:scale-95 hover:border-[#004526] transition-all text-left border border-[#e8e2d8]"
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#eee7de] flex items-center justify-center text-[#004526]">
                    <span className="material-symbols-outlined text-2xl font-bold">query_stats</span>
                  </div>
                  <span className="material-symbols-outlined text-xl text-[#404942]">arrow_forward</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Noto_Sans'] text-lg leading-tight font-extrabold text-[#004526]">
                    {l('मंडी भाव', 'Mandi Rates')}
                  </span>
                  <span className="font-['Noto_Sans'] text-xs text-[#404942] leading-none mt-1">
                    {l('Crop Prices', 'मंडी भाव')}
                  </span>
                </div>
              </button>

              {/* 3. Insurance Claim */}
              <button
                onClick={() => onNavigateTab('insure')}
                className="h-32 min-h-[64px] bg-white text-[#1e1b16] rounded-2xl p-4 flex flex-col justify-between shadow-xs active:scale-95 hover:border-[#004526] transition-all text-left border border-[#e8e2d8]"
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#eee7de] flex items-center justify-center text-[#004526]">
                    <span className="material-symbols-outlined text-2xl font-bold">health_and_safety</span>
                  </div>
                  <span className="material-symbols-outlined text-xl text-[#404942]">arrow_forward</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Noto_Sans'] text-lg leading-tight font-extrabold text-[#004526]">
                    {l('बीमा दावा', 'Crop Claim')}
                  </span>
                  <span className="font-['Noto_Sans'] text-xs text-[#404942] leading-none mt-1">
                    {l('Crop Claim', 'बीमा दावा')}
                  </span>
                </div>
              </button>

              {/* 4. Ask Expert */}
              <button
                onClick={() => onNavigateTab('learn')}
                className="h-32 min-h-[64px] bg-white text-[#1e1b16] rounded-2xl p-4 flex flex-col justify-between shadow-xs active:scale-95 hover:border-[#7f5700] transition-all text-left border border-[#e8e2d8]"
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#eee7de] flex items-center justify-center text-[#7f5700]">
                    <span className="material-symbols-outlined text-2xl font-bold">support_agent</span>
                  </div>
                  <span className="material-symbols-outlined text-xl text-[#404942]">arrow_forward</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Noto_Sans'] text-lg leading-tight font-extrabold text-[#7f5700]">
                    {l('कृषि सलाह', 'Agri Advisory')}
                  </span>
                  <span className="font-['Noto_Sans'] text-xs text-[#404942] leading-none mt-1">
                    {l('Ask Expert', 'कृषि सलाह')}
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Mandi Price Ticker (3-Column on Desktop) */}
          <section
            aria-label="आज के मंडी भाव - Real-time Mandi Rates"
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 border border-[#e8e2d8]"
          >
            <div className="flex items-center justify-between border-b border-[#f4ede4] pb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004526] text-2xl">trending_up</span>
                  <h2 className="font-['Noto_Sans'] font-bold text-[#1e1b16] text-base sm:text-lg">
                    {l('आज के मंडी भाव (Live Mandi Prices)', 'Live Mandi Prices Today')}
                  </h2>
                </div>
                <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                  {l('Live Mandi Prices · खंडवा एवं इंदौर मंडी', 'Live Mandi Prices · Khandwa & Indore')}
                </span>
              </div>
              <span className="px-3 py-1 bg-[#eee7de] rounded-full font-['Noto_Sans'] text-xs font-bold text-[#1e1b16]">
                {l('10:30 AM · ताज़ा', '10:30 AM · Live')}
              </span>
            </div>

            {/* Grid of 3 crops on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Crop 1: Wheat */}
              <div className="flex md:flex-col items-center md:items-start justify-between bg-[#faf3e9] rounded-xl p-3.5 gap-3 border border-[#e8e2d8]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    <img
                      className="w-12 h-12 object-cover rounded-lg"
                      alt="Wheat"
                      src={APP_IMAGES.mandiWheat}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Noto_Sans'] font-bold text-[#1e1b16] text-sm truncate">
                      {l('गेहूं (Wheat)', 'Wheat (गेहूं)')}
                    </span>
                    <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                      {l('लोकवन ग्रेड-ए (Lokwan A)', 'Lokwan Grade-A')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end md:items-start md:mt-2 shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Noto_Sans'] text-2xl text-[#1e1b16] font-extrabold tabular-nums">
                      ₹2,350
                    </span>
                    <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                      / {l('क्विंटल', 'Quintal')}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#aef2c2]/50 text-[#09522f] rounded-full mt-1">
                    <span className="material-symbols-outlined text-sm font-bold">arrow_drop_up</span>
                    <span className="font-['Noto_Sans'] text-[11px] font-extrabold">
                      ▲ ₹45 (+1.9%) {l('आज बढ़ा', 'Up Today')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Crop 2: Tomato */}
              <div className="flex md:flex-col items-center md:items-start justify-between bg-[#faf3e9] rounded-xl p-3.5 gap-3 border border-[#e8e2d8]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    <img
                      className="w-12 h-12 object-cover rounded-lg"
                      alt="Tomato"
                      src={APP_IMAGES.mandiTomato}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Noto_Sans'] font-bold text-[#1e1b16] text-sm truncate">
                      {l('टमाटर (Tomato)', 'Tomato (टमाटर)')}
                    </span>
                    <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                      {l('देसी हाइब्रिड (Hybrid)', 'Desi Hybrid Vine')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end md:items-start md:mt-2 shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Noto_Sans'] text-2xl text-[#1e1b16] font-extrabold tabular-nums">
                      ₹38
                    </span>
                    <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                      / {l('किग्रा', 'kg')}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#aef2c2]/50 text-[#09522f] rounded-full mt-1">
                    <span className="material-symbols-outlined text-sm font-bold">arrow_drop_up</span>
                    <span className="font-['Noto_Sans'] text-[11px] font-extrabold">
                      ▲ ₹4 (+11.8%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Crop 3: Mustard */}
              <div className="flex md:flex-col items-center md:items-start justify-between bg-[#faf3e9] rounded-xl p-3.5 gap-3 border border-[#e8e2d8]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    <img
                      className="w-12 h-12 object-cover rounded-lg"
                      alt="Mustard"
                      src={APP_IMAGES.mandiMustard}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Noto_Sans'] font-bold text-[#1e1b16] text-sm truncate">
                      {l('सरसों (Mustard)', 'Mustard (सरसों)')}
                    </span>
                    <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                      {l('काली सरसों (Black Oilseed)', 'Black Oilseed')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end md:items-start md:mt-2 shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Noto_Sans'] text-2xl text-[#1e1b16] font-extrabold tabular-nums">
                      ₹5,420
                    </span>
                    <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                      / {l('क्विंटल', 'Quintal')}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#eee7de] text-[#404942] rounded-full mt-1">
                    <span className="material-symbols-outlined text-sm">remove</span>
                    <span className="font-['Noto_Sans'] text-[11px] font-bold">
                      {l('स्थिर (Steady)', 'Steady')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Button */}
            <button
              onClick={() => onNavigateTab('market')}
              aria-label="सभी मंडियों के भाव देखें - View All Mandi Rates"
              className="w-full h-14 min-h-[56px] rounded-xl bg-[#f4ede4] text-[#004526] font-['Noto_Sans'] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#eee7de] active:scale-98 transition-transform"
              type="button"
            >
              <span>{l('सभी मंडियों के भाव देखें (View All Rates)', 'View All Regional Mandi Rates')}</span>
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
          </section>
        </div>

        {/* Right / Sticky Sidebar Column on Desktop */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Listings & Orders Card */}
          <section
            aria-label="आपकी सक्रिय फसलें - Your Active Listings"
            className="bg-white rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 border border-[#e8e2d8]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004526] text-2xl">inventory_2</span>
                <h2 className="font-['Noto_Sans'] font-bold text-[#1e1b16] text-base">
                  {l('आपकी फसलें (Your Listings)', 'Your Active Listings')}
                </h2>
              </div>
              <div className="px-2.5 py-1 bg-[#ffdead]/60 rounded-full font-['Noto_Sans'] text-xs font-bold text-[#281900]">
                {l('3 नई बोलियां', '3 New Bids')}
              </div>
            </div>

            <p className="font-['Noto_Sans'] text-xs text-[#404942]">
              {l(
                'वर्तमान में 2 सक्रिय फसलें लिस्टेड हैं · 2 Active listings on mandi exchange',
                '2 active produce lots currently listed on Mandi exchange'
              )}
            </p>

            {/* Specific Listing Tile: Soybean */}
            <div className="bg-[#faf3e9] rounded-xl p-4 flex flex-col gap-3.5 border border-[#e8e2d8]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="inline-flex items-center gap-1 text-[#004526] font-['Noto_Sans'] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#004526]" />{' '}
                    {l('लाइव नीलामी (Active Auction)', 'Active Auction')}
                  </div>
                  <h3 className="font-['Noto_Sans'] font-extrabold text-xl text-[#1e1b16] mt-0.5">
                    {l('सोयाबीन (Soybean)', 'Soybean (सोयाबीन)')}
                  </h3>
                  <span className="font-['Noto_Sans'] text-xs text-[#404942] font-medium">
                    {l('कुल मात्रा: 40 क्विंटल (40 Quintals)', 'Total Quantity: 40 Quintals')}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-['Noto_Sans'] text-xs text-[#404942]">
                    {l('उच्चतम बोली', 'Highest Bid')}
                  </span>
                  <span className="font-['Noto_Sans'] text-2xl text-[#004526] font-extrabold leading-tight tabular-nums">
                    ₹4,850
                  </span>
                  <span className="font-['Noto_Sans'] text-[11px] text-[#404942]">
                    / {l('क्विंटल', 'Quintal')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[#404942] font-['Noto_Sans'] text-xs bg-white/80 p-2.5 rounded-lg border border-[#e8e2d8]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#7f5700]">timer</span>{' '}
                  {l('2 घंटे शेष', '2 hrs remaining')}
                </span>
                <span className="font-bold text-[#004526]">
                  {l('व्यापारी: खंडवा कृषि ट्रेडर्स', 'Trader: Khandwa Agri')}
                </span>
              </div>

              <button
                onClick={() => onOpenBids(activeListing)}
                aria-label="बोलियां देखें - Review 3 Bids"
                className="w-full h-14 min-h-[56px] bg-[#004526] text-white rounded-xl flex items-center justify-center gap-2 font-['Noto_Sans'] text-base font-bold shadow-md active:scale-98 transition-transform"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl font-bold">gavel</span>
                <span>{l('बोलियां देखें (Review 3 Bids)', 'Review 3 Buyer Bids')}</span>
              </button>
            </div>
          </section>

          {/* Quick Wallet Snapshot on Desktop */}
          <section className="bg-[#1b5e3a] text-white rounded-2xl p-5 shadow-xs border border-[#004526] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#aef2c2] uppercase tracking-wide">
                {l('उपलब्ध खाता बैलेंस', 'Available Wallet Balance')}
              </span>
              <button
                onClick={() => onNavigateTab('wallet')}
                className="text-xs text-[#ffdead] underline font-bold"
                type="button"
              >
                {l('पासबुक खोलें', 'Open Passbook')}
              </button>
            </div>
            <div>
              <div className="font-['Noto_Sans'] text-3xl font-extrabold text-white tabular-nums">
                ₹48,250<span className="text-sm font-normal text-[#92d5a8]">.00</span>
              </div>
              <p className="text-xs text-[#aef2c2] mt-0.5">
                {l('सुरक्षित एस्क्रो में: ₹15,600 जमा', 'In Escrow Protection: ₹15,600')}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('wallet')}
              className="w-full h-12 bg-[#feb316] text-[#6a4800] rounded-xl font-['Noto_Sans'] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">payments</span>
              <span>{l('खाते में निकालें (Withdraw)', 'Withdraw to Bank Account')}</span>
            </button>
          </section>

          {/* Elder-Friendly Voice Dictation Floating Assist Bar */}
          <section
            aria-label="वॉयस सहायता - Voice Assistance"
            className="bg-[#eee7de] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs border border-[#c0c9bf]/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">mic</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Noto_Sans'] text-[#1e1b16] text-sm font-bold truncate">
                  {l('बोलकर पूछें या खोजें', 'Ask or Search with Voice')}
                </span>
                <span className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                  {l('माइक दबाकर मंडी भाव पूछें', 'Tap mic and ask Mandi rate')}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenVoice}
              aria-label="आवाज शुरू करें - Start Voice Search"
              className="h-12 px-4 rounded-xl bg-[#004526] text-white font-['Noto_Sans'] text-xs font-bold shrink-0 flex items-center gap-1 active:scale-95 transition-transform"
              type="button"
            >
              <span>{l('बोलें (Speak)', 'Speak Now')}</span>
            </button>
          </section>

          {/* 24/7 Helpline Support Card */}
          <div className="rounded-2xl bg-[#ffdead]/40 p-4 border border-[#feb316]/40 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-2xl text-[#7f5700]">headset_mic</span>
              <h4 className="font-['Noto_Sans'] font-bold text-sm text-[#281900]">
                {l('किसान मित्र सहायता केंद्र', 'Kisan Mitra Farmer Helpline')}
              </h4>
            </div>
            <p className="text-xs text-[#604100]">
              {l(
                'खाता, फसल बिक्री या बीमा संबंधी जानकारी हेतु कॉल करें।',
                'Speak with our agricultural support officer in your preferred language 24/7.'
              )}
            </p>
            <a
              href="tel:18001801551"
              className="w-full h-11 bg-[#004526] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>1800-180-1551 ({l('टोल फ्री', 'Toll-Free')})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
