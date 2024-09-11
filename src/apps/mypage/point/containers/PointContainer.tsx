import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { List } from '@pui/list';
import { TitleSection } from '@pui/titleSection';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { PointListItem } from '@pui/pointListItem';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { usePointService } from '../services';
import { PointSummary, LoadingSpinner } from '../components';

/**
 * @todo 추후 PageError에 isFull props 반영시 삭제
 */
const PageErrorWrap = styled.div`
  ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
  ${({ theme }) => theme.mixin.centerItem()};
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

/**
 * MY Page > 적립금리스트 컨테이너
 */
export const PointContainer = styled(({ className }) => {
  const { isApp } = useDeviceDetect();
  const { summary, history, hasMoreHistory, handleLoadHistory, ...status } = usePointService();

  useHeaderDispatch({
    type: 'mweb',
    title: '적립금',
    enabled: !status.isInitializing,
    quickMenus: ['cart', 'menu'],
  });

  /**
   * initializing
   */
  if (status.isInitializing) {
    return <LoadingSpinner />;
  }

  /**
   * API Error Case
   */
  if (status.isInitializingError) {
    return <PageErrorWrap children={<PageError error={status.initializingError} />} />;
  }

  /**
   * Empty Case
   */
  if (isEmpty(history)) {
    return <PageErrorWrap children={<PageError defaultMessage="적립금이 없습니다" />} />;
  }

  return (
    <div className={className}>
      {!isApp && <TitleSection title="적립금" />}
      {summary && <PointSummary {...summary} />}
      <InfiniteScroller
        disabled={hasMoreHistory && !status.isHistoryFetching}
        loading={status.isHistoryFetching}
        onScrolled={handleLoadHistory}
      >
        <List source={history} component={PointListItem} />
      </InfiniteScroller>
    </div>
  );
})`
  padding-bottom: 2.4rem;

  ${List} {
    padding-top: 1.2rem;
    background: ${({ theme }) => theme.color.bg};
  }
`;
