export const LogEventTypes = {
  // 콘텐츠 진입
  LogContentInit: 'contents.view_contents_detail',
  // 댓글 버튼 클릭
  LogContentTabComment: 'contents.tab_comment',
  // 헤더탑바 쇼룸 클릭
  LogShowroomTab: 'contents.tab_showroom_on_topbar',
  // 콘텐츠 진입 쇼룸팔로우스낵바 노출
  LogShowroomSnackbarInit: 'contents.impression_snackbar',
  // 콘텐츠 쇼룸팔로우스낵바 팔로우 완료
  LogShowroomSnackbarFollow: 'contents.complete_snackbar_follow',
  // 콘텐츠 진입 라이브 배너 영역 노출
  LogContentLiveBannerInit: 'contents.impression_live_banner',
  // 콘텐츠 라이브 바로가기 탭
  logContentLiveBannerTab: 'contents.tab_live_banner',
  // 헤더 노출
  LogPresetHeaderInit: 'contents.impression_component_header',
  // 미디어 노출
  LogPresetMediaInit: 'contents.impression_component_interactive_media',
  // 미디어뷰어 노출
  LogPresetMediaViewerInit: 'contents.impression_component_media_viewer',
  // 미디어뷰어 슬라이드 노출
  LogPresetMediaViewerSlide: 'contents.impression_component_media_viewer_media',
  // 미디어뷰어 내 동영상 재생 조회
  LogPresetMediaViewerVideoView: 'contents.view_component_media_viewer_media',
  // 미디어뷰어 탭
  LogPresetMediaViewerTab: 'contents.tab_component_media_viewer_image',
  // 미디어뷰어 음소거시
  LogPresetMediaViewerMuteOn: 'contents.tab_component_media_viewer_mute_on',
  // 미디어뷰어 음소거해제시
  LogPresetMediaViewerMuteOff: 'contents.tab_component_media_viewer_mute_off',
  // 네비게이션 노출
  LogPresetNavigationInit: 'contents.impression_component_navigation',
  // 네비게이션 탭
  LogPresetNavigationTab: 'contents.tab_component_navigation_tab',
  // 텍스트 노출
  LogPresetTextInit: 'contents.impression_component_text',
  // 텍스트 음소거시
  LogPresetTextMuteOn: 'contents.tab_component_text_mute_on',
  // 텍스트 음소거해제시
  LogPresetTextMuteOff: 'contents.tab_component_text_mute_off',
  // 라이브 노출
  LogPresetLiveInit: 'contents.impression_component_live',
  // 라이브 팔로우 완료
  LogPresetLiveFollow: 'contents.complete_component_live_follow',
  // 라이브 팔로우 취소
  LogPresetLiveUnFollow: 'contents.complete_component_live_unfollow',
  // 상품 노출
  LogPresetDealInit: 'contents.impression_component_goods',
  // 상품 섬네일 노출
  LogPresetDealGoodsInit: 'contents.impression_component_goods_goods_thumbnail',
  // 상품 섬네일 탭
  LogPresetDealGoodsTab: 'contents.tab_component_goods_goods_thumbnail',
  // 이미지 뷰어 노출
  LogPresetImageViewerInit: 'contents.impression_component_image',
  // 이미지 뷰어 탭
  LogPresetImageViewerTab: 'contents.tab_component_image',
  // cta 노출
  LogPresetCTAInit: 'contents.impression_component_button',
  // cta 탭
  LogPresetCTATab: 'contents.tab_component_button',
  // 쿠폰다운 노출
  LogPresetCouponDownInit: 'contents.impression_component_coupon',
  // 쿠폰다운 성공시
  LogPresetCouponDownComplete: 'contents.complete_component_coupon_download',
  // 응모 노출
  LogPresetDrawInit: 'contents.impression_component_raffle',
  // 응모 상세 모달뷰 노출
  LogPresetDrawDetailInit: 'contents.view_component_raffle_detail',
  // 응모 완료
  LogPresetDrawComplete: 'contents.complete_component_raffle',
  // footer 노출
  LogPresetFooterInit: 'contents.impression_component_footer',
  // footer 프로필 탭
  LogPresetFooterProfileTab: 'contetns.tab_component_footer_showroom_thumbnail',
  // 플레이뷰어 노출
  LogPresetPlayViewerInit: 'contents.impression_component_play_viewer',
  // Reply 진입
  LogPresetReplyInit: 'contents.view_comment',
  // 투표 노출
  LogPresetVoteInit: 'contents.impression_component_vote',
  // 투표 성공시
  LogPresetVoteComplete: 'contents.complete_component_vote',
  // 투표 인증서 보기 버튼 탭
  LogPresetVoteCertificationButtonTab: 'contents.tab_vote_certificate',
  // 배너  노출
  LogPresetBannerInit: 'contents.impression_component_banner',
  // 배너 탭
  LogPresetBannerTab: 'contents.tab_component_banner',
  // 혜택 상품 노출
  LogPresetBenefitGoodsInit: 'contents.impression_component_benefit_goods',
  // 혜택 리스트 노출
  LogPresetBenefitListInit: 'contents.impression_component_benefit_list',
  // 임베드 비디오 노출
  LogPresetEmbedVideoInit: 'contents.impression_component_embed',
  // 배너 탭
  LogPresetEmbedVideoTab: 'contents.tab_component_embed',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;

export const LogEventWebFacebookTypes = {
  LogContentInit: 'ViewContent',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventWebFacebookTypes = typeof LogEventWebFacebookTypes[keyof typeof LogEventWebFacebookTypes];
