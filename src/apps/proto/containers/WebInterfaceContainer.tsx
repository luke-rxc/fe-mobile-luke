import { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { CallAppTypes } from '@constants/webInterface';

export const WebInterfaceContainer = () => {
  const {
    open,
    reload,
    receiveValues,
    setTopBar,
    showToastMessage,
    showSnackbar,
    signIn,
    reIssue,
    alert,
    confirm,
    prompt,
  } = useWebInterface();

  const { isApp } = useDeviceDetect();

  useEffect(() => {
    if (receiveValues?.callAppType === CallAppTypes.ShowToastMessage) {
      showToastMessage({ message: 'Close With Toast!' });
      // showToastMessage({ message: 'Close With Toast!' });
    }

    /** @issue showToastMessage 목록이 계속 갱신되기 때문에 deps 목록에서 제외 */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  const handleOpenPage = async () => {
    const webUrl = 'http://mweb-local.prizm.co.kr:3000/proto/webinterface/open';
    const url = isApp ? `prizm://prizm.co.kr/web/push?link=${encodeURIComponent(webUrl)}` : webUrl;
    open({
      url,
      initialData: {
        items: [
          { id: 1, text: 'first' },
          { id: 2, text: 'second' },
        ],
      },
    });
  };

  const handleReloadPage = async () => {
    reload();
  };

  const handleSetTopBar = async () => {
    setTopBar({ title: 'Test Title' });
  };

  const handleShowToastMessage = async () => {
    showToastMessage({ message: 'Test Message' });
  };

  const handleShowSnackbar = async () => {
    showSnackbar({ title: 'Test Title', isAutoClose: false });
  };

  const handleSignIn = async () => {
    const result = await signIn();

    window.alert(`result: ${JSON.stringify(result)}`);
  };

  const handleReIssue = async () => {
    const result = await reIssue();

    window.alert(`result: ${JSON.stringify(result)}`);
  };

  const handleAlert = async () => {
    const result = await alert({ title: 'Test Title', message: 'Test Message' });

    window.alert(`result: ${JSON.stringify(result)}`);
  };

  const handleConfirm = async () => {
    const result = await confirm({ title: 'Test Title', message: 'Test Message' });

    window.alert(`result: ${JSON.stringify(result)}`);
  };

  const handlePromptNum = async () => {
    const result = await prompt({ title: 'Test Title', message: 'Test Message' });

    window.alert(`result: ${JSON.stringify(result)}`);
  };

  const handlePromptText = async () => {
    const result = await prompt(
      { title: 'Test Title', message: 'Test Message', placeholder: 'Text Placeholder' },
      {
        numeric: false,
      },
    );

    window.alert(`result: ${JSON.stringify(result)}`);
  };

  return (
    <WrapperStyled>
      <h2>openPage(closePage) / reloadPage</h2>
      <hr />
      <ButtonGroupStyled>
        <Button variant="primary" size="medium" children="open" onClick={handleOpenPage} />
        <Button variant="primary" size="medium" children="reload" onClick={handleReloadPage} />
      </ButtonGroupStyled>
      <h2>setTopBar</h2>
      <hr />
      <ButtonGroupStyled>
        <Button variant="primary" size="medium" children="setTopBar" onClick={handleSetTopBar} />
      </ButtonGroupStyled>
      <h2>Toast, Snackbar</h2>
      <hr />
      <ButtonGroupStyled>
        <Button variant="primary" size="medium" children="showToastMessage" onClick={handleShowToastMessage} />
        <Button variant="primary" size="medium" children="showSnackbar" onClick={handleShowSnackbar} />
      </ButtonGroupStyled>
      <h2>signIn / reIssue</h2>
      <hr />
      <ButtonGroupStyled>
        <Button variant="primary" size="medium" children="signIn" onClick={handleSignIn} />
        <Button variant="primary" size="medium" children="reissue" onClick={handleReIssue} />
      </ButtonGroupStyled>
      <h2>showAlertMessage</h2>
      <hr />
      <ButtonGroupStyled>
        <Button variant="primary" size="medium" children="alert" onClick={handleAlert} />
        <Button variant="primary" size="medium" children="confirm" onClick={handleConfirm} />
        <Button variant="primary" size="medium" children="prompt_num" onClick={handlePromptNum} />
        <Button variant="primary" size="medium" children="prompt_text" onClick={handlePromptText} />
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
