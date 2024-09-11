import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { GoodsList } from '@pui/goodsList';
import { useLiveGoodsLogService, useLiveGoodsService } from '../services';
import { LiveGoodsWrapperStyled, LiveLoading } from '../components';

interface Props {
  liveId: number;
}

export const LiveGoodsContainer = ({ liveId }: Props) => {
  const logService = useLiveGoodsLogService();
  const { errorInfo, isError, isLoading, goodsListProps } = useLiveGoodsService({
    liveId,
    logService,
  });

  useHeaderDispatch({
    type: 'mweb',
    title: '라이브 상품',
    enabled: true,
    overlay: isLoading,
    quickMenus: ['cart', 'menu'],
  });

  if (isError) {
    return <PageError {...errorInfo} isFull />;
  }

  if (isLoading) {
    return <LiveLoading />;
  }

  return (
    <LiveGoodsWrapperStyled>
      <GoodsList goodsList={goodsListProps.goodsList} onListClick={goodsListProps.handleClickGoodsThumbnail} />
    </LiveGoodsWrapperStyled>
  );
};
