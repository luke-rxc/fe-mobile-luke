import React, { forwardRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { FilterBar, FilterBarProps, ButtonSort, FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME } from '@features/filter';
import { Button } from '@pui/button';
import { GoodsCardProps } from '@pui/goodsCard';
import { GoodsList as GoodsCards, GoodsListProps as GoodsCardsProps } from '@pui/goodsList';
import { PageError } from '@features/exception/components';

import { Divider } from '@pui/divider';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { rn2br } from '@utils/string';
import { FilterSchema } from '../schemas';
import { getColor } from '../utils';

export type CategoryOptionType = ArrayElement<FilterSchema['categoryFilter']>;
export type SortOptionType = { label: string; value: string };
export type FilterBarType = Required<FilterBarProps<CategoryOptionType, SortOptionType>>;

export interface GoodsListProps extends React.HTMLAttributes<HTMLDivElement> {
  goods: GoodsCardsProps['goodsList'];
  goodsError: ErrorModel<ErrorDataModel> | null;
  isGoodsError?: boolean;
  isGoodsLoading?: boolean;
  isGoodsFetching?: boolean;
  hasMoreGoods?: boolean;
  selectedFilterId?: number;
  defaultSortingValue?: string;
  filterList: CategoryOptionType[];
  sortingOptions: SortOptionType[];
  onLoadGoods?: () => void;
  onClickGoods?: (goods: GoodsCardProps) => void;
  onChangeTabFilter?: FilterBarType['category']['onChange'];
  onChangeTabSorting?: FilterBarType['sort']['onChange'];
}

const PageErrorWrap = styled.div`
  ${({ theme }) => theme.mixin.centerItem()};
  height: 24rem;
`;

/**
 * GoodsList 컴포넌트
 */
export const GoodsList = styled(
  forwardRef<HTMLDivElement, GoodsListProps>((props, ref) => {
    const {
      goods,
      goodsError,
      isGoodsError,
      isGoodsLoading,
      isGoodsFetching,
      hasMoreGoods,
      selectedFilterId,
      defaultSortingValue,
      filterList,
      sortingOptions,
      onClickGoods: handleClickGoods,
      onLoadGoods: handleLoadGoods,
      onChangeTabFilter: handleChangeTabFilter,
      onChangeTabSorting: handleChangeTabSorting,
      ...rest
    } = props;
    const isFilterEmpty = isEmpty(goods) && filterList.length === 1;

    /** Filter Empty */
    if (isFilterEmpty) {
      return (
        <div ref={ref} {...rest}>
          <Divider />
          <PageErrorWrap
            children={
              <PageError
                isFull={false}
                defaultMessage={rn2br('아직 등록된 상품이 없습니다\r\n쇼룸을 팔로우하고 가장 먼저 알림을 받아보세요')}
              />
            }
          />
        </div>
      );
    }

    return (
      <div ref={ref} {...rest}>
        <Divider />

        {(!isEmpty(filterList) || !isEmpty(sortingOptions)) && (
          <FilterBar
            disabledSticky
            category={{
              value: selectedFilterId,
              options: filterList,
              getValue: ({ id }) => id,
              getLabel: ({ name }) => name,
              onChange: handleChangeTabFilter,
            }}
            sort={{
              defaultValue: defaultSortingValue,
              options: sortingOptions,
              onChange: handleChangeTabSorting,
            }}
          />
        )}
        {isGoodsError && <PageErrorWrap children={<PageError isFull={false} error={goodsError} />} />}

        {isEmpty(goods) ? (
          // Goods Empty
          <PageErrorWrap
            children={
              <PageError
                isFull={false}
                defaultMessage={rn2br('아직 등록된 상품이 없습니다\r\n쇼룸을 팔로우하고 가장 먼저 알림을 받아보세요')}
              />
            }
          />
        ) : (
          <GoodsCards
            loading={isGoodsFetching}
            disabled={!hasMoreGoods}
            goodsList={goods}
            onListClick={handleClickGoods}
            onScrolled={handleLoadGoods}
          />
        )}
      </div>
    );
  }),
)`
  ${Divider} {
    margin-bottom: ${({ theme }) => theme.spacing.s8};

    &::after {
      background-color: ${getColor('contentColor')};
      opacity: 0.08;
    }
  }

  ${FilterBar} {
    ${FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME}: ${getColor('backgroundColor')};
    margin-bottom: ${({ theme }) => theme.spacing.s12};

    .tablist {
      [aria-selected='true'] {
        background: ${getColor('tintColor')};
        color: ${getColor('textColor')};
      }

      [aria-selected='false'] {
        color: ${getColor('contentColor')};
        opacity: 0.5;
      }
    }

    ${ButtonSort} {
      ${Button} {
        overflow: hidden;
        box-shadow: none;
        border: 1px solid ${({ theme }) => theme.light.color.gray8};
        background: ${getColor('backgroundColor')};
        color: ${getColor('contentColor')};
      }

      ${Button}::after {
        ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
        background: ${getColor('contentColor')};
        transition: opacity 200ms;
        opacity: 0;
        content: '';
      }

      &:active {
        ${Button} {
          background: ${getColor('backgroundColor')};
        }

        ${Button}::after {
          opacity: 0.03;
        }
      }
    }

    /** [S] 1.42.0 이후 제거 */
    .sorting-inner {
      select {
        color: ${getColor('contentColor')};
        opacity: 0.5;
      }

      .suffix-box {
        path {
          fill: ${getColor('contentColor')} !important;
          opacity: 0.5;
        }
      }
    }
    /** [E] 1.42.0 이후 제거 */
  }

  ${GoodsCards} {
    .goods-image {
      // 화면 모드 영향에 관계없이 고정 컬러 노출
      background: #f7f7f7;
    }
    .info {
      .goods-price {
        .benefit-label {
          color: ${getColor('contentColor')};
          opacity: 0.5;
        }
      }
      .goods-brand {
        .brand-slide-list {
          .brand-name {
            color: ${getColor('contentColor')};
            opacity: 0.5;
          }
          .brand-label {
            color: ${getColor('contentColor')};
            opacity: 0.5;
          }
          svg * {
            fill: ${getColor('contentColor')} !important;
          }
        }
      }
    }
  }

  ${PageErrorWrap} {
    .description {
      color: ${getColor('contentColor')};
      opacity: 0.2;
    }
  }
`;
