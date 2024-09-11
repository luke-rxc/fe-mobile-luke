import { LayoutOptionsParams, getLayoutOptions } from '../options';
import { LayoutOptionsSchema } from '../../schemas';

const layoutMockOptions: LayoutOptionsSchema = {
  layoutCount: 2,
  layouts: [
    {
      id: 795,
      name: '1-1',
      items: [
        {
          value: '성인',
          children: null,
          isRunOut: false,
          options: [
            {
              id: 34588,
              secondaryId: 795,
              consumerPrice: 500000,
              price: 132000,
              purchasableStock: 0,
              discountRate: 73,
              selectedValues: ['2024년 1월 4일(목) 오후 3시', 'ED OP 1-1 (스탠딩석)', '성인'],
              isDefaultOption: true,
              isRunOut: false,
            },
          ],
        },
        {
          value: '청소년',
          children: null,
          isRunOut: false,
          options: [
            {
              id: 34589,
              secondaryId: 795,
              consumerPrice: 500000,
              price: 142000,
              purchasableStock: 100,
              discountRate: 71,
              selectedValues: ['2024년 1월 4일(목) 오후 3시', 'ED OP 1-1 (스탠딩석)', '청소년'],
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
      ],
    },
    {
      id: 796,
      name: '1-2',
      items: [
        {
          value: '성인',
          children: null,
          isRunOut: false,
          options: [
            {
              id: 34588,
              secondaryId: 796,
              consumerPrice: 500000,
              price: 132000,
              purchasableStock: 100,
              discountRate: 73,
              selectedValues: ['2024년 1월 4일(목) 오후 3시', 'ED OP 1-2 (스탠딩석)', '성인'],
              isDefaultOption: true,
              isRunOut: false,
            },
          ],
        },
        {
          value: '청소년',
          children: null,
          isRunOut: false,
          options: [
            {
              id: 34589,
              secondaryId: 796,
              consumerPrice: 500000,
              price: 142000,
              purchasableStock: 100,
              discountRate: 71,
              selectedValues: ['2024년 1월 4일(목) 오후 3시', 'ED OP 1-2 (스탠딩석)', '청소년'],
              isDefaultOption: false,
              isRunOut: false,
            },
          ],
        },
      ],
    },
  ],
};

export const layoutMockOptionsApi = ({
  goodsId, // eslint-disable-line @typescript-eslint/no-unused-vars
  scheduleId, // eslint-disable-line @typescript-eslint/no-unused-vars
  layoutIds, // eslint-disable-line @typescript-eslint/no-unused-vars
}: LayoutOptionsParams): ReturnType<typeof getLayoutOptions> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(layoutMockOptions);
    }, 1000);
  });
