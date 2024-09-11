import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action } from '@pui/action';
import { ChevronRight } from '@pui/icon';

export type FaqListItemProps = Omit<HTMLAttributes<HTMLAnchorElement>, 'is' | 'href'> & {
  // 아이디
  articleId: number;
  // 제목
  title: string;
};

const FaqListItemComponent = forwardRef<HTMLAnchorElement, FaqListItemProps>(({ articleId, title, ...props }, ref) => {
  const { getLink } = useLink();

  // FAQ 상세 링크
  const link = getLink(UniversalLinkTypes.CS_FAQ_DETAIL, { articleId });

  return (
    <Action ref={ref} aria-label={title} is="a" link={link} {...props}>
      <div className="pressed-dimmed" />
      <div className="info">
        <div className="title">
          <span className="title-prefix">Q. </span>
          {title}
        </div>
        <div className="title-suffix">
          <ChevronRight color="gray50" size="2.4rem" />
        </div>
      </div>
    </Action>
  );
});

export const FaqListItem = styled(FaqListItemComponent)`
  display: flex;
  position: relative;

  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding: 1.6rem 1.6rem 1.6rem 2.4rem;

    .title {
      display: -webkit-box;
      font: ${({ theme }) => theme.fontType.t15};
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      &-prefix {
        font-weight: ${({ theme }) => theme.fontWeight.bold};
      }
    }

    .title-suffix {
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
    }
  }

  .pressed-dimmed {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.color.gray3};
    opacity: 0;
    transition: opacity 0.2s;
  }

  // pressed effect
  &:active {
    .pressed-dimmed {
      opacity: 1;
    }
  }
`;
