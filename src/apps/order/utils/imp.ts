import { PAY_FAIL } from '../constants';

export type IMPQueryParams = {
  imp_success?: string;
  error_msg?: string;
};

export const imp = (params: IMPQueryParams) => {
  const isFail = () => {
    return params.imp_success === PAY_FAIL;
  };

  const isUserCancel = () => {
    return params.error_msg?.includes('[결제포기]') ?? false;
  };

  const approve = async () => {
    return true;
  };

  return {
    isFail,
    isUserCancel,
    approve,
  };
};
