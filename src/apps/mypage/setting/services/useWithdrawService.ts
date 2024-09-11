import { WebLinkTypes } from '@constants/link';
import { useErrorService } from '@features/exception/services';
import { useLogout } from '@features/login/hooks';
import { useAuth } from '@hooks/useAuth';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { ErrorModel } from '@utils/api/createAxios';
import { getWebLink } from '@utils/link';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteUser, getWithdrawReasons } from '../apis';
import { checkError } from '../utils';

export interface HistoryStateProps {
  code: string;
  text?: string;
}

export interface DeleteUserProps {
  code: string;
  text?: string;
}

export const useWithdrawService = () => {
  const history = useHistory();
  const { getIsLogin, refetchUserInfo } = useAuth();
  const { pathname, state } = useLocation<HistoryStateProps>();
  const { logout } = useLogout();
  const { confirm, alert } = useWebInterface();
  const { handleError } = useErrorService();
  // 탈퇴 사유 코드
  const [reasonCode, setReasonCode] = useState<string>('');
  // 탈퇴 내용 확인
  const [isChecked, setIsChecked] = useState<boolean>(false);
  // 탈퇴 처리 유무
  const [isConfirm, setIsConfirm] = useState<boolean>(!getIsLogin());
  // 탈퇴 사유 코드 확인
  const hasReasonCode = !!state;

  const {
    isLoading,
    error: reasonError,
    isError,
    data,
  } = useQuery(['reason-items'], getWithdrawReasons, {
    onError: async (error: ErrorModel) => {
      if (checkError(error)) {
        const result = await confirm(
          error.data?.message
            ? {
                title: error.data.message,
                message: '1:1문의를 이용해주세요',
                confirmButtonTitle: '1:1 문의',
              }
            : {
                title: '1:1문의를 이용해주세요',
                confirmButtonTitle: '1:1 문의',
              },
        );
        if (result) {
          history.push(getWebLink(WebLinkTypes.CS_QNA_LIST));
        } else {
          history.replace(getWebLink(WebLinkTypes.MYPAGE_ACCOUNT));
        }
      }
    },
    enabled: pathname === getWebLink(WebLinkTypes.MYPAGE_WITHDRAW),
  });

  const { mutate: deleteUserMutate } = useMutation(
    ({ code, text }: DeleteUserProps) => deleteUser({ reasonCode: code, reason: text }),
    {
      onSuccess: async () => {
        setIsConfirm(true);
        await logout();
        await alert({ message: '로그아웃 되었습니다' });
        refetchUserInfo();
      },
      onError: async (error: ErrorModel) => {
        if (checkError(error)) {
          const result = await confirm(
            error.data?.message
              ? {
                  title: error.data.message,
                  message: '1:1문의를 이용해주세요',
                  confirmButtonTitle: '1:1 문의',
                }
              : {
                  title: '1:1문의를 이용해주세요',
                  confirmButtonTitle: '1:1 문의',
                },
          );
          if (result) {
            history.push(getWebLink(WebLinkTypes.CS_QNA_LIST));
          } else {
            history.replace(getWebLink(WebLinkTypes.MYPAGE_ACCOUNT));
          }
        } else {
          handleError({
            error,
          });
        }
      },
    },
  );

  const handleChangeReasonCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReasonCode(e.target.value);
  };

  const handleWithdrawConfirm = (code: string, text?: string) => {
    history.push(getWebLink(WebLinkTypes.MYPAGE_WITHDRAW_CONFIRM), { code, text });
  };

  const handleCheckReasonCode = () => {
    if (!hasReasonCode) {
      history.replace(getWebLink(WebLinkTypes.MYPAGE_WITHDRAW));
    }
  };

  const handleChecked = () => {
    setIsChecked(!isChecked);
  };

  const handleConfirm = () => {
    const { code, text } = state;
    deleteUserMutate({ code, text });
  };

  const handleGoHome = () => {
    history.push(getWebLink(WebLinkTypes.HOME));
  };

  return {
    isLoading,
    reasonError,
    isError,
    reasonItems: data || [],
    reasonCode,
    isChecked,
    isConfirm,
    hasReasonCode,
    handleChangeReasonCode,
    handleWithdrawConfirm,
    handleCheckReasonCode,
    handleChecked,
    handleConfirm,
    handleGoHome,
  };
};
