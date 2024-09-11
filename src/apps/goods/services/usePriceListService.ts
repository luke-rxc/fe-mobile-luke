import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useQuery } from '@hooks/useQuery';
import { FilterBarProps } from '@features/filter';
import { OptionSortingType } from '@constants/goods';
import { getPriceList } from '../apis';
import { QueryKeys } from '../constants';
import { PriceListOptionSchema } from '../schemas';
import { useModalLogService } from './useModalLogService';
// import { goodsPriceList } from '../apis/__mocks__';

interface Props {
  goodsId: number;
}

const sortingOptions: { label: string; value: OptionSortingType }[] = [
  { label: '날짜순', value: OptionSortingType.LATEST_DATE },
  { label: '가격순', value: OptionSortingType.PRICE_LOW },
];

export const usePriceListService = ({ goodsId }: Props) => {
  const { isApp } = useDeviceDetect();
  const { logTabPriceListSorting } = useModalLogService();

  /** sorting value */
  const sortValue = useRef<OptionSortingType>(sortingOptions[0].value);
  /** tab value */
  const [tabValue, setTabValue] = useState<number>(0);
  /** 선택된 tab의 하위 옵션 리스트 */
  const [optionValues, setOptionValues] = useState<PriceListOptionSchema[]>([]);
  /** 스크롤 여부 */
  const [scrolling, setScrolling] = useState<boolean>(false);

  const { data, isLoading, isError, refetch } = useQuery(
    [QueryKeys.PRICE_LIST, goodsId],
    () => getPriceList({ goodsId }),
    // () => goodsPriceList({ goodsId }),
  );

  /** 스크롤 위치 리셋 */
  const handleResetScroll = () => {
    if (isApp) {
      window.scrollTo(0, 0);
      return;
    }

    const $floating = document.getElementById('floating-root') as HTMLDivElement;
    const drawerInner = $floating.querySelector('.drawer-inner') as HTMLDivElement;

    if (drawerInner) {
      drawerInner.style.overflowY = 'hidden';
      drawerInner.scrollTo(0, 0);
      drawerInner.style.overflowY = 'auto';
    }
  };

  /** 옵션 리스트 sorting */
  const getSortingOptions = (type: OptionSortingType, options: PriceListOptionSchema[]) => {
    const sortOptions = [...options];

    switch (type) {
      case OptionSortingType.PRICE_LOW:
        return sortOptions.sort((prev, current) => {
          if (prev.price < current.price) {
            return -1;
          }
          if (prev.price === current.price) {
            if (prev.bookingDate < current.bookingDate) {
              return -1;
            }
          }
          return 0;
        });
      default:
        return sortOptions;
    }
  };

  /** 옵션 리스트 갱신 */
  const executeUpdateOptionValues = (index: number) => {
    if (!data) {
      return;
    }
    const { tabs } = data;
    const { options } = tabs[index];

    const sortOptions = getSortingOptions(sortValue.current, options);

    setOptionValues(() => [...sortOptions]);
    handleResetScroll();
  };

  /** tab 변경 */
  const handleChangeTab: Required<FilterBarProps<string>>['category']['onChange'] = (e_, option, index) => {
    setTabValue(index);
    executeUpdateOptionValues(index);
  };

  /** sorting 변경 */
  const handleChangeSorting: Required<FilterBarProps<string, ArrayElement<typeof sortingOptions>>>['sort']['onChange'] =
    (e, sort) => {
      sortValue.current = sort.value;
      logTabPriceListSorting({
        goodsId,
        sortingValue: sort.value,
        sortingLabel: sortingOptions.filter(({ value }) => value === sort.value)[0].label,
      });
      executeUpdateOptionValues(tabValue);
    };

  const handleScroll = useCallback(() => {
    if (isApp) {
      setScrolling(window.scrollY > 0);
      return;
    }

    const $floating = document.getElementById('floating-root') as HTMLDivElement;
    const drawerInner = $floating.querySelector('.drawer-inner');

    drawerInner && setScrolling(drawerInner.scrollTop > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    executeUpdateOptionValues(tabValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isApp) {
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    const $floating = document.getElementById('floating-root') as HTMLDivElement;
    const drawerInner = $floating.querySelector('.drawer-inner');

    drawerInner?.addEventListener('scroll', handleScroll);

    return () => {
      drawerInner?.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    isLoading,
    isError,
    sortingOptions,
    tabValue,
    optionValues,
    scrolling,
    refetch,
    handleChangeTab,
    handleChangeSorting,
  };
};
