import { Action } from '@pui/action';
import { Checkbox } from '@pui/checkbox';
import { Divider } from '@pui/divider';
import React, { HTMLAttributes } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import styled from 'styled-components';

export type ConfirmAgreementsProps = Omit<HTMLAttributes<HTMLDivElement>, 'css'>;

export const ConfirmAgreements = (props: ConfirmAgreementsProps) => {
  const { register, setValue, control, getValues } = useFormContext();

  const handleAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked: isAll } = e.target;
    setValue('isAgeAgree', isAll);
    setValue('isServiceAgree', isAll);
    setValue('isPrivacyAgree', isAll);
    setValue('isAdAgree', isAll, { shouldValidate: true });
  };

  return (
    <ContainerStyled {...props}>
      <Controller
        name="isAll"
        control={control}
        render={({ field }) => {
          const { isAgeAgree, isServiceAgree, isPrivacyAgree } = getValues();
          const isAdAgree = useWatch({ name: 'isAdAgree' });

          return (
            <Checkbox
              {...field}
              checked={isAgeAgree && isServiceAgree && isPrivacyAgree && isAdAgree}
              onChange={(e) => {
                handleAllChange(e);
                field.onChange(e);
              }}
              block
              className="check-all"
            >
              모두 동의합니다
            </Checkbox>
          );
        }}
      />
      <Divider />
      <Checkbox {...register('isAgeAgree', { required: true })} block>
        (필수) 만 14세 이상입니다
      </Checkbox>
      <Checkbox {...register('isServiceAgree', { required: true })} block>
        (필수){' '}
        <Action is="a" className="link" link="/policy/term" target="_blank">
          서비스 이용약관
        </Action>{' '}
        동의
      </Checkbox>
      <Checkbox {...register('isPrivacyAgree', { required: true })} block>
        (필수){' '}
        <Action is="a" className="link" link="/policy/privacy?section=personalinfo" target="_blank">
          개인정보 수집∙이용
        </Action>{' '}
        동의
      </Checkbox>
      <Checkbox {...register('isAdAgree')} block>
        (선택){' '}
        <Action is="a" className="link" link="/policy/privacy?section=marketing" target="_blank">
          이벤트 및 쿠폰 마케팅 정보 수신
        </Action>{' '}
        동의
      </Checkbox>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  .link {
    color: ${({ theme }) => theme.color.tint};
  }

  ${Checkbox} {
    color: ${({ theme }) => theme.color.gray50};
    padding-left: 1.6rem;
    padding-right: 2.4rem;

    &.check-all {
      padding-top: 0.4rem;
      padding-bottom: 0.4rem;
    }
  }

  ${Divider} {
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }
`;
