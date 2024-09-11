import { forwardRef, useRef, useLayoutEffect, HTMLAttributes } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { AppLinkTypes } from '@constants/link';
import { env } from '@env';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { Chips } from '@pui/chips';
import { getAppLink } from '@utils/link';
import { userAgent } from '@utils/ua';
import { transformLink, transformOrigin } from '../utils';

export interface QnaCommentProps extends HTMLAttributes<HTMLDivElement> {
  // 관리자 코멘트 여부
  manager: boolean;
  // 코멘트 일자
  date: string;
  // 헤더 숨김 여부
  hideHeader?: boolean;
  // 코멘트 내용
  content: string;
  // 첨부파일
  attachments?: Attachment[];
}

type Attachment = {
  // 파일명
  fileName: string;
  // 파일주소
  url: string;
};

const QnaCommentComponent = forwardRef<HTMLDivElement, QnaCommentProps>((props, ref) => {
  const { isApp } = userAgent();
  const { manager, date, hideHeader = false, content, attachments = [], className, ...rest } = props;

  // 첨부 파일 클릭 시 플랫폼별 동작 처리
  const getChipProps = ({ fileName, url }: Attachment) => {
    const linkProps = isApp
      ? { link: getAppLink(AppLinkTypes.EXTERNAL_WEB, { url }) }
      : {
          onClick: () => {
            window.open(url, '_blank');
          },
        };

    return { key: fileName, label: fileName, ...linkProps };
  };

  const { openDialogToApp } = useMwebToAppDialog();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const nodes = [...(contentRef.current?.getElementsByTagName('a') ?? [])];

    [...nodes].forEach((elem) => {
      const link = transformLink(elem.href);

      elem.setAttribute('href', transformOrigin(link));
      elem.removeAttribute('rel');
      elem.removeAttribute('target');

      // 모웹에서 딥링크 주소인 경우 Dialog 처리
      if (!isApp && link.startsWith(env.app.appLinkUrl)) {
        elem.addEventListener('click', (e) => {
          e.preventDefault();
          openDialogToApp(link);
        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={classnames(className, { 'is-manager': manager })} {...rest}>
      <div className="inner">
        {!hideHeader && (
          <div className="header">
            {manager && <span className="author">고객센터</span>}
            <span className="date">{date}</span>
          </div>
        )}
        {/* eslint-disable-next-line react/no-danger */}
        <div ref={contentRef} className="content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {!isEmpty(attachments) && <Chips data={attachments} getChipProps={getChipProps} />}
    </div>
  );
});

export const QnaComment = styled(QnaCommentComponent)`
  overflow: hidden;

  .inner {
    padding: 0 2.4rem;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 2.4rem;

      .date {
        font: ${({ theme }) => theme.fontType.mini};
        color: ${({ theme }) => theme.color.gray50};
      }
    }
  }

  ${Chips} {
    margin-top: 2.4rem;
  }

  /* 고객센터 답변 */
  &.is-manager {
    background-color: ${({ theme }) => theme.color.grayBg};
    border-radius: 0.8rem;
    margin: 0 2.4rem;

    .inner {
      padding: 1.6rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      .author {
        font: ${({ theme }) => theme.fontType.mediumB};
        color: ${({ theme }) => theme.color.black};
      }
    }

    .content {
      font: ${({ theme }) => theme.fontType.medium};
      color: ${({ theme }) => theme.color.black};
      word-break: break-all;

      p {
        padding: 1rem 0;
      }

      a {
        text-decoration-line: underline;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
      }
    }

    ${Chips} {
      margin: 0.8rem 0 1.6rem 0;
      padding: 0 1.2rem;
    }
  }
`;
