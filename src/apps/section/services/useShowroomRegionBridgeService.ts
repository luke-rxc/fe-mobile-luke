import { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import isEmpty from 'lodash/isEmpty';
import { differenceInCalendarDays } from 'date-fns';
import env from '@env';
import { useWebInterface } from '@hooks/useWebInterface';
import { useQuery } from '@hooks/useQuery';
import { useModal } from '@hooks/useModal';
import { getDateRangeText } from '@features/datePicker/utils';
import { userAgent } from '@utils/ua';
import { getAppLink, getWebLink } from '@utils/link';
import { AppLinkTypes, WebLinkTypes } from '@constants/link';
import { emitClearReceiveValues } from '@utils/webInterface';
import { useDrawerModal } from '../hooks';
import { ShowroomRegionScheduleContainer } from '../containers/ShowroomRegionScheduleContainer';
import { ScheduleReceiveDataType, RegionScheduleType, RegionScheduleInitialDataType } from '../types/region';
import { ShowroomRegionQueryKey } from '../constants/region';
import { getShowroomRegion } from '../apis';
import { useShowroomRegionLog } from './logs';

interface Props {
  showroomId: number;
}

const fieldsInitialValues: RegionScheduleType = {
  region: '',
  schedule: {
    startDate: 0,
    endDate: 0,
  },
};

export const useShowroomRegionBridgeService = ({ showroomId }: Props) => {
  const { isApp } = userAgent();
  const { initialValues, receiveValues, open, close, alert } = useWebInterface();
  const { closeModal } = useModal();
  const { handleDrawerOpen } = useDrawerModal();

  /** select box 필드값 */
  const [fields, setFields] = useState<RegionScheduleType>(fieldsInitialValues);

  const { logTabRegionDatePicker: handleLogTabRegionDatePicker } = useShowroomRegionLog();

  const { data, isLoading } = useQuery(
    [ShowroomRegionQueryKey.SHOWROOM_META_QUERY_KEY, showroomId],
    () => getShowroomRegion({ showroomId }),
    {
      onError: () => {
        alert({ title: '일시적인 오류가 발생하였습니다', message: '다시 시도해주세요' });
      },
    },
  );

  const getDifferenceInDays = (start: number, end: number) => {
    return differenceInCalendarDays(new Date(end), new Date(start));
  };

  /** 완료 */
  const handleComplete = () => {
    const { region, schedule } = fields;
    const params = {
      rootPlace: region,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
    };

    const stayNights = getDifferenceInDays(schedule.startDate, schedule.endDate);
    handleLogTabRegionDatePicker(region, stayNights);

    close(params, {
      doWeb: () => {
        closeModal('', params);
      },
    });
  };

  /** 지역 선택 */
  const handleRegionChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setFields((prev) => {
      return {
        ...prev,
        region: evt.target.value,
      };
    });
  };

  /** 날짜 선택 */
  const handleOpenDatePicker = () => {
    const webLink = getWebLink(WebLinkTypes.SECTION_REGION_SCHEDULE, {});
    if (isApp) {
      const url = getAppLink(AppLinkTypes.WEB, {
        landingType: 'modal',
        url: `${env.endPoint.baseUrl}${webLink}`,
      });
      open({ url, initialData: {} });

      return;
    }

    handleDrawerOpen(ShowroomRegionScheduleContainer, {});
  };

  useUpdateEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }

    const { startDate, endDate } = receiveValues as ScheduleReceiveDataType;

    const stayNights = getDifferenceInDays(startDate, endDate);

    setFields((prev) => {
      return {
        ...prev,
        schedule: {
          ...(receiveValues as ScheduleReceiveDataType),
          label: getDateRangeText({ startDate, endDate, nights: stayNights, days: stayNights + 1 }),
        },
      };
    });

    emitClearReceiveValues();
  }, [receiveValues]);

  useEffect(() => {
    if (isEmpty(initialValues)) {
      return;
    }

    const { rootPlace, startDate, endDate } = initialValues as RegionScheduleInitialDataType;

    const stayNights = getDifferenceInDays(startDate, endDate);

    const region = data?.place.map(({ name }) => name).includes(rootPlace) ? rootPlace : '';

    setFields({
      region,
      schedule: {
        startDate,
        endDate,
        label: getDateRangeText({ startDate, endDate, nights: stayNights, days: stayNights + 1 }),
      },
    });
  }, [initialValues, data]);

  return { isLoading, regionList: data?.place, fields, handleRegionChange, handleOpenDatePicker, handleComplete };
};
