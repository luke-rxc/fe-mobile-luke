import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Button } from '@pui/button';
import { useRef } from 'react';
import { Slide } from './Slide';
import { SlideHandle } from '../types';

export default {
  title: `${StoriesMenu.Features}/Seat/Slide`,
  component: Slide,
  parameters: {
    design: [],
  },
} as ComponentMeta<typeof Slide>;

const Template: ComponentStory<typeof Slide> = ({ ...args }) => {
  const elRef = useRef<SlideHandle | null>(null);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          elRef.current?.play();
        }}
      >
        play
      </Button>
      <Slide {...args} ref={elRef} count={2} delay={1500} duration={600} distance={36}>
        <div>좌석 선점 00:06:59</div>
        <div>시간 내에 결제해주세요</div>
      </Slide>
    </>
  );
};

export const 기본 = Template.bind({});
기본.args = {};
