import styled from 'styled-components';
import * as lottieProfileNew24 from '@assets/lotties/profile_new_24.json';
import { Lottie } from '../Lottie';

/**
 * 프로필 new 상태 - 24 size Lottie
 */
export const ProfileNew24 = styled(Lottie).attrs({ lottieData: lottieProfileNew24 })``;
