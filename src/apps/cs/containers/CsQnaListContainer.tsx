import { useEffect } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { UniversalLinkTypes } from '@constants/link';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLink } from '@hooks/useLink';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { Button } from '@pui/button';
import { QnaListItem } from '../components';
import { useQnaListService, useLogService } from '../services';

export const CsQnaListContainer = () => {
  const { getLink, toLink } = useLink();

  const { requests, error, isError, isLoading } = useQnaListService();

  const handleClickRegister = () => {
    toLink(getLink(UniversalLinkTypes.CS_QNA_REGISTER_GENERAL));
  };

  const { logMyQnaViewQna } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '1:1 문의',
    quickMenus: ['cart', 'menu'],
    enabled: true,
  });

  useEffect(() => {
    logMyQnaViewQna();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = useLoadingSpinner(isLoading);

  if (loading) {
    return null;
  }

  if (isError) {
    return <PageError error={error} />;
  }

  if (isEmpty(requests)) {
    return <PageError description="등록된 문의가 없습니다" actionLabel="문의 등록" onAction={handleClickRegister} />;
  }

  return (
    <div>
      {requests && (
        <>
          <ListContainer>
            {requests?.map((request) => (
              <li key={request.requestId} className="qna-list-item">
                <QnaListItem {...request} />
              </li>
            ))}
          </ListContainer>
          <ButtonWrapper>
            <Button variant="primary" size="large" haptic="tapMedium" block bold onClick={handleClickRegister}>
              등록
            </Button>
          </ButtonWrapper>
        </>
      )}
    </div>
  );
};

const ListContainer = styled.ul`
  box-sizing: border-box;
  min-height: 100vh;
  ${({ theme }) => theme.mixin.safeArea('padding-top')};
  ${({ theme }) => theme.mixin.safeArea('padding-bottom')};

  .qna-list-item:last-child {
    margin-bottom: 10.4rem;
  }
`;

const ButtonWrapper = styled.div`
  position: fixed;
  width: 100%;
  padding: 2.4rem;
  ${({ theme }) => theme.mixin.safeArea('bottom')};

  z-index: 1;
`;
