import get from 'lodash/get';
import toString from 'lodash/toString';
import debug from '@utils/debug';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { toGoodsListModel, toGoodsViewLogModel } from '../../models';

export const useGoodsLog = () => {
  /**
   * 상품 클릭(탭) 로깅
   */
  const logGoodsTab = (params: ReturnType<typeof toGoodsListModel>[0], showroomId: number, showroomName: string) => {
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
      goods_id: toString(params.goodsId),
      goods_name: params.goodsName,
      goods_type: toString(get(params, 'data-type')),
      goods_index: toString(get(params, 'data-index')),
      goods_status: toString(get(params, 'data-status')),
    };

    debug.log(LogEventTypes.LogGoodsThumbnailTab, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsThumbnailTab,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 상품 추가 로드 로깅
   */
  const logGoodsLoadMore = (params: ReturnType<typeof toGoodsListModel>, showroomId: number, showroomName: string) => {
    const parameters = {
      showroom_id: toString(showroomId),
      showroom_name: showroomName,
      ...toGoodsViewLogModel(params),
    };

    debug.log(LogEventTypes.LogGoodsLoadMore, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsLoadMore,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 일반 쇼룸 내 Filter 클릭 로깅
   */
  const logShowroomTabFilter = (
    categoryName: string,
    categoryId: number,
    filterIndex: number,
    showroomName: string,
    showroomId: number,
  ) => {
    const parameters = {
      category_name: categoryName,
      category_id: categoryId,
      filter_index: filterIndex,
      showroom_name: showroomName,
      showroom_id: showroomId,
    };

    debug.log(LogEventTypes.LogShowroomTabFilter, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabFilter,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 일반 쇼룸 내 Sorting 변경 로깅
   */
  const logShowroomTabSorting = (showroomName: string, showroomId: number, sortedType: string) => {
    const parameters = {
      showroom_name: showroomName,
      showroom_id: showroomId,
      sorted_type: sortedType,
    };

    debug.log(LogEventTypes.LogShowroomTabSorting, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomTabSorting,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  return { logGoodsTab, logGoodsLoadMore, logShowroomTabFilter, logShowroomTabSorting };
};
