import { ForwardedRef, forwardRef } from 'react';
import { PresetType } from '../constants';
import type { PresetItemModel, PresetRefModel } from '../models';
import Banner from './presets/banner/Banner';
import BenefitGoodsA from './presets/benefitGoodsA/BenefitGoodsA';
import BenefitGoodsB from './presets/benefitGoodsB/BenefitGoodsB';
import BenefitListA from './presets/benefitListA/BenefitListA';
import Blank from './presets/blank/Blank';
import CouponDown from './presets/couponDown/CouponDown';
import CouponFollow from './presets/couponFollow/CouponFollow';
import CTA from './presets/cta/Cta';
import DealListA from './presets/dealListA/DealListA';
import DealListB from './presets/dealListB/DealListB';
import DrawA from './presets/drawA/DrawA';
import EmbedVideoA from './presets/embedVideoA/EmbedVideoA';
import Footer from './presets/footer/Footer';
import Header from './presets/header/Header';
import ImageViewer from './presets/imageViewer/ImageViewer';
import MediaA from './presets/mediaA/MediaA';
import MediaB from './presets/mediaB/MediaB';
import MediaViewerA from './presets/mediaViewerA/MediaViewerA';
import MediaViewerB from './presets/mediaViewerB/MediaViewerB';
import Navigation from './presets/navigation/Navigation';
import PlayViewer from './presets/playViewer/PlayViewer';
import Reply from './presets/reply/Reply';
import TextA from './presets/textA/TextA';
import VoteA from './presets/voteA/VoteA';

type PresetComponentProps = {
  preset: PresetItemModel;
};
export const PresetComponent = forwardRef<PresetRefModel, PresetComponentProps>(({ preset }, ref) => {
  const { presetType, anchor, presetId } = preset;
  const props: {
    id?: string;
    className?: string;
    preset: PresetItemModel;
    ref: ForwardedRef<PresetRefModel>;
  } = {
    ...(anchor && { id: `preset-${presetId}` }),
    ...(anchor && { className: 'is-anchor' }),
    preset,
    ref,
  };
  return (
    <>
      {presetType === PresetType.BANNER && <Banner {...props} />}
      {presetType === PresetType.BENEFIT_GOODS_A && <BenefitGoodsA {...props} />}
      {presetType === PresetType.BENEFIT_GOODS_B && <BenefitGoodsB {...props} />}
      {presetType === PresetType.BENEFIT_LIST_A && <BenefitListA {...props} />}
      {presetType === PresetType.BLANK && <Blank {...props} />}
      {presetType === PresetType.COUPON_DOWN && <CouponDown {...props} />}
      {presetType === PresetType.COUPON_FOLLOW && <CouponFollow {...props} />}
      {presetType === PresetType.CTA && <CTA {...props} />}
      {presetType === PresetType.DEAL_A && <DealListA {...props} />}
      {presetType === PresetType.DEAL_B && <DealListB {...props} />}
      {presetType === PresetType.DRAW_A && <DrawA {...props} />}
      {presetType === PresetType.EMBED_VIDEO_A && <EmbedVideoA {...props} />}
      {presetType === PresetType.FOOTER && <Footer {...props} />}
      {presetType === PresetType.HEADER && <Header {...props} />}
      {presetType === PresetType.IMAGE_VIEWER && <ImageViewer {...props} />}
      {presetType === PresetType.MEDIA_A && <MediaA {...props} />}
      {presetType === PresetType.MEDIA_B && <MediaB {...props} />}
      {presetType === PresetType.MEDIA_VIEWER_A && <MediaViewerA {...props} />}
      {presetType === PresetType.MEDIA_VIEWER_B && <MediaViewerB {...props} />}
      {presetType === PresetType.NAVIGATION && <Navigation {...props} />}
      {presetType === PresetType.PLAY_VIEWER && <PlayViewer {...props} />}
      {presetType === PresetType.REPLY && <Reply {...props} />}
      {presetType === PresetType.TEXT && <TextA {...props} />}
      {presetType === PresetType.VOTE_A && <VoteA {...props} />}
    </>
  );
});
