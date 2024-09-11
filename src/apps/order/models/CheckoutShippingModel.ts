import { UseFormRegister } from 'react-hook-form';
import { CheckoutShippingListSchema, CheckoutShippingSchema } from '../schemas';

export type CheckoutShippingModel = Omit<CheckoutShippingSchema, 'updatedDate' | 'createdDate'>;
export type CheckoutShippingFormFields = CheckoutShippingModel;
export interface CheckoutShippingFormProps {
  register: UseFormRegister<CheckoutShippingFormFields>;
}

export interface CheckoutShippingListModel {
  content: CheckoutShippingModel[];
}

export interface DaumAddressModel {
  address: string;
  addressEnglish: string;
  addressType: string;
  apartment: string;
  autoJibunAddress: string;
  autoJibunAddressEnglish: string;
  autoRoadAddress: string;
  autoRoadAddressEnglish: string;
  bcode: string;
  bname: string;
  bname1: string;
  bname1English: string;
  bname2: string;
  bname2English: string;
  bnameEnglish: string;
  buildingCode: string;
  buildingName: string;
  hname: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  noSelected: string;
  postcode: string;
  postcode1: string;
  postcode2: string;
  postcodeSeq: string;
  query: string;
  roadAddress: string;
  roadAddressEnglish: string;
  roadname: string;
  roadnameCode: string;
  roadnameEnglish: string;
  sido: string;
  sidoEnglish: string;
  sigungu: string;
  sigunguCode: string;
  sigunguEnglish: string;
  userLanguageType: string;
  userSelectedType: string;
  zonecode: string;
}

export function toCheckoutShippingListModel(schema: CheckoutShippingListSchema): CheckoutShippingListModel {
  return {
    content: schema.content.map((item) => {
      const { updatedDate, createdDate, ...other } = item;
      return { ...other };
    }),
  };
}
