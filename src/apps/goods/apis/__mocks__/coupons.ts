import { CouponSchema } from '../../schemas';
import { CouponParam, getCouponList } from '..';

export const couponMocks: CouponSchema[] = [
  {
    couponId: 4,
    useType: 'GOODS',
    issueType: 'DOWNLOAD',
    display: {
      label: '최대 5,000원',
      name: '가나다라마바사아자차카타파하가나다라',
      // name: '유저 전시 쿠폰명 으잉?',
      title: '10,000원 ',
      image: {
        id: 10557,
        path: 'goods/20211104/5c611b2b-f1ce-4e3f-a6bc-e3c2492704aa.png',
        blurHash: 'UQNm+sDh%Mtl_Nx]kCV@-:o}RjoJs.M{RPkC',
        width: 750,
        height: 750,
      },
    },
    salePolicy: {
      costType: 'PERCENT',
      percent: 5,
      price: 0,
      maxPrice: 5000,
      minPrice: 30000,
    },
    issuePeriod: {
      issuePeriodType: 'DAY',
      startDateTime: null,
      expiredDateTime: null,
      downloadAfterDay: 20,
    },
    isDownloadable: true,
    isDownloaded: false,
    couponSale: 20,
    couponBenefitPrice: 9999999,
  },
  {
    couponId: 6,
    useType: 'GOODS',
    issueType: 'DOWNLOAD',
    display: {
      label: '최대 3,000원',
      title: '3,000원',
      name: '애플펜슬2 대방출',
      image: {
        id: 10557,
        path: 'goods/20211104/5c611b2b-f1ce-4e3f-a6bc-e3c2492704aa.png',
        blurHash: 'UQNm+sDh%Mtl_Nx]kCV@-:o}RjoJs.M{RPkC',
        width: 750,
        height: 750,
      },
    },
    salePolicy: {
      costType: 'WON',
      percent: 0,
      price: 3000,
      maxPrice: 3000,
      minPrice: 10000,
    },
    issuePeriod: {
      issuePeriodType: 'PERIOD',
      startDateTime: 1625463971000,
      expiredDateTime: 1703498400000,
      downloadAfterDay: null,
    },
    isDownloadable: false,
    isDownloaded: true,
    couponSale: 0,
    couponBenefitPrice: 4000,
  },
  {
    couponId: 323,
    useType: 'GOODS',
    issueType: 'DOWNLOAD',
    display: {
      label: '최대 5,000원',
      title: '10%',
      name: '유저 전시 쿠폰명',
      image: {
        id: 10557,
        path: 'goods/20211104/5c611b2b-f1ce-4e3f-a6bc-e3c2492704aa.png',
        blurHash: 'UQNm+sDh%Mtl_Nx]kCV@-:o}RjoJs.M{RPkC',
        width: 750,
        height: 750,
      },
    },
    salePolicy: {
      costType: 'PERCENT',
      percent: 10,
      price: 0,
      maxPrice: 5000,
      minPrice: 30000,
    },
    issuePeriod: {
      issuePeriodType: 'DAY',
      startDateTime: null,
      expiredDateTime: null,
      downloadAfterDay: 20,
    },
    isDownloadable: false,
    isDownloaded: true,
    couponSale: 0,
    couponBenefitPrice: 8000,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const goodsCouponMockApi = ({ goodsId, showRoomId }: CouponParam): ReturnType<typeof getCouponList> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(couponMocks);
    }, 1000);
  });

/**
 * Coupon Downloaded
 */

/* const test = [
  {
    downloadId: 11287,
    expiredDate: 1648134892384,
    coupon: {
      couponId: 98312,
      useType: 'GOODS',
      issueType: 'DOWNLOAD',
      display: {
        title: '50%',
        name: 'kai_testkai_testkai_testkai_testkai_testkai_test',
        image: null,
        label: '최대 5,000원',
      },
      salePolicy: {
        costType: 'PERCENT',
        percent: 50,
        price: 0,
        maxPrice: 5000,
        minPrice: 10000,
      },
      issuePeriod: {
        issuePeriodType: 'DAY',
        startDateTime: null,
        expiredDateTime: null,
        downloadAfterDay: 31,
      },
    },
  },
  {
    downloadId: 11287,
    expiredDate: 1648134892384,
    coupon: {
      couponId: 983212,
      useType: 'GOODS',
      issueType: 'DOWNLOAD',
      display: {
        title: '50%',
        name: 'jeff',
        image: null,
        label: '최대 5,000원',
      },
      salePolicy: {
        costType: 'PERCENT',
        percent: 50,
        price: 0,
        maxPrice: 5000,
        minPrice: 10000,
      },
      issuePeriod: {
        issuePeriodType: 'DAY',
        startDateTime: null,
        expiredDateTime: null,
        downloadAfterDay: 31,
      },
    },
  },
]; */
