import { createContext, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { getLocalStorage } from '@utils/storage';
import { FEATURE_FLAG } from '@constants/featureFlag';
import { isAppVersionLatestCheck } from '@utils/web2App';
import { userAgent } from '@utils/ua';
import merge from 'lodash/merge';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';

/**
 * Feature Flags Type
 */
export const FeatureFlagsType = {
  CONTENT_STATE: 'CONTENT_STATE',
  MWEB_DEV: 'MWEB_DEV',
  REACT_QUERY_DEVTOOLS: 'REACT_QUERY_DEVTOOLS',
  PLP: 'PLP',
  PLP_GOODS_IMPROVEMENT: 'PLP_GOODS_IMPROVEMENT',
  MY_PAGE_ORDER_STATE: 'MYP_PAGE_ORDER_STATE',
  TICKET_GOODS_REVIEW: 'TICKET_GOODS_REVIEW',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FeatureFlagsType = typeof FeatureFlagsType[keyof typeof FeatureFlagsType];

/**
 * Feature Flags Flag Type
 */
export const FeatureFlagsFlagType = {
  NORMAL: 'NORMAL',
  LOCAL_STORAGE: 'LOCAL_STORAGE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type FeatureFlagsFlagType = typeof FeatureFlagsFlagType[keyof typeof FeatureFlagsFlagType];

export interface FeatureFlagsContextValue {
  featureFlags: Array<FeatureFlagsItem>;
  updateFeatureFlags: (updateFlags: Array<FeatureFlagsItem>) => void;
}

export interface FeatureFlagsItem {
  // Feature Flag type
  type: string;
  // 설명
  description: string;
  // Feature Flag 사용여부
  flag: boolean;
  // Feature Flag flag type
  flagType: string;
}

const initialFeatureFlagsValues: Array<FeatureFlagsItem> = [
  {
    type: FeatureFlagsType.CONTENT_STATE,
    description: '콘텐츠 v2',
    flag: false,
    flagType: FeatureFlagsFlagType.LOCAL_STORAGE,
  },
  {
    type: FeatureFlagsType.MWEB_DEV,
    description: '모바일',
    flag: true,
    flagType: FeatureFlagsFlagType.NORMAL,
  },
  {
    type: FeatureFlagsType.REACT_QUERY_DEVTOOLS,
    description: '사용여부',
    flag: false,
    flagType: FeatureFlagsFlagType.LOCAL_STORAGE,
  },
  {
    type: FeatureFlagsType.PLP,
    description: 'PLP',
    /**
     * @description
     * PLP 혜택 개선 노출 조건
     * - MWEB
     * - APP 1.7.0 이상
     */
    flag: !userAgent().isApp || isAppVersionLatestCheck('1.17.0'),
    flagType: FeatureFlagsFlagType.NORMAL,
  },
  {
    type: FeatureFlagsType.MY_PAGE_ORDER_STATE,
    description: 'PLP',
    /**
     * MYPAGE > 주문상세 > purchaseStatusUpdated 인터페이스 적용
     * - MWEB
     * - APP 1.38.0 이상
     */
    flag: !userAgent().isApp || isAppVersionLatestCheck('1.38.0'),
    flagType: FeatureFlagsFlagType.NORMAL,
  },
  {
    type: FeatureFlagsType.TICKET_GOODS_REVIEW,
    description: '티켓 상품 리뷰 개선 작업',
    flag: !userAgent().isApp || isAppVersionLatestCheck('1.39.0'),
    flagType: FeatureFlagsFlagType.NORMAL,
  },
];

interface FeatureFlagsProviderProps {
  children?: ReactNode;
}

export const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({
  featureFlags: initialFeatureFlagsValues,
  updateFeatureFlags: () => {},
});

export const FeatureFlagsProvider: FC<FeatureFlagsProviderProps> = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState<Array<FeatureFlagsItem>>([]);

  useEffect(() => {
    // 1. initialFeatureFlagsValues 선언된 type 중 flagType이 LOCAL_STORAGE인 항목의 type array 변수 설정
    const filteringLocalStorageFlagTypes = initialFeatureFlagsValues
      .filter((item) => item.flagType === FeatureFlagsFlagType.LOCAL_STORAGE)
      .map((item) => item.type);
    // 2. local storage에 저장되어 있는 feature flag 조회
    const featureFlagStringText = getLocalStorage(FEATURE_FLAG) ?? null;
    // 3. local stoage에서 조회된 feature flag에서 initialFeatureFlagsValues 선언된 type만 filtering
    const featureFlagLocalStorage = featureFlagStringText
      ? (JSON.parse(featureFlagStringText) as Array<FeatureFlagsItem>).filter((item) =>
          filteringLocalStorageFlagTypes.includes(item.type),
        )
      : ([] as Array<FeatureFlagsItem>);
    // 4. initialFeatureFlagsValues 에 featureFlagLocalStorage merge
    const updateFeatureFlagValues = values(
      merge(keyBy(initialFeatureFlagsValues, 'type'), keyBy(featureFlagLocalStorage ?? [], 'type')),
    );
    // 5. feature flag state 업데이트
    setFeatureFlags(updateFeatureFlagValues);
  }, []);

  const updateFeatureFlags = (updateFlags: Array<FeatureFlagsItem>) => {
    setFeatureFlags(updateFlags);
  };

  return (
    <FeatureFlagsContext.Provider value={{ featureFlags, updateFeatureFlags }}>{children}</FeatureFlagsContext.Provider>
  );
};
