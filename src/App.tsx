/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, Language, UserListing } from './types';
import { USER_LISTINGS } from './data/mockData';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SellScreen } from './screens/SellScreen';
import { WalletScreen } from './screens/WalletScreen';
import { InsureScreen } from './screens/InsureScreen';
import { MarketScreen } from './screens/MarketScreen';
import { LearnScreen } from './screens/LearnScreen';
import { BidsModal } from './components/BidsModal';
import { WithdrawModal } from './components/WithdrawModal';
import { KycModal } from './components/KycModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const { language, setLanguage, toggleLanguage, l } = useLanguage();
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [availableBalance, setAvailableBalance] = useState<number>(48250);
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);

  // Active modals
  const [activeBidsListing, setActiveBidsListing] = useState<UserListing | null>(null);
  const [showWithdraw, setShowWithdraw] = useState<boolean>(false);
  const [showKyc, setShowKyc] = useState<boolean>(false);
  const [showVoice, setShowVoice] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const [connectionToast, setConnectionToast] = useState<string | null>(null);

  // Auto-detect browser network connectivity
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setConnectionToast(
        language === 'en'
          ? '✓ Internet reconnected: All data synced with server'
          : '✓ इंटरनेट पुनः कनेक्ट हुआ: सभी डेटा सर्वर के साथ सिंक हो गया'
      );
      setTimeout(() => setConnectionToast(null), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setConnectionToast(
        language === 'en'
          ? '⚠️ Offline Mode: Don\'t worry, all your data is safe on your phone'
          : '⚠️ ऑफलाइन मोड: चिंता न करें, आपका सारा डेटा फोन में सुरक्षित है'
      );
      setTimeout(() => setConnectionToast(null), 3500);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      if (!navigator.onLine) {
        setIsOffline(true);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  const handleToggleOffline = () => {
    setIsOffline(prev => {
      const next = !prev;
      setConnectionToast(
        next
          ? (language === 'en'
              ? '⚠️ Offline mode active: 3 drafts safely cached locally'
              : '⚠️ ऑफलाइन मोड सक्रिय: 3 प्रविष्टियां स्थानीय रूप से सुरक्षित (Cached)')
          : (language === 'en'
              ? '✓ Online mode active: Local data safely synced to server'
              : '✓ ऑनलाइन मोड सक्रिय: स्थानीय डेटा सुरक्षित रूप से सिंक हो गया')
      );
      setTimeout(() => setConnectionToast(null), 3500);
      return next;
    });
  };

  const handleAcceptBid = (bidId: string, amount: number, trader: string) => {
    setActiveBidsListing(null);
  };

  const handleWithdrawSuccess = (amount: number, method: string) => {
    setAvailableBalance(prev => Math.max(0, prev - amount));
    setShowWithdraw(false);
  };

  const handleKycVerified = () => {
    setIsKycVerified(true);
    setShowKyc(false);
  };

  const [selectedCropForSell, setSelectedCropForSell] = useState<string | undefined>(undefined);

  return (
    <div className="bg-[#fff8f1] min-h-screen text-[#1e1b16] font-['Noto_Sans',sans-serif] flex flex-col antialiased selection:bg-[#feb316]/30">
      {/* Fixed Sticky Header */}
      <TopHeader
        currentTab={currentTab}
        language={language}
        onToggleLanguage={toggleLanguage}
        onSelectLanguage={setLanguage}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenProfile={() => setShowProfile(true)}
        onNavigate={(tab) => setCurrentTab(tab)}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        showBack={currentTab === 'insure'}
        onBack={() => setCurrentTab('home')}
        pageTitle={currentTab === 'insure' ? l('फसल नुकसान का दावा', 'Claim Crop Damage') : undefined}
      />


      {/* Real-time Connection Change Alert Toast */}
      {connectionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-28 inset-x-4 z-40 max-w-md mx-auto"
        >
          <div className="bg-[#1e1b16] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isOffline ? 'bg-[#feb316] animate-ping' : 'bg-[#aef2c2]'
                }`}
              />
              <span className="font-['Noto_Sans'] text-xs font-bold leading-tight truncate">
                {connectionToast}
              </span>
            </div>
            <button
              onClick={() => setConnectionToast(null)}
              className="text-white/70 hover:text-white text-xs font-bold shrink-0 ml-1"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-28 md:pt-32 bg-[#fff8f1]">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenKyc={() => setShowKyc(true)}
            onOpenBids={(listing) => setActiveBidsListing(listing)}
            onOpenVoice={() => setShowVoice(true)}
            isKycVerified={isKycVerified}
          />
        )}

        {currentTab === 'sell' && (
          <SellScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
            initialCropId={selectedCropForSell}
          />
        )}

        {currentTab === 'wallet' && (
          <WalletScreen
            onOpenWithdraw={() => setShowWithdraw(true)}
            availableBalance={availableBalance}
          />
        )}

        {currentTab === 'insure' && (
          <InsureScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'market' && (
          <MarketScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onSelectCropToSell={(cropId) => {
              setSelectedCropForSell(cropId);
              setCurrentTab('sell');
            }}
          />
        )}

        {currentTab === 'learn' && (
          <LearnScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* Clean Desktop Grounding Footer (hidden on mobile, visible md+) */}
      <footer className="hidden md:block bg-[#f4ede4] border-t border-[#e8e2d8] mt-auto py-10 text-[#404942]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#e8e2d8]/80">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-['Noto_Sans'] font-extrabold text-xl text-[#004526]">
                  KisanSetu
                </span>
                <span className="text-xs bg-[#aef2c2] text-[#00210f] px-2 py-0.5 rounded-full font-bold">
                  किसान सेतु
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#707971]">
                {l(
                  'भारतीय किसानों का सशक्त डिजिटल सेतु — पारदर्शी उपज नीलामी, ई-नाम मंडी दरें, तुरंत फसल बीमा व प्रत्यक्ष बैंक भुगतान।',
                  'Empowering Indian farmers with transparent crop auctions, e-NAM mandi prices, instant crop insurance, and direct DBT bank payouts.'
                )}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#004526]">
                <span className="material-symbols-outlined text-sm">offline_pin</span>
                <span>{l('100% ऑफलाइन कार्यक्षम (Offline-First)', '100% Offline-First Architecture')}</span>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1e1b16]">
                {l('मुख्य अनुभाग (Navigation)', 'Quick Navigation')}
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setCurrentTab('home')} className="hover:text-[#004526] transition-colors cursor-pointer" type="button">
                    {l('मुख्य डैशबोर्ड (Home)', 'Home Dashboard')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('market')} className="hover:text-[#004526] transition-colors cursor-pointer" type="button">
                    {l('लाइव मंडी भाव (Live Mandi Rates)', 'Live Mandi Prices')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('sell')} className="hover:text-[#004526] transition-colors cursor-pointer" type="button">
                    {l('फसल बेचें (Sell Produce)', 'Sell Produce')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('wallet')} className="hover:text-[#004526] transition-colors cursor-pointer" type="button">
                    {l('किसान खाता व पासबुक (Wallet)', 'Farmer Wallet & Passbook')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('insure')} className="hover:text-[#004526] transition-colors cursor-pointer" type="button">
                    {l('फसल नुकसान दावा (Crop Insurance)', 'Crop Damage Insurance Claim')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('learn')} className="hover:text-[#004526] transition-colors cursor-pointer" type="button">
                    {l('कृषि सलाह व AI डॉक्टर (Advisory)', 'AI Agronomy Advisory & Weather')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Trust & Security */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1e1b16]">
                {l('सुरक्षा व प्रमाणन (Trust & Security)', 'Trust & Security Standards')}
              </h4>
              <ul className="space-y-2 text-xs text-[#707971]">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#004526]">verified</span>
                  <span>{l('NPCI व RBI अधिकृत DBT भुगतान गेटवे', 'NPCI & RBI Authorized DBT Payment Gateway')}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#004526]">verified</span>
                  <span>{l('PMFBY दिशानिर्देशों के अनुरूप उपग्रह क्षति आकलन', 'Satellite Damage Assessment per PMFBY Guidelines')}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#004526]">verified</span>
                  <span>{l('256-बिट बैंक स्तरीय डेटा एन्क्रिप्शन', '256-Bit Bank-Grade Data Encryption')}</span>
                </li>
              </ul>
            </div>

            {/* Helpline & Support */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#1e1b16]">
                {l('किसान सहायता (24x7 Helpline)', 'Farmer Support (24x7 Helpline)')}
              </h4>
              <div className="p-3 bg-white rounded-xl border border-[#e8e2d8] space-y-1">
                <span className="text-[11px] text-[#707971] block">{l('टोल-फ्री किसान कॉल सेंटर:', 'Toll-Free Kisan Call Centre:')}</span>
                <a href="tel:18001801551" className="text-base font-extrabold text-[#004526] hover:underline block font-mono">
                  1800-180-1551
                </a>
                <span className="text-[10px] text-[#004526] font-bold block">
                  {l('सभी भारतीय भाषाओं में निःशुल्क सेवा', 'Toll-Free Assistance in All Indian Languages')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#707971]">
            <p>{l('© 2026 KisanSetu (किसान सेतु). सर्वाधिकार सुरक्षित।', '© 2026 KisanSetu. All rights reserved.')}</p>
            <div className="flex items-center gap-4">
              <span>{l('गोपनीयता नीति (Privacy)', 'Privacy Policy')}</span>
              <span>·</span>
              <span>{l('नियम व शर्तें (Terms)', 'Terms of Service')}</span>
              <span>·</span>
              <span>{l('मंडी सुरक्षा गाइड', 'Mandi Security Guide')}</span>
            </div>
          </div>
        </div>
      </footer>


      {/* Fixed Bottom Navigation (hidden on desktop md+) */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Modals & Overlays */}
      {activeBidsListing && (
        <BidsModal
          listing={activeBidsListing}
          onClose={() => setActiveBidsListing(null)}
          onAcceptBid={handleAcceptBid}
        />
      )}

      {showWithdraw && (
        <WithdrawModal
          availableBalance={availableBalance}
          onClose={() => setShowWithdraw(false)}
          onSuccess={handleWithdrawSuccess}
        />
      )}

      {showKyc && (
        <KycModal
          onClose={() => setShowKyc(false)}
          onVerified={handleKycVerified}
        />
      )}

      {showVoice && (
        <VoiceAssistantModal
          onClose={() => setShowVoice(false)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          onOpenKyc={() => setShowKyc(true)}
          isKycVerified={isKycVerified}
        />
      )}

      {showNotifications && (
        <NotificationDrawer
          onClose={() => setShowNotifications(false)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onOpenBids={() => {
            setShowNotifications(false);
            setActiveBidsListing(USER_LISTINGS[0]);
          }}
        />
      )}
    </div>
  );
}
