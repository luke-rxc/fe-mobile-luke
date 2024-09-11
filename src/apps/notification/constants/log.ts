export const LogEventTypes = {
  // 알림피드 방문
  LogViewNotificationFeed: 'noti.view_notification_feed',
  // 알림피드 메시지 클릭
  LogTabMessages: 'noti.tab_messages',
  // 알림피드 메시지 내 프로필 영역 클릭
  LogTabProfileImage: 'noti.tab_profile_image',
  // 최근 본 상품 클릭
  LogTabRecentGoods: 'noti.tab_recent_goods',
  // 캠페인 메세지 알림피드 내 노출 시
  LogImpressionCampaignMessage: 'noti.impression_campaign_message',
  // 캠페인 메세지 알림피드 내 클릭 시
  LogTabCampaignMessage: 'noti.tab_campaign_message',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
