import { baseApiClient } from '@utils/api';
import { LoginMailAuthSchema, DisplayContentSchema, SSOType, UserLoginSchema } from '../schemas';

export interface LoginParams {
  email: string;
  code: string;
}

export interface SocialLoginParam {
  ssoType: SSOType;
  email: string;
  ssoId: string;
}

export const executeSendAuthMail = (email: string): Promise<LoginMailAuthSchema> => {
  const params = { email };
  return baseApiClient.post<LoginMailAuthSchema>('/v1/user/auth', params);
};

export const executeLogin = (params: LoginParams): Promise<UserLoginSchema> => {
  return baseApiClient.post('/v1/user/login', params);
};

export function executeSocialLogin(param: SocialLoginParam): Promise<UserLoginSchema> {
  return baseApiClient.post('/v1/user/login/sso', param);
}

export const getDisplayContentList = (): Promise<DisplayContentSchema[]> => {
  return baseApiClient.get('/v1/user/login/display-contents');
};
