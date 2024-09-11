import { LiveContentsType } from '@constants/live';
import styled, { keyframes } from 'styled-components';
import classNames from 'classnames';
import { Conditional } from '@pui/conditional';
import { ActionButtonType } from '../constants';
import { ReturnTypeUseLiveService } from '../services';
import { ActionButton } from './ActionButton';
import { useLiveFnbStore } from '../store';

type Props = ReturnTypeUseLiveService['actionButtons'] & {
  /**
   * 활성화된 button type
   */
  activeButtonType: ActionButtonType | undefined;

  inputFocused: boolean;

  /**
   * 버튼 활성화 처리 click event
   */
  onClickChangeActive: (buttonType: ActionButtonType | undefined) => void;
  /**
   * 앵커 포인트 버튼 click event
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onClickAnchor?: () => void;
  /**
   * 편성표 모달 버튼 click event
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onClickScheduleModal?: () => void;
  /**
   * FAQ 모달 버튼 click event
   */
  onClickFaqModal?: () => void;
};

const ActionInfo = {
  [LiveContentsType.STANDARD]: [ActionButtonType.CHAT, ActionButtonType.FAQ],
  [LiveContentsType.AUCTION]: [ActionButtonType.CHAT, ActionButtonType.FAQ, ActionButtonType.AUCTION],
};

export const ActionButtons = ({
  show,
  activeButtonType,
  contentsType,
  uiView,
  inputFocused,
  isPortait,
  onClickChangeActive,
  onClickScheduleModal,
  onClickFaqModal,
}: Props) => {
  const showFaq = useLiveFnbStore((state) => state.showFaq);
  const showFaqDot = useLiveFnbStore((state) => state.showFaqDot);
  const faqClassName = useLiveFnbStore((state) => state.faqClassName);
  const updateShowFaqDot = useLiveFnbStore((state) => state.updateShowFaqDot);

  if (!show || !contentsType) {
    return null;
  }

  const handleClickChangeActive = (buttonType: ActionButtonType) => {
    const updateButtonType = activeButtonType === buttonType ? ActionButtonType.EMPTY : buttonType;
    switch (buttonType) {
      case ActionButtonType.SCHEDULE:
        return onClickScheduleModal;
      case ActionButtonType.FAQ:
        return () => {
          updateShowFaqDot(false);
          onClickFaqModal?.();
        };

      default:
        return () => onClickChangeActive(updateButtonType);
    }
  };

  return (
    <GradationWrapperStyled className={classNames({ landscape: !isPortait })}>
      <ButtonGroupStyled className={uiView} $inputFocused={inputFocused}>
        {ActionInfo[contentsType].map((buttonType) => {
          if (buttonType === ActionButtonType.FAQ) {
            return (
              <Conditional
                condition={showFaq}
                key={buttonType}
                trueExp={
                  <ActionButton
                    buttonType={ActionButtonType.FAQ}
                    activeButtonType={activeButtonType}
                    showDot={showFaqDot}
                    className={faqClassName}
                    onClickAction={handleClickChangeActive}
                  />
                }
              />
            );
          }

          return (
            <ActionButton
              key={buttonType}
              buttonType={buttonType}
              activeButtonType={activeButtonType}
              onClickAction={handleClickChangeActive}
            />
          );
        })}
        <ActionButton
          buttonType={ActionButtonType.SCHEDULE}
          activeButtonType={activeButtonType}
          onClickAction={handleClickChangeActive}
        />
      </ButtonGroupStyled>
    </GradationWrapperStyled>
  );
};

const messageSlide = keyframes`
  from { transform: translateY(5.8rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const show = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const hide = keyframes`
  100% { opacity: 0 }
`;

export const GradationWrapperStyled = styled.div`
  ${({ theme }) => theme.fixed({ b: 0, l: 0 })};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 4;
  transform: translateY(5.8rem);
  ${({ theme }) => theme.mixin.safeArea('padding-bottom')};
  background-color: ${({ theme }) => theme.light.color.black};

  animation: 300ms linear 300ms normal forwards ${messageSlide};

  &.landscape {
    display: none;
  }
`;

const ButtonGroupStyled = styled.div<{ $inputFocused: boolean }>`
  width: 100%;
  height: 5.6rem;
  background-color: ${({ theme }) => theme.light.color.black};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > button {
    margin: 0 0.8rem !important;

    ${({ $inputFocused }) =>
      $inputFocused &&
      `
        visibility: hidden;
      `}

    @media screen and (min-width: 992px) {
      visibility: visible;
    }
  }

  &.hide {
    animation: 0.2s linear 0s normal forwards ${hide};
    pointer-events: none;
  }

  &.show {
    animation: 0.2s linear 0s normal forwards ${show};
  }
`;
