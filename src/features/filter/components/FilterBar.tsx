import styled from 'styled-components';
import { useRef } from 'react';
import { userAgent } from '@utils/ua';
import { isAppVersionLatestCheck } from '@utils/web2App';
import { Sticky, StickyProps } from '@features/landmark/components/sticky';
import { Tabs as TabsV1, TabsProps as TabsPropsV1 } from '@pui/tabs';
import {
  Tabs as TabsV2,
  TabsProps,
  TabDataType,
  TabsRefType,
  TABLIST_BACKGROUND_CSS_VARIABLE_NAME,
} from '@pui/tabs/v2';
import { ButtonFilter, ButtonFilterProps } from './ButtonFilter';
import { ButtonSort, ButtonSortProps, ButtonSortOptionType } from './ButtonSort';

export const FILTER_BAR_BACKGROUND_CSS_VARIABLE_NAME = TABLIST_BACKGROUND_CSS_VARIABLE_NAME;

export interface FilterBarProps<
  C extends TabDataType = TabDataType,
  S extends ButtonSortOptionType = ButtonSortOptionType,
> {
  /** tablist props */
  category?: Omit<TabsProps<C>, 'data' | 'actions'> & { options?: C[] };
  /** sorting select props */
  sort?: ButtonSortProps<S>;
  /** filter button props */
  filter?: ButtonFilterProps;

  // sticky Props
  wasSticky?: boolean;
  disabledSticky?: boolean;
  stickyOptions?: StickyProps['startOptions'];

  // common props
  className?: string;
}

const FilterBarComponent: React.FC<FilterBarProps<TabDataType, ButtonSortOptionType>> = ({
  sort,
  filter,
  category,
  wasSticky,
  stickyOptions,
  disabledSticky,
  className,
}) => {
  // @TODO 1.42.0 이후 삭제
  const { isApp } = userAgent();
  const featureFlag = !isApp || isAppVersionLatestCheck('1.42.0');

  const tabsRef = useRef<TabsRefType>(null);
  const { options: categoryOptions = [], ...categoryProps } = category || {};
  // @TODO 1.42.0 이후 삭제
  const { options: sortOptions = [], defaultValue: sortDefaultValue, getValue, getLabel, onChange } = sort || {};

  const handleSortChange: ButtonSortProps<ButtonSortOptionType>['onChange'] = (e, o, i) => {
    sort?.onChange?.(e, o, i);
    tabsRef.current?.scrollToSelectedTab();
  };

  // @TODO 1.42.0 이후 삭제
  const getSortOptionLabel = (option: ButtonSortOptionType, index: number) => {
    if (getLabel) {
      return getLabel(option, index);
    }

    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }

    if (typeof option === 'object') {
      return `${option?.label || ''}` || index;
    }

    return index;
  };
  // @TODO 1.42.0 이후 삭제
  const getSortOptionValue = (option: ButtonSortOptionType, index: number) => {
    if (getValue) {
      return getValue(option, index);
    }

    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }

    if (typeof option === 'object') {
      return `${option?.value || ''}` || index;
    }

    return index;
  };
  // @TODO 1.42.0 이후 삭제
  const sortPropsForV1: Pick<
    TabsPropsV1<TabDataType>,
    'defaultSortingValue' | 'sortingOptions' | 'onChangeTabSorting'
  > = sort
    ? {
        defaultSortingValue: `${sortDefaultValue}`,
        sortingOptions: sortOptions.map((sortOption, index) => ({
          label: `${getSortOptionLabel(sortOption, index)}`,
          value: `${getSortOptionValue(sortOption, index)}`,
        })),
        onChangeTabSorting: (o, i, e) => onChange?.(e, sortOptions[i], i),
      }
    : {};

  return (
    <Sticky wasSticky={wasSticky} disabled={disabledSticky} startOptions={stickyOptions}>
      {featureFlag ? (
        <TabsV2
          type="bubble"
          ref={tabsRef}
          data={categoryOptions}
          className={className}
          {...categoryProps}
          suffix={
            (!!filter || !!sort) && (
              <div className="filter-actions">
                {filter && <ButtonFilter {...filter} />}
                {sort && <ButtonSort {...sort} onChange={handleSortChange} />}
              </div>
            )
          }
        />
      ) : (
        // @TODO 1.42.0 이후 삭제
        <TabsV1 type="bubble" {...categoryProps} className={className} data={categoryOptions} {...sortPropsForV1} />
      )}
    </Sticky>
  );
};

export const FilterBar = styled(FilterBarComponent)`
  .is-sticky & {
    ${TABLIST_BACKGROUND_CSS_VARIABLE_NAME}: ${({ theme }) => theme.color.background.surfaceHigh};
  }

  .filter-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing.s8};
  }
` as (<C extends TabDataType = TabDataType, S extends ButtonSortOptionType = ButtonSortOptionType>(
  props: FilterBarProps<C, S>,
) => ReturnType<React.FC<FilterBarProps<C, S>>>) &
  string;
