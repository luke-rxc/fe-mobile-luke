import { SSOType } from '@features/login/schemas';
import { SSOAccountInfo } from '@features/login/types';
import { baseApiClient } from '@utils/api';
import { SocialSchema } from '../schemas';

export interface SocialAccountParams {
  ssoType: SSOType;
  ssoId?: string;
  ssoAccountInfo?: SSOAccountInfo;
}

// SSO 연결 조회
export const getSocialList = () => {
  return baseApiClient.get<SocialSchema[]>('v1/user/sso');
};

// sso 연결 추가
export const putSocialAccount = ({ ssoType, ssoId, ssoAccountInfo }: SocialAccountParams) => {
  const params = { ssoType, ssoId, ssoAccountInfo };
  return baseApiClient.put<string>('v1/user/sso', params);
};

// sso 연결 해제
export const deleteSocialAccount = ({ ssoType }: SocialAccountParams) => {
  return baseApiClient.delete<string>(`v1/user/sso/${ssoType}`);
};
