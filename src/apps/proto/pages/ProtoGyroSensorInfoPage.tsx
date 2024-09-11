import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Checkbox } from '@pui/checkbox';

interface DeviceOrientationEventIos extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface GyroAccelerationModel {
  accelerationX: string;
  accelerationY: string;
  accelerationZ: string;
  accelerationIncludingGravityX: string;
  accelerationIncludingGravityY: string;
  accelerationIncludingGravityZ: string;
  interval: string;
  rotationRateAlpha: string;
  rotationRateBeta: string;
  rotationRateGamma: string;
}

interface GyroOrientationModel {
  alpha: string;
  beta: string;
  gamma: string;
}

// interface Gyro

const ProtoGyroSensorInfoPage = () => {
  /** native method */
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | null>(null);
  const { requestPermission } = DeviceOrientationEvent as unknown as DeviceOrientationEventIos;

  const [accelerationState, setAccelerationState] = useState<GyroAccelerationModel>({} as GyroAccelerationModel);
  const [orientationState, setOrientationState] = useState<GyroOrientationModel>({} as GyroOrientationModel);

  const [isIntMode, setIsIntMode] = useState(false);

  const getValue = (value?: number | null, isAccIntMode = false): string => {
    if (value) {
      return isAccIntMode ? value.toFixed(0) : value.toFixed(4);
    }

    return 'nothing value';
  };

  const handleDevicemotion = useCallback(
    (event: DeviceMotionEvent) => {
      const { acceleration, accelerationIncludingGravity, interval, rotationRate } = event;
      setAccelerationState({
        ...accelerationState,
        accelerationX: getValue(acceleration?.x, isIntMode),
        accelerationY: getValue(acceleration?.y, isIntMode),
        accelerationZ: getValue(acceleration?.z, isIntMode),
        accelerationIncludingGravityX: getValue(accelerationIncludingGravity?.x, isIntMode),
        accelerationIncludingGravityY: getValue(accelerationIncludingGravity?.y, isIntMode),
        accelerationIncludingGravityZ: getValue(accelerationIncludingGravity?.z, isIntMode),
        interval: getValue(interval, isIntMode),
        rotationRateAlpha: getValue(rotationRate?.alpha, isIntMode),
        rotationRateBeta: getValue(rotationRate?.beta, isIntMode),
        rotationRateGamma: getValue(rotationRate?.gamma, isIntMode),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isIntMode],
  );

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      setOrientationState({
        ...orientationState,
        alpha: getValue(alpha, isIntMode),
        beta: getValue(beta, isIntMode),
        gamma: getValue(gamma, isIntMode),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isIntMode],
  );

  const grantIos = async () => {
    if (DeviceOrientationEvent && typeof requestPermission === 'function') {
      const permission = await requestPermission();
      setPermissionState(permission);
    } else {
      alert('DeviceOrientationEvent is not defined');
    }
  };

  const handleAccelerationMode = () => {
    setIsIntMode((prev) => !prev);
  };

  useEffect(() => {
    if (permissionState === 'granted') {
      window.addEventListener('devicemotion', handleDevicemotion);
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (permissionState === 'granted') {
        window.removeEventListener('devicemotion', handleDevicemotion);
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [permissionState, handleDevicemotion, handleOrientation]);

  useEffect(() => {
    grantIos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WrapperStyled>
      <div className="info">
        <p className="check">
          센서 인증 여부(permissionState) : <span className="focus-txt">{permissionState}</span>
        </p>
        <p className="desc"> - granted(센서 사용 가능) / denied(센서 사용 불가)</p>
      </div>
      <hr />
      <Checkbox label="정수 값으로 표현" onChange={handleAccelerationMode} />
      <hr />
      <div className="info">
        <p className="check">
          <span>deviceorientation event</span>
        </p>
        <Summary title="alpha(Z-axis)" value={orientationState.alpha} />
        <Summary title="beta(X-axis)" value={orientationState.beta} />
        <Summary title="gamma(Y-axis)" value={orientationState.gamma} />
      </div>
      <hr />
      <div className="info">
        <p className="check">
          <span>devicemotion event</span>
        </p>
        <Summary title="accelerationX" value={accelerationState.accelerationX} />
        <Summary title="accelerationY" value={accelerationState.accelerationY} />
        <Summary title="accelerationZ" value={accelerationState.accelerationZ} />
        <Summary title="accelerationIncludingGravityX" value={accelerationState.accelerationIncludingGravityX} />
        <Summary title="accelerationIncludingGravityY" value={accelerationState.accelerationIncludingGravityY} />
        <Summary title="accelerationIncludingGravityZ" value={accelerationState.accelerationIncludingGravityZ} />
        <Summary title="interval" value={accelerationState.interval} />
        <Summary title="rotationRateAlpha(Gyroscope_z)" value={accelerationState.rotationRateAlpha} />
        <Summary title="rotationRateBeta(Gyroscope_x)" value={accelerationState.rotationRateBeta} />
        <Summary title="rotationRateGamma(Gyroscope_y)" value={accelerationState.rotationRateGamma} />
      </div>
      <hr />
    </WrapperStyled>
  );
};

const Summary = ({ title, value }: { title: string; value: string }) => {
  return (
    <SummaryStyled>
      <span className="title">{title}</span>
      <span className="desc">{value}</span>
    </SummaryStyled>
  );
};

const WrapperStyled = styled.div`
  padding: 2.4rem;
  .info {
    padding: 1.6rem 0;
    .check {
      font: ${({ theme }) => theme.fontType.t15B};
    }
    .focus-txt {
      color: ${({ theme }) => theme.color.yellow};
    }
    .desc {
      font-size: ${({ theme }) => theme.fontSize.s12};
    }
  }
`;

const SummaryStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.2rem 0;
  font-size: ${({ theme }) => theme.fontSize.s12};
  .title {
    font: ${({ theme }) => theme.fontType.t12B};
  }
  .desc {
    color: ${({ theme }) => theme.color.yellow};
  }
`;

export default ProtoGyroSensorInfoPage;
