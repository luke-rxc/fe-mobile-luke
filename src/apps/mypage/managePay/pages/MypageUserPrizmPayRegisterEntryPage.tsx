import { PrizmPayRegisterEntry } from '@features/prizmPay/components';
import { CALL_WEB_EVENT } from '@features/prizmPay/constants';
import { useWebInterface } from '@hooks/useWebInterface';
import { useCallback } from 'react';

const MypageUserPrizmPayRegisterEntryPage = () => {
  const { close } = useWebInterface();
  const handleAddCard = useCallback(() => {
    const params = {
      type: CALL_WEB_EVENT.ON_REGISTER_ENTRY_CLOSE,
    };

    close(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PrizmPayRegisterEntry onAddCard={handleAddCard} />;
};

export default MypageUserPrizmPayRegisterEntryPage;
