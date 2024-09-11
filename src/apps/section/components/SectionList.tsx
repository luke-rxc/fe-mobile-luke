import React, { forwardRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { Exception } from '@pui/exception';
import { List, ListProps } from '@pui/list';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { ContentListItem, ContentListItemProps } from '@pui/contentListItem';
import { GoodsList, GoodsListProps as GoodsCardListProps } from '@pui/goodsList';
import { LiveListItem, LiveListItemProps } from '@features/live/components';
import { BrandListItemMedium, BrandListItemMediumProps } from '@features/showroom/components';
import { PickFunctionProperty } from '../types';
import { EmptyDescription, SectionTypes } from '../constants';

interface SectionListBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 피드 타입 */
  type: ValueOf<typeof SectionTypes>;
  /** 피드 아이템 데이터 */
  data: unknown[];
  /** 피드 제목 */
  title?: string;
  /** 로드가능한 데이터의 유무 */
  hasMore?: boolean;
  /** 데이터 요청 여부 */
  loading?: boolean;
  /** 피드 이벤트 핸들러 생성 */
  getHandlers?:
    | PickFunctionProperty<GoodsCardListProps>
    | ListProps<LiveListItemProps>['getHandlers']
    | ListProps<ContentListItemProps>['getHandlers']
    | ListProps<BrandListItemMediumProps>['getHandlers'];
  /** 데이터 로드 모어 이벤트 핸들러 */
  onLoadMore?: () => void;
}

interface LiveListProps extends SectionListBaseProps {
  type: typeof SectionTypes.LIVE;
  data: LiveListItemProps[];
  getHandlers?: ListProps<LiveListItemProps>['getHandlers'];
}

interface GoodsListProps extends SectionListBaseProps {
  type: typeof SectionTypes.GOODS;
  data: GoodsCardListProps['goodsList'];
  getHandlers?: PickFunctionProperty<GoodsCardListProps>;
}

interface ContentListProps extends SectionListBaseProps {
  type: typeof SectionTypes.CONTENT;
  data: ContentListItemProps[];
  getHandlers?: ListProps<ContentListItemProps>['getHandlers'];
}

interface ShowroomListProps extends SectionListBaseProps {
  type: typeof SectionTypes.SHOWROOM;
  data: BrandListItemMediumProps[];
  getHandlers?: ListProps<BrandListItemMediumProps>['getHandlers'];
}

export type SectionListProps = LiveListProps | GoodsListProps | ContentListProps | ShowroomListProps;

/**
 * SectionList
 */
export const SectionList = styled(
  forwardRef<HTMLDivElement, SectionListProps>((props, ref) => {
    const { type, title, data, loading = false, hasMore = false, getHandlers, onLoadMore, ...rest } = props;

    return (
      <div ref={ref} {...rest}>
        {isEmpty(data) ? (
          <Exception full description={EmptyDescription[type]} />
        ) : (
          <InfiniteScroller disabled={!hasMore || loading} loading={loading} onScrolled={onLoadMore}>
            {props.type === SectionTypes.GOODS && (
              <GoodsList disabled goodsList={props.data} {...(props.getHandlers || {})} />
            )}
            {props.type === SectionTypes.LIVE && (
              <List
                is="div"
                source={props.data}
                component={LiveListItem}
                getKey={({ liveId }) => `${liveId}`}
                getHandlers={props.getHandlers}
              />
            )}
            {props.type === SectionTypes.CONTENT && (
              <List
                is="div"
                source={props.data}
                component={ContentListItem}
                getKey={({ id: contentId }) => `${contentId}`}
                getHandlers={props.getHandlers}
              />
            )}
            {props.type === SectionTypes.SHOWROOM && (
              <List
                is="div"
                source={props.data}
                component={BrandListItemMedium}
                getKey={({ showroomId }) => `${showroomId}`}
                getHandlers={props.getHandlers}
              />
            )}
          </InfiniteScroller>
        )}
      </div>
    );
  }),
)`
  padding-top: ${({ theme }) => theme.spacing.s12};
`;
