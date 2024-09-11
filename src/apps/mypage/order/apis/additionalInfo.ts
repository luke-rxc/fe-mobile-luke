import { baseApiClient } from '@utils/api';
import {
  AdditionalInfoSchema,
  AdditionalInfoSelectSchema,
  AirlineTicketInfoSchema,
  AirlineTicketInputSchema,
  RecentlyInputFormInfoSchema,
} from '../schemas/AdditionalInfoSchema';
import { InputFormType } from '../constants';

export interface AdditionalInfoRequestParam {
  orderId: number | string;
  optionId?: number | string;
  exportId?: number | string;
}

export interface AirlineInfoRequestParam extends AdditionalInfoRequestParam {
  inputInfo: AirlineTicketInputSchema;
}

export interface RecentlyInputFormRequestParam {
  inputFormType: keyof typeof InputFormType;
}

/**
 * 부가정보 입력폼 조회 API
 *
 * @param AdditionalInfoRequestParam
 * @returns
 */
export const getAdditionalInfo = ({ orderId }: AdditionalInfoRequestParam) => {
  return baseApiClient.get<AdditionalInfoSchema>(`/v1/order/${orderId}/additional-input-form`);
};

/**
 * 항공권 정보 입력 API
 *
 * @param AirlineInfoRequestParam
 * @returns
 */
export const createAirlineTicketInfo = ({ orderId, optionId, inputInfo }: AirlineInfoRequestParam) => {
  const requestData = { ...inputInfo };
  return baseApiClient.post<AirlineTicketInfoSchema>(
    `/v1/order/${orderId}/additional-input-form/${optionId}/airline-ticket`,
    requestData,
  );
};

/**
 * 항공권 정보 수정 API
 *
 * @param AirlineInfoRequestParam
 * @returns
 */
export const updateAirlineTicketInfo = ({ orderId, optionId, exportId, inputInfo }: AirlineInfoRequestParam) => {
  const requestData = { ...inputInfo };
  return baseApiClient.put<AirlineTicketInfoSchema>(
    `/v1/order/${orderId}/additional-input-form/${optionId}/airline-ticket/${exportId}`,
    requestData,
  );
};

/**
 * 항공권 탑승자 정보 확정 API
 *
 * @param AdditionalInfoRequestParam
 * @returns
 */
export const confirmAirlineTicketInfo = ({ orderId }: AdditionalInfoRequestParam) => {
  return baseApiClient.post<string>(`/v1/order/${orderId}/additional-input-form/airline-ticket-confirmation`);
};

/**
 * 국가 코드 조회 API
 *
 * @returns
 */
export const getNationalityCodeInfo = () => {
  return baseApiClient.get<AdditionalInfoSelectSchema[]>(`/v1/export/recently-input-form/country-code`);
};

/**
 * 최근 입력 숏컷 조회 API
 *
 * @param RecentlyInputFormRequestParam
 * @returns
 */
export const getRecentlyInputFormInfo = ({ inputFormType }: RecentlyInputFormRequestParam) => {
  return baseApiClient.get<RecentlyInputFormInfoSchema[]>(
    `/v1/export/recently-input-form?inputFormType=${inputFormType}`,
  );
};
