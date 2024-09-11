import styled from 'styled-components';
import * as lottieProfileLive128 from '@assets/lotties/profile_live_128.json';
import { Lottie } from '../Lottie';

/**
 * 프로필 live 상태 - 128 size Lottie
 */
export const ProfileLive128 = styled(Lottie).attrs({ lottieData: lottieProfileLive128 })``;
