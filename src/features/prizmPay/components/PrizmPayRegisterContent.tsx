import { PrizmPayRegisterAliasForm } from './PrizmPayRegisterAliasForm';
import { PrizmPayRegisterCardInfoForm } from './PrizmPayRegisterCardInfoForm';

interface Props {
  prizmPayId?: number;
  onSubmit: () => void;
  onClickCardScan: () => void;
  // 사용자가 갖고 있는 카드가 없는 경우 무조건 default 처리
  isShowDefault: boolean;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
}

export const PrizmPayRegisterContent = ({
  prizmPayId,
  isShowDefault,
  isCreateLoading,
  isUpdateLoading,
  onSubmit: handleSubmit,
  onClickCardScan: handleClickCardScan,
}: Props) => {
  if (prizmPayId) {
    return <PrizmPayRegisterAliasForm onSubmit={handleSubmit} isLoading={isUpdateLoading} />;
  }
  return (
    <PrizmPayRegisterCardInfoForm
      onSubmit={handleSubmit}
      onClickCardScan={handleClickCardScan}
      isShowDefault={isShowDefault}
      isLoading={isCreateLoading}
    />
  );
};
