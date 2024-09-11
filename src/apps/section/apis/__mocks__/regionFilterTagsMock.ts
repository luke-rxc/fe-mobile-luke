import { ShowroomTagFilterSchema } from '../../schemas';

export const regionFilterTagsMock: ShowroomTagFilterSchema = {
  tagFilter: [
    {
      name: '숙소 유형',
      child: [
        {
          id: 1,
          name: '호텔',
          count: 153,
        },
        {
          id: 2,
          name: '펜션',
          count: 121,
        },
        {
          id: 3,
          name: '게스트하우스',
          count: 97,
        },
        {
          id: 4,
          name: '모텔',
          count: 130,
        },
        {
          id: 5,
          name: '카라반',
          count: 131,
        },
        {
          id: 6,
          name: '글램핑',
          count: 124,
        },
        {
          id: 7,
          name: '캠핑',
          count: 135,
        },
        {
          id: 8,
          name: '리조트',
          count: 89,
        },
        {
          id: 9,
          name: '한옥',
          count: 120,
        },
        {
          id: 10,
          name: '풀빌라',
          count: 143,
        },
        {
          id: 11,
          name: '레지던스',
          count: 146,
        },
      ],
      tagGroupId: 1,
    },
    {
      name: '부대시설',
      child: [
        {
          name: '인기',
          child: [
            {
              id: 20,
              name: '수영장',
              count: 493,
            },
            {
              id: 22,
              name: '스파/월풀',
              count: 505,
            },
            {
              id: 19,
              name: '피트니스',
              count: 509,
            },
            {
              id: 13,
              name: '바베큐장',
              count: 526,
            },
            {
              id: 12,
              name: '레스토랑',
              count: 522,
            },
            {
              id: 39,
              name: '유아시설',
              count: 507,
            },
          ],
          tagGroupId: 26,
        },
        {
          name: '수영',
          child: [
            {
              id: 23,
              name: '워터파크',
              count: 545,
            },
            {
              id: 24,
              name: '온천',
              count: 526,
            },
            {
              id: 21,
              name: '워터슬라이드',
              count: 527,
            },
          ],
          tagGroupId: 7,
        },
        {
          name: '스포츠',
          child: [
            {
              id: 31,
              name: '공용샤워실',
              count: 531,
            },
            {
              id: 18,
              name: '골프장',
              count: 514,
            },
            {
              id: 17,
              name: '축구장/풋살장',
              count: 548,
            },
            {
              id: 381,
              name: '농구장',
              count: 541,
            },
            {
              id: 15,
              name: '족구장',
              count: 515,
            },
            {
              id: 16,
              name: '탁구장',
              count: 519,
            },
          ],
          tagGroupId: 6,
        },
        {
          name: '식사',
          child: [
            {
              id: 32,
              name: '공용주방',
              count: 528,
            },
          ],
          tagGroupId: 5,
        },
        {
          name: '키즈',
          child: [
            {
              id: 38,
              name: '키즈플레이룸',
              count: 547,
            },
          ],
          tagGroupId: 11,
        },
        {
          name: '여가.이벤트',
          child: [
            {
              id: 26,
              name: '사우나',
              count: 533,
            },
            {
              id: 25,
              name: '찜질방',
              count: 518,
            },
            {
              id: 27,
              name: '공용스파',
              count: 522,
            },
            {
              id: 14,
              name: '카페',
              count: 524,
            },
            {
              id: 30,
              name: '루프탑',
              count: 486,
            },
            {
              id: 29,
              name: '노래방',
              count: 556,
            },
          ],
          tagGroupId: 8,
        },
        {
          name: '비즈니스',
          child: [
            {
              id: 35,
              name: '세미나실',
              count: 499,
            },
            {
              id: 37,
              name: '연회장',
              count: 521,
            },
            {
              id: 36,
              name: '비즈니스센터',
              count: 540,
            },
          ],
          tagGroupId: 10,
        },
        {
          name: '기타',
          child: [
            {
              id: 34,
              name: '매점/편의점',
              count: 502,
            },
            {
              id: 33,
              name: '공용화장실',
              count: 507,
            },
          ],
          tagGroupId: 9,
        },
      ],
      tagGroupId: 2,
    },
    {
      name: '제공 서비스',
      child: [
        {
          name: '인기',
          child: [
            {
              id: 48,
              name: '주차가능',
              count: 512,
            },
            {
              id: 47,
              name: '조식 서비스',
              count: 506,
            },
            {
              id: 46,
              name: '반려동물 동반가능',
              count: 513,
            },
          ],
          tagGroupId: 27,
        },
        {
          name: '주차.이동',
          child: [
            {
              id: 49,
              name: '무료주차',
              count: 505,
            },
            {
              id: 52,
              name: '픽업',
              count: 504,
            },
            {
              id: 53,
              name: '공항 셔틀',
              count: 523,
            },
            {
              id: 51,
              name: '셔틀버스',
              count: 518,
            },
            {
              id: 50,
              name: '발렛파킹',
              count: 503,
            },
          ],
          tagGroupId: 13,
        },
        {
          name: '편의',
          child: [
            {
              id: 61,
              name: '짐보관',
              count: 534,
            },
            {
              id: 63,
              name: '개인사물함',
              count: 510,
            },
            {
              id: 62,
              name: '프린터 사용',
              count: 497,
            },
            {
              id: 64,
              name: '장애인편의시설',
              count: 526,
            },
            {
              id: 40,
              name: 'WIFI',
              count: 482,
            },
          ],
          tagGroupId: 12,
        },
        {
          name: '여가.이벤트',
          child: [
            {
              id: 57,
              name: '프로포즈/파티/이벤트',
              count: 501,
            },
            {
              id: 54,
              name: '자전거대여',
              count: 491,
            },
            {
              id: 59,
              name: '마사지',
              count: 482,
            },
            {
              id: 60,
              name: '바/라운지',
              count: 484,
            },
            {
              id: 58,
              name: '캠프파이어',
              count: 506,
            },
            {
              id: 55,
              name: '영화관람',
              count: 514,
            },
            {
              id: 56,
              name: '보드게임',
              count: 509,
            },
          ],
          tagGroupId: 15,
        },
        {
          name: '기타',
          child: [
            {
              id: 44,
              name: '금연',
              count: 496,
            },
            {
              id: 41,
              name: '상비약',
              count: 507,
            },
            {
              id: 45,
              name: '취사가능',
              count: 506,
            },
            {
              id: 43,
              name: '객실내흡연',
              count: 497,
            },
          ],
          tagGroupId: 16,
        },
      ],
      tagGroupId: 3,
    },
    {
      name: '객실 내 시설',
      child: [
        {
          name: '인기',
          child: [
            {
              id: 86,
              name: '개별 수영장',
              count: 515,
            },
            {
              id: 77,
              name: '스파/월풀',
              count: 516,
            },
            {
              id: 67,
              name: '개별/테라스 바베큐',
              count: 559,
            },
            {
              id: 69,
              name: '취사도구',
              count: 578,
            },
          ],
          tagGroupId: 28,
        },
        {
          name: '여가.이벤트',
          child: [
            {
              id: 83,
              name: '파티룸',
              count: 577,
            },
            {
              id: 84,
              name: 'TV',
              count: 530,
            },
            {
              id: 85,
              name: 'VOD',
              count: 560,
            },
          ],
          tagGroupId: 19,
        },
        {
          name: '식사',
          child: [
            {
              id: 65,
              name: '가스레인지/인덕션',
              count: 513,
            },
            {
              id: 70,
              name: '미니바',
              count: 527,
            },
            {
              id: 74,
              name: '커피포트',
              count: 508,
            },
            {
              id: 73,
              name: '전자레인지',
              count: 526,
            },
            {
              id: 72,
              name: '전기밥솥',
              count: 521,
            },
            {
              id: 66,
              name: '냉장고',
              count: 537,
            },
          ],
          tagGroupId: 17,
        },
        {
          name: '욕실',
          child: [
            {
              id: 79,
              name: '욕조',
              count: 531,
            },
            {
              id: 75,
              name: '욕실용품',
              count: 540,
            },
            {
              id: 76,
              name: '드라이기',
              count: 519,
            },
            {
              id: 78,
              name: '타월',
              count: 536,
            },
            {
              id: 80,
              name: '비데',
              count: 560,
            },
          ],
          tagGroupId: 18,
        },
        {
          name: '냉난방',
          child: [
            {
              id: 87,
              name: '에어컨',
              count: 543,
            },
            {
              id: 88,
              name: '벽난로',
              count: 531,
            },
          ],
          tagGroupId: 20,
        },
        {
          name: '기타',
          child: [
            {
              id: 90,
              name: '흡연가능',
              count: 517,
            },
          ],
          tagGroupId: 21,
        },
      ],
      tagGroupId: 4,
    },
  ],
};
