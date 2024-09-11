import { GenerateHapticFeedbackCustomKey, GenerateHapticFeedbackType } from '@constants/webInterface';
import { useWebInterface } from '@hooks/useWebInterface';
import { Button } from '@pui/button';
import styled from 'styled-components';

const ProtoHapticPage = () => {
  const { generateHapticFeedback } = useWebInterface();

  /**
   * generateHapticFeedback({ type, customKey });
   * @param type 템플릿에 속한 햅틱 피드백 타입명
   * @param customKey 템플릿에 속하지 않지만, 의도에 따라 커스텀한 햅틱 피드백 사용을 위한 Key(optional / 단, type이 custom인 경우에는 필수 입력)
   */

  return (
    <Container>
      <h2>Haptic Feedback (not custom)</h2>
      <hr />
      <ButtonGroup>
        <Button
          variant="primary"
          size="medium"
          children="Tap_light"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.TapLight })}
        />
        <Button
          variant="primary"
          size="medium"
          children="Tap_medium"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.TapMedium })}
        />
        <Button
          variant="primary"
          size="medium"
          children="Inform_delete"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.InformDelete })}
        />
        <Button
          variant="primary"
          size="medium"
          children="Inform_long press"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.InformLongPress })}
        />
        <Button
          variant="primary"
          size="medium"
          children="Confirm"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm })}
        />
        <Button
          variant="primary"
          size="medium"
          children="Success"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.Success })}
        />
        <Button
          variant="primary"
          size="medium"
          children="Error"
          onClick={() => generateHapticFeedback({ type: GenerateHapticFeedbackType.Error })}
        />
      </ButtonGroup>

      <h2>Haptic Feedback (Custom)</h2>
      <hr />
      <ButtonGroup>
        <Button
          variant="primary"
          size="medium"
          children="Custom_main showroom shortcut"
          onClick={() =>
            generateHapticFeedback({
              type: GenerateHapticFeedbackType.Custom,
              customKey: GenerateHapticFeedbackCustomKey.MainShowroomShortcutCollisionFirst,
            })
          }
        />
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2.4rem;

  h2:not(:first-child) {
    margin-top: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-gap: 0.8rem;
`;

export default ProtoHapticPage;
