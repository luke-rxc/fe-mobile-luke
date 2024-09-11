import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { Select } from '@pui/select';
import { TextField } from '@pui/textfield';

export interface Props {
  optionList: { label: string; value: string }[];
  placeholder: string;
  description?: string;
  validationMessages?: Record<string, string>;
  defaultSelect?: string;
  onChange: (message: string) => void;
}

export const CheckoutShippingMessage = ({
  optionList,
  placeholder,
  description,
  validationMessages,
  defaultSelect,
  onChange: handleChange,
}: Props) => {
  const {
    setValue,
    register,
    unregister,
    formState: { errors },
  } = useFormContext();
  const messageRegister = register('message');
  const [isShowDirectMessage, setIsShowDirectMessage] = useState(false);

  function handleShippingMessageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsShowDirectMessage(e.target.value === optionList.slice(-1)[0].value);
    if (e.target.value !== 'etc') {
      setValue('etcMessage', '');
    }

    handleChange(e.target.value);
  }

  useEffect(() => {
    if (!isShowDirectMessage) {
      unregister('etcMessage');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowDirectMessage]);

  useEffect(() => {
    defaultSelect && setValue('message', defaultSelect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelect]);

  return (
    <ContainerStyled>
      <div className="form-field-container">
        <Select
          {...messageRegister}
          ref={messageRegister.ref}
          onChange={(e) => {
            handleShippingMessageChange(e);
            messageRegister.onChange(e);
          }}
          placeholder={placeholder}
        >
          {optionList.map(({ label, value }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Select>
        {description && <p className="description">{description}</p>}
      </div>
      {isShowDirectMessage && (
        <div className="form-field-container">
          <TextField
            type="textarea"
            {...register('etcMessage', {
              required: {
                value: true,
                message: validationMessages?.required ?? '배송 요청 사항을 입력해주세요',
              },
              validate: {
                trim: (value) =>
                  /^[^ ]/.test(value) || (validationMessages?.required ?? '배송 요청 사항을 입력해주세요'),
              },
              maxLength: { value: 50, message: '최대 50자까지 입력할 수 있습니다' },
            })}
            className="etc-message"
            placeholder="최대 50자까지 입력할 수 있습니다"
            error={errors.etcMessage}
            helperText={errors.etcMessage?.message ?? ''}
          />
        </div>
      )}
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  width: 100%;

  .description {
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.text.textTertiary};
    padding-top: ${({ theme }) => theme.spacing.s8};
  }

  .textbox {
    padding: 1.6rem;
  }

  .etc-message {
    > div {
      min-height: 12rem;
      max-height: 12rem;
      flex-direction: row;
      flex-basis: 100%;
      flex-shrink: 1;
    }
  }

  .form-field-container {
    margin-bottom: ${({ theme }) => theme.spacing.s12};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
