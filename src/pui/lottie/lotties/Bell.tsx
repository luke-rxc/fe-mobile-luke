import styled from 'styled-components';
import * as lottieBell from '@assets/lotties/bell.json';
import { Lottie } from '../Lottie';

/**
 * 알림 Lottie
 */
export const Bell = styled(Lottie).attrs({ lottieData: lottieBell })``;
