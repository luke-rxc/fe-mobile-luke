import styled from 'styled-components';
import * as lottieProfileLive40 from '@assets/lotties/profile_live_40.json';
import { Lottie } from '../Lottie';

/**
 * 프로필 live 상태 - 40 size Lottie
 */
export const ProfileLive40 = styled(Lottie).attrs({ lottieData: lottieProfileLive40 })``;
