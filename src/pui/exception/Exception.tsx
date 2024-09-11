/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import { Icon } from '@pui/icon';
import { Button } from '@pui/button';
import { useDeviceDetect } from '@hooks/useDeviceDetect';

export interface ExceptionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'css' | 'title'> {
  /** 전체 View 여부 */
  full?: boolean;
  /** 아이콘 및 디자인 요소 */
  graphic?: React.ReactNode;
  /** 타이틀 */
  title?: React.ReactNode;
  /** 내용 */
  description?: React.ReactNode;
  /** 액션 버튼에 표시할 텍스트 */
  actionLabel?: React.ReactNode;
  /** 액션 버튼 클릭시 실행할 이벤트 핸들러 */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => any;
}

export const ExceptionComponent = React.forwardRef<HTMLDivElement, ExceptionProps>(
  ({ title, graphic, description, actionLabel, full, className, onAction: handleAction, ...props }, ref) => {
    const { isApp, isIOS } = useDeviceDetect();

    return (
      <div ref={ref} className={`${className} ${full ? 'is-full' : ''} ${isIOS && !isApp ? 'is-ios' : ''}`} {...props}>
        <div className="exception-inner">
          {graphic && <div className="graphic">{graphic}</div>}
          {title && <div className="title">{title}</div>}
          {description && <div className="description">{description}</div>}
          {actionLabel && handleAction && (
            <Button bold size="small" variant="tertiaryline" onClick={handleAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

/**
 * Exception 컴포넌트
 * empty/error등의 예외상황 표시를 위한 템플릿성 컴포넌트
 *
 * @todo full true인 경우 APP/WEB, header, bottom navigation 유무에 따라 추가 대응작업 필요
 * @example
 * ```
 * <Exception
 *  graphic={<Icon name="wife" />}
 *  title="title"
 *  description="description"
 *  actionLabel="button"
 *  onAction={() => {}}
 * />
 * ```
 */
export const Exception = styled(ExceptionComponent)`
  &.is-full {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    &.is-ios {
      height: -webkit-fill-available;
    }
  }

  .exception-inner {
    box-sizing: border-box;
    padding: 0 ${({ theme }) => theme.spacing.s24};
    text-align: center;
    color: ${({ theme }) => theme.color.gray20};

    & > div:last-child {
      margin-bottom: 0;
    }
  }

  .graphic {
    margin-bottom: 1.2rem;

    ${Icon} {
      width: 4.8rem;
      height: 4.8rem;

      *[fill] {
        fill: ${({ theme }) => theme.color.gray20};
      }
      *[stroke] {
        stroke: ${({ theme }) => theme.color.gray20};
      }
    }
  }

  .title {
    margin-bottom: 0.8rem;
    font-size: ${({ theme }) => theme.fontSize.s18};
    font-weight: bold;
    line-height: 2.1rem;
  }

  .description {
    margin-bottom: 2.4rem;
    font-size: ${({ theme }) => theme.fontSize.s14};
    line-height: 1.7rem;
  }
`;
