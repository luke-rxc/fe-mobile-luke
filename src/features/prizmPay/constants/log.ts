export const LogEventTypes = {
  // 결제수단 관리 페이지 진입 시
  LogViewPrizmPay: 'my_pay.view_prizm_pay',
  // 카드 등록 완료 시
  LogAddPrizmPay: 'my_pay.add_prizm_pay',
  // 카드 별칭 수정 완료 시
  LogEditCardAlias: 'my_pay.edit_card_alias',
  // 기본카드 설정 완료 시
  LogEditDefault: 'my_pay.edit_default',
  // 카드 삭제 완료 시
  LogRemovePrizmPay: 'my_pay.remove_prizm_pay',
  // 카드스캔 버튼 탭 시
  LogTabScanCard: 'my_pay.tab.scan_card',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = typeof LogEventTypes[keyof typeof LogEventTypes];
