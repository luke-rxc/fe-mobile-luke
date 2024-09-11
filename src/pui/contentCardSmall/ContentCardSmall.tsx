import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes } from '@constants/link/universalLink';
import { toDateFormat } from '@utils/date';
import { userAgent } from '@utils/ua';
import { useWebInterface } from '@hooks/useWebInterface';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { Image } from '@pui/image';

export interface ContentCardSmallProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href' | 'is'> {
  /** 콘텐츠 ID */
  contentId: number;
  /** 타이틀 */
  title: string;
  /** 콘텐츠 코드 */
  startDate: number;
  /** 콘텐츠 코드 */
  contentCode: string;
  /** 콘텐츠 타입 */
  contentType: string;
  /** 이미지 URL */
  imageURL: string;
  /** 이미지 blurHash */
  blurHash?: string;
  /** 쇼룸 코드 */
  showroomCode?: string;
}

const ContentCardSmallComponent = forwardRef<HTMLAnchorElement, ContentCardSmallProps>(
  (
    { contentId, title, startDate, contentCode, contentType, imageURL, blurHash, showroomCode, onClick, ...props },
    ref,
  ) => {
    const { isApp } = userAgent();
    const { getLink } = useLink();
    const { alert, confirm } = useWebInterface();

    /**
     * 콘텐츠 공개 여부
     */
    const revealed = startDate <= new Date().getTime();

    /**
     * 콘텐츠 랜딩 URL
     */
    const link = getLink(UniversalLinkTypes.CONTENT, {
      contentCode,
      contentType: contentType.toLowerCase(),
    });

    /**
     * 클릭 이벤트 핸들러 (공개 예정인 콘텐츠의 클릭 이벤트를 제어)
     */
    const handleClickLink = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // 공개된 콘텐츠
      if (startDate && revealed) {
        onClick?.(e);
        return;
      }

      // 공개 예정 콘텐츠
      e.preventDefault();
      onClick?.(e);

      const message = `${toDateFormat(startDate, 'yyyy. M. d a h:mm')
        .replace('AM', '오전')
        .replace('PM', '오후')}에 공개 예정입니다`;

      if (isApp && showroomCode) {
        const result = await confirm({ title: message, confirmButtonTitle: '확인', cancelButtonTitle: '쇼룸 이동' });
        !result && (window.location.href = getLink(UniversalLinkTypes.SHOWROOM, { showroomCode }));
      } else {
        alert({ message });
      }
    };

    return (
      <Action is="a" ref={ref} link={link} {...props} onClick={handleClickLink}>
        <span className="content-small-thumb">
          <Image lazy src={imageURL} blurHash={blurHash} />
        </span>
        <span className="content-small-info">
          <span className="title">{title}</span>
          <span className="date">
            {toDateFormat(startDate, 'yyyy. M. d')} {!revealed && '공개예정'}
          </span>
        </span>
      </Action>
    );
  },
);

/**
 * figma의 콘텐츠 카드 스몰 컴포넌트
 */
export const ContentCardSmall = styled(ContentCardSmallComponent)`
  display: inline-block;
  width: calc((100vw - 8rem) / 2);
  max-width: 16.7rem;

  &:active {
    .content-small-thumb:after {
      opacity: 0.1;
    }
  }

  .content-small-thumb {
    display: block;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding-top: 75%;
    border-radius: ${({ theme }) => theme.radius.r8};

    &:after {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: inherit;
      background: ${({ theme }) => theme.color.states.pressedMedia};
      content: '';
    }

    ${Image} {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0, r: 0, b: 0 })};
      border-radius: inherit;

      img {
        object-fit: cover;
      }
    }
  }

  .content-small-info {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.s12};
    height: 8.8rem;

    .title {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      word-break: keep-all;
      width: 100%;
      max-height: 3.4em;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font: ${({ theme }) => theme.fontType.smallB};
      color: ${({ theme }) => theme.color.text.textPrimary};
    }
    .date {
      display: block;
      margin-top: ${({ theme }) => theme.spacing.s4};
      font: ${({ theme }) => theme.fontType.mini};
      color: ${({ theme }) => theme.color.text.textTertiary};
    }
  }
`;
