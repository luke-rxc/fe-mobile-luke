import React, { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { ModalStatus } from '@stores/useModalStore';
import { getImageLink } from '@utils/link';
import { StepperEvent } from '@pui/stepper';
import { disabledBodyScroll, enabledBodyScroll } from '@utils/bodyScroll';
import { emitClearReceiveValues } from '@utils/webInterface';
import { OptionItemModel, OptionInfoModel, OptionUiModel, OptionSelectedModel } from '../models';
import {
  ExpiredInfoType,
  ExpiredType,
  OptionInitialValueProps,
  OptionReceiveErrorValuesType,
  OptionReceiveValuesType,
  OptionResultValuesProps,
  OptionSelectedInfoProps,
  OptionStatusProps,
  SeatType,
} from '../types';
import {
  OptionType,
  OptionSaveActionType,
  OptionPurchasableType,
  OptionDeleteActionDuration,
  OptionDeleteSubActionDuration,
  OptionDefaultMaxStock,
  OptionMessage,
  MultiChoicePolicyType,
} from '../constants';
import type { HandleActionSaveParam } from './useOptionActionService';
import { useGoodsOptionsAction, useGoodsOptionsState } from '../stores';
import { LayoutLockParams } from '../apis';

/** Service Base Props */
interface Props {
  /** Option Open 여부 */
  isOpen: boolean;
  /** 옵션 UI 구성 데이터 */
  optionData: OptionUiModel;
  /** Ref: content wrapper element */
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  /** Ref: scroll (실제 scroll를 사용하는 element) */
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  /** Ref: scroll inner (scroll 내부 content element) */
  scrollInnerRef: React.MutableRefObject<HTMLUListElement | null>;
  /** Ref : Select-box (Option, 다중 옵션인 경우 주입) */
  selectRefs: React.MutableRefObject<(HTMLSelectElement | null)[]>;
  /** Ref: modal id (현재 오픈된 modal Id) */
  modalIdRef: React.MutableRefObject<string>;
  /** CTA 버튼 클릭시 해당 옵션 저장 */
  onActionSave: (params: HandleActionSaveParam) => void;
  /** 좌석 점유 해지 */
  onDeleteExpired: (params: LayoutLockParams) => void;
  /** Log: 옵션 선택 시 */
  onLogTabOption: (index: number) => void;
  /** Log: 옵션 블럭 삭제 시 */
  onLogTabDeleteOptionBlock: () => void;
  /** Log: 옵션블록 생성 후 날짜 옵션 재선택으로 confirm message 응답 시 */
  onLogTabReselectConfirm: (confirm: boolean) => void;
  /** Log: 좌석 선점 시간 종료시 뜨는 confirm message 노출 시  */
  onLogImpressionTimeoutConfirm: () => void;
}

// 옵션 목록
const optionInfos = new Array(3).fill([]);
// 옵션 구성 초기값
const optionInitialValues: OptionInitialValueProps = {
  purchasableStock: [],
  status: {
    prevValue: null,
    currentDepth: 0,
  },
  selectedInfo: [],
  selectedInfoActive: false,
  selectedStock: 1,
};

export const useOptionControlService = ({
  isOpen,
  optionData,
  contentRef,
  scrollRef,
  scrollInnerRef,
  selectRefs,
  modalIdRef,
  onActionSave: handleActionSave,
  onDeleteExpired: handleDeleteExpired,
  onLogTabOption: handleLogTabOption,
  onLogTabDeleteOptionBlock: handleLogTabDeleteOptionBlock,
  onLogTabReselectConfirm: handleLogTabReselectConfirm,
  onLogImpressionTimeoutConfirm: handleLogImpressionTimeoutConfirm,
}: Props) => {
  const goodsOptions = useGoodsOptionsState();
  const { updateGoodsOptions, deleteGoodsOption } = useGoodsOptionsAction();

  const { isApp } = useDeviceDetect();
  const { receiveValues, alert, confirm, showToastMessage } = useWebInterface();
  const { getStatus } = useModal();
  const {
    goodsId,
    goodsName,
    itemList,
    userMaxPurchaseEa,
    components,
    multiChoicePolicy,
    primaryImage: { blurHash, path },
  } = optionData as OptionUiModel;

  /** 이미지 경로 */
  const imagePath = getImageLink(path, 192);

  const total = components.length;
  const optionType = total > 0 ? OptionType.MULTI : OptionType.SINGLE;

  // 멀티 옵션인 경우, 현재 Select Step, 그전에 선택된 Value
  const [status, setStatus] = useState<OptionStatusProps>(optionInitialValues.status);
  // 스크롤 여부
  const [scrolling, setScrolling] = useState<boolean>(false);
  // Step Text
  const [selectedInfo, setSelectedInfo] = useState<OptionSelectedInfoProps[]>(optionInitialValues.selectedInfo);
  // 선택한 옵션 리스트
  const [selectedResult, setSelectedResult] = useState<OptionResultValuesProps[]>([]);
  // 최종 선택된 옵션 정보 (단일 옵션인 경우 Init Option 으로 주입)
  const [selectedOption, setSelectedOption] = useState<OptionInfoModel | null>(
    optionType === OptionType.SINGLE ? itemList[0].options && itemList[0].options[0] : null,
  );
  // selectedResult 옵션 값 추가할 때 상태(애니메이션 추가 삭제에 사용)
  const [isAdd, setIsAdd] = useState<boolean>(false);
  // 삭제될 option index
  const [deleteOptionIdx, setDeleteOptionIdx] = useState<number | null>(null);
  // 점유 만료시간 (좌석 지정)
  const expiredRef = useRef<ExpiredInfoType>();
  // 점유 만료 Alert 노출 여부
  const isOpenExpiredAlert = useRef<boolean>(false);

  // 선택된 모든 옵션 수량 총합
  const selectedTotalStock = selectedResult.reduce((prev, option) => prev + option.stock, 0);

  const updateOptionValue = (index: number, value = '') => {
    if (selectRefs.current && selectRefs.current[index]) {
      // eslint-disable-next-line no-param-reassign
      (selectRefs.current[index] as HTMLSelectElement).value = value;
      (selectRefs.current[index] as HTMLSelectElement).blur();
    }
  };

  /** Reset Option Select */
  const resetOptionValue = () => {
    components.forEach((_, index) => {
      updateOptionValue(index);
    });
    setSelectedInfo([]);
    setStatus(optionInitialValues.status);
  };

  /** 점유 만료시간 초기화 */
  const resetExpired = () => {
    expiredRef.current = undefined;
  };

  /** Clear Option (Select + Result) */
  const clearOption = () => {
    resetOptionValue();
    resetExpired();
    setSelectedResult([]);
    deleteGoodsOption(goodsId);
  };

  /** 최대 구매 수량 확인 */
  const checkPurchasableStock = (purchasableStock: number, id: number, stock: number): OptionPurchasableType => {
    let isExist = false;
    // 변경될 수량이 반영된 선택한 옵션 총 수량
    const totalStock =
      selectedResult.reduce((prev, option) => {
        if (option.id === id) {
          isExist = true;
          return prev + stock;
        }
        return prev + option.stock;
      }, 0) + (isExist ? 0 : stock);

    // 기본 최대수량(99) 이상일 경우
    if (stock > OptionDefaultMaxStock) {
      return OptionPurchasableType.DISABLE_DEFAULT_MAX_STOCK;
    }
    // 유저별 구매제한 수량 및 옵션별 구매제한 수량 확인
    if (userMaxPurchaseEa !== 0 && totalStock > userMaxPurchaseEa) {
      return OptionPurchasableType.DISABLE_USER_STOCK;
    }
    if (stock > purchasableStock) {
      return OptionPurchasableType.DISABLE_OPTION_STOCK;
    }
    return OptionPurchasableType.ABLE;
  };

  const handleShowToastMessage = (type: OptionPurchasableType, purchasableStock: number) => {
    let errorMessage = '';

    if (type === OptionPurchasableType.DISABLE_DEFAULT_MAX_STOCK) {
      if (optionType === OptionType.MULTI) {
        errorMessage = `해당 옵션은 한 번에 최대 ${OptionDefaultMaxStock}개까지 구매할 수 있습니다`;
      } else {
        errorMessage = `한 번에 최대 ${OptionDefaultMaxStock}개까지 구매할 수 있습니다`;
      }
    } else if (type === OptionPurchasableType.DISABLE_USER_STOCK) {
      errorMessage = `최대 ${userMaxPurchaseEa}개까지 구매할 수 있습니다`;
    } else {
      errorMessage = `해당 옵션은 최대 ${purchasableStock}개까지 구매할 수 있습니다`;
    }

    showToastMessage({
      message: errorMessage,
    });
  };

  /** 옵션 리스트에 선택한 옵션 추가 */
  const handleAddOption = (option: OptionInfoModel, infos: string[]) => {
    const { id, secondaryId, purchasableStock, price, discountRate } = option;
    const isSelected = selectedResult.some((prev) => prev.id === id);

    const stock = isSelected ? selectedResult.filter((prev) => prev.id === id)[0].stock + 1 : 1;
    const purchasableType = checkPurchasableStock(purchasableStock, id, stock);
    if (purchasableType !== OptionPurchasableType.ABLE) {
      handleShowToastMessage(purchasableType, purchasableStock);
      return;
    }

    // 이미 선택된 옵션에 대해서 맨 앞으로 위치 변경 & 수량 + 1
    if (isSelected) {
      const isSelectedIdx = selectedResult.findIndex((el) => el.id === id);
      const isSelectedOption = selectedResult.splice(isSelectedIdx, 1);

      selectedResult.splice(0, 0, { ...isSelectedOption[0], stock: isSelectedOption[0].stock + 1 });
      return;
    }

    setSelectedResult((prev) => [
      {
        id,
        secondaryId,
        selectedValues: infos,
        stock: 1,
        purchasableStock,
        price,
        discountRate,
      },
      ...prev,
    ]);
    setIsAdd(true);
  };

  /** 좌석 점유 해지 */
  const handleDeleteExpiredCb = (layoutIds: number[]) => {
    if (!expiredRef.current) {
      return;
    }

    handleDeleteExpired({ layoutIds });
    expiredRef.current = {
      ...expiredRef.current,
      layoutIds: expiredRef.current.layoutIds.filter((layout) => !layoutIds.includes(layout)),
    };
    updateGoodsOptions({ id: goodsId, options: selectedResult, expired: expiredRef.current });
  };

  const debouncedDeleteAction = debounce((index: number) => {
    setDeleteOptionIdx(index);

    setTimeout(() => {
      setDeleteOptionIdx(null);

      if (multiChoicePolicy === MultiChoicePolicyType.SINGLE_COMBINE) {
        setSelectedResult([]);
        resetExpired();
        return;
      }

      const restSelectedResult = selectedResult.filter((_, idx) => index !== idx);
      setSelectedResult(restSelectedResult);

      if (isEmpty(restSelectedResult)) {
        resetExpired();
        scrollRef.current?.scrollTo(0, 0);
      }
    }, OptionDeleteActionDuration + OptionDeleteSubActionDuration);
  }, 200);

  /** 옵션 리스트 중 선택한 옵션 삭제  */
  const handleDeleteOption = (index: number) => {
    if (deleteOptionIdx !== null) {
      return;
    }

    const { secondaryId } = selectedResult[index];

    handleLogTabDeleteOptionBlock();
    secondaryId && handleDeleteExpiredCb([secondaryId]);
    debouncedDeleteAction(index);
  };

  /** 옵션 수량 변경전 체크 사항 - stepper onBefore 연결 */
  const handleStockChangeBefore = (event: StepperEvent, option: OptionResultValuesProps) => {
    const { value, type } = event;
    if (type === 'error') {
      const { id, purchasableStock } = option;

      const purchasableType = checkPurchasableStock(purchasableStock, id, value + 1);
      handleShowToastMessage(purchasableType, purchasableStock);
    }
  };

  /** 옵션 리스트 중 선택한 옵션 수량 변경 */
  const handleStockChange = (stock: number, option: OptionResultValuesProps) => {
    const { id, purchasableStock } = option;

    const purchasableType =
      multiChoicePolicy === MultiChoicePolicyType.SINGLE_COMBINE
        ? selectedResult.reduce((prev, current) => {
            const type = checkPurchasableStock(current.purchasableStock, current.id, stock);
            if (type !== OptionPurchasableType.ABLE) {
              return type;
            }
            return prev;
          }, OptionPurchasableType.ABLE as OptionPurchasableType)
        : checkPurchasableStock(purchasableStock, id, stock);

    if (purchasableType !== OptionPurchasableType.ABLE) {
      handleShowToastMessage(purchasableType, purchasableStock);
      return;
    }

    setSelectedResult((prev) =>
      prev.map((result) => {
        if (multiChoicePolicy === MultiChoicePolicyType.SINGLE_COMBINE || result.id === id) {
          return { ...result, stock };
        }
        return { ...result };
      }),
    );
  };

  /** 선택한 수량에 따른 stepper max 값 설정 */
  const setMaxStock = (stock: number, purchasableStock: number) => {
    if (userMaxPurchaseEa === 0) {
      return Math.min(purchasableStock, OptionDefaultMaxStock);
    }
    // min(옵션별 구매가능 갯수, 유저당 구매가능 갯수 - (현재 선택한 옵션의 총합 - 해당 옵션 갯수), 기본값)
    return Math.min(purchasableStock, userMaxPurchaseEa - (selectedTotalStock - stock), OptionDefaultMaxStock);
  };

  /** 옵션 삭제시 confirm */
  const handleDeleteConfirm = async (index: number): Promise<boolean> => {
    if (
      multiChoicePolicy === MultiChoicePolicyType.NONE ||
      (!expiredRef.current && isEmpty(selectedResult)) ||
      (expiredRef.current && index === status.currentDepth && isEmpty(selectedResult))
    ) {
      return true;
    }

    const result = await confirm({
      title: OptionMessage.CONFIRM_TITLE,
      message: OptionMessage.CONFIRM_MESSAGE,
    });

    handleLogTabReselectConfirm(result);

    if (result) {
      expiredRef.current && handleDeleteExpiredCb(expiredRef.current.layoutIds);
      resetExpired();
      updateOptionValue(index);
      setStatus({
        prevValue: selectedInfo[index - 1]?.value ?? [],
        currentDepth: index,
      });
      selectedInfo.splice(index);
      setSelectedResult([]);
      return true;
    }

    return false;
  };

  /** 옵션 추가 선택 */
  const handleSelectMore = async (index: number) => {
    handleLogTabOption(index);

    const isSelectAble = await (multiChoicePolicy === MultiChoicePolicyType.SINGLE ||
    multiChoicePolicy === MultiChoicePolicyType.SINGLE_COMBINE
      ? handleDeleteConfirm(index)
      : handleCheckUserMaxStock());

    if (!isSelectAble) {
      return false;
    }

    return true;
  };

  /** 옵션 select 터치시 유저 최대 구매수량 체크 */
  const handleCheckUserMaxStock = (): boolean => {
    if (userMaxPurchaseEa !== 0 && userMaxPurchaseEa <= selectedTotalStock) {
      handleShowToastMessage(OptionPurchasableType.DISABLE_USER_STOCK, userMaxPurchaseEa);
      resetOptionValue();

      return false;
    }
    return true;
  };

  /** 다중 옵션 Handling */
  const handleSelect = (evt: React.ChangeEvent<HTMLSelectElement>, stepIndex: number) => {
    if (userMaxPurchaseEa !== 0 && userMaxPurchaseEa <= selectedTotalStock) {
      handleShowToastMessage(OptionPurchasableType.DISABLE_USER_STOCK, userMaxPurchaseEa);
      resetOptionValue();
      return;
    }
    const selectedValue = Number(evt.target.value);
    const initOptSelectedValues = optionInfos[stepIndex][selectedValue] as OptionItemModel;

    // selectedInfo
    const selectedNextInfo = selectedInfo.slice();
    selectedNextInfo[stepIndex] = {
      title: initOptSelectedValues.value,
      value: [initOptSelectedValues.value],
    };
    selectedNextInfo.splice(stepIndex + 1);
    setSelectedInfo([...selectedNextInfo]);

    if (stepIndex + 1 === total && initOptSelectedValues.options) {
      const selectedValues = selectedNextInfo.map((info) => info.title);
      initOptSelectedValues.options.forEach((option) => {
        setSelectedOption(option);
        handleAddOption(option, selectedValues);
      });
      resetOptionValue();
    } else {
      optionInfos[stepIndex + 1] = initOptSelectedValues.children;

      components.forEach((_, index) => {
        if (selectRefs.current && selectRefs.current[index]) {
          // 선택된 Depth 보다 하위의 옵션을 초기화
          if (stepIndex < index) {
            updateOptionValue(index);
          }
        }

        if (stepIndex + 1 < index) {
          // 선택된 Depth 보다 하위의 옵션들의 목록을 비워둠
          optionInfos[index] = [];
        }
      });

      setStatus({
        prevValue: selectedValue,
        currentDepth: stepIndex + 1,
      });
    }
  };

  /** receiveValues 로 option 처리 */
  const handleReceiveOption = () => {
    const { children, options, value, optionValues, metaData } = receiveValues as OptionReceiveValuesType;
    const intersectionItemList = options ?? children;

    const stepIndex = metaData?.stepIndex as number;
    const expired = metaData?.expired as ExpiredType;
    const seat = metaData?.seat as SeatType;

    if (expired && seat) {
      expiredRef.current = { ...expired, layoutIds: seat.layoutIds };
      updateGoodsOptions({ id: goodsId, options: selectedResult, expired: expiredRef.current });
    }

    const selectedNextInfo = selectedInfo.slice();
    selectedNextInfo[stepIndex] = {
      title: value,
      value: optionValues,
    };

    selectedNextInfo.splice(stepIndex + 1);
    setSelectedInfo([...selectedNextInfo]);

    if (intersectionItemList) {
      optionInfos[stepIndex + 1] = intersectionItemList;

      /** 마지막 옵션일 경우 */
      if (options) {
        const selectedTitles = selectedNextInfo.map((info) => info.title);
        intersectionItemList.reverse().forEach((option) => {
          const { selectedValues } = option;

          handleAddOption(option, selectedValues || selectedTitles);
        });
        resetOptionValue();

        return;
      }
    }

    components.forEach((_, index) => {
      if (stepIndex < index) {
        updateOptionValue(index);
      }
    });

    setStatus({
      prevValue: optionValues,
      currentDepth: stepIndex + 1,
    });
  };

  /** 점유 시간 만료 */
  const handleExpiredTime = async () => {
    const isModalOpen = getStatus(modalIdRef.current) === ModalStatus.OPENED;
    if (!expiredRef.current || isModalOpen || isOpenExpiredAlert.current) {
      return;
    }

    handleLogImpressionTimeoutConfirm();
    const { title, message } = expiredRef.current;
    // * 화면 잠금 후 해제 시 재노출 방지를 위해 alert 노출 여부 판단
    isOpenExpiredAlert.current = true;
    await alert({ title, message });

    isOpenExpiredAlert.current = false;
    clearOption();
  };

  /** 주문하기 */
  const handleOrder = () => {
    if (selectedResult.length > 0) {
      const params = selectedResult.map((option) => {
        return {
          optionId: option.id,
          quantity: option.stock,
          secondaryId: option.secondaryId,
        };
      });

      const logParams: OptionSelectedModel = {
        id: [],
        price: [],
        discountRate: [],
        quantity: [],
      };

      selectedResult.forEach((option) => {
        const { id, price, discountRate, stock } = option;

        logParams.id.push(id);
        logParams.price.push(price);
        logParams.discountRate.push(discountRate);
        logParams.quantity.push(stock);
      });

      const isSeatOption = components.some((component) => component.type === 'SEAT');

      handleActionSave({
        type: isSeatOption ? OptionSaveActionType.SEAT_ORDER : OptionSaveActionType.ORDER,
        params,
        logParams,
      });

      // CTA 클릭 시 해당 옵션 store 삭제
      deleteGoodsOption(goodsId);
    }
  };

  /** 장바구니 */
  const handleCart = () => {
    if (selectedResult.length > 0) {
      const params = selectedResult.map((option) => {
        return {
          optionId: option.id,
          quantity: option.stock,
        };
      });

      const logParams: OptionSelectedModel = {
        id: [],
        price: [],
        discountRate: [],
        quantity: [],
      };

      selectedResult.forEach((option) => {
        const { id, price, discountRate, stock } = option;

        logParams.id.push(id);
        logParams.price.push(price);
        logParams.discountRate.push(discountRate);
        logParams.quantity.push(stock);
      });

      handleActionSave({
        type: OptionSaveActionType.CART,
        params,
        logParams,
      });

      // CTA 클릭 시 해당 옵션 store 삭제
      deleteGoodsOption(goodsId);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) {
      return;
    }
    setScrolling(scrollRef.current.scrollTop > 0);
  };

  const handleTouchMove = useCallback((evt: React.TouchEvent) => {
    const windowHeight = window.innerHeight;
    const drawerHeight = contentRef.current?.offsetHeight ?? 0;
    const disabledTouchArea = windowHeight - drawerHeight;

    if (disabledTouchArea >= evt.changedTouches[0].clientY) {
      evt.cancelable && evt.preventDefault();
      disabledBodyScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnabledScroll = () => {
    const scrollWrapperEl = scrollRef.current;
    const scrollInnerEl = scrollInnerRef.current;
    if (scrollWrapperEl && scrollInnerEl) {
      const enabledScroll = scrollWrapperEl.offsetHeight <= scrollInnerEl.offsetHeight;
      enabledScroll && enabledBodyScroll();
    }
  };

  const handleDisabledScroll = () => {
    disabledBodyScroll();
  };

  // 초기 옵션창 활성화시, Select Value, Status Reset
  useEffect(() => {
    const scrollEl = scrollRef.current;

    if (isOpen) {
      if (optionType === OptionType.MULTI) {
        resetOptionValue();
        selectedOption !== null && setSelectedOption(null);
      }

      scrollEl && scrollEl.addEventListener('scroll', handleScroll);
      return;
    }

    scrollEl && scrollEl.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    /** 멀티옵션 + 진행상태라면 + 이미 선택된 Option State를 변경 */
    if (optionType === OptionType.MULTI && selectedOption !== null && selectedResult.length === 0) {
      setSelectedOption(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /** 선택한 옵션 값이 변경될 때 store에 저장 */
  useEffect(() => {
    setIsAdd(false);

    updateGoodsOptions({
      id: goodsId,
      options: selectedResult,
      ...(expiredRef.current && { expired: expiredRef.current }),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResult]);

  /** receiveValues 값으로 option 처리 */
  useEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }

    const { error } = receiveValues as OptionReceiveErrorValuesType;

    if (error) {
      clearOption();
      return;
    }

    handleReceiveOption();

    !isApp && emitClearReceiveValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  /** 초기 시작시 Option Value 초기화 */
  useEffect(() => {
    if (optionType === OptionType.MULTI) {
      optionInfos[0] = itemList.slice();
    }
    if (optionType === OptionType.SINGLE && !isEmpty(itemList[0].options) && itemList[0].options) {
      const { id, price: itemPrice, purchasableStock, discountRate: itemDiscountRate } = itemList[0].options[0];
      setSelectedResult([
        {
          id,
          stock: 1,
          purchasableStock,
          price: itemPrice,
          discountRate: itemDiscountRate,
          selectedValues: [goodsName],
        },
      ]);
    }

    // 저장된 옵션이 있다면 초기값으로 설정
    goodsOptions.forEach((prev) => {
      const { id, options, expired } = prev;

      if (id !== goodsId || isEmpty(options)) {
        return;
      }

      if (expired) {
        expiredRef.current = expired;
      }
      setSelectedResult(options);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    image: {
      src: imagePath,
      blurHash,
    },
    status,
    selectedResult,
    optionInfos,
    selectedInfo,
    isOptionSingleType: optionType === OptionType.SINGLE,
    scrolling,
    isAdd,
    deleteOptionIdx,
    expired: expiredRef.current,
    handleEnabledScroll,
    handleDisabledScroll,
    handleTouchMove,
    handleSelectMore,
    handleSelect,
    handleStockChangeBefore,
    handleStockChange,
    setMaxStock,
    handleDeleteConfirm,
    handleDeleteOption,
    handleOrder,
    handleCart,
    handleExpiredTime,
  };
};
