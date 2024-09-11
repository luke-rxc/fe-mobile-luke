import { GoodsSchema } from '../../schemas';
import { GoodsParam, getGoods } from '..';

const goodsSchemaMock: GoodsSchema = {
  category: [
    {
      one: {
        id: 3,
        name: '리빙/생활',
      },
      two: {
        id: 145,
        name: '주방용품',
      },
      three: {
        id: 289,
        name: '잔/컵/물병',
      },
    },
  ],
  isExistComponent: true,
  isExistDetailInformation: false,
  auction: null,
  liveId: null,
  id: 430,
  name: '나이키 조던12',
  brand: {
    id: 2,
    name: 'nike',
    primaryImage: {
      id: 10526,
      path: 'brand/20211102/5c510e8a-5bed-4bd3-8043-bfca1290a257.png',
      blurHash: 'UdRC[6fQxuayWBayj[of~qj[Rjof%MofayWB',
      width: 150,
      height: 40,
    },
    showRoom: {
      id: 21210,
      code: 'sienne',
    },
  },
  kind: 'REAL',
  code: null,
  banner: null,
  ticket: null,
  type: 'PREORDER',
  status: 'NORMAL',
  statusText: '판매중',
  description: '나이키 조던 입니다.',
  salesStartDate: 1628521200000,
  salesEndDate: null,
  displayStartDate: 1628521200000,
  userMaxPurchaseLimit: 'UNLIMIT',
  userMaxPurchaseEa: 0,
  primaryImage: {
    id: 10170,
    path: 'goods/20211018/47ba6050-2823-4ccf-882c-568fd6b0471c.jpeg',
    blurHash: 'UIR3TXxu%MM{%Lj[WCa|~pNGIUxuD%WBofj?',
    width: 1200,
    height: 1200,
  },
  option: {
    titleList: ['사이즈'],
    defaultOption: {
      consumerPrice: 199000,
      price: 199000,
      purchasableStock: 50,
      discountRate: 0,
    },
    totalStock: { initialEa: 100, purchasableEa: 100, isInfinity: false },
    itemList: [
      {
        value: '290',
        isRunOut: false,
        options: [
          {
            id: 520,
            consumerPrice: 199000,
            price: 199000,
            purchasableStock: 50,
            discountRate: 0,
            isDefaultOption: false,
            isRunOut: false,
          },
        ],
        children: null,
      },
      {
        value: '280',
        isRunOut: false,
        options: [
          {
            id: 519,
            consumerPrice: 199000,
            price: 199000,
            purchasableStock: 50,
            discountRate: 0,
            isDefaultOption: false,
            isRunOut: false,
          },
        ],
        children: null,
      },
      {
        value: '270',
        isRunOut: false,
        options: [
          {
            id: 518,
            consumerPrice: 199000,
            price: 199000,
            purchasableStock: 50,
            discountRate: 0,
            isDefaultOption: false,
            isRunOut: false,
          },
        ],
        children: null,
      },
      {
        value: '260',
        isRunOut: false,
        options: [
          {
            id: 517,
            consumerPrice: 199000,
            price: 199000,
            purchasableStock: 50,
            discountRate: 0,
            isDefaultOption: false,
            isRunOut: false,
          },
        ],
        children: null,
      },
      {
        value: '250',
        isRunOut: false,
        options: [
          {
            id: 516,
            consumerPrice: 199000,
            price: 199000,
            purchasableStock: 50,
            discountRate: 0,
            isDefaultOption: true,
            isRunOut: false,
          },
        ],
        children: null,
      },
    ],
  },
  optionMetadata: {
    type: 'DEFAULT',
    userMaxPurchaseEa: 0,
    isAllPriceSame: true,
    multiChoicePolicy: 'NONE',
    components: ['DEFAULT'],
  },
  fileList: [
    {
      file: {
        id: 10172,
        path: 'goods/20211018/6ffe4e3a-8249-4683-aaca-6dcfd09445aa.mp4',
        blurHash: null,
        width: 0,
        height: 0,
      },
      videoPlayType: 'ONCE',
    },
    {
      file: {
        id: 10171,
        path: 'goods/20211018/11cd6943-2e5f-4f6d-98ae-7bbf23ea1201.png',
        blurHash: 'UJECa$%2009Z00WV-;of01WC-;t6.TV@Mwt7',
        width: 1560,
        height: 1168,
      },
      videoPlayType: null,
    },
    {
      file: {
        id: 10399,
        path: 'goods/20211029/f9f77c39-e2b4-419b-8b6e-b9303a954ddc.png',
        blurHash: 'UJECa%%2009Z4mWV-;of0KWC-;t6.TV@Mwt7',
        width: 1560,
        height: 1168,
      },
      videoPlayType: null,
    },
    {
      file: {
        id: 10400,
        path: 'goods/20211029/e6dc5175-2181-4a09-b4be-048a6b050b91/original.mp4',
        blurHash: null,
        width: 0,
        height: 0,
      },
      videoPlayType: 'REPEAT',
    },
  ],
  shipping: {
    shippingPriceText: '배송비 2,500원',
    shippingDisplayText: '70,000원 이상 구매 시 무료배송',
    jejuAddCostInfoDisplayText: '제주도/도서산간 5,000원',
    exportingDisplay: false,
    exportingDisplayText: null,
  },
  showRoom: {
    id: 1,
    code: 'nike',
    name: '나이키',
    primaryImage: {
      id: 10641,
      path: 'showroom/20211107/61e5952e-c5bf-43e8-9ea9-57fa1a4aa358.png',
      blurHash: 'U56RM%?b0000IUM{xu%M009F~q_3_3-;D%4n',
      width: 650,
      height: 430,
    },
    provider: {
      id: 45,
      name: '나이키',
    },
    backgroundColor: '#8200ff',
    isActive: true,
    liveId: null,
    liveTitle: null,
    onAir: false,
    textColor: '#ffffff',
    type: 'NORMAL',
  },
  notice: null,
  isBuyAble: true,
  isRunOut: false,
  isPrivateSales: false,
  isAdultRequired: false,
  isPcccRequired: false,
  isCartAddable: false,
  isWishAble: true,
  keyword: [],
  benefits: {
    tagType: 'NONE',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const goodsMockApi1 = ({ goodsId, showRoomId = 0 }: GoodsParam): ReturnType<typeof getGoods> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(goodsSchemaMock);
    }, 1000);
  });
