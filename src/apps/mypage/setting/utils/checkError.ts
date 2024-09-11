import { ErrorModel } from '@utils/api/createAxios';
import { DeleteUserErrorCode } from '../constants';

export const checkError = (error: ErrorModel) => {
  if (
    error.data?.code === DeleteUserErrorCode.POINT ||
    error.data?.code === DeleteUserErrorCode.ORDER ||
    error.data?.code === DeleteUserErrorCode.CS
  ) {
    return true;
  }
  return false;
};
