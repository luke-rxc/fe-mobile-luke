import styled from 'styled-components';
import isString from 'lodash/isString';
import classnames from 'classnames';
import { Fragment, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { CircleCheck, LottieRef } from '@pui/lottie';
import { ChevronDown, InfoFilled } from '@pui/icon';
import { TicketReservationFieldType } from '../types';

export interface TicketReservationInfoOptionsProps {
  fields?: Record<string, TicketReservationFieldType>;
  options?: { exportId: number; optionValues: string[] }[];
  className?: string;
  onClickOption?: (exportId: number, field?: TicketReservationFieldType) => void;
}

const TicketReservationInfoOption = (props: {
  option: ArrayElement<Required<TicketReservationInfoOptionsProps>['options']>;
  field?: ValueOf<Required<TicketReservationInfoOptionsProps>['fields']>;
  onClickOption?: Required<TicketReservationInfoOptionsProps>['onClickOption'];
}) => {
  const lottieRef = useRef<LottieRef>(null);
  const { isApp } = useDeviceDetect();

  const { field = {}, option, onClickOption } = props;
  const { exportId, optionValues } = option;
  const { label, value, error } = field;

  const handleClickOption = () => {
    onClickOption?.(exportId, field);
  };

  // Mweb에서 캘린더 모달이 닫히고 로띠 애니메이션이 실행되도록 하는 코드
  useUpdateEffect(() => {
    let time: number;

    if (!isApp && !error && value) {
      time = window.setTimeout(() => {
        lottieRef.current?.player?.goToAndPlay(0);
      }, 400);
    }

    return () => {
      time && window.clearTimeout(time);
    };
  }, [value]);

  return (
    <div className="picker" key={exportId}>
      <span className="picker-info">
        <span className="picker-label">
          {optionValues.map((optionValue) => (
            <Fragment key={optionValue}>
              <span className="text" children={optionValue} />
              <span className="bar" />
            </Fragment>
          ))}
        </span>

        <span className="picker-status">
          {!!value && !error ? (
            <CircleCheck ref={lottieRef} animationOptions={{ loop: false, autoplay: isApp }} />
          ) : (
            <InfoFilled />
          )}
        </span>
      </span>

      <span className={classnames('picker-field', { 'is-error': error })} onClick={handleClickOption}>
        <input readOnly type="text" placeholder="날짜 선택" name={`${exportId}`} value={label || ''} />
        <ChevronDown />
      </span>

      {isString(error) && <span className="picker-error-msg">{error}</span>}
    </div>
  );
};

export const TicketReservationInfoOptions = styled(
  ({ fields, options, className, onClickOption }: TicketReservationInfoOptionsProps) => {
    return (
      <div className={className}>
        {options?.map(({ exportId, optionValues }) => (
          <TicketReservationInfoOption
            key={exportId}
            field={fields?.[exportId]}
            option={{ exportId, optionValues }}
            onClickOption={onClickOption}
          />
        ))}
      </div>
    );
  },
)`
  padding: ${({ theme }) => `0 ${theme.spacing.s24}`};

  .picker {
    padding-bottom: ${({ theme }) => theme.spacing.s12};
  }

  .picker-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .picker-label {
    display: block;
    padding: ${({ theme }) => `${theme.spacing.s12} 0`};

    .text {
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.mediumB};
    }

    .bar {
      display: inline-block;
      width: 0.1rem;
      height: 1.2rem;
      margin: ${({ theme }) => `0 ${theme.spacing.s8}`};
      background: ${({ theme }) => theme.color.backgroundLayout.line};

      &:last-of-type {
        display: none;
      }
    }
  }

  .picker-status {
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;

    ${InfoFilled} {
      color: ${({ theme }) => theme.color.semantic.noti};
    }

    ${CircleCheck} {
      *[fill],
      *[stroke] {
        fill: ${({ theme }) => theme.color.brand.tint};
        stroke: ${({ theme }) => theme.color.brand.tint};
      }
    }
  }

  .picker-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.s8};
    padding: ${({ theme }) => `0 ${theme.spacing.s16}`};
    border: ${({ theme }) => `0.1rem solid ${theme.color.backgroundLayout.line}`};
    border-radius: ${({ theme }) => theme.radius.r8};

    input {
      overflow: hidden;
      width: 100%;
      height: 5.6rem;
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.medium};
      white-space: nowrap;
      text-overflow: ellipsis;

      &::placeholder {
        color: currentColor;
      }
    }

    ${ChevronDown} {
      color: ${({ theme }) => theme.color.gray50};
    }

    &.is-error {
      border-color: ${({ theme }) => theme.color.semantic.error};
    }
  }

  .picker-error-msg {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.s8};
    color: ${({ theme }) => theme.color.semantic.error};
    font: ${({ theme }) => theme.fontType.mini};
  }
`;
