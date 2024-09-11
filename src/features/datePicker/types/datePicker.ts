export interface DateType {
  year: number;
  month: number;
  day: number;
}

export type DaysIndexListType = number[];

export interface SelectedInfoValuesType {
  days: DaysIndexListType;
  type: 'DEFAULT' | 'START' | 'CENTER' | 'END';
  scrollAble: boolean;
  priceDisplay: boolean;
  textPosition: 'LEFT' | 'CENTER' | 'FIXED_CENTER' | 'RIGHT';
  /** selected bubble 정보 */
  isShow: boolean;
  left: number;
  size: number;
}

export interface SelectedPriceType {
  minPrice: number;
  maxPrice: number;
}

export interface BubbleType {
  type: 'DEFAULT' | 'START' | 'CENTER' | 'END';
  scrollAble: boolean;
  priceDisplay: boolean;
  textPosition: 'LEFT' | 'CENTER' | 'FIXED_CENTER' | 'RIGHT';
  /** selected bubble 정보 */
  isShow: boolean;
  left: number;
  size: number;
}
