import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import isEmpty from 'lodash/isEmpty';
import { Image } from '@pui/image';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GoodsMetaInfo } from '../components';

export const ImageViewerContainer = () => {
  const { initialValues, setTopBar } = useWebInterface();
  const [imagePath, setImagePath] = useState('');
  const [imageBlurHash, setImageBlurHash] = useState(null);
  const { isIOS, isApp } = useDeviceDetect();

  const isIOSApp = isIOS && isApp;

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      const { imageData, topBarTitle } = initialValues;
      setImagePath(imageData.path);
      setImageBlurHash(imageData.blurHash);
      setTopBar({
        title: topBarTitle,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <>
      <GoodsMetaInfo scalable />
      <WrapperStyled className={isIOSApp ? 'is-ios-app' : ''}>
        {imagePath !== '' && <Image src={imagePath} blurHash={imageBlurHash} alt="image-viewer" />}
      </WrapperStyled>
    </>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  &.is-ios-app {
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }
  ${Image} {
    height: auto;
    &.is-success {
      background: ${({ theme }) => theme.color.background.bg};
    }
  }
`;
