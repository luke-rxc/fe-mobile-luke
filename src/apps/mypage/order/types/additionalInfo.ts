import { AdditionalInfoEventType, AdditionalInfoUISectionType, InputFormMode, InputFormType } from '../constants';
import { AirlineTicketInfoSchema } from '../schemas';

export interface AdditionalInfoCommonModel {
  title: string;
  sectionType: ValueOf<typeof AdditionalInfoUISectionType>;
  inputFormOptionList: InputOptionItemModel[];
  isSubmitInputForm: boolean;
  isCompletedEntry: boolean;
}

export interface InputOptionItemModel {
  optionId: number;
  title: string;
  options: string[];
  totalCount: number;
  currentCount: number;
  inputFormType: keyof typeof InputFormType;
  airlineTicketList: AirlineTicketItemModel[];
  goodsId: number;
  goodsName: string;
}

export interface AirlineTicketItemModel {
  exportId: number;
  name: string;
  dob: string;
  sex: string;
  nationality: string;
  passportNumber: string | null;
  isInfantAccompanied: boolean;
  detailInfo: AirlineTicketInfoSchema;
}

export interface AdditionalInfoProps {
  data: AdditionalInfoCommonModel;
  className?: string;
  handleConfirmAirlineTicket: () => void;
  isConfirmAirlineTicketLoading: boolean;
}

export type AdditionalInfoOptionProps = Omit<AdditionalInfoCommonModel, 'title' | 'isCompletedEntry'>;

export type AdditionalInfoReceiveEventType = ValueOf<typeof AdditionalInfoEventType>;

export interface AdditionalInfoReceiveProps {
  type: AdditionalInfoReceiveEventType;
  data?: AdditionalInfoReceiveDataProps;
}

export interface AdditionalInfoReceiveDataProps {
  orderId: number;
  optionId: number;
  exportId?: number;
  inputFormData?: AirlineTicketInfoSchema;
  inputFormType: keyof typeof InputFormType;
  inputFormMode?: ValueOf<typeof InputFormMode>;
  goodsId?: number;
  goodsName?: string;
}

export interface AdditionalInfoCommonProps {
  type: ValueOf<typeof AdditionalInfoUISectionType>;
}

export interface AdditionalInfoOpenProps extends AdditionalInfoCommonProps {
  mode: ValueOf<typeof InputFormMode>;
  initData?: AdditionalInfoReceiveProps;
}

export interface AirlineTicketInfoFormFields {
  inputFormType: keyof typeof InputFormType;
  firstName: string;
  lastName: string;
  dob: string;
  sex: 'MALE' | 'FEMALE' | '';
  nationality: string;
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
  infantNationality: string | null;
}

export interface OrderDetailUrlParams {
  // orderId
  id: string;
}
