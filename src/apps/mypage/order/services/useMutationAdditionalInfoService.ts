import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import {
  AdditionalInfoRequestParam,
  AirlineInfoRequestParam,
  confirmAirlineTicketInfo,
  createAirlineTicketInfo,
  updateAirlineTicketInfo,
} from '../apis';
import { AirlineTicketInfoSchema } from '../schemas';
import { InputFormMode } from '../constants';

/**
 * 항공권 정보 입력/수정 Mutation
 */
export const useUpdateAirlineTicketService = (
  options?: UseMutationOptions<AirlineTicketInfoSchema, ErrorModel, AirlineInfoRequestParam>,
  type?: ValueOf<typeof InputFormMode>,
) => {
  const mutationFunction = type === InputFormMode.REGISTER ? createAirlineTicketInfo : updateAirlineTicketInfo;
  return useMutation(mutationFunction, options);
};

/**
 * 항공권 정보 확정 Mutation
 */
export const useConfirmAirlineTicketService = (
  options?: UseMutationOptions<string, ErrorModel, AdditionalInfoRequestParam>,
) => {
  return useMutation(confirmAirlineTicketInfo, options);
};
