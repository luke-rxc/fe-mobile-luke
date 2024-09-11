import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import sample from 'lodash/sample';
import type { ReviewListType } from '@features/review/constants';
import type { ReviewListItemModel, ReviewMediaModel } from '@features/review/models';
import type { ReviewSchema } from '../../schemas';

export interface ReviewListParam {
  type: ReviewListType;
  id: number;
  nextParameter?: string;
  size?: number;
}

const sampleList: ReviewMediaModel[] = [
  {
    blurHash: '',
    extension: 'mp4',
    height: 1440,
    id: 1,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    width: 1080,
    chromaKey: false,
    fileType: 'VIDEO',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
  {
    blurHash: '',
    chromaKey: false,
    extension: 'mp4',
    fileType: 'VIDEO',
    height: 1440,
    id: 1,
    width: 1080,
    path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original.mp4',
    thumbnailImage: {
      blurHash:
        '|78N,^_N_3?bxuRPM{MxD%%MD%M{RjRPRjWBj[ae00008_D%WCj[j[%f%fRj?v%gxu%g%Mt6jst7of?b-;f5WBxuxuD%M{IARjM{IUD%IAayM|M{kCx]ogofRjM{WAx[t7RjV@WBt7xux]t7%Mt7ayD%Mxt7xut7WBWBWB',
      extension: 'jpg',
      fileType: 'IMAGE',
      height: 1440,
      id: 1468202,
      path: 'story/20240607/aff45dd8-c86b-4db9-8bf1-95a5a62a0c1d/original_001.jpg',
      width: 1080,
    },
  },
];

const getList = (param: string, size: number): ReviewListItemModel[] => {
  return new Array(size).fill({}).map((_, index) => {
    let idValue: number;
    if (param) {
      const v = +param.split('=')[1];
      idValue = v + index + 1;
    } else {
      idValue = index + 1;
    }

    let mediaList: ReviewMediaModel[] = [];

    const video = sample(sampleList) ?? sampleList[0];
    // console.log(video);
    if (index % 2 === 0) {
      // 왼쪽은 이미지
      mediaList = new Array(3).fill({}).map((__, mIdx) => {
        const media: ReviewMediaModel = {
          blurHash:
            '|YBNKPtQt8Rji^R*jYayf5?wtRt8aeaJWBjZWUazX8p0S$s:jEjEWXj[a#NFt9S3s:WAogbIbHa#oyt7f5oLazbdbIj]ayxtoyn$aet7bcofa#fkofWrs.WAofkCozafbHWrR*a}jYjbaybHj[j[S4aeWCjYR+fkaeWUaf',
          chromaKey: false,
          extension: 'jpeg',
          fileType: 'IMAGE',
          height: 2560,
          id: idValue * 100 + mIdx,
          path: 'review/20240508/8a6efe4f-dd24-4ba7-8cd2-3036f5b5e5d3.jpeg',
          thumbnailImage: undefined,
          width: 1920,
        };
        return media;
      });
      /* mediaList = new Array(1).fill({}).map((__, mIdx) => {
        const media: MediaListSchema = {
          ...video,
          id: idValue * 100 + mIdx,
        };
        return media;
      }); */
    } else {
      // 오른쪽은 비디오
      mediaList = new Array(1).fill({}).map((__, mIdx) => {
        const media: ReviewMediaModel = {
          ...video,
          id: idValue * 100 + mIdx,
        };
        return media;
      });
    }

    /* mediaList = new Array(1).fill({}).map((__, mIdx) => {
      const media: MediaListSchema = {
        ...video,
        id: idValue * 100 + mIdx,
      };
      return media;
    }); */

    const review: ReviewListItemModel = {
      id: idValue,
      mediaList,
      userProfileImage: {
        blurHash:
          '|GKK+tMxV?IU%LRj%Mayt7?Zay4oWBD%t6WCRjofIp-;IUoexuoLayRjofWE~p-;%MofIoRjIVt7xuxuxuIVM{RjRjt6WBf5RjM{WAt7axs:ayWBIUWBM{Rkt7NGRjayayRkRjxtRjt7WBWBxtj@WBM{xuR*M|j[WBofRj',
        extension: 'jpg',
        fileType: 'IMAGE',
        height: 512,
        id: 1864968,
        path: 'user/20240613/96d17797-463f-4b24-a759-f05498e7e628.jpg',
        width: 512,
      },
      userNickname: 'rqbrhr',
      goods: {
        id: 21209,
        code: 'ibry0',
        name: '그란 페이스 타월 샌드 4p',
        brandName: '아파트멘터리',
        image: {
          blurHash:
            '|SSPRyt7?wozITxaV@t6xvxua|WBj[j[ayj[j[ay.9azDioKxvayofj[Riofj@ofayayj[ayayj[ofa|WBj[j[ayfQj[ayofj[ofayayj[fQayj[M_jttRa|WAj@ayayofxuayWBj[j[ayj[j[ayWBj[ofayayj[fQayj[',
          extension: 'jpg',
          fileType: 'IMAGE',
          height: 512,
          id: 29588,
          path: 'goods/20220228/f20d5223-69f3-4cd5-a3e2-501da9b223b3.jpg',
          width: 512,
        },
        options: {
          bookingDate: 0,
          id: 21248,
          itemList: [],
          optionPositionBookingDate: 0,
        },
        status: 'NORMAL',
        isOpenDetails: true,
      },
    };
    return review;
  });
};

const nextParam: Array<string | null> = ['id=22552', 'id=22389', 'id=22244', 'id=21398', 'id=21228', null];

/**
 * 리뷰 리스트 API
 */
export const getReviewList = ({
  type,
  id,
  nextParameter = '',
  size = 20,
}: ReviewListParam): Promise<LoadMoreResponseSchema<ReviewSchema>> => {
  let nextPageValue: string | null;
  if (!nextParameter) {
    nextPageValue = nextParam[0] as string;
  } else {
    nextPageValue = nextParam[nextParam.findIndex((v) => v === nextParameter) + 1];
  }
  return new Promise((resolve) => {
    const page: LoadMoreResponseSchema<ReviewSchema> = {
      content: getList(nextParameter, size),
      metadata: {},
      nextParameter: nextPageValue,
    };
    resolve(page);
  });
};
