import styled from 'styled-components';
import { Button } from '@pui/button';
import { useWebInterface } from '@hooks/useWebInterface';
import { CallAppTypes } from '@constants/webInterface';

export const WebInterfaceOpenContainer = () => {
  const { initialValues, close } = useWebInterface();

  const initialData = initialValues as {
    items: Array<{ id: number; text: string }> | null;
  };

  const handleClosePage = () => {
    close();
  };

  const handleClosePageWithToast = () => {
    close({ callAppType: CallAppTypes.ShowToastMessage, callAppParams: { message: 'Close With Toast!' } });
  };

  return (
    <WrapperStyled>
      <h2>initialData</h2>
      <hr />
      {initialData?.items?.map((item) => (
        <p key={item.id}>
          id: {item.id}, text: {item.text}
        </p>
      ))}
      <ButtonGroupStyled>
        <Button variant="primary" size="medium" children="closePage" onClick={handleClosePage} />
        <Button variant="primary" size="medium" children="closePageWithToast" onClick={handleClosePageWithToast} />
      </ButtonGroupStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2.4rem;

  h2:not(:first-child) {
    margin-top: 2rem;
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  gap: 1.2rem;
`;
