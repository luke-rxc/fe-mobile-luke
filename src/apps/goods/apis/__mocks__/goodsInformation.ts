import { InformationListSchema } from '../../schemas';
import { GoodsInformationParam, getGoodsInformation } from '..';

export const goodsInformationSchemaMock: InformationListSchema = {
  kind: 'REAL',
  information: [
    {
      id: 184837,
      title: '용량 및 중량',
      contents: '50ml',
    },
    {
      id: 184838,
      title: '제품 주요 사양',
      contents: '모든 피부 타입',
    },
    {
      id: 184839,
      title: '사용기한 또는 개봉 후 사용기간',
      contents: '제조일로부터 30개월, 개봉 후 6개월 이내',
    },
    {
      id: 184840,
      title: '사용방법',
      contents: '스킨케어 마지막 단계에서 자외선에 노출되기 쉬운 얼굴, 목 등에 고르게 펴 발라 줍니다. ',
    },
    {
      id: 184841,
      title: '제조자 및 제조판매업자',
      contents: '한국콜마㈜ / ㈜원씽',
    },
    {
      id: 184842,
      title: '제조국',
      contents: '대한민국',
    },
    {
      id: 184843,
      title: '주요성분',
      contents:
        '정제수, 징크옥사이드, 프로필헵틸카프릴레이트, 부틸옥틸살리실레이트, 부틸렌글라이콜다이카프릴레이트/다이카프레이트, 티타늄디옥사이드, 다이카프릴릴에터, 카프릴릴메티콘, 프로판다이올, 폴리글리세릴-4다이아이소스테아레이트/폴리하이드록시스테아레이트/세바케이트, 병풀추출물(20,000ppm), 부틸렌글라이콜, 트라이메틸실록시실리케이트, 소듐하이알루로네이트, 다이스테아다이모늄헥토라이트, 마그네슘설페이트, 스테아릭애씨드, 알루미늄하이드록사이드, 트라이에톡시카프릴릴실레인, 폴리글리세릴-3폴리다이메틸실록시에틸다이메티콘, 1,2-헥산다이올, 폴리메틸실세스퀴옥세인, 글리세릴카프릴레이트, 카프릴릴글라이콜, 에틸헥실글리세린',
    },
    {
      id: 184844,
      title: '기능성 화장품의 경우 화장품법에 따른 식품의약품안전청 심사 필 유무',
      contents: '자외선차단 (SPF50+ PA++++)',
    },
    {
      id: 184845,
      title: '사용 시 주의사항',
      contents:
        '1) 화장품 사용 시 또는 사용 후 직사광선에 의하여 사용부위가 붉은 반점,부어오름 또는 가려움증 등의 이상 증상이나 부작용이 있는 경우 \n전문의 등과 상담할 것 2) 상처가 있는 부위 등에는 사용을 자제할 것 3) 보관 및 취급 시의 주의사항 가)어린이의 손이 닿지 않는 곳에 보관할 것  \n나)직사광선을 피해서 보관할 것 4) 눈 주위를 피하여 사용할 것',
    },
    {
      id: 184846,
      title: '품질보증기준',
      contents: '본 상품에 이상이 있을 경우, 공정거래위원회 고시 "소비자 분쟁 해결기준"에 의해 보상해 드립니다.',
    },
    {
      id: 184847,
      title: '소비자상담관련 전화번호',
      contents: '070-7517-9980',
    },
  ],
  providerInfo: {
    name: '(주)원씽',
    businessNumber: '298-88-02073',
    mailOrderSalesNumber: '2022-고양일산동-0354',
    presidentName: '배우주, 최유미',
    address: '(10403) 경기 고양시 일산동구 백마로 195 14층 14002호',
    email: 'test@test.com',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const goodsInformationMockApi = ({ goodsId }: GoodsInformationParam): ReturnType<typeof getGoodsInformation> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(goodsInformationSchemaMock);
    }, 1000);
  });
