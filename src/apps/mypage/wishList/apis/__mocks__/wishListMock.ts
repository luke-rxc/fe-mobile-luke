import { WishListSchema } from '../../schemas';
import { getWishList, GetWishListParam } from '..';

const wishListData: WishListSchema['content'] = [
  {
    id: 22556,
    brand: {
      id: 21287,
      name: '엘레나',
      primaryImage: {
        id: 50816,
        path: 'brand/20220712/c69c654a-035c-4bbd-b65a-07e884867e04.svg',
        blurHash: null,
        width: 19,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22646,
      name: 'Striped wide long sleeve crop top',
      primaryImage: {
        id: 50897,
        path: 'goods/20220713/31226be0-6cd3-41b6-bb42-223449183992.jpg',
        blurHash:
          '|KD,cE%2}@NZRQa_RjoMkCVYR%k9n,ShofR*j?s.m.RkbuoyS1n$WBayofIUsmo|oMi{S2ofWBoJX7W;n+niV@a{ofkCbat7oMaeR%aybboyoLWCjYjYWCflX8kCoLaeoLbvWqaLj?oyjZWBf6aynijZW;f+a#WBjZbakB',
        width: 462,
        height: 669,
        fileType: 'IMAGE',
      },
      consumerPrice: 2000,
      price: 100,
      discountRate: 95,
      showRoomId: 0,
      code: 'jk2y0',
      label: null,
      isPrizmOnly: false,
      isCartAddable: false,
      hasCoupon: true,
      isRunOut: false,
      benefitLabel: '단독구성',
    },
  },
  {
    id: 22555,
    brand: {
      id: 21238,
      name: '센템',
      primaryImage: {
        id: 28442,
        path: 'brand/20220225/af5c17cb-5444-478d-94ba-86fbf02d5d77.svg',
        blurHash: null,
        width: 58,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 21946,
      name: '오늘머그',
      primaryImage: {
        id: 28353,
        path: 'goods/20220225/882256dd-2724-4ddb-9521-ee9a86539c6a.jpeg',
        blurHash:
          '|HR3Wgoz?w%NMwj?bbxuj[pIWBiwspbvW;jFjZWV-qofM_Rjt7s;j@bGay-CoMOWNZrssCbbW:oLtSofaJaebckCjFaxkCX7WBs;ofWUa{ayj]jZWAWBogt7f5WBbHayfkozj[oLoLkCbHayjaayt7ayWAWVj[a|j[oMae',
        width: 1000,
        height: 1000,
        fileType: 'IMAGE',
      },
      consumerPrice: 12500,
      price: 12500,
      discountRate: 0,
      showRoomId: 0,
      code: 'ixgy0',
      label: null,
      isPrizmOnly: true,
      isCartAddable: true,
      hasCoupon: true,
      isRunOut: false,
      benefitLabel: '',
    },
  },
  {
    id: 22554,
    brand: {
      id: 21283,
      name: 'check-in',
      primaryImage: {
        id: 50638,
        path: 'brand/20220701/e9103385-2c2c-4c7d-88c9-8d6a0a6b390c.svg',
        blurHash: null,
        width: 61,
        height: 18,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22702,
      name: '유효기간티켓',
      primaryImage: {
        id: 320647,
        path: 'goods/20220922/615c6dbd-a3e9-4e77-b221-0a4a1943671b.jpeg',
        blurHash:
          '|xCjz=WBWBayayjuaej[f6.TWBWBj@j[fPj[ayj[%hj[aza#ayj[ayj[ayWZofkCj[j[fQofayj[NGt6j]j[fRj[j[j[azM{ofofj[j[j[j[azj[Rjj?ayfQj[jtj[aza}a~WBaxjsayj[ayfjj[kDWUaxf6f6ayj@ayay',
        width: 960,
        height: 859,
        fileType: 'IMAGE',
      },
      consumerPrice: 100000,
      price: 90000,
      discountRate: 10,
      showRoomId: 0,
      code: 'jloy0',
      label: null,
      isPrizmOnly: false,
      isCartAddable: false,
      hasCoupon: false,
      isRunOut: true,
      benefitLabel: '',
    },
  },
  {
    id: 22553,
    brand: {
      id: 21260,
      name: '조선팰리스 ',
      primaryImage: {
        id: 49293,
        path: 'brand/20220418/f304c55e-c747-479a-a5d9-2d289ba93549.svg',
        blurHash: null,
        width: 142,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22730,
      name: '제제 테스트_날짜미지정(비연동/취소가능)',
      primaryImage: {
        id: 320830,
        path: 'goods/20221013/886d2495-fb38-4c02-ab1a-35b4e3599d8e.jpeg',
        blurHash:
          '|0Jkl#~qfQ~qfQ~qfQ~qfQ~qj[fQj[fQj[fQj[fQfQfQfQfQfQfQfQfQfQ~qj[fQj[fQj[fQj[fQfQfQfQfQfQfQfQfQfQ~qj[fQj[fQj[fQj[fQfQfQfQfQfQfQfQfQfQ~qj[fQj[fQj[fQj[fQfQfQfQfQfQfQfQfQfQ',
        width: 1000,
        height: 1000,
        fileType: 'IMAGE',
      },
      consumerPrice: 1000,
      price: 100,
      discountRate: 90,
      showRoomId: 0,
      code: 'jmiy0',
      label: null,
      isPrizmOnly: false,
      isCartAddable: false,
      hasCoupon: false,
      isRunOut: false,
      benefitLabel: '',
    },
  },
  {
    id: 22552,
    brand: {
      id: 21291,
      name: '콘텐츠 더보기',
      primaryImage: {
        id: 51454,
        path: 'brand/20220804/126c3087-87d8-47f8-9740-1c20b6848285.svg',
        blurHash: null,
        width: 88,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22713,
      name: '재고 테스트',
      primaryImage: {
        id: 320710,
        path: 'goods/20220930/f4b4ca9f-6e3a-4db4-94f1-00461e53ac87.png',
        blurHash:
          '|B97U]DiD*-;ITogR*oKWB4n%MWCIU-:aeayWVof4oog%Lf6WDs:j@WCof~pIUt7%MD*RkofoeRjD%xuM}M{xtRjt6ofWVWAt7WBWBt7xtRkkCof%MRjt6t7WXfPR*RjjZRkWBWBf6RkWBoIf6ofV@xuWCWAt7j[j[t7WX',
        width: 640,
        height: 640,
        fileType: 'IMAGE',
      },
      consumerPrice: 5500,
      price: 100,
      discountRate: 98,
      showRoomId: 0,
      code: 'jm1y0',
      label: null,
      isPrizmOnly: false,
      isCartAddable: true,
      hasCoupon: true,
      isRunOut: false,
      benefitLabel: '',
    },
  },
  {
    id: 22551,
    brand: {
      id: 21255,
      name: '반데르피게',
      primaryImage: {
        id: 47022,
        path: 'brand/20220315/77e95ecf-257c-4277-af4d-a60d3adb6435.svg',
        blurHash: null,
        width: 124,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22289,
      name: 'MSM 안티 댄드러프 샴푸 250ml MSM 안티 댄드러프 샴푸 250ml',
      primaryImage: {
        id: 47328,
        path: 'goods/20220315/32e3e23a-8f04-4543-a66f-2749f8526c6a.jpeg',
        blurHash:
          '|DS$ow%M~pt74o-;-;n~M{x]ayjYofbIWBj?ofay%2ayM{j]xtWBRkofof-;j[M|azxaoLWBa#a|xtfPM|j[t7axR*kCj[ozfRxaj?Rka}ofjZazRkayt6oLWCWCj?oLj[t8j[s:f6WBj[j[ayj[t7fQRka|ofjsWBfka}',
        width: 512,
        height: 512,
        fileType: 'IMAGE',
      },
      consumerPrice: 109000,
      price: 109000,
      discountRate: 0,
      showRoomId: 21255,
      code: 'j9jyid5',
      label: null,
      isPrizmOnly: true,
      isCartAddable: false,
      hasCoupon: true,
      isRunOut: false,
      benefitLabel: '단독구성',
    },
  },
  {
    id: 22550,
    brand: {
      id: 21204,
      name: '스티키몬스터랩',
      primaryImage: {
        id: 24842,
        path: 'brand/20220222/e2f125dc-9bae-42e6-9a73-c6fb31bc863c.svg',
        blurHash: null,
        width: 58,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22588,
      name: "[특문테스트] '라'이프시리즈 라이트 매트리스 내추럴_copy",
      primaryImage: {
        id: 29616,
        path: 'goods/20220228/a9850af1-f874-4d17-a50a-42e6eaae94e2.jpg',
        blurHash:
          '|AS?DV%M-;%Mxu%MkC%MWB-;ayaxj[ayj[ayj[fQ~qWBIAofM{j[axayofs.oeofayofayofa|fQ4nj[%Mayxuayj[j[WB?bWBV@oeWAoeWBj[ay?bf7M{j[Rjayj[ayofoJofofayofayofazj[IUayxajtofj[ayj[WB',
        width: 512,
        height: 512,
        fileType: 'IMAGE',
      },
      consumerPrice: 450000,
      price: 450000,
      discountRate: 0,
      showRoomId: 0,
      code: 'jicy0',
      label: null,
      isPrizmOnly: true,
      isCartAddable: true,
      hasCoupon: false,
      isRunOut: false,
      benefitLabel: '단독구성',
    },
  },
  {
    id: 22549,
    brand: {
      id: 21282,
      name: '베네핏',
      primaryImage: {
        id: 50637,
        path: 'brand/20220701/994e2e71-8c31-4df7-b5af-1708b4b43d7b.svg',
        blurHash: null,
        width: 53,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22706,
      name: '러시아 항공권',
      primaryImage: {
        id: 320697,
        path: 'goods/20220929/561d76a5-7149-46f4-8a5f-80a42424ee87.jpg',
        blurHash:
          '|LHWo:ys22VEo}Xniwt7of$jEjO?+tt7T0RjjFof1QRQ=^s,Vrozt7jFSOY6+[rXF|RQW=ofjEShTdi^ivtms:M{jFofShXTS4V@bcX9v}xDkWSOxFozniRjbvwbNyS5slX8j[smW;oen$OFe.nhS4aea}S#jFsmoyjZnO',
        width: 1420,
        height: 1320,
        fileType: 'IMAGE',
      },
      consumerPrice: 15000,
      price: 10000,
      discountRate: 33,
      showRoomId: 0,
      code: 'jlsy0',
      label: null,
      isPrizmOnly: true,
      isCartAddable: false,
      hasCoupon: false,
      isRunOut: false,
      benefitLabel: '',
    },
  },
  {
    id: 22531,
    brand: {
      id: 21247,
      name: '벨레',
      primaryImage: {
        id: 35872,
        path: 'brand/20220308/ba212888-e549-40b9-add2-7cc43c1fdc0a.svg',
        blurHash: null,
        width: 53,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22318,
      name: '성인인증 테스트 상품 ',
      primaryImage: {
        id: 34999,
        path: 'goods/20220307/cbfde746-d140-4527-bdba-88014ca9cda7.jpeg',
        blurHash:
          '|CQvtJ4n-=?vjtofj[%MWB~qM{t8t8RjRjoft6j[-;t7M{RjRiWBayofofxut7M{V@t7fkRjWBofkDR*oKaet7ogRjRkj[%Mt7WBayWAofj[fkWVt7WBRjRkfRf6t7ofj[xua|RjV@s;t7jsofazt7ofWBV@j[t7WBRjjs',
        width: 512,
        height: 512,
        fileType: 'IMAGE',
      },
      consumerPrice: 11000,
      price: 9300,
      discountRate: 15,
      showRoomId: 0,
      code: 'jaey0',
      label: null,
      isPrizmOnly: false,
      isCartAddable: true,
      hasCoupon: false,
      isRunOut: false,
      benefitLabel: '',
    },
  },
  {
    id: 22555,
    brand: {
      id: 21238,
      name: '센템',
      primaryImage: {
        id: 28442,
        path: 'brand/20220225/af5c17cb-5444-478d-94ba-86fbf02d5d77.svg',
        blurHash: null,
        width: 58,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 21946,
      name: '오늘머그',
      primaryImage: {
        id: 28353,
        path: 'goods/20220225/882256dd-2724-4ddb-9521-ee9a86539c6a.jpeg',
        blurHash:
          '|HR3Wgoz?w%NMwj?bbxuj[pIWBiwspbvW;jFjZWV-qofM_Rjt7s;j@bGay-CoMOWNZrssCbbW:oLtSofaJaebckCjFaxkCX7WBs;ofWUa{ayj]jZWAWBogt7f5WBbHayfkozj[oLoLkCbHayjaayt7ayWAWVj[a|j[oMae',
        width: 1000,
        height: 1000,
        fileType: 'IMAGE',
      },
      consumerPrice: 12500,
      price: 12500,
      discountRate: 0,
      showRoomId: 0,
      code: 'ixgy0',
      label: null,
      isPrizmOnly: true,
      isCartAddable: true,
      hasCoupon: false,
      isRunOut: false,
      benefitLabel: '',
    },
  },
  {
    id: 22552,
    brand: {
      id: 21291,
      name: '콘텐츠 더보기',
      primaryImage: {
        id: 51454,
        path: 'brand/20220804/126c3087-87d8-47f8-9740-1c20b6848285.svg',
        blurHash: null,
        width: 88,
        height: 24,
        fileType: 'IMAGE',
      },
      defaultShowRoomId: null,
    },
    goods: {
      id: 22713,
      name: '재고 테스트',
      primaryImage: {
        id: 320710,
        path: 'goods/20220930/f4b4ca9f-6e3a-4db4-94f1-00461e53ac87.png',
        blurHash:
          '|B97U]DiD*-;ITogR*oKWB4n%MWCIU-:aeayWVof4oog%Lf6WDs:j@WCof~pIUt7%MD*RkofoeRjD%xuM}M{xtRjt6ofWVWAt7WBWBt7xtRkkCof%MRjt6t7WXfPR*RjjZRkWBWBf6RkWBoIf6ofV@xuWCWAt7j[j[t7WX',
        width: 640,
        height: 640,
        fileType: 'IMAGE',
      },
      consumerPrice: 5500,
      price: 100,
      discountRate: 98,
      showRoomId: 0,
      code: 'jm1y0',
      label: null,
      isPrizmOnly: false,
      isCartAddable: true,
      hasCoupon: true,
      isRunOut: false,
      benefitLabel: '',
    },
  },
];

export const wishListMock: WishListSchema = {
  metadata: null,
  content: [],
  nextParameter: null,
};

let count = 0;
const createWishMock = ({ nextParameter = '', size = 20 }: GetWishListParam) => {
  count += 1;
  const content = Array(size)
    .fill(null)
    .map((_, index) => {
      if (index > 9) {
        return {
          ...wishListData[index - 10],
          goods: {
            ...wishListData[index - 10].goods,
            code: index + 1 + count * size,
            id: index + 1 + count * size,
          },
        };
      }
      return {
        ...wishListData[index],
        goods: {
          ...wishListData[index].goods,
          code: index + 1 + count * size,
          id: index + 1 + count * size,
        },
      };
    });
  return {
    ...wishListMock,
    content,
    nextParameter,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const wishListMockApi = ({ nextParameter = '', size }: GetWishListParam): ReturnType<typeof getWishList> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(createWishMock({ nextParameter, size }) as any);
    }, 1000);
  });
