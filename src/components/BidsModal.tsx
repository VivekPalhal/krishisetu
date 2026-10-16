import React, { useState } from 'react';
import { UserListing } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BidsModalProps {
  listing: UserListing;
  onClose: () => void;
  onAcceptBid: (bidId: string, amount: number, trader: string) => void;
}

export const BidsModal: React.FC<BidsModalProps> = ({ listing, onClose, onAcceptBid }) => {
  const { language, l } = useLanguage();
  const [selectedBidId, setSelectedBidId] = useState<string>(listing.bids[0]?.id || '');
  const [acceptedSuccess, setAcceptedSuccess] = useState<boolean>(false);
  const [acceptedTrader, setAcceptedTrader] = useState<string>('');

  const handleConfirm = () => {
    const selected = listing.bids.find(b => b.id === selectedBidId);
    if (selected) {
      setAcceptedTrader(selected.traderName);
      setAcceptedSuccess(true);
      setTimeout(() => {
        onAcceptBid(selected.id, selected.bidPrice, selected.traderName);
      }, 1800);
    }
  };

  const cropName = language === 'en' ? listing.cropEn : listing.cropHi;
  const unit = language === 'en' ? listing.unitEn : listing.unitHi;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fff8f1] rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl border-t-2 sm:border-2 border-[#1b5e3a]/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#feb316] text-[#6a4800] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                gavel
              </span>
            </div>
            <div>
              <h2 className="font-['Noto_Sans'] font-bold text-lg text-[#1e1b16]">
                {cropName} {l('की बोलियां (Active Bids)', 'Active Buyer Bids')}
              </h2>
              <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                {l('कुल मात्रा:', 'Total Quantity:')} {listing.quantity} {unit} · {listing.bids.length} {l('व्यापारियों की बोलियां', 'trader bids')}
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

        {acceptedSuccess ? (
          <div className="p-6 text-center space-y-3 bg-[#aef2c2]/30 rounded-2xl border-2 border-[#004526]">
            <div className="w-16 h-16 rounded-full bg-[#004526] text-white flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-3xl font-bold">check</span>
            </div>
            <h3 className="font-['Noto_Sans'] font-bold text-xl text-[#004526]">
              {l('बोली सफलतापूर्वक स्वीकृत!', 'Bid Accepted Successfully!')}
            </h3>
            <p className="font-['Noto_Sans'] text-sm text-[#1e1b16]">
              {l('व्यापारी', 'Trader')} <strong>{acceptedTrader}</strong> {l(`से ₹${listing.highestBid * listing.quantity} का अनुबंध सुरक्षित एस्क्रो में जनरेट हो गया है।`, `escrow contract of ₹${listing.highestBid * listing.quantity} has been generated.`)}
            </p>
            <span className="inline-block px-3 py-1 bg-[#004526] text-white text-xs font-bold rounded-full">
              {l('खाते में एस्क्रो अपडेट किया जा रहा है...', 'Updating escrow balance...')}
            </span>
          </div>
        ) : (
          <>
            {/* Highest Bid Summary Callout */}
            <div className="bg-[#1b5e3a] text-white p-4 rounded-xl shadow-md mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#92d5a8] font-bold">
                  {l('सर्वोत्तम उपलब्ध बोली (Best Rate)', 'Top Bid Rate')}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-['Noto_Sans'] text-3xl font-extrabold tracking-tight">
                    ₹{listing.highestBid}
                  </span>
                  <span className="text-xs text-[#aef2c2]">/ {unit}</span>
                </div>
                <p className="text-xs text-white/90 mt-1">
                  {l('कुल अनुमानित आय:', 'Estimated Total Payout:')} <strong>₹{(listing.highestBid * listing.quantity).toLocaleString('en-IN')}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-[#feb316] text-[#6a4800] text-xs font-bold rounded-full">
                  {l('लाइव नीलामी', 'Live Auction')}
                </span>
                <p className="text-[11px] text-[#aef2c2] mt-2 flex items-center justify-end gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  {listing.timeLeft}
                </p>
              </div>
            </div>

            {/* Bids List */}
            <div className="space-y-3 mb-5">
              <h4 className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#004526]">format_list_bulleted</span>
                {l('व्यापारियों की बोलियों की सूची (Choose Bid to Accept)', 'Trader Bids (Select to Accept)')}
              </h4>

              {listing.bids.map((bid, index) => {
                const isSelected = selectedBidId === bid.id;
                const total = bid.bidPrice * listing.quantity;

                return (
                  <div
                    key={bid.id}
                    onClick={() => setSelectedBidId(bid.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#004526] bg-[#aef2c2]/20 shadow-sm'
                        : 'border-[#e8e2d8] bg-white hover:border-[#c0c9bf]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold ${
                            isSelected
                              ? 'bg-[#004526] text-white'
                              : 'border-2 border-[#707971] text-[#707971]'
                          }`}
                        >
                          {isSelected ? '✓' : index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-['Noto_Sans'] font-bold text-sm text-[#1e1b16]">
                              {bid.traderName}
                            </span>
                            {bid.isVerified && (
                              <span className="inline-flex items-center text-[10px] bg-[#004526]/10 text-[#004526] font-bold px-1.5 py-0.5 rounded">
                                {l('प्रमाणित', 'Verified')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#404942]">
                            {bid.traderLocation} · ★ {bid.rating} (48 {l('सफल सौदे', 'deals')})
                          </p>
                          <span className="text-[11px] text-[#707971] block mt-1">
                            {bid.timeAgo} {l('पहले बोली लगाई', 'ago')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-['Noto_Sans'] text-xl font-extrabold text-[#004526]">
                          ₹{bid.bidPrice}
                        </span>
                        <span className="text-xs text-[#404942] block">/ {unit}</span>
                        <span className="text-[11px] font-bold text-[#1e1b16] block mt-0.5">
                          {l('कुल:', 'Total:')} ₹{total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-3 bg-[#faf3e9] rounded-xl border border-[#c0c9bf]/60 flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-lg text-[#004526]">lock</span>
              <p className="font-['Noto_Sans'] text-xs text-[#404942]">
                {l(
                  'बोली स्वीकारते ही पूरी राशि एस्क्रो में सुरक्षित जमा होगी। तौल के बाद तुरंत भुगतान।',
                  'Upon acceptance, payment is locked in verified escrow and releases immediately upon delivery.'
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-13 rounded-xl bg-[#f4ede4] text-[#404942] font-['Noto_Sans'] font-bold text-sm hover:bg-[#eee7de] cursor-pointer"
                type="button"
              >
                {l('रद्द करें', 'Cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-2 h-13 rounded-xl bg-[#004526] text-white font-['Noto_Sans'] font-bold text-sm shadow-md active:scale-98 transition-transform hover:bg-[#1b5e3a] flex items-center justify-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>{l('बोली स्वीकार करें (Accept Bid)', 'Accept Bid & Lock Escrow')}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
