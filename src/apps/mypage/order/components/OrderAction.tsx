import { useRef, useState, useEffect, forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button, ButtonProps } from '@pui/button';
import classnames from 'classnames';

type OrderActionProps =
  | (Extract<ButtonProps, { is?: 'button' }> & { label?: React.ReactNode; disabledAnimation?: boolean })
  | (Extract<ButtonProps, { is: 'a' }> & { label?: React.ReactNode; disabledAnimation?: boolean });

const animationStep1 = keyframes`
  0% { transform: translate3d(0, -100%, 0); }
  100% { transform: translate3d(0, -200%, 0); }
`;

const animationStep2 = keyframes`
  0% { transform: translate3d(0, -200%, 0); }
  100% { transform: translate3d(0, -100%, 0); }
`;

export const OrderActionComponent = forwardRef<HTMLAnchorElement | HTMLButtonElement, OrderActionProps>(
  ({ label, description, disabledAnimation = false, className, children, ...props }, ref) => {
    const [isAnimation, setAnimationState] = useState<boolean>(false);
    const content = useRef<HTMLSpanElement>(null);

    const handleIntersect: IntersectionObserverCallback = ([entry], observer) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        setAnimationState(true);
      }
    };

    useEffect(() => {
      let observer: IntersectionObserver;

      if (description && !disabledAnimation) {
        observer = new IntersectionObserver(handleIntersect);
        content?.current && observer.observe(content.current);
      }

      return () => {
        observer?.disconnect();
        setAnimationState(false);
      };
    }, [description, disabledAnimation]);

    return (
      <Button ref={ref} className={classnames(className, { 'is-animation': description && isAnimation })} {...props}>
        <span ref={content} className="action-content">
          <span className="label">{label || children}</span>
          {description && (
            <>
              <span aria-hidden className="label">
                {label || children}
              </span>
              <span className="description">{description}</span>
            </>
          )}
        </span>
      </Button>
    );
  },
);

export const OrderAction = styled(OrderActionComponent)`
  .button-content-wrapper,
  .button-content-inner {
    position: initial;
  }

  .button-content {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
    overflow: hidden;
    width: 100%;
    height: 100%;
    transform: initial;
    mask-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 1) 0.8rem,
      rgba(0, 0, 0, 1) calc(100% - 0.8rem),
      rgba(0, 0, 0, 0) 100%
    );
  }

  .action-content {
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);

    & .label,
    & .description {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    & .description {
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }

  &.is-animation .action-content {
    animation: ${animationStep1} 0.8s 1s forwards, ${animationStep2} 0.8s 2.8s forwards;
  }
` as React.ForwardRefExoticComponent<OrderActionProps & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>> &
  string;
