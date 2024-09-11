import { forwardRef, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { env } from '@env';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { transformLink, transformOrigin } from '../utils';

export interface ArticleDetailProps {
  className?: string;
  // 제목
  title: string;
  // 섹션명
  sectionName: string;
  // 작성일시
  relativeTime?: string;
  // 내용
  body: string;
}

const ArticleDetailComponent = forwardRef<HTMLDivElement, ArticleDetailProps>(
  ({ className, title, sectionName, relativeTime, body }, ref) => {
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const { isApp } = useDeviceDetect();
    const { openDialogToApp } = useMwebToAppDialog();

    // 게시글 HTML 데이터 내 link 처리
    useLayoutEffect(() => {
      const nodes = [...(bodyRef.current?.getElementsByTagName('a') ?? [])];

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
      <div ref={ref} className={className}>
        <article className="article">
          <header className="article-header">
            <div className="article-header-inner">
              <h1 className="title">{title}</h1>
              <div className="title-meta">
                <span className="section">{sectionName}</span>
                {relativeTime && (
                  <>
                    <span className="division" />
                    <span className="time">{relativeTime}</span>
                  </>
                )}
              </div>
            </div>
            <div className="divider" />
          </header>
          <section className="article-info">
            <div className="article-content">
              {/* eslint-disable-next-line react/no-danger */}
              <div ref={bodyRef} className="article-body" dangerouslySetInnerHTML={{ __html: body }} />
              <div className="article-attachments" />
            </div>
          </section>
        </article>
      </div>
    );
  },
);

export const ArticleDetail = styled(ArticleDetailComponent)`
  .article {
    &-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 0;
      padding: 0;

      &-inner {
        flex: none;
        padding: 2rem 2.4rem;

        .title {
          font: ${({ theme }) => theme.fontType.t18B};
          color: ${({ theme }) => theme.color.black};
          margin-bottom: 1.8rem;
        }

        .title-meta {
          font: ${({ theme }) => theme.fontType.t12};
          color: ${({ theme }) => theme.color.gray50};

          .division {
            padding: 0 0.6rem;
          }

          .division:after {
            display: inline-block;
            background-color: ${({ theme }) => theme.color.gray8};
            content: '';
            height: 1rem;
            width: 0.1rem;
          }
        }
      }

      .divider {
        width: 100%;
        margin: 0;
        padding: 0 24px;

        &:after {
          display: block;
          height: 0.5px;
          background-color: ${({ theme }) => theme.color.gray8};
          content: '';
        }
      }
    }

    &-info {
      max-width: 100%;
    }

    &-content {
      display: flex;
      flex-direction: column;
      padding: 1.6rem 2.4rem;
      word-wrap: break-word;
    }

    &-body {
      font: ${({ theme }) => theme.fontType.t15};
      color: ${({ theme }) => theme.color.black};

      // HTML body 태그 처리에 임의 스타일 지정
      p {
        padding: 1rem 0;
      }

      a {
        text-decoration-line: underline;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
      }
    }
  }
`;
