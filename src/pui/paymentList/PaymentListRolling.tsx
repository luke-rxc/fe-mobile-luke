import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { ChevronDown } from '@pui/icon';
import { Action } from '@pui/action';
import { PayIcon } from './PayIcon';
import type { PaymentItemType } from './PaymentListGroup';

export type PaymentListRollingProps = Omit<HTMLAttributes<HTMLButtonElement>, 'is'> & {
  /** pay 리스트 */
  list: PaymentItemType[];
  /** 롤링 노출 상태 */
  active?: boolean;
  /** animation duration */
  duration?: number;
};

const PaymentListRollingComponent = forwardRef<HTMLButtonElement, PaymentListRollingProps>(
  ({ className, list = [], active = false, duration = 800, ...props }, ref) => {
    const [inView, setInView] = useState(false);
    const rollListRef = useRef<HTMLDivElement>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const tickT = useRef<NodeJS.Timeout | null>(null);
    const intervalDuration = useRef<number>(1000);
    const startRollingT = useRef<NodeJS.Timeout | null>(null);
    const motionEndT = useRef<NodeJS.Timeout | null>(null);
    const [prevItemNum, setPrevItemNum] = useState<number | null>(list.length - 1);
    const [activeItemNum, setActiveItemNum] = useState<number>(0);
    const [nextItemNum, setNextItemNum] = useState<number | null>(activeItemNum + 1);
    const prevValue = useRef<number>(list.length - 1);
    const activeValue = useRef<number>(0);
    const nextValue = useRef<number>(activeItemNum + 1);
    const isCompleteMotion = useRef<boolean>(false);

    const subscribeCallback = useCallback((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      });
    }, []);

    const subscribe = useCallback(
      (element: HTMLElement, options?: IntersectionObserverInit) => {
        if (!observer.current) {
          observer.current = new IntersectionObserver(subscribeCallback, options);
          observer.current.observe(element);
        }
      },
      [subscribeCallback],
    );
    const unsubscribe = useCallback(() => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    }, []);

    const tick = useCallback(() => {
      if (tickT.current) {
        clearInterval(tickT.current);
      }

      const prevNum = prevValue.current;
      const currentNum = activeValue.current;
      const nextNum = nextValue.current;

      let targetPrevNum = prevNum + 1;
      if (targetPrevNum >= list.length) {
        targetPrevNum = 0;
      }

      let targetCurrentNum = currentNum + 1;
      if (targetCurrentNum >= list.length) {
        targetCurrentNum = 0;
      }

      let targetNextNum = nextNum + 1;
      if (targetNextNum >= list.length) {
        targetNextNum = 0;
      }

      setPrevItemNum(targetPrevNum);
      setActiveItemNum(targetCurrentNum);
      setNextItemNum(list.length > 2 ? targetNextNum : null);

      if (list.length <= 2) {
        motionEndT.current = setTimeout(() => {
          setPrevItemNum(null);
          setNextItemNum(targetPrevNum);
        }, duration);
      }

      prevValue.current = targetPrevNum;
      activeValue.current = targetCurrentNum;
      nextValue.current = targetNextNum;

      // 마지막 아이템까지 노출시 모션 stop
      if (targetCurrentNum === list.length - 1) {
        isCompleteMotion.current = true;
        handleStopRolling();
      } else {
        tickT.current = setInterval(tick, intervalDuration.current + duration);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStartRolling = useCallback(() => {
      startRollingT.current = setTimeout(() => {
        tick();
      }, 1000);
    }, [tick]);

    const handleStopRolling = useCallback(() => {
      if (startRollingT.current) {
        clearInterval(startRollingT.current);
      }
      if (tickT.current) {
        clearInterval(tickT.current);
      }
      if (motionEndT.current) {
        clearInterval(motionEndT.current);
      }
    }, []);

    useEffect(() => {
      if (!active) {
        isCompleteMotion.current = false;
        if (motionEndT.current) {
          clearInterval(motionEndT.current);
        }

        // 롤링 state 초기화
        const initPrev = list.length - 1;
        const initActive = 0;
        const initNext = initActive + 1;

        setPrevItemNum(list.length > 2 ? initPrev : null);
        setActiveItemNum(initActive);
        setNextItemNum(initNext);

        prevValue.current = initPrev;
        activeValue.current = initActive;
        nextValue.current = initNext;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    useEffect(() => {
      if (inView && isCompleteMotion.current === false) {
        handleStartRolling();
      } else {
        handleStopRolling();
      }
    }, [handleStartRolling, handleStopRolling, inView]);

    useEffect(() => {
      if (rollListRef.current) {
        subscribe(rollListRef.current, { threshold: 0.65 });
      }

      return () => {
        handleStopRolling();
        unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Action ref={ref} is="button" className={classNames(className, 'roll-wrapper')} {...props}>
        <div className="roll-inner">
          <div className="roll-list" ref={rollListRef}>
            <div className="roll-list-inner">
              {list.map((item, index) => {
                return (
                  <div
                    key={item.pgType}
                    className={classNames('item', {
                      prev: prevItemNum === index,
                      next: nextItemNum === index,
                      active: activeItemNum === index,
                    })}
                  >
                    <div className="pg">
                      <PayIcon pgType={item.pgType} active={false} />
                    </div>
                    <div className="title">{item.title}</div>
                    {item.label && <div className="lbl">{item.label}</div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="roll-suffix">
            <ChevronDown color="gray50" />
          </div>
        </div>
      </Action>
    );
  },
);

export const PaymentListRolling = styled(PaymentListRollingComponent)`
  width: 100%;
  height: 5.8rem;
  border: ${({ theme }) => `0.1rem solid ${theme.color.backgroundLayout.line}`};
  border-radius: ${({ theme }) => theme.radius.r8};
  background-color: ${({ theme }) => theme.color.background.surface};
  &:active {
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: transparent;
      transition: background 0.2s;
      content: '';
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }
  & .roll-inner {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 1.2rem;
    mask-image: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 1) 1.6rem,
      rgba(0, 0, 0, 1) calc(100% - 1.6rem),
      transparent 100%
    );

    & .roll-list {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      overflow: hidden;

      & .roll-list-inner {
        position: relative;
      }
      & .item {
        height: 5.6rem;
        display: flex;
        align-items: center;
        text-align: left;

        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transform: translate3d(0, -5.6rem, 0);
        transition: '';

        &.prev {
          transform: translate3d(0, 5.6rem, 0);
          transition: ${({ duration = 800 }) => `transform ${duration}ms cubic-bezier(0.65, 0, 0.35, 1)`};
        }
        &.active {
          transform: translate3d(0, 0, 0);
          transition: ${({ duration = 800 }) => `transform ${duration}ms cubic-bezier(0.65, 0, 0.35, 1)`};
        }
        &.next {
          transform: translate3d(0, -5.6rem, 0);
          transition: '';
        }

        & > .pg {
          width: 2.4rem;
          height: 2.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.2rem;
          flex-shrink: 0;
        }
        & > .title {
          font: ${({ theme }) => theme.fontType.medium};
          color: ${({ theme }) => theme.color.text.textTertiary};
          flex-grow: 1;
          word-break: break-all;
          ${({ theme }) => theme.mixin.ellipsis()};
        }
        & > .lbl {
          opacity: 1;
          flex-shrink: 0;
          margin-left: 1.2rem;
          font: ${({ theme }) => theme.fontType.mini};
          color: ${({ theme }) => theme.color.text.textTertiary};
          word-break: break-all;
          transition: opacity 0.2s;
        }
      }
    }
    & .roll-suffix {
      width: 2.4rem;
      height: 2.4rem;
      margin-left: 0.4rem;
      flex-shrink: 0;
    }
  }
`;
