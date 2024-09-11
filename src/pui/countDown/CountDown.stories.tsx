import { useState } from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useDDay } from '@services/useDDay';
import { Button } from '@pui/button';
import { CountDown } from '.';

export default {
  title: `${StoriesMenu.NonPDS}/CountDown`,
  component: CountDown,
} as ComponentMeta<typeof CountDown>;

/**
 * Default
 */
const getNearTimeSize = () => {
  const newDate = new Date();
  newDate.setMinutes(newDate.getMinutes() + 10);
  const time = newDate.getTime();
  return time;
};

const getTimeSize = () => {
  const newDate = new Date();
  newDate.setMinutes(newDate.getMinutes() + 60);
  const time = newDate.getTime();
  return time;
};

const getDaySize = () => {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 10);
  const time = newDate.getTime();
  return time;
};

const getSecondSize = () => {
  const newDate = new Date();
  newDate.setSeconds(newDate.getSeconds() + 5);
  const time = newDate.getTime();
  return time;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CountDownTemplate: React.FC<any> = ({ time, args }) => {
  const { isEnd, remainDay, countDown } = useDDay({ time });
  const allArgs = {
    ...args,
    countDownEnd: isEnd,
    remainDay,
    countDown,
  };
  return <CountDown {...allArgs} />;
};

const Template: ComponentStory<typeof CountDown> = (args) => {
  const [time, setTime] = useState(getSecondSize());
  const handleChange = (value: string) => {
    if (value === 'daySize') {
      setTime(getDaySize());
    }

    if (value === 'timeSize') {
      setTime(getTimeSize());
    }

    if (value === 'nearTimeSize') {
      setTime(getNearTimeSize());
    }

    if (value === 'nearTimeSecond') {
      setTime(getSecondSize());
    }
  };
  return (
    <Wrapper>
      <CountDownTemplate time={time} args={args} />
      <hr />
      <Button
        variant="tertiaryfill"
        onClick={() => handleChange('daySize')}
        className="btn"
        size="small"
        children="10일전(daySize)"
      />
      <Button
        variant="tertiaryfill"
        onClick={() => handleChange('timeSize')}
        className="btn"
        size="small"
        children="1시간전(timeSize)"
      />
      <Button
        variant="tertiaryfill"
        onClick={() => handleChange('nearTimeSize')}
        className="btn"
        size="small"
        children="10분전(nearTimeSize)"
      />
      <Button
        variant="tertiaryfill"
        onClick={() => handleChange('nearTimeSecond')}
        className="btn"
        size="small"
        children="5초전(nearTimeSecond)"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.color.bg};
  width: 500px;
  & .btn {
    margin: 0 5px;
  }
`;

export const Default = Template.bind({});
Default.args = {};

export const 텍스트사이즈변경 = Template.bind({});
텍스트사이즈변경.args = {
  daySize: 20,
  timeSize: 24,
  nearTimeSize: 40,
};

export const 텍스트컬러수동변경 = Template.bind({});
텍스트컬러수동변경.args = {
  textColor: '#00ffe8',
};

export const 텍스트정렬 = Template.bind({});
텍스트정렬.args = {
  direction: 'right',
};

export const 카운트다운종료후_사라짐 = Template.bind({});
카운트다운종료후_사라짐.args = {
  hideAfterCountDownEnd: true,
};
