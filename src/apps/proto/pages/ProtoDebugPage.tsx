import generalDebug, { createDebug } from '@utils/debug';

// 권장
const debug = createDebug('proto:debug');

const ProtoDebugPage = () => {
  // 네임스페이스를 사용하지 않는 로그
  generalDebug.log('general log');
  generalDebug.info('info log');
  generalDebug.warn('warn log');
  generalDebug.error('error log');

  // 네임스페이스를 사용한 로그 (권장)
  debug.log('namespace - general log');
  debug.info('namespace - info log');
  debug.warn('namespace - warn log');
  debug.error('namespace - error log');

  return (
    <>
      <h2>@utils/debug</h2>
    </>
  );
};

export default ProtoDebugPage;
