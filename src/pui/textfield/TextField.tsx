import React, {
  Attributes,
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Clear } from '@pui/icon';
import { userAgent } from '@utils/ua';

const SuffixBoxStyled = styled.span`
  display: inline-flex;
  align-items: center;
  height: 100%;
  cursor: none;
  padding: ${({ theme }) => theme.spacing.s4};
`;

const IconBoxStyled = styled.button<{ isShowIcon: boolean; multiline: boolean }>`
  display: ${({ isShowIcon }) => (isShowIcon ? 'inline-flex' : 'none')};
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 4rem;
  height: 4rem;
  ${({ multiline }) => (multiline ? 'margin-top: 0.4rem;' : '')}
`;

const InputStyled = styled.input`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 1.9rem 5.2rem 1.9rem 1.6rem;
  font: ${({ theme }) => theme.fontType.medium};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.r8};
  color: ${({ theme }) => theme.color.text.textPrimary};
  outline: none;
  caret-color: ${({ theme }) => theme.color.brand.tint};

  &[disabled] {
    background: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.text.textPlaceholder};
  }
`;

const InputBoxStyled = styled.div`
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.r8};

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
    border-radius: ${({ theme }) => theme.radius.r8};
    content: '';
    pointer-events: none;
  }
`;

const HelperTextStyled = styled.p`
  font: ${({ theme }) => theme.fontType.mini};
  margin-top: ${({ theme }) => theme.spacing.s8};
  color: ${({ theme }) => theme.color.semantic.error};
`;

const MultilineStyled = styled.div<{ placeholder?: string; type?: string }>`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-height: 12rem;
  padding: 1.9rem 5.2rem 1.9rem 1.6rem;
  font: ${({ theme }) => theme.fontType.medium};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.r8};
  outline: none;
  overflow-y: scroll;
  min-height: 5.2rem;
  height: ${({ type }) => (type === 'textarea' ? '10rem' : 'auto')};
  white-space: pre-wrap;

  &[disabled] {
    background: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.text.textPlaceholder};
  }

  &[contenteditable]:empty::before {
    content: ${({ placeholder }) => `"${placeholder ?? ''}"`};
    color: ${({ theme }) => theme.color.text.textPlaceholder};
  }

  &[contenteditable]::-webkit-scrollbar {
    display: none;
  }

  /* iOS16 미만 textarea 입력불가 대응 */
  &[contenteditable] {
    -webkit-user-select: text;
    user-select: text;
  }
`;

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  Attributes & {
    type?: 'text' | 'number' | 'tel' | 'password';
  };

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  Attributes & {
    type: 'textarea';
  };

type MultilineAreaProps = HTMLAttributes<HTMLDivElement> &
  InputHTMLAttributes<HTMLInputElement> & {
    type?: 'text' | 'number' | 'tel' | 'password';
  };

export type TextFieldProps = {
  /** 에러 상태 유무 */
  error?: boolean;
  /** 안내 문구 */
  helperText?: string;
  /** clear 버튼 사용 유무 */
  allowClear?: boolean;
  /** input 우측 영역 커스터마이징 요소 */
  suffix?: React.ReactNode;
  /** 멀티 라인 지원 유무 */
  multiline?: boolean;
} & (InputProps | TextAreaProps | MultilineAreaProps);

const TextFieldComponent = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement, TextFieldProps>(
  (
    {
      type,
      value,
      helperText,
      className,
      error = false,
      disabled = false,
      allowClear = true,
      suffix,
      multiline = false,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const classes = classNames(className, { focused, disabled, error });
    const [isShowIcon, setIsShowIcon] = useState(!disabled && focused && `${value ?? ''}`.length > 0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { isIOS, isApp } = userAgent();

    const getText = useCallback(
      (e: React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => {
        if (multiline) {
          return e.target.innerText;
        }

        return e.target.value;
      },
      [multiline],
    );

    const handleFocus = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        if (disabled) {
          return;
        }

        setIsShowIcon((getText(e) ?? '').length > 0);
        setFocused(true);
        onFocus?.(e);
      },
      [disabled, setIsShowIcon, setFocused, onFocus, getText],
    );

    const handleBlur = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        if (disabled) {
          return;
        }

        onBlur?.(e);
      },
      [disabled, onBlur],
    );

    const handleChange = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        if (disabled) {
          return;
        }

        setIsShowIcon(getText(e).length > 0);

        onChange?.(e);
      },
      [disabled, setIsShowIcon, onChange, getText],
    );

    const handleInput = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => {
        if (disabled) {
          return;
        }

        setIsShowIcon(getText(e).length > 0);

        onChange?.({
          ...e,
          target: {
            ...e.target,
            name: e.target.getAttribute('name') ?? '',
            value: e.target.innerText,
          },
        });
      },
      [disabled, setIsShowIcon, onChange, getText],
    );

    const handleWrapperBlur = useCallback(() => {
      setTimeout(() => {
        const activeEl = document.activeElement;

        if (activeEl && inputRef.current !== activeEl && buttonRef.current !== activeEl) {
          setIsShowIcon(false);
          setFocused(false);
        }
      }, 0);
    }, [setIsShowIcon]);

    const handleReset = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (inputRef && inputRef.current) {
          if (multiline) {
            inputRef.current.innerText = '';
          } else {
            inputRef.current.value = '';
          }
          const event = Object.create(e);
          event.target = inputRef.current;
          handleChange(event);
          inputRef.current?.focus();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [inputRef, handleChange],
    );

    const setRef = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (input: any) => {
        if (ref && typeof ref === 'function') {
          ref(input);
        } else if (ref && typeof ref === 'object') {
          // eslint-disable-next-line no-param-reassign
          ref.current = input;
        }
      },
      [ref],
    );

    const saveInput = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (input: any) => {
        inputRef.current = input;
        setRef(input);
      },
      [inputRef, setRef],
    );

    useEffect(() => {
      if (multiline) {
        const { defaultValue } = rest;
        if (inputRef && inputRef.current) {
          (inputRef.current as HTMLDivElement).textContent = `${defaultValue ?? ''}` || `${value ?? ''}` || '';
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    /**
     * @issue
     * focus = true인 상태에서 unmount시 handleWrapperBlur 내 setIsShowIcon(false); setFocused(false);로 상태값 변경 요청으로 warning 발생해서 cleanUp code 추가
     * */
    useEffect(() => {
      return () => {
        setFocused(false);
        setIsShowIcon(false);
      };
    }, []);

    return (
      <div className={classes} onBlur={handleWrapperBlur}>
        <InputBoxStyled>
          {
            /* eslint-disable-next-line no-nested-ternary */
            multiline ? (
              <MultilineStyled
                {...(rest as MultilineAreaProps)}
                ref={saveInput}
                className="text-inner"
                aria-label="text"
                aria-multiline="true"
                role="textbox"
                contentEditable={!disabled}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                type={type}
              />
            ) : type === 'textarea' ? (
              <TextAreaStyled
                {...(rest as TextAreaProps)}
                {...(value && { value })}
                ref={saveInput}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                allowClear={allowClear}
                isShowIcon={isShowIcon}
              />
            ) : (
              <InputStyled
                {...(rest as InputProps)}
                {...(value && { value })}
                className={classNames('input-inner', { 'is-ios': isApp && isIOS })}
                type={type}
                ref={saveInput}
                onChange={handleChange}
                disabled={disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            )
          }
          <div className="tool-box">
            {allowClear && (
              <IconBoxStyled
                type="button"
                className="btn-clear"
                onClick={handleReset}
                ref={buttonRef}
                isShowIcon={isShowIcon}
                multiline={multiline}
                children={<Clear size="2.4rem" color="gray20" />}
              />
            )}
            {suffix && (
              <>
                <SuffixBoxStyled className="suffix-box">{suffix}</SuffixBoxStyled>
              </>
            )}
          </div>
        </InputBoxStyled>
        {error && helperText && <HelperTextStyled>{helperText}</HelperTextStyled>}
      </div>
    );
  },
);

export const TextField = styled(TextFieldComponent)`
  display: flex;
  flex-direction: column;
  width: 100%;
  font: ${({ theme }) => theme.fontType.medium};
  background: ${({ theme }) => theme.color.background.surface};

  & .tool-box {
    position: absolute;
    display: flex;
    align-items: ${({ multiline, type }) => (multiline || type === 'textarea' ? 'flex-start' : 'center')};
    height: 100%;
    right: 0;
    padding: ${({ theme }) => theme.spacing.s4};
  }

  &.focused ${InputBoxStyled} {
    &::after {
      border: 1px solid ${({ theme }) => theme.color.brand.tint};
    }
  }

  &.error ${InputBoxStyled} {
    &::after {
      border: 1px solid ${({ theme }) => theme.color.semantic.error};
    }
  }

  &.disabled {
    ${InputBoxStyled} {
      background: ${({ theme }) => theme.color.gray3};
      color: ${({ theme }) => theme.color.text.textDisabled};

      &::after {
        border: 1px solid ${({ theme }) => theme.color.backgroundLayout.line};
        transform: scaleX(1);
      }

      ${InputStyled} {
        color: ${({ theme }) => theme.color.text.textDisabled};
        &.input-inner {
          &.is-ios {
            opacity: 1;
            -webkit-text-fill-color: ${({ theme }) => theme.color.text.textDisabled};
          }
        }
      }
    }

    ${SuffixBoxStyled} {
      pointer-events: none;
      touch-action: none;
    }
  }
`;

const TextAreaStyled = styled.textarea<{ allowClear: boolean; isShowIcon: boolean }>`
  display: flex;
  width: 100%;
  height: auto;
  min-height: 12rem;
  max-height: 12rem;
  padding: ${({ theme }) => theme.spacing.s16};
  padding-right: ${({ allowClear, isShowIcon }) => (allowClear && isShowIcon ? '5.2rem' : '1.6rem')};
  border: none;
  outline: none;
  resize: none;
  color: ${({ theme }) => theme.color.text.textPrimary};
  caret-color: ${({ theme }) => theme.color.brand.tint};
  font: ${({ theme }) => theme.fontType.medium};

  &[disabled] {
    background: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.text.textPlaceholder};
  }
`;
