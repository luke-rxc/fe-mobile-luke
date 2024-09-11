import { Button } from '@pui/button';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Option as OptionIcon } from '@pui/icon';
import { DeliveryItem } from './DeliveryItem';

export default {
  title: 'Features/Delivery/DeliveryItem',
  component: DeliveryItem,
} as ComponentMeta<typeof DeliveryItem>;

const Template: ComponentStory<typeof DeliveryItem> = (args) => {
  const item = {
    isDefault: true,
    addressName: '회사',
    name: 'rxc',
    phone: '010-1234-1234',
    postCode: '06159',
    address: '서울특별시 강남구 삼성동 143-40',
    addressDetail: '지하 1층 RXC',
  };

  const ActionComp = () => {
    return (
      <Button>
        <OptionIcon color="gray50" />
      </Button>
    );
  };

  return (
    <div>
      <div>
        <DeliveryItem {...args} {...item} id={1} suffix={<ActionComp />} />
      </div>
      <div>
        <DeliveryItem {...args} {...item} id={2} isDefault={false} suffix={<ActionComp />} />
      </div>
    </div>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
