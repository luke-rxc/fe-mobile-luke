import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { List } from '@pui/list';
import { LiveListItem } from '@pui/liveListItem';
import { useEffect } from 'react';
import { NotFound, PageError } from '@features/exception/components';
import { useLiveEndLogService, useLiveInfoService, useLiveScheduleService } from '../services';
import { LiveLoading, LoadIndicator } from '../components';

interface Props {
  liveId: number;
}

export const LiveScheduleContainer = ({ liveId }: Props) => {
  const logService = useLiveEndLogService();
  const { liveInfo, isError, isLoading, isNotEnded, errorInfo } = useLiveInfoService({ liveId });
  const { scheduleLiveList, metaData, hasNextPage, fetchNextPage, getHandlers } = useLiveScheduleService({
    type: 'schedule',
    liveId,
    enabled: !!liveInfo,
    sectionId: liveInfo?.sectionId,
    logService,
  });

  useEffect(() => {
    logService.logLiveListViewPage(liveId.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useHeaderDispatch({
    type: 'mweb',
    title: metaData?.title ?? '',
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  if (isNotEnded) {
    return <NotFound />;
  }

  if (isError) {
    return <PageError {...errorInfo} isFull />;
  }

  if (isLoading) {
    return <LiveLoading />;
  }

  return (
    <>
      <List
        is="div"
        source={scheduleLiveList}
        component={LiveListItem}
        getKey={({ scheduleId }) => `${scheduleId}`}
        getHandlers={getHandlers}
      />
      <LoadIndicator hasMore={hasNextPage} onLoadMore={fetchNextPage} />
    </>
  );
};
