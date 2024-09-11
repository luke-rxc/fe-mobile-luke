import styled from 'styled-components';
import * as lottieProfileNew40 from '@assets/lotties/profile_new_40.json';
import { Lottie } from '../Lottie';

/**
 * 프로필 new 상태 - 40 size Lottie
 */
export const ProfileNew40 = styled(Lottie).attrs({ lottieData: lottieProfileNew40 })``;
