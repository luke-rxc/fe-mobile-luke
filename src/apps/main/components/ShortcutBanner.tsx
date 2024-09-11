import axios from 'axios';
import styled from 'styled-components';
import classnames from 'classnames';
import React, { useEffect, useState, useRef } from 'react';
import { ShortcutBannerItem, ShortcutBannerItemProps } from './ShortcutBannerItem';

export interface ShortcutBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  shortcuts: ShortcutBannerItemProps[];
  onClickShortcutLink?: (shortcut: ShortcutBannerItemProps) => void;
}

export const ShortcutBanner = styled(({ shortcuts, className, onClickShortcutLink, ...props }: ShortcutBannerProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const initRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [active, setActive] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [loaded, setLoaded] = useState<number>(0);
  const [lottieData, setLottieData] = useState<{ default: unknown }[]>([]);
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const onlyOne = shortcuts.length < 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const lottieURL = shortcuts.map((value) => {
      if (value.titleType === 'lottie' && value.titleImage) {
        return axios.get(value.titleImage.path).then((response) => {
          if (response) {
            return { default: response.data };
          }
          return { default: null };
        });
      }
      return { default: null };
    });

    Promise.all([...lottieURL]).then((response) => {
      setLottieData(response);
    });
  }, [shortcuts]);

  useEffect(() => {
    // 애니메이션 및 영상, 로띠 로드가 끝나고 동시 재생
    if (count === shortcuts.length && loaded === shortcuts.length && shortcuts.length === lottieData.length) {
      timerRef.current = setTimeout(() => {
        setIsPlay(true);
      }, 200);
    }
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, loaded, lottieData]);

  const handleObserver = ([entry]: IntersectionObserverEntry[]) => {
    if (initRef.current) {
      setIsPlay(entry.intersectionRatio >= 0.5);
    } else {
      initRef.current = true;
    }
  };

  useEffect(() => {
    let observer: IntersectionObserver;

    if (targetRef.current) {
      observer = new IntersectionObserver(handleObserver, {
        threshold: 0.5,
      });
      observer.observe(targetRef.current);
    }

    return () => {
      observer && observer.disconnect();
    };
  }, []);

  const handleAnimationEnd = () => {
    setCount((prev) => prev + 1);
  };

  const handleCountLoaded = () => {
    setLoaded((prev) => prev + 1);
  };

  const handleClickShortcutLink = (shortcut: ShortcutBannerItemProps) => () => {
    onClickShortcutLink?.(shortcut);
  };

  return (
    <div className={classnames(className, { active })} {...props}>
      {active &&
        shortcuts.map((value, index) => (
          <ShortcutBannerItem
            key={value.id}
            item={value}
            isPlay={isPlay}
            onlyOne={onlyOne}
            lottieData={lottieData[index]}
            onReady={handleAnimationEnd}
            onCountLoaded={handleCountLoaded}
            onClickLink={handleClickShortcutLink(value)}
          />
        ))}
      <div ref={targetRef} className="shortcut-observer" />
    </div>
  );
})`
  width: 100%;
  height: 0;
  padding: 0 2.4rem;
  ${({ theme }) => theme.mixin.centerItem()};
  ${({ theme }) => theme.mixin.relative()};

  &.active {
    height: 12rem;
    transition: height 0.7s cubic-bezier(0.39, 0.58, 0.57, 1);
  }

  ${ShortcutBannerItem} + ${ShortcutBannerItem} {
    margin-left: 1.2rem;
  }

  .shortcut-observer {
    width: 100%;
    height: 100%;
    ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
    opacity: 0;
    z-index: -1;
  }
`;
