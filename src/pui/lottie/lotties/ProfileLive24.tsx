import styled from 'styled-components';
import * as lottieProfileLive24 from '@assets/lotties/profile_live_24.json';
import { Lottie } from '../Lottie';

/**
 * 프로필 live 상태 - 24 size Lottie
 */
export const ProfileLive24 = styled(Lottie).attrs({ lottieData: lottieProfileLive24 })``;
