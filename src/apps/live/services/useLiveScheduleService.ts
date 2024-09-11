import { WebLinkTypes } from '@constants/link';
import { getWebLink } from '@utils/link';
import { useHistory } from 'react-router-dom';
import { useModal } from '@hooks/useModal';
import { createElement, useRef } from 'react';
import { TeaserModalContainer as teaserModal } from '@features/schedule/containers';
import { LiveListItemProps } from '@pui/liveListItem';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { getFeedLiveSectionItem } from '../apis';
import {
  ALL_VIEW_LABELING_CRITERIA_FOR_FEED,
  LIVE_END_SCHEDULE_MORE_VIEW_COUNT,
  scheduleFeedQueryKey,
} from '../constants';
import { ScheduleItemModel, toLiveFeedSectionItemModel, toLiveListProps } from '../models';
import { ReturnTypeUseLiveEndLogService } from './useLogService';
import { LiveFeedSectionItemSchema } from '../schemas';

interface Props {
  type: 'liveEnd' | 'schedule';
  liveId: number;
  sectionId?: number;
  enabled: boolean;
  logService: ReturnTypeUseLiveEndLogService;
}

/**
 * 라이브 스케줄 관련 service
 */
export const useLiveScheduleService = ({ type, liveId, enabled, sectionId, logService }: Props) => {
  const { openModal } = useModal();
  const history = useHistory();
  const { openDialogToApp } = useMwebToAppDialog();
  const metaData = useRef<LiveFeedSectionItemSchema['metadata']>();

  const {
    logLiveTabEndpageSchedule: handleLogLiveTabEndpageSchedule,
    logLiveTabEndpageScheduleMore: handleLogLiveTabEndpageScheduleMore,
  } = logService;

  const {
    data: scheduleData,
    isLoading,
    hasNextPage,
    ...liveFeedQuery
  } = useInfiniteQuery(
    [scheduleFeedQueryKey, sectionId, type],
    ({ pageParam: nextParameter }) =>
      getFeedLiveSectionItem({ size: LIVE_END_SCHEDULE_MORE_VIEW_COUNT, nextParameter, sectionId }),
    {
      select: ({ pages, ...params }) => {
        metaData.current = pages[0].metadata;
        return { pages: toLiveFeedSectionItemModel(pages), ...params };
      },
      getNextPageParam: ({ nextParameter }) => nextParameter,
      enabled,
    },
  );

  /**
   * 컨텐츠 페이지 이동
   */
  const handleClickOpenContents = (item: ScheduleItemModel) => {
    return (event?: React.MouseEvent) => {
      event?.stopPropagation();

      if (item.landingType.match(/STORY|SCHEDULE_TEASER/)) {
        handleLogLiveTabEndpageSchedule({
          contentsId: liveId.toString(),
          showroomId: item.showRoom.id.toString(),
          showroomName: item.showRoom.name.toString(),
          scheduleId: item.id.toString(),
          scheduleName: item.title,
          scheduleIndex: item.itemIndex,
          liveId: item.liveSchedule.live.id.toString(),
          landingScheme: item.scheme,
        });
      }

      switch (item.landingType) {
        case 'STORY':
          history.push(
            getWebLink(WebLinkTypes.CONTENT, {
              contentType: item.landingStory.contentsType.toLowerCase(),
              contentCode: item.landingStory.code,
            }),
          );
          break;
        case 'SCHEDULE_TEASER':
          openModal({
            nonModalWrapper: true,
            render: (props) => createElement(teaserModal, { scheduleId: item.id, ...props }),
          });
          break;
        default:
      }
    };
  };

  const handleClickScheduleMore = () => {
    handleLogLiveTabEndpageScheduleMore();
  };

  const getHandlers = () => {
    return {
      onClickLink: (event: React.MouseEvent<HTMLAnchorElement>, { scheduleId }: LiveListItemProps) => {
        event.preventDefault();
        const item = scheduleData?.pages?.find(({ liveSchedule }) => liveSchedule.live.id === scheduleId);
        if (item) {
          handleClickOpenContents(item)(event);
        }
      },
      onChangeFollow: () => {
        openDialogToApp('', {
          actionProps: {
            kind: AppPopupActionKind.LIVE_FOLLOW,
          },
        });
      },
    };
  };

  return {
    ...liveFeedQuery,
    hasNextPage,
    metaData: metaData.current,
    scheduleItems: scheduleData?.pages || [],
    scheduleLiveList: toLiveListProps(scheduleData?.pages ?? []),
    isLoading,
    scheduleMoreLink:
      (scheduleData?.pages ?? []).length >= ALL_VIEW_LABELING_CRITERIA_FOR_FEED ? `/live/${liveId}/schedule` : null,
    handleClickOpenContents,
    handleClickScheduleMore,
    getHandlers,
  };
};
