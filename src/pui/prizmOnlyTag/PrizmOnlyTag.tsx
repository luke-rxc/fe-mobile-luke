import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import styled, { keyframes } from 'styled-components';
import isUndefined from 'lodash/isUndefined';
import { ReactComponent as FrontPrizmTagSVG } from '@assets/img_prizmonlytag_set_front.svg';
import { ReactComponent as BackPrizmTagSVG } from '@assets/img_prizmonlytag_set_back.svg';
import { ReactComponent as SmallPrizmTagSVG } from '@assets/img_prizmonlytag_single.svg';
import { ReactComponent as FrontLiveTagSVG } from '@assets/img_liveonlytag_set_front.svg';
import { ReactComponent as BackLiveTagSVG } from '@assets/img_liveonlytag_set_back.svg';
import { ReactComponent as SmallLiveTagSVG } from '@assets/img_liveonlytag_single.svg';
import { Conditional } from '@pui/conditional';

/**
 * 애니메이션을 실행하기 위한 클래스명
 */
const animationClass = 'is-animation';

const smallSVGAnimation = keyframes`
  0%    { transform: translate3d(0, 0, 0) rotate(0deg);  }

  14.4% { transform: translate3d(0, 0, 0) rotate(-12deg);}

  28.8% { transform: translate3d(0, 0, 0) rotate(10deg); }

  43.2% { transform: translate3d(0, 0, 0) rotate(-8deg); }

  57.6% { transform: translate3d(0, 0, 0) rotate(6deg);  }

  72%   { transform: translate3d(0, 0, 0) rotate(-4deg); }

  86%   { transform: translate3d(0, 0, 0) rotate(2deg);  }

  100%  { transform: translate3d(0, 0, 0) rotate(0deg);  }
`;

const frontSVGAnimation = keyframes`
  0%    { transform: translate3d(0, 0, 0) rotate(0deg);  }

  14.4% { transform: translate3d(0, 0, 0) rotate(-12deg);}

  28.8% { transform: translate3d(0, 0, 0) rotate(10deg); }

  43.2% { transform: translate3d(0, 0, 0) rotate(-8deg); }

  57.6% { transform: translate3d(0, 0, 0) rotate(6deg);  }

  72%   { transform: translate3d(0, 0, 0) rotate(-4deg); }

  86%   { transform: translate3d(0, 0, 0) rotate(2deg);  }

  100%  { transform: translate3d(0, 0, 0) rotate(0deg);  }
`;

const backSVGAnimation = keyframes`
  0%    { transform: translate3d(0, 0, 0) rotate(0deg); }

  14.4% { transform: translate3d(0, 0, 0) rotate(-8deg);}

  28.8% { transform: translate3d(0, 0, 0) rotate(7deg); }

  43.2% { transform: translate3d(0, 0, 0) rotate(-6deg);}

  57.6% { transform: translate3d(0, 0, 0) rotate(4deg); }

  72%   { transform: translate3d(0, 0, 0) rotate(-2deg);}

  86%   { transform: translate3d(0, 0, 0) rotate(1deg); }

  100%  { transform: translate3d(0, 0, 0) rotate(0deg); }
`;

export type TagType = 'prizmOnly' | 'liveOnly' | 'none';

export interface PrizmOnlyTagRef extends HTMLSpanElement {
  /**
   * tag animation play
   * 애니메이션 재생중 호출시 해당 호출을 무시됩니다. (디자인 정책 반영)
   */
  play: () => void;
}

export interface PrizmOnlyTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 태그 사이즈
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 태그 타입
   * prizmOnly와 liveOnly 속성만 허용
   * @default prizmOnly
   */
  tagType?: Exclude<TagType, 'none'>;
  /**
   * 애니메이션을 실행하기 위한 IntersectionObserver의 타겟에 적용될 요소를 결정
   * @default undefined
   * @remarks
   * - 값을 입력하지 않은 경우 즉, `undefined`인 경우에 `PrizmOnlyTag` 컴포넌트 자기 자신이 기준이 됩니다.
   * - `React.RefObject<HTMLElement>` 타입으로 요소의 참조값을 전달하면 해당 요소를 트리거로 사용합니다.
   * - `false` 값을 전달하는 경우 트리거가 비활성화되어 IntersectionObserver에 의한 애니메이션이 실행되지 않습니다.
   */
  trigger?: React.RefObject<HTMLElement> | false;
  /**
   * IntersectionObserver Options
   * @default {threshold:1}
   */
  triggerOption?: IntersectionObserverInit;
  /**
   * IntersectionObserver를 다시 설정하기 위한 props
   */
  resetTrigger?: unknown;
}

export const PrizmOnlyTagComponent = forwardRef<PrizmOnlyTagRef, PrizmOnlyTagProps>(
  ({ size = 'medium', tagType = 'prizmOnly', trigger, triggerOption, resetTrigger, className, ...props }, ref) => {
    const tag = useRef<HTMLSpanElement>(null);
    /**
     * IntersectionObserver에 의해 애니메이션이 실행되었는지 여부
     * IntersectionObserver에 의해 실행되는 애니메이션은 1회만 실행
     */
    const isAppeared = useRef<boolean>(false);

    /**
     * 이전 resetTrigger값을 기억하기 위한 ref
     */
    const resetTriggerPrev = useRef<unknown>(undefined);

    /**
     * 애니메이션을 실행
     * 단, 현재 애니메이션이 실행중이면 애니메이션을 재실행하지 않고 return
     */
    const playAnimation = () => {
      if (tag.current?.classList.contains(animationClass)) {
        return;
      }

      window.requestAnimationFrame(() => {
        tag.current?.classList.add(animationClass);
      });
    };

    /**
     * 실행중인 애니메이션 중지
     */
    const stopAnimation = () => {
      tag.current?.classList.remove(animationClass);
    };

    /**
     * 애니메이션 종료 이벤트를 처리
     */
    const handleAnimationEnd = (e: React.AnimationEvent<HTMLSpanElement>) => {
      // 지정된 애니메이션이 아닌 경우, 아무 작업도 수행하지 않음
      if (e.animationName !== smallSVGAnimation.getName() && e.animationName !== frontSVGAnimation.getName()) {
        return;
      }

      stopAnimation();
    };

    /**
     * IntersectionObserver 콜백 함수(요소가 교차되는 경우, 애니메이션을 실행)
     */
    const handleIntersect: IntersectionObserverCallback = ([entry], observer) => {
      if (entry.isIntersecting) {
        isAppeared.current = true;
        observer.disconnect();
        playAnimation();
      }
    };

    useEffect(() => {
      let observer: IntersectionObserver;
      const element = isUndefined(trigger) ? tag.current : (trigger && trigger.current) || null;

      if (resetTrigger !== resetTriggerPrev.current) {
        resetTriggerPrev.current = resetTrigger;
        isAppeared.current = false;
        // trigger가 reset된 경우에는 현재 재생중인 애니메이션을 취소합니다.
        stopAnimation();
      }

      if (element && !isAppeared.current) {
        observer = new IntersectionObserver(handleIntersect, { threshold: 1, ...triggerOption });
        observer.observe(element);
      }

      return () => observer && observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, triggerOption, resetTrigger]);

    useImperativeHandle(ref, () => ({ ...(tag.current as HTMLSpanElement), play: playAnimation }));

    return (
      <span ref={tag} aria-label="prizm only" className={`${className} is-${size}`} {...props}>
        <span className="tag" onAnimationEnd={handleAnimationEnd}>
          {size === 'small' ? (
            <Conditional
              condition={tagType === 'prizmOnly'}
              trueExp={<SmallPrizmTagSVG className="tag-small" />}
              falseExp={<SmallLiveTagSVG className="tag-small" />}
            />
          ) : (
            <Conditional
              condition={tagType === 'prizmOnly'}
              trueExp={
                <>
                  <BackPrizmTagSVG className="tag-back" />
                  <FrontPrizmTagSVG className="tag-front" />
                </>
              }
              falseExp={
                <>
                  <BackLiveTagSVG className="tag-back" />
                  <FrontLiveTagSVG className="tag-front" />
                </>
              }
            />
          )}
        </span>
      </span>
    );
  },
);

export const PrizmOnlyTag = styled(PrizmOnlyTagComponent)`
  display: inline-block;

  .tag {
    display: block;
    position: relative;
    font-size: 0;
    line-height: 0;
  }

  .tag-small,
  .tag-back,
  .tag-front {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
    width: 100%;
    height: auto;
    transform: translate3d(0, 0, 0) rotate(0deg);
    transform-origin: inherit;
    filter: drop-shadow(0 0.1rem 0.1rem rgba(0, 0, 0, 0.25));
    animation-duration: 1.2s;
    animation-timing-function: ease-in-out;
  }

  &.is-small .tag {
    width: 1.2rem;
    height: 3.2rem;
    transform-origin: center 0.3rem;
  }

  &.is-medium .tag {
    width: 1.6rem;
    height: 7.2rem;
    transform-origin: center 0.4rem;
  }

  &.is-large .tag {
    width: 2.4rem;
    height: 10.8rem;
    transform-origin: center 0.6rem;
  }

  &.${animationClass} {
    .tag-small {
      animation-name: ${smallSVGAnimation};
    }

    .tag-back {
      animation-name: ${backSVGAnimation};
    }

    .tag-front {
      animation-name: ${frontSVGAnimation};
    }
  }
`;
