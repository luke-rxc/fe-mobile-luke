import { GoodsCardSmall } from '@pui/goodsCardSmall';
import { useRef, useEffect } from 'react';
import { LiveGoodsCardSmallModel } from '../models';

export type LiveGoodsCardItemProps = LiveGoodsCardSmallModel & {
  index: number;
  onVisibility?: (item: LiveGoodsCardSmallModel, index: number) => void;
  onClickGoods?: (item: LiveGoodsCardSmallModel, index: number) => void;
};

export const LiveGoodsCardItem = ({
  goodsType,
  onVisibility,
  onClickGoods,
  index,
  ...props
}: LiveGoodsCardItemProps) => {
  const container = useRef<HTMLDivElement>(null);

  const handleVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (entry.isIntersecting) {
      onVisibility?.({ ...props, goodsType }, index);
      observer.disconnect();
    }
  };

  /**
   * Intersection Observer 구독/해제
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (container.current) {
      observer = new IntersectionObserver(handleVisibility, { threshold: 0.3 });
      observer.observe(container.current);
    }

    return () => observer && observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={container}>
      <GoodsCardSmall
        {...props}
        onClick={() => {
          onClickGoods?.({ ...props, goodsType }, index);
        }}
      />
    </div>
  );
};
