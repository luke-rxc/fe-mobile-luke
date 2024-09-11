import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { TitleSection } from '@pui/titleSection';
import { ButtonText } from '@pui/buttonText';
import { MoreLabel } from '@constants/ui';
import { List } from '@pui/list';
import { GoodsCardSmall } from '@pui/goodsCardSmall';
import isEmpty from 'lodash/isEmpty';
import { SearchAllModel } from '../models';

export interface SearchSectionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** 상품 섹션 타이틀 */
  title: string;
  /** 상품 섹션 더보기 링크 */
  sectionLink?: string;
  /** 상품 데이터 */
  items: SearchAllModel['goods'];
  /** 섹션 내 상품 클릭 이벤트 */
  onClick?: (goodsId: string, goodsName: string, index: number, title: string) => void;
  /** Intersection observer 콜백 이벤트 */
  onVisibility?: (item: SearchSectionItemProps) => void;
}

/**
 * 검색 메인 > 상품 섹션 아이템
 */
export const SearchSectionItem = styled(
  forwardRef<HTMLDivElement, SearchSectionItemProps>((props, ref) => {
    const { title, sectionLink, items, onClick: handleClick, onVisibility, ...rest } = props;
    const container = useRef<HTMLDivElement>(null);

    /**
     * Intersection Observer 콜백
     */
    const handleVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) {
        onVisibility?.(props);
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

    /**
     * props ref 세팅
     */
    useImperativeHandle(ref, () => container.current as HTMLDivElement);

    if (isEmpty(items)) {
      return null;
    }

    return (
      <div ref={container} {...rest}>
        <TitleSection
          title={title}
          suffix={sectionLink && <ButtonText is="a" link={sectionLink} children={MoreLabel} />}
        />
        <List
          is="div"
          component={GoodsCardSmall}
          source={items}
          getKey={({ goodsCode }) => goodsCode}
          getHandlers={({ 'data-log-goods-id': goodsId, goodsName, 'data-log-index': index }) => ({
            onClick: () => {
              handleClick?.(goodsId, goodsName, index, title);
            },
          })}
        />
      </div>
    );
  }),
)``;
