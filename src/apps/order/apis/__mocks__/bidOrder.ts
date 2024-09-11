import { BidCheckoutSchema, OrderSchema } from '../../schemas';

export const bidCheckout: BidCheckoutSchema = {
  itemCount: 1,
  itemList: [
    {
      provider: {
        id: 7,
        name: '밀도 ',
      },
      shippingGroupList: [
        {
          orderDataList: [
            {
              brand: {
                id: 22463,
                name: '휘닉스 제주',
                primaryImage: {
                  id: 1492460,
                  path: 'brand/20230918/2f15dffc-f67b-43f7-af87-997c88263c19.svg',
                  blurHash: null,
                  width: 60,
                  height: 24,
                  fileType: 'IMAGE',
                  extension: 'svg',
                },
                defaultShowRoomId: null,
              },
              goods: {
                id: 75891,
                name: '올리 날짜멀티 숙박',
                kind: 'REAL',
                primaryImage: {
                  id: 1563560,
                  path: 'goods/20231023/386531b5-cd55-4959-b2d2-d6f057a434f5.jpeg',
                  blurHash:
                    '|LG9524oD$ofWDRjWXjuoeK,MbnNogbJs;ofbHog-@V?adafV@WCofofj??cIURjn#f6ogR*WWt6JEsks+ayj]ogaet7WX$eS$oyM_M{j]WBWCjZE1%2t7axWBs:kDofWBWAR-t7WAn$a~WYoeWBxva$V?WBWXn#j]WXn$',
                  width: 512,
                  height: 512,
                  fileType: 'IMAGE',
                  extension: 'jpg',
                },
                consumerPrice: 158000,
                price: 158000,
                discountRate: 0,
                showRoomId: 0,
                code: '1vm3y0',
                label: null,
                isPrizmOnly: false,
                option: {
                  id: 304723,
                  bookingDate: 1698937200000,
                  itemList: [
                    {
                      title: '날짜',
                      value: '11월 03일 (금)',
                    },
                    {
                      title: '룸타입',
                      value: '스탠다드',
                    },
                    {
                      title: '조식',
                      value: '미포함',
                    },
                  ],
                },
                packageOption: null,
              },
              quantity: 1,
              consumerPriceWithQuantity: 158000,
              priceWithQuantity: 158000,
              pcccRequired: false,
            },
            {
              brand: {
                id: 22463,
                name: '휘닉스 제주',
                primaryImage: {
                  id: 1492460,
                  path: 'brand/20230918/2f15dffc-f67b-43f7-af87-997c88263c19.svg',
                  blurHash: null,
                  width: 60,
                  height: 24,
                  fileType: 'IMAGE',
                  extension: 'svg',
                },
                defaultShowRoomId: null,
              },
              goods: {
                id: 75891,
                name: '올리 날짜멀티 숙박',
                kind: 'REAL',
                primaryImage: {
                  id: 1563560,
                  path: 'goods/20231023/386531b5-cd55-4959-b2d2-d6f057a434f5.jpeg',
                  blurHash:
                    '|LG9524oD$ofWDRjWXjuoeK,MbnNogbJs;ofbHog-@V?adafV@WCofofj??cIURjn#f6ogR*WWt6JEsks+ayj]ogaet7WX$eS$oyM_M{j]WBWCjZE1%2t7axWBs:kDofWBWAR-t7WAn$a~WYoeWBxva$V?WBWXn#j]WXn$',
                  width: 512,
                  height: 512,
                  fileType: 'IMAGE',
                  extension: 'jpg',
                },
                consumerPrice: 158000,
                price: 158000,
                discountRate: 0,
                showRoomId: 0,
                code: '1vm3y0',
                label: null,
                isPrizmOnly: false,
                option: {
                  id: 304724,
                  bookingDate: 1699023600000,
                  itemList: [
                    {
                      title: '날짜',
                      value: '11월 04일 (토)',
                    },
                    {
                      title: '룸타입',
                      value: '스탠다드',
                    },
                    {
                      title: '조식',
                      value: '미포함',
                    },
                  ],
                },
                packageOption: null,
              },
              quantity: 1,
              consumerPriceWithQuantity: 158000,
              priceWithQuantity: 158000,
              pcccRequired: false,
            },
          ],
          isConsecutiveStay: true,
          shippingGroupName: 'each_delivery187',
          shippingCost: 0,
          shippingPolicyText: '무료배송',
          totalSalesPrice: 5000,
          totalConsumerPrice: 5000,
          totalDiscountRate: 0,
        },
      ],
      totalSalesPrice: 5000,
      totalShippingCost: 0,
      orderPrice: 5000,
    },
  ],
  orderer: {
    isIdentify: true,
    email: 'kai@rxc.co.kr',
    name: '심명섭',
    phone: '01041114428',
  },
  recipient: {
    name: '심명섭',
    phone: '01041114428',
    postCode: '04766',
    address: '서울 성동구 서울숲길 17',
    addressDetail: '22222',
    isPcccRequired: false,
    isAddressRequired: true,
    isShowRequestMessageDropdown: false,
  },
  payment: {
    availablePaymentTypes: ['CREDIT_CARD', 'KAKAO_PAY', 'NAVER_PAY', 'TOSS_PAY'],
    savedPaymentType: 'CREDIT_CARD',
    usablePoint: 0,
    pointBalance: 0,
    pointWeight: 100,
    totalSalesPrice: 5000,
    totalShippingCost: 0,
    orderPrice: 5000,
    isShowInstallmentDropdown: true,
    paymentBenefitList: [
      {
        paymentType: 'PRIZM_PAY',
        benefitList: [
          {
            title: null,
            content: '100만원 이상 결제시 1% 적립금 지급',
          },
        ],
      },
      {
        paymentType: 'TOSS_PAY',
        benefitList: [
          {
            title: null,
            content: '생애 첫 결제시 3% 적립',
          },
        ],
      },
      {
        paymentType: 'CREDIT_CARD',
        benefitList: [
          {
            title: '신한카드',
            content: '7만원 이상 결제시 5% 청구 할인',
          },
          {
            title: '현대카드',
            content: '3만원이상 2% 추가 할인!',
          },
        ],
      },
      {
        paymentType: 'NAVER_PAY',
        benefitList: [{ title: null, content: '무조건 3% 추가 할인' }],
      },
      {
        paymentType: 'KAKAO_PAY',
        benefitList: [{ title: null, content: '5만원 이상 결제시 카카오머니 2% 적립' }],
      },
    ],
  },
  usableGoodsCoupon: null,
  usableCartCouponList: null,
  seatExpiredDate: null,
  guideMessages: [],
};

export const bidOrderComplete: OrderSchema = {
  isFinished: true,
  orderId: 2202221312153086,
  orderStatus: {
    step: '20',
    stepName: '결제완료',
  },
  checkoutId: null,
  orderer: {
    email: 'kai@rxc.co.kr',
    name: '심명섭',
    phone: '01041114428',
  },
  payment: {
    paymentType: {
      type: 'CREDIT_CARD',
      name: '외환카드 (일시불)',
    },
    totalSalesPrice: 1000,
    usedPoint: 0,
    usedCartCouponSale: 0,
    usedGoodsCouponSale: 0,
    totalShippingCost: 0,
    amount: 1000,
    paymentDate: 1645503158000,
    pg: 'kcp',
    pgForLog: 'kcp',
    usedCartCoupon: null,
  },
  recipient: {
    name: '심명섭',
    phone: '01041114428',
    postCode: '13020',
    address: '경기 하남시 대성로 73',
    addressDetail: '1234',
    deliveryRequestMessage: '배송 전 연락 바랍니다',
    isAddressRequired: true,
  },
  goodsType: 'AUCTION',
  itemOptionList: [
    {
      id: 2676,
      itemId: 2499,
      brand: null,
      goods: {
        id: 720,
        name: '상품7',
        primaryImage: {
          id: 15895,
          path: 'goods/20220216/c1ccfc00-d0ab-464e-a6b9-c56d54a6703f.png',
          blurHash:
            '|UKne;t7%ga|V@j[tRofoy00oLMxWBWXWBRjayRk4oWUkDoMj[ayWBayj[x^axt7j[ofj]ofa{ae_NWVRka|jZofjsj[j[Rkj]jZWBj[j[bHj[j[RPofbIWBV@WVWVazWBIBjbofj]kCWBj[ayoL%1WBbHofogj[WBj@f6',
          width: 1284,
          height: 2778,
        },
        consumerPrice: 1000,
        price: 1000,
        kind: 'REAL',
        discountRate: 0,
        showRoomId: 2097,
        code: 'l6y1rn',
        label: null,
        type: 'AUCTION',
        shippingMethod: 'PARCEL',
        categoryIdList: [],
        categoryNameList: [],
        option: {
          id: 1383,
          bookingDate: 1698049881657,
          itemList: [],
        },
        packageOption: null,
      },
      statusInfo: {
        step: '20',
        stepName: '결제완료',
      },
      ea: 1,
      priceWithEa: 1000,
      showRoom: {
        id: 2097,
        name: '밀도',
      },
      usedCoupon: null,
    },
  ],
  failReason: null,
  isRequiredInputForm: true,
  inputFormInfo: {
    expiryDate: 10,
    sectionType: 'AIRLINE_TICKET',
  },
  isConsecutiveStay: false,
  title: '결제를 완료했습니다',
  description: '',
  navigations: [],
};
