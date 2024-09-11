import React from 'react';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';

import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

import { useGoodsDetailService } from '../services';
import { GoodsDetail, GoodsError, GoodsMetaInfo } from '../components';
import { GoodsMessage, GoodsPageName } from '../constants';

interface Props {
  goodsId: string;
}

export const GoodsDetailContainer: React.FC<Props> = ({ goodsId }) => {
  const { detailList, isFetched, isLoading, isError, error } = useGoodsDetailService({ goodsId: +goodsId });
  const loading = useLoadingSpinner(isLoading);

  useHeaderDispatch({
    type: 'mweb',
    title: GoodsPageName.DETAIL,
    enabled: isFetched,
    quickMenus: ['cart', 'menu'],
  });

  /** Loading 처리 */
  if (loading) {
    return null;
  }

  /** Rendering: error */
  if (isError || !detailList) {
    return <GoodsError error={error} />;
  }

  /** Rendering: List nothing */
  if (detailList && detailList.length === 0) {
    /**
     * @description 예외 케이스 처리
     * 해당 리스트가 없을 때는 해당 페이지가 호출이 되지 않으나,
     * URL로 접근할때를 대비해여 진행
     */
    return <GoodsError description={GoodsMessage.ERROR_NOTHING_LIST} />;
  }

  return (
    <>
      <GoodsMetaInfo scalable />
      <GoodsDetail lists={detailList} />
    </>
  );
};
