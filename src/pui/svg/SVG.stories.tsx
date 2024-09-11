import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { SVG } from './SVG';

export default {
  title: `${StoriesMenu.NonPDS}/SVG`,
  component: SVG,
} as ComponentMeta<typeof SVG>;

const Template: ComponentStory<typeof SVG> = ({ ...args }) => {
  return (
    <div>
      <Wrapper>
        <SVG {...args} />
      </Wrapper>
      <hr />
      <p>다크모드시에는 #FFF 값을 가짐</p>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  src: 'https://cdn-image-dev.prizm.co.kr/brand/20220224/5edcee6a-d64d-481f-945a-294ebaf11db6.svg',
};

const Wrapper = styled.div`
  width: 400px;
  text-align: center;
`;
