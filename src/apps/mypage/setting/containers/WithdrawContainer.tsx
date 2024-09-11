import { useEffect, useRef } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useLoading } from '@hooks/useLoading';
import { PageError } from '@features/exception/components';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { TitleSection } from '@pui/titleSection';
import { WithdrawContent, WithdrawSelectForm } from '../components';
import { useWithdrawService } from '../services';
import { checkError } from '../utils';

export const WithdrawContainer = () => {
  const { showLoading, hideLoading } = useLoading();
  const { isLoading, reasonError, isError, reasonItems, reasonCode, handleChangeReasonCode, handleWithdrawConfirm } =
    useWithdrawService();
  const inputRef = useRef<HTMLInputElement>(null);

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: '회원 탈퇴',
    quickMenus: ['cart', 'menu'],
  });

  const handleWithdrawConfirmCb = () => {
    if (reasonCode) {
      handleWithdrawConfirm(reasonCode, inputRef.current?.value);
    }
  };

  /**
   * 로딩바 처리
   */
  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  /** Loading 처리 */
  if (isLoading) {
    return null;
  }

  /** Error 처리 */
  if (reasonError && !checkError(reasonError) && isError) {
    return <PageError isFull description="일시적인 오류가 발생하였습니다" />;
  }

  return (
    <>
      <TitleSection title="회원 탈퇴" />
      <WithdrawContent title="탈퇴 사유를 알려주세요" description="남겨주신 의견으로 더 좋은 경험을 제공하겠습니다" />

      {/* 탈퇴 사유 */}
      <WithdrawSelectForm
        ref={inputRef}
        reasonItems={reasonItems}
        reasonCode={reasonCode}
        onChangeReasonCode={handleChangeReasonCode}
      />

      {reasonCode && (
        <ButtonWrapperStyled>
          <Button variant="primary" size="large" block onClick={handleWithdrawConfirmCb}>
            다음
          </Button>
        </ButtonWrapperStyled>
      )}
    </>
  );
};
const ButtonWrapperStyled = styled.div`
  padding: 0 2.4rem 0;
`;
