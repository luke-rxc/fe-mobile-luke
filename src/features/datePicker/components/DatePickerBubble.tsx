import React, { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Slot } from '@pui/slot';
import { SelectedInfoValuesType, SelectedPriceType } from '../types';
import { DAY_ITEM_SIZE, MONTH_ROW_HEIGHT, MONTH_ROW_PADDING } from '../constants';
import { priceConvertUnit } from '../utils';

interface Props {
  priceRefs: React.MutableRefObject<(HTMLParagraphElement | null)[]>;
  index: number;
  selectedList: SelectedInfoValuesType[];
  price: SelectedPriceType;
  priceDisplayIdx: number;
  onTransitionEnd: (event: React.TransitionEvent) => void;
}

export const DatePickerBubble = forwardRef<HTMLDivElement, Props>(
  ({ priceRefs, index, selectedList, price, priceDisplayIdx, onTransitionEnd: handleTransitionEnd }, ref) => {
    const { minPrice, maxPrice } = price;
    const [isExist, setIsExist] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(0);

    const { price: convertedPrice, unit } = priceConvertUnit(minPrice);
    const isAllPriceSame = minPrice === maxPrice;

    const { type, textPosition, isShow, size, left } = selectedList[index];
    const visible = isShow && index === priceDisplayIdx;

    useEffect(() => {
      setIsExist(isShow);
      /**
       * @issue IOS 17.4 버전에서 선택한 날짜 size 적용 버그
       * 날짜 첫 선택시 변경된 size 값으로 넘어가나 화면상에서 적용되지 않는 이슈가
       * IOS 17.4에서 발생해 size 값을 별도의 state 로 관리
       */
      setWidth(isShow ? size : 0);
    }, [isShow, size]);

    return (
      <Wrapper
        isShow={isShow}
        left={left}
        width={width}
        type={type}
        textPosition={textPosition}
        monthHeight={MONTH_ROW_HEIGHT}
        itemSize={DAY_ITEM_SIZE}
        monthRowPadding={MONTH_ROW_PADDING}
        onTransitionEnd={(evt) => handleTransitionEnd(evt)}
        ref={ref}
        className={classnames({
          'selected-row': isShow && isExist,
        })}
      >
        <div className={classnames('selected-bubble', { 'is-show': isShow })} />
        <p
          className={classnames('selected-price', {
            visible,
          })}
          ref={(priceRef) => {
            // eslint-disable-next-line no-param-reassign
            priceRefs.current[index] = priceRef;
          }}
        >
          {minPrice > 0 && (
            <>
              <Slot initialValue={0} value={convertedPrice} suffix={unit} />
              {!isAllPriceSame && '~'}
            </>
          )}
        </p>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div<{
  isShow: boolean;
  left: number;
  width: number;
  type: SelectedInfoValuesType['type'];
  textPosition: SelectedInfoValuesType['textPosition'];
  monthHeight: number;
  itemSize: number;
  monthRowPadding: number;
}>`
  visibility: hidden;
  ${({ theme, monthHeight }) => theme.absolute({ t: monthHeight * 10, l: 0 })};
  left: ${({ left }) => `${left}rem`};
  height: 6.4rem;
  will-change: left;

  &.selected-row {
    visibility: visible;
    transition: left 0.2s;
  }

  .selected-bubble {
    ${({ type }) => {
      switch (type) {
        case 'START':
          return `border-radius: 24px 8px 8px 24px;`;
        case 'CENTER':
          return `border-radius: 8px 8px 8px 8px;`;
        case 'END':
          return `border-radius: 8px 24px 24px 8px;`;
        default:
          return 'border-radius: 24px 24px 24px 24px;';
      }
    }};
    width: ${({ itemSize }) => `${itemSize}rem;`};
    height: 4.8rem;
    background: ${({ theme }) => theme.color.brand.tint};
    will-change: contents;

    &.is-show {
      width: ${({ width }) => `${width}rem;`};
      transition: all 0.2s;
    }
  }

  .selected-price {
    opacity: 0;
    width: ${({ isShow, width, itemSize }) => (isShow ? `${width}rem` : `${itemSize}rem`)};
    height: 1.2rem;
    font: ${({ theme }) => theme.fontType.microB};
    color: ${({ theme }) => theme.color.text.textPrimary};
    margin-top: ${({ theme }) => theme.spacing.s2};
    will-change: contents, opacity;
    ${({ textPosition, monthRowPadding }) => {
      switch (textPosition) {
        case 'LEFT':
          return 'text-align: left';
        case 'RIGHT':
          return 'text-align: right';
        case 'FIXED_CENTER':
          return `
            position: sticky;
            left: 0;
            text-align: center;
            width: ${window.screen.width / 10 - monthRowPadding * 2}rem !important;
            margin-left: -${monthRowPadding}rem;
            margin-right: -${monthRowPadding}rem;
            `;
        default:
          return 'text-align: center';
      }
    }};

    &.visible {
      opacity: 1;
      width: ${({ width }) => `${width}rem;`};
      transition: all 0.2s;
    }
  }
`;
