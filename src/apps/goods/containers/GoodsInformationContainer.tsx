import React from 'react';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';

import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

import { GoodsKind } from '@constants/goods';
import { useGoodsInformationService } from '../services';
import { GoodsInformation, GoodsInformationTicket, GoodsError } from '../components';
import { GoodsPageName } from '../constants';

interface Props {
  goodsId: string;
}

export const GoodsInformationContainer: React.FC<Props> = ({ goodsId }) => {
  const { informationList, isLoading, isError, error } = useGoodsInformationService({ goodsId: +goodsId });
  const loading = useLoadingSpinner(isLoading);

  useHeaderDispatch({
    type: 'mweb',
    enabled: !isLoading,
    // eslint-disable-next-line no-nested-ternary
    title: informationList
      ? informationList.kind === GoodsKind.REAL
        ? GoodsPageName.INFO
        : GoodsPageName.INFO_TICKET
      : undefined,
    quickMenus: ['cart', 'menu'],
  });

  /** Loading 처리 */
  if (loading) {
    return null;
  }

  /** Rendering: error */
  if (isError || !informationList) {
    return <GoodsError error={error} />;
  }

  const { kind } = informationList;

  return (
    <>
      {kind === GoodsKind.REAL && <GoodsInformation informationList={informationList} />}
      {kind !== GoodsKind.REAL && <GoodsInformationTicket informationList={informationList} />}
    </>
  );
};
