import styled from 'styled-components';
import { Button } from '@pui/button';
import { useWebInterface } from '@hooks/useWebInterface';
import { webShare, WebShareOptionParams } from '@utils/webShare';

const ProtoSharePage = () => {
  const { showToastMessage, openShare } = useWebInterface();
  const webCallbackParams: Pick<WebShareOptionParams, 'onSuccess' | 'onError'> = {
    onSuccess: ({ type }) => {
      showToastMessage({
        message: type === 'share' ? '공유가 완료되었습니다' : '공유주소 복사가 성공하였습니다',
      });
    },
    onError: ({ type, error }) => {
      showToastMessage({
        message:
          type === 'share'
            ? `공유가 실패하였습니다. ErrorMessage: ${error?.message ?? ''}`
            : '공유주소 복사가 실패하였습니다',
      });
    },
  };
  const handleWebShare = async () => {
    await webShare({
      url: window.location.href,
      ...webCallbackParams,
    });
  };

  const handleOpenShareContent = () => {
    openShare({
      type: 'CONTENT',
      contentType: 'STORY',
      code: 'jawlflhl',
    });
  };

  const handleOpenShareShowroom = () => {
    openShare({
      type: 'SHOWROOM',
      code: 'checkin',
    });
  };

  const handleOpenShareGoods = () => {
    openShare({
      type: 'GOODS',
      code: 'kuqyidn',
    });
  };

  const handleOpenShareLive = () => {
    openShare({
      type: 'LIVE',
      id: 21773,
    });
  };

  const handleOpenShareTHRILL = () => {
    openShare({
      type: 'THRILL',
      code: 'vdhlr0qcpe',
    });
  };

  const handleOpenShareEtcCase = () => {
    openShare(
      {
        type: 'THRILL',
        code: 'l7xkby6cyf',
      },
      {
        // 예시
        url: 'https://mweb-dev.prizm.co.kr/goods/k6oyidn',
      },
    );
  };

  const handleOpenShareCbAfterContent = () => {
    openShare(
      {
        type: 'CONTENT',
        contentType: 'STORY',
        code: 'jawlflhl',
      },
      webCallbackParams,
    );
  };

  return (
    <Wrapper>
      <Button variant="primary" onClick={handleWebShare}>
        Web 전용 공유하기 (webShare Util)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareContent}>
        APP/WEB 공유(CONTENT) (openShare)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareShowroom}>
        APP/WEB 공유(SHOWROOM) (openShare)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareGoods}>
        APP/WEB 공유(GOODS) (openShare)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareLive}>
        APP/WEB 공유(LIVE) (openShare)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareTHRILL}>
        APP 공유(THRILL) (openShare)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareEtcCase}>
        APP/WEB이 서로 다른 주소로 공유시 (openShare)
      </Button>
      <hr />
      <Button variant="primary" onClick={handleOpenShareCbAfterContent}>
        APP/WEB 공유(CONTENT) + Web에서 공유이후 메시지 (openShare)
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 50rem;
`;

export default ProtoSharePage;
