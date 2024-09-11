import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Button } from '@pui/button';
import { env } from '@env';
import { linearEquation } from '@utils/linearEquation';

interface ResourceModel {
  imagePath: string;
  imageNamePrefix: string;
  imageExtension: string;
  imageList: HTMLImageElement[];
  imageListLen: number;
  defaultIndex: number;
  hasLoaded: boolean;
  minIdx: number;
  maxIdx: number;
}

const resource: ResourceModel = {
  imagePath: 'story/20230515/23de30aa-dba9-47c9-ac91-fd4494aedc94',
  imageNamePrefix: 'original_',
  imageExtension: 'jpg',
  imageList: [],
  imageListLen: 209,
  defaultIndex: 105,
  hasLoaded: false,
  minIdx: 1,
  maxIdx: 209,
};

const {
  endPoint: { cdnUrl },
} = env;

const getNumberWithThreeDigits = (num: number) => `${num}`.toString().padStart(3, '0');
const ProtoGyroSensorSequencePage = () => {
  const { isIOS } = useDeviceDetect();
  //
  const [alertStepIdx, setAlertStepIdx] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | null>(null);
  const [imageIndexList, setImageIndexList] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isInit, setIsInit] = useState(false);
  const [lerpValue, setLerpValue] = useState(0);
  // gamma
  const gammaX = useRef(0);
  const gammaBeforeX = useRef(0);
  const gammaLimit = 50;

  /** Function */
  const lerp = (start: number, end: number, amt: number) => {
    return start + (end - start) * amt;
  };

  const loadMemberImage = async (idx: number) => {
    const imageUrl = `${cdnUrl}/${resource.imagePath}/${resource.imageNamePrefix}${getNumberWithThreeDigits(idx + 1)}.${
      resource.imageExtension
    }`;
    const img = new Image();
    img.src = imageUrl;

    await new Promise((resolve) => {
      img.onload = () => {
        resolve(imageUrl);
      };
    }).then((result) => result);
    return img;
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    const { gamma } = event;

    if (!gamma) {
      return;
    }
    let gammaValue = gamma;

    if (gamma > gammaLimit) {
      gammaValue = gammaLimit;
    } else if (gamma < gammaLimit * -1) {
      gammaValue = gammaLimit * -1;
    }

    const currentX = (gammaValue + gammaLimit) * (windowWidth / (gammaLimit * 2));

    gammaX.current = currentX;

    if (gammaBeforeX.current === 0) {
      gammaBeforeX.current = currentX;
    }

    setLerpValue(lerp(gammaBeforeX.current, gammaX.current, 0.1));
  };

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const setSelectedImage = (idx: number) => {
    const { minIdx, maxIdx, imageListLen } = resource;
    const gap = maxIdx - minIdx;

    const convertedIdx = parseInt(`${(gap / imageListLen) * idx + minIdx}`, 10);
    // eslint-disable-next-line no-nested-ternary
    const finalIndx = convertedIdx < minIdx ? minIdx : convertedIdx > maxIdx ? maxIdx : convertedIdx;

    // add
    setImageIndexList(finalIndx);
  };

  const grantIos = async () => {
    /** @reference https://www.anycodings.com/1questions/162557/ios-deviceorientationevent-api-ampamp-typescript */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (DeviceOrientationEvent && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      window.alert(`[DeviceOrientationEvent] Permission: ${permission}`);

      setPermissionState(permission);
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setAlertStepIdx(1);
      } else {
        //
      }
    } else {
      alert('DeviceOrientationEvent is not defined');
    }
  };

  useEffect(() => {
    const { minIdx, maxIdx } = resource;
    const ratio = 360 / windowWidth;
    const indexValue = Math.floor(lerpValue * ratio);

    const idxx = linearEquation(indexValue, 0, 360, minIdx, maxIdx);
    setSelectedImage(idxx);

    gammaBeforeX.current = lerpValue;
  }, [lerpValue, windowWidth]);

  useEffect(() => {
    if (isInit) {
      if (!isIOS) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      window.addEventListener('resize', handleWindowResize, true);
      setWindowWidth(window.innerWidth);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInit]);

  const handleLoadImages = async () => {
    // Image Loading Process
    const totalImageLen = resource.imageListLen;

    // 기본 이미지 index 설정
    setImageIndexList(resource.defaultIndex);

    // 이미지 먼저 로드
    for (let j = 0; j < totalImageLen; j += 1) {
      // eslint-disable-next-line no-await-in-loop
      const img = await loadMemberImage(j);
      resource.imageList[j] = img;

      setLoadingProgress(Math.floor((j / totalImageLen) * 100));
    }
    resource.hasLoaded = true;
    setIsInit(true);
  };

  // Initializing
  useEffect(() => {
    handleLoadImages();

    return () => {
      //
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <div className="panel">
        <p>permissionState: {permissionState}</p>
        {!isInit ? (
          <>
            {!permissionState ? (
              <div>
                <Loading loadingProgress={loadingProgress} />
                {isIOS ? <Description /> : null}
              </div>
            ) : null}
            {/* 권한이 있을경우 팝업 */}
            {permissionState && (
              <>{permissionState !== 'granted' ? <Description /> : <Loading loadingProgress={loadingProgress} />}</>
            )}
          </>
        ) : (
          <div>
            <>
              {alertStepIdx === 0 && (
                <Button variant="primary" onClick={grantIos}>
                  센서 권한 작동
                </Button>
              )}
            </>
            <div>
              <div>
                {resource.hasLoaded ? (
                  <img src={resource.imageList[imageIndexList].src} alt="image_selected" />
                ) : (
                  <img src={resource.imageList[resource.defaultIndex].src} alt="image_default" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Description = () => {
  return (
    <div>
      <p>
        [동작 및 방향] 기능을 허용하지 않아,
        <br />
        본 컨텐츠를 사용하실 수 없습니다.
        <br />
        ‘취소’ 선택 시 정상적인 사용을 위해
        <br />
        어플리케이션을 종료하고 재시작 해주세요
      </p>
    </div>
  );
};

const Loading = ({ loadingProgress }: { loadingProgress: number }) => {
  return (
    <div>
      <p>
        이미지를 불러오는 중입니다.
        <br />
        잠시만 기다려 주세요.
      </p>
      <p>{loadingProgress}%</p>
    </div>
  );
};

const Wrapper = styled.div``;

export default ProtoGyroSensorSequencePage;
