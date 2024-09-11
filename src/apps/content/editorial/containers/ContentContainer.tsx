import { useEffect, useState, useCallback, useRef, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { getContentType } from '@constants/content';
import { UniversalLinkTypes } from '@constants/link';
import { PageError } from '@features/exception/components';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { useLink } from '@hooks/useLink';
import { useTheme } from '@hooks/useTheme';
import { useQueryString } from '@hooks/useQueryString';
import { Conditional } from '@pui/conditional';
import { SEO } from '@pui/seo';
import { useLoadingStore } from '@stores/useLoadingStore';
import { ContentHeader, ContentFloatingRefType, ContentFloating, PresetComponent } from '../components';
import { PresetType } from '../constants';
import { PresetContext } from '../context';
import type { HeaderModel, PresetContents, PresetModel, ReplyProps } from '../models';
import {
  useContentService,
  useLogService,
  useContentHistoryService,
  useContentEventService,
  useContentPresetService,
  useContentTabScrollService,
} from '../services';

export const ContentContainer = () => {
  const { contentType, code } = useParams<{
    /** 컨텐츠 타입 */
    contentType: string;
    /** 컨텐츠 코드 */
    code: string;
  }>();
  const {
    preview,
    uuid,
    dateTime = '',
    eventCode = '',
  } = useQueryString<{
    /** 컨텐츠 미리보기 : office 화면에서 컨텐츠 페이지 진입 시 사용 */
    preview?: string;
    /** 컨텐츠 미리보기시 고유 식별 키 값 */
    uuid?: string;
    /** 컨텐츠 미리보기시 화면 노출 기준 시간 */
    dateTime?: string;
    /** 이벤트 코드
     * case. 추첨 페이지에서 이벤트 코드를 포함한 컨텐츠 페이지 진입
     *  - 이벤트 코드를 기반으로 로그인 및 유저 이벤트 등록 처리
     * */
    eventCode?: string;
  }>();

  const { getLink } = useLink();
  const { theme } = useTheme();
  const applyTheme = { ...theme, ...theme.light };

  // 컨텐츠 상세 정보
  const { contentData, presetSection, isError, deepLink, isInvalidPage, isPageLoading, isShowContent } =
    useContentService(
      { contentType: getContentType(contentType), code },
      { preview: preview === 'true', uuid: `${uuid}`, dateTime },
    );
  // 최근 본 컨텐츠 등록 서비스
  const { contentHistoryMutate } = useContentHistoryService();
  // 이벤트코드 유저 등록 서비스
  const { handleContentEvent } = useContentEventService();
  // 로깅 서비스
  const { logContentInit, logPresetReplyTab, logShowroomTab } = useLogService();

  const {
    action: { handleErrorHomeCb },
  } = useErrorService();

  /**
   * 댓글 오픈 콜백
   */
  const handleOpenReply = useCallback(() => {
    if (!contentData) {
      return;
    }
    const { code: contentCode, type } = contentData;
    logPresetReplyTab({
      contentCode,
      contentType: type,
    });
  }, [contentData, logPresetReplyTab]);

  /**
   * 프리셋 컴포넌트 제어 서비스
   */
  const { presetRefs, presetData, handleRefComponent, handleSetPresetData, handleClickReply, handlePresetReset } =
    useContentPresetService({
      onOpenReply: handleOpenReply,
    });

  /**
   * 탭 스크롤 제어 서비스
   */
  const { tabSectionRef, handleScrollNavigation, handleUpdatePresetRef } = useContentTabScrollService({
    presetData,
    presetSection,
  });

  /**
   * 공통 헤더 탑바 쇼룸 클릭
   */
  const handleLinkShowroom = useCallback(() => {
    if (!contentData) {
      return;
    }
    const { code: contentCode, showroom } = contentData;
    logShowroomTab({
      contentCode,
      showroomCode: showroom.showroomCode,
    });
  }, [contentData, logShowroomTab]);

  const [commonHeaderProps, setCommonHeaderProps] = useState<HeaderModel | null>(null);
  const [renderContent, setRenderContent] = useState(false); // 라우팅 변경시 컴포넌트를 새로 그리기 위한 state 설정

  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const snackbarElRef = useRef<ContentFloatingRefType | null>(null);
  const snackbarRef = useCallback((el) => {
    if (el) {
      snackbarElRef.current = el as ContentFloatingRefType;
    }
  }, []);

  /**
   * 쇼룸 팔로우 스낵바 노출
   */
  const handleShowFloatingBar = useCallback(() => {
    if (!snackbarElRef.current) return;
    snackbarElRef.current.showSnackBar();
  }, []);

  /**
   * 쇼룸 팔로우 스낵바 hide
   */
  const handleHideFloatingBar = useCallback(() => {}, []);

  /** 이벤트 코드 유저 등록 */
  useEffect(() => {
    if (isShowContent && eventCode) {
      handleContentEvent({
        eventCode,
      });
    }
  }, [deepLink, eventCode, isShowContent, handleContentEvent]);

  /**
   * 데이터 로드 후 초기 셋팅
   */
  useEffect(() => {
    if (contentData) {
      handlePresetReset();
      const { contentNo, contentName, type, status, showroom, keywordList, componentList } = contentData;
      const imagePath = showroom?.brand?.primaryImage?.path;
      const { showroomCode, showroomName, showroomId } = showroom;
      handleSetPresetData(componentList);

      let headerProps: HeaderModel = {
        title: showroomName,
        titleImagePath: imagePath,
        showroomCode,
        link: getLink(UniversalLinkTypes.SHOWROOM, { showroomCode }),
        onClickTitle: handleLinkShowroom,
      };

      const replyComp = contentData.componentList.find((comp) => comp.presetType === PresetType.REPLY);
      if (replyComp) {
        const { replyCount } = contentData;
        const { noticeTitle, noticeSubTitle, visible } = replyComp.contents as ReplyProps;

        const commentInfo = {
          count: replyCount,
          notiTitle: noticeTitle?.text ?? '',
          notiDescription: noticeSubTitle.text ?? '',
        };

        headerProps = {
          ...headerProps,
          ...(visible && {
            commentInfo: {
              ...commentInfo,
              onClickReply: handleClickReply,
            },
          }),
        };
      }

      setCommonHeaderProps(headerProps);

      // 최근 본 컨텐츠
      contentHistoryMutate(contentNo);
      /**
       * 콘텐츠 진입 로그
       */
      logContentInit({
        contentId: contentNo,
        contentName,
        contentType: type,
        contentStatus: status,
        showroomName,
        showroomId,
        contentsKeyword: keywordList.map((keyword) => {
          return keyword.name;
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData]);

  /** 프리셋 컴포넌트 업데이트 */
  useEffect(() => {
    handleUpdatePresetRef(presetRefs);
  }, [handleUpdatePresetRef, presetRefs]);

  useEffect(() => {
    if (isPageLoading && !isShowContent) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPageLoading, isShowContent]);

  useEffect(() => {
    window.requestAnimationFrame(() => setRenderContent(true));
    return () => {
      setRenderContent(false);
    };
  }, []);

  /** Loading 처리 */
  if (isPageLoading && !isShowContent) {
    return <></>;
  }

  /** 페이지 유효 처리 */
  if (isError || isInvalidPage) {
    return (
      <>
        <ContentHeader />
        <PageError
          description={ErrorMessage.NotFound}
          actionLabel={ErrorActionButtonLabel.HOME}
          onAction={handleErrorHomeCb}
        />
      </>
    );
  }

  return (
    <>
      {renderContent && contentData && isShowContent && (
        <PresetContext.Provider
          value={{
            showFollowSnackBar: handleShowFloatingBar,
            hideFollowSnackBar: handleHideFloatingBar,
            scrollNavigationView: handleScrollNavigation,
          }}
        >
          <SEO {...contentData.seo} helmetProps={{ title: contentData.seo.title }} />
          {commonHeaderProps && <ContentHeader {...commonHeaderProps} />}
          {contentData?.componentList && (
            <ThemeProvider theme={applyTheme}>
              <WrapperPreset>
                {presetSection.presets.map((prests, idx) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={`${code}-${idx}`}>
                      <Conditional
                        condition={idx === presetSection.sectionIndex} // 네비게이션이 포함된 그룹인 경우 TabSection으로 wrapping
                        trueExp={<div className="tab-section" ref={tabSectionRef} />}
                      >
                        {prests.map((preset: PresetModel<PresetContents>, index: number) => (
                          <PresetComponent
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            {...preset}
                            ref={(ref) => handleRefComponent(ref, contentData.componentList)}
                          />
                        ))}
                      </Conditional>
                    </Fragment>
                  );
                })}
              </WrapperPreset>
            </ThemeProvider>
          )}
          {contentData && <ContentFloating ref={snackbarRef} content={contentData} deepLink={deepLink} />}
        </PresetContext.Provider>
      )}
    </>
  );
};

const WrapperPreset = styled.div`
  background-color: ${({ theme }) => theme.light.color.whiteVariant1};
  color: ${({ theme }) => theme.light.color.black};
`;
