import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Image } from '@pui/image';
import { Action } from '@pui/action';
import { useLink } from '@hooks/useLink';
import { useWebInterface } from '@hooks/useWebInterface';
import { ContentType } from '@constants/content';
import { UniversalLinkTypes } from '@constants/link';
import { toDateFormat } from '@utils/date';
import { userAgent } from '@utils/ua';
import { FileModel } from '@models/FileModel';

export interface ContentListItemImageProps extends Pick<FileModel, 'path' | 'blurHash'> {
  /** 이미지 Lazy Load 여부 */
  lazy?: boolean;
}

export interface ContentListItemInfoProps {
  /** 컨텐츠 고유 ID */
  id: number;
  /** 컨텐츠 이름 */
  name: string;
  /** 컨텐츠 코드 */
  code: string;
  /** 컨텐츠 타입 */
  contentType: Lowercase<ContentType>;
  /** 섬네일 이미지 */
  imageProps: ContentListItemImageProps;
  /** 컨텐츠 시작 날짜 */
  startDate: number;
  /** 컨텐츠 오픈 여부(false: 오픈 예정) */
  release: boolean;
  /** List Index */
  listIndex?: number | null;
  /** 쇼룸 코드 */
  showroomCode?: string;
}

export type ContentListItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'id'> &
  ContentListItemInfoProps & {
    /** 클릭시 이벤트 */
    onClick?: (contentListInfoProps: ContentListItemInfoProps) => void;
  };

const ContentListItemComponent = forwardRef<HTMLDivElement, ContentListItemProps>(
  (
    {
      id,
      name,
      code: contentCode,
      contentType,
      imageProps,
      startDate,
      release,
      listIndex = null,
      showroomCode,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { isApp } = userAgent();
    const { getLink } = useLink();
    const { alert, confirm } = useWebInterface();
    const baseDateText = toDateFormat(startDate ?? 0, 'yyyy. M. d');
    const startDateText = release ? baseDateText : `${baseDateText} 공개 예정`;
    const { path, blurHash, lazy } = imageProps;
    const contentLink = getLink(UniversalLinkTypes.CONTENT, { contentType, contentCode });

    /** 공개 예정 중인 상태에서는 Confirm 띄움 */
    const handleClick = async (evt: React.MouseEvent) => {
      // 공개된 콘텐츠
      if (release) {
        onClick?.({ id, name, code: contentCode, contentType, imageProps, startDate, release, listIndex });
        return;
      }

      // 공개예정 콘텐츠
      evt.preventDefault();
      onClick?.({ id, name, code: contentCode, contentType, imageProps, startDate, release, listIndex });

      const message = `${toDateFormat(startDate ?? 0, 'yyyy. M. d a h:mm')
        .replace('AM', '오전')
        .replace('PM', '오후')}에 공개 예정입니다`;

      if (isApp && showroomCode) {
        if (!(await confirm({ title: message, confirmButtonTitle: '확인', cancelButtonTitle: '쇼룸 이동' }))) {
          window.location.href = getLink(UniversalLinkTypes.SHOWROOM, { showroomCode });
        }
      } else {
        alert({ message });
      }
    };
    return (
      <div ref={ref} className={className} {...props}>
        <Action is="a" link={contentLink} onClick={handleClick}>
          <div className="inner">
            <div className="thumbnail">
              {/** @todo Image 컴포넌트 blurHash null 처리 후 진행 */}
              <Image src={path} blurHash={blurHash ?? undefined} lazy={lazy} />
            </div>
            <div className="info">
              <span className="title">{name}</span>
              <span className="date">{startDateText}</span>
            </div>
          </div>
        </Action>
      </div>
    );
  },
);

/**
 * Figma Content 컴포넌트
 */
export const ContentListItem = styled(ContentListItemComponent)`
  height: 9.6rem;

  ${Action} {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: inherit;
    width: 100%;
    height: 100%;
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};
    background: ${({ theme }) => theme.color.background.surface};
    transition: transform 0.2s, opacity 0.2s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: transparent;
      transition: background 0.2s;
      opacity: 0;
      content: '';
    }

    &:active {
      &:before {
        background: ${({ theme }) => theme.color.states.pressedCell};
        opacity: 1;
      }
    }

    .inner {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
      justify-content: flex-start;

      .thumbnail {
        width: 9.6rem;
        height: 7.2rem;
        border-radius: ${({ theme }) => theme.radius.r8};
        overflow: hidden;
        margin-right: ${({ theme }) => theme.spacing.s16};
        flex-shrink: 0;

        ${Image} {
          /** @issue Image 랜딩시 Border-radius 가 0이였다가 수치값대로 변화하는 현상 Fix */
          & img {
            border-radius: ${({ theme }) => theme.radius.r8};
          }
        }
      }

      .info {
        display: flex;
        flex-direction: column;

        .title {
          font: ${({ theme }) => theme.fontType.mediumB};
          color: ${({ theme }) => theme.color.text.textPrimary};
          margin-bottom: ${({ theme }) => theme.spacing.s4};
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .date {
          font: ${({ theme }) => theme.fontType.mini};
          color: ${({ theme }) => theme.color.text.textTertiary};
        }
      }
    }
  }
`;
