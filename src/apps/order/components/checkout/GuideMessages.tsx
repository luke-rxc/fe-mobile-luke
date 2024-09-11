import { Slide, SlideProps } from '@features/seat/components';
import { userAgent } from '@utils/ua';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  GUIDE_AOS_MESSAGES_DURATION,
  GUIDE_DEFAULT_MESSAGES_DURATION,
  GUIDE_DISTANCE,
  GUIDE_MESSAGE_DELAY,
} from '../../constants';

const { isAndroid, isApp } = userAgent();

export interface GuideMessagesProps extends SlideProps {
  messages: string[];
}

export const GuideMessages = React.forwardRef(({ messages }: GuideMessagesProps, ref) => {
  const duration = isApp && isAndroid ? GUIDE_AOS_MESSAGES_DURATION : GUIDE_DEFAULT_MESSAGES_DURATION;
  const initCount = 2 * (messages.length - 1);
  const [count, setCount] = useState(initCount);

  const handleSlideComplete = (index: number) => {
    index === 0 && setCount(initCount);
  };

  return (
    <Slide
      ref={ref}
      count={count}
      delay={GUIDE_MESSAGE_DELAY}
      duration={duration}
      distance={GUIDE_DISTANCE}
      onSlideComplete={handleSlideComplete}
    >
      {messages.map((message) => {
        return <Description key={message}>{message}</Description>;
      })}
    </Slide>
  );
});

const Description = styled.div`
  font: ${({ theme }) => theme.fontType.mini};
`;
