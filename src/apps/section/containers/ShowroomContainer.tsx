import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef } from 'react';
import { useLoading } from '@hooks/useLoading';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { FilterBar } from '@features/filter';
import { SectionList } from '../components';
import { useShowroomService } from '../services';
import { EmptyDescription, SectionTypes } from '../constants';

export const ShowroomContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const triggerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    metaData,
    error,
    isError,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
    getHandlers,

    filterList,
    sortingOptions,
    selectedFilterId,
    handleChangeTabFilter,
    handleChangeTabSorting,
  } = useShowroomService();
  const sectionData = data?.pages;
  const isFilterEmpty = isEmpty(sectionData) && filterList?.length === 1;

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useHeaderDispatch({
    type: 'mweb',
    title: metaData.title,
    enabled: !isLoading,
    quickMenus: ['cart', 'menu'],
    transitionTrigger: triggerRef,
  });

  if (isError) {
    return <PageError error={error} />;
  }

  /** Filter Empty */
  if (isFilterEmpty) {
    return <PageError defaultMessage={EmptyDescription.GOODS} />;
  }

  return (
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
            options: sortingOptions,
            onChange: (e, o) => handleChangeTabSorting(o.value),
          }}
        />
      )}
      {sectionData && (
        <SectionList
          type={SectionTypes.GOODS}
          title={metaData.title}
          data={sectionData}
          loading={isFetching}
          hasMore={hasNextPage}
          getHandlers={getHandlers}
          onLoadMore={fetchNextPage}
        />
      )}
    </>
  );
};
