import styled from 'styled-components';
import * as lottieCheckMark from '@assets/lotties/ic_checkmark.json';
import { Lottie } from '../Lottie';

/**
 * 체크박스 Lottie
 */
export const CheckMark = styled(Lottie).attrs({ lottieData: lottieCheckMark })``;
