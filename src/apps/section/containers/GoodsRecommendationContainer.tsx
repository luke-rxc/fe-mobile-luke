import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { FilterBar } from '@features/filter';
import { Spinner } from '@pui/spinner';
import { EmptyDescription, SectionTypes } from '../constants';
import { useGoodsRecommendationService } from '../services';
import { SectionList } from '../components';

export const GoodsRecommendationContainer = styled(({ className }: { className?: string }) => {
  const {
    title,
    data,
    error,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    getGoodsHandlers,

    filterList,
    sortingOptions,
    selectedFilterId,
    defaultSortingValue,
    handleChangeTabFilter,
    handleChangeTabSorting,
  } = useGoodsRecommendationService();
  const isFilterEmpty = isEmpty(data?.pages) && filterList?.length === 1;

  /**
   * header setting
   */
  useHeaderDispatch({
    type: 'mweb',
    title,
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  /**
   * server error
   */
  if (isError) {
    return <PageError error={error} />;
  }

  /** Filter Empty */
  if (isFilterEmpty) {
    return <PageError defaultMessage={EmptyDescription.GOODS} />;
  }

  return (
    <div className={className}>
      {isLoading ? (
        <Spinner className="page-spinner" />
      ) : (
        <>
          {(filterList || sortingOptions) && (
            <FilterBar
              category={{
                value: selectedFilterId,
                options: filterList,
                getKey: ({ id }) => `${id}`,
                getLabel: ({ name }) => name,
                getValue: ({ id }) => id,
                onChange: (e, o, i) => handleChangeTabFilter(o, i),
              }}
              sort={{
                defaultValue: defaultSortingValue,
                options: sortingOptions,
                onChange: (e, o) => handleChangeTabSorting(o.value),
              }}
            />
          )}
          {data && (
            <SectionList
              type={SectionTypes.GOODS}
              title={title}
              data={data.pages || []}
              loading={isFetching}
              hasMore={hasNextPage}
              getHandlers={getGoodsHandlers}
              onLoadMore={fetchNextPage}
            />
          )}
        </>
      )}
    </div>
  );
})`
  .page-spinner {
    ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
    ${({ theme }) => theme.mixin.centerItem()};
    width: 100vw;
    height: 100vh;
  }
`;
