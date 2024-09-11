import { FileSchema } from '@schemas/fileSchema';
import { AdditionalInfoUISectionType, InputFormType } from '../constants';

export interface BrandSchema {
  id: number;
  name: string;
  primaryImage: FileSchema | null;
  defaultShowRoomId: number;
}

export interface GoodsSchema {
  /** 상품 Id */
  id: number;
  /** 상품명 */
  name: string;
  /** 상품 썸네일 */
  primaryImage: FileSchema | null;
  /** 소비자가 */
  consumerPrice: number;
  /** 상품 단가 */
  price: number;
  /** 할인율 */
  discountRate: number;
  /** 쇼룸 Id */
  showRoomId: number;
  /** 상품코드(랜딩을 위한 코드) */
  code: string;
  label: string;
  benefitLabel: string;
  isPrizmOnly: boolean;
  /** 구매한 상품 옵션 */
  option: {
    id: number;
    itemList: { title: string; value: string }[];
  };
  /** 패키지 옵션 */
  packageOption: {
    id: number;
    itemList: { title: string; value: string }[];
  };
}

export interface TicketSchema {
  /** 티켓 상태 */
  status: {
    title: string;
    value: string;
  };
  /** 기준일 */
  now: number;
  /** 티켓 사용 시작일 */
  startDate: number;
  /** 티켓 사용 종료일 */
  endDate: number;
  /** 문자 재전송 수 (현재 사용하지 않는 상태) */
  resendCount?: number;
  /** 문자 재전송 제한 수 (현재 사용하지 않는 상태) */
  resendLimitCount?: number;
  /** 문자 재전송 가능 여부 */
  isPossibleResent: boolean;
  /** 티켓 타입 */
  ticketType: {
    title: string;
    value: string;
  };
  /** 숙박권 투숙일시 */
  bookingDate: number;
  /** 취소가능기간 */
  cancelableDate: number;
  /** 탑승자 정보 */
  userName?: string;
}

export interface AirlineTicketInfoCommonSchema {
  firstName: string;
  lastName: string;
  dob: string;
  sex: 'MALE' | 'FEMALE' | '';
  passportNumber: string | null;
  passportExpiryDate: string | null;
  email: string | null;
  infantFirstName: string | null;
  infantLastName: string | null;
  infantDob: string | null;
  infantSex: 'MALE' | 'FEMALE' | '' | null;
  infantPassportNumber: string | null;
  infantPassportExpiryDate: string | null;
  isInfantAccompanied: boolean;
}

export interface AirlineTicketInfoSchema extends AirlineTicketInfoCommonSchema {
  exportId: number;
  nationality: {
    code: string;
    text: string;
  };
  infantNationality: {
    code: string | null;
    text: string;
  };
}

export interface InputFormOptionSchema {
  id: number;
  ea: number;
  inputFormType: keyof typeof InputFormType;
  brand: BrandSchema;
  goods: GoodsSchema;
  ticket: TicketSchema;
  airlineTicketList: AirlineTicketInfoSchema[];
}

export interface AdditionalInfoSchema {
  sectionType: keyof typeof AdditionalInfoUISectionType;
  expiryDate: number;
  inputFormOptionList: InputFormOptionSchema[];
  isSubmitInputForm: boolean;
}

export interface AirlineTicketInputSchema extends AirlineTicketInfoCommonSchema {
  inputFormType: keyof typeof InputFormType;
  nationality: string;
  infantNationality: string | null;
}

export interface AdditionalInfoSelectSchema {
  code: string;
  text: string;
}

export interface RecentlyInputFormInfoSchema {
  type: keyof typeof InputFormType;
  airlineTicket: AirlineTicketInfoSchema;
}
