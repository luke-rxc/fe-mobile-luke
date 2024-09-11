import { InformationListSchema } from '../../schemas';
import { GoodsInformationParam, getGoodsInformation } from '..';

export const goodsInformationTicketSchemaMock: InformationListSchema = {
  kind: 'TICKET_NORMAL',
  information: [
    { id: 208123, title: '발행자', contents: 'RXC' },
    {
      id: 208124,
      title: '유효기간, 이용조건',
      contents:
        '- 투숙일 지정기한 : 2022년 8월 23일(화) – 2022년 8월 30일(화)\n- 핸드폰 번호를 잘못 기입하거나 소비자 과실로 타인에게 메시지 전송 또는 노출되어 사용한 경우, 본 회사에서는 어떠한 책임도 지지 않으며 취소 및 환불이 불가합니다.\n- 상품을 구매하신 고객님들께서 이용일을 선착순으로 지정하고 있기 때문에 객실 현황은 실시간으로 달라질 수 있습니다.',
    },
    { id: 208125, title: '이용 가능 매장', contents: '파라스파라' },
    {
      id: 208126,
      title: '환불조건 및 방법',
      contents:
        '취소 수수료\n\n- 해당 상품은 특별 조건으로 구성된 한정 수량 상품으로, 특별 약관이 적용됩니다.\n\n투숙일 지정 고객 투숙일 변경 / 취소 / 환불\n\n- 구매 기간(8월 23일(화) - 8월 30일(화)): 무료 변경/취소/환불 가능(100% 환불)\n\n※ 투숙일 기준 1일 전까지 예약 필수입니다. (단, 당일 예약 불가)\n※ 투숙일 및 예약자명 변경을 원하시는 고객은 취소 후 재구매 하시기 바랍니다.\n※ 구매 기간(8월 23일(화) - 8월 30일(화)) 경과 후, 투숙일 및 예약자명 변경은 불가합니다.\n\n예약 변경 및 취소 안내\n\n- 예약 변경은 올마이투어 고객센터(1688-8376) 또는 프리즘 마이페이지 > 주문목록 > 1:1 문의하기로 남겨주세요.\n\n※ 올마이투어 고객센터 운영 시간 외 예약 문의는 PRIZM 1:1 문의하기를 통해 남겨주시면 순차적으로 연락드리겠습니다.\n※ 변경/취소 확정 알림톡을 수신하셔야 정상적으로 변경/취소가 완료된 것이므로 수신하지 못하신 고객은 반드시 올마이투어 고객센터(1688-8376)를 통해 확인해 주시기 바랍니다.\n※ 고객센터 운영 종료인 오후 4시 30분 이후 접수 건은 익일 업무 재개 시 순차적으로 처리됩니다. (주말 접수/주말 처리 불가)',
    },
    { id: 208127, title: '소비자상담 관련 전화번호', contents: '올마이투어 1688-8376' },
  ],
  providerInfo: {
    name: '주식회사 정상북한산리조트',
    businessNumber: '000-00-00000',
    mailOrderSalesNumber: '1111-테스트-11111',
    presidentName: '박상천',
    address: '(47718) 부산 동래구 쇠미로 222-13 5층(온천동)',
    email: 'rxc@rxc.co.kr',
  },
};

export const goodsInformationTicketMockApi = ({
  goodsId, // eslint-disable-line @typescript-eslint/no-unused-vars
}: GoodsInformationParam): ReturnType<typeof getGoodsInformation> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(goodsInformationTicketSchemaMock);
    }, 1000);
  });
