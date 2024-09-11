import { CalendarPostParams, postCalendarOptions } from '../options';
import { CalendarOptionsSchema } from '../../schemas';

const calendarMockOptions: CalendarOptionsSchema = {
  goodsId: 24082,
  titleList: ['옵션명1', '옵션명2', '옵션명3'],
  itemList: [
    {
      value: '산전망',
      isRunOut: false,
      options: null,
      children: [
        {
          value: '포함',
          isRunOut: false,
          options: [
            {
              id: 31411,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 5,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
            {
              id: 31414,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 5,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
        {
          value: '불포함',
          isRunOut: false,
          options: [
            {
              id: 31564,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 555,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
            {
              id: 31567,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 555,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
      ],
    },
    {
      value: '바다전망',
      isRunOut: false,
      options: null,
      children: [
        {
          value: '포함',
          isRunOut: false,
          options: [
            {
              id: 31412,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
            {
              id: 31415,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
        {
          value: '불포함',
          isRunOut: false,
          options: [
            {
              id: 31565,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
            {
              id: 31568,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
      ],
    },
    {
      value: '우주전망',
      isRunOut: false,
      options: null,
      children: [
        {
          value: '포함',
          isRunOut: false,
          options: [
            {
              id: 31413,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
            {
              id: 31416,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
        {
          value: '불포함',
          isRunOut: false,
          options: [
            {
              id: 31566,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
            {
              id: 31569,
              consumerPrice: 10000,
              price: 10000,
              purchasableStock: 1000,
              discountRate: 0,
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
      ],
    },
  ],
};

export const calendarMockOptionsApi = ({
  goodsId, // eslint-disable-line @typescript-eslint/no-unused-vars
  components, // eslint-disable-line @typescript-eslint/no-unused-vars
  parameters, // eslint-disable-line @typescript-eslint/no-unused-vars
}: CalendarPostParams): ReturnType<typeof postCalendarOptions> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(calendarMockOptions);
    }, 1000);
  });
