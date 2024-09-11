import React from 'react';

import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

import { GoodsCs } from '../components';
import { GoodsPageName } from '../constants';

interface Props {
  goodsId?: string;
}

/**
 * @description v1 기준 CS 관련 화면은 동일
 * - 추후 v2 버전에서는 상품에 맞게 변동될 여지가 있어, 미리 goodsId 구조로 세팅
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GoodsCsContainer: React.FC<Props> = ({ goodsId }) => {
  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: GoodsPageName.CS,
    quickMenus: ['cart', 'menu'],
  });

  return <GoodsCs />;
};
