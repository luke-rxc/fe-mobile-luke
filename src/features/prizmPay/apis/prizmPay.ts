import { baseApiClient } from '@utils/api';
import { PrizmPayListSchema, PrizmPaySchema } from '../schemas';

interface GetUserPrizmPayListRequest {
  params?: {
    page: number;
    size: number;
    sort: string;
  };
}

interface GetUserPrizmPayRequest {
  id: number;
}

interface CreatePrizmPayRequestParam {
  birth: string;
  cardNumber: string;
  cardAlias: string;
  expiry: string;
  pwd2digit: string;
  isDefault: boolean;
}

interface UpdatePrizmPayRequestParam {
  id: number;
  param: {
    cardAlias: string;
  };
}

interface DeletePrizmPayRequestParam {
  id: number;
}

export function getUserPrizmPayList({
  params = { page: 1, size: 20, sort: '' },
}: GetUserPrizmPayListRequest): Promise<PrizmPayListSchema> {
  return baseApiClient.get('v1/user/prizm-pay', params);
}

export function getUserPrizmPay({ id }: GetUserPrizmPayRequest): Promise<PrizmPaySchema> {
  return baseApiClient.get(`v1/user/prizm-pay/${id}`);
}

export function createPrizmPay(param: CreatePrizmPayRequestParam): Promise<PrizmPaySchema> {
  return baseApiClient.post('v1/user/prizm-pay', param);
}

export function updatePrizmPay({ id, param }: UpdatePrizmPayRequestParam): Promise<PrizmPaySchema> {
  return baseApiClient.put(`v1/user/prizm-pay/${id}`, param);
}

export function updatePrizmPayDefault(id: number): Promise<PrizmPaySchema> {
  return baseApiClient.put(`v1/user/prizm-pay/${id}/default`);
}

export function deletePrizmPay({ id }: DeletePrizmPayRequestParam): Promise<void> {
  return baseApiClient.delete(`v1/user/prizm-pay/${id}`);
}
