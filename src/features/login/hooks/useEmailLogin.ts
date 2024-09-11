import { useMutation } from '@hooks/useMutation';
import {
  EmailJoinRequestParam,
  EmailVerifyRequestParam,
  executeEmailJoin,
  executeEmailVerify,
  executeLogin,
  executeSendAuthMail,
  LoginParams,
} from '../apis';
import { validity } from '../utils';

export const useEmailLogin = () => {
  const isValidSendAuthMail = (email: string) => {
    if (!email) {
      return '이메일이 누락되었습니다';
    }

    return '';
  };

  const isValidEmailLoginParams = (params: LoginParams): string => {
    const { email, code } = params;

    if (!email) {
      return '이메일이 누락되었습니다';
    }

    if (!code) {
      return '인증코드가 누락되었습니다';
    }

    return '';
  };

  const isValidEmailJoinParams = (params: EmailJoinRequestParam): string => {
    const { email, code, isJoinAgeRequirement } = params;

    if (!email) {
      return '이메일이 누락되었습니다';
    }

    if (!code) {
      return '인증코드가 누락되었습니다';
    }

    if (!isJoinAgeRequirement) {
      return '동의가 누락되었습니다';
    }

    return '';
  };

  const isValidEmailVerifyParams = (params: EmailVerifyRequestParam) => {
    const { email, code } = params;

    if (!email) {
      return '이메일이 누락되었습니다';
    }

    if (!code) {
      return '인증코드가 누락되었습니다';
    }

    return '';
  };

  const { mutateAsync: sendAuthMail } = useMutation((email: string) =>
    validity(executeSendAuthMail, email, isValidSendAuthMail),
  );

  const { mutateAsync: login } = useMutation((params: LoginParams) => {
    return validity(executeLogin, { ...params }, isValidEmailLoginParams);
  });

  const { mutateAsync: join } = useMutation((params: EmailJoinRequestParam) =>
    validity(
      executeEmailJoin,
      {
        ...params,
      },
      isValidEmailJoinParams,
    ),
  );

  const { mutateAsync: verify } = useMutation((params: EmailVerifyRequestParam) =>
    validity(
      executeEmailVerify,
      {
        ...params,
      },
      isValidEmailVerifyParams,
    ),
  );

  return {
    sendAuthMail,
    login,
    join,
    verify,
  };
};
