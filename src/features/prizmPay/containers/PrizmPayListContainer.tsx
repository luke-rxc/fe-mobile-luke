import styled, { createGlobalStyle } from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import { createElement, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { useLoading } from '@hooks/useLoading';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { toAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useModal } from '@hooks/useModal';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import isEmpty from 'lodash/isEmpty';
import { emitClearReceiveValues } from '@utils/webInterface';
import { useAuth } from '@hooks/useAuth';
import classNames from 'classnames';
import { Button } from '@pui/button';
import { CALL_WEB_EVENT, PRIZM_PAY_PAGE_LOAD_TYPE, PRIZM_PAY_REGISTER_ENTRY_URL } from '../constants';
import { usePrizmPayService } from '../services';
import { PrizmPayEventBanner, PrizmPayListContent } from '../components';
import { DrawerPrizmPayAliasContainer } from './DrawerPrizmPayAliasContainer';
import { DrawerPrizmPayRegisterContainer } from './DrawerPrizmPayRegisterContainer';
import { PrizmPayModel } from '../models';
import { DrawerPrizmPayRegisterEntryContainer } from './DrawerPrizmPayRegisterEntryContainer';

export const PrizmPayListContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const {
    payList,
    pageLoad,
    isFetched,
    bannerList,
    handleRetry,
    refetchPayList,
    handleActions: onActions,
    logViewPrizmPay,
    logAddPrizmPay,
    logEditCardAlias,
    showAlert,
    handleComplete,
  } = usePrizmPayService();
  const { isApp } = useDeviceDetect();
  const { initialValues, receiveValues, showToastMessage, setTopBar } = useWebInterface();
  const { openModal } = useModal();
  const playIdRef = useRef<number | null>(null);
  const { userInfo, refetchUserInfo } = useAuth();
  const isShowBanner = (userInfo?.isPrizmPayReRegistrationRequired ?? false) && bannerList.length > 0;
  const eventBannerClass = classNames('event-banner', { show: isShowBanner });
  const moveEffectClass = classNames('move-up', { 'banner-hidden': !isShowBanner });
  const [isAuctionEntry, setIsAuctionEntry] = useState(false);

  const openPrizmPayRegisterEntry = () => {
    if (isApp) {
      toAppLink(AppLinkTypes.WEB, { landingType: 'modal', url: PRIZM_PAY_REGISTER_ENTRY_URL, topBarHidden: 'true' });
      return;
    }

    openModal({
      nonModalWrapper: true,
      render: (props) => createElement(DrawerPrizmPayRegisterEntryContainer, { ...props }),
    });
  };

  const handleEdit = (payId: number) => {
    if (isApp) {
      toAppLink(AppLinkTypes.MANAGE_PAY_EDIT, { payId });
      return;
    }

    openModal({
      nonModalWrapper: true,
      render: (props) => createElement(DrawerPrizmPayAliasContainer, { ...props, prizmPayId: payId }),
    });
  };

  const handlePayAdd = useCallback(async () => {
    if ((payList ?? []).length >= 20) {
      await showAlert('카드는 최대 20개까지 등록할 수 있습니다');
      return;
    }

    if (isApp) {
      toAppLink(AppLinkTypes.MANAGE_PAY_REGISTER);
      return;
    }

    openModal({
      nonModalWrapper: true,
      render: (props) => createElement(DrawerPrizmPayRegisterContainer, { ...props }),
    });
    // eslint-disable-next-line
  }, [payList, history, isApp]);

  const handleActions = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>, payId: number) => {
      if (e.target.value === 'update') {
        handleEdit(payId);
      } else {
        await onActions(e, payId);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payList],
  );

  const handleRefetch = async (action: string, data: PrizmPayModel) => {
    if (action === 'add') {
      playIdRef.current = data.id;
    }
    await refetchPayList();
  };

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    quickMenus: ['cart', 'menu'],
    title: '프리즘페이 관리',
  });

  useEffect(() => {
    if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.LOADING) {
      showLoading();
      return;
    }

    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues;
      if (type === CALL_WEB_EVENT.ON_PAY_CLOSE) {
        const { message, action, pay } = data;
        handleRefetch(action, pay);
        showToastMessage({ message });

        if (action === 'edit') {
          logEditCardAlias();
        }

        if (action === 'add') {
          logAddPrizmPay();
        }

        if (userInfo?.isPrizmPayReRegistrationRequired) {
          refetchUserInfo();
        }
      }

      if (type === CALL_WEB_EVENT.ON_REGISTER_ENTRY_CLOSE) {
        handlePayAdd();
      }

      !isApp && emitClearReceiveValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues, refetchPayList]);

  useEffect(() => {
    if (isApp && !isEmpty(initialValues)) {
      const { type } = initialValues;

      if (type === CALL_WEB_EVENT.ON_AUCTION_ENTRY_OPEN) {
        setIsAuctionEntry(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    if (isAuctionEntry) {
      setTopBar({
        title: '결제 수단',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuctionEntry]);

  useEffect(() => {
    if (isFetched) {
      logViewPrizmPay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  useEffect(() => {
    let timerId: number | null = null;

    if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.SUCCESS && userInfo?.isPrizmPayReRegistrationRequired) {
      timerId = window.setTimeout(() => {
        openPrizmPayRegisterEntry();
      }, 300);
    }

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }

      if (!isApp) {
        window.location.hash = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad]);

  if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.LOADING) {
    return null;
  }

  if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.NORMAL_ERROR) {
    const normalExceptionProps = {
      isFull: true,
      title: '일시적인 오류가 발생하였습니다',
      description: '잠시 후 다시 시도해주세요',
      actionLabel: '다시 시도',
      onAction: handleRetry,
    };

    return <PageError {...normalExceptionProps} />;
  }

  if (payList.length === 0) {
    return (
      <PageError
        isFull
        title="등록된 카드가 없습니다"
        description="카드를 등록하고 간편하게 결제해보세요"
        actionLabel="카드 등록"
        onAction={handlePayAdd}
      />
    );
  }

  return (
    <ContainerStyled>
      {isAuctionEntry && <GlobalStyle />}
      <PrizmPayEventBannerStyled className={eventBannerClass} list={bannerList} onClick={openPrizmPayRegisterEntry} />
      <MoveUpEffectStyled className={moveEffectClass}>
        <PrizmPayListContent
          payList={payList}
          onAdd={handlePayAdd}
          onActions={handleActions}
          playId={playIdRef.current ?? -1}
          isAuctionEntry={isAuctionEntry}
        />
      </MoveUpEffectStyled>
      {isAuctionEntry && (
        <div className="button-wrapper">
          <Button bold block variant="primary" size="large" onClick={handleComplete}>
            완료
          </Button>
        </div>
      )}
    </ContainerStyled>
  );
};

type MoveUpEffectStyledProps = HTMLAttributes<HTMLDivElement>;

const MoveUpEffectStyled = styled(({ children, ...rest }: MoveUpEffectStyledProps) => {
  return <div {...rest}>{children}</div>;
})`
  ${({ theme }) => theme.mixin.safeArea('padding-bottom', 24)};

  position: absolute;
  transform: translateY(12.4rem);
  width: 100%;

  &.banner-hidden {
    transform: translateY(0);
    transition: transform 400ms ease-in-out;
  }
`;

const PrizmPayEventBannerStyled = styled(PrizmPayEventBanner)`
  position: absolute;
  width: 100%;
  opacity: 0;
  transition: opacity 200ms ease-in-out;

  &.show {
    opacity: 1;
  }
`;

const ContainerStyled = styled.div`
  & .page-title-box {
    padding: 2.4rem 2.4rem 2.2rem 2.4rem;
  }

  .page-title {
    font: ${({ theme }) => theme.fontType.t32B};
    line-height: 4.2rem;
  }

  .event-banner {
    padding: 0 2.4rem 1.2rem 2.4rem;
  }

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    padding: 0 2.4rem;
    width: 100%;
    z-index: 1;
  }
`;

const GlobalStyle = createGlobalStyle`
  html {
    height: 100vh;
  }
`;
