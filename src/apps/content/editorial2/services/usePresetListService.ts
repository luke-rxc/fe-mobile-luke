import { useCallback, useMemo } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import { PresetKey, PresetType } from '../constants';
import type { ContentPresetModel, PresetItemModel, PresetNavigationItemModel, PresetSectionModel } from '../models';
import { getPresetAnchor, getPresetVisible } from '../utils';

/**
 * 프리셋 리스트
 * @returns
 */
export const usePresetListService = ({
  list,
  displayDateTime,
}: {
  /** 프리셋 리스트 데이터 */
  list: ContentPresetModel[];
  /** 프리뷰 기준 시간 */
  displayDateTime: string;
}) => {
  const handleGetPresetItemList = useCallback(() => {
    const targetList: PresetItemModel[] = list.map((item: ContentPresetModel) => {
      const { componentGroup, componentType, sortNumber, contents, goodsList, couponList, eventList, voteList } = item;
      const visible = getPresetVisible(item, displayDateTime);
      return {
        presetGroup: componentGroup,
        presetType: componentType,
        presetId: sortNumber,
        contents,
        goodsList,
        couponList,
        eventList,
        voteList,
        navigationList: [],
        visible,
        anchor: visible && getPresetAnchor(item),
      };
    });

    const navigationIndex = targetList.findIndex((item) => item.presetType === PresetType.NAVIGATION);
    if (navigationIndex < 0) return targetList;

    const navigationEndIndex = targetList.length - 2; // 마지막 푸터 컴포넌트 전까지만 네비게이션 section으로 설정
    const navigationList: PresetNavigationItemModel[] = [];
    targetList.forEach((item, pIdx) => {
      const { contents } = item;
      const displayData = JSON.parse(contents);
      if (!item.visible) return; // 미노출 컴포넌트는 네비게이션 메뉴에서 제외
      if (!has(displayData, PresetKey.useNavigation)) return; // 네비게이션 앵커 사용 설정 안된 컴포넌트는 네비게이션 메뉴에서 제외
      // 네비게이션 컴포넌트 이전의 위치로 설정된 프리셋 컴포넌트는 네비게이션 메뉴에서 제외
      if (navigationIndex > pIdx) return;
      // 네비게이션 컴포넌트 종료 위치 이후로 설정된 프리셋 컴포넌트는 네비게이션 메뉴에서 제외
      if (navigationEndIndex < pIdx) return;

      const useNavigation = get(displayData, PresetKey.useNavigation);
      if (useNavigation) {
        const label = get(displayData, PresetKey.navigationLabel);
        navigationList.push({
          id: item.presetId,
          label,
        });
      }
    });

    targetList[navigationIndex].navigationList = navigationList;
    targetList[navigationIndex].visible = navigationList.length > 1; // 네비게이션 메뉴가 2개 이상인 경우에 네비게이션 컴포넌트 노출
    return targetList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const presetItems = useMemo(() => {
    return handleGetPresetItemList(); // 프리셋 전체 리스트
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const presetSection = useMemo(() => {
    const navigationIndex = presetItems.findIndex((item) => item.presetType === PresetType.NAVIGATION);
    if (navigationIndex < 0) {
      return [
        {
          type: 'NORMAL',
          items: presetItems,
        },
      ];
    }
    const navigationEndIndex = presetItems.length - 2; // 마지막 푸터 컴포넌트 전까지만 네비게이션 section으로 설정

    const head = presetItems.slice(0, navigationIndex);
    let tail = presetItems.slice(navigationIndex);
    let rest: PresetItemModel[] = [];

    if (navigationEndIndex) {
      tail = presetItems.slice(navigationIndex, navigationEndIndex + 1);
      rest = presetItems.slice(navigationEndIndex + 1);
    }
    const targetGroup = [head, tail, rest].filter((group) => group.length);
    // 네비게이션 섹션을 기준으로 group 구분
    const sections: PresetSectionModel[] = targetGroup.map((groupList) => {
      return {
        type: groupList.filter((item) => item.presetType === PresetType.NAVIGATION).length > 0 ? 'TAB' : 'NORMAL',
        items: groupList, // 프리셋 리스트
      };
    });
    return sections;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    presetSection,
  };
};
