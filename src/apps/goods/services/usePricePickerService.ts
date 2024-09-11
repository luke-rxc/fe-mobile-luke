import { useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useModal } from '@hooks/useModal';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import {
  BubbleValuesType,
  ExpiredInfoType,
  OptionBubbleSelectedValuesType,
  ParentOptionsProps,
  PickerInitialValuesProps,
  SeatOptionsType,
  SelectedOptionsProps,
} from '../types';
import { LayoutOptionSchema, OptionComponentsSchema, OptionItemSchema } from '../schemas';
import { CalendarParams, getLayoutOptions } from '../apis/options';
import { useGoodsOptionsState } from '../stores';
import { OptionComponentModel, toLayoutOptionsModel } from '../models';
import { OptionUiType, QueryKeys } from '../constants';
import { useModalLogService } from './useModalLogService';
// import { layoutMockOptionsApi } from '../apis/__mocks__';

interface Props {
  /** 상품 Id */
  goodsId: number;
  /** 옵션 구성 components */
  components?: OptionComponentModel[];
  /** 상위 옵션 정보 */
  parentOptions?: ParentOptionsProps[];
  /** 만료시간 정보 */
  expired?: ExpiredInfoType | null;
}

// 선택된 옵션 버블 초기값
const optionBubbleSelectedInitialValues: OptionBubbleSelectedValuesType = {
  row: '',
  item: '',
  value: '',
  displayValue: '',
};

// 좌석 정보 초기값
const seatOptionsInitialValues: SeatOptionsType = {
  scheduleId: 0,
  layoutIds: [],
};

export const usePricePickerService = ({ goodsId, components, parentOptions, expired }: Props) => {
  const goodsOptions = useGoodsOptionsState();
  const {
    logPickerPageInit: handleLogPickerPageInit,
    logCompletePricePicker: handleLogCompletePricePicker,
    logImpressionTimeoutConfirm: handleLogImpressionTimeoutConfirm,
  } = useModalLogService();

  const { isApp } = useDeviceDetect();
  const { initialValues, close, alert, generateHapticFeedback } = useWebInterface();
  const { closeModal } = useModal();

  /** 선택된 정보 */
  const [selected, setSelected] = useState<OptionBubbleSelectedValuesType[]>([]);

  /** 옵션 컴포넌트 정보 */
  const componentsType = useRef<OptionComponentsSchema[]>([]);
  /** 선택한 옵션 총 수량 */
  const selectedOptionStock = useRef<number>(0);
  /** 마지막 옵션 여부 */
  const isLastOption = useRef<boolean>(false);
  /** 현재 옵션 depth */
  const step = useRef<number>(0);
  /** 좌석 정보 */
  const seatOptions = useRef<SeatOptionsType>(seatOptionsInitialValues);
  /** 점유 만료 Data */
  const expiredRef = useRef<ExpiredInfoType>();
  // 점유 만료 Alert 노출 여부
  const isOpenExpiredAlert = useRef<boolean>(false);

  const { data, isLoading, isFetched, isError, refetch } = useQuery(
    [QueryKeys.LAYOUT_OPTIONS, goodsId],
    () =>
      getLayoutOptions({
        goodsId,
        scheduleId: seatOptions.current.scheduleId,
        layoutIds: seatOptions.current.layoutIds,
      }),
    // layoutMockOptionsApi({
    //   goodsId,
    //   scheduleId: seatOptions.current.scheduleId,
    //   layoutIds: seatOptions.current.layoutIds,
    // }),
    {
      enabled: false,
      select: (res) => toLayoutOptionsModel(res),
      onSuccess: () => {
        handleLogPickerPageInit({ goodsId, type: OptionUiType.PRICE_PICKER });
      },
    },
  );

  const getLayoutOptionsInfo = (items: OptionItemSchema[]) => {
    const layoutOptions: BubbleValuesType[] = [];

    items.forEach((item) => {
      const { value, options } = item;

      if (!options) {
        return;
      }

      const { purchasableStock, price } = options[0];

      layoutOptions.push({
        title: value,
        value,
        displayValue: value,
        disabled: !purchasableStock,
        price,
      });
    });

    return layoutOptions;
  };

  const handleSelect = (seat: string, option: BubbleValuesType, index?: number) => {
    if (!data || (index !== 0 && !index)) {
      return;
    }
    const { layouts } = data;
    const { title, value, displayValue } = option;

    // options, row, item, value(select box), optionValues(실제값)
    const selectedRow = layouts.filter((layout) => layout.name === seat)[0];
    const selectedItem = selectedRow.items.filter((item) => item.value === option.value)[0].options?.[0];

    const currentSelected = selected.map((select, idx) => {
      if (idx === index) {
        return { row: seat, item: title, value, displayValue, ...(selectedItem && { option: selectedItem }) };
      }
      return select;
    });

    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
    setSelected(currentSelected);
  };

  const handleComplete = () => {
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });

    const selectedValue = selected.reduce((prev, current) => {
      const { item } = current;

      if (prev) {
        return `${prev}, ${item}`;
      }

      return `${item}`;
    }, '');

    const options = selected.map(({ option }) => option);
    const optionValues = {
      optionIds: [] as number[],
      layoutIds: [] as number[],
    };

    options.forEach((option) => {
      if (!option || !option.secondaryId) {
        return;
      }

      optionValues.optionIds.push(option?.id);
      optionValues.layoutIds.push(option?.secondaryId);
    });

    const params = {
      value: selectedValue,
      optionValues: [JSON.stringify(optionValues)],
      metaData: {
        stepIndex: step.current,
      },
      options,
    };

    handleLogCompletePricePicker({ ...optionValues });
    close(params, {
      doWeb: () => {
        closeModal('', params);
      },
    });
  };

  /** 강제 닫기(값 전달 X) */
  const handleForceClose = async (error?: string) => {
    if (!expiredRef.current || isOpenExpiredAlert.current) {
      return;
    }

    handleLogImpressionTimeoutConfirm();
    const { title, message } = expiredRef.current;
    // * 화면 잠금 후 해제 시 재노출 방지를 위해 alert 노출 여부 판단
    isOpenExpiredAlert.current = true;
    await alert({ title, message });

    isOpenExpiredAlert.current = false;
    close(
      {},
      {
        doWeb: () => {
          closeModal('', { error: error ?? '에러 발생' });
        },
        isError: true,
      },
    );
  };

  const setSelectedInit = (layouts: LayoutOptionSchema[]) => {
    const selectedInit: OptionBubbleSelectedValuesType[] = layouts.map((layout) => {
      const { name, items } = layout;
      const initIndex = items.findIndex((item) => item.options && item.options[0].purchasableStock);

      if (initIndex === -1) {
        return optionBubbleSelectedInitialValues;
      }

      const { value, options } = items[initIndex];

      const [option] = options ?? [];

      return { row: name, item: value, value, displayValue: value, ...(option && { option }) };
    });

    setSelected(selectedInit);
  };

  const setComponentsType = (componentsData: OptionComponentModel[]) => {
    componentsType.current = componentsData.map(({ type }) => type);
  };

  const setSeatOptions = (parentOptionsInfo: CalendarParams[]) => {
    seatOptions.current = JSON.parse(parentOptionsInfo.filter((option) => option.type === 'SEAT')[0].values[0]);
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
    expiredInfo?: ExpiredInfoType | null,
    selectedOptions?: SelectedOptionsProps[],
  ) => {
    if (!componentsData) {
      refetch();

      return;
    }

    setComponentsType(componentsData);

    if (parentOptionsInfo && !isEmpty(parentOptionsInfo)) {
      setSeatOptions(parentOptionsInfo);
      step.current = parentOptionsInfo.length;
    }

    const totalComponents = componentsType.current.length;
    if (step.current === totalComponents - 1) {
      isLastOption.current = true;
    }

    if (expiredInfo) {
      expiredRef.current = expiredInfo;
    }

    setSelectedOptionStock(selectedOptions);

    refetch();
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    const { layouts } = data;

    setSelectedInit(layouts);
  }, [data]);

  useEffect(() => {
    if (!isApp && isEmpty(initialValues)) {
      handleInit(components, parentOptions, expired);
      return;
    }

    const {
      components: componentsData,
      parentOptions: appParentOptions,
      selectedOptions,
      metaData,
    } = initialValues as PickerInitialValuesProps;

    const expiredInfo = metaData?.expired as ExpiredInfoType;

    handleInit(componentsData, appParentOptions, expiredInfo, selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const isDisabled = !isEmpty(selected.filter((value) => !value.row && !value.item));

  return {
    data,
    isLoading,
    isFetched,
    isError,
    selected,
    expiredInfo: expiredRef.current,
    isDisabled,
    refetch,
    getLayoutOptionsInfo,
    handleSelect,
    handleComplete,
    handleForceClose,
  };
};
