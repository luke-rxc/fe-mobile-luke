import styled from 'styled-components';
import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { RegionShortcutList } from './RegionShortcutList';

const Wrapper = styled.div`
  --backgroundColor: #ffffff;
  --contentColor: #054640;
  --tintColor: #82b7b2;
  --textColor: #000000;
`;

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/RegionShortcutList`,
  component: RegionShortcutList,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=82356-74230&t=3oCXvAPyZuMKvdhh-4',
    },
  },
} as ComponentMeta<typeof RegionShortcutList>;

const Template: ComponentStory<typeof RegionShortcutList> = ({ ...args }) => (
  <Wrapper>
    <RegionShortcutList {...args} />
  </Wrapper>
);

export const 기본 = Template.bind({});
기본.args = {
  regions: [
    { name: '제주', link: 'string' },
    { name: '부산', link: 'string' },
    { name: '강원', link: 'string' },
    { name: '인천', link: 'string' },
    { name: '경기', link: 'string' },
    { name: '경상', link: 'string' },
    { name: '전라', link: 'string' },
    { name: '충청', link: 'string' },
  ],
};
