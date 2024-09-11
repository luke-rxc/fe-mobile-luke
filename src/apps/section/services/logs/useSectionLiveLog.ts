import get from 'lodash/get';
import head from 'lodash/head';
import toString from 'lodash/toString';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { SectionMetaDataSchema } from '../../schemas';
import { SectionLiveModel } from '../../models';

/**
 * 셕션 > 라이브 리스트 이벤트 로깅
 */
export const useSectionLiveLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 라이브 리스트 > 페이지 진입 시
   */
  const logViewPage = (params: SectionMetaDataSchema) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
    };

    debug.log(LogEventTypes.LogLiveListViewPage, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogLiveListViewPage,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 라이브 리스트 > 알림 신청 시
   */
  const logLiveListOptIn = (params: ArrayElement<SectionLiveModel>) => {
    const parameters = {
      schedule_id: toString(params.scheduleId),
      schedule_name: params.title,
      schedule_index: get(params, 'data-index'),
      live_id: params.liveId,
      showroom_id: params.showroomId,
      showroom_name: params.showroomName,
      section_name: get(params, 'data-section-name'),
      section_id: get(params, 'data-section-id'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogLiveListOptIn, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogLiveListOptIn,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 라이브 리스트 > 알림 신청 해제 시
   */
  const logLiveListOptOut = (params: ArrayElement<SectionLiveModel>) => {
    const parameters = {
      schedule_id: toString(params.scheduleId),
      schedule_name: params.title,
      schedule_index: get(params, 'data-index'),
      live_id: params.liveId,
      showroom_id: params.showroomId,
      showroom_name: params.showroomName,
      section_name: get(params, 'data-section-name'),
      section_id: get(params, 'data-section-id'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogLiveListOptOut, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogLiveListOptOut,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 라이브 리스트 > 라이브 클릭(탭) 시
   */
  const logLiveListTabThumbnail = (params: ArrayElement<SectionLiveModel>) => {
    const parameters = {
      schedule_id: params.scheduleId,
      schedule_name: params.title,
      schedule_index: get(params, 'data-index'),
      live_id: params.liveId,
      onair: params.onAir,
      landing_scheme: params.web,
      section_id: get(params, 'data-section-id'),
      section_name: get(params, 'data-section-name'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogLiveListTabThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogLiveListTabThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 라이브 리스트 > 라이브품 이미지 노출 시
   */
  const logLiveListImpressionThumbnail = (params: SectionLiveModel) => {
    const parameters = {
      section_id: get(head(params), 'data-section-id'),
      section_name: get(head(params), 'data-section-name'),
      section_description: get(head(params), 'data-section-description'),

      ...params.reduce<Record<string, unknown[]>>(
        (list, item) => ({
          schedule_id: [...(list.schedule_id || []), item.scheduleId],
          schedule_name: [...(list.schedule_name || []), item.title],
          schedule_index: [...(list.schedule_index || []), get(item, 'data-index')],
          live_id: [...(list.live_id || []), item.liveId],
          onair: [...(list.onair || []), item.onAir],
          landing_scheme: [...(list.landing_scheme || []), item.web],
        }),
        {},
      ),
    };

    debug.log(LogEventTypes.LogLiveListImpressionThumbnail, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogLiveListImpressionThumbnail,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logViewPage,
    logLiveListOptIn,
    logLiveListOptOut,
    logLiveListTabThumbnail,
    logLiveListImpressionThumbnail,
  };
};
