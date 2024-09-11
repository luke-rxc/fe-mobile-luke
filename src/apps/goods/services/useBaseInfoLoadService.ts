/**
 * 상품상세 리스트 로드
 */

import { useQuery } from '@hooks/useQuery';
import { GoodsType } from '@constants/goods';
import { getGoods } from '../apis';
import { toGoodsModel, toShowroomModel, toHeaderModel, toBannerListModel, OptionModel } from '../models';
import { QueryKeys } from '../constants';
// import {
//   goodsMockPreorderApi,
//   /* goodsMockSalesScheduleApi,
//   goodsMockApi,
//   goodsMockBidEndApi,
//   goodsCouponMockApi,
//   goodsMockApi0,
//   goodsMockApi1,
//   goodsMockApi2,
//   goodsMockApi3,
//   goodsMockBidApi, */
// } from '../apis/__mocks__';
import { useGoodsPageInfo } from '../hooks';

export const useBaseInfoLoadService = () => {
  const { goodsPageId, goodsId, showRoomId, isInLivePage } = useGoodsPageInfo();

  const {
    data: goods,
    isLoading: isGoodsLoading,
    isError: isGoodsError,
    error: goodsError,
  } = useQuery(
    [QueryKeys.GOODS, goodsPageId],
    /** () =>
    goodsMockPreorderApi({
    goodsMockSalesScheduleApi({
      goodsId,
      showRoomId,
      isInLivePage,
    }), */
    async () => {
      const res = await getGoods({ goodsId, showRoomId, isInLivePage });
      return res;
    },
    {
      select: (data) => {
        const { id, showRoom, option, optionMetadata, liveId, banner } = data;
        return {
          goodsId: id,
          detailGoods: toGoodsModel(data),
          showRoom: toShowroomModel(showRoom),
          option: { ...option, ...optionMetadata } as OptionModel,
          header: toHeaderModel(data),
          /** test id: 7 */
          liveId,
          bannerList: toBannerListModel(banner?.bannerList),
        };
      },
    },
  );

  return {
    goods,
    detailGoods: goods?.detailGoods,
    showRoom: goods?.showRoom,
    header: goods?.header,
    option: goods?.option,
    liveId: goods?.liveId ?? null,
    bannerList: goods?.bannerList,
    // 경매 모드 여부
    isAuctionType: goods?.detailGoods?.type === GoodsType.AUCTION,
    // 온다 상품 여부
    isOndaDeal: goods?.detailGoods.ticket?.channel === 'ACCOM_ONDA',
    /** useQuery return params */
    isGoodsLoading,
    isGoodsError,
    goodsError,
  };
};
