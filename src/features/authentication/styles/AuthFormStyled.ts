import styled from 'styled-components';

export const ContainerStyled = styled.form<{ disabled: boolean }>`
  .field-with-button {
    display: flex;
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing.s12};
  }

  .auth-phone {
    border: none;
  }

  &[disabled] .auth-phone .text-field input {
    touch-action: none;
    pointer-events: none;
    color: ${({ theme }) => theme.color.text.textDisabled};
  }

  .text-field-box,
  .text-field {
    width: 100%;
  }

  .form-field-container {
    line-height: 0;
    margin-bottom: ${({ theme }) => theme.spacing.s12};

    &:last-child {
      margin-bottom: 0;
    }
  }

  .auth-button {
    margin-left: ${({ theme }) => theme.spacing.s4};
  }

  .bottom-wrapper {
    margin-top: 2rem;
    background: ${({ theme }) => theme.color.background.surface};
    &.button-wrapper {
      padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    }
  }
`;

export const CountDownStyled = styled.div`
  display: flex;
  align-items: center;

  padding: ${({ theme }) => `0 ${theme.spacing.s8}`};
  height: 100%;

  color: ${({ theme }) => theme.color.black};
  font: ${({ theme }) => theme.fontType.medium};
`;
