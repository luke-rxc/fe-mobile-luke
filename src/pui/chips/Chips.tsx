/* eslint-disable react/no-array-index-key */
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { v4 as uuid } from 'uuid';
import { Chip, ChipProps } from '@pui/chip';
import { useWebInterface } from '@hooks/useWebInterface';
import type { ConfirmParams } from '@utils/webInterface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChipDataType = Record<string, any> | number | string;

export interface ChipsProps<T extends ChipDataType = ChipDataType> extends React.HTMLAttributes<HTMLDivElement> {
  /** chip을 생성하기 위한 데이터 */
  data: T[];
  /** map key를 생성(getKey는 옵셔널이지만 항상 사용하길 권장합니다) */
  getKey?: (data: T, index: number) => string;
  /** link props를 생성 */
  getLink?: (data: T, index: number) => string | undefined;
  /** label props를 생성 */
  getLabel?: (data: T, index: number) => string;
  /** Chip 클릭 이벤트 콜백 */
  onClickChip?: (data: T, index: number) => void;
  /** Chip 삭제 이벤트 콜백 */
  onDeleteChip?: (data: T, index: number, last: boolean) => void;
  /** Chip 삭제 Confirm 설정 */
  deleteConfirm?: Partial<ConfirmParams> & { enabled: boolean };

  /**
   * chip에 전달할 props를 생성
   * 단, onDeleteChip 대신 getChipProps를 통해 onDelete props를
   * chip에 전달하게 되면 delete 모션이 적용되지 않는다.
   */
  getChipProps?: (data: T, index: number) => Partial<ChipProps>;
}

const ChipsComponent = forwardRef<HTMLDivElement, ChipsProps<ChipDataType>>(
  ({ data, getKey, getLink, getLabel, getChipProps, onClickChip, onDeleteChip, deleteConfirm, ...props }, ref) => {
    const { confirm } = useWebInterface();
    const container = useRef<HTMLDivElement>(null);
    const chips: (HTMLSpanElement | null)[] = [];

    const addElements = (chip: HTMLSpanElement | null) => {
      chips.push(chip);
    };

    /**
     * chip 삭제 모션 방향
     */
    const getDeleteDirection = () => {
      if (container.current) {
        const { scrollWidth, scrollLeft, offsetWidth } = container.current;

        if (scrollLeft && scrollLeft >= scrollWidth - offsetWidth * 1.5) {
          return 'left';
        }
      }

      return 'right';
    };

    /**
     * chip 삭제 모션 style
     */
    const getDeleteAnimationStyle = (chip: HTMLSpanElement) => {
      const direction = getDeleteDirection();
      const transition = `transition: opacity 200ms, margin-${direction} 300ms 100ms`;

      return {
        start: `${transition}; opacity: 1; margin-${direction}: 0;`,
        end: `${transition}; opacity: 0; margin-${direction}: -${chip.offsetWidth}px`,
      };
    };

    /**
     * data를 참조하여 chip에 전달할 key값 생성
     */
    const getChipKey = (item: ChipDataType, index: number): string => {
      if (getKey) {
        return getKey(item, index);
      }

      return uuid().slice(0, 8);
    };

    /**
     * data를 참조하여 chip에 표시할 label을 생성
     */
    const getChipLabel = (item: ChipDataType, index: number): string => {
      if (getLabel) {
        return getLabel(item, index);
      }

      return isObject(item) ? `${get(item, 'label', '')}` : `${item}`;
    };

    /**
     * chip 클릭 이벤트 핸들러
     */
    const handleClickChip = (item: ChipDataType, index: number) => () => {
      onClickChip?.(item, index);
    };

    /**
     * chip 삭제버튼 클릭 이벤트 핸들러 (delete 모션을 실행)
     */
    const handleDeleteChip = (index: number) => async () => {
      const defaultConfirm = { title: '삭제할까요?', message: '' };
      const { enabled = false, ...params } = deleteConfirm || {};

      if (enabled && !(await confirm({ ...defaultConfirm, ...params }))) {
        return;
      }

      const chip = chips[index];

      if (chip) {
        const style = getDeleteAnimationStyle(chip);

        requestAnimationFrame(() => {
          chip.setAttribute('style', style.start);
          requestAnimationFrame(() => {
            chip.setAttribute('style', style.end);
          });
        });
      }
    };

    /**
     * delete 모션이 끝나면 onDeleteChip 콜백을 호출
     */
    const handleTransitionEnd = (item: ChipDataType, index: number) => (e: React.TransitionEvent<HTMLSpanElement>) => {
      const chip = chips[index];

      // delete 모션에 의한 transition 이벤트가 아닌 경우 종료
      if (e.target !== chip || !['margin-left', 'margin-right'].includes(e.propertyName)) {
        return;
      }

      chip.setAttribute('style', 'display:none');
      onDeleteChip?.(item, index, !chips.filter((el) => el?.style.display !== 'none').length);
    };

    /**
     * props ref 세팅
     */
    useImperativeHandle(ref, () => container.current as HTMLDivElement);

    return (
      <div ref={container} {...props}>
        {data.map((item, index) => (
          <Chip
            ref={addElements}
            key={getChipKey(item, index)}
            link={getLink?.(item, index)}
            label={getChipLabel(item, index)}
            onClick={onClickChip && handleClickChip(item, index)}
            onDelete={onDeleteChip && handleDeleteChip(index)}
            onTransitionEnd={onDeleteChip && handleTransitionEnd(item, index)}
            {...getChipProps?.(item, index)}
          />
        ))}
      </div>
    );
  },
);

/**
 * Figma의 Chips 컴포넌트
 */
export const Chips = styled(ChipsComponent)`
  overflow: hidden;
  overflow-x: auto;
  box-sizing: border-box;
  height: 4rem;
  padding: 0 2rem;
  white-space: nowrap;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  ${Chip} {
    overflow: hidden;
    height: inherit;

    .chip-inner {
      margin: 0 0.4rem;
    }
  }
` as (<T extends ChipDataType = ChipDataType>(
  props: ChipsProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<React.ForwardRefExoticComponent<ChipsProps<T> & React.RefAttributes<HTMLDivElement>>>) &
  string;
