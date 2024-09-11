import React, { forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { Slot } from '@pui/slot';
import { Stepper, StepperEvent } from '@pui/stepper';
import { Button } from '@pui/button';
import { Close } from '@pui/icon';
import { OptionResultValuesProps } from '../types';
import {
  OptionDeleteActionDuration,
  OptionDeleteSubActionDuration,
  OptionFadeInDuration,
  OptionSlideDownDuration,
} from '../constants';

interface Props {
  /** 옵션 정보 */
  option: OptionResultValuesProps;
  /** 옵션 블럭 순서(index) */
  order: number;
  /** 삭제되는 옵션 블럭 애니메이션 */
  deleteAction: boolean;
  /** 삭제되지 않는 옵션 블럭 애니메이션 */
  deleteSubAction: boolean;
  /** 삭제되는 옵션 블럭의 높이 */
  deleteOptionBlockHeight: number;
  /** 옵션 최대 수량 설졍 */
  setMaxStock: (stock: number, purchasableStock: number) => number;
  /** 옵션 수량 변경 */
  onStockChange: (value: number, option: OptionResultValuesProps) => void;
  /** 옵션 수량 변경전 수행되는 함수 */
  onStockChangeBefore: (event: StepperEvent, option: OptionResultValuesProps) => void;
  /** 옵션 삭제 */
  onDeleteOption: (index: number) => void;
}

const FadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-1.2rem); }
  100% { opacity: 1; transform: translateY(0); }
`;

const SlideDown = keyframes`
  0% { transform: translateY(-8.4rem); }
  100% { transform: translateY(0); }
`;

export const GoodsOptionBlockItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      option,
      order,
      deleteAction,
      deleteSubAction,
      deleteOptionBlockHeight,
      setMaxStock,
      onStockChange: handleStockChange,
      onStockChangeBefore: handleStockChangeBefore,
      onDeleteOption: handleDeleteOption,
    },
    ref,
  ) => {
    return (
      <Wrapper
        ref={ref}
        className={classnames({
          'delete-action': deleteAction,
          'delete-sub-action': deleteSubAction,
        })}
        deleteOptionBlockHeight={deleteOptionBlockHeight}
        fadeInDuration={OptionFadeInDuration}
        slideDownDuration={OptionSlideDownDuration}
        deleteActionDuration={OptionDeleteActionDuration}
        subDeleteActionDuration={OptionDeleteSubActionDuration}
      >
        <div className="option-content">
          <p className="option-info">
            {option.selectedValues.map((info, idx) => (
              <React.Fragment key={info}>
                {info}
                {idx !== option.selectedValues.length - 1 && <span className="separator" />}
              </React.Fragment>
            ))}
          </p>
          <p className="option-price">
            <Slot initialValue={0} value={option.price * option.stock} suffix="원" />
          </p>
        </div>
        <div className="option-control">
          <Stepper
            value={option.stock}
            max={setMaxStock(option.stock, option.purchasableStock)}
            onChange={(evt) => handleStockChange(evt.value, option)}
            onBefore={(evt) => handleStockChangeBefore(evt, option)}
          />
          <Button variant="tertiaryfill" onClick={() => handleDeleteOption(order)}>
            <Close size="20px" color="gray50" />
          </Button>
        </div>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div<{
  deleteOptionBlockHeight: number;
  fadeInDuration: number;
  slideDownDuration: number;
  deleteActionDuration: number;
  subDeleteActionDuration: number;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 7.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.s12};
  padding: 1.6rem;
  border-radius: ${({ theme }) => theme.radius.r8};
  background-color: ${({ theme }) => theme.color.background.bg};

  &.rest-option {
    animation-name: ${SlideDown};
    animation-duration: ${({ slideDownDuration }) => `${slideDownDuration}ms`};
    animation-fill-mode: forwards;
  }

  &.new-option {
    animation-name: ${FadeIn};
    animation-duration: ${({ fadeInDuration }) => `${fadeInDuration}ms`};
    animation-fill-mode: forwards;
  }

  &.delete-action {
    transform: translateX(-100%);
    opacity: 0;
    transition: ${({ deleteActionDuration }) => `all ${deleteActionDuration}ms`};
  }

  &.delete-sub-action {
    transform: ${({ deleteOptionBlockHeight }) => `translateY(-${deleteOptionBlockHeight / 10}rem)`};
    transition: ${({ subDeleteActionDuration }) => `transform ${subDeleteActionDuration}ms`};
    transition-delay: ${({ deleteActionDuration }) => `${deleteActionDuration}ms`};
  }

  .option-content {
    flex: 1 1 auto;
    margin-right: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.mini};

    .option-info {
      word-break: break-all;
      margin-bottom: ${({ theme }) => theme.spacing.s4};

      .separator {
        content: '';
        display: inline-block;
        height: 1rem;
        margin: 0 0.8rem;
        border-left: 0.1rem solid ${({ theme }) => theme.color.gray8};
      }
    }

    .option-price {
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  .option-control {
    ${({ theme }) => theme.centerItem()};

    ${Button} {
      width: 3.6rem;
      height: 3.6rem;
      border-radius: ${({ theme }) => theme.radius.r8};
      margin-left: ${({ theme }) => theme.spacing.s8};
    }
  }
`;
