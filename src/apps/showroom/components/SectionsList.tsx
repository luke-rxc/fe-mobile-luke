import { forwardRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { List } from '@pui/list';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { rn2br } from '@utils/string';
import { ShowroomSectionType } from '../constants';
import { Showroom } from '../types';
import { getColor } from '../utils';
import { SectionItemProps, SectionItem } from './SectionItem';
import { SectionHeaderProps } from './SectionHeader';

export interface SectionsListProps {
  /** 쇼룸 타입 */
  type?: Showroom;
  sections: SectionItemProps[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onVisibility?: SectionItemProps['onVisibility'];
  onClickSectionMore?: SectionItemProps['onClickSectionMore'];
  onClickSectionHeader?: SectionHeaderProps['onClickSectionHeader'];
  goodsHandlers?: (section: SectionItemProps) => SectionItemProps['getHandlers'];
}

export const SectionsList = styled(
  forwardRef<HTMLDivElement, SectionsListProps>((props, ref) => {
    const {
      type,
      sections,
      loading,
      hasMore,
      onLoadMore,
      onVisibility,
      onClickSectionMore,
      onClickSectionHeader,
      goodsHandlers,
      ...rest
    } = props;

    /**
     * 쇼룸 타입에 따른 getHandlers 반환
     */
    const getFeedHandlers = (item: SectionItemProps) => {
      switch (item.type) {
        case ShowroomSectionType.GOODS:
          return { getHandlers: goodsHandlers?.(item) };
        default:
          return {};
      }
    };

    /**
     * Empty case
     * 1. 생성된 전시 섹션이 존재하지 않은 경우
     * 2. 상품 섹션 > 전시 섹션은 존재하나, 섹션에 등록된 상품 모두 판매중지 혹은 품절 상태인 경우
     */
    const isEmptySection = isEmpty(sections) || sections.every((section) => isEmpty(section.content));

    return (
      <div {...rest} ref={ref}>
        {isEmptySection ? (
          <PageError
            isFull={false}
            className="empty"
            defaultMessage={rn2br('아직 등록된 상품이 없습니다\r\n쇼룸을 팔로우하고 가장 먼저 알림을 받아보세요')}
          />
        ) : (
          <InfiniteScroller
            infiniteOptions={{ rootMargin: '50px' }}
            disabled={!hasMore || loading}
            loading={loading}
            onScrolled={onLoadMore}
          >
            <List
              is="div"
              source={sections}
              component={SectionItem}
              getKey={({ sectionId }) => `${sectionId}`}
              getHandlers={(item) => ({
                onVisibility,
                onClickSectionMore,
                onClickSectionHeader,
                ...getFeedHandlers(item),
              })}
            />
          </InfiniteScroller>
        )}
      </div>
    );
  }),
)`
  ${SectionItem} {
    padding-top: ${({ theme }) => theme.spacing.s12};

    &:first-child {
      padding-top: 0;
    }

    &:last-of-type {
      padding-bottom: 4.8rem;
    }
  }

  .empty {
    ${({ theme }) => theme.mixin.centerItem()};
    height: 24rem;

    .exception-inner {
      color: ${getColor('contentColor')};
      opacity: 0.2;
    }
  }
`;
