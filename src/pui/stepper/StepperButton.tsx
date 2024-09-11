import React, { forwardRef, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { Action } from '@pui/action';
import { Icon, Plus, Minus } from '@pui/icon';

/**
 * +/- 아이콘에 적용할 애니메이션 키프레임
 */
const iconKeyframes = keyframes`
  0% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.3); 
  }
  100% { 
    transform: scale(1); 
  }
`;

/**
 * 아이콘 배경에 적용할 애니메이션 키프레임
 */
const bgKeyframes = keyframes`
  0% {
    transform: translate3d(-50%, -50%, 0) scale(1);
    background: var(--stepper-color-bg-pressed);
  }
  50% {
    transform: translate3d(-50%, -50%, 0) scale(1.1);
    background: var(--stepper-color-bg-pressed);
  }
  100% {
    transform: translate3d(-50%, -50%, 0) scale(1);
    background: var(--stepper-color-bg-pressed);
  }
`;

export interface StepperButtonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'type'> {
  /** 버튼 타입(증가/감소) */
  type: 'decrease' | 'increase';
  /** 증감단위값 (접근성을 위한 데이터) */
  step: number;
  /**
   * 버튼 비활성화 여부 (디자인적인 버튼의 비활성화)
   */
  disabled?: boolean;
  /**
   * 버튼 클릭가능 여부 (기능적인 버튼의 비활성화)
   */
  clickable?: boolean;
  /** 클릭이벤트에 호출된 콜백함수 */
  onAction: (e: React.TouchEvent<HTMLButtonElement>) => void;
}

const StepperButtonComponent = forwardRef<HTMLSpanElement, StepperButtonProps>((props, ref) => {
  const { type, step, disabled, clickable = true, className, onAction, ...rest } = props;

  const time = useRef<number | null>(null);

  // 증가버튼여부
  const isIncrease = type === 'increase';
  // 버튼 누름 여부(pressed 상태에서 애니메이션을 play)
  const [pressed, setPressed] = useState<boolean>(false);
  // root 요소에 적용될 className
  const classNames = classnames(className, type, { pressed, disabled });
  // 버튼 label
  const label = `${step || ''}${isIncrease ? '증가' : '감소'}`;

  /**
   * stepper의 애니메이션 실행과 props.onAction이 호출
   */
  const action = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!pressed && !disabled && clickable) {
      onAction?.(e);
      setPressed(true);
    }
    cancelAction();
  };

  /**
   * action 함수의 호출을 취소
   */
  const cancelAction = () => {
    if (time.current) {
      window.clearTimeout(time.current);
      time.current = null;
    }
  };

  /**
   * +/- 버튼 터치 이벤트 핸들러
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    time.current = window.setTimeout(action, 50, e);
  };

  /**
   * 애니메이션이 종료시 실행할 이벤트핸들러
   * 애니메이션( == 클릭) 가능상태로 변경
   */
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
    if (e.animationName === iconKeyframes.getName()) {
      setPressed(false);
    }
  };

  return (
    <span ref={ref} className={classNames} onAnimationEnd={handleAnimationEnd} {...rest}>
      <Action
        className="button"
        disabled={disabled}
        aria-label={label}
        onTouchStart={handleTouchStart}
        onTouchCancel={cancelAction}
        onTouchMove={cancelAction}
      />
      <span className="visual" aria-hidden children={isIncrease ? <Plus /> : <Minus />} />
    </span>
  );
});

/**
 * StepperButton 컴포넌트
 */
export const StepperButton = styled(StepperButtonComponent)`
  .button {
    ${({ theme }) => theme.mixin.absolute({ t: '50%' })};
    z-index: var(--stepper-z-top);
    width: 4.8rem;
    height: 4.8rem;
  }

  .visual {
    ${({ theme }) => theme.mixin.absolute({ t: '50%' })};
    ${({ theme }) => theme.mixin.centerItem()};
    z-index: var(--stepper-z-bottom);
    width: 4.8rem;
    height: 4.8rem;

    &:before {
      ${({ theme }) => theme.mixin.center('scale(1)')};
      width: 4.4rem;
      height: 4.4rem;
      border-radius: 50%;
      transition: transform var(--stepper-duration);
      content: '';
    }

    ${Icon} {
      position: relative;
      width: 1.6rem;
      height: 1.6rem;
      transform: scale(1);
      color: ${({ theme }) => theme.color.brand.tint};
    }
  }

  // 감소
  &.decrease {
    .button,
    .visual {
      left: 50%;
      transform: translate3d(-100%, -50%, 0);
    }
  }

  // 증가
  &.increase {
    .button,
    .visual {
      right: 50%;
      transform: translate3d(100%, -50%, 0);
    }
  }

  // 비활성화
  &.disabled .visual {
    & ${Icon} {
      color: ${({ theme }) => theme.color.gray20};
    }
  }

  // 클릭시
  &.pressed .visual {
    &:before {
      animation: ${bgKeyframes} var(--stepper-duration) forwards;
    }

    & ${Icon} {
      animation: ${iconKeyframes} var(--stepper-duration) forwards;
    }
  }
`;
