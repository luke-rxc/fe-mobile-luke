import { useState, useEffect, useCallback, useRef } from 'react';
import has from 'lodash/has';
import get from 'lodash/get';
import { ContentType } from '@constants/content';
import { AppLinkTypes } from '@constants/link';
import { useImageLoader } from '@hooks/useImageLoader';
import { useQuery } from '@hooks/useQuery';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { getAppLink, getImageLink } from '@utils/link';
import { getContent, getPreviewContent } from '../apis';
import { ContentStatusType, ContentsBackgroundType, PresetType } from '../constants';
import { PresetKey, toContentsData } from '../models';
import type {
  ContentModel,
  HeaderDisplayModel,
  NavigationItemModel,
  PresetContents,
  PresetModel,
  PresetSectionModel,
} from '../models';
import { ContentSchema } from '../schema';

/**
 * 컨텐츠 상세 조회
 */
export const useContentService = (
  {
    contentType,
    code,
  }: {
    /** 컨텐츠 타입 */
    contentType: ContentType;
    /** 컨텐츠 코드 */
    code: string;
  },
  // 미리보기 정보
  {
    preview,
    uuid,
    dateTime,
  }: {
    /** 컨텐츠 미리보기 : office 화면에서 컨텐츠 페이지 진입 시 사용 */
    preview: boolean;
    /** 컨텐츠 미리보기시 고유 식별 키 값 */
    uuid: string;
    /** 컨텐츠 미리보기시 화면 노출 기준 시간 */
    dateTime: string;
  },
): {
  /** 컨텐츠 상세정보 */
  contentData: ContentModel | null;
  /** error 정보 */
  error: ErrorModel<ErrorDataModel> | null;
  /** 에러 여부 */
  isError: boolean;
  /** 컨텐츠 딥링크 */
  deepLink: string;
  /** 컨텐츠 페이지 유효성 */
  isInvalidPage: boolean;
  /** 페이지 로딩 스피너 표시 */
  isPageLoading: boolean;
  /** 컨텐츠 컴포넌트 노출 여부 */
  isShowContent: boolean;
  /** 프리셋 섹션 */
  presetSection: PresetSectionModel;
} => {
  // 이미지 프리로드 처리
  const { preloadImages } = useImageLoader();
  // 컨텐츠 페이지 유효 체크
  const [isInvalidPage, setIsInvalidPage] = useState<boolean>(false);
  // 컨텐츠 렌더 가능 여부
  const [isRenderableContent, setIsRenderableContent] = useState<boolean>(false);
  // 페이지 로딩 노출
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  // 네비게이션 섹션 정보
  const navigationSection = useRef<{ startIndex: number; endIndex: number } | null>(null);
  const [presetSection, setPresetSection] = useState<PresetSectionModel>({
    sectionIndex: -1,
    navigationIndex: -1,
    presets: [],
  });
  const deepLink = getAppLink(AppLinkTypes.CONTENT, {
    contentType: contentType.toLowerCase(),
    contentCode: code,
  });

  /**
   * 네비게이션 컴포넌트내 구성되는 데이터 셋 설정
   */
  const getUpdatedComponentList = useCallback((list: PresetModel<PresetContents>[]) => {
    const targetList = list.map((item, index, arr) => {
      if (item.presetType === PresetType.NAVIGATION) {
        const navigationStartIndex = index;
        const navigationEndIndex = arr.length - 2; // 마지막 푸터 컴포넌트 전까지만 네비게이션 section 설정
        navigationSection.current = {
          startIndex: navigationStartIndex,
          endIndex: navigationEndIndex,
        };
        const navigationList: NavigationItemModel[] = [];
        list.forEach((component, cIndex) => {
          const { contents } = component;
          if (!!get(contents, PresetKey.visible) === false) return; // 미노출 컴포넌트는 네비게이션 메뉴에서 제외
          if (!has(contents, PresetKey.useNavigation)) return; // 네비게이션 앵커 사용 설정 안된 컴포넌트는 네비게이션 메뉴에서 제외
          // 네비게이션 컴포넌트 이전의 위치로 설정된 프리셋 컴포넌트는 네비게이션 메뉴에서 제외
          if (navigationStartIndex > cIndex) return;
          // 네비게이션 컴포넌트 종료 위치 이후로 설정된 프리셋 컴포넌트는 네비게이션 메뉴에서 제외
          if (navigationEndIndex < cIndex) return;

          const useNavigation = get(contents, PresetKey.useNavigation);
          if (useNavigation) {
            const label = get(contents, PresetKey.navigationLabel);
            navigationList.push({
              id: cIndex,
              label,
            });
          }
        });

        return {
          ...item,
          contents: {
            ...item.contents,
            navigationList,
            visible: navigationList.length > 1, // 네비게이션 메뉴가 2개 이상인 경우에 네비게이션 컴포넌트 노출
          },
        };
      }
      return item;
    });
    return targetList;
  }, []);

  const {
    data: contentData = null,
    isFetched,
    error,
    isError,
  } = useQuery(
    ['Contents', contentType, code],
    () => {
      if (preview && uuid) {
        // 미리보기
        return getPreviewContent({ contentType, code, uuid, dateTime });
      }
      return getContent(contentType, code);
    },
    {
      select: (result: ContentSchema) => {
        let contentValue = toContentsData(result, { deepLink, displayDateTime: dateTime });
        if (contentValue) {
          const { componentList, ...rest } = contentValue;
          if (componentList.filter((comp) => comp.presetType === PresetType.NAVIGATION)) {
            // 네비게이션 내 탭에 적용될 데이터 설정
            const newComponentList: PresetModel<PresetContents>[] = getUpdatedComponentList(componentList);
            const newValue: ContentModel = {
              componentList: newComponentList,
              ...rest,
            };
            contentValue = newValue;
          }
        }
        return contentValue;
      },

      cacheTime: 0,
    },
  );

  /**
   * 페이지 유효성 체크
   */
  useEffect(() => {
    if (!contentData) {
      return;
    }
    const { status, publicStartDate, publicEndDate, componentList } = contentData;

    // 네비게이션 컴포넌트가 있는 경우, 컴포넌트들의 wrapping 하여 탭 UI 처리
    let targetPresetSection: PresetSectionModel = {
      ...presetSection,
      presets: [componentList],
    };
    if (navigationSection.current) {
      const { startIndex, endIndex } = navigationSection.current;
      const head = componentList.slice(0, startIndex);
      let tail = componentList.slice(startIndex);
      let rest: PresetModel<PresetContents>[] = [];
      if (endIndex) {
        tail = componentList.slice(startIndex, endIndex + 1);
        rest = componentList.slice(endIndex + 1);
      }
      const targetGroup = [head, tail, rest].filter((group) => group.length);
      // 탭 UI  wrapping 될 index 조회
      const sectionIndex = targetGroup.findIndex((group) => {
        const isIncludeNavigation = group.find((preset) => preset.presetType === PresetType.NAVIGATION);
        return isIncludeNavigation;
      });

      targetPresetSection = {
        sectionIndex,
        navigationIndex: componentList.findIndex((preset) => preset.presetType === PresetType.NAVIGATION),
        presets: targetGroup,
      };
    }
    setPresetSection(targetPresetSection);

    // 미리보기, 관리자 공개인 경우 페이지 유효성 체크 X
    if (preview || status === ContentStatusType.ADMIN_PUBLIC) {
      return;
    }

    if (status === ContentStatusType.PRIVATE) {
      setIsInvalidPage(true);
      return;
    }

    if (publicStartDate) {
      const currentTime = new Date().getTime();
      const startTime = contentData.publicStartDate;
      if (currentTime < startTime) {
        setIsInvalidPage(true);
        return;
      }
    }

    if (publicEndDate) {
      const currentTime = new Date().getTime();
      const startTime = contentData.publicStartDate;
      const endTime = contentData.publicEndDate;
      if (currentTime > endTime || currentTime < startTime) {
        setIsInvalidPage(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, contentData]);

  /**
   * 컨텐츠 렌더 가능 시점 체크
   */
  useEffect(() => {
    if (!contentData) {
      return;
    }
    /**
     * 헤더 컴포넌트가 존재하는 경우, 헤더 컴포넌트 이미지 프리로드 처리
     */
    const headerComp = contentData.componentList.find((comp) => comp.presetType === PresetType.HEADER);
    if (!headerComp) {
      setIsRenderableContent(true);
      return;
    }

    const contents = headerComp.contents as HeaderDisplayModel;
    const { logoImage, mainImage, footerImage } = contents;
    const headerImageList = [
      getImageLink(logoImage.path),
      ...(mainImage.path ? getImageLink(mainImage.path) : []),
      getImageLink(footerImage.path),
    ];
    if (contents.backgroundInfo.type === ContentsBackgroundType.MEDIA) {
      headerImageList.push(getImageLink(contents.backgroundMedia.path));
    }

    preloadImages(headerImageList).then(() => setIsRenderableContent(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData]);

  /**
   * 페이지 로딩 스피너 표시
   */
  useEffect(() => {
    if (isError) {
      setIsPageLoading(false);
      return;
    }

    if (isFetched && isInvalidPage) {
      setIsPageLoading(false);
      return;
    }

    if (isFetched && isRenderableContent) {
      setIsPageLoading(false);
    }
  }, [isFetched, isError, isRenderableContent, isInvalidPage]);

  return {
    contentData,
    presetSection,
    error,
    isError,
    deepLink,
    isInvalidPage,
    isPageLoading,
    isShowContent: isFetched && isRenderableContent,
  };
};
