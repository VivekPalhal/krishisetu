import React, { useState } from 'react';
import { TabType, MandiItem } from '../types';
import { MANDI_ITEMS } from '../data/mockData';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface MarketScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onSelectCropToSell?: (cropId: string) => void;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({
  onNavigateTab,
  onSelectCropToSell
}) => {
  const { language, l } = useLanguage();

  const [selectedMandi, setSelectedMandi] = useState('खंडवा (Khandwa)');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [subscribedAlert, setSubscribedAlert] = useState(false);
  const [alertPhone, setAlertPhone] = useState('98260XXXXX');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredItems = MANDI_ITEMS.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.nameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.varietyHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.varietyEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAudioPrices = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const text =
      language === 'en'
        ? 'KisanSetu Mandi Price Bulletin. In Khandwa mandi today, Lokwan Wheat is 2,350 rupees, Tomato is 38 rupees, Mustard is 5,420 rupees, and Soybean is 4,850 rupees per quintal. Strong market arrivals reported across all trading yards.'
        : 'किसान सेतु मंडी भाव बुलेटिन। खंडवा मंडी में आज गेहूं लोकवन दो हज़ार तीन सौ पचास रुपये, टमाटर अड़तीस रुपये, सरसों चौवन सौ बीस रुपये, और सोयाबीन अड़तालीस सौ पचास रुपये प्रति क्विंटल बिक रहा है। बाजार में मजबूत आवक जारी है।';

    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    setIsPlayingAudio(true);
    speakText(text, voiceLang, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleSubscribeAlert = () => {
    setSubscribedAlert(true);
    setShowAlertModal(false);
    showToast(
      language === 'en'
        ? '✓ Daily Mandi Rate SMS & WhatsApp alert activated'
        : '✓ दैनिक मंडी भाव SMS व WhatsApp अलर्ट सक्रिय हो गया'
    );
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-7xl mx-auto gap-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-[#004526] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl border border-[#92d5a8] flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner & Mandi Location Switcher */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#004526] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Noto_Sans'] font-extrabold text-xl sm:text-2xl text-[#004526]">
                  {l('लाइव मंडी भाव', 'Live Mandi Prices')}
                </h1>
                <span className="text-xs font-bold bg-[#aef2c2] text-[#00210f] px-2.5 py-0.5 rounded-full">
                  {l('ई-नाम (e-NAM) सिंक', 'e-NAM Synced')}
                </span>
              </div>
              <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#404942] mt-0.5">
                {l(
                  'मध्य प्रदेश व क्षेत्रीय कृषि उपज मंडियों के आधिकारिक ताज़ा भाव (Live Rates)',
                  'Official real-time rates from regional APMC agricultural mandis'
                )}
              </p>
            </div>
          </div>

          {/* Action Row: Audio summary & Alert button */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              onClick={handleAudioPrices}
              aria-label={l('मंडी भाव आवाज में सुनें', 'Listen to Mandi Prices')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#feb316] text-[#6a4800] text-xs sm:text-sm font-bold active:scale-95 transition-transform shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-xl">
                {isPlayingAudio ? 'pause_circle' : 'volume_up'}
              </span>
              <span>
                {isPlayingAudio ? l('रोकें', 'Pause') : l('भाव सुनें (Listen)', 'Listen Rates')}
              </span>
            </button>

            <button
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#f4ede4] text-[#004526] hover:bg-[#eee7de] text-xs sm:text-sm font-bold border border-[#c0c9bf]/60 active:scale-95 transition-transform cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span>
                {subscribedAlert
                  ? l('अलर्ट चालू है', 'Alert Active')
                  : l('SMS अलर्ट पाएं', 'Get SMS Alert')}
              </span>
            </button>
          </div>
        </div>

        {/* Mandi Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-[#f4ede4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-[#404942] whitespace-nowrap shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-[#004526]">location_on</span>
              {l('मंडी चुनें:', 'Select Mandi:')}
            </span>
            {[
              { id: 'khandwa', hi: 'खंडवा (Khandwa)', en: 'Khandwa Mandi' },
              { id: 'indore', hi: 'इंदौर (Indore)', en: 'Indore Mandi' },
              { id: 'khargone', hi: 'खरगोन (Khargone)', en: 'Khargone Mandi' },
              { id: 'ujjain', hi: 'उज्जैन (Ujjain)', en: 'Ujjain Mandi' },
              { id: 'dewas', hi: 'देवास (Dewas)', en: 'Dewas Mandi' }
            ].map(mandi => {
              const label = language === 'en' ? mandi.en : mandi.hi;
              return (
                <button
                  key={mandi.id}
                  onClick={() => setSelectedMandi(mandi.hi)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedMandi === mandi.hi
                      ? 'bg-[#004526] text-white shadow-xs'
                      : 'bg-[#faf3e9] text-[#404942] hover:bg-[#eee7de] hover:text-[#1e1b16]'
                  }`}
                  type="button"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Quick Search Input on Desktop */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder={l('फसल खोजें (Search Crop)...', 'Search commodity or variety...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-[#faf3e9] border border-[#e8e2d8] rounded-xl text-xs text-[#1e1b16] placeholder:text-[#707971] focus:outline-none focus:border-[#004526] font-medium"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-base text-[#707971]">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#707971] hover:text-[#1e1b16] cursor-pointer"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2-Column Responsive Desktop Layout */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
        {/* Main Column: Filter Tabs & Commodities Grid */}
        <div className="lg:col-span-8 space-y-5">
          {/* Category Filter Segmented Control */}
          <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-[#e8e2d8] shadow-xs overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', labelHi: 'सभी फसलें (All)', labelEn: 'All Crops', icon: 'apps' },
                { id: 'grain', labelHi: 'अनाज (Grains)', labelEn: 'Grains', icon: 'grain' },
                { id: 'oilseed', labelHi: 'तिलहन (Oilseeds)', labelEn: 'Oilseeds', icon: 'eco' },
                { id: 'vegetable', labelHi: 'सब्जियां (Vegetables)', labelEn: 'Vegetables', icon: 'nutrition' },
                { id: 'pulse', labelHi: 'दलहन (Pulses)', labelEn: 'Pulses', icon: 'spa' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#004526] text-white shadow-xs'
                      : 'text-[#404942] hover:bg-[#faf3e9] hover:text-[#1e1b16]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">{cat.icon}</span>
                  <span>{language === 'en' ? cat.labelEn : cat.labelHi}</span>
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-block text-xs font-mono tabular-nums text-[#404942] pr-2">
              {filteredItems.length} {l('जिंस उपलब्ध', 'commodities listed')}
            </span>
          </div>

          {/* Commodity Cards Grid (2-Column on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => {
              const cropName = language === 'en' ? item.nameEn : item.nameHi;
              const cropVariety = language === 'en' ? item.varietyEn : item.varietyHi;
              const cropUnit = language === 'en' ? item.unitEn : item.unitHi;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] hover:border-[#004526]/40 transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-16 rounded-2xl bg-[#faf3e9] overflow-hidden shrink-0 border border-[#e8e2d8] shadow-2xs">
                          <img
                            src={item.image}
                            alt={cropName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] truncate">
                              {cropName}
                            </h3>
                          </div>
                          <p className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                            {cropVariety}
                          </p>
                          <p className="text-[11px] text-[#707971] mt-1 font-mono">
                            {l('आवक:', 'Arrival:')} <strong>{item.arrival}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Price Block */}
                      <div className="text-right shrink-0">
                        <div className="font-['Noto_Sans'] text-2xl font-extrabold text-[#1e1b16] tabular-nums tracking-tight">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-[#404942]">/ {cropUnit}</div>
                        <div
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold mt-1.5 ${
                            item.isUp
                              ? 'bg-[#aef2c2]/50 text-[#09522f]'
                              : 'bg-[#eee7de] text-[#404942]'
                          }`}
                        >
                          {item.isUp ? (
                            <>
                              <span className="material-symbols-outlined text-sm font-bold">
                                arrow_drop_up
                              </span>
                              <span>▲ ₹{item.changeAmount} (+{item.changePercent}%)</span>
                            </>
                          ) : (
                            <span>{l('स्थिर (Steady)', 'Steady')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* MSP Comparison Strip */}
                    <div className="mt-3.5 p-2.5 bg-[#faf3e9] rounded-xl flex items-center justify-between text-xs border border-[#e8e2d8]">
                      <span className="text-[#404942]">
                        {l('सरकारी MSP:', 'Govt MSP:')} <strong className="text-[#1e1b16] tabular-nums">₹{item.msp}</strong>
                      </span>
                      <span
                        className={`font-bold ${
                          item.price >= item.msp ? 'text-[#004526]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {item.price >= item.msp
                          ? (language === 'en'
                              ? `+₹${item.price - item.msp} Above MSP`
                              : `MSP से +₹${item.price - item.msp} ऊपर`)
                          : (language === 'en'
                              ? `-₹${item.msp - item.price} Below MSP`
                              : `MSP से -₹${item.msp - item.price} कम`)}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f4ede4]">
                    <span className="text-[11px] text-[#404942] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#004526]">verified</span>
                      {l('सत्यापित दर', 'Verified Rate')}
                    </span>

                    <button
                      onClick={() => {
                        if (onSelectCropToSell) {
                          onSelectCropToSell(item.id);
                        }
                        onNavigateTab('sell');
                      }}
                      className="px-4 py-2 bg-[#feb316] text-[#6a4800] rounded-xl text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-transform shadow-xs hover:bg-[#e5a013] cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base font-bold">
                        add_shopping_cart
                      </span>
                      <span>{l('इस फसल को बेचें (Sell)', 'Sell This Crop')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="p-8 bg-white rounded-2xl text-center border border-[#e8e2d8] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#c0c9bf]">search_off</span>
              <p className="font-bold text-sm text-[#1e1b16]">{l('कोई फसल नहीं मिली', 'No commodities found')}</p>
              <p className="text-xs text-[#404942]">{l('कृपया अपनी खोज बदलें या दूसरा फ़िल्टर चुनें।', 'Please refine your search query or pick another filter category.')}</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Market Analytics & MSP Info */}
        <div className="lg:col-span-4 space-y-5">
          {/* Mandi Operational Status Card */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004526] animate-pulse" />
                <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                  {selectedMandi} {l('स्थिति', 'Status')}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-[#aef2c2]/60 text-[#004526] text-xs font-bold rounded-full">
                {l('मंडी खुली है', 'Mandi Open')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#faf3e9] p-3 rounded-xl border border-[#e8e2d8]">
                <span className="text-[#404942] block">{l('आज का कुल व्यापार', 'Today\'s Volume')}</span>
                <span className="font-bold text-base text-[#004526] tabular-nums mt-0.5 block">
                  {l('₹4.82 करोड़', '₹4.82 Cr')}
                </span>
                <span className="text-[10px] text-[#707971]">12,450 {l('क्विंटल', 'Quintal')}</span>
              </div>
              <div className="bg-[#faf3e9] p-3 rounded-xl border border-[#e8e2d8]">
                <span className="text-[#404942] block">{l('आज का सर्वाधिक उछाल', 'Top Gainer')}</span>
                <span className="font-bold text-base text-[#7f5700] tabular-nums mt-0.5 block">
                  {l('टमाटर +11.8%', 'Tomato +11.8%')}
                </span>
                <span className="text-[10px] text-[#707971]">{l('मजबूत मांग', 'High Demand')}</span>
              </div>
            </div>

            <div className="text-xs text-[#404942] pt-1 border-t border-[#f4ede4] flex items-center justify-between">
              <span>{l('नीलामी समय:', 'Trading Hours:')}</span>
              <strong className="text-[#1e1b16]">{l('सुबह 08:30 – शाम 04:30', '08:30 AM – 04:30 PM')}</strong>
            </div>
          </section>

          {/* 7-Day Price Trends Mini-Chart */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xl text-[#004526]">trending_up</span>
                <span>{l('भाव रुझान (7-Day Trends)', '7-Day Price Trends')}</span>
              </h3>
              <span className="text-xs text-[#707971]">{l('साप्ताहिक', 'Weekly')}</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Trend 1: Wheat */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>{l('गेहूं (Lokwan)', 'Wheat (Lokwan)')}</span>
                  <span className="text-[#004526] tabular-nums">₹2,350 (+2.1%)</span>
                </div>
                <div className="w-full bg-[#eee7de] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#004526] h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Trend 2: Soybean */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>{l('सोयाबीन (Yellow)', 'Soybean (Yellow)')}</span>
                  <span className="text-[#004526] tabular-nums">₹4,850 (+3.5%)</span>
                </div>
                <div className="w-full bg-[#eee7de] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#feb316] h-full rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              {/* Trend 3: Mustard */}
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>{l('सरसों (Mustard)', 'Mustard (Brown)')}</span>
                  <span className="text-[#404942] tabular-nums">₹5,420 ({l('स्थिर', 'Steady')})</span>
                </div>
                <div className="w-full bg-[#eee7de] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#c0c9bf] h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </section>

          {/* Government MSP 2025-26 Quick Reference */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] space-y-3">
            <h3 className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg text-[#004526]">shield</span>
              <span>{l('न्यूनतम समर्थन मूल्य (MSP 2025-26)', 'Govt MSP Rates (2025-26)')}</span>
            </h3>

            <div className="divide-y divide-[#f4ede4] text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#404942]">{l('गेहूं (Wheat)', 'Wheat')}</span>
                <span className="font-bold text-[#1e1b16] tabular-nums">₹2,275 / {l('क्विंटल', 'qtl')}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#404942]">{l('चना (Gram)', 'Bengal Gram')}</span>
                <span className="font-bold text-[#1e1b16] tabular-nums">₹5,440 / {l('क्विंटल', 'qtl')}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#404942]">{l('सरसों (Mustard)', 'Mustard')}</span>
                <span className="font-bold text-[#1e1b16] tabular-nums">₹5,650 / {l('क्विंटल', 'qtl')}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-[#404942]">{l('सोयाबीन (Soybean)', 'Soybean')}</span>
                <span className="font-bold text-[#1e1b16] tabular-nums">₹4,892 / {l('क्विंटल', 'qtl')}</span>
              </div>
            </div>
          </section>

          {/* Mandi Secretary & Help Card */}
          <div className="rounded-2xl bg-[#ffdead]/40 p-4 border border-[#feb316]/40 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#7f5700]">support_agent</span>
              <h4 className="font-['Noto_Sans'] font-bold text-sm text-[#281900]">
                {l('मंडी सचिव सहायता प्रकोष्ठ', 'Mandi Secretary Support Desk')}
              </h4>
            </div>
            <p className="text-xs text-[#604100]">
              {l(
                'तौल, पर्ची, या ई-भुगतान से संबंधित किसी भी शिकायत या सहायता के लिए संपर्क करें।',
                'Contact official APMC desk for weight discrepancies, slips, or dispute resolution.'
              )}
            </p>
            <a
              href="tel:18001801551"
              className="w-full h-11 bg-[#004526] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>1800-180-1551 ({l('टोल फ्री', 'Toll Free')})</span>
            </a>
          </div>
        </div>
      </div>

      {/* SMS & WhatsApp Alert Subscription Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#fff8f1] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#004526]/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d8]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-2xl">sms</span>
                </div>
                <div>
                  <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                    {l('दैनिक मंडी भाव अलर्ट', 'Daily Mandi Price Alerts')}
                  </h3>
                  <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                    {l('हर सुबह 9 बजे आपके फोन पर', 'Directly to your phone daily at 9:00 AM')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1e1b16] mb-1">
                  {l('मोबाइल नंबर (Mobile Number)', 'Mobile Number')}
                </label>
                <input
                  type="tel"
                  value={alertPhone}
                  onChange={e => setAlertPhone(e.target.value)}
                  className="w-full h-12 px-4 border border-[#c0c9bf] focus:border-[#004526] rounded-xl text-base font-bold font-mono text-[#1e1b16] outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1b16] mb-1">
                  {l('पसंदीदा मंडी (Selected Mandi)', 'Selected Mandi')}
                </label>
                <select
                  value={selectedMandi}
                  onChange={e => setSelectedMandi(e.target.value)}
                  className="w-full h-12 px-3 border border-[#c0c9bf] focus:border-[#004526] rounded-xl text-xs font-bold text-[#1e1b16] outline-none bg-white"
                >
                  <option value="खंडवा (Khandwa)">खंडवा कृषि उपज मंडी (Khandwa)</option>
                  <option value="इंदौर (Indore)">इंदौर देवी अहिल्याबाई मंडी (Indore)</option>
                  <option value="खरगोन (Khargone)">खरगोन मंडी (Khargone)</option>
                  <option value="उज्जैन (Ujjain)">उज्जैन कृषि मंडी (Ujjain)</option>
                </select>
              </div>

              <div className="p-3 bg-[#aef2c2]/30 rounded-xl border border-[#004526]/20 text-xs text-[#004526] flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">verified</span>
                <span>{l('यह सरकारी सेवा पूर्णतः निःशुल्क है। कोई गुप्त शुल्क नहीं।', 'This official service is 100% free of charge. No hidden fees.')}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 h-12 rounded-xl bg-[#f4ede4] text-[#404942] text-xs font-bold hover:bg-[#eee7de] cursor-pointer"
                type="button"
              >
                {l('रद्द करें', 'Cancel')}
              </button>
              <button
                onClick={handleSubscribeAlert}
                className="flex-2 h-12 rounded-xl bg-[#004526] text-white text-xs font-bold shadow-md active:scale-98 transition-transform cursor-pointer"
                type="button"
              >
                {l('अलर्ट चालू करें (Subscribe Free)', 'Activate Alerts (Free)')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
