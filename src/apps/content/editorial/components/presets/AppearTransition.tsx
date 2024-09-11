import { useCallback, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import type { AppearTransitionProps } from '../../models';

/**
 * element 등장모션 처리 컴포넌트
 */
export const AppearTransition: FC<AppearTransitionProps> = ({
  className,
  transition = true,
  transitionTime = 600,
  children,
}) => {
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [inView, setInView] = useState(false);

  const handleIntersectionObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.current && observer.current.disconnect();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerRef = useCallback((el) => {
    if (!el || containerElRef.current || !transition) return;

    observer.current = new IntersectionObserver(handleIntersectionObserver, {
      threshold: 0,
    });
    observer.current.observe(el);
    containerElRef.current = el;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const obs = observer.current;
    return () => {
      obs && obs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={classNames(className)}>
      <Transition in={inView} timeout={transitionTime}>
        {(state) => (
          <div
            style={{
              opacity: state === 'exited' && transition ? 0 : 1,
              transform:
                state === 'exited' && transition ? `translate3d(0rem, 5rem, 0rem)` : `translate3d(0rem, 0rem, 0rem)`,
              transition: `all ${transitionTime}ms cubic-bezier(0.42, 0, 0.58, 1)`,
            }}
          >
            {children}
          </div>
        )}
      </Transition>
    </div>
  );
};
