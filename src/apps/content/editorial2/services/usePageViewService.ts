import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContentType } from '@constants/content';
import { AppLinkTypes } from '@constants/link';
import { useImageLoader } from '@hooks/useImageLoader';
import { useQuery } from '@hooks/useQuery';
import { useQueryString } from '@hooks/useQueryString';
import { getAppLink, getImageLink } from '@utils/link';
import { getContent, getPreviewContent } from '../apis';
import { ContentsBackgroundType, ContentStatusType, PresetType } from '../constants';
import type { ContentStoryModel, HeaderDisplayModel } from '../models';
import type { ContentSchema } from '../schema';

/**
 * 콘텐츠 페이지 유효 판단
 * @returns
 */
export const usePageViewService = () => {
  const { preloadImages } = useImageLoader(); // 이미지 프리로드 처리
  const [isValidPage, setIsValidPage] = useState(true);
  const [isShowSpinner, setIsShowSpinner] = useState(true);

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

  const handleShowView = useCallback((data: ContentSchema) => {
    const { status, publicStartDate, publicEndDate, componentList } = data;

    let valid = true;
    if (preview === 'true' || status === ContentStatusType.ADMIN_PUBLIC) {
      valid = true;
    } else if (status === ContentStatusType.PRIVATE) {
      valid = false;
    } else if (publicStartDate) {
      const currentTime = Date.now();
      const startTime = publicStartDate;
      if (currentTime < startTime) {
        valid = false;
      }
    } else if (publicEndDate) {
      const currentTime = Date.now();
      const startTime = publicStartDate;
      const endTime = publicEndDate;
      if (currentTime > endTime || currentTime < startTime) {
        valid = false;
      }
    }

    /**
     * 헤더 컴포넌트가 존재하는 경우, 헤더 컴포넌트 이미지 프리로드 처리
     */
    const headerComp = componentList.find((comp) => comp.componentType === PresetType.HEADER);
    if (!headerComp) {
      setIsShowSpinner(false);
      setIsValidPage(valid);
      return;
    }
    const displayData: HeaderDisplayModel = JSON.parse(headerComp.contents);
    const { logoImage, mainImage, footerImage, backgroundInfo, backgroundMedia } = displayData;
    const headerImageList = [
      getImageLink(logoImage.path),
      ...(mainImage.path && [getImageLink(mainImage.path)]),
      getImageLink(footerImage.path),
    ];
    if (backgroundInfo.type === ContentsBackgroundType.MEDIA) {
      headerImageList.push(getImageLink(backgroundMedia.path));
    }

    preloadImages(headerImageList).then(() => {
      setIsShowSpinner(false);
      setIsValidPage(valid);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading } = useQuery(
    ['Contents', contentType, code],
    () => {
      if (preview === 'true' && uuid) {
        // 미리보기
        return getPreviewContent({ contentType: getContentType(contentType), code, uuid, dateTime });
      }
      return getContent(contentType, code);
    },
    {
      select: (result: ContentSchema): ContentStoryModel => {
        const { type, code: contentCode, contentName, primaryImage, keywordList } = result;

        const deepLink = getAppLink(AppLinkTypes.CONTENT, {
          contentType: getContentType(type).toLowerCase(),
          contentCode,
        });

        return {
          ...result,
          eventCode,
          preview: preview === 'true' && !!uuid,
          dateTime,
          deepLink,
          seo: {
            title: contentName,
            description: contentName,
            image: primaryImage?.path && getImageLink(primaryImage.path),
            keywords: keywordList.map(({ name }) => name),
            url: window.location.origin.concat(window.location.pathname),
          },
        };
      },
      onSuccess: handleShowView,
      onError: () => {
        setIsShowSpinner(false);
        setIsValidPage(false);
      },
      cacheTime: 0,
    },
  );

  useEffect(() => {
    if (isLoading) {
      setIsShowSpinner(true);
    }
  }, [isLoading]);

  return {
    data,
    isValidPage,
    isShowSpinner,
  };
};
