// hooks
import { useCopyPath } from '@hooks/useCopyPath';
import { useScrollReset } from '@hooks/useScrollReset';

const ProtoPage = () => {
  /* hook test */
  // copy
  const copyToClipboard = useCopyPath();
  // scroll Reset after mount
  useScrollReset();
  return (
    <>
      <hr />
      <button type="button" onClick={() => copyToClipboard(window.location.pathname)}>
        클립보드 복사하기
      </button>
      <div style={{ height: '1300px', background: 'skyblue' }}>test bg</div>
    </>
  );
};

export default ProtoPage;
