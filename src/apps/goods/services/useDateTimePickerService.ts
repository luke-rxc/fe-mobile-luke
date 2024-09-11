import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import {
  BubbleValuesType,
  OptionBubbleSelectedValuesType,
  ParentOptionsProps,
  PickerInitialValuesProps,
  SelectedOptionsProps,
} from '../types';
import { GoodsMessage, OptionMessage, OptionUiType, QueryKeys } from '../constants';
import { CalendarParams, postCalendarDayTimes, postCalendarOptions } from '../apis/options';
import { OptionComponentModel, OptionInfoModel } from '../models';
import { DateTimeDaysSchema, DayTimesSchema, OptionComponentsSchema, OptionSchema } from '../schemas';
import { useGoodsOptionsState } from '../stores';
import { useModalLogService } from './useModalLogService';
// import { calendarMockDateTimeApi } from '../apis/__mocks__';

interface Props {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 구성 components */
  components?: OptionComponentModel[];
  /** 상위 옵션 정보 */
  parentOptions?: ParentOptionsProps[];
}

// 선택된 옵션 버블 초기값
const optionBubbleSelectedInitialValues: OptionBubbleSelectedValuesType = {
  row: '',
  item: '',
  value: '',
  displayValue: '',
};

export const useDateTimePickerService = ({ goodsId, components, parentOptions: parentOptionsData }: Props) => {
  const goodsOptions = useGoodsOptionsState();
  const { logPickerPageInit: handleLogPickerPageInit, logCompleteDateTimePicker: handleLogCompleteDateTimePicker } =
    useModalLogService();

  const { isApp } = useDeviceDetect();
  const { initialValues, close, showToastMessage, generateHapticFeedback } = useWebInterface();
  const { closeModal } = useModal();

  /** 선택된 정보 */
  const [selected, setSelected] = useState<OptionBubbleSelectedValuesType>(optionBubbleSelectedInitialValues);

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

  const currentYear = new Date().getFullYear();

  const { data, isLoading, isError, isFetched, refetch } = useQuery(
    [QueryKeys.DATETIMES, goodsId],
    () => postCalendarDayTimes({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    // () => calendarMockDateTimeApi({ goodsId, components: componentsType.current, parameters: [] }),
    {
      enabled: false,
      onSuccess: () => {
        handleLogPickerPageInit({ goodsId, type: OptionUiType.DATE_TIME_PICKER });
      },
    },
  );

  const { refetch: refetchCalendarOptions } = useQuery(
    [QueryKeys.CALENDAR_OPTIONS, goodsId],
    () => postCalendarOptions({ goodsId, components: componentsType.current, parameters: parentOptions.current }),
    {
      enabled: false,
      onSuccess: ({ itemList }) => {
        executeClose(itemList);
      },
      onError: () => {
        showToastMessage({
          message: GoodsMessage.ERROR_NETWORK,
        });
        generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
      },
    },
  );

  /** reset selected value */
  const resetSelected = () => {
    setSelected(optionBubbleSelectedInitialValues);
  };

  /** 12시간제 변경 */
  const meridiemSystem = (hour: number, minute: number) => {
    const meridiem = hour < 24 && hour >= 12 ? '오후' : '오전';
    const meridiemHour = hour % 12 || 12;

    return minute === 0 ? `${meridiem} ${meridiemHour}시` : `${meridiem} ${meridiemHour}시 ${minute}분`;
  };

  /** 날짜(요일) 설정 */
  const getTitlesInfo = (days: DateTimeDaysSchema[]) => {
    return days.map((value) => {
      const { year, month, day, dayOfWeek } = value;

      if (year === currentYear) {
        return `${month}월 ${day}일(${dayOfWeek})`;
      }
      return `${year}년 ${month}월 ${day}일(${dayOfWeek})`;
    });
  };

  /** 시간(회차) 설정 */
  const getTimesInfo = (times: DayTimesSchema[]) => {
    return times.map((time) => {
      const { dateTime, selectedValue, enable, purchasableStock } = time;
      const newDate = new Date(dateTime);
      const hour = newDate.getHours();
      const minute = newDate.getMinutes();

      return {
        title: meridiemSystem(hour, minute),
        value: `${dateTime}`,
        displayValue: selectedValue,
        disabled: !enable || !purchasableStock,
      };
    });
  };

  const handleSelect = (date: string, time: BubbleValuesType) => {
    const { title, value, displayValue } = time;

    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
    setSelected({ row: date, item: title, value, displayValue });
  };

  const handleClickComplete = () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });

    const { value, option } = selected;
    const nowDate = Date.now();

    if (+value <= nowDate) {
      showToastMessage({ message: OptionMessage.ERROR_ENDED_SALES_TIME });
      resetSelected();
      refetch();
      return;
    }

    const selectedDate = format(new Date(+value), 'yyyyMMddHHmmss');

    parentOptions.current[step.current] = {
      type: 'CALENDAR_DAY_TIME',
      values: [`${selectedDate}`],
    };

    if (!componentsType.current.includes('SEAT') && !isLastOption.current) {
      refetchCalendarOptions();

      return;
    }

    executeClose(option && [option]);
  };

  const executeClose = (option?: OptionSchema['itemList'] | OptionInfoModel[]) => {
    const { value, displayValue } = selected;

    const optionsList = isLastOption.current ? { options: option } : { children: option };

    const params = {
      value: displayValue,
      optionValues: [JSON.stringify({ dateTime: value })],
      metaData: {
        stepIndex: step.current,
      },
      ...optionsList,
    };

    handleLogCompleteDateTimePicker();
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

  /** init */
  const handleInit = (
    componentsData?: OptionComponentModel[],
    parentOptionsInfo?: CalendarParams[],
    selectedOptions?: SelectedOptionsProps[],
  ) => {
    if (!componentsData) {
      refetch();

      return;
    }

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

    refetch();
  };

  useEffect(() => {
    if (!isApp && isEmpty(initialValues)) {
      handleInit(components, parentOptionsData);
      return;
    }

    const {
      components: componentsData,
      parentOptions: appParentOptions,
      selectedOptions,
    } = initialValues as PickerInitialValuesProps;

    handleInit(componentsData, appParentOptions, selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return {
    data,
    isLoading,
    isError,
    isFetched,
    selected,
    refetch,
    getTitlesInfo,
    getTimesInfo,
    handleSelect,
    handleClickComplete,
  };
};
