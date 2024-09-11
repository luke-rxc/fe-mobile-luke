import { NaverResponse, SocialParams } from '../types';

export function toNaverSocialParams(res: NaverResponse): SocialParams {
  const { id, email, profile_image: profileImageUrl } = res;

  return {
    ssoId: id,
    email,
    ssoType: 'NAVER',
    profileImageUrl,
  };
}
