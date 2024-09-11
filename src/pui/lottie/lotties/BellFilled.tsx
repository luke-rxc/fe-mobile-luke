import styled from 'styled-components';
import * as lottieBellFilled from '@assets/lotties/bell_filled.json';
import { Lottie } from '../Lottie';

/**
 * 알림 fill 타입 Lottie
 */
export const BellFilled = styled(Lottie).attrs({ lottieData: lottieBellFilled })``;
