import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CreditCardEmpty } from './CreditCardEmpty';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Credit/CreditCardEmpty`,
  component: CreditCardEmpty,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-137703&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof CreditCardEmpty>;

const Template: ComponentStory<typeof CreditCardEmpty> = ({ ...args }) => <CreditCardEmpty {...args} role="button" />;

export const 기본 = Template.bind({});
