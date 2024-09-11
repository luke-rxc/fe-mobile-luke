import styled from 'styled-components';
import { useRef, useMemo } from 'react';
import { Sticky, StickyProps } from '@features/landmark/components/sticky';
import { Tabs, TabsProps, TabDataType, TabsRefType, TABLIST_BACKGROUND_CSS_VARIABLE_NAME } from '@pui/tabs/v2';
import { ButtonFilter, ButtonFilterProps } from './ButtonFilter';
import { ButtonSort, ButtonSortProps, ButtonSortOptionType } from './ButtonSort';

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
  const tabsRef = useRef<TabsRefType>(null);
  const { options: categoryOptions = [], ...categoryProps } = category || {};

  const handleSortChange: ButtonSortProps<ButtonSortOptionType>['onChange'] = (e, o, i) => {
    sort?.onChange?.(e, o, i);
    tabsRef.current?.scrollToSelectedTab();
  };

  const actions = useMemo(() => {
    if (!filter && !sort) {
      return null;
    }

    return (
      <div className="filter-actions">
        {filter && <ButtonFilter {...filter} />}
        {sort && <ButtonSort {...sort} onChange={handleSortChange} />}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, category]);

  return (
    <Sticky wasSticky={wasSticky} disabled={disabledSticky} startOptions={stickyOptions}>
      <Tabs
        {...categoryProps}
        type="bubble"
        ref={tabsRef}
        data={categoryOptions}
        suffix={actions}
        className={className}
      />
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
