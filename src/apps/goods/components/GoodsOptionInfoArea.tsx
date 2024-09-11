import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {
  OptionDrawerOpenDuration,
  GuideMessagesActiveDuration,
  GuideMessagesSlideDelay,
  GuideMessagesSlideDuration,
} from '../constants';
import { ExpiredInfoType } from '../types';
import { ExpiredCountDown } from './ExpiredCountDown';

interface Props {
  guideMessages?: string[];
  expired?: ExpiredInfoType;
  onExpired?: () => void;
}

export const GoodsOptionInfoArea = ({ guideMessages = [], expired, onExpired }: Props) => {
  if (isEmpty(guideMessages) && !expired) {
    return null;
  }

  if (expired) {
    return <ExpiredCountDown expired={expired} onExpired={onExpired} />;
  }

  /** Popup Element */
  const popupRef = useRef<HTMLDivElement>(null);
  /** List Element */
  const listRef = useRef<HTMLDivElement>(null);

  const slide = (execute: boolean) => {
    setTimeout(() => {
      if (!execute) {
        listRef.current?.classList.remove('slide');

        return;
      }

      listRef.current?.classList.add('slide');
    }, GuideMessagesSlideDelay);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform' || !guideMessages[1]) {
      return;
    }

    if (e.target === popupRef.current) {
      slide(true);

      return;
    }

    e.target === listRef.current && slide(false);
  };

  useEffect(() => {
    popupRef.current?.style.setProperty('--active-duration', `${GuideMessagesActiveDuration}ms`);
    popupRef.current?.style.setProperty('--slide-duration', `${GuideMessagesSlideDuration}ms`);

    setTimeout(() => {
      popupRef.current?.classList.add('active');
    }, OptionDrawerOpenDuration);
  }, []);

  return (
    <Wrapper ref={popupRef} onTransitionEnd={handleTransitionEnd}>
      <div ref={listRef} className="message-list">
        <p className="message-item">{guideMessages[0]}</p>
        {guideMessages[1] && <p className="message-item">{guideMessages[1]}</p>}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --guideMessage-height: 3.6rem;

  width: 100%;
  height: 3.6rem;
  overflow: hidden;
  font: ${({ theme }) => theme.fontType.mini};
  color: ${({ theme }) => theme.color.brand.tint};
  transform: translateY(var(--guideMessage-height));
  transition: transform var(--active-duration);

  &:before {
    position: absolute;
    top: 0;
    content: '';
    height: 0.8rem;
    background: ${({ theme }) =>
      `linear-gradient(180deg, ${theme.color.whiteVariant1} 0%, rgba(255, 255, 255, 0) 100%)`};
    width: 100%;
    z-index: 1;
  }

  &:after {
    position: absolute;
    bottom: 0;
    content: '';
    height: 0.8rem;
    background: ${({ theme }) =>
      `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.whiteVariant1} 100%)`};
    width: 100%;
    z-index: 1;
  }

  &.active {
    transform: translateY(0);
  }

  .message-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    transition: transform var(--slide-duration) ease-in-out;

    &.slide {
      transform: translateY(calc(var(--guideMessage-height) * -1));
    }
  }

  .message-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: var(--guideMessage-height);
  }
`;
