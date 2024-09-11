import get from 'lodash/get';
import toString from 'lodash/toString';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import {
  toSectionLogModel,
  FeedItemModel,
  GoodsFeedModel,
  ContentFeedModel,
  LiveFeedModel,
  ShowroomFeedModel,
} from '../../models';

export const useFeedLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 홈 섹션 영역 노출 시
   */
  const logSectionView = (params: FeedItemModel) => {
    const parameters = toSectionLogModel(params);

    debug.log(LogEventTypes.HomeImpressionSection, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeImpressionSection,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 더보기 탭 시
   */
  const logSectionMoreTab = (params: FeedItemModel) => {
    const parameters = toSectionLogModel(params);

    debug.log(LogEventTypes.HomeTabSectionMore, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabSectionMore,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 상품 탭 시
   */
  const logSectionGoodsTab = (section: FeedItemModel, goods: GoodsFeedModel['source'][0]) => {
    const parameters = {
      ...toSectionLogModel(section),
      goods_id: goods.id,
      goods_name: goods.goodsName,
      goods_index: get(goods, 'data-index'),
    };

    debug.log(LogEventTypes.HomeTabSectionGoodsThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabSectionGoodsThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 콘텐츠 탭 시
   */
  const logSectionContentsTab = (section: FeedItemModel, content: ContentFeedModel['source'][0]) => {
    const parameters = {
      ...toSectionLogModel(section),
      contents_name: content.title,
      contents_type: String(content.contentType).toLocaleLowerCase(),
      contents_id: toString(get(content, 'data-content-id')),
      contents_index: toString(get(content, 'data-index')),
    };

    debug.log(LogEventTypes.HomeTabSectionContentsThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabSectionContentsThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 쇼룸 탭 시
   */
  const logSectionShowroomTab = (section: FeedItemModel, showroom: ShowroomFeedModel['source'][0]) => {
    const parameters = {
      ...toSectionLogModel(section),
      showroom_name: showroom.title,
      showroom_id: toString(showroom.showroomId),
      showroom_type: toString(get(showroom, 'data-index')),
    };

    debug.log(LogEventTypes.HomeTabSectionShowroomThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabSectionShowroomThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 쇼룸 팔로우 완료 (로그인 유저 Only)
   */
  const logSectionShowroomFollow = (section: FeedItemModel, showroom: ShowroomFeedModel['source'][0]) => {
    const parameters = {
      section_id: toString(section.sectionId),
      showroom_id: toString(showroom.showroomId),
      section_name: section.title,
      section_description: section.subtitle,
      showroom_name: showroom.title,
    };

    debug.log(LogEventTypes.HomeCompleteSectionShowroomFollow, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeCompleteSectionShowroomFollow,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 쇼룸 팔로우 취소 완료 (로그인 유저 Only)
   */
  const logSectionShowroomUnfollow = (section: FeedItemModel, showroom: ShowroomFeedModel['source'][0]) => {
    const parameters = {
      section_id: toString(section.sectionId),
      showroom_id: toString(showroom.showroomId),
      section_name: section.title,
      section_description: section.subtitle,
      showroom_name: showroom.title,
    };

    debug.log(LogEventTypes.HomeCompleteSectionShowroomUnfollow, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeCompleteSectionShowroomUnfollow,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 홈 섹션 영역의 라이브 편성표 콘텐츠 탭 시
   */
  const logSectionLiveTab = (section: FeedItemModel, live: LiveFeedModel['source'][0]) => {
    const parameters = {
      ...toSectionLogModel(section),
      schedule_id: toString(live.scheduleId),
      schedule_name: live.title,
      schedule_index: get(live, 'data-index'),
      onair: live.onAir,
      live_id: live.liveId && toString(live.liveId),
      landing_scheme: toString(get(live, 'data-landing-scheme')),
    };

    debug.log(LogEventTypes.HomeTabSectionScheduleThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeTabSectionScheduleThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 섹션 영역의 개별방송 알림 신청 완료 시 (로그인 유저 only)
   */
  const logSectionLiveOnNoti = (section: FeedItemModel, live: LiveFeedModel['source'][0]) => {
    const parameters = {
      ...toSectionLogModel(section),
      schedule_id: toString(live.scheduleId),
      schedule_name: live.title,
      schedule_index: get(live, 'data-index'),
      showroom_id: toString(get(live, 'data-showroom-id')),
      showroom_name: toString(get(live, 'data-showroom-name')),
      landing_scheme: toString(get(live, 'data-landing-scheme')),
    };

    debug.log(LogEventTypes.HomeCompleteSectionScheduleNotiOptIn, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeCompleteSectionScheduleNotiOptIn,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 섹션 영역의 개별방송 알림 신청 취소 완료 시 (로그인 유저 only)
   */
  const logSectionLiveOffNoti = (section: FeedItemModel, live: LiveFeedModel['source'][0]) => {
    const parameters = {
      ...toSectionLogModel(section),
      schedule_id: toString(live.scheduleId),
      schedule_name: live.title,
      schedule_index: get(live, 'data-index'),
      showroom_id: toString(get(live, 'data-showroom-id')),
      showroom_name: toString(get(live, 'data-showroom-name')),
      landing_scheme: toString(get(live, 'data-landing-scheme')),
    };

    debug.log(LogEventTypes.HomeCompleteSectionScheduleNotiOptOut, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.HomeCompleteSectionScheduleNotiOptOut,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logSectionView,
    logSectionMoreTab,
    logSectionGoodsTab,
    logSectionContentsTab,
    logSectionShowroomTab,
    logSectionShowroomFollow,
    logSectionShowroomUnfollow,
    logSectionLiveTab,
    logSectionLiveOnNoti,
    logSectionLiveOffNoti,
  };
};
