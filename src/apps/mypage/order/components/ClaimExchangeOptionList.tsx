import { Select, Option } from '@pui/select';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { OptionType } from '../constants';
import { OptionInfoSchema, OptionItemSchema } from '../schemas';
import { OptionInitialValueProps, OptionSelectedInfoProps, OptionStatusProps } from '../types';

interface SelectOptionHandlerParams {
  isTargetOption: boolean;
  selectedData: OptionInfoSchema;
}

interface ResetOptionHandlerParams {
  isTargetOption: boolean;
  itemOptionId: number;
}

interface OptionListProps {
  /** 아이템 옵션 아이디 */
  itemOptionId: number;
  /** 옵션 타이틀 데이터 */
  titleList: string[];
  /** 옵션 구성 데이터 */
  itemList: OptionItemSchema[];
  /** 상품 가격 */
  goodsPrice: number;
  /** 기준 상품 옵션 여부 */
  isTargetOption?: boolean;
  /** 옵션 정보 저장 */
  onSelectOption: (param: SelectOptionHandlerParams) => void;
  /** 옵션 저장 정보 초기화 */
  onResetOption: (param: ResetOptionHandlerParams) => void;
}

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

/** 교환 옵션 컴포넌트 */
export const ClaimExchangeOptionList = ({
  itemOptionId,
  titleList,
  itemList,
  goodsPrice,
  isTargetOption = false,
  onSelectOption: handleSelectOption,
  onResetOption: handleResetOption,
}: OptionListProps) => {
  const { isApp } = useDeviceDetect();
  // 옵션 목록
  const [optionInfo, setOptionInfo] = useState<Array<Array<OptionItemSchema>>>(new Array(3).fill([]));
  const total = titleList.length;
  const optionType = total > 0 ? OptionType.MULTI : OptionType.SINGLE;
  // Ref : Select-box (Option, 다중 옵션인 경우 주입)
  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
  // 멀티 옵션인 경우, 현재 Select Step, 그전에 선택된 Value
  const [status, setStatus] = useState<OptionStatusProps>(optionInitialValues.status);
  // Step Text
  const [selectedInfo, setSelectedInfo] = useState<OptionSelectedInfoProps[]>(optionInitialValues.selectedInfo);

  /** 옵션 Select 업데이트 */
  const updateOptionValue = (index: number, value = '') => {
    if (selectRefs.current && selectRefs.current[index]) {
      // eslint-disable-next-line no-param-reassign
      (selectRefs.current[index] as HTMLSelectElement).value = value;
      (selectRefs.current[index] as HTMLSelectElement).blur();
    }
  };

  /** 다중 옵션 Handling */
  const handleSelect = (evt: React.ChangeEvent<HTMLSelectElement>, stepIndex: number) => {
    const selectedValue = Number(evt.target.value);
    const initOptSelectedValues = optionInfo[stepIndex][selectedValue] as OptionItemSchema;
    const selectedNextInfo = selectedInfo.slice();
    selectedNextInfo[stepIndex] = {
      title: initOptSelectedValues.value,
      value: [initOptSelectedValues.value],
    };
    selectedNextInfo.splice(stepIndex + 1);
    setSelectedInfo([...selectedNextInfo]);

    if (stepIndex + 1 === total && initOptSelectedValues.optionData) {
      handleSelectOption({
        isTargetOption,
        selectedData: { ...initOptSelectedValues.optionData, itemOptionId },
      });
    } else {
      if (!initOptSelectedValues.children) return;
      optionInfo[stepIndex + 1] = initOptSelectedValues.children;

      titleList.forEach((_, index) => {
        if (selectRefs.current && selectRefs.current[index]) {
          // 선택된 Depth 보다 하위의 옵션을 초기화
          if (stepIndex < index) {
            updateOptionValue(index);
          }
        }

        if (stepIndex + 1 < index) {
          // 선택된 Depth 보다 하위의 옵션들의 목록을 비워둠
          optionInfo[index] = [];
        }
        // 옵션 저장 정보 초기화
        handleResetOption({ isTargetOption, itemOptionId });
      });

      setStatus({
        prevValue: selectedValue,
        currentDepth: stepIndex + 1,
      });
    }
  };

  useEffect(() => {
    if (optionType === OptionType.MULTI) {
      setOptionInfo(() => {
        optionInfo[0] = itemList.slice();
        return [...optionInfo];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GoodsOptionWrapper>
      {titleList.map((title, index) => {
        return (
          <Select
            key={title}
            placeholder={`${title} 교환`}
            placeholderStyleProps={{ disabled: !!isApp }}
            onChange={(event) => handleSelect(event, index)}
            disabled={index > status.currentDepth}
            defaultValue=""
            size="large"
            ref={(ref) => {
              selectRefs.current[index] = ref;
            }}
          >
            {optionInfo[index].map((item: OptionItemSchema, itemIndex: number) => {
              const { value, isRunOut, optionData } = item;
              const { price } = optionData ?? {};
              const isDiffPrice = price !== undefined && price !== goodsPrice;
              const isDiffPriceSuffix = isDiffPrice && ' (가격상이)';
              const isRunOutSuffix = isRunOut && ' (품절)';
              const suffix = isRunOut ? isRunOutSuffix : isDiffPriceSuffix;
              return (
                <Option key={value} value={itemIndex} disabled={isRunOut || isDiffPrice}>
                  {value}
                  {suffix ?? ''}
                </Option>
              );
            })}
          </Select>
        );
      })}
    </GoodsOptionWrapper>
  );
};

const GoodsOptionWrapper = styled.div`
  padding: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s24} ${theme.spacing.s24}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `${theme.spacing.s12}`};
`;
