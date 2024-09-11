import React from 'react';
import styled from 'styled-components';
import { List } from '@pui/list';
import { FeedType } from '../constants';
import { FeedItem, FeedItemProps } from './FeedItem';
import { FeedLoadIndicator } from './FeedLoadIndicator';

export interface FeedListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'is'> {
  feeds: FeedItemProps[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  onVisibility?: FeedItemProps['onVisibility'];
  onClickMoreView?: FeedItemProps['onClickSectionMore'];
  liveHandlers?: (feed: FeedItemProps) => Extract<FeedItemProps, { type: typeof FeedType.LIVE }>['getHandlers'];
  goodsHandlers?: (feed: FeedItemProps) => Extract<FeedItemProps, { type: typeof FeedType.GOODS }>['getHandlers'];
  contentHandlers?: (feed: FeedItemProps) => Extract<FeedItemProps, { type: typeof FeedType.CONTENT }>['getHandlers'];
  showroomHandlers?: (feed: FeedItemProps) => Extract<FeedItemProps, { type: typeof FeedType.SHOWROOM }>['getHandlers'];
}

/**
 * Feed List
 */
export const FeedList = styled<React.VFC<FeedListProps>>(
  ({
    feeds,
    hasMore,
    goodsHandlers,
    contentHandlers,
    showroomHandlers,
    liveHandlers,
    onLoadMore,
    onVisibility,
    onClickMoreView: onClickSectionMore,
    ...props
  }) => {
    /**
     * Feed 타입에 따른 getHandlers 반환
     */
    const getFeedHandlers = (item: FeedItemProps): Pick<FeedItemProps, 'getHandlers' | 'onClickSectionMore'> => {
      switch (item.type) {
        case FeedType.LIVE:
          return { getHandlers: liveHandlers?.(item) };
        case FeedType.GOODS:
          return { getHandlers: goodsHandlers?.(item) };
        case FeedType.CONTENT:
          return { getHandlers: contentHandlers?.(item) };
        case FeedType.SHOWROOM:
          return { getHandlers: showroomHandlers?.(item) };
        default:
          return {};
      }
    };

    return (
      <div {...props}>
        <List
          is="div"
          source={feeds}
          component={FeedItem}
          getKey={({ sectionId }) => `${sectionId}`}
          getHandlers={(item) => ({ onVisibility, onClickSectionMore, ...getFeedHandlers(item) })}
        />
        <FeedLoadIndicator hasMore={hasMore} onLoadMore={onLoadMore} />
      </div>
    );
  },
)`
  ${FeedItem} {
    margin-top: ${({ theme }) => theme.spacing.s12};

    &:first-child {
      margin-top: 0;
    }
  }
`;
