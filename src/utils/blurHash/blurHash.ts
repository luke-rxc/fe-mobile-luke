import { decode as decodeOrigin } from 'blurhash';
import { nanoid } from '@utils/nanoid';
import BlurhashWorker from './BlurhashWorker.worker';
import CreateWorker from './worker';

const worker = new CreateWorker(BlurhashWorker);

/**
 * 워커 지원 여부를 확인하는 변수
 */
const isWorkerSupport = !!worker;

/**
 * 디코딩 결과를 처리하기 위한 콜백 함수들을 관리하는 객체
 */
const resolveCb: Record<string, (pixels: Uint8ClampedArray) => void> = {};

/**
 * 워커로부터 메시지를 수신하여 디코딩 결과를 처리하는 이벤트 리스너
 */
isWorkerSupport &&
  worker?.addEventListener('message', (resolve: MessageEvent) => {
    const { id, pixels } = resolve.data as { id: string; pixels: Uint8ClampedArray };
    const cb = resolveCb[id];
    cb?.(pixels);
  });

/**
 * 디코딩 옵션
 */
export type DecodeOptions = {
  blurHash: string;
  width?: number;
  height?: number;
  punch?: number;
};

/**
 * Base64로 인코딩된 이미지 데이터를 생성하는 함수입니다.
 * @param pixels - Uint8ClampedArray 형태의 픽셀 데이터
 * @param width - 이미지의 너비
 * @param height - 이미지의 높이
 * @returns string - 생성된 Base64 이미지 데이터
 */
const convertBase64 = (pixels: Uint8ClampedArray, width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);

    imgData.data.set(pixels);
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  }

  // getContext('2d')가 실패한 경우 빈 문자열 반환
  return '';
};

/**
 * blurHash를 디코딩하고 해당 이미지의 Base64 표현을 반환하는 함수
 * @param options - 디코딩 옵션을 포함하는 객체
 * @returns Promise<string> - 디코딩된 이미지의 Base64 표현을 담은 Promise 객체
 */
const decode = ({ blurHash, width = 32, height = 32, punch }: DecodeOptions) => {
  const canvas = document.createElement('canvas');

  // canvas를 생성하지 못한 경우 빈 문자열을 반환
  if (!canvas) {
    return Promise.resolve('');
  }

  // 워커가 없는 경우(메인 스레드에서 직접 디코딩)
  if (!worker) {
    const pixels = decodeOrigin(blurHash, width, height, punch);
    return Promise.resolve(convertBase64(pixels, width, height));
  }

  // 워커가 있는 경우(워커를 사용하여 디코딩)
  const id = nanoid();
  worker.postMessage({ id, blurHash, width, height, punch });

  // 디코딩이 완료될 때까지 기다리는 Promise 반환
  return new Promise<string>((resolve) => {
    resolveCb[id] = (pixels) => {
      resolve(convertBase64(pixels, width, height));
    };
  });
};

/**
 * 비동기적으로 blurHash를 디코딩하여 해당 이미지의 Base64 표현을 반환하는 함수
 * @param options - 디코딩 옵션을 포함하는 객체
 * @returns Promise<string> - 비동기적으로 생성된 Base64 이미지 표현을 담은 Promise 객체
 */
export const getBlurHashBase64WithAsync = async (options: DecodeOptions) => {
  const value = await decode(options);
  return value;
};

/**
 * blurHash를 디코딩하여 해당 이미지의 Base64 표현을 반환하는 함수
 */
export const getBlurHashBase64 = (blurHash: string | null, width = 32, height = 32): string | null => {
  if (!blurHash) {
    return null;
  }
  return convertBase64(decodeOrigin(blurHash, width, height), width, height);
};
