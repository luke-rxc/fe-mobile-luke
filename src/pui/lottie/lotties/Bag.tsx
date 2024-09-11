import styled from 'styled-components';
import * as lottieBag from '@assets/lotties/ic_addtobag.json';
import { Lottie } from '../Lottie';

/**
 * 당첨자 발표 폭죽 Lottie
 */
export const Bag = styled(Lottie).attrs({ lottieData: lottieBag })``;
