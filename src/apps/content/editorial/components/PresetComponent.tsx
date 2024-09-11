import { createElement, forwardRef } from 'react';
import { get, has } from 'lodash';
import { PresetGroup, PresetType } from '../constants';
import type { PresetContents, PresetModel } from '../models';
import { PresetKey } from '../models';
import {
  Banner,
  BenefitGoodsA,
  BenefitGoodsB,
  BenefitListA,
  Blank,
  CouponDown,
  CouponFollow,
  Cta,
  DealListA,
  DealListB,
  DrawA,
  EmbedVideoA,
  Footer,
  Header,
  ImageViewer,
  MediaA,
  MediaB,
  MediaViewerA,
  MediaViewerB,
  Navigation,
  PlayViewer,
  Reply,
  TextA,
  VoteA,
} from './presets';

/**
 * 컴포넌트 리스트
 */
const presetList: {
  presetGroup: PresetGroup; // 프리셋 컴포넌트 그룹정보
  presetType: PresetType; // 프리셋 컴포넌트 네임
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FunctionComponent<any>; // 프리셋 컴포넌트
}[] = [
  {
    presetGroup: PresetGroup.BANNER,
    presetType: PresetType.BANNER,
    component: Banner,
  },
  {
    presetGroup: PresetGroup.BENEFIT_GOODS,
    presetType: PresetType.BENEFIT_GOODS_A,
    component: BenefitGoodsA,
  },
  {
    presetGroup: PresetGroup.BENEFIT_GOODS,
    presetType: PresetType.BENEFIT_GOODS_B,
    component: BenefitGoodsB,
  },
  {
    presetGroup: PresetGroup.BENEFIT_LIST,
    presetType: PresetType.BENEFIT_LIST_A,
    component: BenefitListA,
  },
  {
    presetGroup: PresetGroup.BLANK,
    presetType: PresetType.BLANK,
    component: Blank,
  },
  {
    presetGroup: PresetGroup.CTA,
    presetType: PresetType.CTA,
    component: Cta,
  },
  {
    presetGroup: PresetGroup.COUPON,
    presetType: PresetType.COUPON_DOWN,
    component: CouponDown,
  },
  {
    presetGroup: PresetGroup.COUPON,
    presetType: PresetType.COUPON_FOLLOW,
    component: CouponFollow,
  },
  {
    presetGroup: PresetGroup.DEAL,
    presetType: PresetType.DEAL_A,
    component: DealListA,
  },
  {
    presetGroup: PresetGroup.DEAL,
    presetType: PresetType.DEAL_B,
    component: DealListB,
  },
  {
    presetGroup: PresetGroup.DRAW,
    presetType: PresetType.DRAW_A,
    component: DrawA,
  },
  {
    presetGroup: PresetGroup.EMBED_VIDEO,
    presetType: PresetType.EMBED_VIDEO_A,
    component: EmbedVideoA,
  },
  {
    presetGroup: PresetGroup.FOOTER,
    presetType: PresetType.FOOTER,
    component: Footer,
  },
  {
    presetGroup: PresetGroup.HEADER,
    presetType: PresetType.HEADER,
    component: Header,
  },
  {
    presetGroup: PresetGroup.IMAGE_VIEWER,
    presetType: PresetType.IMAGE_VIEWER,
    component: ImageViewer,
  },
  {
    presetGroup: PresetGroup.MEDIA,
    presetType: PresetType.MEDIA_A,
    component: MediaA,
  },
  {
    presetGroup: PresetGroup.MEDIA,
    presetType: PresetType.MEDIA_B,
    component: MediaB,
  },
  {
    presetGroup: PresetGroup.MEDIA_VIEWER,
    presetType: PresetType.MEDIA_VIEWER_A,
    component: MediaViewerA,
  },
  {
    presetGroup: PresetGroup.MEDIA_VIEWER,
    presetType: PresetType.MEDIA_VIEWER_B,
    component: MediaViewerB,
  },
  {
    presetGroup: PresetGroup.NAVIGATION,
    presetType: PresetType.NAVIGATION,
    component: Navigation,
  },
  {
    presetGroup: PresetGroup.PLAY_VIEWER,
    presetType: PresetType.PLAY_VIEWER,
    component: PlayViewer,
  },
  {
    presetGroup: PresetGroup.REPLY,
    presetType: PresetType.REPLY,
    component: Reply,
  },
  {
    presetGroup: PresetGroup.TEXT,
    presetType: PresetType.TEXT,
    component: TextA,
  },
  {
    presetGroup: PresetGroup.VOTE,
    presetType: PresetType.VOTE_A,
    component: VoteA,
  },
];

export const PresetComponent = forwardRef<HTMLDivElement, PresetModel<PresetContents>>(
  (presetData: PresetModel<PresetContents>, ref) => {
    const { presetType, contents } = presetData;
    const Component = presetList.find((item) => item.presetType === presetType);
    if (!Component) {
      return null;
    }
    const isAnchor =
      !!get(contents, PresetKey.visible) === true &&
      has(contents, PresetKey.useNavigation) &&
      get(contents, PresetKey.useNavigation);
    return createElement(Component.component, { ...contents, ref, className: isAnchor ? 'is-anchor' : '' });
  },
);
