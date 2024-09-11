import { useMutation } from '@hooks/useMutation';
import { executeSocialJoin, executeSocialLogin, SocialJoinRequestParam, SocialLoginParam } from '../apis';
import { SocialParams } from '../types';
import { validity } from '../utils';
import { useProfileImageUpdate } from './useProfileImageUpdate';

export const useSocialLogin = () => {
  const { update: updateUserProfileImage } = useProfileImageUpdate();
  const isValidRequestSocialLogin = (param: Pick<SocialParams, 'email' | 'ssoId' | 'ssoType'>) => {
    const { email, ssoId, ssoType } = param;

    if (!email) {
      return '이메일이 누락되었습니다';
    }

    if (!ssoId || !ssoType) {
      return '소셜정보가 누락되었습니다';
    }

    return '';
  };

  const isValidSocialJoinParams = (params: SocialJoinRequestParam) => {
    const { ssoId, ssoType, email, isJoinAgeRequirement } = params;

    if (!email) {
      return '이메일이 누락되었습니다';
    }

    if (!ssoId) {
      return '소셜 정보가 누락되었습니다';
    }

    if (!ssoType) {
      return '소셜 정보가 누락되었습니다';
    }

    if (!isJoinAgeRequirement) {
      return '동의가 누락되었습니다';
    }

    return '';
  };

  const { mutateAsync: login } = useMutation((params: SocialLoginParam) =>
    validity(executeSocialLogin, { ...params }, isValidRequestSocialLogin),
  );

  const { mutateAsync: join } = useMutation((params: SocialJoinRequestParam) =>
    validity(executeSocialJoin, { ...params }, isValidSocialJoinParams),
  );

  return {
    login,
    join,
    updateUserProfileImage,
  };
};
