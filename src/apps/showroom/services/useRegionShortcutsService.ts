/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { RegionShortcutListModel } from '../models';
import { useRegionShortcutListQuery } from './queries';
import { useLogService } from './useLogService';

interface UseReviewServiceProps {
  showroomId: number;
  showroomName: string;
  showroomCode: string;
  enabled?: boolean;
}

/**
 * 쇼룸 지역 숏컷 조회 Service
 */
export const useRegionShortcutsService = ({
  showroomId,
  showroomName,
  showroomCode,
  enabled = true,
}: UseReviewServiceProps) => {
  const { LogRegionShortcutImpression, LogRegionShortcutTab } = useLogService();
  const regionShortcutListQuery = useRegionShortcutListQuery({ showroomId, showroomCode }, { enabled });

  const handleImpression = useCallback<Required<RegionShortcutListModel>['onImpression']>(
    (regions) => {
      const shortcutName: string[] = [];
      const shortcutIndex: string[] = [];

      regions.forEach(({ name }, index) => {
        shortcutName.push(name);
        shortcutIndex.push(`${index + 1}`);
      });

      LogRegionShortcutImpression({ showroomId, showroomName, shortcutName, shortcutIndex });
    },
    [showroomId, showroomName],
  );

  const handleClickShortcut = useCallback<Required<RegionShortcutListModel>['onClickShortcut']>(
    (region, index) => {
      LogRegionShortcutTab({
        showroomId,
        showroomName,
        shortcutName: region.name,
        shortcutIndex: `${index + 1}`,
      });
    },
    [showroomId, showroomName],
  );

  return {
    regionShortcuts: regionShortcutListQuery.data?.regions &&
      !!regionShortcutListQuery.data.regions.length && {
        regions: regionShortcutListQuery.data.regions,
        onImpression: handleImpression,
        onClickShortcut: handleClickShortcut,
      },
  };
};
