import React, { useState } from 'react';
import { TabType, CropOption } from '../types';
import { CROPS_CATALOG, APP_IMAGES } from '../data/mockData';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface SellScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onListingCreated?: (listingData: any) => void;
  initialCropId?: string;
}

export const SellScreen: React.FC<SellScreenProps> = ({
  onNavigateTab,
  onListingCreated,
  initialCropId
}) => {
  const { language, l } = useLanguage();

  // Wizard step state (Default is Step 2 as in Image 1!)
  const [currentStep, setCurrentStep] = useState<number>(2);

  // Step 2 Form States
  const [selectedCropId, setSelectedCropId] = useState<string>(() => {
    if (initialCropId) {
      const cleanId = initialCropId.replace('m-', '');
      const found = CROPS_CATALOG.find(c => c.id === cleanId || c.id === initialCropId);
      if (found) return found.id;
    }
    return 'wheat';
  });

  React.useEffect(() => {
    if (initialCropId) {
      const cleanId = initialCropId.replace('m-', '');
      const found = CROPS_CATALOG.find(c => c.id === cleanId || c.id === initialCropId);
      if (found) setSelectedCropId(found.id);
    }
  }, [initialCropId]);

  const [unit, setUnit] = useState<'quintal' | 'kg'>('quintal');
  const [quantity, setQuantity] = useState<number>(50);
  const [qualityGrade, setQualityGrade] = useState<'A' | 'B' | 'C'>('A');
  const [isPriceAccepted, setIsPriceAccepted] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Guide State
  const [isPlayingGuide, setIsPlayingGuide] = useState<boolean>(false);

  // Step 1: Address State
  const [village, setVillage] = useState<string>('बोरगांव बुजुर्ग');
  const [district, setDistrict] = useState<string>('खंडवा (Khandwa)');

  // Step 3: Photos state
  const [cropPhotos, setCropPhotos] = useState<string[]>([APP_IMAGES.wheat, APP_IMAGES.mandiWheat]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];

  const handleAudioGuide = () => {
    if (isPlayingGuide) {
      stopSpeech();
      setIsPlayingGuide(false);
      return;
    }

    const text =
      language === 'en'
        ? 'Step 2 of 4: Produce Details. First select your crop such as Wheat, Paddy, Mustard, Potato, Onion, or Tomato. Then enter your total quantity in quintals or kilograms. Based on government MSP and regional mandi rates, the suggested fair price is 2,350 rupees per quintal.'
        : 'कदम दो का चार, फसल की जानकारी। सबसे पहले अपनी फसल का चयन करें जैसे गेहूं, धान, सरसों, आलू, प्याज या टमाटर। इसके बाद मात्रा दर्ज करें। सरकारी एमएसपी के अनुसार उचित भाव दो हज़ार तीन सौ पचास रुपये सुझाया गया है।';

    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    setIsPlayingGuide(true);
    speakText(text, voiceLang, () => {
      setIsPlayingGuide(false);
    });
  };

  const handleVoiceCropName = () => {
    setIsListeningVoice(true);
    const promptText =
      language === 'en'
        ? 'Speak crop name, such as Wheat or Mustard'
        : 'फसल का नाम बोलिए, जैसे गेहूं या सरसों';
    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    speakText(promptText, voiceLang);
    setTimeout(() => {
      setIsListeningVoice(false);
      setSelectedCropId('wheat');
      showToast(
        language === 'en'
          ? 'Recognized: "Wheat" selected'
          : 'पहचाना गया: "गेहूं (Wheat)" चुना गया'
      );
    }, 2500);
  };

  const handleAcceptPrice = () => {
    setIsPriceAccepted(true);
    showToast(
      language === 'en'
        ? 'Suggested rate ₹2,350 applied'
        : 'सुझाया गया भाव ₹2,350 लागू किया गया'
    );
  };

  const handleSaveDraft = () => {
    showToast(
      language === 'en'
        ? 'Draft saved safely on phone (Works Offline)'
        : 'ड्राफ्ट सफलतापूर्वक फोन में सहेजा गया (Works Offline)'
    );
  };

  const handleCompleteListing = () => {
    showToast(
      language === 'en'
        ? 'Produce successfully published on Mandi exchange!'
        : 'फसल सफलतापूर्वक मंडी एक्सचेंज पर लिस्ट हो गई!'
    );
    setTimeout(() => {
      onNavigateTab('home');
    }, 1500);
  };

  const currentPricePerUnit = selectedCrop.currentRate || 2350;
  const estimatedTotal = currentPricePerUnit * quantity;

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-7xl mx-auto gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 bg-[#004526] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl border border-[#92d5a8] flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STEP PROGRESS & AUDIO ASSIST BAR */}
      <div className="bg-[#f4ede4] rounded-2xl p-5 shadow-xs border border-[#e8e2d8]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex flex-col">
            <span className="font-['Noto_Sans'] font-extrabold text-[#004526] uppercase tracking-wide text-xs sm:text-sm">
              {language === 'en' ? `Step ${currentStep} of 4 · ` : `कदम ${currentStep} का 4 · `}
              {currentStep === 1
                ? l('बुनियादी पता', 'Farm Location')
                : currentStep === 2
                ? l('फसल की जानकारी', 'Produce Details')
                : currentStep === 3
                ? l('फोटो प्रमाण', 'Photos')
                : l('मूल्य तय करें', 'Pricing & Review')}
            </span>
            <span className="font-['Noto_Sans'] text-sm sm:text-base text-[#404942] font-medium">
              {currentStep === 1
                ? l('खेत का स्थान व गांव', 'Farm Location')
                : currentStep === 2
                ? l('फसल व मात्रा ब्योरा', 'Produce Details')
                : currentStep === 3
                ? l('गुणवत्ता फोटो प्रमाण', 'Photos Proof')
                : l('अंतिम समीक्षा व पुष्टि', 'Pricing & Review')}
            </span>
          </div>

          {/* Large Tactile Audio Guide Trigger */}
          <button
            onClick={handleAudioGuide}
            aria-label={l('निर्देश सुनें', 'Listen to Guide')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#feb316] text-[#6a4800] shadow-xs active:scale-95 transition-transform"
            type="button"
          >
            <span
              className="material-symbols-outlined text-2xl font-bold"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlayingGuide ? 'pause_circle' : 'volume_up'}
            </span>
            <span className="font-['Noto_Sans'] text-xs sm:text-sm font-bold whitespace-nowrap">
              {isPlayingGuide ? l('सुन रहे हैं', 'Playing...') : l('निर्देश सुनें', 'Audio Guide')}
            </span>
          </button>
        </div>

        {/* Stepper Progress Track */}
        <div className="w-full bg-[#eee7de] h-3.5 rounded-full overflow-hidden">
          <div
            className="bg-[#004526] h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2.5 text-xs sm:text-sm text-[#404942] font-['Noto_Sans']">
          <button
            onClick={() => setCurrentStep(1)}
            className={`transition-colors ${currentStep >= 1 ? 'text-[#004526] font-bold' : ''}`}
            type="button"
          >
            {l('1. बुनियादी पता', '1. Location')} {currentStep > 1 && '✓'}
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`transition-colors ${currentStep === 2 ? 'text-[#004526] font-bold underline' : ''}`}
            type="button"
          >
            {l('2. फसल ब्योरा', '2. Produce')} {currentStep === 2 && l('(वर्तमान)', '(Current)')}
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`transition-colors ${currentStep >= 3 ? 'text-[#004526] font-bold' : ''}`}
            type="button"
          >
            {l('3. फोटो प्रमाण', '3. Photos')} {currentStep > 3 && '✓'}
          </button>
          <button
            onClick={() => setCurrentStep(4)}
            className={`transition-colors ${currentStep === 4 ? 'text-[#004526] font-bold' : ''}`}
            type="button"
          >
            {l('4. मूल्य तय करें', '4. Review')}
          </button>
        </div>
      </div>

      {/* STEP 1: Basic Address / Location */}
      {currentStep === 1 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e8e2d8] space-y-5 max-w-2xl mx-auto w-full">
          <h2 className="font-['Noto_Sans'] font-bold text-xl text-[#1e1b16] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#004526] text-white flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span>{l('खेत व गांव का पता (Farm Address)', 'Farm Address & Location')}</span>
          </h2>
          <div>
            <label className="block text-xs font-bold text-[#1e1b16] mb-1">
              {l('गांव / कस्बा (Village)', 'Village / Town')}
            </label>
            <input
              type="text"
              value={village}
              onChange={e => setVillage(e.target.value)}
              className="w-full h-14 px-4 border-2 border-[#c0c9bf] focus:border-[#004526] rounded-xl text-base font-bold text-[#1e1b16] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1e1b16] mb-1">
              {l('मंडी व जिला (District & Mandi)', 'District & Nearest Mandi')}
            </label>
            <input
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full h-14 px-4 border-2 border-[#c0c9bf] focus:border-[#004526] rounded-xl text-base font-bold text-[#1e1b16] outline-none"
            />
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full h-14 bg-[#feb316] text-[#6a4800] rounded-xl font-['Noto_Sans'] font-extrabold text-base flex items-center justify-center gap-2 active:scale-98 transition-transform"
            type="button"
          >
            <span>{l('आगे बढ़ें: फसल ब्योरा (Next)', 'Next: Produce Details')}</span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </section>
      )}

      {/* STEP 2: Produce Details (Desktop 2-Column Split) */}
      {currentStep === 2 && (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
          {/* Left Column (Forms & Tactile Pickers) */}
          <div className="lg:col-span-7 space-y-6">
            {/* SECTION 1: CROP SELECTOR */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#004526] text-white font-bold text-sm">
                    1
                  </span>
                  <h2 className="font-['Noto_Sans'] font-bold text-lg sm:text-xl text-[#1e1b16]">
                    {l('फसल चुनें', 'Select Crop')}{' '}
                    <span className="text-[#404942] font-normal text-sm sm:text-base">
                      ({l('Select Crop', 'फसल चुनें')})
                    </span>
                  </h2>
                </div>
                <span className="font-['Noto_Sans'] text-xs font-extrabold bg-[#aef2c2] text-[#00210f] px-3 py-1 rounded-full">
                  {l('अनिवार्य / Req.', 'Required')}
                </span>
              </div>

              {/* Voice Input Banner Button */}
              <button
                onClick={handleVoiceCropName}
                aria-label={l('माइक दबाकर फसल का नाम बोलें', 'Tap mic to speak crop name')}
                className={`w-full min-h-[56px] mb-4 rounded-xl px-4 py-3 flex items-center justify-center gap-3 shadow-xs active:scale-98 transition-transform border ${
                  isListeningVoice
                    ? 'bg-[#004526] text-white animate-pulse border-[#004526]'
                    : 'bg-[#feb316] text-[#6a4800] border-[#feb316]'
                }`}
                type="button"
              >
                <span
                  className="material-symbols-outlined text-3xl font-extrabold animate-pulse"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  mic
                </span>
                <span className="font-['Noto_Sans'] text-sm sm:text-base font-bold text-left leading-tight">
                  {isListeningVoice
                    ? l('सुन रहा हूँ... फसल का नाम बोलें', 'Listening... Please speak crop name')
                    : l('माइक दबाकर फसल का नाम बोलें', 'Tap mic to speak crop name')}
                  <br />
                  <span className="text-xs font-medium opacity-90">
                    {l(
                      'Tap to speak crop name in Hindi / English',
                      'Speak in Hindi or English (e.g., Wheat, Soybean)'
                    )}
                  </span>
                </span>
              </button>

              {/* Crop Grid: 3-column on tablet/desktop */}
              <div aria-label="Crops" className="grid grid-cols-2 sm:grid-cols-3 gap-3.5" role="radiogroup">
                {CROPS_CATALOG.map(crop => {
                  const isSelected = selectedCropId === crop.id;
                  const primaryName = language === 'en' ? crop.nameEn : crop.nameHi;
                  const secondaryName = language === 'en' ? crop.nameHi : crop.nameEn;

                  return (
                    <button
                      key={crop.id}
                      onClick={() => setSelectedCropId(crop.id)}
                      aria-checked={isSelected}
                      role="radio"
                      type="button"
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl shadow-xs active:scale-95 transition-all text-center min-h-[120px] border ${
                        isSelected
                          ? 'bg-[#004526] text-white border-[#004526] shadow-md ring-2 ring-[#004526]'
                          : 'bg-[#f4ede4] text-[#1e1b16] border-[#e8e2d8] hover:border-[#c0c9bf] hover:bg-[#eee7de]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-[#faf3e9] flex items-center justify-center ring-2 ring-black/5">
                        <img
                          className="w-full h-full object-cover"
                          alt={crop.nameHi}
                          src={crop.image}
                        />
                      </div>
                      <span className="font-['Noto_Sans'] font-bold text-base leading-tight">
                        {primaryName}
                      </span>
                      <span
                        className={`font-['Noto_Sans'] text-xs mt-0.5 ${
                          isSelected ? 'opacity-90 text-white' : 'text-[#404942]'
                        }`}
                      >
                        {secondaryName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* SECTION 2: QUANTITY & UNIT SELECTOR */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8]">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#004526] text-white font-bold text-sm">
                  2
                </span>
                <h2 className="font-['Noto_Sans'] font-bold text-lg sm:text-xl text-[#1e1b16]">
                  {l('मात्रा और इकाई', 'Quantity & Unit')}{' '}
                  <span className="text-[#404942] font-normal text-sm sm:text-base">
                    ({l('Quantity & Unit', 'मात्रा और इकाई')})
                  </span>
                </h2>
              </div>

              {/* Unit Toggle Buttons */}
              <div aria-label="Units" className="grid grid-cols-2 gap-3.5 mb-4" role="radiogroup">
                <button
                  onClick={() => setUnit('quintal')}
                  aria-checked={unit === 'quintal'}
                  role="radio"
                  type="button"
                  className={`min-h-[56px] rounded-xl font-['Noto_Sans'] text-base font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 border ${
                    unit === 'quintal'
                      ? 'bg-[#004526] text-white border-[#004526]'
                      : 'bg-[#f4ede4] text-[#1e1b16] border-[#e8e2d8]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: unit === 'quintal' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {unit === 'quintal' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>{l('क्विंटल (Quintal)', 'Quintal (100 kg)')}</span>
                </button>

                <button
                  onClick={() => setUnit('kg')}
                  aria-checked={unit === 'kg'}
                  role="radio"
                  type="button"
                  className={`min-h-[56px] rounded-xl font-['Noto_Sans'] text-base font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 border ${
                    unit === 'kg'
                      ? 'bg-[#004526] text-white border-[#004526]'
                      : 'bg-[#f4ede4] text-[#1e1b16] border-[#e8e2d8]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl text-[#404942]"
                    style={{ fontVariationSettings: unit === 'kg' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {unit === 'kg' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>{l('किलो (kg)', 'Kilogram (kg)')}</span>
                </button>
              </div>

              {/* Large Touchable Input Display */}
              <div className="bg-[#faf3e9] rounded-2xl p-5 flex flex-col items-center justify-center border border-[#e8e2d8]">
                <label
                  className="font-['Noto_Sans'] text-xs sm:text-sm text-[#404942] mb-1 font-bold"
                  htmlFor="quantityInput"
                >
                  {l('कुल मात्रा दर्ज करें (Enter Total Quantity)', 'Enter Total Quantity')}
                </label>

                {/* Counter */}
                <div className="flex items-center justify-between w-full max-w-md gap-3 my-2">
                  <button
                    onClick={() => setQuantity(prev => (prev > 5 ? prev - 5 : 1))}
                    aria-label="Decrease 5 Units"
                    className="w-14 h-14 rounded-full bg-[#eee7de] text-[#1e1b16] flex items-center justify-center active:scale-90 transition-transform shadow-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-3xl font-extrabold">remove</span>
                  </button>

                  <div className="flex items-baseline justify-center gap-2 flex-1 bg-white py-3 px-4 rounded-xl shadow-xs border border-[#c0c9bf]/40">
                    <input
                      id="quantityInput"
                      aria-label="Quantity value"
                      type="number"
                      min="1"
                      max="10000"
                      value={quantity}
                      onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                      className="font-['Noto_Sans'] text-3xl sm:text-4xl font-extrabold text-[#1e1b16] w-28 text-center bg-transparent focus:outline-none tabular-nums"
                    />
                    <span className="font-['Noto_Sans'] font-bold text-lg sm:text-xl text-[#004526]">
                      {unit === 'quintal' ? l('क्विंटल', 'Quintal') : l('किलो', 'kg')}
                    </span>
                  </div>

                  <button
                    onClick={() => setQuantity(prev => prev + 5)}
                    aria-label="Increase 5 Units"
                    className="w-14 h-14 rounded-full bg-[#004526] text-white flex items-center justify-center active:scale-90 transition-transform shadow-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-3xl font-extrabold">add</span>
                  </button>
                </div>

                {/* Quick Add Pills */}
                <div className="flex items-center justify-center gap-3 w-full mt-3">
                  <span className="text-xs text-[#404942] font-['Noto_Sans'] font-bold">
                    {l('त्वरित जोड़ें:', 'Quick Add:')}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => prev + 5)}
                    className="min-h-[44px] px-4 rounded-xl bg-[#eee7de] text-[#004526] font-['Noto_Sans'] text-sm font-bold active:scale-95 transition-transform hover:bg-[#e8e2d8]"
                    type="button"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => setQuantity(prev => prev + 10)}
                    className="min-h-[44px] px-4 rounded-xl bg-[#eee7de] text-[#004526] font-['Noto_Sans'] text-sm font-bold active:scale-95 transition-transform hover:bg-[#e8e2d8]"
                    type="button"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => setQuantity(prev => prev + 50)}
                    className="min-h-[44px] px-4 rounded-xl bg-[#eee7de] text-[#004526] font-['Noto_Sans'] text-sm font-bold active:scale-95 transition-transform hover:bg-[#e8e2d8]"
                    type="button"
                  >
                    +50
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 3: QUALITY GRADE CARDS */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#004526] text-white font-bold text-sm">
                    3
                  </span>
                  <h2 className="font-['Noto_Sans'] font-bold text-lg sm:text-xl text-[#1e1b16]">
                    {l('गुणवत्ता ग्रेड', 'Quality Grade')}{' '}
                    <span className="text-[#404942] font-normal text-sm sm:text-base">
                      ({l('Quality Grade', 'गुणवत्ता ग्रेड')})
                    </span>
                  </h2>
                </div>

                <button
                  onClick={() => setShowGuideModal(true)}
                  className="font-['Noto_Sans'] text-xs font-bold text-[#004526] underline flex items-center gap-1 hover:opacity-80"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">help</span>
                  <span>{l('ग्रेड गाइड (Help)', 'Grading Guide')}</span>
                </button>
              </div>

              {/* Grades Radio Stack */}
              <div aria-label="Grades" className="space-y-3" role="radiogroup">
                {/* Grade A */}
                <button
                  onClick={() => setQualityGrade('A')}
                  aria-checked={qualityGrade === 'A'}
                  role="radio"
                  type="button"
                  className={`w-full min-h-[68px] p-4 rounded-xl shadow-xs flex items-start gap-3.5 text-left active:scale-98 transition-transform border ${
                    qualityGrade === 'A'
                      ? 'bg-[#004526] text-white border-[#004526]'
                      : 'bg-[#f4ede4] text-[#1e1b16] border-[#e8e2d8]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl mt-0.5"
                    style={{ fontVariationSettings: qualityGrade === 'A' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {qualityGrade === 'A' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Noto_Sans'] font-bold text-base sm:text-lg">
                        {l('ग्रेड A (प्रीमियम / Superior)', 'Grade A (Superior / Premium)')}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          qualityGrade === 'A'
                            ? 'bg-[#aef2c2] text-[#00210f]'
                            : 'bg-[#004526]/10 text-[#004526]'
                        }`}
                      >
                        {l('उच्चतम भाव', 'Highest Rate')}
                      </span>
                    </div>
                    <span
                      className={`font-['Noto_Sans'] text-xs sm:text-sm mt-0.5 ${
                        qualityGrade === 'A' ? 'opacity-90 text-white' : 'text-[#404942]'
                      }`}
                    >
                      {l(
                        'सूखा व साफ दाना, चमक अधिक, कोई कंकड़ नहीं (Moisture < 12%)',
                        'Clean, lustrous grain, moisture < 12%, zero stone/chaff'
                      )}
                    </span>
                  </div>
                </button>

                {/* Grade B */}
                <button
                  onClick={() => setQualityGrade('B')}
                  aria-checked={qualityGrade === 'B'}
                  role="radio"
                  type="button"
                  className={`w-full min-h-[68px] p-4 rounded-xl shadow-xs flex items-start gap-3.5 text-left active:scale-98 transition-transform border ${
                    qualityGrade === 'B'
                      ? 'bg-[#004526] text-white border-[#004526]'
                      : 'bg-[#f4ede4] text-[#1e1b16] border-[#e8e2d8]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl mt-0.5"
                    style={{ fontVariationSettings: qualityGrade === 'B' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {qualityGrade === 'B' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Noto_Sans'] font-bold text-base sm:text-lg">
                        {l('ग्रेड B (मध्यम / Good)', 'Grade B (Standard / Good)')}
                      </span>
                      <span className="text-xs text-[#404942] font-bold">
                        {l('मंडी मानक', 'Market Standard')}
                      </span>
                    </div>
                    <span
                      className={`font-['Noto_Sans'] text-xs sm:text-sm mt-0.5 ${
                        qualityGrade === 'B' ? 'opacity-90 text-white' : 'text-[#404942]'
                      }`}
                    >
                      {l(
                        'सामान्य दाना, मामूली नमी या धूल (Standard market mix)',
                        'Standard market mix, mild moisture or dust'
                      )}
                    </span>
                  </div>
                </button>

                {/* Grade C */}
                <button
                  onClick={() => setQualityGrade('C')}
                  aria-checked={qualityGrade === 'C'}
                  role="radio"
                  type="button"
                  className={`w-full min-h-[68px] p-4 rounded-xl shadow-xs flex items-start gap-3.5 text-left active:scale-98 transition-transform border ${
                    qualityGrade === 'C'
                      ? 'bg-[#004526] text-white border-[#004526]'
                      : 'bg-[#f4ede4] text-[#1e1b16] border-[#e8e2d8]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-2xl mt-0.5"
                    style={{ fontVariationSettings: qualityGrade === 'C' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {qualityGrade === 'C' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Noto_Sans'] font-bold text-base sm:text-lg">
                        {l('ग्रेड C (औसत / Fair)', 'Grade C (Fair / Average)')}
                      </span>
                      <span className="text-xs text-[#404942] font-bold">
                        {l('छंटाई बाकी', 'Needs Cleaning')}
                      </span>
                    </div>
                    <span
                      className={`font-['Noto_Sans'] text-xs sm:text-sm mt-0.5 ${
                        qualityGrade === 'C' ? 'opacity-90 text-white' : 'text-[#404942]'
                      }`}
                    >
                      {l(
                        'मिश्रित आकार या अधिक नमी (Needs cleaning / drying)',
                        'Mixed grain size or higher moisture (Needs sun drying)'
                      )}
                    </span>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column (AI Price & Valuation Summary - Sticky on Desktop) */}
          <div className="lg:col-span-5 sticky top-28 space-y-5">
            {/* SECTION 4: AI FAIR-PRICE HINT CARD */}
            <section className="bg-[#f4ede4] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8]">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="material-symbols-outlined text-[#7f5700] font-bold text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  insights
                </span>
                <h3 className="font-['Noto_Sans'] font-bold text-base sm:text-lg text-[#1e1b16]">
                  {l('किसान सेतु उचित मूल्य सुझाव (KisanSetu)', 'KisanSetu Fair-Price Suggestion')}
                </h3>
              </div>
              <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#404942] mb-3">
                {l('सरकारी एमएसपी (MSP) व नजदीकी मंडी औसत भाव:', 'Govt MSP and regional Mandi average rate:')}
                <strong className="text-[#1e1b16] block font-bold text-base sm:text-lg mt-0.5">
                  ₹2,280 – ₹2,400 / {l('क्विंटल', 'Quintal')}
                </strong>
              </p>

              {/* Tactile Amber One-Click Accept Button */}
              <button
                onClick={handleAcceptPrice}
                aria-label={l('सुझाया गया भाव ₹2,350 लगाएं', 'Apply Suggested Rate ₹2,350')}
                className={`w-full min-h-[56px] rounded-xl px-4 py-3 flex items-center justify-between shadow-xs active:scale-98 transition-transform border ${
                  isPriceAccepted
                    ? 'bg-[#004526] text-white border-[#004526]'
                    : 'bg-[#feb316] text-[#6a4800] border-[#feb316]'
                }`}
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    {isPriceAccepted ? 'check_circle' : 'verified'}
                  </span>
                  <span className="font-['Noto_Sans'] text-sm sm:text-base font-extrabold text-left leading-tight">
                    {isPriceAccepted
                      ? l('भाव ₹2,350 लागू किया गया', 'Rate ₹2,350 Applied Successfully')
                      : l('सुझाया गया भाव ₹2,350 लगाएं', 'Apply Suggested Rate ₹2,350')}
                    <br />
                    <span className="text-xs font-normal">
                      {isPriceAccepted
                        ? l('Rate applied successfully', 'भाव सफलता से लागू हुआ')
                        : l('Accept AI Suggested Rate', 'उचित दर स्वीकार करें')}
                    </span>
                  </span>
                </div>
                {isPriceAccepted ? (
                  <span className="font-['Noto_Sans'] text-xs font-bold uppercase bg-[#aef2c2] text-[#00210f] px-2 py-1 rounded">
                    {l('सफल', 'Applied')}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-2xl font-bold">arrow_forward</span>
                )}
              </button>
            </section>

            {/* Live Calculation Bill Card (Desktop friendly) */}
            <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] space-y-3">
              <h4 className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16] border-b border-[#f4ede4] pb-2">
                {l('मूल्य अनुमान सार (Live Produce Valuation)', 'Live Produce Valuation Summary')}
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-[#1e1b16]">
                <div className="flex justify-between">
                  <span className="text-[#404942]">{l('फसल:', 'Crop:')}</span>
                  <span className="font-bold">
                    {language === 'en' ? selectedCrop.nameEn : selectedCrop.nameHi}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404942]">{l('मात्रा:', 'Quantity:')}</span>
                  <span className="font-bold tabular-nums">
                    {quantity} {unit === 'quintal' ? l('क्विंटल', 'Quintal') : l('किलो', 'kg')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404942]">{l('ग्रेड:', 'Grade:')}</span>
                  <span className="font-bold text-[#004526]">
                    {l(`ग्रेड ${qualityGrade}`, `Grade ${qualityGrade}`)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#404942]">{l('लागू भाव:', 'Applied Rate:')}</span>
                  <span className="font-bold text-[#004526] tabular-nums">
                    ₹{currentPricePerUnit} / {unit === 'quintal' ? l('क्विंटल', 'Quintal') : l('किग्रा', 'kg')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#f4ede4] pt-2 text-base">
                  <span className="font-bold text-[#1e1b16]">
                    {l('कुल अनुमानित आय:', 'Total Estimated Revenue:')}
                  </span>
                  <span className="font-extrabold text-xl text-[#004526] tabular-nums">
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </section>

            {/* SECTION 5: ACTION & PHOTO PROGRESS BAR */}
            <section className="flex flex-col items-center space-y-3">
              {/* Next Step Primary Button */}
              <button
                onClick={() => setCurrentStep(3)}
                aria-label={l('आगे बढ़ें: फोटो जोड़ें', 'Next: Add Photos')}
                className="w-full min-h-[60px] rounded-full bg-[#feb316] text-[#6a4800] shadow-md flex items-center justify-between px-6 py-3.5 active:scale-95 transition-transform border border-[#feb316]"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl font-extrabold">
                    photo_camera
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="font-['Noto_Sans'] text-base font-extrabold leading-tight text-[#004526]">
                      {l('आगे बढ़ें: फोटो जोड़ें', 'Next: Add Crop Photos')}
                    </span>
                    <span className="text-xs font-bold text-[#6a4800] opacity-90">
                      {l('Next: Add Photos (2/4 सुरक्षित)', '2 of 4 photos taken')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#6a4800]/10 px-3 py-1.5 rounded-full">
                  <span className="font-['Noto_Sans'] text-xs font-extrabold text-[#004526]">
                    2/4
                  </span>
                  <span className="material-symbols-outlined text-xl font-bold text-[#004526]">
                    arrow_forward
                  </span>
                </div>
              </button>

              {/* Save Draft / Works Offline Action */}
              <button
                onClick={handleSaveDraft}
                aria-label={l('ड्राफ्ट के रूप में सहेजें', 'Save as Draft')}
                className="w-full min-h-[48px] px-6 py-2.5 rounded-full bg-[#f4ede4] text-[#404942] flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#eee7de] border border-[#e8e2d8]"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">offline_pin</span>
                <span className="font-['Noto_Sans'] text-xs font-bold">
                  {l('ड्राफ्ट के रूप में सहेजें (Works Offline)', 'Save as Draft (Works Offline)')}
                </span>
              </button>
            </section>
          </div>
        </div>
      )}

      {/* STEP 3: Photos View */}
      {currentStep === 3 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e8e2d8] space-y-5 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <h2 className="font-['Noto_Sans'] font-bold text-xl text-[#1e1b16] flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-[#004526] text-white flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>{l('फसल की तस्वीरें (Produce Photos)', 'Produce Photographs')}</span>
            </h2>
            <span className="text-xs font-bold text-[#004526] bg-[#aef2c2]/50 px-3 py-1 rounded-full">
              {l('2 तस्वीरें तैयार', '2 Photos Ready')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 bg-[#faf3e9] border border-[#c0c9bf]/60 shadow-xs">
              <img
                src={cropPhotos[0]}
                alt="Produce Crop 1"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {l('दाना पास से', 'Grain Close-up')}
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-44 sm:h-56 bg-[#faf3e9] border border-[#c0c9bf]/60 shadow-xs">
              <img
                src={cropPhotos[1]}
                alt="Produce Crop 2"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {l('बोरी में ढेर', 'Harvest Lot / Heap')}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              showToast(
                language === 'en'
                  ? 'Photo added via device camera!'
                  : 'अतिरिक्त फोटो कैमरा से जोड़ी गई!'
              );
            }}
            className="w-full h-14 rounded-xl bg-[#f4ede4] text-[#004526] font-['Noto_Sans'] text-sm font-bold flex items-center justify-center gap-2 border border-[#c0c9bf] hover:bg-[#eee7de]"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">add_a_photo</span>
            <span>{l('और फोटो जोड़ें (Take More Photos)', 'Take Additional Photos')}</span>
          </button>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 h-14 bg-[#f4ede4] text-[#404942] rounded-xl font-['Noto_Sans'] font-bold text-sm hover:bg-[#eee7de]"
              type="button"
            >
              {l('पीछे जाएं (Back)', 'Back')}
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex-2 h-14 bg-[#feb316] text-[#6a4800] rounded-xl font-['Noto_Sans'] font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-transform"
              type="button"
            >
              <span>{l('अंतिम चरण: मूल्य पुष्टि (Next)', 'Next: Pricing & Review')}</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: Final Review & Publish */}
      {currentStep === 4 && (
        <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e8e2d8] space-y-5 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#004526] text-white flex items-center justify-center text-sm font-bold">
              4
            </span>
            <h2 className="font-['Noto_Sans'] font-bold text-xl text-[#1e1b16]">
              {l('समीक्षा व मंडी में लिस्ट करें (Publish)', 'Review & Publish to Mandi')}
            </h2>
          </div>

          <div className="bg-[#faf3e9] p-5 rounded-2xl border border-[#e8e2d8] space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('चुनी गई फसल:', 'Selected Crop:')}</span>
              <span className="font-bold text-[#1e1b16]">
                {language === 'en' ? selectedCrop.nameEn : selectedCrop.nameHi}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('मात्रा:', 'Quantity:')}</span>
              <span className="font-bold text-[#1e1b16] tabular-nums">
                {quantity} {unit === 'quintal' ? l('क्विंटल', 'Quintal') : l('किलो', 'kg')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('गुणवत्ता ग्रेड:', 'Quality Grade:')}</span>
              <span className="font-bold text-[#004526]">
                {l(`ग्रेड ${qualityGrade} (उत्कृष्ट)`, `Grade ${qualityGrade} (Superior)`)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#e8e2d8] pt-2">
              <span className="text-[#404942]">{l('न्यूनतम विक्रय भाव:', 'Minimum Reserve Rate:')}</span>
              <span className="font-bold text-lg text-[#004526] tabular-nums">
                ₹2,350 / {l('क्विंटल', 'Quintal')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#404942]">{l('अनुमानित कुल मूल्य:', 'Estimated Total Valuation:')}</span>
              <span className="font-extrabold text-2xl text-[#1e1b16] tabular-nums">
                ₹{(2350 * quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={handleCompleteListing}
            className="w-full h-14 bg-[#004526] text-white rounded-xl font-['Noto_Sans'] font-extrabold text-base flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            <span>{l('मंडी में लाइव लिस्ट करें (Publish Listing)', 'Publish Listing to Mandi Exchange')}</span>
          </button>
        </section>
      )}

      {/* Grade Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#fff8f1] rounded-2xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#004526]/20">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8e2d8] mb-3">
              <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                {l('गुणवत्ता ग्रेड मानक (Grading Guide)', 'Quality Grading Standards Guide')}
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942]"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#1e1b16]">
              <div className="p-2.5 bg-white rounded-lg border border-[#aef2c2]">
                <strong className="text-[#004526] block">
                  {l('ग्रेड A (प्रीमियम):', 'Grade A (Superior):')}
                </strong>
                {l(
                  'नमी 12% से कम, साफ और चमकदार दाना, कोई कंकड़ या धूल नहीं। सबसे अधिक भाव मिलता है।',
                  'Moisture < 12%, clean and lustrous grain, zero chaff or stones. Commands peak mandi price.'
                )}
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e8e2d8]">
                <strong className="text-[#7f5700] block">
                  {l('ग्रेड B (मानक):', 'Grade B (Standard):')}
                </strong>
                {l(
                  'सामान्य मंडी मिश्रण, नमी 12-14%, मामूली धूल। सामान्य बोली दर।',
                  'Standard mandi mix, 12-14% moisture, mild dust. Standard bidding rate.'
                )}
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-[#e8e2d8]">
                <strong className="text-[#404942] block">
                  {l('ग्रेड C (औसत):', 'Grade C (Fair):')}
                </strong>
                {l(
                  'अधिक नमी या मिश्रित आकार, धूप में सुखाने या सफाई की आवश्यकता।',
                  'Higher moisture or mixed sizing, requires additional drying or mechanical cleaning.'
                )}
              </div>
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full py-2.5 bg-[#004526] text-white rounded-xl text-xs font-bold"
              type="button"
            >
              {l('समझ गया (Got it)', 'Got It')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
