import styled from 'styled-components';
import * as lottieProfileNew128 from '@assets/lotties/profile_new_128.json';
import { Lottie } from '../Lottie';

/**
 * 프로필 new 상태 - 128 size Lottie
 */
export const ProfileNew128 = styled(Lottie).attrs({ lottieData: lottieProfileNew128 })``;
