import { useCallback, useEffect, useState } from 'react';
import { tracking } from '@utils/log';
import { AppLogTypes, WebLogTypes } from '@constants/log';
import { debugLog } from '../utils';
import { LogEventTypes, OptionUiType } from '../constants';

interface PickerLogInitParams {
  goodsId: number;
  type: OptionUiType;
}

const handleEventLogging = ({
  name,
  parameters,
  targets,
}: {
  name: LogEventTypes;
  parameters: Record<string, unknown>;
  targets?: tracking.LogTrackingTarget;
}) => {
  debugLog(name, parameters);
  tracking.logEvent({
    name,
    parameters,
    targets: {
      web: [WebLogTypes.MixPanel, ...(targets?.web ?? [])],
      ...(targets?.app && { app: targets.app }),
    },
  });
};

export const useModalLogService = () => {
  const [pickerBaseParams, setPickerBaseParams] = useState<PickerLogInitParams | null>(null);

  // picker 모달 진입 시
  const logViewPicker = useCallback(() => {
    if (pickerBaseParams === null) {
      return;
    }

    const { goodsId, type } = pickerBaseParams;
    const logParams = {
      goods_id: `${goodsId}`,
    };

    switch (type) {
      // 날짜선택 모달 진입 시
      case OptionUiType.DATE_PICKER:
        handleEventLogging({
          name: LogEventTypes.LogViewDatePicker,
          parameters: logParams,
          targets: {
            app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
          },
        });
        break;
      // 날짜/회차 선택 모달 진입 시
      case OptionUiType.DATE_TIME_PICKER:
        handleEventLogging({
          name: LogEventTypes.LogViewDateTimePicker,
          parameters: logParams,
          targets: {
            app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
          },
        });
        break;
      // 좌석 선택 모달 진입 시
      case OptionUiType.SEAT_PICKER:
        handleEventLogging({
          name: LogEventTypes.LogViewSeatPicker,
          parameters: logParams,
          targets: {
            app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
          },
        });
        break;
      // 권종 선택 모달 진입 시
      case OptionUiType.PRICE_PICKER:
        handleEventLogging({
          name: LogEventTypes.LogViewPricePicker,
          parameters: logParams,
          targets: {
            app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
          },
        });
        break;
      default:
        break;
    }
  }, [pickerBaseParams]);

  // 날짜선택 완료 시
  const logCompleteDatePicker = useCallback(() => {
    if (pickerBaseParams === null) {
      return;
    }

    const { goodsId } = pickerBaseParams;
    const logParams = {
      goods_id: `${goodsId}`,
    };

    handleEventLogging({
      name: LogEventTypes.LogCompleteDatePicker,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [pickerBaseParams]);

  // 날짜/회차 선택 완료 시
  const logCompleteDateTimePicker = useCallback(() => {
    if (pickerBaseParams === null) {
      return;
    }

    const { goodsId } = pickerBaseParams;
    const logParams = {
      goods_id: `${goodsId}`,
    };

    handleEventLogging({
      name: LogEventTypes.LogCompleteDateTimePicker,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [pickerBaseParams]);

  // 좌석 새로고침 탭시
  const logTabSeatReset = useCallback(
    ({ scheduleId }: { scheduleId: number }) => {
      if (pickerBaseParams === null) {
        return;
      }

      const { goodsId } = pickerBaseParams;
      const logParams = {
        goods_id: `${goodsId}`,
        area_id: `${scheduleId}`,
      };

      handleEventLogging({
        name: LogEventTypes.LogTabSeatReset,
        parameters: logParams,
        targets: {
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        },
      });
    },
    [pickerBaseParams],
  );

  // 좌석도 (이미지) 탭 시
  const logTabSeatMap = useCallback(() => {
    if (pickerBaseParams === null) {
      return;
    }

    const { goodsId } = pickerBaseParams;
    const logParams = {
      goods_id: `${goodsId}`,
    };

    handleEventLogging({
      name: LogEventTypes.LogTabSeatMap,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  }, [pickerBaseParams]);

  // 좌석 선택 완료 시
  const logCompleteSeatPicker = useCallback(
    ({ scheduleId, layoutIds, quantity }: { scheduleId: number; layoutIds: number[]; quantity: number }) => {
      if (pickerBaseParams === null) {
        return;
      }

      const { goodsId } = pickerBaseParams;
      const logParams = {
        goods_id: `${goodsId}`,
        area_id: `${scheduleId}`,
        seat_id: layoutIds,
        seat_quantity: `${quantity}`,
      };

      handleEventLogging({
        name: LogEventTypes.LogCompleteSeatPicker,
        parameters: logParams,
        targets: {
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        },
      });
    },
    [pickerBaseParams],
  );

  // 권종 선택 완료 시
  const logCompletePricePicker = useCallback(
    ({ optionIds, layoutIds }: { optionIds: number[]; layoutIds: number[] }) => {
      if (pickerBaseParams === null) {
        return;
      }

      const { goodsId } = pickerBaseParams;
      const logParams = {
        goods_id: `${goodsId}`,
        option_id: optionIds,
        seat_id: layoutIds,
      };

      handleEventLogging({
        name: LogEventTypes.LogCompletePricePicker,
        parameters: logParams,
        targets: {
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        },
      });
    },
    [pickerBaseParams],
  );

  // 권종선택 모달에서 좌석 선점 시간 종료 시 뜨는 confirm message 노출시
  const logImpressionTimeoutConfirm = useCallback(() => {
    if (pickerBaseParams === null) {
      return;
    }
    const { goodsId } = pickerBaseParams;
    const logParams = {
      goods_id: `${goodsId}`,
      selected_view: 'price_picker',
    };

    handleEventLogging({
      name: LogEventTypes.LogImpressionTimeoutConfirm,
      parameters: logParams,
    });
  }, [pickerBaseParams]);

  // 요금표 모달 > 정렬기준 탭 시
  const logTabPriceListSorting = useCallback(
    ({ goodsId, sortingValue, sortingLabel }: { goodsId: number; sortingValue: string; sortingLabel: string }) => {
      const logParams = {
        goods_id: `${goodsId}`,
        sorting_id: sortingValue,
        sorting_name: sortingLabel,
      };

      handleEventLogging({
        name: LogEventTypes.LogGoodsTabPriceListSorting,
        parameters: logParams,
        targets: {
          app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        },
      });
    },
    [],
  );

  const logPickerPageInit = useCallback((parmas: PickerLogInitParams) => {
    setPickerBaseParams(parmas);
  }, []);

  useEffect(() => {
    if (pickerBaseParams === null) {
      return;
    }

    logViewPicker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerBaseParams]);

  return {
    logPickerPageInit,
    logCompleteDatePicker,
    logCompleteDateTimePicker,
    logTabSeatReset,
    logTabSeatMap,
    logCompleteSeatPicker,
    logCompletePricePicker,
    logImpressionTimeoutConfirm,
    logTabPriceListSorting,
  };
};
