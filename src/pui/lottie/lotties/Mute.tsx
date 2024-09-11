import styled from 'styled-components';
import * as lottieMute from '@assets/lotties/mute.json';
import { Lottie } from '../Lottie';

/**
 * 음소거 Lottie
 */
export const Mute = styled(Lottie).attrs({ lottieData: lottieMute })``;
