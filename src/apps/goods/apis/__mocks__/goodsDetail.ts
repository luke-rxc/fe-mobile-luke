import { FileListSchema } from '../../schemas';
import { GoodsDetailParam, getGoodsDetail } from '..';

export const goodsDetailMock: FileListSchema[] = [
  {
    file: {
      id: 2,
      path: 'goods/20211018/6ffe4e3a-8249-4683-aaca-6dcfd09445aa.mp4',
      blurHash: 'UeOdIh7joinn9,B;I[sl%fR.aeaeJTsAjEjr',
      width: 200,
      height: 300,
      type: 'VIDEO',
    },
    videoPlayType: 'ONCE',
  },
  {
    file: {
      id: 3,
      path: 'goods/20211029/e6dc5175-2181-4a09-b4be-048a6b050b91/original.mp4',
      blurHash: 'UF6*%skDDgWAogfRWAayDzax%jogV=ayt9j]',
      width: 200,
      height: 300,
      type: 'VIDEO',
    },
    videoPlayType: 'REPEAT',
  },
  {
    file: {
      id: 11313,
      path: 'goods/20211117/8fbfda0d-8c06-4048-8300-e28191b2cfb7.png',
      extension: 'png',
      blurHash: 'UeOdIh7joinn9,B;I[sl%fR.aeaeJTsAjEjr',
      width: 1558,
      height: 2708,
      type: 'IMAGE',
      thumbnailImageCache: null,
    },
    videoPlayType: null,
  },
  {
    file: {
      id: 11314,
      path: 'goods/20211117/80b501ae-ed71-4a01-8cd5-1426184ceb00.png',
      extension: 'png',
      blurHash: 'U26RM%~qIU%M%MM{M{xuD%RjayayWBt7ayay',
      width: 1560,
      height: 1904,
      type: 'IMAGE',
      thumbnailImageCache: null,
    },
    videoPlayType: null,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const goodsDetailMockApi = ({ goodsId }: GoodsDetailParam): ReturnType<typeof getGoodsDetail> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(goodsDetailMock);
    }, 1000);
  });
