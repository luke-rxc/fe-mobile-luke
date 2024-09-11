import styled from 'styled-components';
import * as lottieVideoPlay from '@assets/lotties/video_play.json';
import { Lottie } from '../Lottie';

/**
 * 커스텀 플레이어 비디오 재생|정지 버튼 Lottie
 */
export const VideoPlay = styled(Lottie).attrs({ lottieData: lottieVideoPlay })``;
