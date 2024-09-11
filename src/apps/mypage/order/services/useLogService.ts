import { AppLogTypes, WebLogTypes } from '@constants/log';
import { tracking } from '@utils/log';
import { createDebug } from '@utils/debug';
import { LogEventTypes, AdditionalInfoUISectionType } from '../constants';

const debug = createDebug('mypage:order');

export const useLogService = () => {
  // 주문 목록 페이지 진입
  const logMyOrderViewOrderList = () => {
    debug.log(LogEventTypes.LogMyOrderViewOrderList);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewOrderList,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  type MyOrderViewOrderDetailParams = {
    order_id: string;
    goods_id: string[];
    goods_name: string[];
    option_id: string[];
    option_quantity: string[];
    total_option_quantity: number;
    form_type: string;
    is_map: boolean;
  };

  // 주문 상세 페이지 진입
  const logMyOrderViewOrderDetail = (parameters: MyOrderViewOrderDetailParams) => {
    debug.log(LogEventTypes.LogMyOrderViewOrderDetail, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewOrderDetail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabMapParams = {
    goods_id: string;
    goods_name: string;
  };

  // 주문 상세 지도 탭 시
  const logMyOrderTabMap = (parameters: MyOrderTabMapParams) => {
    debug.log(LogEventTypes.LogMyOrderTabMap, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabMap,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabAddressCopyParams = {
    goods_id: string;
    goods_name: string;
  };

  // 주문 상세 주소 복사 탭 시
  const logMyOrderTabAddressCopy = (parameters: MyOrderTabAddressCopyParams) => {
    debug.log(LogEventTypes.LogMyOrderTabAddressCopy, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabAddressCopy,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type CompleteRefundOrderParams = {
    order_id: string;
    reason: string;
    reason_code: string;
    order_quantity: number;
  };

  // 주문 취소 완료
  const logMyOrderCompleteRefundOrder = (parameters: CompleteRefundOrderParams) => {
    debug.log(LogEventTypes.LogMyOrderCompleteRefundOrder, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteRefundOrder,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type CompleteCancelOption = {
    order_id: string;
    reason: string;
    reason_code: string;
  };

  // 부분취소 요청 완료 (배송 상품)
  const logMyOrderCompleteCancelOption = (parameters: CompleteCancelOption) => {
    debug.log(LogEventTypes.LogMyOrderCompleteCancelOption, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteCancelOption,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type CompleteCancelTicket = {
    order_id: string;
    reason: string;
    reason_code: string;
  };

  // 부분취소 요청 완료 (티켓 상품)
  const logMyOrderCompleteCancelTicket = (parameters: CompleteCancelTicket) => {
    debug.log(LogEventTypes.LogMyOrderCompleteCancelTicket, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteCancelTicket,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 1:1문의 탭
  const logMyOrderTabQna = () => {
    debug.log(LogEventTypes.LogMyOrderTabQna);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabQna,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  type TabCheckDeliveryParams = {
    order_status: string;
  };

  // 배송조회 탭 시
  const logMyOrderTabCheckDelivery = (parameters: TabCheckDeliveryParams) => {
    debug.log(LogEventTypes.LogMyOrderTabCheckDelivery, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabCheckDelivery,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 문자 재발송 탭
  const logMyOrderTabResendMessage = () => {
    debug.log(LogEventTypes.LogMyOrderTabResendMessage);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabResendMessage,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  type TabFormInsertParams = {
    orderId: string;
    goodsId: number;
    goodsName: string;
    formType: ValueOf<typeof AdditionalInfoUISectionType>;
  };
  // 입력폼 모달 진입 위한 카드 탭 시 (정보 입력 완료 전)
  const logMyOrderTabFormInsert = (params: TabFormInsertParams) => {
    const { orderId, goodsId, goodsName, formType } = params;
    const logParams: {
      order_id: string;
      goods_id: string;
      goods_name: string;
      form_type: ValueOf<typeof AdditionalInfoUISectionType>;
    } = {
      order_id: `${orderId}`,
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      form_type: formType,
    };

    debug.log(LogEventTypes.LogMyOrderTabFormInsert, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabFormInsert,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 숏컷 탭 시
  const logMyOrderTabFormShortcut = () => {
    debug.log(LogEventTypes.LogMyOrderTabFormShortcut);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabFormShortcut,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type TabFormEditParams = {
    orderId: string;
    goodsId: number;
    goodsName: string;
    formType: ValueOf<typeof AdditionalInfoUISectionType>;
    exportId: number | undefined;
  };
  // 정부 수정 위해 카드 탭 시 (정보 입력 완료 이후 확정 전까지)
  const logMyOrderTabFormEdit = (params: TabFormEditParams) => {
    const { orderId, goodsId, goodsName, formType, exportId } = params;
    const logParams: {
      order_id: string;
      goods_id: string;
      goods_name: string;
      form_type: ValueOf<typeof AdditionalInfoUISectionType>;
      export_id: string;
    } = {
      order_id: `${orderId}`,
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      form_type: formType,
      export_id: `${exportId}`,
    };
    debug.log(LogEventTypes.LogMyOrderTabFormEdit, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabFormEdit,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type TabFormReadParams = {
    orderId: string;
    goodsId: number;
    goodsName: string;
    formType: ValueOf<typeof AdditionalInfoUISectionType>;
    exportId: number | undefined;
  };
  // 입력한 정보 확인 위해 모달 진입 위해 카드 탭 시 (확정 이후)
  const logMyOrderTabFormRead = (params: TabFormReadParams) => {
    const { orderId, goodsId, goodsName, formType, exportId } = params;
    const logParams: {
      order_id: string;
      goods_id: string;
      goods_name: string;
      form_type: ValueOf<typeof AdditionalInfoUISectionType>;
      export_id: string;
    } = {
      order_id: `${orderId}`,
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      form_type: formType,
      export_id: `${exportId}`,
    };

    debug.log(LogEventTypes.LogMyOrderTabFormRead, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabFormRead,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type CompleteFormInputParams = {
    orderId: number;
    goodsId: number;
    goodsName: string;
    formType: ValueOf<typeof AdditionalInfoUISectionType>;
    exportId: number | undefined;
  };
  // 모달 내 완료 버튼 탭 시
  const logMyOrderCompleteFormInput = (params: CompleteFormInputParams) => {
    const { orderId, goodsId, goodsName, formType, exportId } = params;
    const logParams: {
      order_id: string;
      goods_id: string;
      goods_name: string;
      form_type: ValueOf<typeof AdditionalInfoUISectionType>;
      export_id: string;
    } = {
      order_id: `${orderId}`,
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      form_type: formType,
      export_id: exportId === -1 ? '' : `${exportId}`,
    };

    debug.log(LogEventTypes.LogMyOrderCompleteFormInput, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteFormInput,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type CompleteSubmitParams = {
    orderId: string;
    goodsId: number | undefined;
    goodsName: string | undefined;
    formType: ValueOf<typeof AdditionalInfoUISectionType>;
  };
  // 확정 btn 탭 시
  const logMyOrderCompleteSubmit = (params: CompleteSubmitParams) => {
    const { orderId, goodsId, goodsName, formType } = params;
    const logParams: {
      order_id: string;
      goods_id: string;
      goods_name: string | undefined;
      form_type: ValueOf<typeof AdditionalInfoUISectionType>;
    } = {
      order_id: `${orderId}`,
      goods_id: `${goodsId}`,
      goods_name: goodsName,
      form_type: formType,
    };

    debug.log(LogEventTypes.LogMyOrderCompleteSubmit, logParams);

    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteSubmit,
      parameters: logParams,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderCancelDetailParams = {
    order_id?: string;
    goods_id: string;
    goods_name: string;
  };

  // 주문 취소 상세 페이지 진입
  const logMyOrderViewOrderCancelDetail = (parameters: MyOrderCancelDetailParams) => {
    debug.log(LogEventTypes.LogMyOrderViewOrderCancelDetail, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewOrderCancelDetail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 주문 취소 상세 환불규정 더보기 탭 시
  const logMyOrderTabCancelPolicyMore = (parameters: MyOrderCancelDetailParams) => {
    debug.log(LogEventTypes.LogMyOrderTabCancelPolicyMore, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabCancelPolicyMore,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabOrderCancelRequestParams = {
    order_id: string;
    goods_id: string;
    goods_name: string;
    booking_date: string;
  };

  // 주문 취소 상세 취소 요청 버튼 탭 시(티켓 상품)
  const logMyOrderTabOrderCancelRequest = (parameters: MyOrderTabOrderCancelRequestParams) => {
    debug.log(LogEventTypes.LogMyOrderTabOrderCancelRequest, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabOrderCancelRequest,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabOrderCancelOptionParams = {
    order_id: string;
  };

  // 주문 취소 상세 취소 요청 버튼 탭 시(배송 상품)
  const logMyOrderTabOrderCancelOption = (parameters: MyOrderTabOrderCancelOptionParams) => {
    debug.log(LogEventTypes.LogMyOrderTabCancelOption, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabCancelOption,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabRefundOrderParams = {
    order_id: string;
  };

  // 배송상품 전체 취소 요청 버튼 탭 시
  const logMyOrderTabRefundOrder = (parameters: MyOrderTabRefundOrderParams) => {
    debug.log(LogEventTypes.LogMyOrderTabRefundOrder, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabRefundOrder,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabReturnOptionParams = {
    order_id: string;
  };

  // 반품 요청 버튼 탭 시
  const logMyOrderTabReturnOption = (parameters: MyOrderTabReturnOptionParams) => {
    debug.log(LogEventTypes.LogMyOrderTabReturnOption, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabReturnOption,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderTabExchangeOptionParams = {
    order_id: string;
  };

  // 교환 요청 버튼 탭 시
  const logMyOrderTabExchangeOption = (parameters: MyOrderTabExchangeOptionParams) => {
    debug.log(LogEventTypes.LogMyOrderTabExchangeOption, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabExchangeOption,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderCompleteReturnOptionParams = {
    order_id: string;
    reason: string;
    reason_code: string;
    order_quantity: number;
  };

  // 반품 요청 완료 시
  const logMyOrderCompleteReturnOption = (parameters: MyOrderCompleteReturnOptionParams) => {
    debug.log(LogEventTypes.LogMyOrderCompleteReturnOption, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteReturnOption,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderCompleteExchangeOptionParams = {
    order_id: string;
    reason: string;
    reason_code: string;
    order_quantity: number;
  };

  // 교환 요청 완료 시
  const logMyOrderCompleteExchangeOption = (parameters: MyOrderCompleteExchangeOptionParams) => {
    debug.log(LogEventTypes.LogMyOrderCompleteExchangeOption, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteExchangeOption,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderCompleteReturnOptionCancelParams = {
    order_id: string;
  };

  // 반품 요청 철회 완료 시
  const logMyOrderCompleteReturnOptionCancel = (parameters: MyOrderCompleteReturnOptionCancelParams) => {
    debug.log(LogEventTypes.LogMyOrderCompleteReturnOptionCancel, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteReturnOptionCancel,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderCompleteExchangeOptionCancelParams = {
    order_id: string;
  };

  // 교환 요청 철회 완료 시
  const logMyOrderCompleteExchangeOptionCancel = (parameters: MyOrderCompleteExchangeOptionCancelParams) => {
    debug.log(LogEventTypes.LogMyOrderCompleteExchangeOptionCancel, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderCompleteExchangeOptionCancel,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderViewReturnOptionCancelDetailParams = {
    order_id: string;
    goods_id: string[];
    goods_name: string[];
    option_id: string[];
    option_quantity: string[];
  };

  // 반품 상세 화면 진입 시
  const LogMyOrderViewReturnOptionDetail = (parameters: MyOrderViewReturnOptionCancelDetailParams) => {
    debug.log(LogEventTypes.LogMyOrderViewReturnOptionDetail, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewReturnOptionDetail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderViewExchangeOptionCancelDetailParams = {
    order_id: string;
    goods_id: string[];
    goods_name: string[];
    option_id: string[];
    option_quantity: string[];
  };

  // 교환 상세 화면 진입 시
  const logMyOrderViewExchangeOptionDetail = (parameters: MyOrderViewExchangeOptionCancelDetailParams) => {
    debug.log(LogEventTypes.logMyOrderViewExchangeOptionDetail, parameters);
    tracking.logEvent({
      name: LogEventTypes.logMyOrderViewExchangeOptionDetail,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderViewReturnOptionRequestParams = {
    order_id: string;
  };

  // 반품 요청 화면 진입 시
  const logMyOrderViewReturnOptionRequest = (parameters: MyOrderViewReturnOptionRequestParams) => {
    debug.log(LogEventTypes.LogMyOrderViewReturnOptionRequest, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewReturnOptionRequest,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderViewExchangeOptionRequestParams = {
    order_id: string;
  };

  // 교환 요청 화면 진입 시
  const logMyOrderViewExchangeOptionRequest = (parameters: MyOrderViewExchangeOptionRequestParams) => {
    debug.log(LogEventTypes.LogMyOrderViewExchangeOptionRequest, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewExchangeOptionRequest,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderViewCancelOptionRequestParams = {
    order_id: string;
  };

  // 부분취소 요청(배송 상품) 화면 진입 시
  const logMyOrderViewCancelOptionRequest = (parameters: MyOrderViewCancelOptionRequestParams) => {
    debug.log(LogEventTypes.LogMyOrderViewCancelOptionRequest, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewCancelOptionRequest,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  type MyOrderViewRefundOrderRequestParams = {
    order_id: string;
  };

  // 부분취소 요청(티켓 상품) 화면 진입 시
  const logMyOrderViewRefundOrderRequest = (parameters: MyOrderViewRefundOrderRequestParams) => {
    debug.log(LogEventTypes.LogMyOrderViewRefundOrderRequest, parameters);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderViewRefundOrderRequest,
      parameters,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  //

  // 티켓 확정 요청 버튼 탭 시
  const logMyOrderTabRequestConfirm = () => {
    debug.log(LogEventTypes.LogMyOrderTabRequestConfirm);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabRequestConfirm,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  // 티켓 날짜 선택 Select 탭 시
  const logMyOrderTabSelectBookingDate = () => {
    debug.log(LogEventTypes.LogMyOrderTabSelectBookingDate);
    tracking.logEvent({
      name: LogEventTypes.LogMyOrderTabSelectBookingDate,
      targets: {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    });
  };

  return {
    logMyOrderViewOrderList,
    logMyOrderViewOrderDetail,
    logMyOrderTabMap,
    logMyOrderTabAddressCopy,
    logMyOrderCompleteRefundOrder,
    logMyOrderCompleteCancelOption,
    logMyOrderCompleteCancelTicket,
    logMyOrderTabQna,
    logMyOrderTabCheckDelivery,
    logMyOrderTabResendMessage,
    logMyOrderTabFormInsert,
    logMyOrderTabFormShortcut,
    logMyOrderTabFormEdit,
    logMyOrderTabFormRead,
    logMyOrderCompleteFormInput,
    logMyOrderCompleteSubmit,
    logMyOrderViewOrderCancelDetail,
    logMyOrderTabCancelPolicyMore,
    logMyOrderTabOrderCancelRequest,
    logMyOrderTabOrderCancelOption,
    logMyOrderTabRefundOrder,
    logMyOrderTabReturnOption,
    logMyOrderTabExchangeOption,
    logMyOrderCompleteReturnOption,
    logMyOrderCompleteExchangeOption,
    logMyOrderCompleteReturnOptionCancel,
    logMyOrderCompleteExchangeOptionCancel,
    LogMyOrderViewReturnOptionDetail,
    logMyOrderViewExchangeOptionDetail,
    logMyOrderViewReturnOptionRequest,
    logMyOrderViewExchangeOptionRequest,
    logMyOrderViewCancelOptionRequest,
    logMyOrderViewRefundOrderRequest,
    logMyOrderTabRequestConfirm,
    logMyOrderTabSelectBookingDate,
  };
};
