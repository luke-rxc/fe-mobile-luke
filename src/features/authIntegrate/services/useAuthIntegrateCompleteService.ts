import { useEffect, useState } from 'react';
import { useQueryString } from '@hooks/useQueryString';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { postUserAdultInfo, PostUserAdultInfoParams } from '../apis';
import { AdultMessage, AuthStatusType, AuthErrorCode } from '../constants';

interface QueryParam {
  imp_uid: string;
  success: string | boolean; // true, false
}

export interface AuthStatusProps {
  status: AuthStatusType;
  code?: string;
  message?: string;
}

export const useAuthIntegrateCompleteService = () => {
  /** Imp 모듈에서 Query String으로 넘겨준 값 */
  const queryString = useQueryString<QueryParam>();
  const { imp_uid: impUid, success } = queryString;
  const [authStatus, setAuthStatus] = useState<AuthStatusProps>({
    status: AuthStatusType.LOADING,
  });

  /** imp 인증모듈 연동 성공여부 & 유효한 imgUid 값이 들어왔는지 */
  const isImpSuccess = !!(success && success === 'true') && !!impUid;

  /** 서버내 인증정보 저장 */
  const { mutateAsync } = useMutation(
    ({ impUid: impUidParam, checkAge }: PostUserAdultInfoParams) =>
      postUserAdultInfo({
        impUid: impUidParam,
        checkAge,
      }),
    {
      onSuccess: () => {
        setAuthStatus({
          status: AuthStatusType.SUCCESS,
        });
      },
      onError: (error: ErrorModel) => {
        // error 처리
        setAuthStatus({
          status: AuthStatusType.ERROR,
          code: error.data?.code ?? '',
          message: error.data?.message ?? AdultMessage.ERROR_AUTH_FAIL,
        });
      },
    },
  );

  useEffect(() => {
    if (isImpSuccess && impUid) {
      /**
       * 인증 저장 연동
       * @description Dev 환경에서만 checkAge 적용
       */
      mutateAsync({ impUid, checkAge: 19 });
    } else {
      // error 처리
      // 취소 케이스
      setAuthStatus({
        status: AuthStatusType.ERROR,
        code: AuthErrorCode.CANCEL_AUTH,
        message: AdultMessage.CANCEL_AUTH,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    /** Imp 모듈에서 Query String으로 넘겨준 값 */
    queryString,
    /** imp 인증모듈 연동 성공여부 */
    isImpSuccess,
    /** 성인인증 상태 */
    authStatus,
  };
};
