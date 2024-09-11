import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { StepperEvent } from '@pui/stepper';
import { OptionResultValuesProps } from '../types';
import { MultiChoicePolicyType, OptionDefaultMaxStock, OptionFadeInDuration } from '../constants';
import { GoodsOptionBlockItem } from './GoodsOptionBlockItem';
import { OptionMetadataSchema } from '../schemas';

interface Props {
  /** 선택된 옵션 리스트 */
  selectedResult: OptionResultValuesProps[];
  /** 옵션 UI 제어 정책 */
  multiChoicePolicy: OptionMetadataSchema['multiChoicePolicy'];
  /** 삭제되는 옵션 index */
  deleteOptionIdx: number | null;
  /** 옵션 추가 */
  isAdd: boolean;
  /** 옵션 최대 수량 설정 */
  setMaxStock: (stock: number, purchasableStock: number) => number;
  /** 옵션 수량 변경 */
  onStockChange: (value: number, option: OptionResultValuesProps) => void;
  /** 옵션 수량 변경전 수행되는 함수 */
  onStockChangeBefore: (event: StepperEvent, option: OptionResultValuesProps) => void;
  /** 옵션 삭제 */
  onDeleteOption: (index: number) => void;
}

export const GoodsOptionBlock = ({
  selectedResult,
  multiChoicePolicy,
  deleteOptionIdx,
  isAdd,
  setMaxStock,
  onStockChange: handleStockChange,
  onStockChangeBefore: handleStockChangeBefore,
  onDeleteOption: handleDeleteOption,
}: Props) => {
  // Ref: option block
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sumPirce = selectedResult.reduce((prev, current) => prev + current.price, 0);
  const minPurchasableStock = selectedResult.reduce(
    (prev, current) => Math.min(prev, current.purchasableStock),
    OptionDefaultMaxStock,
  );

  /** 삭제되는 옵션 블락 높이 + 옵션별 마진값(12) */
  const deleteOptionBlockHeight =
    deleteOptionIdx !== null && optionRefs.current && optionRefs.current[deleteOptionIdx]
      ? (optionRefs.current[deleteOptionIdx] as HTMLDivElement).offsetHeight + 12
      : 0;

  const handleAddAnimation = (block: HTMLDivElement, newOption: boolean) => {
    block.classList.add(newOption ? 'new-option' : 'rest-option');
    setTimeout(() => {
      block.classList.remove(newOption ? 'new-option' : 'rest-option');
    }, OptionFadeInDuration);
  };

  useEffect(() => {
    if (!isAdd) {
      return;
    }

    optionRefs.current.forEach((option, index) => {
      option && handleAddAnimation(option, index === 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd]);

  return (
    <Wrapper>
      {selectedResult.map((result, index) => {
        if (multiChoicePolicy === MultiChoicePolicyType.SINGLE_COMBINE && index > 0) {
          return null;
        }

        const deleteAction = !!(deleteOptionIdx || deleteOptionIdx === 0) && index === deleteOptionIdx;
        const deleteSubAction = !!(deleteOptionIdx || deleteOptionIdx === 0) && index > deleteOptionIdx;
        const option = {
          ...result,
          ...(multiChoicePolicy === MultiChoicePolicyType.SINGLE_COMBINE && {
            price: sumPirce,
            purchasableStock: minPurchasableStock,
          }),
        };
        const key = [option.id, option.secondaryId].filter(Number).join('/');

        return (
          <GoodsOptionBlockItem
            key={key}
            ref={(ref) => {
              optionRefs.current[index] = ref;
            }}
            option={option}
            order={index}
            deleteAction={deleteAction}
            deleteSubAction={deleteSubAction}
            deleteOptionBlockHeight={deleteOptionBlockHeight}
            setMaxStock={setMaxStock}
            onStockChange={handleStockChange}
            onStockChangeBefore={handleStockChangeBefore}
            onDeleteOption={handleDeleteOption}
          />
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.li`
  padding: 1.2rem 0;
`;
