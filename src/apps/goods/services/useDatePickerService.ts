import { useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import findLastIndex from 'lodash/findLastIndex';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { DaysIndexListType } from '@features/datePicker/types';
import { DatePickerMessage } from '@features/datePicker/constants';
import { getDateRangeText } from '@features/datePicker/utils';
import { TikcetKind } from '@constants/goods';
import { toDateFormat } from '@utils/date';
import { useGoodsOptionsState } from '../stores';
import { DatePickerUIType, OptionUiType, QueryKeys } from '../constants';
import { CalendarParams, postCalendar, postCalendarOptions } from '../apis/options';
import { OptionComponentModel, OptionInfoModel } from '../models';
import { PickerInitialValuesProps, ParentOptionsProps, SelectedOptionsProps } from '../types';
import { OptionComponentsSchema, OptionSchema } from '../schemas';
import { useModalLogService } from './useModalLogService';
// import { calendarMockMultiApi, calendarMockOptionsApi, calendarMockSingleApi } from '../apis/__mocks__';

interface Props {
  goodsId: number;
  components?: OptionComponentModel[];
  parentOptions?: ParentOptionsProps[];
}

export const useDatePickerService = ({ goodsId, components, parentOptions: parentOptionsData }: Props) => {
  const goodsOptions = useGoodsOptionsState();
  const { logPickerPageInit: handleLogPickerPageInit, logCompleteDatePicker: handleLogCompleteDatePicker } =
    useModalLogService();

  const { isApp } = useDeviceDetect();
  const { initialValues, close, showToastMessage, generateHapticFeedback } = useWebInterface();
  const { closeModal } = useModal();

  /** init state */
  const [isInit, setIsInit] = useState<boolean>(false);

  /** 옵션 컴포넌트 정보 */
  const componentsType = useRef<OptionComponentsSchema[]>([]);
  /** 현재까지 선택한 옵션 정보 (상위 옵션 + 현재 옵션) */
  const parentOptions = useRef<CalendarParams[]>([]);
  /** 선택한 옵션 총 수량 */
  const selectedOptionStock = useRef<number>(0);
  /** 마지막 옵션 여부 */
  const isLastOption = useRef<boolean>(false);
  /** 현재 옵션 depth */
  const step = useRef<number>(0);
  /** 선택한 날짜 리스트 */
  const dateList = useRef<string[]>([]);
  /** 옵션명으로 노출되는 옵션 Title */
  const optionTitle = useRef<string>('');

  const {
    data: calendarData,
    refetch: refetchCalendar,
    isLoading,
    isError,
    isFetched,
  } = useQuery(
    [QueryKeys.CALENDAR, goodsId],
    () => postCalendar({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    // () => calendarMockSingleApi({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    // () => calendarMockMultiApi({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    {
      enabled: false,
      onSuccess: () => {
        handleLogPickerPageInit({ goodsId, type: OptionUiType.DATE_PICKER });
      },
    },
  );

  const { refetch: refetchCalendarOptions } = useQuery(
    [QueryKeys.CALENDAR_OPTIONS, goodsId],
    () => postCalendarOptions({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    // calendarMockOptionsApi({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    {
      enabled: false,
      onSuccess: ({ itemList }) => {
        executeClose(itemList);
      },
      onError: () => {
        showToastMessage({
          message: DatePickerMessage.ERROR_EMPTY_OPTION,
        });
        generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
      },
    },
  );

  const { months, stayNights, stayDays, ticketUI, ticketKind } = calendarData ?? {};
  /** 달력 UI 단일 터치 여부 */
  const singleTouch = ticketUI === DatePickerUIType.CALENDAR_SINGLE;
  /** 숙박 정보 표시 여부 */
  const displayStayInfo = !singleTouch || (singleTouch && ticketKind === TikcetKind.TRAVEL);

  /** option values 구하기 */
  const getOptionValues = (selected: DaysIndexListType[]): string[] => {
    if (!months) {
      return [];
    }

    const selectedList = selected.reduce((prev, current, currentIndex) => {
      const dates = current.map((d) => {
        if (months[currentIndex]) {
          const { year } = months[currentIndex];
          const { month } = months[currentIndex];
          const { day } = months[currentIndex].days[d];
          const date = new Date(`${year}/${month}/${day}`);

          return toDateFormat(date, 'yyyyMMdd');
        }
        return '';
      });

      return [...prev, ...dates];
    }, [] as string[]);

    return singleTouch ? selectedList.slice(0, 1) : selectedList.slice(0, -1);
  };

  /** option title(옵션명) 구하기 */
  const getOptionTitle = (selected: DaysIndexListType[]): string => {
    if (!months || stayNights === undefined || stayDays === undefined) {
      return '';
    }

    const nights = dateList.current.length;

    const startIndex = selected.findIndex((value) => !isEmpty(value));
    const startDayIndex = selected[startIndex][0];
    const endIndex = findLastIndex(selected, (value) => !isEmpty(value));
    const endDayIndex = selected[endIndex][selected[endIndex].length - 1];

    const { year: startYear, month: startMonth, days: startDays } = months[startIndex];
    const { day: startDay } = startDays[startDayIndex];
    const { year: endYear, month: endMonth, days: endDays } = months[endIndex];
    const { day: endDay } = endDays[endDayIndex];

    const startDate = new Date(`${startYear}/${startMonth}/${startDay}`);
    const endDate = new Date(`${endYear}/${endMonth}/${endDay}`);

    const hasEndDate = !singleTouch || (ticketKind === TikcetKind.TRAVEL && stayNights > 0);

    return getDateRangeText({
      startDate,
      endDate: hasEndDate ? endDate : undefined,
      nights: singleTouch ? stayNights : nights,
      days: singleTouch ? stayDays : nights + 1,
    });
  };

  /** 날짜 선택 완료 */
  const handleClickComplete = (selected: DaysIndexListType[]) => {
    if (!months || isEmpty(selected)) {
      return;
    }

    dateList.current = getOptionValues(selected);
    optionTitle.current = getOptionTitle(selected);

    parentOptions.current[step.current] = {
      type: 'CALENDAR_DAY',
      values: dateList.current,
    };

    if (!isLastOption.current) {
      refetchCalendarOptions();

      return;
    }

    // 마지막옵션에 대한 itemList 설정
    const itemList = selected.reduce((prev, current, currentIdx) => {
      if (singleTouch) {
        const startIndex = selected.findIndex((value) => !isEmpty(value));
        const dayIndex = selected[startIndex][0];

        const { options } = months[startIndex].days[dayIndex];
        return options ?? [];
      }

      const optionsList: OptionInfoModel[] = current.reduce((p, c) => {
        const { year, month, days } = months[currentIdx];
        const { day, options } = days[c];
        const date = new Date(`${year}/${month}/${day}`);

        const currentDate = toDateFormat(date, 'yyyyMMdd');

        if (dateList.current.includes(currentDate) && options) {
          return [...p, ...options];
        }

        return p;
      }, [] as OptionInfoModel[]);

      return [...prev, ...optionsList];
    }, [] as OptionInfoModel[]);

    executeClose(itemList);
  };

  /** DatePicker close */
  const executeClose = (itemList: OptionSchema['itemList'] | OptionInfoModel[]) => {
    if (isEmpty(itemList)) {
      showToastMessage({
        message: DatePickerMessage.ERROR_EMPTY_OPTION,
      });
      generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });

      return;
    }

    const optionsList = isLastOption.current ? { options: itemList } : { children: itemList };

    const params = {
      value: optionTitle.current,
      optionValues: dateList.current,
      metaData: { stepIndex: step.current },
      ...optionsList,
    };

    handleLogCompleteDatePicker();
    close(params, {
      doWeb: () => {
        closeModal('', params);
      },
    });
  };

  const setComponentsType = (componentsData: OptionComponentModel[]) => {
    componentsType.current = componentsData.map(({ type }) => type);
  };

  const setParentOptions = (parentOptionsInfo: CalendarParams[]) => {
    parentOptions.current = [...parentOptionsInfo];
  };

  const setSelectedOptionStock = (selectedOptions?: SelectedOptionsProps[]) => {
    if (!isApp) {
      selectedOptionStock.current = goodsOptions.reduce((prev, current) => {
        if (current.id !== goodsId) {
          return prev;
        }

        return prev + current.options.reduce((p, c) => p + c.stock, 0);
      }, 0);

      return;
    }

    if (!selectedOptions || isEmpty(selectedOptions)) {
      return;
    }

    selectedOptionStock.current = selectedOptions.reduce((prev, current) => prev + current.stock, 0);
  };

  /** calendar init */
  const handleCalendarInit = (
    componentsData: OptionComponentModel[],
    parentOptionsInfo?: CalendarParams[],
    selectedOptions?: SelectedOptionsProps[],
  ) => {
    setComponentsType(componentsData);

    if (parentOptionsInfo && !isEmpty(parentOptionsInfo)) {
      setParentOptions(parentOptionsInfo);
      step.current = parentOptions.current.length;
    }

    const totalComponents = componentsType.current.length;
    if (step.current === totalComponents - 1) {
      isLastOption.current = true;
    }

    setSelectedOptionStock(selectedOptions);

    refetchCalendar();
  };

  useEffect(() => {
    setIsInit(true);

    if (!isApp) {
      components && handleCalendarInit(components, parentOptionsData);
      return;
    }

    if (isEmpty(initialValues)) {
      return;
    }

    const {
      components: componentsData,
      parentOptions: appParentOptions,
      selectedOptions,
    } = initialValues as PickerInitialValuesProps;

    handleCalendarInit(componentsData, appParentOptions, selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return {
    isInit,
    calendarData,
    isLoading,
    isError,
    isFetched,
    selectedOptionStock: selectedOptionStock.current,
    singleTouch,
    displayStayInfo,
    refetchCalendar,
    handleClickComplete,
  };
};
