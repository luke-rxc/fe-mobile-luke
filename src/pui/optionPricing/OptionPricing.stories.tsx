import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { OptionPricing } from './OptionPricing';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/OptionPricing/OptionPricing`,
  component: OptionPricing,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=38880-47127&mode=design&t=hSx6c68u26fWemMQ-4',
    },
  },
} as ComponentMeta<typeof OptionPricing>;

const Template: ComponentStory<typeof OptionPricing> = (args) => <OptionPricing {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  optionInfos: ['12월 12일(목)'],
  price: 1253000,
  runOut: false,
};

export const 옵션2 = Template.bind({});
옵션2.args = {
  optionInfos: ['12월 12일(목)', '일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육'],
  price: 1253000,
  runOut: false,
};

export const 품절 = Template.bind({});
품절.args = {
  optionInfos: ['12월 12일(목)', '14:10 RS7120'],
  price: 1253000,
  runOut: true,
};
