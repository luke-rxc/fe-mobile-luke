import get from 'lodash/get';
import head from 'lodash/head';
import toString from 'lodash/toString';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { SectionMetaDataSchema } from '../../schemas';
import { SectionContentModel } from '../../models';

/**
 * 셕션 > 콘텐츠 리스트 이벤트 로깅
 */
export const useSectionContentLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 콘텐츠 리스트 > 페이지 진입 시
   */
  const logViewPage = (params: SectionMetaDataSchema) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
    };

    debug.log(LogEventTypes.LogContentListViewPage, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogContentListViewPage,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 콘텐츠 리스트 > 콘텐츠 클릭(탭) 시
   */
  const logContentListTabContent = (params: ArrayElement<SectionContentModel>) => {
    const parameters = {
      section_id: get(params, 'data-section-id'),
      section_name: get(params, 'data-section-name'),
      section_description: get(params, 'data-section-description'),

      contents_id: toString(params.id),
      contents_name: params.name,
      contents_type: params.contentType,
      contents_index: get(params, 'data-index'),
    };

    debug.log(LogEventTypes.LogContentListTabContent, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogContentListTabContent,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 콘텐츠 리스트 > 콘텐츠 이미지 노출 시
   */
  const logContentListImpression = (params: SectionContentModel) => {
    const parameters = {
      section_id: get(head(params), 'data-section-id'),
      section_name: get(head(params), 'data-section-name'),
      section_description: get(head(params), 'data-section-description'),

      ...params.reduce<Record<string, unknown[]>>(
        (list, item) => ({
          contents_id: [...get(list, 'contents_id', []), toString(item.id)],
          contents_name: [...get(list, 'contents_name', []), item.name],
          contents_type: [...get(list, 'contents_type', []), item.contentType],
          contents_index: [...get(list, 'contents_index', []), get(item, 'data-index')],
        }),
        {},
      ),
    };

    debug.log(LogEventTypes.LogContentListImpression, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogContentListImpression,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logViewPage,
    logContentListTabContent,
    logContentListImpression,
  };
};
