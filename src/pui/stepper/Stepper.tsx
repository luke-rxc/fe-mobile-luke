import React, { forwardRef, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { useUpdateEffect } from 'react-use';
import { useWebInterface } from '@hooks/useWebInterface';
import { StepperButton } from './StepperButton';

/** 숫자 감소 모션 */
const stepperDecreaseKeyframe = keyframes`
  from {
    transform: translate3d(0, -100%, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`;

/** 숫자 증가 모션 */
const stepperIncreaseKeyframe = keyframes`
  from {
    transform: translate3d(0, -100%, 0);
  }

  to {
    transform: translate3d(0, -200%, 0);
  }
`;

/** error 모션 */
const errorKeyframe = keyframes`
  0% {
    transform: translate3d(-3%, 0, 0);
  }

  12% {
    transform: translate3d(3%, 0, 0);
  }

  25% {
    transform: translate3d(-3%, 0, 0);
  }

  37% {
    transform: translate3d(3%, 0, 0);
  }

  50% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(0, 0, 0);
  }
`;

/** 이벤트 타입 */
type StepperEventType = 'error' | 'change';

/** 이벤트 액션 */
type StepperEventAction = 'increase' | 'decrease';

/** Stepper 이벤트 객체 */
export interface StepperEvent {
  type: StepperEventType;
  value: number;
  action?: StepperEventAction;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange' | 'onError'> {
  /** 현재값 */
  value?: number;
  /** 기본값 */
  defaultValue?: number;
  /**
   * 최솟값
   * @default 1
   */
  min?: number;
  /**
   * 최댓값
   * @default 99
   */
  max?: number;
  /**
   * 증감 단위
   * @default 1
   */
  step?: number;
  /** 접근성을 위한 stepper label (화면에 표시 X) */
  label?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 카운터 값을 변경할 수 없을 때 실행할 콜백함수 */
  onError?: (event: StepperEvent & { type: 'error' }, props: StepperProps) => void;
  /** 카운터 값이 변경시 실행할 콜백함수 */
  onChange?: (event: StepperEvent & { type: 'change' }, props: StepperProps) => void;
  /** 이벤트(==모션)가 실행되기전 실행할 콜백함수 */
  onBefore?: (event: StepperEvent, props: StepperProps) => void;
}

/**
 * num값이 min 이하일 경우에는 min값을 반환하고
 * max 이상일 경우에는 max값을 반환합니다. 그 외에는 입력된 num값을 그대로 반환합니다.
 */
const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

/**
 * num값이 min값보다 작거나 max값보다 큰값인지 확인합니다.
 */
const isOutOfRange = (num: number, min: number, max: number): boolean => {
  return num < min || num > max;
};

export const StepperComponent = forwardRef<HTMLSpanElement, StepperProps>((props, ref) => {
  const {
    value,
    defaultValue,
    step = 1,
    min = 1,
    max = 99,
    label,
    disabled,
    className,
    onChange,
    onError,
    onBefore,
  } = props;
  const { generateHapticFeedback } = useWebInterface();
  // 현재 stepper value
  const [curValue, setCurValue] = useState(value ?? defaultValue ?? min);
  // 증감 모션(animation)을 제어하기 위한 state
  const [animationState, setAnimationState] = useState<'stable' | 'error' | 'decrease' | 'increase'>('stable');

  /** 이벤트 액션 종류를 임시 저강하기 위한 ref */
  const action = useRef<StepperEventAction>();
  /** root요소에 적용될 className */
  const classNames = classnames(className, animationState, { disabled });

  /**
   * StepperButton을 클릭할때 실행 이벤트 핸들로
   * @param isIncrease 버튼을 타입을 구별하기 위한 파리미터
   */
  const handleClickStepperButton = (isIncrease: boolean) => () => {
    // 클릭 액션이 불가능한 케이스
    if (disabled || animationState !== 'stable') {
      return;
    }

    action.current = isIncrease ? 'increase' : 'decrease';

    // 값을 변경할 수 없는 케이스
    if (isIncrease ? curValue >= max : curValue <= min) {
      setAnimationState('error');
      onBefore?.({ value: curValue, type: 'error', action: action.current }, props);
      generateHapticFeedback({ type: 'error' });
    } else {
      // 정상적으로 값을 변경할 수 있는 케이스
      setAnimationState(action.current);
      onBefore?.({ value: curValue, type: 'change', action: action.current }, props);
      generateHapticFeedback({ type: 'tapLight' });
    }
  };

  /**
   * UI의 증감 모션이 끝나면 실행될 함수
   */
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLSpanElement>) => {
    const isStepperAnimation =
      e.animationName === stepperDecreaseKeyframe.getName() ||
      e.animationName === stepperIncreaseKeyframe.getName() ||
      e.animationName === errorKeyframe.getName();

    if (animationState === 'stable' || !isStepperAnimation) {
      return;
    }

    if (animationState === 'increase' || animationState === 'decrease') {
      const newValue = calculateValue(animationState === 'increase');

      setCurValue(newValue);
      onChange?.({ value: newValue, type: 'change', action: action.current }, props);
    }

    if (animationState === 'error') {
      onError?.({ value: curValue, type: 'error', action: action.current }, props);
    }

    setAnimationState('stable');
    action.current = undefined;
  };

  /**
   * isIncreasing 값을 받아 증감된 값을 반환하는 함수
   */
  const calculateValue = (isIncreasing: boolean): number => {
    const direction = step * (isIncreasing ? 1 : -1);
    const newValue = clamp(curValue + direction, min, max);
    return newValue;
  };

  /**
   * value가 변경될 때마다 호출되는 useEffect
   * props.value가 number에서 undefined로 변경된 경우 현재값(curValue)을 유지합니다.
   */
  useUpdateEffect(() => {
    /**
     * 실제 데이터와 DOM은 변경되었지만 화면에서 값이 변경되지 않는 ios safari 버그가 있어
     * 이를 해결하기 위한 방법으로 setTimeout을 적용
     */
    setTimeout(() => setCurValue(value ?? curValue), 0);
  }, [value]);

  return (
    <span ref={ref} className={classNames} onAnimationEnd={handleAnimationEnd}>
      <StepperButton
        type="decrease"
        step={step}
        disabled={disabled || curValue <= min}
        clickable={animationState === 'stable'}
        onAction={handleClickStepperButton(false)}
      />

      <StepperButton
        type="increase"
        step={step}
        disabled={disabled}
        clickable={animationState === 'stable'}
        onAction={handleClickStepperButton(true)}
      />

      <span
        className="stepper"
        role="spinbutton"
        tabIndex={-1}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={curValue}
      >
        <span className="stepper-inner" aria-hidden>
          <span className="stepper-number">{calculateValue(false)}</span>
          <span className={classnames('stepper-number', { disabled: isOutOfRange(curValue, min, max) })}>
            {curValue}
          </span>
          <span className="stepper-number">{calculateValue(true)}</span>
        </span>
      </span>
    </span>
  );
});

/**
 * Stepper 컴포넌트
 */
export const Stepper = styled(StepperComponent)`
  --stepper-z-top: 2;
  --stepper-z-middle: 1;
  --stepper-z-bottom: 0;
  --stepper-duration: 0.4s;
  --stepper-color-bg-default: ${({ theme }) => theme.color.gray3};
  /** color overlay 이슈로 pressedCell이 아닌 gray8Filled을 그래로 유지 */
  --stepper-color-bg-pressed: ${({ theme }) => theme.color.gray8Filled};
  --stepper-color-bg-disabled: ${({ theme }) => theme.color.states.disabledBg};

  display: inline-block;
  position: relative;
  width: 8rem;
  height: 3.6rem;
  border-radius: ${({ theme }) => theme.radius.r8};
  background: var(--stepper-color-bg-default);
  user-select: none;

  .stepper {
    display: block;
    overflow: hidden;
    position: relative;
    height: 3.6rem;
    mask-image: linear-gradient(
      0deg,
      transparent 0,
      rgba(0, 0, 0, 1) 1.2rem,
      rgba(0, 0, 0, 1) calc(100% - 1.2rem),
      transparent 100%
    );

    &-inner {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      transform: translate3d(0, -100%, 0);
    }

    &-number {
      ${({ theme }) => theme.mixin.centerItem()};
      flex-shrink: 0;
      width: 100%;
      height: 3.6rem;
      color: ${({ theme }) => theme.color.black};
      font: ${({ theme }) => theme.fontType.mediumB};

      &.disabled {
        color: ${({ theme }) => theme.color.gray20};
      }
    }
  }

  /** 비활성화 */
  &.disabled {
    background: var(--stepper-color-bg-disabled);

    .stepper-number {
      color: ${({ theme }) => theme.color.gray20};
    }
  }

  &.error {
    background: var(--stepper-color-bg-pressed);
    animation: ${errorKeyframe} var(--stepper-duration);
  }

  /** 감소 */
  &.decrease {
    background: var(--stepper-color-bg-pressed);

    .stepper-inner {
      animation: ${stepperDecreaseKeyframe} var(--stepper-duration) forwards;
    }
  }

  /** 증가 */
  &.increase {
    background: var(--stepper-color-bg-pressed);

    .stepper-inner {
      animation: ${stepperIncreaseKeyframe} var(--stepper-duration) forwards;
    }
  }
`;
