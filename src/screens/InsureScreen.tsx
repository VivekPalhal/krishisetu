import React, { useState } from 'react';
import { TabType, DamageCause, ClaimPhoto } from '../types';
import { DAMAGE_CAUSES, CLAIM_PHOTOS_INITIAL, APP_IMAGES } from '../data/mockData';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface InsureScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

export const InsureScreen: React.FC<InsureScreenProps> = ({ onNavigateTab }) => {
  const { language, l } = useLanguage();

  const [selectedCauseId, setSelectedCauseId] = useState<string>('flood');
  const [photos, setPhotos] = useState<ClaimPhoto[]>(CLAIM_PHOTOS_INITIAL);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecorded, setVoiceRecorded] = useState<boolean>(false);
  const [isClaimSubmitted, setIsClaimSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleAudioAssist = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const text =
      language === 'en'
        ? 'Crop Damage Claim. Your Kharif 2026 Wheat protection policy is active. You have selected Flood and Heavy Rain. The satellite-assessed crop loss is 42 percent, and your estimated compensation of 63,000 rupees will be credited directly to your State Bank of India account within seven days.'
        : 'फसल नुकसान का दावा। आपकी गेहूं सुरक्षा पॉलिसी सक्रिय है। आपने अतिवृष्टि व बाढ़ का कारण चुना है। आकलित फसल क्षति बयालीस प्रतिशत है और अनुमानित सहायता राशि तिरसठ हज़ार रुपये सीधे आपके एसबीआई बैंक खाते में सात दिनों में जमा होगी।';

    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    setIsPlayingAudio(true);
    speakText(text, voiceLang, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCapturePhoto3 = () => {
    setPhotos(prev =>
      prev.map(p =>
        p.id === 3
          ? {
              ...p,
              isUploaded: true,
              image: APP_IMAGES.healthyCrop,
              timestamp: '14 Oct, 09:35 AM',
              gpsTag: '28.384° N, 77.123° E · GPS verified'
            }
          : p
      )
    );
  };

  const handleRetake = (id: number) => {
    setPhotos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isUploaded: false } : p
      )
    );
  };

  const handleToggleVoiceRecord = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setVoiceRecorded(true);
    } else {
      setIsRecordingVoice(true);
      const prompt =
        language === 'en'
          ? 'Speak now to describe the crop damage. Your voice note is being recorded.'
          : 'बोलकर नुकसान बताइए, आपकी आवाज रिकॉर्ड हो रही है';
      const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
      speakText(prompt, voiceLang);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setVoiceRecorded(true);
      }, 3500);
    }
  };

  const handleSubmitClaim = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsClaimSubmitted(true);
    }, 1500);
  };

  const uploadedCount = photos.filter(p => p.isUploaded).length;

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-7xl mx-auto gap-6">
      {/* Status & Reassurance Banner */}
      <div className="bg-[#faf3e9] rounded-2xl p-5 shadow-xs border border-[#e8e2d8]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#004526] text-white">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </span>
              <span className="font-['Noto_Sans'] text-xs font-extrabold text-[#004526] uppercase">
                {l('पॉलिसी सक्रिय · Fast-Track 7.7.3', 'Active Policy · Fast-Track 7.7.3')}
              </span>
            </div>
            <h2 className="font-['Noto_Sans'] font-bold text-lg sm:text-2xl text-[#1e1b16]">
              {l('फसल नुकसान का दावा (Crop Damage Claim)', 'Crop Damage Insurance Claim')}
            </h2>
            <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#404942] mt-0.5">
              {l('खरीफ 2026 - गेहूं सुरक्षा · बीमा राशि: ₹1,50,000 (Sum Insured)', 'Kharif 2026 Wheat Shield · Sum Insured: ₹1,50,000')}
            </p>
          </div>

          <button
            onClick={handleAudioAssist}
            aria-label={l('नुकसान दावा मार्गदर्शन सुनें', 'Listen to Claim Guide')}
            className="shrink-0 bg-[#feb316] text-[#6a4800] px-4 py-2.5 rounded-xl font-['Noto_Sans'] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlayingAudio ? 'pause_circle' : 'volume_up'}
            </span>
            <span>{isPlayingAudio ? l('रोकें', 'Pause') : l('सहायता सुनें', 'Audio Guide')}</span>
          </button>
        </div>

        {/* Quick Trust Pill */}
        <div className="mt-3 pt-3 border-t border-[#e8e2d8] flex items-center justify-between text-[#404942] font-['Noto_Sans'] text-xs">
          <span className="flex items-center gap-1.5 text-[#004526] font-bold">
            <span className="material-symbols-outlined text-base">gps_fixed</span> {l('GPS पिन: 28.384° N, 77.123° E (सत्यापित)', 'GPS Pin: 28.384° N, 77.123° E (Verified)')}
          </span>
          <span className="bg-[#eee7de] px-2.5 py-0.5 rounded-md text-[#1e1b16] font-bold text-xs">
            {l('चरण 1 / 3', 'Step 1 of 3')}
          </span>
        </div>
      </div>

      {isClaimSubmitted ? (
        <div className="py-12 text-center space-y-5 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#004526] text-white flex items-center justify-center mx-auto shadow-lg ring-8 ring-[#aef2c2]/40">
            <span className="material-symbols-outlined text-4xl font-bold">verified</span>
          </div>
          <h2 className="font-['Noto_Sans'] font-extrabold text-2xl sm:text-3xl text-[#004526]">
            {l('दावा सफलतापूर्वक दर्ज!', 'Claim Submitted Successfully!')}
          </h2>
          <p className="font-['Noto_Sans'] text-sm sm:text-base text-[#1e1b16]">
            {l('आपका दावा', 'Your claim')} <strong>#CLM-9824</strong> {l('फास्ट-ट्रैक मोड में स्वीकार कर लिया गया है।', 'has been acknowledged in Fast-Track mode.')}
          </p>
          <div className="p-5 bg-white rounded-2xl border-2 border-[#004526] text-left space-y-2.5 text-sm shadow-xs">
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('अनुमानित सहायता राशि:', 'Estimated Relief Amount:')}</span>
              <span className="font-extrabold text-lg text-[#004526]">₹63,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('भुगतान माध्यम:', 'Payout Channel:')}</span>
              <span className="font-bold">{l('SBI खाता ••••••4108 (DBT)', 'SBI Account ••••••4108 (DBT)')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('अपेक्षित निपटान:', 'Expected Settlement:')}</span>
              <span className="font-bold text-[#7f5700]">{l('7 कार्य दिवसों में', 'Within 7 Working Days')}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('home')}
            className="w-full h-14 bg-[#004526] text-white rounded-xl font-['Noto_Sans'] font-bold text-base shadow-md active:scale-98 transition-transform cursor-pointer"
            type="button"
          >
            {l('होम स्क्रीन पर जाएं (Return Home)', 'Return to Home Dashboard')}
          </button>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
          {/* Left Column: Form & Proof collection */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Damage Cause Selector */}
            <section aria-labelledby="step1-heading" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#004526] text-white flex items-center justify-center font-['Noto_Sans'] font-bold text-sm">
                    {l('१', '1')}
                  </span>
                  <div>
                    <h3
                      className="font-['Noto_Sans'] font-bold text-base sm:text-lg text-[#1e1b16]"
                      id="step1-heading"
                    >
                      {l('नुकसान का कारण चुनें (Select Reason)', 'Select Cause of Damage')}
                    </h3>
                    <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                      {l('टच करके चुनें (Tap to pick cause)', 'Tap to pick the damage type')}
                    </p>
                  </div>
                </div>
                <span className="text-[#004526] font-['Noto_Sans'] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">touch_app</span> {l('1 चुना गया', '1 Selected')}
                </span>
              </div>

              {/* Cause Cards Grid: 4 columns on tablet/desktop */}
              <div aria-label="Damage cause options" className="grid grid-cols-2 sm:grid-cols-4 gap-3.5" role="radiogroup">
                {DAMAGE_CAUSES.map(cause => {
                  const isSelected = selectedCauseId === cause.id;
                  const name = language === 'en' ? cause.nameEn : cause.nameHi;
                  const subname = language === 'en' ? cause.nameHi : cause.nameEn;

                  return (
                    <div
                      key={cause.id}
                      onClick={() => setSelectedCauseId(cause.id)}
                      aria-checked={isSelected}
                      role="radio"
                      tabIndex={0}
                      className={`relative rounded-2xl p-4 cursor-pointer flex flex-col justify-between h-44 transition-all border ${
                        isSelected
                          ? 'bg-white border-2 border-[#004526] shadow-md bg-gradient-to-b from-[#004526]/5 to-transparent'
                          : 'bg-white border border-[#e8e2d8] shadow-xs hover:border-[#c0c9bf] opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                            isSelected
                              ? 'bg-[#1b5e3a] text-[#92d5a8]'
                              : 'bg-[#eee7de] text-[#1e1b16]'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-3xl"
                            style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {cause.icon}
                          </span>
                        </div>

                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
                            isSelected
                              ? 'bg-[#004526] text-white'
                              : 'bg-[#eee7de] text-[#404942]'
                          }`}
                        >
                          {isSelected ? (
                            <span className="material-symbols-outlined text-lg">check</span>
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#c0c9bf]" />
                          )}
                        </span>
                      </div>

                      <div className="mt-2">
                        {cause.isPopular && (
                          <span className="inline-block px-2 py-0.5 rounded bg-[#004526]/10 text-[#004526] font-['Noto_Sans'] font-extrabold text-[10px] mb-1">
                            {l('सर्वाधिक दावा', 'Top Cause')}
                          </span>
                        )}
                        <p className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] leading-tight">
                          {name}
                        </p>
                        <p className="font-['Noto_Sans'] text-xs text-[#404942] mt-0.5">
                          {subname}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 2: 3 Simple Geo-Tagged Photos */}
            <section aria-labelledby="step2-heading" className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-[#004526] text-white flex items-center justify-center font-['Noto_Sans'] font-bold text-sm">
                    {l('२', '2')}
                  </span>
                  <div>
                    <h3
                      className="font-['Noto_Sans'] font-bold text-base sm:text-lg text-[#1e1b16]"
                      id="step2-heading"
                    >
                      {l('खेत की ३ स्पष्ट तस्वीरें लें (3 Crop Photos)', 'Capture 3 Geo-Tagged Crop Photos')}
                    </h3>
                    <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                      {l('जीपीएस स्वतः सत्यापित (GPS On-Device Verification)', 'GPS-tagged automatically')}
                    </p>
                  </div>
                </div>
                <span className="bg-[#004526]/10 text-[#004526] font-['Noto_Sans'] font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">photo_library</span>{' '}
                  {uploadedCount}/3 {l('तैयार', 'Ready')}
                </span>
              </div>

              {/* Photo Stack */}
              <div className="space-y-3">
                {/* Photo 1: Close-up */}
                {photos[0]?.isUploaded && (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col border border-[#e8e2d8]">
                    <div className="p-4 flex gap-4 items-center">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#eee7de]">
                        <img
                          className="w-full h-full object-cover"
                          alt="Submerged damaged wheat"
                          src={photos[0].image}
                        />
                        <div className="absolute inset-0 bg-[#004526]/20 flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-[#004526] text-white flex items-center justify-center shadow-xs">
                            <span className="material-symbols-outlined text-base">done</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[#004526] font-['Noto_Sans'] font-extrabold text-xs mb-0.5">
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                          <span>{l('फोटो १ अपलोड हो गया', 'Photo 1 Uploaded')}</span>
                        </div>
                        <h4 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] truncate">
                          {language === 'en' ? photos[0].titleEn : photos[0].titleHi}
                        </h4>
                        <p className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                          {language === 'en' ? photos[0].titleHi : photos[0].titleEn}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-[#404942] font-['Noto_Sans'] text-xs bg-[#faf3e9] px-2.5 py-1 rounded-md w-fit">
                          <span className="material-symbols-outlined text-sm text-[#004526]">
                            location_on
                          </span>
                          <span>{photos[0].subtitleHi}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRetake(1)}
                        aria-label="Retake Photo 1"
                        className="w-12 h-12 rounded-full bg-[#f4ede4] text-[#1e1b16] flex items-center justify-center shrink-0 hover:bg-[#eee7de] cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xl">refresh</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Photo 2: Wide Farm View */}
                {photos[1]?.isUploaded && (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col border border-[#e8e2d8]">
                    <div className="p-4 flex gap-4 items-center">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#eee7de]">
                        <img
                          className="w-full h-full object-cover"
                          alt="Flooded farm landscape"
                          src={photos[1].image}
                        />
                        <div className="absolute inset-0 bg-[#004526]/20 flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-[#004526] text-white flex items-center justify-center shadow-xs">
                            <span className="material-symbols-outlined text-base">done</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[#004526] font-['Noto_Sans'] font-extrabold text-xs mb-0.5">
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                          <span>{l('फोटो २ अपलोड हो गया', 'Photo 2 Uploaded')}</span>
                        </div>
                        <h4 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] truncate">
                          {language === 'en' ? photos[1].titleEn : photos[1].titleHi}
                        </h4>
                        <p className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                          {language === 'en' ? photos[1].titleHi : photos[1].titleEn}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-[#404942] font-['Noto_Sans'] text-xs bg-[#faf3e9] px-2.5 py-1 rounded-md w-fit">
                          <span className="material-symbols-outlined text-sm text-[#004526]">
                            location_on
                          </span>
                          <span>{photos[1].subtitleHi}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRetake(2)}
                        aria-label="Retake Photo 2"
                        className="w-12 h-12 rounded-full bg-[#f4ede4] text-[#1e1b16] flex items-center justify-center shrink-0 hover:bg-[#eee7de] cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xl">refresh</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Photo 3: Healthy Comparison */}
                {!photos[2]?.isUploaded ? (
                  <div className="bg-white rounded-2xl p-5 shadow-md bg-gradient-to-r from-[#feb316]/10 via-white to-white flex flex-col border border-[#feb316]/40">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-xl bg-[#feb316]/20 flex flex-col items-center justify-center text-[#6a4800] shrink-0">
                        <span className="material-symbols-outlined text-4xl animate-bounce">
                          photo_camera
                        </span>
                        <span className="font-['Noto_Sans'] font-extrabold text-[10px] uppercase mt-1">
                          {l('कैमरा खोलें', 'Open Camera')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-[#feb316]/30 text-[#6a4800] font-['Noto_Sans'] font-extrabold text-xs mb-1">
                          {l('अंतिम फोटो आवश्यक', 'Final Photo Needed')}
                        </span>
                        <h4 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                          {l('स्वस्थ पौधे से तुलना', 'Healthy Crop Benchmark')}
                        </h4>
                        <p className="font-['Noto_Sans'] text-xs text-[#404942] mt-0.5">
                          {l('खेत के सुरक्षित कोने या स्वस्थ पौधे की तस्वीर लें', 'Capture a patch of unaffected crops for AI baseline comparison')}
                        </p>
                        <button
                          onClick={handleCapturePhoto3}
                          className="mt-3 py-3 px-4 rounded-xl bg-[#feb316] text-[#6a4800] font-['Noto_Sans'] font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-xs hover:bg-[#e5a013] cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-xl">add_a_photo</span>
                          <span>{l('फोटो ३ खींचें (Tap Here)', 'Capture Photo 3 (Tap Here)')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xs flex flex-col border border-[#e8e2d8]">
                    <div className="p-4 flex gap-4 items-center">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#eee7de]">
                        <img
                          className="w-full h-full object-cover"
                          alt="Healthy crop comparison"
                          src={photos[2].image}
                        />
                        <div className="absolute inset-0 bg-[#004526]/20 flex items-center justify-center">
                          <span className="w-7 h-7 rounded-full bg-[#004526] text-white flex items-center justify-center shadow-xs">
                            <span className="material-symbols-outlined text-base">done</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 text-[#004526] font-['Noto_Sans'] font-extrabold text-xs mb-0.5">
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            check_circle
                          </span>
                          <span>{l('फोटो ३ अपलोड हो गया', 'Photo 3 Uploaded')}</span>
                        </div>
                        <h4 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] truncate">
                          {l('स्वस्थ पौधे से तुलना', 'Healthy Crop Benchmark')}
                        </h4>
                        <div className="mt-2 flex items-center gap-1.5 text-[#404942] font-['Noto_Sans'] text-xs bg-[#faf3e9] px-2.5 py-1 rounded-md w-fit">
                          <span className="material-symbols-outlined text-sm text-[#004526]">
                            location_on
                          </span>
                          <span>14 Oct, 09:35 AM · {l('GPS सत्यापित', 'GPS Verified')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRetake(3)}
                        aria-label="Retake Photo 3"
                        className="w-12 h-12 rounded-full bg-[#f4ede4] text-[#1e1b16] flex items-center justify-center shrink-0 hover:bg-[#eee7de] cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xl">refresh</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Note Option for Illiterate Farmers */}
              <div className="bg-[#faf3e9] rounded-2xl p-4 flex items-center justify-between gap-3 border border-[#e8e2d8]">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#7f5700] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-2xl">mic</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16] leading-tight">
                      {l('बोलकर नुकसान बताएं', 'Record Voice Description')}
                    </h4>
                    <p className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                      {voiceRecorded
                        ? l('✓ आवाज़ रिकॉर्ड हो गई (Voice saved)', '✓ Voice note attached')
                        : l('आवाज़ रिकॉर्ड करें (Hold to record message)', 'Tap to describe loss via voice')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleVoiceRecord}
                  aria-label="Record voice note"
                  className={`font-['Noto_Sans'] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer ${
                    isRecordingVoice
                      ? 'bg-[#ba1a1a] text-white animate-pulse'
                      : voiceRecorded
                      ? 'bg-[#aef2c2] text-[#004526]'
                      : 'bg-[#eee7de] text-[#1e1b16]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm text-[#7f5700]">
                    {voiceRecorded ? 'check' : 'graphic_eq'}
                  </span>
                  <span>
                    {isRecordingVoice
                      ? l('रिकॉर्डिंग जारी...', 'Recording...')
                      : voiceRecorded
                      ? l('दोबारा बोलें', 'Re-record')
                      : l('रिकॉर्ड करें', 'Record')}
                  </span>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: AI Analysis & Claim Submission Card (Sticky on Desktop) */}
          <div className="lg:col-span-5 sticky top-28 space-y-5">
            {/* STEP 3: Instant AI Damage Assessment & Fast-Track Eligibility */}
            <section aria-labelledby="step3-heading" className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#004526] text-white flex items-center justify-center font-['Noto_Sans'] font-bold text-sm">
                  {l('३', '3')}
                </span>
                <div>
                  <h3
                    className="font-['Noto_Sans'] font-bold text-base sm:text-lg text-[#1e1b16]"
                    id="step3-heading"
                  >
                    {l('तुरंत AI विश्लेषण रिपोर्ट (Instant Assessment)', 'Instant AI Damage Assessment Report')}
                  </h3>
                  <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                    {l('उपग्रह व फोटो आधारित सत्यापन', 'Satellite & Geo-Photo Cross-Verification')}
                  </p>
                </div>
              </div>

              {/* Main Assessment Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col gap-4 border border-[#e8e2d8]">
                {/* Top Row: Satellite & AI Meter */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1b5e3a]/15 text-[#004526] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">satellite_alt</span>
                    </div>
                    <div>
                      <p className="font-['Noto_Sans'] text-xs text-[#404942]">{l('उपग्रह + फोटो मॉडल', 'Satellite + Drone Vision')}</p>
                      <p className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16]">
                        {l('ISRO-Sentinel 2 विश्लेषण', 'ISRO-Sentinel 2 Analysis')}
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#004526] text-white px-3 py-1 rounded-full font-['Noto_Sans'] font-extrabold text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span> {l('91% सटीकता', '91% Accuracy')}
                  </span>
                </div>

                {/* Damage Percentage & Progress Visualization */}
                <div className="bg-[#faf3e9] rounded-xl p-4 flex flex-col gap-2.5 border border-[#e8e2d8]">
                  <div className="flex items-baseline justify-between">
                    <span className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16]">
                      {l('आकलित फसल क्षति (Crop Loss):', 'Assessed Crop Damage:')}
                    </span>
                    <span className="font-['Noto_Sans'] text-3xl sm:text-4xl font-extrabold text-[#ba1a1a] leading-none">
                      42%
                    </span>
                  </div>

                  {/* Progress Bar SVG representation */}
                  <div className="w-full bg-[#eee7de] h-3.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#ba1a1a] h-full rounded-full transition-all duration-500"
                      style={{ width: '42%' }}
                    />
                  </div>

                  <div className="flex justify-between font-['Noto_Sans'] text-[11px] text-[#404942]">
                    <span>0% ({l('सुरक्षित', 'Healthy')})</span>
                    <span className="text-[#ba1a1a] font-bold">42% ({l('मध्यम से गंभीर नुकसान', 'Moderate to High Loss')})</span>
                    <span>100% ({l('पूर्ण नष्ट', 'Complete Loss')})</span>
                  </div>
                </div>

                {/* Fast Track Eligibility Callout */}
                <div className="bg-[#004526]/10 rounded-xl p-4 flex items-start gap-3 border border-[#004526]/20">
                  <div className="w-10 h-10 rounded-full bg-[#004526] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bolt
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-['Noto_Sans'] font-bold text-base text-[#004526]">
                      {l('तेज़ भुगतान योग्य (Fast-Track Eligible)', 'Fast-Track Payout Eligible')}
                    </h4>
                    <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#1e1b16] mt-1 leading-relaxed">
                      {l(
                        'सर्वेयर के इंतज़ार के बिना 7 दिनों में सीधे बैंक खाते में सहायता राशि (DBT) अंतरित होगी।',
                        'Direct benefit transfer will credit within 7 business days without waiting for physical surveyor inspection.'
                      )}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-['Noto_Sans'] text-[#404942]">
                      <span className="material-symbols-outlined text-sm text-[#004526]">
                        account_balance
                      </span>
                      <span>{l('बैंक: SBI खाता संख्या ******4108', 'Bank: State Bank of India •••• 4108')}</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="pt-2 flex items-center justify-between text-[#1e1b16] font-['Noto_Sans'] border-t border-[#e8e2d8]">
                  <span className="text-xs sm:text-sm text-[#404942]">{l('अनुमानित दावा राशि (Estimated Relief):', 'Estimated Claim Relief:')}</span>
                  <span className="font-['Noto_Sans'] text-2xl sm:text-3xl font-extrabold text-[#004526]">
                    ₹63,000
                  </span>
                </div>

                {/* Desktop Primary Submit Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSubmitClaim}
                    disabled={isSubmitting}
                    className="w-full h-14 min-h-[56px] bg-[#feb316] text-[#6a4800] rounded-xl font-['Noto_Sans'] font-extrabold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform border border-[#feb316] hover:bg-[#e5a013] cursor-pointer"
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                        <span>{l('दावा सुरक्षित रूप से जमा हो रहा है...', 'Submitting claim securely...')}</span>
                      </>
                    ) : (
                      <>
                        <span
                          className="material-symbols-outlined text-2xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          send_and_archive
                        </span>
                        <span>{l('दावा जमा करें · ₹63,000 अनुमानित सहायता', 'Submit Claim · ₹63,000 Estimated Relief')}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#707971] font-['Noto_Sans'] mt-2 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#004526]" />
                    <span>{l('इंटरनेट न होने पर भी स्थानीय रूप से सुरक्षित जमा होगा', 'Saved safely in local storage if no internet signal')}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Reassurance Micro-Copy */}
            <div className="p-3 bg-white rounded-xl border border-[#e8e2d8] text-center">
              <p className="font-['Noto_Sans'] text-xs text-[#404942] flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#004526]">verified_user</span>
                <span>{l('प्रधानमंत्री फसल बीमा योजना (PMFBY) मानकों के अनुरूप मान्य', 'Compliant with Pradhan Mantri Fasal Bima Yojana (PMFBY) Standards')}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Pinned Sticky Action Bar (For Mobile only `lg:hidden`) */}
      {!isClaimSubmitted && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#fff8f1]/95 backdrop-blur-xl p-4 shadow-2xl z-40 max-w-lg mx-auto border-t border-[#e8e2d8]">
          <div className="flex items-center justify-center gap-1.5 mb-2 text-[#404942] font-['Noto_Sans'] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#004526] animate-pulse" />
            <span className="material-symbols-outlined text-xs text-[#004526]">wifi_off</span>
            <span>{l('इंटरनेट न होने पर भी सुरक्षित जमा होगा', 'Saved offline if no connection')}</span>
          </div>

          <button
            onClick={handleSubmitClaim}
            disabled={isSubmitting}
            className="w-full h-14 min-h-[56px] bg-[#feb316] text-[#6a4800] rounded-xl font-['Noto_Sans'] font-extrabold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform border border-[#feb316] cursor-pointer"
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                <span>{l('दावा सुरक्षित रूप से जमा हो रहा है...', 'Submitting claim...')}</span>
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  send_and_archive
                </span>
                <span>{l('दावा जमा करें · ₹63,000 अनुमानित सहायता', 'Submit Claim · ₹63,000 Relief')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
