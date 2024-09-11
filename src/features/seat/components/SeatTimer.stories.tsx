import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { SeatTimer } from './SeatTimer';
import { SlideHandle } from '../types';

export default {
  title: `${StoriesMenu.Features}/Seat/SeatTimer`,
  component: SeatTimer,
  parameters: {
    design: [],
  },
} as ComponentMeta<typeof SeatTimer>;

const Template: ComponentStory<typeof SeatTimer> = ({ ...args }) => {
  const ms = Date.now() + 60 * 7 * 1000;
  const elRef = useRef<SlideHandle | null>(null);

  useEffect(() => {
    elRef.current?.play();
  }, []);

  return <SeatTimer {...args} ref={elRef} expiredDate={ms} />;
};

export const 기본 = Template.bind({});
기본.args = {};

const TemplateButtonWithTimer: ComponentStory<typeof SeatTimer> = () => {
  const ms = Date.now() + 60 * 7 * 1000;
  const timerElRef = useRef<SlideHandle | null>(null);
  const popupElRef = useRef<HTMLDivElement | null>(null);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== popupElRef.current) {
      return;
    }

    timerElRef.current?.play();
  };

  useEffect(() => {
    setTimeout(() => {
      if (popupElRef.current) {
        popupElRef.current.classList.add('active');
      }
    }, 200);
  }, []);

  return (
    <SeatTimerButtonContainer>
      <PopupEffect ref={popupElRef} onTransitionEnd={handleTransitionEnd}>
        <SeatTimer ref={timerElRef} expiredDate={ms} />
      </PopupEffect>
      <Button variant="primary" size="large" block>
        구매
      </Button>
    </SeatTimerButtonContainer>
  );
};

const SeatTimerButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  flex-direction: column;
  padding-top: 3.6rem;

  ${Button} {
    z-index: 1;
  }
`;

const PopupEffect = styled.div`
  position: absolute;
  top: 3.6rem;
  left: 0;
  right: 0;
  bottom: 0;

  &.active {
    transform: translate3d(0, -36px, 0);
    transition: transform 200ms;
  }
`;

export const 버튼_타이머 = TemplateButtonWithTimer.bind({});
버튼_타이머.args = {};
