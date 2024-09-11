import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoading } from '@hooks/useLoading';
import { GoodsList } from '@pui/goodsList';
import { TitleSection } from '@pui/titleSection';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { rn2br } from '@utils/string';
import { useGoodsHistoryService } from '../services';

export const GoodsHistoryContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const triggerRef = useRef<HTMLDivElement>(null);

  const {
    goods,
    goodsHistoryError,
    isGoodsHistoryError,
    hasMoreGoodsHistory,
    isGoodsHistoryLoading,
    handleLoadGoodsHistory,
  } = useGoodsHistoryService();

  useEffect(() => {
    if (isGoodsHistoryLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoodsHistoryLoading]);

  useHeaderDispatch({
    type: 'mweb',
    title: '최근 본 상품',
    enabled: !isGoodsHistoryLoading,
    quickMenus: ['cart', 'menu'],
    transitionTrigger: triggerRef,
  });

  if (isGoodsHistoryLoading) return null;

  /** Error case */
  if (isGoodsHistoryError) {
    return <PageError isFull description={goodsHistoryError?.data?.message ?? '일시적인 오류가 발생하였습니다'} />;
  }

  /** Empty case */
  if (isEmpty(goods)) {
    return <PageError isFull description={rn2br('최근 본 상품이 없습니다\r\n프리즘만의 다양한 상품을 만나보세요')} />;
  }

  return (
    <>
      <TitleSection title="최근 본 상품" ref={triggerRef} />

      {goods && (
        <GoodsListStyled
          goodsList={goods}
          disabled={!hasMoreGoodsHistory}
          onScrolled={handleLoadGoodsHistory}
          infiniteOptions={{ rootMargin: '50px' }}
        />
      )}
    </>
  );
};

/**
 * TODO. pui/GoodsList 내, 해당 여백 공통 적용
 * https://rxccorp.slack.com/archives/C020RQT5LKZ/p1668063020711539
 */
const GoodsListStyled = styled(GoodsList)`
  padding-bottom: 2.4rem;
`;
