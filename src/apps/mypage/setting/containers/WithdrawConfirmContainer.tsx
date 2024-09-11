import { useEffect } from 'react';
import styled from 'styled-components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { Checkbox } from '@pui/checkbox';
import { Button } from '@pui/button';
import { PageError } from '@features/exception/components';
import { TitleSection } from '@pui/titleSection';
import { WithdrawConfirmContent } from '../components';
import { useWithdrawService } from '../services';

export const WithdrawConfirmContainer = () => {
  const { isChecked, isConfirm, hasReasonCode, handleCheckReasonCode, handleChecked, handleConfirm, handleGoHome } =
    useWithdrawService();
  const title = '탈퇴 시 아래 내용을\n반드시 확인해주세요';
  const description = [
    '서비스에서 활동한 모든 내역이 삭제됩니다.(이메일, SNS 계정 연동 정보 / 팔로잉한 쇼룸 정보 /  쇼핑백 및 위시리스트 목록)',
    '같은 계정 정보로는 30일 동안 재가입이 제한되며, 탈퇴를 철회하시려면 30일 내에 고객센터로 연락주세요.',
    '법령에 의해 일정기간 보관해야하는 항목은 정해진 보존기간 이후에 파기됩니다.',
  ];

  useEffect(() => {
    handleCheckReasonCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: '회원 탈퇴',
    quickMenus: ['cart', 'menu'],
  });

  /** 탈퇴 사유 코드 없이 접근 */
  if (!hasReasonCode) {
    return null;
  }

  /** 탈퇴 처리 완료 화면 */
  if (isConfirm) {
    return (
      <PageError
        isFull
        title="탈퇴를 완료했습니다"
        description="PRIZM을 이용해주셔서 감사합니다"
        actionLabel="확인"
        onAction={handleGoHome}
      />
    );
  }

  return (
    <>
      <TitleSection title="회원 탈퇴" />

      {/* 탈퇴 확인 내용 */}
      <WithdrawConfirmContent title={title} description={description} divider />

      <CheckboxWrapperStyled checked={isChecked} onChange={handleChecked}>
        위 내용을 모두 확인했습니다.
      </CheckboxWrapperStyled>
      <ButtonWrapperStyled>
        <Button variant="primary" size="large" disabled={!isChecked} block onClick={handleConfirm}>
          완료
        </Button>
      </ButtonWrapperStyled>
    </>
  );
};
const CheckboxWrapperStyled = styled(Checkbox)`
  padding: 1.5rem 2.4rem 0 1.6rem;
  font: ${({ theme }) => theme.fontType.t12};
  color: ${({ theme }) => theme.color.gray50};
`;
const ButtonWrapperStyled = styled.div`
  padding: 1.6rem 2.4rem 2.4rem;
`;
