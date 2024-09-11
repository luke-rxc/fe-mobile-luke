// Reference: https://wiki.developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
export function storageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  let storage;

  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (error) {
    return !!(
      error instanceof DOMException &&
      // Firefox를 제외한 모든 브라우저
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // 코드가 존재하지 않을 수도 있기 떄문에 이름 필드도 확인합니다.
        // Firefox를 제외한 모든 브라우저
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // 이미 저장된 것이 있는 경우에만 QuotaExceededError를 확인
      storage &&
      storage.length !== 0
    );
  }
}

export function getLocalStorage(key: string) {
  if (!storageAvailable('localStorage')) {
    return null;
  }

  return localStorage.getItem(key);
}

export function getSessionStorage(key: string) {
  if (!storageAvailable('sessionStorage')) {
    return null;
  }

  return sessionStorage.getItem(key);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLocalStorage(key: string, value: any) {
  if (!storageAvailable('localStorage')) {
    return null;
  }
  return localStorage.setItem(key, value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setSessionStorage(key: string, value: any) {
  if (!storageAvailable('sessionStorage')) {
    return null;
  }
  return sessionStorage.setItem(key, value);
}

export function removeLocalStorage(key: string) {
  if (!storageAvailable('localStorage')) {
    return null;
  }
  return localStorage.removeItem(key);
}

export function removeSessionStorage(key: string) {
  if (!storageAvailable('sessionStorage')) {
    return null;
  }
  return sessionStorage.removeItem(key);
}
