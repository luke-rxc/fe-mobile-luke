import { GoodsSchema } from '../../schemas';
import { GoodsParam, getGoods } from '..';

/**
 * Test Code (Preorder Count)
 */
const newDate = new Date();
// newDate.setMinutes(newDate.getMinutes() + 10);
newDate.setSeconds(newDate.getSeconds() + 7);
const endDate = new Date();
endDate.setSeconds(newDate.getSeconds() + 20);

const goodsMockPreorder: GoodsSchema = {
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
  id: 392,
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
  banner: {
    bannerList: [
      {
        id: 1,
        commonBannerType: 'GOODS_LUX_GUARANTEE',
        title: 'LUX GUARANTEE',
        subTitle: '전문 감정 기관 인증',
        textColor: '#000000',
        bgColor: '#EEEEEE',
        layerFile: {
          id: 570173,
          path: 'banner/Banner_Guarantee_Lux.png',
          width: 512,
          height: 512,
          fileType: 'IMAGE',
          extension: 'png',
        },
        layerLoop: false,
        layer2Loop: false,
        sortNum: 2,
        landing: {
          referenceId: 21294,
          schema: 'prizm://prizm.co.kr/content/teaser/luxguarantee',
          web: '/teaser/luxguarantee',
        },
      },
    ],
  },
  ticket: null,
  type: 'PREORDER',
  status: 'PREORDER',
  statusText: '알림 신청',
  description: '나이키 조던 입니다.',
  salesStartDate: newDate.getTime(),
  // salesStartDate: 1639062000000,
  salesEndDate: null,
  // salesEndDate: endDate.getTime(),
  displayStartDate: 1638802800000,
  userMaxPurchaseLimit: 'LIMIT',
  userMaxPurchaseEa: 1,
  primaryImage: {
    id: 1,
    path: 'brand/2021/05/21/7225e89f-38d9-43bf-a40a-1c56d454c5fc',
    blurHash: 'UF6*%skDDgWAogfRWAayDzax%jogV=ayt9j]',
    width: 200,
    height: 300,
  },
  option: {
    titleList: ['사이즈', '색상', '무게'],
    defaultOption: {
      consumerPrice: 150000,
      price: 150000,
      purchasableStock: 10,
      discountRate: 0,
    },
    totalStock: {
      initialEa: 101,
      purchasableEa: 101,
      isInfinity: false,
    },
    itemList: [
      {
        value: '250',
        isRunOut: false,
        options: null,
        children: [
          {
            value: '레드',
            isRunOut: false,
            options: null,
            children: [
              {
                value: '10g',
                isRunOut: false,
                options: [
                  {
                    id: 916,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 10,
                    discountRate: 0,
                    isDefaultOption: true,
                    isRunOut: false,
                  },
                ],
              },
              {
                value: '20g',
                isRunOut: false,
                options: [
                  {
                    id: 917,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 10,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
            ],
          },
          {
            value: '블루',
            isRunOut: false,
            options: null,
            children: [
              {
                value: '20g',
                isRunOut: false,
                options: [
                  {
                    id: 966,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 12,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
              {
                value: '30g',
                isRunOut: false,
                options: [
                  {
                    id: 965,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 11,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        value: '260',
        isRunOut: false,
        options: null,
        children: [
          {
            value: '레드',
            isRunOut: false,
            options: null,
            children: [
              {
                value: '10g',
                isRunOut: false,
                options: [
                  {
                    id: 967,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 13,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
            ],
          },
          {
            value: '그린',
            isRunOut: false,
            options: null,
            children: [
              {
                value: '100g',
                isRunOut: false,
                options: [
                  {
                    id: 969,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 14,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
              {
                value: '500g',
                isRunOut: false,
                options: [
                  {
                    id: 970,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 15,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
              {
                value: '10kg',
                isRunOut: false,
                options: [
                  {
                    id: 971,
                    consumerPrice: 150000,
                    price: 150000,
                    purchasableStock: 16,
                    discountRate: 0,
                    isDefaultOption: false,
                    isRunOut: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  optionMetadata: {
    type: 'DEFAULT',
    userMaxPurchaseEa: 0,
    isAllPriceSame: true,
    multiChoicePolicy: 'NONE',
    components: [],
  },
  fileList: [
    {
      file: {
        id: 2,
        path: 'goods/2021/05/21/efd10af6-733a-448e-b73c-4374cbcb0b06',
        extension: 'png',
        blurHash: null,
        width: 100,
        height: 200,
        type: 'IMAGE',
      },
      videoPlayType: null,
    },
    {
      file: {
        id: 24,
        path: 'goods/2021/06/07/656c2f67-765e-484d-a329-8eb973df62d5',
        extension: 'mp4',
        blurHash: null,
        width: 100,
        height: 200,
        type: 'VIDEO',
      },
      videoPlayType: 'ONCE',
    },
    {
      file: {
        id: 30,
        path: 'showcase/20210616/3576dcab-f818-4e14-a63c-02207e07a2fa/original',
        extension: 'avi',
        blurHash: null,
        width: 0,
        height: 0,
        type: 'VIDEO',
      },
      videoPlayType: 'ONCE',
    },
    {
      file: {
        id: 32,
        path: 'showcase/20210616/6c29d8bf-272b-4a93-a37c-b485998fe36a/original',
        extension: 'avi',
        blurHash: null,
        width: 0,
        height: 0,
        type: 'VIDEO',
      },
      videoPlayType: 'REPEAT',
    },
  ],
  shipping: {
    shippingPriceText: '배송비 2,500원',
    shippingDisplayText: '70,000원 이상 구매 시 무료배송',
    jejuAddCostInfoDisplayText: '제주도/도서산간 5,000원',
    exportingDisplay: true,
    exportingDisplayText: '5.11 이후 순차 배송',
  },
  showRoom: {
    id: 1,
    name: '나이키',
    code: 'nikeshowroom',
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
  auction: null,
  liveId: null,
  isBuyAble: true,
  isRunOut: false,
  isPrivateSales: false,
  isAdultRequired: false,
  isPcccRequired: false,
  isCartAddable: false,
  isWishAble: true,
  keyword: [],
  benefits: {
    tagType: 'PRIZM_ONLY',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const goodsMockPreorderApi = ({ goodsId, showRoomId = 0 }: GoodsParam): ReturnType<typeof getGoods> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(goodsMockPreorder);
    }, 1000);
  });
