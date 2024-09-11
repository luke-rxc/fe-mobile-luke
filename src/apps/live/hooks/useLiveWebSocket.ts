import env from '@env';
import { createDebug } from '@utils/debug';
import { useCallback, useEffect, useRef } from 'react';
import { startInterval } from '../utils/interval';

interface WebSocketInfo {
  ws: WebSocket | null;
  timer: NodeJS.Timeout | null;
  sendTimer: NodeJS.Timeout | null;
}

// retry 횟수
const RETRY_COUNT = 6;
// retry
const RETRY_INTERVAL = 10000;
const SEND_INTERVAL_SECOND = 30;

const debug = createDebug();

interface Props {
  // 사용가능 여부
  enabled: boolean;
  // 라이브 id
  liveId: number;
  // sendbird 연결가능 여부
  enabledSendbird: boolean;
  // 사용자 id
  userId: string;
}

/**
 * 라이브 웹소켓 hook
 */
export const useLiveWebSocket = ({ enabled, liveId, enabledSendbird, userId }: Props) => {
  const socketRef = useRef<WebSocketInfo>({ ws: null, timer: null, sendTimer: null });
  const connectRef = useRef<boolean>(false);

  const openWebSocket = (wsURL: string, retry: number) => {
    if (socketRef.current) {
      closeWebSocket();
    }
    const ws = new WebSocket(wsURL);
    socketRef.current.ws = ws;

    debug.info(`## 라이브 웹소켓 연결처리 -  url: ${ws.url}, ${retry > 0 ? `재시도 횟수: ${retry}` : ''}`);

    ws.onopen = () => {
      debug.info(`## 라이브 웹소켓 연결됨 - url: ${ws.url}, 상태: ${ws.readyState}`);
      connectRef.current = true;

      ws.onclose = (event) => {
        debug.info(`## 라이브 웹소켓 연결해제됨 - url: ${ws.url}, wasClean: ${event.wasClean}`);
        connectRef.current = false;
        if (!event.wasClean) {
          openWebSocket(ws.url, 0);
        }
      };

      const timer = startInterval(() => {
        debug.info(`## 라이브 웹소켓 메세지전송 - 전송간격: ${SEND_INTERVAL_SECOND}초, userId: ${userId}`);
        ws.send(userId);
      }, SEND_INTERVAL_SECOND);

      socketRef.current.sendTimer = timer;
    };

    ws.onerror = () => {
      if (retry >= RETRY_COUNT) {
        debug.error(`라이브 웹소켓 연결처리 종료 - url:  ${ws.url}`);
        return;
      }
      debug.error(`라이브 웹소켓 연결에러 - url:  ${ws.url}, 다음 연결시도 : ${RETRY_INTERVAL / 1000} seconds`);

      const timer = setTimeout(() => {
        debug.info(`## 라이브 웹소켓 연결 재시도 처리 - 연결여부: ${connectRef.current}`);
        !connectRef.current && openWebSocket(ws.url, retry + 1);
      }, RETRY_INTERVAL);

      socketRef.current.timer = timer;
    };
  };

  const closeWebSocket = () => {
    if (socketRef.current) {
      if (socketRef.current.timer) {
        debug.info('## 라이브 웹소켓 연결타이머 초기화');
        clearTimeout(socketRef.current.timer);
      }

      if (socketRef.current.sendTimer) {
        debug.info('## 라이브 웹소켓 전송타이머 초기화');
        clearTimeout(socketRef.current.sendTimer);
      }

      if (socketRef.current.ws) {
        debug.info('## 라이브 웹소켓 연결해제 처리');
        socketRef.current.ws.close(1000);
      }

      socketRef.current = {
        ws: null,
        timer: null,
        sendTimer: null,
      };
    }

    connectRef.current = false;
  };

  const handleVisibilityChange = useCallback(() => {
    if (!enabled || enabledSendbird) {
      debug.info('## 라이브 웹소켓 handleVisibilityChange 처리 스킵');
      return;
    }
    if (document.visibilityState === 'hidden') {
      debug.info('## background 전환: websocket close');
      closeWebSocket();
    } else {
      debug.info('## forground 전환: websocket open');
      openWebSocket(`${env.endPoint.liveWebSocketUrl}/live-metric/${liveId}`, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, enabledSendbird, liveId]);

  useEffect(() => {
    debug.info('## 라이브 웹소켓 사용가능 여부', enabled, ', ## sendbird 접속여부', enabledSendbird);

    if (enabled && !enabledSendbird && !connectRef.current) {
      openWebSocket(`${env.endPoint.liveWebSocketUrl}/live-metric/${liveId}`, 0);
    }
    return () => {
      closeWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledSendbird, enabled, connectRef]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, [handleVisibilityChange]);
};
