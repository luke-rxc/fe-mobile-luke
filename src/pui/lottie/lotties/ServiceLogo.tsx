import styled from 'styled-components';
import * as lottieServiceLogo from '@assets/lotties/service_logo.json';
import { Lottie } from '../Lottie';

/**
 * 서비스 웹 페이지 로고 Lottie
 */
export const ServiceLogo = styled(Lottie).attrs({ lottieData: lottieServiceLogo })``;
