import { AppLogTypes, WebLogTypes } from '@constants/log';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { LogEventTypes } from '../../constants';

const debug = createDebug();

export const useShowroomRegionLog = () => {
  /**
   * 쇼룸 지역/날짜 리스트 > 페이지 진입 시
   */
  const logViewPage = ({ regionName, searchNights }: { regionName: string; searchNights: string }) => {
    const parameters = {
      region_name: regionName,
      search_nights: searchNights,
    };

    debug.log(LogEventTypes.LogGoodsListViewPage, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListViewPage,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 상품 노출 시
   */
  const logImpressionGoods = ({
    goodsId,
    goodsName,
    goodsIndex,
    regionName,
    searchNights,
  }: {
    goodsId: number[];
    goodsName: string[];
    goodsIndex: number[];
    regionName: string;
    searchNights: string;
  }) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
      region_name: regionName,
      search_nights: searchNights,
    };

    debug.log(LogEventTypes.LogGoodsListImpressionGoods, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListImpressionGoods,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 필터(카테고리) 클릭 시
   */
  const logTabFilter = ({
    categoryName,
    categoryId,
    filterIndex,
    regionName,
    searchNights,
  }: {
    categoryName: string;
    categoryId: string;
    filterIndex: number;
    regionName: string;
    searchNights: string;
  }) => {
    const parameters = {
      category_name: categoryName,
      category_id: categoryId,
      filter_index: filterIndex,
      region_name: regionName,
      search_nights: searchNights,
    };

    debug.log(LogEventTypes.LogGoodsListTabFilter, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListTabFilter,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 정렬 변경 시
   */
  const logTabSorting = ({
    sortedType,
    regionName,
    searchNights,
  }: {
    sortedType: string;
    regionName: string;
    searchNights: string;
  }) => {
    const parameters = {
      sorted_type: sortedType,
      region_name: regionName,
      search_nights: searchNights,
    };

    debug.log(LogEventTypes.LogGoodsListTabSorting, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListTabSorting,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 상품 탭 시
   */
  const logTabGoods = ({
    goodsId,
    goodsName,
    goodsIndex,
    regionName,
    searchNights,
  }: {
    goodsId: string;
    goodsName: string;
    goodsIndex: number;
    regionName: string;
    searchNights: string;
  }) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
      region_name: regionName,
      search_nights: searchNights,
    };

    debug.log(LogEventTypes.LogGoodsListTabGoods, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListTabGoods,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 타이틀의 지역/날짜 선택 시
   */
  const logTabFixedInfo = () => {
    debug.log(LogEventTypes.LogGoodsListTabFixedInfo);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListTabFixedInfo,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 브릿지 모달 > 완료 클릭(탭) 시
   */
  const logTabRegionDatePicker = (region_name: string, search_nights: number) => {
    const parameters = {
      region_name,
      search_nights,
    };

    debug.log(LogEventTypes.LogGoodsListTabRegionDatePicker, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListTabRegionDatePicker,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 필터 모달 > 진입 시
   */
  const logViewTagFilter = ({ id, name }: { id: number[]; name: string[] }) => {
    const parameters = {
      tag_filter_id: id.join(','),
      tag_filter_name: name.join(','),
    };

    debug.log(LogEventTypes.LogGoodsListViewTagFilter);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListViewTagFilter,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 필터 모달 > 완료 클릭(탭) 시
   */
  const logCompleteTagFilter = ({ id, name }: { id: number[]; name: string[] }) => {
    const parameters = {
      tag_filter_id: id,
      tag_filter_name: name,
    };

    debug.log(LogEventTypes.LogGoodsListCompleteTagFilter);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListCompleteTagFilter,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  /**
   * 쇼룸 지역/날짜 리스트 > 필터 모달 > 초기화 버튼 클릭(탭) 시
   */
  const logTabTagFilterReset = () => {
    debug.log(LogEventTypes.LogGoodsListTabTagFilterReset);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListTabTagFilterReset,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  return {
    logViewPage,
    logImpressionGoods,
    logTabFilter,
    logTabSorting,
    logTabGoods,
    logTabFixedInfo,
    logTabRegionDatePicker,
    logViewTagFilter,
    logCompleteTagFilter,
    logTabTagFilterReset,
  };
};
