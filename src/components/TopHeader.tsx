import React, { useState } from 'react';
import { TabType, Language } from '../types';
import { APP_IMAGES } from '../data/mockData';
import { speakText, stopSpeech } from '../utils/speech';
import { CachedDataModal } from './CachedDataModal';
import { useLanguage } from '../context/LanguageContext';

interface TopHeaderProps {
  currentTab: TabType;
  language?: Language;
  onToggleLanguage?: () => void;
  onSelectLanguage?: (lang: Language) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onNavigate: (tab: TabType) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  pageTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  language,
  onToggleLanguage,
  onSelectLanguage,
  onOpenNotifications,
  onOpenProfile,
  onNavigate,
  isOffline,
  onToggleOffline,
  pageTitle,
  showBack,
  onBack
}) => {
  const langContext = useLanguage();
  const currentLang = language || langContext.language;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCachedModal, setShowCachedModal] = useState(false);
  const [isPlayingOfflineVoice, setIsPlayingOfflineVoice] = useState(false);

  const l = (hi: string, en: string) => (currentLang === 'en' ? en : hi);


  // Tab subtext map
  const getSubtext = () => {
    switch (currentTab) {
      case 'home':
        return l('मुख्य डैशबोर्ड', 'Home Dashboard');
      case 'sell':
        return l('फसल बेचें', 'Sell Produce');
      case 'wallet':
        return l('किसान खाता', 'Wallet & Passbook');
      case 'insure':
        return l('फसल नुकसान दावा', 'Claim Crop Damage');
      case 'market':
        return l('लाइव मंडी भाव', 'Live Mandi Exchange');
      case 'learn':
        return l('कृषि सलाह व मौसम', 'Advisory & Weather');
      default:
        return 'KisanSetu';
    }
  };

  const handleAudioListen = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    let message = '';
    const voiceLang = currentLang === 'en' ? 'en-IN' : 'hi-IN';

    if (currentLang === 'en') {
      if (currentTab === 'home') {
        message =
          'Welcome Anjali Devi. This is KisanSetu home screen. Today wheat rate is 2,350 rupees and tomato is 38 rupees per kg. You have 3 new bids for your soybean.';
      } else if (currentTab === 'sell') {
        message =
          'Step 2 of 4: Produce Details. Here you can choose your crop, total quantity, and quality grade. Suggested fair MSP rate is 2,350 rupees per quintal.';
      } else if (currentTab === 'wallet') {
        message =
          'KisanSetu Wallet Screen. Total available balance is 48,250 rupees. 15,600 rupees are safely held in escrow. Primary bank is State Bank of India.';
      } else if (currentTab === 'insure') {
        message =
          'Crop Damage Claim screen. Kharif 2026 wheat protection policy is active. Assessed crop loss is 42 percent due to excess rain and flood. Estimated relief is 63,000 rupees.';
      } else if (currentTab === 'market') {
        message =
          'Live Mandi Exchange screen. Real-time rates from Khandwa, Indore, and Khargone mandis are available.';
      } else {
        message =
          'Agri Advisory and Weather screen. Today Khandwa weather is clear with mild sunshine.';
      }
    } else {
      if (currentTab === 'home') {
        message =
          'नमस्ते अंजली जी। किसान सेतु होम स्क्रीन पर आपका स्वागत है। आज गेहूं का भाव दो हज़ार तीन सौ पचास रुपये और टमाटर अड़तीस रुपये प्रति किलो है। आपके सोयाबीन के लिए तीन नई बोलियां आई हैं।';
      } else if (currentTab === 'sell') {
        message =
          'कदम दो का चार, फसल की जानकारी। यहां आप फसल का नाम, कुल मात्रा और गुणवत्ता ग्रेड चुन सकते हैं। सरकारी एमएसपी के अनुसार उचित भाव दो हज़ार तीन सौ पचास रुपये सुझाया गया है।';
      } else if (currentTab === 'wallet') {
        message =
          'किसान सेतु खाता स्क्रीन। आपके खाते में कुल उपलब्ध राशि अड़तालीस हज़ार दो सौ पचास रुपये है। सुरक्षित एस्क्रो में पंद्रह हज़ार छह सौ रुपये जमा हैं। आपका प्राथमिक बैंक भारतीय स्टेट बैंक है।';
      } else if (currentTab === 'insure') {
        message =
          'फसल नुकसान का दावा स्क्रीन। खरीफ 2026 गेहूं सुरक्षा पॉलिसी सक्रिय है। अतिवृष्टि और बाढ़ के कारण आकलित फसल क्षति 42 प्रतिशत है। अनुमानित दावा राशि 63 हज़ार रुपये है।';
      } else if (currentTab === 'market') {
        message = 'मंडी बाजार स्क्रीन। खंडवा, इंदौर और खरगोन मंडी के ताज़ा भाव उपलब्ध हैं।';
      } else {
        message = 'कृषि सलाह और मौसम स्क्रीन। आज खंडवा में हल्की धूप और अनुकूल मौसम रहेगा।';
      }
    }

    setIsPlayingAudio(true);
    speakText(message, voiceLang, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleOfflineAudioReassurance = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingOfflineVoice) {
      stopSpeech();
      setIsPlayingOfflineVoice(false);
      return;
    }

    const offlineText =
      language === 'en'
        ? 'Dear farmer, do not worry! Your phone is offline, but all your crop listings, photos, and bids are 100% safely cached on your phone. Everything will sync automatically once network returns.'
        : 'किसान भाई, चिंता न करें! आपका फोन ऑफलाइन है, लेकिन आपकी फसल प्रविष्टियां, फोटो और बोलियां फोन मेमोरी में सौ प्रतिशत सुरक्षित सेव हो गई हैं। जैसे ही नेटवर्क आएगा, यह स्वतः सिंक हो जाएगा।';

    const voiceLang = currentLang === 'en' ? 'en-IN' : 'hi-IN';
    setIsPlayingOfflineVoice(true);
    speakText(offlineText, voiceLang, () => {
      setIsPlayingOfflineVoice(false);
    });
  };

  const handleSelectLang = (target: Language) => {
    if (onSelectLanguage) {
      onSelectLanguage(target);
    }
    if (onToggleLanguage && target !== currentLang) {
      onToggleLanguage();
    }
    langContext.setLanguage(target);
  };


  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[#fff8f1]/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        {/* Dynamic Visual Status & Sync Banner */}
        <div
          className={`py-1.5 transition-colors duration-300 ${
            isOffline
              ? 'bg-[#feb316]/20 border-b-2 border-[#feb316] text-[#6a4800]'
              : 'bg-[#004526]/10 border-b border-[#004526]/10 text-[#004526]'
          }`}
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Dynamic Status Indicator */}
            <div className="flex items-center gap-2 min-w-0">
              {isOffline ? (
                <button
                  onClick={() => setShowCachedModal(true)}
                  type="button"
                  className="flex items-center gap-1.5 text-left active:scale-98 transition-transform group"
                  title={l('क्लिक करके सुरक्षित डेटा देखें', 'Click to view cached data')}
                >
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#feb316] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7f5700]" />
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-['Noto_Sans'] font-extrabold text-xs text-[#6a4800] leading-none flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm font-bold text-[#7f5700]">
                        offline_pin
                      </span>
                      <span>{l('फोन में 100% सुरक्षित · ऑफलाइन', '100% Saved on Phone · Offline')}</span>
                    </span>
                    <span className="bg-[#feb316] text-[#00210f] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-[#7f5700]/30 underline decoration-dotted">
                      {l('3 ड्राफ्ट सुरक्षित (देखें)', '3 Drafts Cached (View)')}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={onToggleOffline}
                  type="button"
                  className="flex items-center gap-1.5 text-left active:opacity-80 transition-opacity"
                  title="Click to toggle offline mode simulation"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004526] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#004526]" />
                  </span>
                  <span className="font-['Noto_Sans'] font-bold text-[#004526] text-xs">
                    {l('फोन में सुरक्षित · ऑनलाइन', 'Saved on phone · Online')}
                  </span>
                  <span className="hidden sm:inline text-[11px] text-[#404942] font-normal">
                    ({l('डेटा सुरक्षित', 'Data Protected')})
                  </span>
                </button>
              )}
            </div>

            {/* Right: Sync Status & Reassurance Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isOffline ? (
                <div className="flex items-center gap-1.5">
                  {/* Voice Reassurance Button */}
                  <button
                    onClick={handleOfflineAudioReassurance}
                    type="button"
                    title={l('सुरक्षा संदेश आवाज में सुनें', 'Listen to Offline Assurance')}
                    className={`h-6 px-1.5 rounded-full flex items-center gap-1 text-[11px] font-bold active:scale-95 transition-transform ${
                      isPlayingOfflineVoice
                        ? 'bg-[#004526] text-white animate-pulse'
                        : 'bg-white/80 text-[#6a4800] border border-[#feb316] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isPlayingOfflineVoice ? 'pause_circle' : 'volume_up'}
                    </span>
                    <span className="hidden xs:inline">
                      {isPlayingOfflineVoice
                        ? l('सुनाया जा रहा है', 'Playing...')
                        : l('आवाज सुनें', 'Listen Voice')}
                    </span>
                  </button>

                  {/* Cloud Off Badge */}
                  <button
                    onClick={onToggleOffline}
                    type="button"
                    title={l('सिमुलेशन: इंटरनेट पुनः कनेक्ट करें', 'Simulate Reconnect')}
                    className="flex items-center gap-1 bg-[#004526] text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-xs">wifi</span>
                    <span>{l('सिंक करें', 'Sync Now')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[#404942] font-['Noto_Sans'] font-bold text-xs">
                    <span className="material-symbols-outlined text-sm text-[#004526]">
                      cloud_done
                    </span>
                    <span>{l('सिंक हुआ (Synced)', 'Synced')}</span>
                  </div>
                  {/* Discrete Offline Test Button */}
                  <button
                    onClick={onToggleOffline}
                    type="button"
                    title={l('ऑफलाइन मोड का परीक्षण करें', 'Test Offline Mode')}
                    className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#c0c9bf] text-[#404942] hover:text-[#004526] hover:border-[#004526] active:scale-95 transition-transform font-bold"
                  >
                    {l('ऑफलाइन टेस्ट', 'Offline Test')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {showBack && (
              <button
                onClick={onBack ? onBack : () => onNavigate('home')}
                aria-label={l('पीछे जाएं', 'Go Back')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#1e1b16] hover:bg-[#eee7de] active:scale-95 transition-transform"
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left active:scale-98 transition-transform"
              type="button"
            >
              <img
                alt="KisanSetu Brand Logo"
                className="h-8 sm:h-9 w-auto object-contain"
                src={APP_IMAGES.logo}
              />
              <div className="flex flex-col">
                <span className="font-['Noto_Sans'] font-extrabold text-lg sm:text-xl lg:text-2xl text-[#004526] leading-tight tracking-tight">
                  {pageTitle || 'KisanSetu'}
                </span>
                <span className="font-['Noto_Sans'] font-medium text-[#404942] text-[11px] sm:text-xs">
                  {showBack ? 'KisanSetu' : getSubtext()}
                </span>
              </div>
            </button>

            {/* Clear, Tactile Dual Segmented Language Switcher - Always Visible */}
            <div
              className="inline-flex items-center p-0.5 bg-[#f4ede4] rounded-full border border-[#c0c9bf]/60 ml-0.5 sm:ml-1 shadow-2xs shrink-0"
              role="group"
              aria-label="Language selection"
            >
              <button
                onClick={() => handleSelectLang('hi')}
                aria-pressed={currentLang === 'hi'}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'hi'
                    ? 'bg-[#004526] text-white shadow-xs'
                    : 'text-[#404942] hover:text-[#1e1b16] hover:bg-[#eae3d9]'
                }`}
                type="button"
                title="हिंदी में बदलें (Switch to Hindi)"
              >
                हिंदी
              </button>
              <button
                onClick={() => handleSelectLang('en')}
                aria-pressed={currentLang === 'en'}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#004526] text-white shadow-xs'
                    : 'text-[#404942] hover:text-[#1e1b16] hover:bg-[#eae3d9]'
                }`}
                type="button"
                title="Switch to English"
              >
                English
              </button>
            </div>
          </div>


          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'home', labelHi: 'मुख्य', labelEn: 'Home', icon: 'home' },
              { id: 'market', labelHi: 'बाजार', labelEn: 'Market', icon: 'storefront' },
              { id: 'sell', labelHi: 'बेचें', labelEn: 'Sell', icon: 'add_shopping_cart', isSpecial: true },
              { id: 'wallet', labelHi: 'खाता', labelEn: 'Wallet', icon: 'account_balance_wallet' },
              { id: 'insure', labelHi: 'बीमा', labelEn: 'Insure', icon: 'verified_user' },
              { id: 'learn', labelHi: 'सलाह', labelEn: 'Learn', icon: 'menu_book' }
            ].map(tab => {
              const isActive = currentTab === tab.id;
              const primaryLabel = currentLang === 'en' ? tab.labelEn : tab.labelHi;
              const secondaryLabel = currentLang === 'en' ? tab.labelHi : tab.labelEn;


              if (tab.isSpecial) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => onNavigate(tab.id as TabType)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-['Noto_Sans'] text-xs font-bold transition-all shadow-xs whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#feb316] text-[#004526] ring-2 ring-[#004526]'
                        : 'bg-[#feb316]/90 text-[#6a4800] hover:bg-[#feb316]'
                    }`}
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined text-lg font-bold"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {tab.icon}
                    </span>
                    <span>
                      {primaryLabel} / {secondaryLabel}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-['Noto_Sans'] text-xs transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#004526] text-white font-bold shadow-xs'
                      : 'text-[#404942] hover:text-[#1e1b16] hover:bg-[#f4ede4] font-medium'
                  }`}
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {tab.icon}
                  </span>
                  <span>{primaryLabel}</span>
                  <span className="text-[10px] opacity-75">({secondaryLabel})</span>
                </button>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Listen Button */}
            <button
              onClick={handleAudioListen}
              aria-label={l('आवाज़ में सुनें', 'Listen with Voice')}
              title={l('आवाज़ में सुनें (Listen)', 'Listen to screen text')}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform ${
                isPlayingAudio
                  ? 'bg-[#feb316] text-[#6a4800] ring-2 ring-[#004526] animate-pulse'
                  : 'bg-[#feb316]/20 text-[#6a4800] hover:bg-[#feb316]/30'
              }`}
              type="button"
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volume_up
              </span>
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              aria-label={l('सूचनाएं', 'Notifications')}
              title={l('सूचनाएं', 'Notifications')}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#1e1b16] hover:bg-[#eee7de] active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-[#fff8f1]" />
            </button>

            {/* Farmer Profile */}
            <button
              onClick={onOpenProfile}
              aria-label={l('किसान प्रोफाइल', 'Farmer Profile')}
              title={l('किसान प्रोफाइल', 'Farmer Profile')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center p-0.5 ring-2 ring-[#004526]/20 active:scale-95 transition-transform"
              type="button"
            >
              <img
                alt="Profile of Anjali Devi"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                src={APP_IMAGES.profile}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Cached Data Reassurance Modal */}
      {showCachedModal && (
        <CachedDataModal
          isOffline={isOffline}
          onClose={() => setShowCachedModal(false)}
          onSimulateSync={() => {
            onToggleOffline();
            setShowCachedModal(false);
          }}
        />
      )}
    </>
  );
};
