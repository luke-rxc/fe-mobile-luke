import { DealsSchema } from '../../schemas';
import { DealsParam, getDeals } from '..';

export const dealsMock: DealsSchema = {
  content: Array(20).fill({
    goods: {
      id: 228,
      name: '나이키 에어맥스97',
      primaryImage: {
        id: 109,
        path: 'goods/20210701/90bca69d-a2a1-4d22-84c9-833d58eb8b5f',
        blurHash: null,
        width: 10,
        height: 20,
      },
      consumerPrice: 199000,
      price: 199000,
      discountRate: 0,
      showRoomId: 1,
      code: '6oy1',
      label: '프리오더 진행중',
    },
    brand: {
      id: 2,
      name: 'nike',
      primaryImage: {
        id: 10526,
        path: 'brand/20220105/598870b4-902a-4384-97c6-74e0fdabe1ba.svg',
        blurHash: null,
        width: 0,
        height: 0,
      },
      defaultShowRoomId: null,
    },
  }),
  metadata: { sort: 'RECOMMENDATION' },
  nextParameter: 'salesStartDate=1625119293000&id=46&sortNumber=0',
};

let count = 0;
const creatDealsMock = ({ nextParameter = '', size = 20 }: Omit<DealsParam, 'showroomId' | 'goodsId'>) => {
  count += 1;
  const content = Array(size)
    .fill(dealsMock.content[0])
    .map((_, index) => ({
      ...dealsMock.content[0],
      goods: {
        ...dealsMock.content[0].goods,
        id: index + 1 + count * size,
        name: `${index + 1 * size} / Coca-Cola x LeSportsac Print Totebag package s..`,
      },
    }));
  return {
    ...dealsMock,
    content,
    nextParameter,
  };
};

export const dealsMockApi = ({
  goodsId, // eslint-disable-line @typescript-eslint/no-unused-vars
  showroomId, // eslint-disable-line @typescript-eslint/no-unused-vars
  nextParameter = '',
  size,
}: DealsParam): ReturnType<typeof getDeals> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(creatDealsMock({ nextParameter, size }));
    }, 1000);
  });
