import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { env } from '@env';
import { useLoadingStore } from '@stores/useLoadingStore';
import { useWebInterface } from '@hooks/useWebInterface';
import { useQueryString } from '@hooks/useQueryString';
import { useAuthIntegrateCompleteService } from '@features/authIntegrate/services';
import { AuthStatusType, AuthErrorCode, AdultMessage } from '@features/authIntegrate/constants';
import { useAuthPageClose } from '@features/authIntegrate/hooks';
import { userAgent } from '@utils/ua';

// imp_051146132201

export const AuthAdultCompleteContainer: React.FC = () => {
  const { authStatus, isImpSuccess } = useAuthIntegrateCompleteService();
  const { closePage } = useAuthPageClose();
  const { alert } = useWebInterface();
  const { status, message: authErrorMessage, code: authErrorCode } = authStatus;

  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const [mounted, setMounted] = useState(false);

  const title = isImpSuccess ? AdultMessage.PROGRESS_AUTH : AdultMessage.CANCEL_AUTH;

  const showAlert = useCallback(async (alertMessage: string) => alert({ message: alertMessage }), [alert]);

  const { isInstagramInApp } = userAgent();
  const queryString = useQueryString<{ fallback?: string }>();

  const redirectFallback = () => {
    const pathName = queryString.fallback ? decodeURIComponent(queryString.fallback) : '';
    window.location.href = `${env.endPoint.baseUrl}${pathName}`;
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (status !== AuthStatusType.LOADING) {
        hideLoading();
        const isAuthSuccess = status === AuthStatusType.SUCCESS;

        // 미성년 오류 & 취소한 경우가 아니라면 Alert 활성화 후 Close
        if (
          !isAuthSuccess &&
          authErrorCode !== AuthErrorCode.UNDER_AGE &&
          authErrorCode !== AuthErrorCode.CANCEL_AUTH
        ) {
          if (await showAlert(authErrorMessage ?? AdultMessage.ERROR_AUTH_FAIL)) {
            if (isInstagramInApp) {
              redirectFallback();
              return;
            }
            closePage({
              isAuthSuccess,
              message: AdultMessage.CANCEL_AUTH,
            });
          }
          return;
        }

        if (isInstagramInApp) {
          redirectFallback();
          return;
        }
        closePage({
          isAuthSuccess,
          code: authErrorCode ?? null,
          message: authErrorMessage ?? AdultMessage.CANCEL_AUTH,
        });
      }
    };
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    window.scrollTo(0, 1);
    setMounted(true);
    showLoading();

    return () => {
      hideLoading();
      setMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ContainerStyled className="loading">
      <p className="title-section">{title}</p>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.main`
  .title-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.black};
    padding: 3.2rem 1.6rem 4rem 1.6rem;
    font: ${({ theme }) => theme.fontType.t24B};
  }
`;
