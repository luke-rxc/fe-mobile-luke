import { baseApiClient } from '@utils/api';
import { ProviderListSchema } from '../schemas';

export interface PrivacyProviderParam {
  page: number;
  size?: number;
}

// 상품 판매 입점사 확인
export const getPrivacyProvider = ({ page, size = 30 }: PrivacyProviderParam) => {
  return baseApiClient.get<ProviderListSchema>(`/v1/provider/list?page=${page}&size=${size}`);
};
