import React, { useState } from 'react';
import { TabType } from '../types';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface LearnScreenProps {
  onNavigateTab: (tab: TabType) => void;
}

interface DiseaseDiagnosis {
  id: string;
  nameHi: string;
  nameEn: string;
  cropHi: string;
  cropEn: string;
  symptomsHi: string;
  symptomsEn: string;
  organicCureHi: string;
  organicCureEn: string;
  chemicalCureHi: string;
  chemicalCureEn: string;
  dosageHi: string;
  dosageEn: string;
  confidence: number;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({ onNavigateTab }) => {
  const { language, l } = useLanguage();

  const [isPlayingWeather, setIsPlayingWeather] = useState(false);
  const [doctorActive, setDoctorActive] = useState(false);
  const [diagnosedDisease, setDiagnosedDisease] = useState<DiseaseDiagnosis | null>(null);
  const [selectedDiseaseKey, setSelectedDiseaseKey] = useState<string>('stem_borer');

  // Fertilizer calculator state
  const [landAcres, setLandAcres] = useState<number>(3);
  const [selectedCalcCrop, setSelectedCalcCrop] = useState<'wheat' | 'gram' | 'mustard'>('wheat');

  const diseaseDatabase: Record<string, DiseaseDiagnosis> = {
    stem_borer: {
      id: 'stem_borer',
      nameHi: 'तना छेदक कीट (Stem Borer)',
      nameEn: 'Stem Borer Infestation (Sesamia inferens)',
      cropHi: 'गेहूं व मक्का (Wheat & Maize)',
      cropEn: 'Wheat & Maize',
      symptomsHi: 'तने के निचले भाग में बारीक छिद्र, पौधे का पीला पड़ना और बालियों का सूखना।',
      symptomsEn: 'Boreholes near base of stems, drying of central shoot (dead heart), white ears.',
      organicCureHi: '5% नीम बीज अर्क (Neem Seed Kernel Extract) या नीम तेल 5 मिली प्रति लीटर पानी।',
      organicCureEn: '5% Neem Seed Kernel Extract (NSKE) or Neem oil 5ml per litre of water.',
      chemicalCureHi: 'क्लोरेंट्रानिलिप्रोल 18.5% SC @ 60 मिली प्रति एकड़ 200 लीटर पानी में।',
      chemicalCureEn: 'Chlorantraniliprole 18.5% SC @ 60 ml per acre in 200 litres of water.',
      dosageHi: 'शाम के समय छिड़काव करें, जब धूप कम हो।',
      dosageEn: 'Foliar spray during late evening when sunlight is gentle.',
      confidence: 94
    },
    yellow_rust: {
      id: 'yellow_rust',
      nameHi: 'पीला रतुआ (Yellow Rust / Stripe Rust)',
      nameEn: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
      cropHi: 'गेहूं (Wheat)',
      cropEn: 'Wheat',
      symptomsHi: 'पत्तियों पर पीले रंग की धारियों के रूप में चूर्णनुमा फफूंद पाउडर।',
      symptomsEn: 'Yellow powdery pustules forming linear stripes along leaf veins.',
      organicCureHi: 'ट्राइकोडर्मा विरिडी 5 ग्राम प्रति लीटर पानी का छिड़काव।',
      organicCureEn: 'Trichoderma viride 5g per litre spray + cow urine extract solution.',
      chemicalCureHi: 'प्रोपिकोनाजोल 25% EC (टिल्ट) @ 200 मिली प्रति एकड़।',
      chemicalCureEn: 'Propiconazole 25% EC @ 200 ml per acre in 200 litres of water.',
      dosageHi: 'लक्षण दिखते ही 15 दिन के अंतराल पर 2 बार छिड़काव करें।',
      dosageEn: 'Apply at first onset of pustules, repeat after 15 days if necessary.',
      confidence: 96
    },
    wilt: {
      id: 'wilt',
      nameHi: 'उकठा रोग (Fusarium Wilt)',
      nameEn: 'Fusarium Wilt (Fusarium oxysporum)',
      cropHi: 'चना व दलहन (Gram / Pulses)',
      cropEn: 'Bengal Gram & Pulses',
      symptomsHi: 'पौधे की पत्तियां ऊपर से नीचे की ओर सूखने लगती हैं और जड़ काली पड़ जाती है।',
      symptomsEn: 'Drooping of petioles, sudden yellowing and vascular browning inside roots.',
      organicCureHi: 'बुवाई से पहले ट्राइकोडर्मा हरजिएनम से बीज व मृदा उपचार।',
      organicCureEn: 'Seed & soil treatment with Trichoderma harzianum @ 10g/kg seed.',
      chemicalCureHi: 'कार्बेन्डाजिम 12% + मैंकोजेब 63% WP @ 2 ग्राम प्रति किग्रा बीज उपचार।',
      chemicalCureEn: 'Carbendazim 12% + Mancozeb 63% WP @ 2g per kg seed treatment.',
      dosageHi: 'खेत में पानी का भराव न होने दें, उचित जल निकासी रखें।',
      dosageEn: 'Ensure proper drainage; avoid excessive stagnant moisture in root zones.',
      confidence: 91
    }
  };

  const handleAudioWeather = () => {
    if (isPlayingWeather) {
      stopSpeech();
      setIsPlayingWeather(false);
      return;
    }

    const text =
      language === 'en'
        ? 'KisanSetu Weather and Agronomy Advisory. Khandwa district today is 31 degrees Celsius, winds at 14 km/h with 45 percent chance of light evening showers. Farmers are advised to inspect fields before irrigation and keep harvested rabi produce securely covered.'
        : 'किसान सेतु मौसम व कृषि बुलेटिन। खंडवा जिले में आज तापमान इकतीस डिग्री सेल्सियस, हवा चौदह किलोमीटर प्रति घंटा और शाम को हल्की बूंदाबांदी की संभावना है। किसान भाइयों को सलाह दी जाती है कि गेहूं की सिंचाई से पहले मौसम का आकलन करें और कटी फसल तिरपाल से ढक कर रखें।';

    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    setIsPlayingWeather(true);
    speakText(text, voiceLang, () => {
      setIsPlayingWeather(false);
    });
  };

  const handleSimulateDoctor = () => {
    setDoctorActive(true);
    setTimeout(() => {
      const selected = diseaseDatabase[selectedDiseaseKey] || diseaseDatabase['stem_borer'];
      setDiagnosedDisease(selected);
      setDoctorActive(false);

      const msg =
        language === 'en'
          ? `Diagnosis complete. Identified condition: ${selected.nameEn}. Recommended organic cure: ${selected.organicCureEn}`
          : `रोग निदान पूर्ण। पहचाना गया रोग: ${selected.nameHi}। जैविक उपचार: ${selected.organicCureHi}`;
      const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
      speakText(msg, voiceLang);
    }, 1800);
  };

  // Fertilizer math
  const ureaBags = (landAcres * 1.5).toFixed(1);
  const dapBags = (landAcres * 1.0).toFixed(1);
  const mopBags = (landAcres * 0.5).toFixed(1);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-7xl mx-auto gap-6">
      {/* Weather Alert Hero Banner */}
      <section className="bg-[#1b5e3a] text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden border border-[#004526]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-[#feb316]">
                partly_cloudy_day
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Noto_Sans'] font-extrabold text-xl sm:text-2xl text-white">
                  {l('मौसम व कृषि परामर्श', 'Weather & Agro-Meteorology')}
                </h1>
                <span className="text-xs font-bold bg-[#feb316] text-[#6a4800] px-2.5 py-0.5 rounded-full">
                  {l('खंडवा (Khandwa)', 'Khandwa Station')}
                </span>
              </div>
              <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#aef2c2] mt-0.5">
                {l(
                  'भारतीय मौसम विभाग (IMD) व कृषि विश्वविद्यालय स्वचालित मौसम केंद्र',
                  'India Meteorological Dept (IMD) & Automated Agrometeorological Station'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleAudioWeather}
            aria-label={l('मौसम बुलेटिन सुनें', 'Listen to Weather Bulletin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#004526] text-xs sm:text-sm font-bold active:scale-95 transition-transform shadow-xs self-start md:self-auto cursor-pointer"
            type="button"
          >
            <span
              className="material-symbols-outlined text-xl text-[#feb316]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlayingWeather ? 'pause_circle' : 'volume_up'}
            </span>
            <span>{isPlayingWeather ? l('रोकें', 'Pause') : l('मौसम बुलेटिन सुनें', 'Listen Weather')}</span>
          </button>
        </div>

        {/* 5-Day Forecast Strip on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-white/20 text-center text-xs">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-[#aef2c2] font-bold block">{l('आज (Today)', 'Today')}</span>
            <span className="material-symbols-outlined text-2xl text-[#feb316] my-1">sunny</span>
            <span className="block text-lg font-extrabold tabular-nums">31°C</span>
            <span className="text-[10px] text-[#feb316]">{l('45% बारिश संभावना', '45% Rain Prob')}</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-[#aef2c2] font-bold block">{l('कल (Tomorrow)', 'Tomorrow')}</span>
            <span className="material-symbols-outlined text-2xl text-[#feb316] my-1">rainy</span>
            <span className="block text-lg font-extrabold tabular-nums">29°C</span>
            <span className="text-[10px] text-[#aef2c2]">{l('हल्की वर्षा (4-6mm)', 'Light Rain (4-6mm)')}</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-[#aef2c2] font-bold block">{l('गुरुवार', 'Thursday')}</span>
            <span className="material-symbols-outlined text-2xl text-[#feb316] my-1">
              partly_cloudy_day
            </span>
            <span className="block text-lg font-extrabold tabular-nums">30°C</span>
            <span className="text-[10px] text-[#aef2c2]">{l('धूप खिली रहेगी', 'Clear & Sunny')}</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-[#aef2c2] font-bold block">{l('शुक्रवार', 'Friday')}</span>
            <span className="material-symbols-outlined text-2xl text-[#feb316] my-1">sunny</span>
            <span className="block text-lg font-extrabold tabular-nums">32°C</span>
            <span className="text-[10px] text-[#aef2c2]">{l('सिंचाई अनुकूल', 'Good for Irrigation')}</span>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="text-[11px] text-[#aef2c2] font-bold block">{l('शनिवार', 'Saturday')}</span>
            <span className="material-symbols-outlined text-2xl text-[#feb316] my-1">air</span>
            <span className="block text-lg font-extrabold tabular-nums">31°C</span>
            <span className="text-[10px] text-[#aef2c2]">{l('हवा 16 km/h', 'Winds 16 km/h')}</span>
          </div>
        </div>
      </section>

      {/* 2-Column Responsive Layout */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
        {/* Left Column: AI Crop Doctor & Weekly Agronomy Advisory */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Crop Doctor Diagnostic Workbench */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4ede4]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#feb316]/20 text-[#6a4800] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-3xl">biotech</span>
                </div>
                <div>
                  <h2 className="font-['Noto_Sans'] font-bold text-lg text-[#1e1b16]">
                    {l('एआई फसल डॉक्टर (AI Crop Doctor)', 'AI Crop Doctor Workbench')}
                  </h2>
                  <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                    {l('पत्ती या कीट का फोटो खींचकर तुरंत रोग पहचानें व उपचार पाएं', 'Instant crop disease & pest detection with organic cures')}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#004526] text-white text-xs font-bold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">auto_awesome</span> {l('94% सटीकता', '94% Accuracy')}
              </span>
            </div>

            {/* Disease Diagnostic Selector */}
            <div>
              <label className="block text-xs font-bold text-[#1e1b16] mb-1.5">
                {l('जांच का विषय या नमूना चुनें (Sample Disease Case):', 'Select Diagnostic Sample Case:')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'stem_borer', labelHi: 'गेहूं तना छेदक (Stem Borer)', labelEn: 'Wheat Stem Borer' },
                  { key: 'yellow_rust', labelHi: 'पीला रतुआ (Yellow Rust)', labelEn: 'Yellow / Stripe Rust' },
                  { key: 'wilt', labelHi: 'चना उकठा (Gram Wilt)', labelEn: 'Bengal Gram Wilt' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setSelectedDiseaseKey(item.key);
                      setDiagnosedDisease(null);
                    }}
                    className={`p-2.5 rounded-xl text-left border font-bold transition-all cursor-pointer ${
                      selectedDiseaseKey === item.key
                        ? 'bg-[#004526] text-white border-[#004526]'
                        : 'bg-[#faf3e9] text-[#1e1b16] border-[#e8e2d8] hover:bg-[#eee7de]'
                    }`}
                    type="button"
                  >
                    {language === 'en' ? item.labelEn : item.labelHi}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Display or Trigger Button */}
            {diagnosedDisease ? (
              <div className="p-4 bg-[#faf3e9] rounded-2xl border-2 border-[#004526] space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-[#e8e2d8]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-[#004526]">
                      check_circle
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#004526]">
                        {language === 'en' ? diagnosedDisease.nameEn : diagnosedDisease.nameHi}
                      </h3>
                      <span className="text-xs text-[#404942] font-medium">
                        {language === 'en' ? diagnosedDisease.cropEn : diagnosedDisease.cropHi} · {l('विश्र्वास स्तर:', 'Confidence:')} {diagnosedDisease.confidence}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDiagnosedDisease(null)}
                    className="text-xs text-[#004526] font-bold underline cursor-pointer"
                    type="button"
                  >
                    {l('नया फोटो लें', 'Scan Another')}
                  </button>
                </div>

                <div className="space-y-2 text-xs text-[#1e1b16]">
                  <div className="bg-white p-3 rounded-xl border border-[#e8e2d8]">
                    <strong className="text-[#1e1b16] block text-xs mb-0.5">
                      {l('लक्षण (Symptoms):', 'Symptoms:')}
                    </strong>
                    <p className="text-[#404942]">
                      {language === 'en' ? diagnosedDisease.symptomsEn : diagnosedDisease.symptomsHi}
                    </p>
                  </div>

                  <div className="bg-[#aef2c2]/30 p-3 rounded-xl border border-[#004526]/30">
                    <strong className="text-[#004526] block text-xs mb-0.5">
                      {l('जैविक उपचार (Organic Control - सुरक्षित):', 'Organic & Biological Treatment (Safe):')}
                    </strong>
                    <p className="text-[#00210f] font-medium">
                      {language === 'en' ? diagnosedDisease.organicCureEn : diagnosedDisease.organicCureHi}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e8e2d8]">
                    <strong className="text-[#7f5700] block text-xs mb-0.5">
                      {l('रासायनिक विकल्प (Chemical Treatment):', 'Chemical Option:')}
                    </strong>
                    <p className="text-[#404942]">
                      {language === 'en' ? diagnosedDisease.chemicalCureEn : diagnosedDisease.chemicalCureHi}
                    </p>
                    <span className="text-[11px] text-[#707971] block mt-1">
                      {l('दिशा-निर्देश:', 'Application Dosage:')} {language === 'en' ? diagnosedDisease.dosageEn : diagnosedDisease.dosageHi}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSimulateDoctor}
                disabled={doctorActive}
                className="w-full h-14 min-h-[56px] rounded-xl bg-[#004526] text-white font-['Noto_Sans'] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-transform hover:bg-[#1b5e3a] cursor-pointer"
                type="button"
              >
                {doctorActive ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                    <span>{l('AI विश्लेषण व पादप रोग पहचान जारी है...', 'AI analyzing crop foliage & identifying pathogen...')}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl font-bold">
                      photo_camera
                    </span>
                    <span>{l('बीमार पौधे का फोटो स्कैन करें (Diagnose Now)', 'Scan Crop Leaf Photo (Diagnose Now)')}</span>
                  </>
                )}
              </button>
            )}
          </section>

          {/* Weekly Agronomy Advisory */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8] space-y-4">
            <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#004526]">menu_book</span>
              <span>{l('रबी मौसम महत्वपूर्ण कृषि सलाह (Weekly Advisory)', 'Seasonal Rabi Agronomy Advisory')}</span>
            </h3>

            <div className="space-y-3 text-xs text-[#1e1b16]">
              <div className="p-4 bg-[#faf3e9] rounded-xl border border-[#e8e2d8] space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-[#004526] text-sm">
                    {l('गेहूं (Wheat) सिंचाई व खाद:', 'Wheat Irrigation & Nutrition:')}
                  </strong>
                  <span className="text-[11px] bg-[#004526]/10 text-[#004526] px-2 py-0.5 rounded font-bold">
                    {l('CRI चरण (21 दिन)', 'CRI Stage (21 Days)')}
                  </span>
                </div>
                <p className="text-[#404942] leading-relaxed">
                  {l(
                    'प्रथम सिंचाई मुकुट जड़ (Crown Root Initiation) के समय 20-25 दिन में अवश्य करें। इसके बाद यूरिया की आधी मात्रा (टॉप ड्रेसिंग) दें।',
                    'First irrigation at Crown Root Initiation stage (20-25 days after sowing) is essential for tillering, followed by urea top-dressing.'
                  )}
                </p>
              </div>

              <div className="p-4 bg-[#faf3e9] rounded-xl border border-[#e8e2d8] space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-[#7f5700] text-sm">
                    {l('चना व सरसों खरपतवार नियंत्रण:', 'Gram & Mustard Weed/Pest Management:')}
                  </strong>
                  <span className="text-[11px] bg-[#feb316]/30 text-[#6a4800] px-2 py-0.5 rounded font-bold">
                    {l('निराई-गुड़ाई', 'Weeding & Trap')}
                  </span>
                </div>
                <p className="text-[#404942] leading-relaxed">
                  {l(
                    'चने में फूल आने से पहले पहली हल्की निराई अवश्य करें। सरसों में एफिड (माहू) कीट के लिए पीला चिपचिपा ट्रैप (Yellow Sticky Trap) 8 प्रति एकड़ लगाएं।',
                    'Perform interculturing before flower initiation in gram. Set up 8 yellow sticky traps per acre for mustard aphid monitoring.'
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Soil Fertilizer Dosage Calculator */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#e8e2d8] space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-[#004526]">calculate</span>
              <div>
                <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                  {l('खाद व उर्वरक कैलकुलेटर (NPK Fertilizer Calculator)', 'NPK Fertilizer Dose Calculator')}
                </h3>
                <p className="text-xs text-[#404942]">{l('जमीन के अनुसार सही मात्रा जानें', 'Calculate accurate bags according to field area')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#1e1b16] mb-1">{l('फसल चुनें:', 'Select Crop:')}</label>
                <div className="flex gap-1.5">
                  {(['wheat', 'gram', 'mustard'] as const).map(crop => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCalcCrop(crop)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        selectedCalcCrop === crop
                          ? 'bg-[#004526] text-white'
                          : 'bg-[#faf3e9] text-[#404942] hover:bg-[#eee7de]'
                      }`}
                      type="button"
                    >
                      {crop === 'wheat'
                        ? l('गेहूं', 'Wheat')
                        : crop === 'gram'
                        ? l('चना', 'Gram')
                        : l('सरसों', 'Mustard')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1e1b16] mb-1">
                  {l('खेत का रकबा (Acres):', 'Land Holding (Acres):')}{' '}
                  <strong className="text-[#004526]">{landAcres} {l('एकड़', 'Acres')}</strong>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLandAcres(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-[#eee7de] font-bold text-lg cursor-pointer"
                    type="button"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={landAcres}
                    onChange={e => setLandAcres(parseInt(e.target.value, 10) || 1)}
                    className="flex-1 h-10 text-center font-bold text-base bg-[#faf3e9] rounded-xl border border-[#e8e2d8]"
                  />
                  <button
                    onClick={() => setLandAcres(prev => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-[#004526] text-white font-bold text-lg cursor-pointer"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
              <div className="bg-[#faf3e9] p-3 rounded-xl border border-[#e8e2d8]">
                <span className="text-[#404942] block">{l('यूरिया (Urea)', 'Urea (46% N)')}</span>
                <span className="font-bold text-lg text-[#004526] tabular-nums mt-0.5 block">
                  {ureaBags} {l('बोरी', 'Bags')}
                </span>
                <span className="text-[10px] text-[#707971]">50 {l('किग्रा / बोरी', 'kg / bag')}</span>
              </div>
              <div className="bg-[#faf3e9] p-3 rounded-xl border border-[#e8e2d8]">
                <span className="text-[#404942] block">{l('डी.ए.पी. (DAP)', 'DAP (18:46:0)')}</span>
                <span className="font-bold text-lg text-[#004526] tabular-nums mt-0.5 block">
                  {dapBags} {l('बोरी', 'Bags')}
                </span>
                <span className="text-[10px] text-[#707971]">{l('बुवाई के समय', 'Basal at Sowing')}</span>
              </div>
              <div className="bg-[#faf3e9] p-3 rounded-xl border border-[#e8e2d8]">
                <span className="text-[#404942] block">{l('पोटाश (MOP)', 'MOP (60% K₂O)')}</span>
                <span className="font-bold text-lg text-[#004526] tabular-nums mt-0.5 block">
                  {mopBags} {l('बोरी', 'Bags')}
                </span>
                <span className="text-[10px] text-[#707971]">{l('दाने की चमक', 'Grain Plumpness')}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Government Schemes & Scientific Helplines */}
        <div className="lg:col-span-5 space-y-5">
          {/* Government Schemes Directory */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#f4ede4]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#004526]">account_balance</span>
                <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                  {l('सरकारी योजनाएं व सब्सिडी (Govt Schemes)', 'Government Schemes & Subsidies')}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Scheme 1: PM Kisan */}
              <div className="p-3.5 bg-[#faf3e9] rounded-xl border border-[#e8e2d8] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#004526]">
                    {l('पीएम-किसान सम्मान निधि (PM-Kisan)', 'PM-Kisan Samman Nidhi')}
                  </span>
                  <span className="bg-[#aef2c2] text-[#00210f] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {l('सक्रिय', 'Active')}
                  </span>
                </div>
                <p className="text-[#404942]">
                  {l(
                    'प्रति वर्ष ₹6,000 की वित्तीय सहायता (3 किस्तों में)। अगली 19वीं किस्त प्रक्रियाधीन है।',
                    '₹6,000 annual direct DBT support in 3 equal installments. Next 19th installment under processing.'
                  )}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#004526] font-bold">{l('स्थिति: ई-केवाईसी पूर्ण ✓', 'Status: e-KYC Complete ✓')}</span>
                  <span className="text-[#707971]">{l('खाता: SBI 4892', 'A/C: SBI 4892')}</span>
                </div>
              </div>

              {/* Scheme 2: PMFBY */}
              <div className="p-3.5 bg-[#faf3e9] rounded-xl border border-[#e8e2d8] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#004526]">
                    {l('प्रधानमंत्री फसल बीमा योजना (PMFBY)', 'PM Crop Insurance (PMFBY)')}
                  </span>
                  <button
                    onClick={() => onNavigateTab('insure')}
                    className="text-xs text-[#004526] font-bold underline cursor-pointer"
                    type="button"
                  >
                    {l('दावा करें', 'Claim Loss')}
                  </button>
                </div>
                <p className="text-[#404942]">
                  {l(
                    'रबी 2026 गेहूं व चना फसल बीमा प्रीमियम केवल 1.5% दर पर उपलब्ध।',
                    'Comprehensive yield and post-harvest risk insurance at just 1.5% farmer premium.'
                  )}
                </p>
              </div>

              {/* Scheme 3: Kusum Yojana */}
              <div className="p-3.5 bg-[#faf3e9] rounded-xl border border-[#e8e2d8] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#7f5700]">
                    {l('पीएम कुसुम सोलर पंप योजना (Solar Pump)', 'PM-KUSUM Solar Agri Pump')}
                  </span>
                  <span className="bg-[#feb316]/30 text-[#6a4800] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {l('60% सब्सिडी', '60% Subsidy')}
                  </span>
                </div>
                <p className="text-[#404942]">
                  {l(
                    'खेत में 3 HP व 5 HP सोलर वाटर पंप स्थापना हेतु आवेदन खुले हैं।',
                    'Direct capital subsidy for installing 3 HP & 5 HP standalone solar irrigation pumps.'
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* KVK Agricultural Scientist Directory */}
          <div className="rounded-2xl bg-[#ffdead]/40 p-5 border border-[#feb316]/40 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-3xl font-bold">school</span>
              </div>
              <div>
                <h4 className="font-['Noto_Sans'] font-bold text-base text-[#281900]">
                  {l('कृषि विज्ञान केंद्र (KVK) विशेषज्ञ', 'Krishi Vigyan Kendra (KVK) Experts')}
                </h4>
                <p className="text-xs text-[#604100]">
                  {l('कृषि वैज्ञानिक, खंडवा (ICAR - KVK Khandwa)', 'ICAR - KVK Khandwa Agrometeorology Unit')}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#604100] leading-relaxed">
              {l(
                'मिट्टी परीक्षण, बीज चयन, व कीट नियंत्रण पर कृषि वैज्ञानिकों से सीधी बातचीत करें।',
                'Consult senior agronomists directly regarding soil testing, seed certification, and integrated pest management.'
              )}
            </p>

            <div className="flex gap-2 pt-1">
              <a
                href="tel:18001801551"
                className="flex-1 h-12 bg-[#004526] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-xs active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span>{l('कॉल करें (टोल फ्री)', 'Call Helpline (Toll Free)')}</span>
              </a>
              <button
                onClick={() => {
                  const msg =
                    language === 'en'
                      ? 'Krishi Vigyan Kendra Khandwa Scientific Advisory Helpline is open Monday to Saturday, 10 AM to 5 PM.'
                      : 'कृषि विज्ञान केंद्र खंडवा वैज्ञानिक परामर्श हेल्पलाइन। सोमवार से शनिवार सुबह 10 से शाम 5 बजे तक खुली रहती है।';
                  const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
                  speakText(msg, voiceLang);
                }}
                className="px-4 h-12 bg-white text-[#004526] rounded-xl flex items-center justify-center border border-[#feb316] text-xs font-bold cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </button>
            </div>
          </div>

          {/* Sowing Season Quick Tips */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d8] space-y-2 text-xs">
            <span className="font-bold text-[#004526] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">eco</span>
              <span>{l('किसान सेतु दैनिक कृषि सूत्र:', 'KisanSetu Daily Agronomy Wisdom:')}</span>
            </span>
            <p className="text-[#404942] italic leading-relaxed">
              {l(
                '"बीज उपचार किए बिना कभी बुवाई न करें; 2 ग्राम ट्राइकोडर्मा या थीरम फसल को 70% फफूंद रोगों से सुरक्षित रखता है।\"',
                '"Never sow without seed treatment; treating seeds with 2g Trichoderma or Thiram protects seedlings against 70% of soil-borne fungal pathogens."'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
