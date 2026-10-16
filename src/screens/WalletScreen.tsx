import React, { useState } from 'react';
import { WALLET_TRANSACTIONS } from '../data/mockData';
import { speakText, stopSpeech } from '../utils/speech';
import { useLanguage } from '../context/LanguageContext';

interface WalletScreenProps {
  onOpenWithdraw: () => void;
  availableBalance: number;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  onOpenWithdraw,
  availableBalance
}) => {
  const { language, l } = useLanguage();
  const [isPlayingBalance, setIsPlayingBalance] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showPassbookModal, setShowPassbookModal] = useState(false);
  const [txnFilter, setTxnFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const handleAudioBalance = () => {
    if (isPlayingBalance) {
      stopSpeech();
      setIsPlayingBalance(false);
      return;
    }

    const text =
      language === 'en'
        ? `Your total available balance is 48,250 rupees. 15,600 rupees are safely held in escrow, which will release into your bank account once produce delivery is verified at the mandi.`
        : `आपके खाते में कुल उपलब्ध राशि अड़तालीस हजार दो सौ पचास रुपये है। सुरक्षित एस्क्रो में पंद्रह हजार छह सौ रुपये हैं, जो मंडी डिलीवरी सत्यापन के बाद आपके खाते में जुड़ेंगे।`;

    const voiceLang = language === 'en' ? 'en-IN' : 'hi-IN';
    setIsPlayingBalance(true);
    speakText(text, voiceLang, () => {
      setIsPlayingBalance(false);
    });
  };

  const filteredTransactions = WALLET_TRANSACTIONS.filter(t => {
    if (txnFilter === 'all') return true;
    return t.type === txnFilter;
  });

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-16 max-w-7xl mx-auto gap-6">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
        {/* Left Column (Hero Balance & Account Management) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Voice & Trust Toast */}
          <div className="flex items-center justify-between p-3.5 bg-[#eee7de] rounded-2xl shadow-xs border border-[#c0c9bf]/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#aef2c2] flex items-center justify-center text-[#004526] shrink-0">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
              </div>
              <div>
                <p className="font-['Noto_Sans'] font-bold text-xs sm:text-sm text-[#1e1b16] leading-tight">
                  {l('सुरक्षित सरकारी गेटवे (Direct Benefit)', 'Secure Government DBT Gateway')}
                </p>
                <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                  {l('NPCI & RBI द्वारा प्रमाणित · DBT सक्षम', 'Certified by NPCI & RBI · DBT Enabled')}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#aef2c2]/60 text-[#09522f] font-['Noto_Sans'] font-bold text-xs shrink-0">
              <span className="material-symbols-outlined text-xs mr-1">verified_user</span> {l('100% सेफ', '100% Safe')}
            </span>
          </div>

          {/* 1. Hero Balance Card (Deep Green #1B5E3A) */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1b5e3a] text-white p-6 shadow-md space-y-4 border border-[#004526]">
            {/* Subtle tactile backdrop glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#92d5a8]/10 pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="material-symbols-outlined text-[#92d5a8] text-2xl sm:text-3xl">
                  account_balance_wallet
                </span>
                <span className="font-['Noto_Sans'] font-bold text-lg sm:text-xl text-white">
                  {l('कुल उपलब्ध राशि', 'Available Balance')}
                </span>
              </div>

              {/* Audio Readout Button */}
              <button
                onClick={handleAudioBalance}
                aria-label={l('बैलेंस सुनें', 'Listen to Balance')}
                className="min-h-[44px] px-4 py-1.5 rounded-full bg-white text-[#004526] font-['Noto_Sans'] text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
                type="button"
              >
                <span
                  className="material-symbols-outlined text-xl text-[#feb316]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlayingBalance ? 'pause_circle' : 'volume_up'}
                </span>
                <span>{isPlayingBalance ? l('रोकें', 'Pause') : l('बैलेंस सुनें', 'Listen')}</span>
              </button>
            </div>

            {/* Amount Display */}
            <div className="pt-1">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-['Noto_Sans'] text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                  ₹{availableBalance.toLocaleString('en-IN')}
                </span>
                <span className="font-['Noto_Sans'] text-[#92d5a8] text-base sm:text-lg font-bold">.00</span>
              </div>

              {/* Words Display for Absolute Financial Clarity */}
              <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#aef2c2] font-medium mt-2 leading-snug bg-[#004526]/40 px-3 py-2 rounded-xl border border-white/10">
                {l(
                  'अड़तालीस हजार दो सौ पचास रुपये',
                  'Forty-Eight Thousand Two Hundred Fifty Rupees Only'
                )}
                <br />
                <span className="opacity-90 font-normal text-xs">
                  {l('(Forty-Eight Thousand Two Hundred Fifty Rupees)', '(अड़तालीस हजार दो सौ पचास रुपये)')}
                </span>
              </p>
            </div>

            {/* Escrow Balance Chip */}
            <div className="mt-2 pt-2 border-t border-[#92d5a8]/20">
              <div className="flex items-start space-x-2.5 bg-white/10 p-3 rounded-xl">
                <span className="material-symbols-outlined text-[#ffdead] text-xl shrink-0 mt-0.5">
                  lock_clock
                </span>
                <div className="min-w-0">
                  <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#ffdead] font-bold leading-tight">
                    {l('सुरक्षित एस्क्रो में: ₹15,600', 'In Protected Escrow: ₹15,600')}
                  </p>
                  <p className="font-['Noto_Sans'] text-xs text-white/80 mt-0.5">
                    {l(
                      'मंडी डिलीवरी सत्यापन उपरांत तुरंत खाते में जमा होंगे (2 ऑर्डर्स)',
                      'Releases directly to your bank account once mandi delivery is verified (2 orders)'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Primary Action Buttons */}
          <div className="space-y-3">
            {/* Primary Withdraw CTA */}
            <button
              onClick={onOpenWithdraw}
              aria-label={l('खाते में निकालें', 'Withdraw to Bank')}
              className="w-full min-h-[56px] h-14 bg-[#feb316] text-[#6a4800] font-['Noto_Sans'] font-extrabold text-base rounded-2xl flex items-center justify-between px-5 shadow-xs active:scale-[0.98] transition-transform border border-[#feb316] hover:bg-[#e5a013] cursor-pointer"
              type="button"
            >
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-3xl font-bold">payments</span>
                <div className="text-left">
                  <span className="block leading-tight text-[#004526]">{l('खाते में निकालें', 'Withdraw to Bank')}</span>
                  <span className="text-xs font-normal opacity-90 text-[#6a4800]">
                    {l('Withdraw to Bank / UPI', 'बैंक या UPI द्वारा तुरंत निकासी')}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-2xl font-bold text-[#004526]">
                arrow_forward
              </span>
            </button>

            {/* Secondary Split Actions */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {/* Linked UPI / Bank Setup */}
              <button
                onClick={() => setShowAccountsModal(true)}
                className="min-h-[56px] p-3.5 bg-white rounded-2xl shadow-xs text-left flex items-center space-x-2.5 active:bg-[#faf3e9] transition-colors border border-[#e8e2d8] hover:border-[#004526] cursor-pointer"
                type="button"
              >
                <div className="w-10 h-10 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#004526] shrink-0">
                  <span className="material-symbols-outlined text-2xl">add_link</span>
                </div>
                <div className="min-w-0">
                  <p className="font-['Noto_Sans'] font-bold text-xs sm:text-sm text-[#1e1b16] truncate">
                    {l('खाता / UPI', 'Bank & UPI')}
                  </p>
                  <p className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                    {l('Linked Accounts', 'संबद्ध खाते')}
                  </p>
                </div>
              </button>

              {/* Passbook / Statement Download */}
              <button
                onClick={() => setShowPassbookModal(true)}
                className="min-h-[56px] p-3.5 bg-white rounded-2xl shadow-xs text-left flex items-center space-x-2.5 active:bg-[#faf3e9] transition-colors border border-[#e8e2d8] hover:border-[#004526] cursor-pointer"
                type="button"
              >
                <div className="w-10 h-10 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#004526] shrink-0">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <div className="min-w-0">
                  <p className="font-['Noto_Sans'] font-bold text-xs sm:text-sm text-[#1e1b16] truncate">
                    {l('रसीद / पासबुक', 'Passbook PDF')}
                  </p>
                  <p className="font-['Noto_Sans'] text-xs text-[#404942] truncate">
                    {l('Passbook', 'खाता पासबुक')}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Linked Bank Account Reassurance Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs space-y-3 border border-[#e8e2d8]">
            <div className="flex items-center justify-between pb-1">
              <span className="font-['Noto_Sans'] font-bold text-xs text-[#404942] uppercase tracking-wider">
                {l('प्राथमिक बैंक खाता (MAIN BANK)', 'Primary Bank Account')}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#aef2c2]/50 text-[#09522f] font-['Noto_Sans'] text-xs font-bold">
                <span className="material-symbols-outlined text-sm mr-0.5">check_circle</span> {l('डिफ़ॉल्ट', 'Default')}
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#f4ede4] flex items-center justify-center text-[#004526] shrink-0">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] leading-snug truncate">
                  State Bank of India (SBI)
                </p>
                <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#404942] font-mono mt-0.5">
                  {l('खाता: •••• 4892 · अंजली देवी', 'A/C: •••• 4892 · Anjali Devi')}
                </p>
              </div>
            </div>

            {/* Verification Badge Pill */}
            <div className="pt-1">
              <div className="flex items-center space-x-2 bg-[#f4ede4] p-2.5 rounded-xl text-[#004526]">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-['Noto_Sans'] text-xs font-bold">
                  {l('आधार से जुड़ा व NPCI द्वारा सत्यापित (DBT चालू है)', 'Aadhaar Linked & NPCI Verified (DBT Active)')}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Elder Reassurance Footer */}
          <div className="rounded-2xl bg-[#ffdead]/40 p-5 space-y-3 shadow-xs border border-[#feb316]/40">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl">headset_mic</span>
              </div>
              <div>
                <h4 className="font-['Noto_Sans'] font-bold text-base text-[#281900] leading-tight">
                  {l('खाते या पैसों में कोई समस्या?', 'Need help with payments or payouts?')}
                </h4>
                <p className="font-['Noto_Sans'] text-xs text-[#604100] mt-1">
                  {l('हमारे किसान मित्र सहायता अधिकारी से अपनी भाषा में बात करें।', 'Speak to our Kisan Mitra helpline officers in your native language.')}
                </p>
              </div>
            </div>

            {/* Call Support Button */}
            <a
              className="mt-2 min-h-[52px] w-full bg-[#004526] text-white rounded-xl flex items-center justify-center space-x-2 font-['Noto_Sans'] font-extrabold text-sm shadow-xs active:scale-95 transition-transform"
              href="tel:18001801551"
            >
              <span className="material-symbols-outlined text-2xl">call</span>
              <span>{l('मुफ्त कॉल: 1800-180-1551 (टोल फ्री)', 'Call Toll-Free: 1800-180-1551')}</span>
            </a>
            <p className="text-center font-['Noto_Sans'] text-xs text-[#604100] pt-1">
              {l('24 घंटे 7 दिन उपलब्ध · कोई चार्ज नहीं लगेगा', 'Available 24x7 · 100% Free of Cost')}
            </p>
          </div>
        </div>

        {/* Right Column (Transaction History Ledger) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header & Filter Tabs */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e8e2d8] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#004526] text-2xl">history</span>
                <h2 className="font-['Noto_Sans'] font-bold text-lg sm:text-xl text-[#1e1b16]">
                  {l('लेन-देन इतिहास (Transaction History)', 'Transaction Passbook Ledger')}
                </h2>
              </div>
              <button
                onClick={() => setShowPassbookModal(true)}
                className="font-['Noto_Sans'] text-xs sm:text-sm text-[#004526] font-bold underline hover:opacity-80 cursor-pointer"
                type="button"
              >
                {l('पासबुक डाउनलोड (PDF)', 'Download Statement (PDF)')}
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#f4ede4]">
              <button
                onClick={() => setTxnFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  txnFilter === 'all'
                    ? 'bg-[#004526] text-white shadow-xs'
                    : 'bg-[#f4ede4] text-[#404942] hover:bg-[#eee7de]'
                }`}
                type="button"
              >
                {l('सभी (All)', 'All')}
              </button>
              <button
                onClick={() => setTxnFilter('credit')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  txnFilter === 'credit'
                    ? 'bg-[#004526] text-white shadow-xs'
                    : 'bg-[#f4ede4] text-[#404942] hover:bg-[#eee7de]'
                }`}
                type="button"
              >
                {l('प्राप्त राशि (+ Income)', 'Credits (+)')}
              </button>
              <button
                onClick={() => setTxnFilter('debit')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  txnFilter === 'debit'
                    ? 'bg-[#004526] text-white shadow-xs'
                    : 'bg-[#f4ede4] text-[#404942] hover:bg-[#eee7de]'
                }`}
                type="button"
              >
                {l('कटौती (- Debit)', 'Debits (-)')}
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3.5">
            {filteredTransactions.map(txn => {
              const title = language === 'en' ? txn.titleEn : txn.titleHi;
              const counterpart = language === 'en' ? txn.counterpartEn : txn.counterpartHi;
              const badge = language === 'en' ? txn.badgeEn : txn.badgeHi;

              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="bg-white rounded-2xl p-5 shadow-xs space-y-3 border border-[#e8e2d8] cursor-pointer hover:border-[#004526] hover:shadow-sm active:scale-98 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex space-x-3.5 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          txn.type === 'credit'
                            ? 'bg-[#aef2c2]/40 text-[#004526]'
                            : 'bg-[#eee7de] text-[#404942]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl font-bold">
                          {txn.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16] leading-snug truncate">
                          {title}
                        </h3>
                        <p className="font-['Noto_Sans'] text-xs sm:text-sm text-[#404942] truncate">
                          {counterpart}
                        </p>
                        <p className="font-['Noto_Sans'] text-xs text-[#707971] mt-1">
                          {txn.date}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-['Noto_Sans'] text-lg sm:text-xl font-extrabold ${
                          txn.type === 'credit' ? 'text-[#004526]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                      <p className="font-['Noto_Sans'] text-xs text-[#234f3f] font-bold mt-0.5">
                        {badge}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#eee7de]">
                    <span className="inline-flex items-center text-xs text-[#004526] font-bold">
                      <span className="material-symbols-outlined text-sm mr-1">check_circle</span>{' '}
                      {language === 'en' ? txn.subBadgeEn : txn.subBadgeHi}
                    </span>
                    <span className="inline-flex items-center text-xs text-[#404942]">
                      {txn.type === 'credit' && txn.id === 'txn-1' && (
                        <span className="material-symbols-outlined text-xs mr-1">sms</span>
                      )}
                      {language === 'en' ? 'Ref: ' + txn.id.toUpperCase() : txn.subBadgeEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#fff8f1] rounded-2xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#004526]/20">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8e2d8] mb-3">
              <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                {l('लेन-देन विवरण (Transaction Receipt)', 'Transaction Receipt')}
              </h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className="w-8 h-8 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#1e1b16]">
              <div className="text-center py-2 bg-white rounded-xl border border-[#e8e2d8]">
                <div
                  className={`text-2xl font-extrabold ${
                    selectedTxn.type === 'credit' ? 'text-[#004526]' : 'text-[#ba1a1a]'
                  }`}
                >
                  {selectedTxn.type === 'credit' ? '+' : '-'} ₹
                  {selectedTxn.amount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-[#404942] font-bold mt-1">
                  {language === 'en' ? selectedTxn.titleEn : selectedTxn.titleHi}
                </p>
                <span className="text-[11px] text-[#004526] font-bold bg-[#aef2c2]/50 px-2 py-0.5 rounded-full inline-block mt-1">
                  {l('सफल भुगतान (Successful)', 'Successful Payment')}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e8e2d8] space-y-1.5 font-mono text-[11px]">
                <p>
                  <strong>{l('आईडी:', 'Txn ID:')}</strong> {selectedTxn.id.toUpperCase()}-2026-IN
                </p>
                <p>
                  <strong>{l('दिनांक:', 'Date:')}</strong> {selectedTxn.date}
                </p>
                <p>
                  <strong>{l('खाता:', 'Account:')}</strong> SBI •••• 4892 (DBT)
                </p>
                <p>
                  <strong>{l('स्थिति:', 'Status:')}</strong> {l('NPCI सत्यापित', 'NPCI Verified')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTxn(null)}
              className="mt-4 w-full py-2.5 bg-[#004526] text-white rounded-xl text-xs font-bold cursor-pointer"
              type="button"
            >
              {l('बंद करें (Close)', 'Close Receipt')}
            </button>
          </div>
        </div>
      )}

      {/* Linked Accounts Modal */}
      {showAccountsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#fff8f1] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#004526]/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d8]">
              <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
                {l('संबद्ध बैंक व UPI खाते', 'Linked Bank & UPI Accounts')}
              </h3>
              <button
                onClick={() => setShowAccountsModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4ede4] flex items-center justify-center text-[#404942] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-[#004526] flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-[#004526]">State Bank of India (SBI)</p>
                  <p className="text-xs text-[#404942]">•••• 4892 · IFSC: SBIN0001234</p>
                </div>
                <span className="text-[10px] bg-[#aef2c2] text-[#00210f] px-2 py-0.5 rounded-full font-bold">
                  {l('डिफ़ॉल्ट DBT', 'Default DBT')}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e8e2d8] flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-[#1e1b16]">Bank of India</p>
                  <p className="text-xs text-[#404942]">•••• 7812 · IFSC: BKID0005678</p>
                </div>
                <span className="text-[10px] bg-[#f4ede4] text-[#404942] px-2 py-0.5 rounded-full">
                  {l('द्वितीयक खाता', 'Secondary')}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e8e2d8] flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-[#1e1b16]">BHIM UPI</p>
                  <p className="text-xs text-[#404942]">gitanjali.devi@oksbi</p>
                </div>
                <span className="text-[10px] bg-[#aef2c2] text-[#00210f] px-2 py-0.5 rounded-full font-bold">
                  {l('सत्यापित', 'Verified')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAccountsModal(false)}
              className="w-full py-2.5 bg-[#004526] text-white rounded-xl text-xs font-bold cursor-pointer"
              type="button"
            >
              {l('ठीक है', 'Done')}
            </button>
          </div>
        </div>
      )}

      {/* Passbook Download Modal */}
      {showPassbookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#fff8f1] rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#004526]/20 space-y-4 text-center">
            <span className="material-symbols-outlined text-5xl text-[#004526]">receipt_long</span>
            <h3 className="font-['Noto_Sans'] font-bold text-base text-[#1e1b16]">
              {l('डिजिटल पासबुक स्टेटमेंट', 'Digital Passbook Statement')}
            </h3>
            <p className="text-xs text-[#404942]">
              {l(
                'अक्टूबर 2026 तक की सभी ई-नाम व DBT भुगतान प्रविष्टियों का आधिकारिक PDF जनरेट हो गया है।',
                'Official PDF statement with all e-NAM and DBT transactions up to October 2026 has been generated.'
              )}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPassbookModal(false)}
                className="flex-1 py-2.5 bg-[#f4ede4] text-[#404942] rounded-xl text-xs font-bold cursor-pointer"
                type="button"
              >
                {l('रद्द करें', 'Close')}
              </button>
              <button
                onClick={() => {
                  alert(language === 'en' ? 'Passbook statement downloaded successfully!' : 'पासबुक स्टेटमेंट सफलतापूर्वक डाउनलोड हो गया!');
                  setShowPassbookModal(false);
                }}
                className="flex-1 py-2.5 bg-[#004526] text-white rounded-xl text-xs font-bold cursor-pointer"
                type="button"
              >
                {l('डाउनलोड (PDF)', 'Download PDF')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
