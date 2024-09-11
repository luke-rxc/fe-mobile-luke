import { forwardRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { InfantFilled, Plus } from '@pui/icon';
import { Action, ActionProps } from '@pui/action';

export interface PassengerCardProps extends Extract<ActionProps, { is?: 'button' }> {
  /** 이름 */
  name?: string;
  /** 생년월일 */
  dob?: string;
  /** 성별 */
  sex?: string;
  /** 국적 */
  nationality?: string;
  /** 여권 번호 */
  passportNumber?: string | null;
  /** 유아 동반 여부 */
  isInfantAccompanied?: boolean;
  /** 컴포넌트 상태 */
  status?: 'default' | 'add';
}

const PassengerCardComponent = forwardRef<HTMLButtonElement, PassengerCardProps>(
  ({ name, dob, sex, nationality, passportNumber, isInfantAccompanied, status = 'default', ...props }, ref) => {
    const theme = useTheme();
    const infantFilledIconProps = { size: '2.0rem', colorCode: theme.color.gray50 };
    const plusIconProps = { size: '2.4rem', colorCode: theme.color.gray50 };
    const nationalityClassName = `passenger-option-list-item nationality-text ${
      // eslint-disable-next-line no-nested-ternary
      passportNumber
        ? isInfantAccompanied
          ? 'international-short'
          : 'international-long'
        : isInfantAccompanied
        ? 'domestic-short'
        : 'domestic-long'
    }`;
    return (
      <>
        {status === 'default' ? (
          <Action {...props} is="button" ref={ref} className={props.className}>
            <span className="passenger-name">{name}</span>
            <span className="passenger-contents">
              <span className="passenger-info">
                <span className="passenger-option-name">{dob}</span>
                <span className="passenger-option-name">{sex}</span>
                <span className="passenger-option-list">
                  <span className={nationalityClassName}>{nationality}</span>
                  {passportNumber && <span className="passenger-option-list-item">{passportNumber}</span>}
                </span>
              </span>
              {isInfantAccompanied && (
                <span className="passenger-option-icon">
                  <InfantFilled {...infantFilledIconProps} />
                </span>
              )}
            </span>
          </Action>
        ) : (
          <Action {...props} is="button" ref={ref} className={props.className}>
            <div className="passenger-empty">
              <span className="btn-info">
                <Plus {...plusIconProps} />
                <span className="btn-title">추가</span>
              </span>
            </div>
          </Action>
        )}
      </>
    );
  },
);

export const PassengerCard = styled(PassengerCardComponent)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 9.6rem;
  max-width: 20.8rem;
  height: 9.6rem;
  width: 100%;
  padding: ${({ theme }) => `0 ${theme.spacing.s16}`};
  font: ${({ theme }) => theme.fontType.medium};
  color: ${({ theme }) => theme.color.text.textTertiary};
  border-radius: ${({ theme }) => theme.radius.r8};
  border: 0.1rem solid ${({ theme }) => theme.color.backgroundLayout.line};
  background: ${({ theme }) => theme.color.background.surface};

  .passenger-name {
    display: block;
    width: 100%;
    text-align: left;
    color: ${({ theme }) => theme.color.text.textTertiary};
    font: ${({ theme }) => theme.fontType.mediumB};
    ${({ theme }) => theme.mixin.ellipsis()};
  }

  .passenger-contents {
    display: flex;
    width: 100%;
    .passenger-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      margin: ${({ theme }) => `${theme.spacing.s4} ${theme.spacing.s4} 0 0`};

      .passenger-option-name {
        font: ${({ theme }) => theme.fontType.mini};
        color: ${({ theme }) => theme.color.text.textTertiary};
      }

      .passenger-option-list {
        display: flex;

        .passenger-option-list-item {
          display: inline-block;
          position: relative;
          padding-right: 1.7rem;
          color: ${({ theme }) => theme.color.text.textTertiary};
          font: ${({ theme }) => theme.fontType.mini};

          &.nationality-text {
            ${({ theme }) => theme.mixin.ellipsis()};

            &.domestic-short {
              max-width: 15.2rem;
            }
            &.domestic-long {
              max-width: 17.6rem;
            }
            &.international-short {
              max-width: 8.85rem;
            }
            &.international-long {
              max-width: 10.95rem;
            }
          }

          &:after {
            position: absolute;
            top: 50%;
            right: 0.8rem;
            width: 0.1rem;
            height: 1.2rem;
            transform: translateY(-50%);
            background: ${({ theme }) => theme.color.backgroundLayout.line};
            content: '';
          }
        }

        .passenger-option-list-item:last-child {
          padding-right: 0;

          &:after {
            display: none;
          }
        }
      }
    }

    .passenger-option-icon {
      display: flex;
      align-items: flex-end;
    }
  }

  .passenger-empty {
    align-self: center;
    & .btn-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      & .btn-title {
        margin-top: ${({ theme }) => theme.spacing.s4};
        color: ${({ theme }) => theme.color.text.textTertiary};
        font: ${({ theme }) => theme.fontType.small};
      }
    }
  }

  &${Action}:active {
    background: ${({ theme }) => theme.color.states.pressedCell};
  }
`;
