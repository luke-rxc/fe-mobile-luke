import { CalendarPostParams, postCalendar } from '../options';
import { GoodsCalendarSchema } from '../../schemas';

const calendarMockSingle: GoodsCalendarSchema = {
  goodsId: 24081,
  ticketUI: 'CALENDAR_SINGLE',
  // 패키지 상품 (n박 m일)
  ticketKind: 'TRAVEL',
  stayNights: 3,
  stayDays: 4,
  // 1일 상품
  // ticketKind: 'CULTURE',
  // stayNights: 0,
  // stayDays: 1,
  displayPrice: true,
  userMaxPurchaseEa: 0,
  userFixedPurchaseEa: 0,
  months: [
    {
      year: 2023,
      month: 9,
      days: [
        {
          day: 1,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 2,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 3,
          dayOfWeek: '일',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 4,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 5,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 6,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 7,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 8,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 9,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 10,
          dayOfWeek: '일',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 11,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 12,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 13,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 14,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 15,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 16,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 17,
          dayOfWeek: '일',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 18,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 19,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 20,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 21,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 22,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 23,
          dayOfWeek: '토',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 24,
          dayOfWeek: '일',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 25,
          dayOfWeek: '월',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 26,
          dayOfWeek: '화',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 27,
          dayOfWeek: '수',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 28,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 29,
          dayOfWeek: '금',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
      ],
    },
    {
      year: 2023,
      month: 10,
      days: [
        {
          day: 1,
          dayOfWeek: '일',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 2,
          dayOfWeek: '월',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 3,
          dayOfWeek: '화',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 4,
          dayOfWeek: '수',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 5,
          dayOfWeek: '목',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 6,
          dayOfWeek: '금',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 7,
          dayOfWeek: '토',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 8,
          dayOfWeek: '일',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 9,
          dayOfWeek: '월',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 10,
          dayOfWeek: '화',
          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 11,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 12,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 13,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 14,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 15,
          dayOfWeek: '일',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 16,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 17,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 18,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 19,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 20,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 21,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 22,
          dayOfWeek: '일',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 23,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 24,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 25,
          dayOfWeek: '수',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 26,
          dayOfWeek: '목',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 27,
          dayOfWeek: '금',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 28,
          dayOfWeek: '토',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 29,
          dayOfWeek: '일',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 30,
          dayOfWeek: '월',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
      ],
    },
    {
      year: 2023,
      month: 11,
      days: [
        {
          day: 1,
          dayOfWeek: '수',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 2,
          dayOfWeek: '목',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 3,
          dayOfWeek: '금',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 4,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: false,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 5,
          dayOfWeek: '일',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 6,
          dayOfWeek: '월',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 7,
          dayOfWeek: '화',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 8,
          dayOfWeek: '수',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 9,
          dayOfWeek: '목',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 10,
          dayOfWeek: '금',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 11,
          dayOfWeek: '토',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 12,
          dayOfWeek: '일',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 13,
          dayOfWeek: '월',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 14,
          dayOfWeek: '화',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 15,
          dayOfWeek: '수',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 16,
          dayOfWeek: '목',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 17,
          dayOfWeek: '금',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 18,
          dayOfWeek: '토',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 19,
          dayOfWeek: '일',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 20,
          dayOfWeek: '월',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 21,
          dayOfWeek: '화',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 22,
          dayOfWeek: '수',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 23,
          dayOfWeek: '목',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 24,
          dayOfWeek: '금',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 25,
          dayOfWeek: '토',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 26,
          dayOfWeek: '일',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 27,
          dayOfWeek: '월',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 28,
          dayOfWeek: '화',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 29,
          dayOfWeek: '수',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
      ],
    },
    {
      year: 2023,
      month: 12,
      days: [
        {
          day: 1,
          dayOfWeek: '금',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 2,
          dayOfWeek: '토',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 3,
          dayOfWeek: '일',

          enable: false,
          checkoutOnly: false,
          purchasableStock: 0,
        },
        {
          day: 4,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 5,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 6,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 7,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 8,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 9,
          dayOfWeek: '토',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 10,
          dayOfWeek: '일',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 11,
          dayOfWeek: '월',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 12,
          dayOfWeek: '화',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 13,
          dayOfWeek: '수',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 14,
          dayOfWeek: '목',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
        {
          day: 15,
          dayOfWeek: '금',
          minPrice: 10000,
          maxPrice: 10000,
          enable: true,
          checkoutOnly: false,
          purchasableStock: 555,
        },
      ],
    },
  ],
  startDate: 1693494000000,
  endDate: 1702652400000,
};

export const calendarMockSingleApi = ({
  goodsId, // eslint-disable-line @typescript-eslint/no-unused-vars
  components, // eslint-disable-line @typescript-eslint/no-unused-vars
  parameters, // eslint-disable-line @typescript-eslint/no-unused-vars
}: CalendarPostParams): ReturnType<typeof postCalendar> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(calendarMockSingle);
    }, 1000);
  });
