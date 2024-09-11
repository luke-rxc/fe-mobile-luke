import { forwardRef, useCallback, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { ChevronRight } from '@pui/icon';
import { theme as themeStyle } from '@styles/theme';
import { AlignType, CTAButtonActionType, CTAButtonStyleType } from '../../../constants';
import type { CtaButtonModel } from '../../../models';
import { usePresetCTAService } from '../../../services';

type CTAButtonProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  /** 버튼 정보 */
  button: CtaButtonModel;
  /** 버튼 스타일 타입 */
  variant: CTAButtonStyleType;
  /** 버튼 텍스트 정렬 */
  align: Omit<AlignType, 'RIGHT'>;
  /** 딥링크 */
  deepLink?: string;
  /** 피쳐플래그 */
  featureFlag?: boolean;
  /** cb */
  onButtonClick?: ({
    label,
    buttonActionType,
    btnLink,
  }: {
    label: string;
    buttonActionType: CTAButtonActionType;
    btnLink: string;
  }) => void;
};
const CTAButtonComponent = forwardRef<HTMLDivElement, CTAButtonProps>(
  ({ className, deepLink = '', featureFlag = false, onButtonClick, ...props }, ref) => {
    const { button, variant, align = AlignType.LEFT } = props;
    const { handleAnchor, handleGetButtonLink } = usePresetCTAService({
      deepLink,
      featureFlag,
    });
    const { buttonActionType, color: buttonColor, label } = button;
    const btnLink = useMemo(() => {
      return handleGetButtonLink(button);
    }, [handleGetButtonLink, button]);

    const linkTarget = useMemo(() => {
      return buttonActionType === CTAButtonActionType.EXTERNAL_WEB ? 'blank' : '';
    }, [buttonActionType]);

    const handleClickButton = useCallback(
      (e) => {
        const params: {
          label: string;
          buttonActionType: CTAButtonActionType;
          btnLink: string;
        } = {
          label,
          buttonActionType,
          btnLink: btnLink ?? '',
        };
        onButtonClick?.(params);

        handleAnchor(e, button);
      },
      [label, buttonActionType, btnLink, onButtonClick, handleAnchor, button],
    );

    return (
      <div ref={ref} className={className} {...props}>
        <Action is="a" className="cta-button" link={btnLink} target={linkTarget} onClick={handleClickButton}>
          <span className="label-wrapper">
            <span className="label">{label}</span>
            {align === AlignType.LEFT && (
              <span className="ico">
                <ChevronRight
                  colorCode={
                    buttonColor ||
                    (variant === CTAButtonStyleType.FILL ? themeStyle.color.white : themeStyle.color.black)
                  }
                />
              </span>
            )}
          </span>
        </Action>
      </div>
    );
  },
);

export const CTAButton = styled(CTAButtonComponent)`
  width: 100%;
  display: flex;
  justify-content: center;
  .cta-button {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 1.7rem 1.6rem;
    text-align: ${({ align }) => `${align.toLowerCase()}`};
    background-color: ${({ button, variant, theme }) =>
      variant === CTAButtonStyleType.FILL ? button.bg || theme.color.brand.tint : ''};
    border-radius: ${({ theme }) => theme.radius.s8};
    border: ${({ button, variant, theme }) =>
      variant === CTAButtonStyleType.OUTLINE ? `1px solid ${button.color || theme.color.brand.tint}` : ''};
    color: ${({ button, variant, theme }) =>
      button.color || (variant === CTAButtonStyleType.FILL ? theme.color.white : theme.color.brand.tint)};
  }

  /**
   * pressed 효과
   */
  .cta-button:active {
    overflow: hidden;
    position: relative;
    transform: scale(0.96);
    transition: transform 0.2s;
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${({ theme, variant }) => (variant === CTAButtonStyleType.FILL ? theme.color.white : '')};
      opacity: 0.2;
      content: '';
    }
  }

  .label-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    font-weight: normal;
    line-height: 0;
    .label {
      font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
      flex-grow: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;
