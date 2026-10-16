import React from 'react';
import { TabType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { language, l } = useLanguage();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#fff8f1]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#eee7de]"
      aria-label="KisanSetu Navigation"
    >
      <div className="flex justify-around items-center h-20 px-1 max-w-lg mx-auto relative">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('home')}
          aria-current={currentTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[56px] transition-all ${
            currentTab === 'home' ? 'text-[#004526] font-bold' : 'text-[#404942] hover:text-[#1e1b16]'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="font-['Noto_Sans'] text-xs text-center leading-none mt-1 font-bold">
            {language === 'en' ? (
              <>
                Home<br />
                <span className="text-[10px] font-normal opacity-85">मुख्य</span>
              </>
            ) : (
              <>
                मुख्य<br />
                <span className="text-[10px] font-normal opacity-90">Home</span>
              </>
            )}
          </span>
        </button>

        {/* 2. Market */}
        <button
          onClick={() => onTabChange('market')}
          aria-current={currentTab === 'market' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[56px] transition-all ${
            currentTab === 'market' ? 'text-[#004526] font-bold' : 'text-[#404942] hover:text-[#1e1b16]'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: currentTab === 'market' ? "'FILL' 1" : "'FILL' 0" }}
          >
            storefront
          </span>
          <span className="font-['Noto_Sans'] text-xs text-center leading-none mt-1 font-bold">
            {language === 'en' ? (
              <>
                Market<br />
                <span className="text-[10px] font-normal opacity-85">बाजार</span>
              </>
            ) : (
              <>
                बाजार<br />
                <span className="text-[10px] font-normal opacity-90">Market</span>
              </>
            )}
          </span>
        </button>

        {/* 3. Center Elevated Sell Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => onTabChange('sell')}
            aria-current={currentTab === 'sell' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[62px] min-h-[62px] -mt-5 px-3 py-1.5 rounded-full bg-[#feb316] text-[#004526] shadow-[0_4px_14px_rgba(254,179,22,0.5)] active:scale-95 transition-transform ${
              currentTab === 'sell' ? 'ring-3 ring-[#004526] font-extrabold' : 'font-bold'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-3xl font-extrabold"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add_shopping_cart
            </span>
            <span className="font-['Noto_Sans'] text-xs font-bold leading-tight mt-0.5">
              {l('बेचें / Sell', 'Sell / बेचें')}
            </span>
          </button>
        </div>

        {/* 4. Wallet */}
        <button
          onClick={() => onTabChange('wallet')}
          aria-current={currentTab === 'wallet' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[56px] transition-all ${
            currentTab === 'wallet' ? 'text-[#004526] font-bold' : 'text-[#404942] hover:text-[#1e1b16]'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: currentTab === 'wallet' ? "'FILL' 1" : "'FILL' 0" }}
          >
            account_balance_wallet
          </span>
          <span className="font-['Noto_Sans'] text-xs text-center leading-none mt-1 font-bold">
            {language === 'en' ? (
              <>
                Wallet<br />
                <span className="text-[10px] font-normal opacity-85">खाता</span>
              </>
            ) : (
              <>
                खाता<br />
                <span className="text-[10px] font-normal opacity-90">Wallet</span>
              </>
            )}
          </span>
        </button>

        {/* 5. Insure */}
        <button
          onClick={() => onTabChange('insure')}
          aria-current={currentTab === 'insure' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[56px] transition-all ${
            currentTab === 'insure' ? 'text-[#004526] font-bold' : 'text-[#404942] hover:text-[#1e1b16]'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: currentTab === 'insure' ? "'FILL' 1" : "'FILL' 0" }}
          >
            verified_user
          </span>
          <span className="font-['Noto_Sans'] text-xs text-center leading-none mt-1 font-bold">
            {language === 'en' ? (
              <>
                Insure<br />
                <span className="text-[10px] font-normal opacity-85">बीमा</span>
              </>
            ) : (
              <>
                बीमा<br />
                <span className="text-[10px] font-normal opacity-90">Insure</span>
              </>
            )}
          </span>
        </button>

        {/* 6. Learn */}
        <button
          onClick={() => onTabChange('learn')}
          aria-current={currentTab === 'learn' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[56px] transition-all ${
            currentTab === 'learn' ? 'text-[#004526] font-bold' : 'text-[#404942] hover:text-[#1e1b16]'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: currentTab === 'learn' ? "'FILL' 1" : "'FILL' 0" }}
          >
            menu_book
          </span>
          <span className="font-['Noto_Sans'] text-xs text-center leading-none mt-1 font-bold">
            {language === 'en' ? (
              <>
                Learn<br />
                <span className="text-[10px] font-normal opacity-85">सलाह</span>
              </>
            ) : (
              <>
                सलाह<br />
                <span className="text-[10px] font-normal opacity-90">Learn</span>
              </>
            )}
          </span>
        </button>
      </div>
    </nav>
  );
};
