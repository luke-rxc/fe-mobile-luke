import { forwardRef } from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { ListItemButton } from '@pui/listItemButton';
import { Image } from '@pui/image';
import { Action } from '@pui/action';
import { ReactComponent as LogoGoogle } from '@assets/logo_google.svg';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { Clipboard } from '@pui/icon';
import { useWebInterface } from '@hooks/useWebInterface';
import { PlaceModel } from '../models';
import { ADDRESS_COPY_MESSAGE } from '../constants';

export interface GeoMapLocationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 위치 정보 */
  place: PlaceModel;
  /** 지도 클릭 이벤트 */
  onClickMap?: () => void;
  /** 복사 클릭 이벤트 */
  onClickCopy?: () => void;
}

const GeoMapLocationComponent = forwardRef<HTMLDivElement, GeoMapLocationProps>(
  ({ place, onClickMap, onClickCopy, ...rest }, ref) => {
    const { isApp } = useDeviceDetect();
    const { showToastMessage } = useWebInterface();

    const { address, name, mapImage, googleLink } = place;
    const { path, blurHash } = mapImage;

    const mapLink = isApp
      ? getAppLink(AppLinkTypes.EXTERNAL_WEB, { url: googleLink, barCollapsingEnabled: 'false' })
      : googleLink;

    const handleCopyAddress = () => {
      copy(address);
      showToastMessage({ message: ADDRESS_COPY_MESSAGE });
      onClickCopy?.();
    };

    return (
      <div ref={ref} {...rest}>
        <div className="map-wrapper">
          <Action className="map-image" is="a" link={mapLink} target="_blank" onClick={onClickMap}>
            <Image src={path} blurHash={blurHash} lazy />
            <LogoGoogle className="logo-google" />
          </Action>
        </div>
        <ListItemButton
          is="div"
          title={address}
          description={name}
          onClick={handleCopyAddress}
          suffix={
            <>
              <Clipboard size="1.8rem" />
              복사
            </>
          }
        />
      </div>
    );
  },
);

export const GeoMapLocation = styled(GeoMapLocationComponent)`
  .map-wrapper {
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    height: 9.6rem;
  }

  .map-image {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.radius.r8};

    &:active:after {
      opacity: 1;
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.states.pressedMedia};
      transition: opacity 0.2s;
      opacity: 0;
      content: '';
    }
  }

  .logo-google {
    ${({ theme }) => theme.absolute({ l: 8, b: 8 })};
  }
`;
