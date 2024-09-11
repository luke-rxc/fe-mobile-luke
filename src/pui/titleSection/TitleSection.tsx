import React, { forwardRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { Action } from '@pui/action';
import { ButtonText } from '@pui/buttonText';
import { Conditional } from '@pui/conditional';

export type TitleSectionProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** 타이틀 정보 */
  title: React.ReactNode;
  /** subtitle */
  subtitle?: React.ReactNode;
  /** 링크 URL (suffix가 clickable한 요소인 경우 link, onClick props를 사용하지 마세요) */
  link?: string;
  /** 우측 커스터마이징 요소 */
  suffix?: React.ReactNode;
  /** Anchor 클릭 이벤트 콜백 */
  onClickLink?: React.MouseEventHandler<HTMLAnchorElement>;
  /** 영역 Click 이벤트 핸들러 (suffix가 clickable한 요소인 경우 link, onClick props를 사용하지 마세요) */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * 우측 커스터마이징 타입
   * @deprecated
   */
  suffixType?: 'icon' | 'text';
  /**
   * press 효과 처리 여부
   * @deprecated
   */
  press?: boolean;
};

export const TitleSectionComponent = forwardRef<HTMLDivElement, TitleSectionProps>(
  ({ className, title, subtitle, link, suffix, suffixType, press, onClick, onClickLink, ...props }, ref) => {
    const classNames = classnames(className, {
      'is-pressable': !!link || !!onClick,
      'is-subtitle': !!subtitle,
    });

    return (
      <div ref={ref} className={classNames} onClick={onClick} {...props}>
        <Conditional
          className="inner"
          condition={!!link}
          trueExp={<Action link={link} is="a" onClick={onClickLink} />}
          falseExp={<div />}
        >
          <div className="title-content">
            <div className="title">{title}</div>
            {subtitle && <div className="subtitle">{subtitle}</div>}
          </div>
          {suffix && <div className="title-suffix">{suffix}</div>}
        </Conditional>
      </div>
    );
  },
);

/**
 * Figma 페이지 타이틀 컴포넌트
 */
export const TitleSection = styled(TitleSectionComponent)`
  display: flex;
  align-items: center;
  position: relative;
  height: 5.6rem;

  & .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    gap: ${({ theme }) => theme.spacing.s8};
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
    font: ${({ theme }) => theme.fontType.largeB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }

  & .subtitle {
    ${({ theme }) => theme.mixin.ellipsis()};
    margin-top: ${({ theme }) => theme.spacing.s4};
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.text.textTertiary};
  }

  & .title-suffix {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    position: relative;
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
