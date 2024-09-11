import { GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import get from 'lodash/get';
import toString from 'lodash/toString';
import { SectionItemProps } from '../../components';
import { LogEventTypes } from '../../constants';

export const useSectionLog = () => {
  /**
   * 쇼룸 섹션 Load more 시
   */
  const logImpressionSection = (params: SectionItemProps, showroomId: number, showroomName: string) => {
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
      section_id: toString(params.sectionId),
      section_name: params.title,
      section_description: params.subtitle,
      section_index: toString(get(params, 'data-index')),
      section_type: params.type,
      header_id: params.headerList.map((item) => item.id),
      header_name: params.headerList.map((item) => item.title),
    };

    debug.log(LogEventTypes.LogShowroomSectionLoadMore, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomSectionLoadMore,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 섹션 내 상품 클릭 시
   */
  const logTabSectionGoods = (
    section: SectionItemProps,
    goods: GoodsCardSmallProps,
    showroomId: number,
    showroomName: string,
  ) => {
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
      section_id: toString(section.sectionId),
      section_name: section.title,
      section_description: section.subtitle,
      section_index: toString(get(section, 'data-index')),
      goods_id: goods.id,
      goods_name: goods.goodsName,
      goods_type: toString(get(goods, 'data-type')),
      goods_status: toString(get(goods, 'data-status')),
      goods_index: toString(get(goods, 'data-index')),
      header_id: section.headerList.map((item) => item.id),
    };

    debug.log(LogEventTypes.LogShowroomSectionGoodsTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomSectionGoodsTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 섹션 전체 보기 클릭 시
   */
  const logTabSectionMore = (section: SectionItemProps, showroomId: number, showroomName: string) => {
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
      section_id: toString(section.sectionId),
      section_name: section.title,
      section_description: section.subtitle,
      section_index: toString(get(section, 'data-index')),
      section_type: section.type,
      header_id: section.headerList.map((item) => item.id),
    };

    debug.log(LogEventTypes.LogShowroomSectionMoreTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomSectionMoreTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 섹션 내 헤더 클릭 시
   */
  const logTabSectionHeader = (
    section: SectionItemProps,
    id: number,
    index: number,
    title: string,
    showroomId: number,
    showroomName: string,
  ) => {
    const parameters = {
      header_id: toString(id),
      header_index: toString(index + 1),
      header_name: title,
      section_id: toString(section.sectionId),
      section_index: toString(get(section, 'data-index')),
      section_name: section.title,
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
    };

    debug.log(LogEventTypes.LogShowroomTabSectionHeader, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabSectionHeader,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  return {
    logImpressionSection,
    logTabSectionGoods,
    logTabSectionMore,
    logTabSectionHeader,
  };
};
