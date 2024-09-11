export interface ActionParams {
  type: 'refetch' | 'toast';
  message?: string;
}

export type ReceiveDataType = {
  type?: string;
  actions?: ReceiveActionType[];
};

export type ReceiveActionType = {
  type: string;
  message?: string;
  data?: ExchangeShippingInfo;
};

export interface ExchangeShippingInfo {
  name: string;
  phone: string;
  address: string;
  addressDetail: string | null;
  postCode: string;
}

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
}
