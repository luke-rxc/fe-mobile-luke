import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { TabsFloating } from './TabsFloating';

export default {
  title: `${StoriesMenu.PUI}/TabsFloating`,
  component: TabsFloating,
  parameters: {
    design: [
      {
        name: 'Tabs Floating',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=33832-36017&mode=design&t=n4upX7ZwuHqZO5ZB-4',
      },
    ],
  },
} as ComponentMeta<typeof TabsFloating>;

const Template: ComponentStory<typeof TabsFloating> = ({ ...args }) => (
  <div style={{ width: 360 }}>
    <TabsFloating {...args} />
  </div>
);

export const 기본 = Template.bind({});
기본.args = {
  tabs: [
    {
      id: 0,
      label: '메뉴 1',
    },
    {
      id: 1,
      label: '플로팅 메뉴 2',
    },
    {
      id: 2,
      label: '메뉴 3',
    },
    {
      id: 3,
      label: '플로팅 메뉴 4',
    },
    {
      id: 4,
      label: '메뉴 5',
    },
    {
      id: 5,
      label: '플로팅 메뉴 6',
    },
    {
      id: 6,
      label: '메뉴 7',
    },
  ],
};

export const 탭보다_메뉴_사이즈_작은_경우_균등_사이즈 = Template.bind({});
탭보다_메뉴_사이즈_작은_경우_균등_사이즈.args = {
  tabs: [
    {
      id: 0,
      label: '메뉴 1',
    },
    {
      id: 1,
      label: '메뉴 2',
    },
    {
      id: 2,
      label: '메뉴 3',
    },
  ],
};

export const 탭보다_메뉴_사이즈_작은_경우 = Template.bind({});
탭보다_메뉴_사이즈_작은_경우.args = {
  tabs: [
    {
      id: 0,
      label: '메뉴 1',
    },
    {
      id: 1,
      label: '플로팅 메뉴 플로팅 메뉴 2',
    },
    {
      id: 2,
      label: '메뉴 3',
    },
  ],
};
