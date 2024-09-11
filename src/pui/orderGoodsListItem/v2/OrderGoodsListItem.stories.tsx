import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import styled from 'styled-components';
import { Option, Select } from '@pui/select';
import { Button } from '@pui/button';
import { OrderGoodsListItem } from './OrderGoodsListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Order/OrderGoodsListItem/v2`,
  component: OrderGoodsListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-112217&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof OrderGoodsListItem>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: ComponentStory<typeof OrderGoodsListItem> = (args) => <OrderGoodsListItem {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  id: 146,
  brandName:
    '아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽아모레퍼시픽',
  goodsName: '아모레x오프화이트 화장품 kit',
  discountRate: 0,
  consumerPrice: 30000,
  price: 30000,
  orderStatus: '배송완료',
  goodsImage: {
    src: 'https://cdn-dev.prizm.co.kr/goods/20210701/f1678b66-a710-4c03-829d-572e1ddf274a',
  },
};

const SelectStyled = styled(Select)`
  width: 8.8rem;
  margin-right: 0.8rem;
`;

const HelperTextStyled = styled.p`
  display: block;
  margin-top: 0.4rem;
  font: ${({ theme }) => theme.fontType.t12};
  color: ${({ theme }) => theme.color.red};
`;

const ButtonStyled = styled(Button)`
  font: ${({ theme }) => theme.fontType.t15};
  padding: 1.15rem 1.6rem;
  span {
    color: ${({ theme }) => theme.color.gray50};
  }
`;

export const 장바구니 = Template.bind({});
장바구니.args = {
  id: 146,
  goodsImage: {
    src: 'https://cdn-dev.prizm.co.kr/goods/20210701/f1678b66-a710-4c03-829d-572e1ddf274a',
  },
  goodsName: '아모레x오프화이트 화장품 kit',
  discountRate: 17,
  consumerPrice: 30000,
  price: 25000,
  action: (
    <div className="action-wrapper">
      <SelectStyled value="1" onChange={() => {}} size="medium">
        <Option id="1">1</Option>
      </SelectStyled>
      <ButtonStyled variant="tertiaryline" size="medium">
        삭제
      </ButtonStyled>
    </div>
  ),
  quantity: 1,
  options: ['50ml'],
};

export const 장바구니_에러 = Template.bind({});
장바구니_에러.args = {
  id: 146,
  goodsImage: {
    src: 'https://cdn-dev.prizm.co.kr/goods/20210701/f1678b66-a710-4c03-829d-572e1ddf274a',
  },
  goodsName: '아모레x오프화이트 화장품 kit',
  discountRate: 17,
  consumerPrice: 30000,
  price: 25000,
  action: (
    <>
      <div className="action-wrapper">
        <SelectStyled value="1" onChange={() => {}} size="medium" error>
          <Option id="1">1</Option>
        </SelectStyled>
        <ButtonStyled variant="tertiaryline" size="medium">
          삭제
        </ButtonStyled>
      </div>
      <HelperTextStyled>에러메세지 영역입니다.</HelperTextStyled>
    </>
  ),
  quantity: 1,
  options: ['50ml'],
};

export const 비배송_티켓_상품 = Template.bind({});
비배송_티켓_상품.args = {
  id: 146,
  goodsName: '힐 스위트 트윈 (PRIZM PKG)_2',
  goodsImage: {
    src: 'https://cdn-image-dev.prizm.co.kr/goods/20220530/3c749fe9-5d49-4684-b6f0-85feb8a241b2.jpeg?im=Resize,width=512',
  },
  brandName: '그랜드조선제주',
  ticketValidity: {
    status: {
      code: 'EXPIRED',
      name: '기간만료',
    },
    expiryDate: 1656480585000,
    expiryDateText: '2022. 3. 1 - 2022. 6. 29',
    soonExpire: false,
  },
  consumerPrice: 30000,
  price: 30000,
  quantity: 1,
  options: ['1박', '가든뷰', '극성수기'],
  orderStatus: '기간만료',
};

export const 라디오버튼_사용 = Template.bind({});
라디오버튼_사용.args = {
  selectable: true,
  id: 146,
  goodsName: '힐 스위트 트윈 (PRIZM PKG)_2',
  goodsImage: {
    src: 'https://cdn-image-dev.prizm.co.kr/goods/20220530/3c749fe9-5d49-4684-b6f0-85feb8a241b2.jpeg?im=Resize,width=512',
  },
  brandName: '그랜드조선제주',
  ticketValidity: {
    status: {
      code: 'EXPIRED',
      name: '기간만료',
    },
    expiryDate: 1656480585000,
    expiryDateText: '2022. 3. 1 - 2022. 6. 29',
    soonExpire: false,
  },
  consumerPrice: 30000,
  price: 30000,
  quantity: 1,
  options: ['1박', '가든뷰', '극성수기'],
  orderStatus: '기간만료',
};

export const 구매_불가능 = Template.bind({});
구매_불가능.args = {
  id: 146,
  goodsImage: {
    src: 'https://cdn-dev.prizm.co.kr/goods/20210701/f1678b66-a710-4c03-829d-572e1ddf274a',
  },
  goodsName: '아모레x오프화이트 화장품 kit',
  discountRate: 17,
  consumerPrice: 30000,
  price: 25000,
  action: (
    <>
      <div className="action-wrapper">
        <ButtonStyled variant="tertiaryline" size="medium">
          삭제
        </ButtonStyled>
      </div>
    </>
  ),
  quantity: 1,
  options: ['50ml'],
  buyable: false,
  goodsStatusText: '품절',
};
