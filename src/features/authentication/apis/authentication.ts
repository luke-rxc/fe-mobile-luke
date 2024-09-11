import { baseApiClient } from '@utils/api';

interface SendAuthenticationNumberRequestParam {
  param: {
    name: string;
    phone: string;
  };
}

interface AuthenticationRequestParam {
  param: {
    code: string;
    isOtherUserDelete: boolean;
    name: string;
    phone: string;
  };
}

export function sendAuthenticationNumber({ param }: SendAuthenticationNumberRequestParam): Promise<void> {
  return baseApiClient.post('/v1/user/identify/auth', param);
}

export function authentication({ param }: AuthenticationRequestParam): Promise<void> {
  return baseApiClient.post('/v1/user/identify', param);
}
