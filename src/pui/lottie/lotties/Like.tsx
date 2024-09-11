import styled from 'styled-components';
import * as lottieLike from '@assets/lotties/like.json';
import { Lottie } from '../Lottie';

/**
 * 좋아요 Lottie
 */
export const Like = styled(Lottie).attrs({ lottieData: lottieLike })``;
