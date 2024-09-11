import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { useQuery } from '@hooks/useQuery';
import { getAppLink, getWebLink } from '@utils/link';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { getContentsSchedule } from '../apis';
import { scheduleModalQueryKey } from '../constants';
import { ReturnTypeUseDrawerStatus } from '../hooks';
import { ScheduleItemModel, toScheduleModalListModel } from '../models';
import { ReturnTypeUseLiveLogService } from './useLogService';

interface Props {
  liveId: number;
  logService: ReturnTypeUseLiveLogService;
  enabledScheduleModal: boolean;
  scheduleDrawer: ReturnTypeUseDrawerStatus;
}

export const useScheduleModalService = ({ liveId, logService, enabledScheduleModal, scheduleDrawer }: Props) => {
  const { openDialogToApp } = useMwebToAppDialog();
  const [enabledSchedule, setEnabledSchedule] = useState<boolean>(false);
  const history = useHistory();
  const { logLiveTabModalScheduleContents: handleLogLiveTabModalScheduleContents } = logService;

  const { data: scheduleModalItems } = useQuery([scheduleModalQueryKey], () => getContentsSchedule(), {
    select: (data) => toScheduleModalListModel(data).filter((item) => item.liveSchedule.live.id !== liveId),
    enabled: enabledScheduleModal && enabledSchedule,
  });

  const handleOpenScheduleModal = () => {
    logService.logLiveViewModalSchedule();
    !enabledSchedule && setEnabledSchedule(true);
    scheduleDrawer.handleUpdateOpened(true);
  };

  const handleCloseScheduleModal = () => {
    scheduleDrawer.handleUpdateOpened(false);
  };

  /**
   * 컨텐츠 페이지 이동
   */
  const handleClickOpenContents = (item: ScheduleItemModel) => {
    return (event?: React.MouseEvent) => {
      event?.stopPropagation();

      if (item.landingType.match(/STORY|SCHEDULE_TEASER/)) {
        handleLogLiveTabModalScheduleContents(item);
      }
      switch (item.landingType) {
        case 'STORY':
          history.push(
            getWebLink(WebLinkTypes.CONTENT, {
              contentType: item.landingStory.contentsType.toLowerCase(),
              contentCode: item.landingStory.code,
            }),
          );
          break;
        case 'SCHEDULE_TEASER':
          openDialogToApp(getAppLink(AppLinkTypes.SCHEDULE));
          break;
        default:
      }
    };
  };

  return {
    scheduleModalItems,
    handleOpenScheduleModal,
    handleCloseScheduleModal,
    handleClickOpenContents,
  };
};
