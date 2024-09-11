import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@pui/textfield';
import { Button } from '@pui/button';
import { useDebounce } from '../hooks';

interface Props {
  isLoading?: boolean;
  onSubmit: () => void;
}

export const PrizmPayRegisterAliasForm = ({ isLoading = false, onSubmit: handleSubmit }: Props) => {
  const {
    register,
    formState: { isValid, isDirty, errors },
  } = useFormContext();
  const { debounce } = useDebounce();

  return (
    <ContainerStyled onSubmit={handleSubmit}>
      <div className="row">
        <label>
          <div className="field-container">
            <TextField
              {...register('alias', {
                required: {
                  value: true,
                  message: '최대 10자까지 등록할 수 있습니다',
                },
                validate: async (value) => {
                  await debounce(200);
                  return (
                    /^([a-zA-Z가-힣])[a-zA-Z가-힣 ]{0,9}$/.test(value) || '1-10자의 한글, 영문만 입력할 수 있습니다'
                  );
                },
              })}
              className="card-info-field"
              type="text"
              placeholder="최대 10자까지 등록 가능"
              error={isDirty && !isValid}
              helperText={errors?.alias?.message ?? ''}
            />
          </div>
        </label>
      </div>
      <div className="button-box">
        <Button type="submit" variant="primary" disabled={!isValid} size="large" block loading={isLoading} bold>
          완료
        </Button>
      </div>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.form`
  width: 100%;
  margin-top: 1.2rem;

  & label {
    width: 100%;

    span {
      font: ${({ theme }) => theme.fontType.t15B};
    }
  }

  & .card-info-field {
    width: 100%;
  }

  & .row {
    display: flex;
    flex-direction: column;
    padding: 0 2.4rem;
  }

  & span + .card-info-field {
    margin-top: 0.8rem;
  }

  .button-box {
    padding: 2.4rem;
  }
`;
