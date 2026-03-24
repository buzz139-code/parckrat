export type TripType =
  | 'business'
  | 'leisure'
  | 'backpacking'
  | 'beach'
  | 'adventure'
  | 'winter';

export interface TripTypeConfig {
  id: TripType;
  label: string;
  description: string;
  icon: string;
}

export interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  tripTypes: TripType[];
}

export interface WeatherData {
  avgTempC: number;
  minTempC: number;
  maxTempC: number;
  precipMm: number;
  conditionLabel: string;
  conditionCode: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
}

export type ItemCategory =
  | 'Clothing'
  | 'Footwear'
  | 'Toiletries'
  | 'Electronics'
  | 'Documents'
  | 'Health'
  | 'Accessories'
  | 'Other';

export interface PackingItemData {
  id: string;
  name: string;
  quantity: string;
  category: ItemCategory;
  packed: boolean;
  weatherDriven: boolean;
}

export interface PackingListData {
  items: PackingItemData[];
  generatedAt: string;
  destination: string;
  tripTypes: TripType[];
}

export type AppState = 'input' | 'loading' | 'list';
