export const LogEventTypes = {
  // 배송지 관리 페이지 진입 시
  LogViewDelivery: 'my_delivery.view_delivery',
  // 배송지 등록 완료 시
  LogAddShippingAddress: 'my_delivery.add_shipping_address',
  // 배송지 수정 완료 시
  LogEditShippingAddress: 'my_delivery.edit_shipping_address',
  // 기본 배송지 설정 완료 시
  LogEditDefault: 'my_delivery.edit_default',
  // 배송지 삭제 완료 시
  LogRemoveShippingAddress: 'my_delivery.remove_shipping_address',
  // 주문 배송지 변경 완료 시
  LogEditOrderShippingAddress: 'my_order.edit_shipping_address',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = typeof LogEventTypes[keyof typeof LogEventTypes];
