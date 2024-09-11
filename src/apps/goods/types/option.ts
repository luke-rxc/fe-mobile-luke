import { AlertParams } from '@utils/webInterface';
import { OptionInfoModel } from '../models';

/** 옵션 선택 Status */
export interface OptionStatusProps {
  /** 기존 선택한 옵션 Value */
  prevValue: number | string[] | null;
  /** 진행 Status(step) */
  currentDepth: number;
}

export interface OptionSelectedInfoProps {
  title: string;
  value: string[];
}

/** Option InitialValue Type */
export interface OptionInitialValueProps {
  // stock: OptionStockProps[];
  purchasableStock: number[];
  status: OptionStatusProps;
  /** 선택된 옵션 Names */
  selectedInfo: OptionSelectedInfoProps[];
  /** Selected Info가 한번이라도 노출이 되었는지 체크 */
  selectedInfoActive: boolean;
  /** 선택된 수량 */
  selectedStock: number;
}

export interface OptionResultValuesProps {
  id: number;
  selectedValues: string[];
  stock: number;
  purchasableStock: number;
  price: number;
  discountRate: number;
  secondaryId?: number;
}

export interface OptionReceiveValuesType {
  value: string;
  optionValues: string[];
  /** 하위 옵션이 있을 경우 */
  children?: OptionInfoModel[];
  /** 마지막 옵션일 경우 */
  options?: OptionInfoModel[];
  metaData?: Record<string, unknown>;
}

export interface OptionReceiveErrorValuesType {
  error: string;
}

export interface BubbleValuesType {
  title: string;
  value: string;
  displayValue: string;
  disabled: boolean;
  price?: number;
}

export interface SeatOptionsType {
  scheduleId: number;
  layoutIds: number[];
}

export interface ExpiredType extends Pick<AlertParams, 'title' | 'message'> {
  expiredDate: number;
}

export interface ExpiredInfoType extends ExpiredType {
  layoutIds: number[];
}

// 좌석 지정 머지 후 타입 체크 필요
export interface SeatType {
  scheduleId: number;
  layoutIds: number[];
}
