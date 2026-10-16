import React, { useState, useEffect } from 'react';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface VoiceAssistantModalProps {
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  onClose,
  onNavigateTab
}) => {
  const { language, l } = useLanguage();
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState(
    language === 'en'
      ? 'Listening... Speak your query...'
      : 'सुन रहा हूँ... बोलिए (Listening...)'
  );
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    // Initial audio prompt
    const initialText =
      language === 'en'
        ? 'Hello Anjali Devi, how can I assist you today? Ask about wheat prices, crop insurance, or weather.'
        : 'नमस्ते अंजली जी, आप क्या जानना चाहती हैं? गेहूं का भाव, बीमा दावा या मौसम?';
    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    speakText(initialText, voiceLang);
  }, [language]);

  const handleQuery = (queryText: string) => {
    setIsListening(false);
    setTranscript(queryText);

    let reply = '';
    const q = queryText.toLowerCase();

    if (language === 'en') {
      if (q.includes('wheat') || q.includes('price') || q.includes('rate') || q.includes('गेहूं')) {
        reply = 'Today in Khandwa Mandi, Lokwan Grade-A wheat is trading at 2,350 rupees per quintal, up 45 rupees from yesterday.';
      } else if (q.includes('claim') || q.includes('insur') || q.includes('damage') || q.includes('बीमा')) {
        reply = 'Your wheat insurance policy is active. You can claim up to 63,000 rupees for excess rain loss in the Insurance tab with 3 photos.';
      } else if (q.includes('weather') || q.includes('rain') || q.includes('मौसम')) {
        reply = 'Khandwa will have partly cloudy skies with a 45% chance of light evening showers today. Tomorrow expect light rain.';
      } else if (q.includes('wallet') || q.includes('balance') || q.includes('money') || q.includes('खाता')) {
        reply = 'Your KisanSetu wallet balance is 48,250 rupees, and 15,600 rupees are safely held in escrow.';
      } else {
        reply = 'In Khandwa mandi today: Soybean is 4,850 rupees, Mustard is 5,420 rupees, and Tomato is 38 rupees per kg.';
      }
    } else {
      if (q.includes('गेहूं') || q.includes('भाव')) {
        reply = 'आज खंडवा मंडी में लोकवन ग्रेड-ए गेहूं का भाव दो हज़ार तीन सौ पचास रुपये प्रति क्विंटल है, जो कल से पैंतालीस रुपये ज्यादा है।';
      } else if (q.includes('बीमा') || q.includes('नुकसान')) {
        reply = 'आपकी फसल बीमा पॉलिसी सक्रिय है। अतिवृष्टि नुकसान के लिए आप बीमा दावा टैब से तीन फोटो लेकर तुरंत 63,000 रुपये का दावा दर्ज कर सकती हैं।';
      } else if (q.includes('मौसम') || q.includes('बारिश')) {
        reply = 'खंडवा जिले में अगले दो दिन बादल छाए रहेंगे और हल्की से मध्यम बारिश की संभावना है। पकी फसल को तिरपाल से ढक कर रखें।';
      } else if (q.includes('खाता') || q.includes('पैसे')) {
        reply = 'आपके किसान सेतु खाते में 48,250 रुपये उपलब्ध हैं और एस्क्रो में 15,600 रुपये सुरक्षित हैं।';
      } else {
        reply = 'आज मंडी में सोयाबीन 4,850 रुपये, सरसों 5,420 रुपये और टमाटर 38 रुपये किलो बिक रहा है।';
      }
    }

    setResponse(reply);
    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    speakText(reply, voiceLang);
  };

  const restartMic = () => {
    stopSpeech();
    setResponse(null);
    setTranscript(
      language === 'en'
        ? 'Listening... Speak your query...'
        : 'सुन रहा हूँ... बोलिए (Listening...)'
    );
    setIsListening(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl border-t-2 sm:border-2 border-[#feb316]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d8]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </div>
            <div>
              <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                {l('किसान वॉयस मित्र (AI Voice)', 'Kisan Voice Assistant')}
              </h3>
              <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                {l('अपनी भाषा में पूछें (Speak in Hindi / English)', 'Ask questions in your preferred language')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] hover:bg-[#eee7de] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Center Mic Animation */}
        <div className="py-6 flex flex-col items-center justify-center">
          <button
            onClick={restartMic}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-[#feb316] text-[#6a4800] ring-8 ring-[#feb316]/30 animate-pulse'
                : 'bg-[#1b5e3a] text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-4xl font-extrabold" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isListening ? 'mic' : 'volume_up'}
            </span>
          </button>

          {/* Voice Wave Visualizer */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-1.5 h-6 bg-[#feb316] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-10 bg-[#feb316] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-8 bg-[#feb316] rounded-full animate-bounce [animation-delay:-0.4s]" />
              <span className="w-1.5 h-12 bg-[#004526] rounded-full animate-bounce" />
              <span className="w-1.5 h-7 bg-[#feb316] rounded-full animate-bounce [animation-delay:-0.2s]" />
              <span className="w-1.5 h-4 bg-[#feb316] rounded-full animate-bounce [animation-delay:-0.35s]" />
            </div>
          )}

          <p className="mt-4 font-['Noto_Sans'] text-sm font-bold text-[#1e1b16] text-center px-4">
            {transcript}
          </p>

          {response && (
            <div className="mt-4 p-4 bg-[#faf3e9] border border-[#c0c9bf]/60 rounded-xl text-left text-sm text-[#1e1b16] leading-relaxed w-full">
              <div className="flex items-center gap-1 text-xs font-bold text-[#004526] mb-1">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
                <span>{l('किसान सेतु उत्तर (KisanSetu Answer):', 'KisanSetu Response:')}</span>
              </div>
              <p className="font-['Noto_Sans']">{response}</p>
            </div>
          )}
        </div>

        {/* Suggested Quick Tap Queries */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#404942]">{l('त्वरित प्रश्न (Quick Questions):', 'Suggested Queries:')}</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuery(language === 'en' ? 'What is today\'s wheat mandi rate?' : 'गेहूं का आज का भाव क्या है?')}
              className="px-3 py-2 text-left bg-white border border-[#c0c9bf] hover:border-[#004526] rounded-xl text-xs font-bold text-[#1e1b16] flex items-center justify-between active:scale-98 transition-transform cursor-pointer"
              type="button"
            >
              <span>🌾 {l('गेहूं का आज का भाव क्या है?', 'What is today\'s wheat rate?')}</span>
              <span className="material-symbols-outlined text-sm text-[#004526]">chevron_right</span>
            </button>
            <button
              onClick={() => handleQuery(language === 'en' ? 'How do I claim crop damage insurance?' : 'फसल नुकसान का दावा कैसे करें?')}
              className="px-3 py-2 text-left bg-white border border-[#c0c9bf] hover:border-[#004526] rounded-xl text-xs font-bold text-[#1e1b16] flex items-center justify-between active:scale-98 transition-transform cursor-pointer"
              type="button"
            >
              <span>🛡️ {l('फसल नुकसान का दावा कैसे करें?', 'How to claim crop loss insurance?')}</span>
              <span className="material-symbols-outlined text-sm text-[#004526]">chevron_right</span>
            </button>
            <button
              onClick={() => handleQuery(language === 'en' ? 'What is the weather forecast for Khandwa?' : 'खंडवा में बारिश का क्या मौसम रहेगा?')}
              className="px-3 py-2 text-left bg-white border border-[#c0c9bf] hover:border-[#004526] rounded-xl text-xs font-bold text-[#1e1b16] flex items-center justify-between active:scale-98 transition-transform cursor-pointer"
              type="button"
            >
              <span>🌧️ {l('खंडवा में बारिश का क्या मौसम रहेगा?', 'What is the weather forecast for Khandwa?')}</span>
              <span className="material-symbols-outlined text-sm text-[#004526]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
