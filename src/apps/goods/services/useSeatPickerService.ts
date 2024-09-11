import { useCallback, useEffect, useRef, useState } from 'react';
import env from '@env';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { useWebInterface } from '@hooks/useWebInterface';
import { useQuery } from '@hooks/useQuery';
import { UseMutationOptions } from 'react-query';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { useModal } from '@hooks/useModal';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import throttle from 'lodash/throttle';
import { useModalLogService } from './useModalLogService';
import {
  OptionComponentModel,
  OptionInfoModel,
  SeatInfoModel,
  toSeatInfoModel,
  toSingleSeatInfoModel,
  SelectSeatHandlerProps,
} from '../models';
import { PickerInitialValuesProps, OptionReceiveValuesType, ParentOptionsProps, SelectedOptionsProps } from '../types';
import { LayoutLockRequestParam, createLayoutLock, getSeatInfo, getSingleSeatInfo } from '../apis';
import { AreaSchema, LayoutLockSchema, LayoutSchema } from '../schemas';
import { OptionUiType, SEAT_INFO_QUERY_KEY, SEAT_SINGLE_INFO_QUERY_KEY, SeatInfoText } from '../constants';

interface Props {
  goodsId: number;
  components?: OptionComponentModel[];
  parentOptions?: ParentOptionsProps[];
}

interface SeatInitProps {
  componentsData?: OptionComponentModel[];
  parentOptionsInfo?: ParentOptionsProps[];
  selectedOptions?: SelectedOptionsProps[];
}

interface LayoutLockReceiveProps {
  expiredDate: number;
  scheduleId: number;
}

interface ImageViewerInitProps {
  imageData: {
    path: string | null;
    blurHash: string | null;
  };
  topBarTitle: string;
}

const defaultSeatInfo: SeatInfoModel = {
  goodsId: null,
  scheduleId: null,
  userMaxPurchaseEa: 0,
  scheduleAt: null,
  showAreaTab: null,
  image: {
    path: null,
    blurHash: null,
  },
  floatingObjects: [],
  displayStage: undefined,
  selectedArea: undefined,
  areaList: [],
  layouts: [],
};

let scrolling: NodeJS.Timeout | null;

export const useSeatPickerService = ({ goodsId, components, parentOptions }: Props) => {
  /** 날짜 회차 정보 */
  const [scheduleDateTime, setScheduleDateTime] = useState(0);
  /** 선택한 구역 정보 */
  const [selectedArea, setSeletedArea] = useState<number | null>(null);
  /** 선택한 좌석 정보 */
  const [selectedSeats, setSelectedSeats] = useState<LayoutSchema[]>([]);
  /** 전체/단일 구역 정보 업데이트 구분 플래그 */
  const [updatedAllSeatInfo, setUpdateAllSeatInfo] = useState(true);
  /** 전체/단일 구역 업데이트에 따른 좌석 정보 별도 상태 관리 */
  const [seatInfo, setSeatInfo] = useState<SeatInfoModel | undefined>(defaultSeatInfo);
  /** 좌석 정보 플로팅 노출 여부 */
  const [showSeatTypeFloating, setShowSeatTypeFloating] = useState(true);
  const [isInitialError, setInitialError] = useState(false);
  const { isApp } = useDeviceDetect();
  const { initialValues, open, close, showToastMessage, toolbarButtonTappedValue, generateHapticFeedback } =
    useWebInterface();

  const { logPickerPageInit, logTabSeatReset, logTabSeatMap, logCompleteSeatPicker } = useModalLogService();
  const { closeModal } = useModal();
  /** 마지막 옵션 여부 */
  const isLastOption = useRef<boolean>(false);
  /** 현재 옵션 depth */
  const step = useRef<number>(0);
  /** 선택한 좌석 layoutId 리스트 */
  const layoutIds = useRef<number[]>([]);
  /** 옵션명으로 노출되는 옵션 Title */
  const displayValues = useRef<string>('');
  /** 선택한 좌석 옵션 리스트 */
  const optionList = useRef<OptionInfoModel[]>([]);
  /** 이미지뷰어 오버레이 */
  const imageOverlayRef = useRef<HTMLDivElement>(null);

  const seatInfoQuery = useQuery(
    [SEAT_INFO_QUERY_KEY, goodsId, scheduleDateTime],
    () => getSeatInfo({ goodsId, scheduleAt: scheduleDateTime, scheduleId: selectedArea }),
    {
      select: (data) => toSeatInfoModel(data, selectedArea),
      enabled: scheduleDateTime !== 0 && updatedAllSeatInfo,
      cacheTime: 0,
    },
  );

  const seatSingleInfoQuery = useQuery(
    [SEAT_SINGLE_INFO_QUERY_KEY, goodsId, selectedArea],
    () => getSingleSeatInfo({ goodsId, scheduleId: selectedArea }),
    {
      select: toSingleSeatInfoModel,
      enabled: selectedArea !== null && !updatedAllSeatInfo,
      cacheTime: 0,
    },
  );

  useEffect(() => {
    /** error refetch & refresh 시, 전체 데이터 업데이트 */
    if (seatInfoQuery.data && updatedAllSeatInfo) {
      setSeatInfo(seatInfoQuery.data);
    }
    /** 구역 변경 시, 기존 전체 데이터에 해당 구역 데이터만 업데이트 */
    if (seatSingleInfoQuery.data && !updatedAllSeatInfo) {
      // eslint-disable-next-line consistent-return
      setSeatInfo((prev) => {
        // areaList 머지 시, 선택한 index 데이터 업데이트
        if (prev) {
          const selectedIndex = prev.areaList.findIndex(
            (data) => data.scheduleId === seatSingleInfoQuery.data.areaList[0].scheduleId,
          );
          const updateAreaData = [...prev.areaList];
          // eslint-disable-next-line prefer-destructuring
          updateAreaData[selectedIndex] = seatSingleInfoQuery.data.areaList[0];
          return { ...seatSingleInfoQuery.data, areaList: updateAreaData };
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatInfoQuery.data, seatSingleInfoQuery.data, toolbarButtonTappedValue]);

  /**
   * 구역 선택 변경
   */
  const handleChangeArea = (item: AreaSchema) => {
    setSeletedArea(item.scheduleId);
    if (updatedAllSeatInfo) setUpdateAllSeatInfo(false);
    setSelectedSeats([]);
  };

  /**
   * 좌석 Lock 생성 Mutation
   */
  const useCreateSeatLockService = (
    options?: UseMutationOptions<LayoutLockSchema[], ErrorModel, LayoutLockRequestParam>,
  ) => {
    return useMutation(createLayoutLock, options);
  };

  const { mutate: createSeatLockMutation, isLoading: isSeatLockLoading } = useCreateSeatLockService({
    onSuccess: (data: LayoutLockSchema[]) => {
      const receiveData = handleReceiveData({ expiredDate: data[0].expiredDate, scheduleId: data[0].scheduleId });
      logCompleteSeatPicker({
        scheduleId: data[0].scheduleId,
        layoutIds: layoutIds.current,
        quantity: layoutIds.current.length,
      });
      closeSeatPicker(receiveData);
    },
    onError: async (error: ErrorModel<ErrorDataModel>) => {
      showToastMessage({ message: error.data?.message ?? SeatInfoText.ERROR.DEFAULT_MESSAGE });
      generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });
      setSelectedSeats([]);
      setUpdateAllSeatInfo(true);
      seatInfoQuery.refetch();
    },
  });

  const getLayoutIds = (data: LayoutSchema[]): number[] => {
    const result: number[] = [];
    data.forEach((layout) => result.push(layout.id));
    return result;
  };

  const getDisplayValues = (data: LayoutSchema[]): string => {
    const result: string[] = [];
    data.forEach((layout) => result.push(layout.selectedValue));
    return result.join(', ');
  };

  const getOptions = (data: LayoutSchema[]): OptionInfoModel[] => {
    const result: OptionInfoModel[] = [];
    data.forEach((layout) => layout.option && result.push(layout.option));
    return result;
  };

  /**
   * 좌석 피커 완료 버튼 클릭
   */
  const handleCompleteSeatPicker = (scheduleId: number | undefined) => {
    const seatData = selectedSeats.sort((a, b) => {
      return a.id - b.id;
    });
    layoutIds.current = getLayoutIds(seatData);
    displayValues.current = getDisplayValues(seatData);
    optionList.current = getOptions(seatData);
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium });
    createSeatLockMutation({ goodsId, scheduleId: scheduleId ?? null, layoutIds: layoutIds.current });
  };

  /**
   * close 인터페이스 receive data 가공
   */
  const handleReceiveData = ({ scheduleId, expiredDate }: LayoutLockReceiveProps) => {
    const optionsData = isLastOption.current ? { options: optionList.current } : { children: optionList.current };
    const receiveValues = {
      value: displayValues.current,
      optionValues: [JSON.stringify({ scheduleId, layoutIds: layoutIds.current })],
      metaData: {
        stepIndex: step.current,
        expired: {
          expiredDate,
          title: SeatInfoText.EXPIRED.TITLE,
          message: SeatInfoText.EXPIRED.MESSAGE,
        },
        seat: {
          scheduleId,
          layoutIds: layoutIds.current,
        },
      },
      ...optionsData,
    } as OptionReceiveValuesType;
    return receiveValues;
  };

  const closeSeatPicker = (params: OptionReceiveValuesType) => {
    close(
      { ...params },
      {
        doWeb: () => {
          closeModal('', { ...params });
        },
      },
    );
  };

  /**
   * open 인터페이스 initial data 가공
   */
  const handleSeatInit = ({ componentsData, parentOptionsInfo }: SeatInitProps) => {
    const totalComponents = componentsData?.length;
    if (parentOptionsInfo && !isEmpty(parentOptionsInfo)) {
      step.current = parentOptionsInfo.length;
    }
    if (totalComponents && step.current === totalComponents - 1) {
      isLastOption.current = true;
    }
    if (parentOptionsInfo && parentOptionsInfo.length > 0) {
      const optionFilterData = parentOptionsInfo.find((data) => data.type === 'CALENDAR_DAY_TIME');
      if (optionFilterData) {
        const { values } = optionFilterData;
        const parseValues = JSON.parse(values[0]).dateTime;
        if (parseValues) {
          logPickerPageInit({ goodsId, type: OptionUiType.SEAT_PICKER });
          setScheduleDateTime(parseValues);
        } else {
          setInitialError(true);
        }
      }
    }
  };

  /**
   * 좌석 선택 시 selected 데이터 관리
   */
  const handleSelectSeat = ({ seatData, callback }: SelectSeatHandlerProps) => {
    if (!seatData.enable) return;
    const isSelectedSeat = selectedSeats.some((seat: LayoutSchema) => seat.id === seatData.id);
    if (isSelectedSeat) {
      setSelectedSeats((seatList: LayoutSchema[]) => seatList.filter((item: LayoutSchema) => item.id !== seatData.id));
    } else {
      if (seatInfo && seatInfo.userMaxPurchaseEa !== 0 && selectedSeats.length + 1 > seatInfo.userMaxPurchaseEa) {
        showToastMessage({ message: `최대 ${seatInfo.userMaxPurchaseEa}매까지 예매할 수 있습니다` });
        return;
      }
      setSelectedSeats((prevSeatList: LayoutSchema[]) => [...prevSeatList, seatData]);
    }
    callback(isSelectedSeat);
    generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight });
  };

  /**
   * ImageViewer 열기(앱/웹 구분)
   */
  const handleOpenImageViewer = ({ imageData, topBarTitle }: ImageViewerInitProps) => {
    logTabSeatMap();
    if (!isApp) {
      if (imageOverlayRef && imageOverlayRef.current) {
        imageOverlayRef.current.style.display = 'flex';
      }
      return;
    }
    const url = getAppLink(AppLinkTypes.WEB, {
      landingType: 'modal',
      url: `${env.endPoint.baseUrl}/goods/option/image-viewer`,
    });
    open({ url, initialData: { imageData, topBarTitle } });
  };

  /**
   * Refresh 클릭
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRefreshSeatInfo = useCallback(
    debounce(() => {
      setSelectedSeats([]);
      selectedArea && logTabSeatReset({ scheduleId: selectedArea });
      if (!updatedAllSeatInfo) {
        setUpdateAllSeatInfo(true);
      } else {
        seatInfoQuery.refetch();
      }
    }, 300),
    [updatedAllSeatInfo],
  );

  const handleShowSeatTypeFloating = () => {
    setShowSeatTypeFloating((state) => !state);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScrollSeatMap = useCallback(
    throttle(() => {
      if (!scrolling) {
        handleShowSeatTypeFloating();
      }
      scrolling && clearTimeout(scrolling);
      scrolling = setTimeout(() => {
        handleShowSeatTypeFloating();
        scrolling = null;
      }, 500);
    }, 100),
    [],
  );

  useEffect(() => {
    if (!isApp && isEmpty(initialValues)) {
      handleSeatInit({ componentsData: components, parentOptionsInfo: parentOptions });
      return;
    }
    if (!isEmpty(initialValues)) {
      const { components: componentsData, parentOptions: parentOptionsData } =
        initialValues as PickerInitialValuesProps;
      if (parentOptionsData) {
        handleSeatInit({ componentsData, parentOptionsInfo: parentOptionsData });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    if (toolbarButtonTappedValue && seatInfoQuery.data) {
      if (toolbarButtonTappedValue.type === 'view') {
        handleOpenImageViewer({ imageData: seatInfoQuery.data.image, topBarTitle: '좌석배치도' });
      }
      if (toolbarButtonTappedValue.type === 'refresh') {
        handleRefreshSeatInfo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbarButtonTappedValue]);

  return {
    seatInfoQuery,
    seatSingleInfoQuery,
    isInitialError,
    handleCompleteSeatPicker,
    isSeatLockLoading,
    handleOpenImageViewer,
    handleChangeArea,
    handleSelectSeat,
    handleScrollSeatMap,
    seatInfo,
    selectedSeats,
    imageOverlayRef,
    showSeatTypeFloating,
  };
};
