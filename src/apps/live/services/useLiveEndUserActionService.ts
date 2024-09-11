import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { LiveActionType } from '../constants';

export type ReturnTypeUseLiveEndUserActionService = ReturnType<typeof useLiveEndUserActionService>;

/**
 * 라이브 종료화면 사용자 action service
 */
export const useLiveEndUserActionService = () => {
  const { openDialogToApp } = useMwebToAppDialog();

  /**
   * 사용자 액션
   */
  const handleAction = (actionType: LiveActionType) => {
    return async (event?: React.MouseEvent) => {
      event?.stopPropagation();

      switch (actionType) {
        case LiveActionType.LIVE_FOLLOW:
          openDialogToApp('', {
            actionProps: {
              kind: AppPopupActionKind.LIVE_FOLLOW,
            },
          });
          break;

        default:
          break;
      }
    };
  };

  return { handleAction };
};
