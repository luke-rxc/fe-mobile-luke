import { Button } from '@pui/button';
import styled from 'styled-components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { PageError } from '@features/exception/components';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { ShowroomItem } from '../components';
import { useMemberFollowService } from '../services';

export const MemberFollowContainer = () => {
  const {
    showroomList,
    checkedShowroomList,
    showroomError,
    isShowroomError,
    isShowroomLoading,
    isShowroomFetching,
    hasMoreShowroom,
    handleLoadShowroom,
    handleClickShowroom,
    handleClickComplete,
    tappedToolbarButton,
  } = useMemberFollowService();

  const loading = useLoadingSpinner(isShowroomLoading);
  const isShowCtaButton = checkedShowroomList.length > 0;

  if (loading) {
    return null;
  }

  if (isShowroomError) {
    <PageError error={showroomError} />;
  }

  return (
    <Container>
      <Title>
        <h2 className="title">어떤 쇼룸이 마음에 드나요?</h2>
        <p className="description">쇼룸을 팔로우하고 맞춤 소식과 혜택을 받아보세요</p>
      </Title>

      {showroomList && (
        <InfiniteScroller
          disabled={!hasMoreShowroom}
          infiniteOptions={{ rootMargin: '50px' }}
          loading={isShowroomFetching}
          onScrolled={handleLoadShowroom}
        >
          <List>
            {showroomList.map((showroom, index) => (
              <ShowroomItem
                key={showroom.id}
                index={index}
                showroom={showroom}
                checkedShowroomList={checkedShowroomList}
                tappedToolbarButton={tappedToolbarButton}
                onClick={handleClickShowroom}
              />
            ))}
          </List>
        </InfiniteScroller>
      )}

      <ConfirmButton className={isShowCtaButton ? 'is-show' : ''}>
        <Button bold block variant="primary" size="large" children="완료" onClick={handleClickComplete} />
      </ConfirmButton>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  max-width: 41.4rem;
  padding-bottom: calc(9.6rem + env(safe-area-inset-bottom));
  margin: 0 auto;
`;

const Title = styled.div`
  padding: ${({ theme }) => `5.6rem ${theme.spacing.s24} 3.2rem`};
  text-align: center;
  color: ${({ theme }) => theme.color.black};

  h2 {
    font: ${({ theme }) => theme.fontType.titleB};
  }

  p {
    margin-top: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.medium};
  }
`;

const List = styled.ul`
  display: grid;
  margin: 0 2.4rem;
  grid-template-columns: repeat(2, calc(50% - ${({ theme }) => theme.spacing.s8}));
  gap: ${({ theme }) => theme.spacing.s16};
`;

const ConfirmButton = styled.div`
  z-index: 1;
  opacity: 0;
  ${({ theme }) => theme.fixed({ r: 0, b: 0, l: 0 })};
  max-width: 41.4rem;
  margin: 0 auto;
  padding-right: 2.4rem;
  padding-bottom: calc(2.4rem + env(safe-area-inset-bottom));
  padding-left: 2.4rem;
  transform: translateY(100%);
  transition: transform 0.2s, opacity 0.2s;

  &.is-show {
    opacity: 1;
    transform: translateY(0%);
  }
`;
