import get from 'lodash/get';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryString } from '@hooks/useQueryString';
import { SectionType } from '../types';
import { SectionTypes } from '../constants';

/**
 * useSection hooks
 */
export const useSection = () => {
  const { sectionId, sectionType } = useParams<{ sectionId: string; sectionType?: Lowercase<SectionType> }>();
  const { section } = useQueryString<{ section: Lowercase<SectionType> }>();

  /**
   * 현재 활성화된 섹션
   */
  const activeSection = useMemo<SectionType>(() => {
    return get(SectionTypes, (sectionType || section || '').toLocaleUpperCase(), SectionTypes.GOODS);
  }, [sectionType, section]);

  /**
   * 파라미터로 받은 타입이 현재 활성화된 섹션과 일치하는가?
   */
  const isActiveSection = (type: ValueOf<typeof SectionTypes>) => {
    return activeSection === type;
  };

  return { sectionId, activeSection, isActiveSection };
};
