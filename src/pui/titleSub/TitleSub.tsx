import { forwardRef, HTMLAttributes } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { ButtonText } from '@pui/buttonText';

export type TitleSubProps = HTMLAttributes<HTMLDivElement> & {
  /** 타이틀 정보 */
  title: string;
  /** 타이틀 font weight의 볼드여부 */
  noBold?: boolean;
  /** subtitle (font weight bold 상태에서만 노출) */
  subtitle?: React.ReactNode;
  /** 우측 커스터마이징 요소 */
  suffix?: React.ReactNode;
  /** 영역 Click 이벤트 핸들러 (suffix가 clickable한 요소인 경우 link, onClick props를 사용하지 마세요) */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const TitleSubComponent = forwardRef<HTMLDivElement, TitleSubProps>(
  ({ className, title, noBold = false, subtitle, suffix, onClick, ...props }, ref) => {
    const classNames = classnames(className, {
      'is-bold': !noBold,
      'is-pressable': !!onClick,
      'is-subtitle': !!subtitle,
    });
    return (
      <div ref={ref} className={classNames} onClick={onClick} {...props}>
        <div className="inner">
          <div className="title-content">
            <div className="title">{title}</div>
            {!noBold && subtitle && <div className="subtitle">{subtitle}</div>}
          </div>
          {suffix && <div className="title-suffix">{suffix}</div>}
        </div>
      </div>
    );
  },
);

/**
 * Figma 페이지 서브타이틀 컴포넌트
 */
export const TitleSub = styled(TitleSubComponent)`
  display: flex;
  position: relative;
  align-items: center;
  min-height: 5.6rem;

  & .inner {
    display: flex;
    gap: ${({ theme }) => theme.spacing.s16};
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 ${({ theme }) => theme.spacing.s24};
  }

  & .title-content {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    word-break: break-all;
  }

  & .title {
    ${({ theme }) => theme.mixin.ellipsis()};
    color: ${({ theme }) => theme.color.text.textPrimary};
    font: ${({ theme }) => theme.fontType.medium};
  }

  &.is-bold .title {
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }

  & .subtitle {
    ${({ theme }) => theme.mixin.ellipsis()};
    margin-top: ${({ theme }) => theme.spacing.s4};
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mini};
  }

  & .title-suffix {
    display: inline-flex;
    position: relative;
    flex-shrink: 0;
    align-items: center;
    color: ${({ theme }) => theme.color.gray50};

    ${ButtonText} {
      margin-right: ${({ theme }) => `-${theme.spacing.s12}`};
    }
  }

  &.is-pressable {
    background: transparent;
    transition: background 200ms;

    &:active {
      background: ${({ theme }) => theme.color.states.pressedCell};
    }
  }

  &.is-subtitle {
    height: 7.2rem;
  }
`;
