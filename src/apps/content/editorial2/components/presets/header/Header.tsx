import { forwardRef, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styled, { keyframes } from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { getImageLink } from '@utils/link';
import { ContentsBackgroundType, HeaderSectionSize, VerticalAlignType } from '../../../constants';
import { useIntersection } from '../../../hooks';
import type {
  ContentLogInfoModel,
  HeaderDisplayModel,
  LogoStyledProps,
  PresetComponentModel,
  PresetRefModel,
} from '../../../models';
import { useLogService } from '../../../services';
import { useContentStore } from '../../../stores';

const HeaderComponent = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const { visible, presetId, presetType, contents } = preset;
  const displayValues = JSON.parse(contents) as HeaderDisplayModel;
  const { backgroundInfo, backgroundMedia, footerImage, logoImage, mainImage } = displayValues;
  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { logPresetHeaderInit } = useLogService();
  const { sectionRef, inView } = useIntersection({ once: true });
  const { isApp, isIOS } = useDeviceDetect();
  const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
  const [isActiveAnim, setIsActiveAnim] = useState(false);

  // 영역 높이
  const height = Math.floor((HeaderSectionSize.height / HeaderSectionSize.width) * document.body.offsetWidth);

  // 로고
  const getLogoXPosition = useMemo(() => {
    const imageW = logoImage.width || 1000;
    const imageH = logoImage.height || 1000;
    // 로고 타겟 X 포지션 계산
    const sectionHeight = (HeaderSectionSize.height * document.body.offsetWidth) / HeaderSectionSize.width;
    const targetX = (sectionHeight / imageH) * imageW - document.body.offsetWidth;
    return Math.abs(targetX) * -1;
  }, [logoImage.height, logoImage.width]);

  const logoStyled = {
    to: { x: getLogoXPosition },
    width: document.body.offsetWidth + Math.abs(getLogoXPosition),
  };

  useEffect(() => {
    if (inView) {
      setIsActiveAnim(true);
      logPresetHeaderInit(contentLogInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  /**
   * 헤더 컴포넌트의 경우 이미지를 미리 로드 후 페이지 렌더 처리
   * 이때 불필요한 모션, 로직을 제거하기 위해 Image 컴포넌트 대신 img 태그 사용
   * 단, ios앱에서 painting 차이가 있어 오퍼시티 트랜지션 별도 처리 진행
   */
  return (
    <div ref={ref} {...props}>
      {visible && (
        <HeaderContent
          className={classNames('content-wrapper', {
            'is-app': isApp,
            'is-ios': isIOS,
            'is-on': isActiveAnim,
          })}
          ref={sectionRef}
          {...displayValues}
        >
          <div className="view" style={{ paddingTop: height }}>
            <div className="bg">
              {!errorMedia && (
                <>
                  {backgroundInfo.type === ContentsBackgroundType.MEDIA && (
                    <img src={getImageLink(backgroundMedia.path)} onError={() => setErrorMedia(true)} alt="" />
                  )}
                </>
              )}
              {errorMedia && <div className="overlay-error" />}
            </div>

            <LogoStyled
              {...logoStyled}
              className={classNames('logo-img', {
                on: isActiveAnim,
              })}
            >
              <img src={getImageLink(logoImage.path)} alt="" />
            </LogoStyled>
            {mainImage.path && (
              <div
                className={classNames('main-img', {
                  on: isActiveAnim,
                })}
              >
                <img src={getImageLink(mainImage.path)} alt="" />
              </div>
            )}

            <div className="footer-img">
              <img src={getImageLink(footerImage.path)} alt="" />
            </div>
          </div>
        </HeaderContent>
      )}
    </div>
  );
});
const Header = styled(HeaderComponent)``;
export default Header;

const HeaderContent = styled('div').attrs((props: HeaderDisplayModel) => props)`
  position: relative;
  background-color: ${({ backgroundInfo }) =>
    backgroundInfo.type === ContentsBackgroundType.COLOR ? backgroundInfo.color : ''};

  .main-img {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: ${({ verticalAlign }) => (verticalAlign === VerticalAlignType.CENTER ? 'center' : 'flex-end')};
    height: 100%;
    transform: translate3d(100%, 0%, 0);

    img {
      flex-basis: 100%;
    }

    &.on {
      animation: ${({ verticalAlign }) => moveItem(verticalAlign === VerticalAlignType.CENTER ? 14 : 0)} 1s forwards
        ease-out;
    }
  }

  .view {
    overflow: hidden;
    position: relative;
    width: 100%;

    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;

      .video,
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        vertical-align: middle;
      }

      .overlay-error {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: ${({ theme }) => theme.color.gray8};
      }
    }
  }

  .footer-img {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }

  img {
    position: relative;
    width: inherit;
    height: inherit;
    border-radius: inherit;
  }

  &.is-app.is-ios {
    img {
      opacity: 0;
      transition: opacity 0.2s;
    }
    &.is-on {
      img {
        opacity: 1;
      }
    }
  }
`;

const LogoStyled = styled.div<LogoStyledProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ width }) => `${width}px`};
  height: 100%;
  transform: translate3d(0, 0, 0);

  img {
    height: 100%;
  }

  &.on {
    animation: ${({ to }) => moveLogo(to)} 1s forwards ease-out;
  }
`;

const moveItem = (degNum: number) => keyframes`
  0%  {transform: translate3d(100%, 0%, 0) rotate(${degNum}deg);}

  100% {transform: translate3d(0%, 0%, 0) rotate(0);}
`;

/**
 * 로고 영역
 * @param to
 * @returns
 */
const moveLogo = (to: { x: number }) => keyframes`
  0%{
    transform: translate3d(0,0,0);
  }

  100%{
    transform: translate3d(${to.x}px,0px,0px);
  }
`;
