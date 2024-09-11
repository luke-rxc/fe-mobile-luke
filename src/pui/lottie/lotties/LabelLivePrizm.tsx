import styled from 'styled-components';
import * as lottieLabelLivePrizm from '@assets/lotties/label_both.json';
import { Lottie } from '../Lottie';

/**
 * 라벨 프리즘 & 라이브 온리
 */
export const LabelLivePrizm = styled(Lottie).attrs({ lottieData: lottieLabelLivePrizm })``;
