import { useEffect, useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { getImageLink } from '@utils/link';
import { useIntersection } from '@hooks/useIntersection';
import { HeaderSectionSize, ContentsBackgroundType } from '../../../constants';
import type {
  HeaderComponentRefModel,
  HeaderProps,
  HeaderStyledProps,
  ItemStyledProps,
  LogoStyledProps,
} from '../../../models';
import { useLogService } from '../../../services';
import { ImageStyled as ImageComponent } from '../Image';
import { HeaderStyled, ItemStyled, LogoStyled } from './Styled';

export const Header = forwardRef<HeaderComponentRefModel, HeaderProps>(
  ({ backgroundInfo, backgroundMedia, footerImage, logoImage, mainImage, verticalAlign, contentInfo }, ref) => {
    const [errorMedia, setErrorMedia] = useState<boolean>(false); // bg 미디어 에러상태
    const [isActiveAnim, setIsActiveAnim] = useState(false);
    // 백그라운드
    const headerStyled: HeaderStyledProps = {
      color: `${backgroundInfo.type === ContentsBackgroundType.COLOR ? backgroundInfo.color : ''}`,
      height: Math.floor((HeaderSectionSize.height / HeaderSectionSize.width) * document.body.offsetWidth) / 10,
    };
    // 로고
    const getLogoXPosition = useMemo(() => {
      const imageW = logoImage.width || 1000;
      const imageH = logoImage.height || 1000;
      // 로고 타겟 X 포지션 계산
      const sectionHeight = (HeaderSectionSize.height * document.body.offsetWidth) / HeaderSectionSize.width;
      const targetX = (sectionHeight / imageH) * imageW - document.body.offsetWidth;
      return Math.abs(targetX) * -1;
    }, [logoImage.height, logoImage.width]);

    const logoStyled: LogoStyledProps = {
      to: { x: getLogoXPosition },
      width: document.body.offsetWidth + Math.abs(getLogoXPosition),
    };
    // object 요소
    const itemStyled: ItemStyledProps = { verticalAlign };

    useEffect(() => {
      setIsActiveAnim(true);
    }, []);

    const { logPresetHeaderInit } = useLogService();
    const { inView, subscribe } = useIntersection(); // 뷰포트 교차
    const containerRef = useRef<HTMLDivElement>(null);
    const isFirstVisibleSection = useRef<boolean>(false);

    useImperativeHandle(ref, () => ({
      ref: containerRef.current as HTMLDivElement,
    }));

    // 뷰포트 교차
    useEffect(() => {
      if (containerRef.current) {
        subscribe(containerRef.current, { threshold: 0 });
      }
    }, [containerRef, subscribe]);
    useEffect(() => {
      if (inView && isFirstVisibleSection.current === false) {
        isFirstVisibleSection.current = true;
        logPresetHeaderInit(contentInfo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <HeaderStyled ref={containerRef} {...headerStyled}>
        <div className="view">
          <div className="bg">
            {!errorMedia && (
              <>
                {backgroundInfo.type === ContentsBackgroundType.MEDIA && (
                  <ImageComponent
                    src={getImageLink(backgroundMedia.path)}
                    blurHash={backgroundMedia.blurHash}
                    lazy
                    onError={() => setErrorMedia(true)}
                  />
                )}
              </>
            )}
            {errorMedia && <div className="overlay-error" />}
          </div>

          <LogoStyled {...logoStyled} className={isActiveAnim ? 'on' : ''}>
            <ImageComponent src={getImageLink(logoImage.path)} />
          </LogoStyled>
          {mainImage.path && (
            <ItemStyled {...itemStyled} className={isActiveAnim ? 'on' : ''}>
              <ImageComponent src={getImageLink(mainImage.path)} />
            </ItemStyled>
          )}

          <div className="footer">
            <ImageComponent src={getImageLink(footerImage.path)} lazy />
          </div>
        </div>
      </HeaderStyled>
    );
  },
);
