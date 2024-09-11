/* eslint-disable react/destructuring-assignment */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { MoreLabel } from '@constants/ui';
import { ButtonText } from '@pui/buttonText';
import { GoodsCardSmall, GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { List } from '@pui/list';
import { TitleSection } from '@pui/titleSection';
import { ReviewCard, ReviewCardProps } from '@pui/reviewCard';
import { FeedType } from '../constants';

interface GoodsFeedListBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  goodsId: number;
  type: ValueOf<typeof FeedType>;
  title: string;
  isMore: boolean;
  source: GoodsCardSmallProps[] | ReviewCardProps[];
  sectionLink?: string;
  onClickMoreView: () => void;
  onVisibilityList: () => void;
  onVisibilityItem?: (goods: GoodsCardSmallProps, index: number) => void;
  onClick: ((goods: GoodsCardSmallProps, index: number) => void) | ((id: string) => void);
}

interface GoodsFeedItemProps extends GoodsFeedListBaseProps {
  type: typeof FeedType.GOODS;
  source: GoodsCardSmallProps[];
  onClick: (goods: GoodsCardSmallProps, index: number) => void;
}

interface ReviewFeedItemProps extends GoodsFeedListBaseProps {
  type: typeof FeedType.REVIEW;
  source: ReviewCardProps[];
  onClick: (id: string) => void;
}

type GoodsFeedListProps = GoodsFeedItemProps | ReviewFeedItemProps;

export const GoodsFeedList = (props: GoodsFeedListProps) => {
  const {
    goodsId,
    type,
    title,
    isMore,
    source,
    sectionLink,
    onClickMoreView: handleClickMoreView,
    onVisibilityList: handleVisibilityList,
    onVisibilityItem: handleVisibilityItem,
    onClick,
    ...rest
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const feedRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleFeedListVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (entry.isIntersecting) {
      handleVisibilityList();
      observer.disconnect();
    }
  };

  const handleFeedItemVisibility = (
    [entry]: IntersectionObserverEntry[],
    feedObserver: IntersectionObserver,
    goods: GoodsCardSmallProps,
    index: number,
  ) => {
    if (entry.isIntersecting) {
      handleVisibilityItem?.(goods, index);
      feedObserver.disconnect();
    }
  };

  useEffect(() => {
    let observer: IntersectionObserver;
    let feedObserver: IntersectionObserver;

    if (containerRef.current) {
      observer = new IntersectionObserver(handleFeedListVisibility, { threshold: 0.3 });
      observer.observe(containerRef.current);
    }

    if (props.type === FeedType.GOODS && !isEmpty(feedRefs.current) && !!handleVisibilityItem) {
      props.source.forEach((goods, index) => {
        const feedRef = feedRefs.current[index] as HTMLAnchorElement;
        feedObserver = new IntersectionObserver(
          (entry, observerEl) => handleFeedItemVisibility(entry, observerEl, goods, index),
          {
            threshold: 0.3,
          },
        );
        feedObserver.observe(feedRef);
      });
    }

    return () => {
      observer && observer.disconnect();
      feedObserver && feedObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper ref={containerRef} {...rest}>
      <TitleSection
        title={title}
        suffix={isMore && <ButtonText is="a" children={MoreLabel} link={sectionLink} onClick={handleClickMoreView} />}
      />
      {/* 타입이 나눠지는 property 를 구조분해할당으로 작성시 타입추론 오류로 타입 추론이 필요한 값은 props 로 내려줌 */}
      {props.type === FeedType.GOODS && (
        <List
          is="div"
          source={props.source}
          render={(goods, index) => (
            <GoodsCardSmall
              ref={(ref) => {
                feedRefs.current[index] = ref;
              }}
              {...goods}
            />
          )}
          getKey={({ goodsCode }) => goodsCode}
          getHandlers={(goods, index) => ({
            onClick: () => {
              props.onClick(goods, index);
            },
          })}
        />
      )}

      {props.type === FeedType.REVIEW && (
        <List
          is="div"
          source={props.source}
          component={ReviewCard}
          getKey={({ id }) => `${id}`}
          getHandlers={({ id }) => ({
            onClick: () => {
              id && props.onClick(id);
            },
          })}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.s12};

  ${List} {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    width: 100%;
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }

  ${GoodsCardSmall}, ${ReviewCard} {
    flex: 0 0 auto;
    margin-left: ${({ theme }) => theme.spacing.s16};

    &:first-child {
      margin-left: 0;
    }
  }
`;
