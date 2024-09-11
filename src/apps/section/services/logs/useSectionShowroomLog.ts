import get from 'lodash/get';
import head from 'lodash/head';
import toString from 'lodash/toString';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import { WebLogTypes } from '@constants/log';
import { LogEventTypes } from '../../constants';
import { SectionMetaDataSchema } from '../../schemas';
import { SectionShowroomModel } from '../../models';

/**
 * 셕션 > 쇼룸 리스트 이벤트 로깅
 */
export const useSectionShowroomLog = (debug: ReturnType<typeof createDebug>) => {
  /**
   * 쇼룸(브랜드) 리스트 > 페이지 진입 시
   */
  const logViewPage = (params: SectionMetaDataSchema) => {
    const parameters = {
      section_id: params.id,
      section_name: params.title,
      section_description: params.subTitle,
    };

    debug.log(LogEventTypes.LogShowroomListViewPage, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListViewPage,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸(브랜드) 리스트 > 팔로우
   */
  const logShowroomListFollowShowroom = (params: ArrayElement<SectionShowroomModel>) => {
    const parameters = {
      showroom_id: params.id,
      showroom_name: params.title,
      section_id: get(params, 'data-section-id'),
      section_name: get(params, 'data-section-name'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogShowroomListFollowShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListFollowShowroom,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸(브랜드) 리스트 > 언팔로우
   */
  const logShowroomListUnfollowShowroom = (params: ArrayElement<SectionShowroomModel>) => {
    const parameters = {
      showroom_id: params.id,
      showroom_name: params.title,
      section_id: get(params, 'data-section-id'),
      section_name: get(params, 'data-section-name'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogShowroomListUnfollowShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListUnfollowShowroom,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸(브랜드) 리스트 > 상품 이미지 노출 시
   */
  const logShowroomListImpressionGoods = (params: SectionShowroomModel) => {
    const goods = params.reduce<NonNullable<ArrayElement<SectionShowroomModel>['goods']>>(
      (list, item) => (item.goods ? [...list, ...item.goods] : list),
      [],
    );

    if (!goods.length) {
      debug.log(LogEventTypes.LogShowroomListImpressionGoods, 'Empty Goods');
      return;
    }

    const parameters = {
      section_id: get(head(params), 'data-section-id'),
      section_name: get(head(params), 'data-section-name'),
      section_description: get(head(params), 'data-section-description'),

      ...goods.reduce<Record<string, unknown[]>>(
        (list, item) => ({
          goods_id: [...get(list, 'goods_id', []), toString(item.goodsId)],
          goods_name: [...get(list, 'goods_name', []), item.goodsName],
          goods_index: [...get(list, 'goods_index', []), get(item, 'data-goods-index')],
        }),
        {},
      ),
    };

    debug.log(LogEventTypes.LogShowroomListImpressionGoods, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListImpressionGoods,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸(브랜드) 리스트 > 쇼룸 이미미 노출 시
   */
  const logShowroomListImpressionShowroom = (params: SectionShowroomModel) => {
    const parameters = {
      section_id: get(head(params), 'data-section-id'),
      section_name: get(head(params), 'data-section-name'),
      section_description: get(head(params), 'data-section-description'),

      ...params.reduce<Record<string, unknown[]>>(
        (list, item) => ({
          showroom_id: [...get(list, 'showroom_id', []), toString(item.showroomId)],
          showroom_name: [...get(list, 'showroom_name', []), item.title],
          showroom_index: [...get(list, 'showroom_index', []), get(item, 'data-showroom-index')],
        }),
        {},
      ),
    };

    debug.log(LogEventTypes.LogShowroomListImpressionShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListImpressionShowroom,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸(브랜드) 리스트 > 상품 클릭(탭) 시
   */
  const logShowroomListTabGoods = (params: ArrayElement<NonNullable<ArrayElement<SectionShowroomModel>['goods']>>) => {
    const parameters = {
      goods_id: params.goodsId,
      goods_name: params.goodsName,
      goods_index: get(params, 'data-goods-index'),
      section_id: get(params, 'data-section-id'),
      section_name: get(params, 'data-section-name'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogShowroomListTabGoods, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListTabGoods,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  /**
   * 쇼룸(브랜드) 리스트 > 쇼룸 클릭(탭) 시
   */
  const logShowroomListTabShowroom = (params: ArrayElement<SectionShowroomModel>) => {
    const parameters = {
      showroom_id: toString(params.showroomId),
      showroom_name: params.title,
      showroom_index: get(params, 'data-showroom-index'),
      onair: params.onAir,
      live_id: params.liveId,
      section_id: get(params, 'data-section-id'),
      section_name: get(params, 'data-section-name'),
      section_description: get(params, 'data-section-description'),
    };

    debug.log(LogEventTypes.LogShowroomListTabShowroom, parameters);

    tracking.logEvent({
      parameters,
      name: LogEventTypes.LogShowroomListTabShowroom,
      targets: {
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logViewPage,
    logShowroomListFollowShowroom,
    logShowroomListUnfollowShowroom,
    logShowroomListImpressionGoods,
    logShowroomListImpressionShowroom,
    logShowroomListTabGoods,
    logShowroomListTabShowroom,
  };
};
