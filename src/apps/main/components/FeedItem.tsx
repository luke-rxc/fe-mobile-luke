/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { TitleSection } from '@pui/titleSection';
import { List, ListProps } from '@pui/list';
import { ButtonText } from '@pui/buttonText';
import { ContentCard, ContentCardProps } from '@pui/contentCard';
import { GoodsCardSmall, GoodsCardSmallProps } from '@pui/goodsCardSmall';
import { BrandCard, BrandCardProps } from '@features/showroom/components';
import { LiveCard, LiveCardProps } from '@features/live/components';
import { MoreLabel } from '@constants/ui';
import { FeedType } from '../constants';

interface FeedItemBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 피드 타입 */
  type: ValueOf<typeof FeedType>;
  /** 피드 제목 */
  title: string;
  /** 피드 아이템 데이터 */
  source: unknown[];
  /** 피드 세션 ID */
  sectionId: number;
  /** 피드 전체 보기를 위한 랜딩 URL */
  sectionLink?: string;
  /** 피드 디스크립션 */
  subtitle?: string;
  /** 피드 이벤트 핸들러 생성 */
  getHandlers?:
    | ListProps<GoodsCardSmallProps>['getHandlers']
    | ListProps<BrandCardProps>['getHandlers']
    | ListProps<ContentCardProps>['getHandlers']
    | ListProps<LiveCardProps>['getHandlers'];
  /** */
  onVisibility?: (item: FeedItemProps) => void;
  /** 피드 타이틀 전체 보기 클릭 이벤트 콜백 */
  onClickSectionMore?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: FeedItemProps) => void;
}

interface GoodsFeedItemProps extends FeedItemBaseProps {
  type: typeof FeedType.GOODS;
  source: GoodsCardSmallProps[];
  getHandlers?: ListProps<GoodsCardSmallProps>['getHandlers'];
}

interface ShowroomFeedItemProps extends FeedItemBaseProps {
  type: typeof FeedType.SHOWROOM;
  source: BrandCardProps[];
  getHandlers?: ListProps<BrandCardProps>['getHandlers'];
}

interface ContentFeedItemProps extends FeedItemBaseProps {
  type: typeof FeedType.CONTENT;
  source: ContentCardProps[];
  getHandlers?: ListProps<ContentCardProps>['getHandlers'];
}

interface LiveFeedItemProps extends FeedItemBaseProps {
  type: typeof FeedType.LIVE;
  source: LiveCardProps[];
  getHandlers?: ListProps<LiveCardProps>['getHandlers'];
}

export type FeedItemProps = GoodsFeedItemProps | ShowroomFeedItemProps | ContentFeedItemProps | LiveFeedItemProps;

/**
 * FeedItem
 */
export const FeedItem = styled<React.VFC<FeedItemProps>>((props) => {
  const { title, subtitle, sectionId, source, sectionLink, getHandlers, onVisibility, onClickSectionMore, ...rest } =
    props;

  const container = useRef<HTMLDivElement>(null);

  const handleVisibility = ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    if (entry.isIntersecting) {
      onVisibility?.(props);
      observer.disconnect();
    }
  };

  const handleClickSectionMore = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClickSectionMore?.(e, props);
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
  }, []);

  return (
    <div ref={container} {...rest}>
      <TitleSection
        title={title}
        subtitle={subtitle}
        suffix={
          sectionLink && <ButtonText is="a" link={sectionLink} onClick={handleClickSectionMore} children={MoreLabel} />
        }
      />

      {props.type === FeedType.LIVE && (
        <List
          is="div"
          source={props.source}
          component={LiveCard}
          getKey={({ liveId }) => `${liveId}`}
          getHandlers={props.getHandlers}
        />
      )}

      {props.type === FeedType.GOODS && (
        <List
          is="div"
          source={props.source}
          component={GoodsCardSmall}
          getKey={({ id, goodsCode }) => id || goodsCode}
          getHandlers={props.getHandlers}
        />
      )}

      {props.type === FeedType.SHOWROOM && (
        <List
          is="div"
          source={props.source}
          component={BrandCard}
          getKey={({ showroomId }) => `${showroomId}`}
          getHandlers={props.getHandlers}
        />
      )}

      {props.type === FeedType.CONTENT && (
        <List
          is="div"
          source={props.source}
          component={ContentCard}
          getKey={({ contentCode }) => contentCode}
          getHandlers={props.getHandlers}
        />
      )}
    </div>
  );
})`
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

  ${LiveCard}, ${GoodsCardSmall}, ${BrandCard}, ${ContentCard} {
    flex: 0 0 auto;
    margin-left: ${({ theme }) => theme.spacing.s16};

    &:first-child {
      margin-left: 0;
    }
  }

  ${ContentCard} {
    width: 100%;

    &.layout-swipe {
      width: 25.6rem;
    }
  }
`;
