import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';
import { getContentType } from '@constants/content';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import { useLoadingStore } from '@stores/useLoadingStore';
import { VoteCard } from '../components';
import { useLogService, useVoteCertificationService } from '../services';

export const ContentVoteCertificationContainer = () => {
  const { contentType, code: contentCode, voteId } = useParams<{ contentType: string; code: string; voteId: string }>();
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const { logVoteCertificationInit, logVoteShareButtonTab } = useLogService();
  const { isApp } = useDeviceDetect();
  const { openShare, showToastMessage } = useWebInterface();

  useHeaderDispatch({
    type: 'mweb',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  const {
    voteData,
    error,
    isError: isPageError,
    isLoading,
    handleGetBenefit,
  } = useVoteCertificationService({ voteId: +voteId, contentType, contentCode });

  const handleShare = useCallback(() => {
    logVoteShareButtonTab({ contentCode, voteId });
    openShare(
      {
        type: 'CONTENT',
        contentType: getContentType(contentType),
        code: contentCode,
      },
      {
        onSuccess: ({ type }) => {
          if (type === 'clipboard') {
            showToastMessage({
              message: '링크를 복사했습니다',
            });
          }
        },
      },
    );

    if (voteData && !voteData.isShared) {
      handleGetBenefit();
    }
  }, [
    contentCode,
    contentType,
    handleGetBenefit,
    logVoteShareButtonTab,
    openShare,
    showToastMessage,
    voteData,
    voteId,
  ]);

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    logVoteCertificationInit({ contentCode, voteId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return null;
  }

  if (isPageError || !voteData) {
    return <PageError description={error?.data?.message ?? '투표 인증서를 찾을 수 없습니다'} />;
  }

  return (
    <ContainerLayer
      className={classNames({
        'is-app': isApp,
      })}
    >
      <div className="layout certification">
        <div className="card-box">
          <VoteCard vote={voteData} />
        </div>
      </div>
      <div className="btn-box">
        <Button variant="primary" size="large" bold onClick={handleShare}>
          {voteData.isShared ? '공유' : '공유하고 2표 더 받기'}
        </Button>
      </div>
    </ContainerLayer>
  );
};

const ContainerLayer = styled('div')`
  &.is-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }

  & .layout {
    width: 100%;
    max-width: 41.4rem;
    margin: 0 auto;
    & .card-box {
      // 버튼 영역 겹치지 않도록 pb 사이즈 처리
      padding: 2.4rem 2.4rem 10.4rem 2.4rem;
    }
  }

  & .btn-box {
    position: fixed;
    width: 100%;
    padding: 0 2.4rem;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};

    ${Button} {
      width: 100%;
    }
  }
`;
