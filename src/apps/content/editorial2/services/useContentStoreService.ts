import { useWebInterface } from '@hooks/useWebInterface';
import { FloatingStatusType } from '../constants';
import { ContentInfoState, ContentShowroomState, useContentStore } from '../stores';

/**
 * 콘텐츠에서 전역적으로 상태값 업데이트 처리
 * @returns
 */
export const useContentStoreService = () => {
  const { signIn } = useWebInterface();
  const setFloatingState = useContentStore.use.setFloatingState();
  const setLoginState = useContentStore.use.setLoginState();
  const setFollowedState = useContentStore.use.setFollowedState();
  const setContentInfoState = useContentStore.use.setContentInfoState();
  const setShowroomState = useContentStore.use.setShowroomState();
  const setPageViewTopBarState = useContentStore.use.setPageViewTopBarState();
  const setNavigationShowState = useContentStore.use.setNavigationShowState();
  const setNavigationActiveMenuState = useContentStore.use.setNavigationActiveMenuState();
  const setReplyShowState = useContentStore.use.setReplyShowState();
  const reset = useContentStore.use.reset();

  // 로그인 처리 후 로그인 상태값 업데이트
  const handleSignIn = async () => {
    const signInResult = await signIn();
    if (signInResult) {
      handleUpdateLogin(signInResult);
    }
    return signInResult;
  };

  /**
   * 로그인 상태 업데이트
   * @param login
   */
  const handleUpdateLogin = (login: boolean) => {
    setLoginState(login);
  };

  /**
   * 쇼룸 팔로우 상태 업데이트
   * @param followed
   */
  const handleUpdateFollowed = (followed: boolean) => {
    setFollowedState(followed);
  };

  /**
   * 플로팅 노출 상태 업데이트
   * @param value
   */
  const handleUpdateFloating = (value: FloatingStatusType) => {
    setFloatingState(value);
  };

  /**
   * 콘텐츠 정보 업데이트
   * @param value
   */
  const handleUpdateContentInfo = (value: ContentInfoState) => {
    setContentInfoState(value);
  };

  /**
   * 쇼룸 상태 업데이트
   * @param value
   */
  const handleUpdateShowroom = (value: ContentShowroomState) => {
    setShowroomState(value);
  };

  /**
   * 페이지 뷰 정보 업데이트
   * @param value
   */
  const handleUpdatePageViewTopBar = (value: number) => {
    setPageViewTopBarState(value);
  };

  /**
   * 네비게이션 노출 상태 업데이트
   * @param value
   */
  const handleUpdateShowNavigation = (value: boolean) => {
    setNavigationShowState(value);
  };

  /**
   * 네비게이션 활성화 메뉴 업데이트
   * @param value
   */
  const handleUpdateNavigationActiveMenu = (value: number) => {
    setNavigationActiveMenuState(value);
  };

  /**
   * 댓글 오픈 상태 업데이트
   * @param value
   */
  const handleUpdateShowReply = (value: boolean) => {
    setReplyShowState(value);
  };

  const handleResetStore = () => {
    reset();
  };

  return {
    handleSignIn,
    handleUpdateFollowed,
    handleUpdateLogin,
    handleUpdateContentInfo,
    handleUpdateShowroom,
    handleUpdatePageViewTopBar,
    handleUpdateFloating,
    handleUpdateShowNavigation,
    handleUpdateNavigationActiveMenu,
    handleUpdateShowReply,
    handleResetStore,
  };
};
