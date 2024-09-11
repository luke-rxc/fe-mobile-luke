import { useCallback, useRef } from 'react';
import { PresetType } from '../constants';
import type { PresetContents, PresetModel, PresetRefModel, ReplyComponentRefModel } from '../models';

/**
 * 컨텐츠 프리셋 제어 서비스
 */
export const useContentPresetService = ({
  onOpenReply,
}: {
  /** 댓글 오픈 콜백 */
  onOpenReply: () => void;
}): {
  /** preset 컴포넌트 참조리스트 */
  presetRefs: PresetRefModel[];
  /** preset 데이터참조리스트 */
  presetData: PresetModel<PresetContents>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRefComponent: (ref: any, preset: PresetModel<PresetContents>[]) => void;
  /** preset 데이터 정보 설정 */
  handleSetPresetData: (preset: PresetModel<PresetContents>[]) => void;
  /** 댓글 오픈 버튼 클릭 */
  handleClickReply: () => void;
  /** preset 컴포넌트 리셋 */
  handlePresetReset: () => void;
} => {
  const presetData = useRef<PresetModel<PresetContents>[]>([]); // 프리셋 리스트 데이터
  const refComps = useRef<PresetRefModel[]>([]); // 프리셋 component 리스트

  /** 프리셋 컴포넌트 element 레퍼 */
  const handleRefComponent = useCallback((ref: PresetRefModel) => {
    if (!ref) {
      return;
    }
    const totalListNum = presetData.current.length;
    if (refComps.current.length < totalListNum) {
      refComps.current = [...refComps.current, ref];
    }
  }, []);

  /** preset 리스트 데이터 정보 설정 */
  const handleSetPresetData = useCallback((preset: PresetModel<PresetContents>[]) => {
    presetData.current = preset;
  }, []);

  /**
   * 공통 헤더 댓글 오픈
   */
  const handleClickReply = useCallback(() => {
    if (!presetData.current || !presetData.current.length) {
      return;
    }

    const replyIdx = presetData.current.findIndex((comp) => comp.presetType === PresetType.REPLY);
    const replyComp = refComps.current[replyIdx] as ReplyComponentRefModel;
    if (replyComp) {
      replyComp.open();
      onOpenReply();
    }
  }, [onOpenReply]);

  const handlePresetReset = useCallback(() => {
    presetData.current = [];
    refComps.current = [];
  }, []);

  return {
    presetRefs: refComps.current,
    presetData: presetData.current,
    handleRefComponent,
    handleSetPresetData,
    handleClickReply,
    handlePresetReset,
  };
};
