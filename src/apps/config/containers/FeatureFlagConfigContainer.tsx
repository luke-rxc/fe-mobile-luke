import { Checkbox } from '@pui/checkbox';
import { FeatureFlagsFlagType } from '@contexts/FeatureFlagsContext';
import { Divider } from '@pui/divider';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { useFeatureFlagConfigService } from '../services';

export const FeatureFlagConfigContainer = () => {
  const { formMethod, featureFlagList, handleSubmit, handleReset } = useFeatureFlagConfigService();
  const {
    register,
    formState: { isDirty },
  } = formMethod;

  return (
    <>
      <TitleStyled>Feature Flag 설정</TitleStyled>
      <Divider />
      <form onSubmit={handleSubmit}>
        <ItemsWrappedStyled>
          {featureFlagList.map((item) => {
            return (
              <ItemWrappedStyled key={item.type}>
                <div>
                  {item.type} ({item.description})
                </div>
                <Checkbox {...register(item.type)} disabled={item.flagType === FeatureFlagsFlagType.NORMAL} />
              </ItemWrappedStyled>
            );
          })}
        </ItemsWrappedStyled>
        <Divider />
        <ButtonGroupStyled>
          <Button variant="secondary" size="large" onClick={handleReset} bold block disabled={!isDirty}>
            초기화
          </Button>
          <Button type="submit" variant="primary" size="large" bold block disabled={!isDirty}>
            제출
          </Button>
        </ButtonGroupStyled>
      </form>
    </>
  );
};

const TitleStyled = styled.div`
  font-size: ${({ theme }) => theme.fontSize.s18};
  padding: 2rem;
`;

const ItemsWrappedStyled = styled.div`
  padding: 1rem 0;
`;

const ItemWrappedStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 2rem;
  margin-top: 1rem;
`;
