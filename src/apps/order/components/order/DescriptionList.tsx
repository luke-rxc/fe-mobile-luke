import React from 'react';
import styled from 'styled-components';

export interface DescriptionListProps {
  text: string;
}

export interface DescriptionItemProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'css' | 'title'> {
  /** 내용 */
  text: React.ReactNode;
  /** 타이틀 */
  title: React.ReactNode;
  /** summary 타입 유무 */
  summary?: boolean;
  /** 구부선 표시 여부 */
  divider?: boolean;
  /** 내용 텍스트의 정렬방식 */
  textAlign?: 'left' | 'right' | 'center';
}

/**
 * 정의형 리스트 Wrapper 컴포넌트
 */
export const DescriptionList = styled(({ className, children }) => {
  return (
    <div className={className}>
      <table>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
})`
  padding-left: ${({ theme }) => theme.spacing.s24};
  padding-right: ${({ theme }) => theme.spacing.s24};

  & > table {
    width: 100%;
  }
`;

/**
 * 정의형 리스트 아이템 컴포넌트
 */
export const DescriptionItem = styled(
  React.forwardRef<HTMLTableRowElement, DescriptionItemProps>(
    ({ title, text, textAlign, className, children, divider, summary, ...props }, ref) => {
      const classnames = className + (summary ? ' is-summary' : '');

      return (
        <>
          {divider && (
            <tr aria-hidden className={className}>
              <td colSpan={2} className="description-divider" />
            </tr>
          )}

          <tr ref={ref} className={classnames} {...props}>
            <th className="description-title">{title}</th>
            <td className="description-text">
              {text}
              {children}
            </td>
          </tr>
        </>
      );
    },
  ),
)`
  font: ${({ theme }) => theme.fontType.t14};

  /**************************************************************
  * 구분선
  *************************************************************/
  .description-divider {
    padding: ${({ theme }) => theme.spacing.s12} 0;

    &:after {
      display: block;
      width: 100%;
      height: 0.1rem;
      background: ${({ theme }) => theme.color.gray8};
      content: '';
    }
  }

  /**************************************************************
  * 리스트 아이템
  *************************************************************/
  .description-title,
  .description-text {
    padding-top: ${({ theme }) => theme.spacing.s8};
    padding-bottom: ${({ theme }) => theme.spacing.s8};
    font-size: inherit;
    font-weight: inherit;
    vertical-align: top;
  }

  .description-title {
    min-width: 8rem;
    text-align: left;
    color: ${({ theme }) => theme.color.gray50};
  }

  .description-text {
    text-align: ${({ textAlign = 'left' }) => textAlign};
    color: ${({ theme }) => theme.color.black};
  }

  .description-title + .description-text {
    padding-left: ${({ theme }) => theme.spacing.s8};
  }

  /**************************************************************
   * summary 타입
   *************************************************************/
  &.is-summary {
    font: ${({ theme }) => theme.fontType.t15B};

    .description-title,
    .description-text {
      color: ${({ theme }) => theme.color.tint};
    }
  }
`;
