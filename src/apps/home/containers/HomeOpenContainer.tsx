import React from 'react';
import { ServiceLogo as ServiceLogoLottie } from '@pui/lottie';
import { useTheme } from '@hooks/useTheme';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import logoSvg from '@assets/logo_prizm.svg';
import { AppleFilled as AppleFilledIcon, PlayStoreFilled as PlaystoreFilledIcon } from '@pui/icon';
import { VisualVideo } from '../components';
import { Wrapper, HeaderStyled, FloatingStyled, SectionStyled } from './HomeContainer.style';

const videoPath = '/static/video';
export const HomeOpenContainer: React.FC = () => {
  const { theme } = useTheme();
  const { isIOS, isMobile } = useDeviceDetect();
  const btnName = isIOS ? 'App Store' : 'Google Play';

  return (
    <Wrapper>
      <HeaderStyled>
        <a href="/" rel="noreferrer" className="logo-area">
          <ServiceLogoLottie height="2rem" lottieColor={theme.color.whiteLight} className="logo" />
        </a>
      </HeaderStyled>
      <FloatingStyled className="floating-area">
        {!isMobile ? (
          <>
            <div className="in-pc">
              <a
                className="floating-button open-version first"
                href="https://apps.apple.com/kr/app/prizm/id1605514692"
                target="_blank"
                rel="noreferrer"
              >
                <AppleFilledIcon className="app-icon" />
                <p>App Store</p>
              </a>
              <a
                className="floating-button open-version second"
                href="https://play.google.com/store/apps/details?id=com.rxc.prizm"
                target="_blank"
                rel="noreferrer"
              >
                <PlaystoreFilledIcon className="app-icon" />
                <p>Google Play</p>
              </a>
            </div>
          </>
        ) : (
          <a
            className="floating-button open-version"
            href="https://prizm.onelink.me/F39V/97379bb1"
            target="_blank"
            rel="noreferrer"
          >
            {isIOS ? <AppleFilledIcon className="app-icon" /> : <PlaystoreFilledIcon className="app-icon" />}
            <p>{btnName}</p>
          </a>
        )}
      </FloatingStyled>
      <SectionStyled>
        <VisualVideo url={`${videoPath}/main_video_0.mp4`} thresholdOfView={0} muted autoPlay loop resetOutsideOfView />
      </SectionStyled>
      <SectionStyled>
        <VisualVideo url={`${videoPath}/main_video_1.mp4`} thresholdOfView={0} muted autoPlay loop resetOutsideOfView />
      </SectionStyled>
      <SectionStyled>
        <VisualVideo url={`${videoPath}/main_video_3.mp4`} thresholdOfView={0} muted autoPlay loop resetOutsideOfView />
      </SectionStyled>
      <SectionStyled>
        <VisualVideo url={`${videoPath}/main_video_4.mp4`} thresholdOfView={0} muted autoPlay loop resetOutsideOfView />
      </SectionStyled>
      <SectionStyled>
        <VisualVideo url={`${videoPath}/main_video_5.mp4`} thresholdOfView={0} muted autoPlay loop resetOutsideOfView />
      </SectionStyled>
      <SectionStyled>
        <footer className="open-version">
          <div className="logo">
            <img src={logoSvg} alt="prizm" />
          </div>
          <div className="info">
            <p>
              (주)알엑스씨(RXC) | 사업자등록번호: 284-88-01847
              <br />
              통신판매업: 2021-서울강남-05596
              <br />
              이메일: <a href="mailto:contact@prizm.co.kr">contact@prizm.co.kr</a>
              <br />
              입점문의: <a href="mailto:partner@prizm.co.kr">partner@prizm.co.kr</a>
              <br />
              서울 특별시 강남구 선릉로 602
              <br />
              Copyright ©RXC, All rights reserved.
            </p>
          </div>
        </footer>
      </SectionStyled>
    </Wrapper>
  );
};
