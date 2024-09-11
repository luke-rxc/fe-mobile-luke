export const LogEventTypes = {
  // 주문목록 페이지 진입 시
  LogMyOrderViewOrderList: 'my_order.view_order_list',

  // 주문상세 페이지 진입 시
  LogMyOrderViewOrderDetail: 'my_order.view_order_detail',

  // 주문상세 지도 탭 시
  LogMyOrderTabMap: 'my_order.tab_map',

  // 주문상세 주소 복사 탭 시
  LogMyOrderTabAddressCopy: 'my_order.tab_address_copy',

  // 주문 취소 완료 시
  LogMyOrderCompleteRefundOrder: 'my_order.complete_refund_order',

  // 부분취소 요청 완료 시 (배송 상품)
  LogMyOrderCompleteCancelOption: 'my_order.complete_cancel_option',

  // 부분취소 요청 완료 시 (티켓 상품)
  LogMyOrderCompleteCancelTicket: 'my_order.complete_cancel_ticket',

  // 1:1문의 탭 시
  LogMyOrderTabQna: 'my_order.tab_qna',

  // 배송조회 탭 시
  LogMyOrderTabCheckDelivery: 'my_order.tab_check_delivery',

  // 문자 재발송 탭 시
  LogMyOrderTabResendMessage: 'my_order.tab_resend_message',

  // 입력폼 모달 진입 위해 카드 탭 시 (정보 입력 완료 전까지)
  LogMyOrderTabFormInsert: 'my_order.tab_form_insert',

  // 숏컷 탭 시
  LogMyOrderTabFormShortcut: 'my_order.tab_form.shortcut',

  // 정부 수정 위해 카드 탭 시 (정보 입력 완료 이후 확정 전까지)
  LogMyOrderTabFormEdit: 'my_order.tab_form_edit',

  // 입력한 정보 확인 위해 모달 진입 위해 카드 탭 시 (확정 이후)
  LogMyOrderTabFormRead: 'my_order.tab_form_read',

  // 모달 내 완료 버튼 탭 시
  LogMyOrderCompleteFormInput: 'my_order.complete_form_input',

  // 확정 btn 탭 시
  LogMyOrderCompleteSubmit: 'my_order.complete_submit',

  // 주문 취소 상세 진입 시
  LogMyOrderViewOrderCancelDetail: 'my_order.view_order_cancel_detail',

  // 주문 취소 상세 취소환불 규정 더보기
  LogMyOrderTabCancelPolicyMore: 'my_order.tab_cancel_policy_more',

  // 주문 취소 상세 취소요청 버튼 탭 시
  LogMyOrderTabOrderCancelRequest: 'my_order.tab_order_cancel_request',

  // 배송상품 부분 취소 요청 버튼 탭 시
  LogMyOrderTabCancelOption: 'my_order.tab_cancel_option',

  // 배송상품 전체 취소 요청 버튼 탭 시
  LogMyOrderTabRefundOrder: 'my_order.tab_refund_order',

  // 반품 요청 버튼 탭 시
  LogMyOrderTabReturnOption: 'my_order.tab_return_option',

  // 교환 요청 버튼 탭 시
  LogMyOrderTabExchangeOption: 'my_order.tab_exchange_option',

  // 반품 요청 완료 시
  LogMyOrderCompleteReturnOption: 'my_order.complete_return_option',

  // 교환 요청 완료 시
  LogMyOrderCompleteExchangeOption: 'my_order.complete_exchange_option',

  // 반품 요청 철회 완료 시
  LogMyOrderCompleteReturnOptionCancel: 'my_order.complete_return_option_cancel',

  // 교환 요청 철회 완료 시
  LogMyOrderCompleteExchangeOptionCancel: 'my_order.complete_exchange_option_cancel',

  // 반품 상세 화면 진입 시
  LogMyOrderViewReturnOptionDetail: 'my_order.view_return_option_detail',

  // 교환 상세 화면 진입 시
  logMyOrderViewExchangeOptionDetail: 'my_order.view_exchange_option_detail',

  // 반품 요청 화면 진입 시
  LogMyOrderViewReturnOptionRequest: 'my_order.view_return_option_request',

  // 교환 요청 화면 진입 시
  LogMyOrderViewExchangeOptionRequest: 'my_order.view_exchange_option_request',

  // 부분취소 요청 화면 진입 시 (배송 상품)
  LogMyOrderViewCancelOptionRequest: 'my_order.view_cancel_option_request',

  // 전체취소 요청 화면 진입 시 (배송 상품)
  LogMyOrderViewRefundOrderRequest: 'my_order.view_refund_order_request',

  // 티켓 확정 요청 버튼 탭 시
  LogMyOrderTabRequestConfirm: 'my_order.tab_request_confirm',

  // 티켓 날짜 선택 Select 탭 시
  LogMyOrderTabSelectBookingDate: 'my_order.tab_select_booking_date',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
