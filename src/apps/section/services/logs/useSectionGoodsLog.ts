import get from 'lodash/get';
import toString from 'lodash/toString';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { SectionMetaDataSchema } from '../../schemas';
import { SectionGoodsModel } from '../../models';

/**
 * 셕션 > 상품 리스트 이벤트 로깅
 */
export const useSectionGoodsLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 상품 섹션 페이지 진입
   */
  const logSectionGoodsPageView = (
    params: Partial<SectionMetaDataSchema> & { recommendType?: string; discoverCategoryId?: number },
  ) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
      discovercategory_id: params.discoverCategoryId,
      recommend_type: params.recommendType,
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
   * 상품리스트 노출시
   */
  const logSectionGoodsImpression = (
    params: Partial<SectionMetaDataSchema> & {
      list: SectionGoodsModel;
      recommendType?: string;
      discoverCategoryId?: number;
    },
  ) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
      discovercategory_id: params.discoverCategoryId,
      recommend_type: params.recommendType,
      ...params.list.reduce<Record<string, (string | number | undefined)[]>>(
        (acc, cur) => ({
          goods_id: [...acc.goods_id, cur.goodsId],
          goods_name: [...acc.goods_name, cur.goodsName],
          goods_index: [...acc.goods_index, toString(get(cur, 'data-index'))],
        }),
        { goods_id: [], goods_name: [], goods_index: [] },
      ),
    };

    debug.log(LogEventTypes.LogGoodsListImpressionGoods, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogGoodsListImpressionGoods,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 상품 클릭
   */
  const logSectionGoodsTab = (
    params: Partial<SectionMetaDataSchema> & {
      item: ArrayElement<SectionGoodsModel>;
      recommendType?: string;
      discoverCategoryId?: number;
    },
  ) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
      discovercategory_id: params.discoverCategoryId,
      recommend_type: params.recommendType,
      goods_id: params.item.goodsId,
      goods_name: params.item.goodsName,
      goods_index: toString(get(params.item, 'data-index')),
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
   * 상품리스트필터 클릭
   */
  const logSectionGoodsFilterTab = (
    params: Partial<SectionMetaDataSchema> & {
      item: Record<'id' | 'name' | 'index', string | number>;
      discoverCategoryId?: number;
      recommendType?: string;
    },
  ) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
      discovercategory_id: params.discoverCategoryId,
      category_id: params.item.id,
      category_name: params.item.name,
      filter_index: params.item.index,
      recommend_type: params.recommendType,
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
   * 상품리스트소팅항목 클릭
   */
  const logSectionGoodsSortingTab = (
    params: Partial<SectionMetaDataSchema> & { sortType: string; discoverCategoryId?: number; recommendType?: string },
  ) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
      discovercategory_id: params.discoverCategoryId,
      sorted_type: params.sortType,
      recommend_type: params.recommendType,
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

  return {
    logViewPage: logSectionGoodsPageView,
    logSectionGoodsPageView,
    logSectionGoodsImpression,
    logSectionGoodsTab,
    logSectionGoodsFilterTab,
    logSectionGoodsSortingTab,
  };
};
