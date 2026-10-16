export type TabType = 'home' | 'market' | 'sell' | 'wallet' | 'insure' | 'learn';

export type Language = 'hi' | 'en';

export interface CropOption {
  id: string;
  nameHi: string;
  nameEn: string;
  subHi: string;
  subEn: string;
  image: string;
  defaultMsp: number;
  currentRate: number;
  unit: string;
  rateChange: string;
  rateUp: boolean;
  rateSteady?: boolean;
}

export interface MandiItem {
  id: string;
  nameHi: string;
  nameEn: string;
  varietyHi: string;
  varietyEn: string;
  category: 'grain' | 'oilseed' | 'vegetable' | 'pulse';
  price: number;
  unitHi: string;
  unitEn: string;
  changeAmount: number;
  changePercent: number;
  isUp: boolean;
  isSteady?: boolean;
  image: string;
  mandi: string;
  arrival: string;
  msp: number;
}

export interface ListingBid {
  id: string;
  traderName: string;
  traderLocation: string;
  bidPrice: number;
  quantity: number;
  timeAgo: string;
  rating: number;
  isVerified: boolean;
}

export interface UserListing {
  id: string;
  cropHi: string;
  cropEn: string;
  quantity: number;
  unitHi: string;
  unitEn: string;
  highestBid: number;
  timeLeft: string;
  leadingTrader: string;
  bidsCount: number;
  status: 'active' | 'completed' | 'draft';
  bids: ListingBid[];
}

export interface Transaction {
  id: string;
  titleHi: string;
  titleEn: string;
  counterpartHi: string;
  counterpartEn: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  badgeHi: string;
  badgeEn: string;
  subBadgeHi: string;
  subBadgeEn: string;
  status: 'success' | 'pending';
  icon: string;
}

export interface DamageCause {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  isPopular?: boolean;
  tagHi?: string;
}

export interface ClaimPhoto {
  id: number;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  image?: string;
  isUploaded: boolean;
  timestamp?: string;
  gpsTag?: string;
}
