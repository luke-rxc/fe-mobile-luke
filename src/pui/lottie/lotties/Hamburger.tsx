import styled from 'styled-components';
import * as ic_hamburger from '@assets/lotties/ic_hamburger.json';
import { Lottie } from '../Lottie';

/**
 * 알림 fill 타입 Lottie
 */
export const Hamburger = styled(Lottie).attrs({ lottieData: ic_hamburger })``;
