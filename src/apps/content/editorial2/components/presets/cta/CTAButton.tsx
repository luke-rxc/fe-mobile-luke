import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes, MouseEvent } from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { ChevronRight } from '@pui/icon';
import { theme as themeStyle } from '@styles/theme';
import { AlignType, CTAButtonActionType, CTAButtonStyleType, PresetType } from '../../../constants';
import type { ContentLogInfoModel, CtaButtonModel } from '../../../models';
import { useLogService, usePresetCTAService } from '../../../services';
import { useContentStore } from '../../../stores';

type CTAButtonProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
  /** 버튼 정보 */
  button: CtaButtonModel;
  /** 버튼 스타일 타입 */
  variant: CTAButtonStyleType;
  /** 버튼 텍스트 정렬 */
  align: Omit<AlignType, 'RIGHT'>;
  /** 프리셋 id */
  presetId: number;
  /** 프리셋 타입 */
  presetType: PresetType;
};
const CTAButtonComponent = forwardRef<HTMLDivElement, CTAButtonProps>(
  ({ className, presetId, presetType, ...props }, ref) => {
    const { button, variant, align = AlignType.LEFT } = props;
    const contentInfo = useContentStore.use.contentInfo();
    const contentLogInfo: ContentLogInfoModel = useMemo(() => {
      return {
        ...contentInfo,
        presetId,
        presetType,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { logPresetCTAButtonTab } = useLogService();
    const { handleAnchor, handleGetButtonLink } = usePresetCTAService({
      deepLink: contentInfo.deepLink,
    });
    const { buttonActionType, color: buttonColor, label } = button;
    const btnLink = useMemo(() => {
      return handleGetButtonLink(button) ?? '';
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const linkTarget = useMemo(() => {
      return buttonActionType === CTAButtonActionType.EXTERNAL_WEB ? 'blank' : '';
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickButton = (e: MouseEvent<HTMLAnchorElement>) => {
      logPresetCTAButtonTab({
        contentInfo: contentLogInfo,
        label,
        buttonActionType,
        btnLink,
      });

      handleAnchor(e, button);
    };

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
  display: flex;
  justify-content: center;
  width: 100%;

  .cta-button {
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 1.7rem 1.6rem;
    border: ${({ button, variant, theme }) =>
      variant === CTAButtonStyleType.OUTLINE ? `1px solid ${button.color || theme.color.brand.tint}` : ''};
    border-radius: ${({ theme }) => theme.radius.r8};
    background-color: ${({ button, variant, theme }) =>
      variant === CTAButtonStyleType.FILL ? button.bg || theme.color.brand.tint : ''};
    color: ${({ button, variant, theme }) =>
      button.color || (variant === CTAButtonStyleType.FILL ? theme.color.white : theme.color.brand.tint)};
    text-align: ${({ align }) => `${align.toLowerCase()}`};
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
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    font-weight: normal;
    line-height: 0;

    .label {
      overflow: hidden;
      flex-grow: 1;
      font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;
