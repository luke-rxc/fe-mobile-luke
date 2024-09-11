import { Button } from '@pui/button';
import { SendFilled } from '@pui/icon';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { ReturnTypeUseContentEditable } from '../hooks';

interface Props {
  className?: string;
  contentEditable: ReturnTypeUseContentEditable;
}

/**
 * 사용자 채팅 input component
 */
export const UserChatInput = styled(
  React.forwardRef<HTMLDivElement, Props>(
    (
      {
        className,
        contentEditable: {
          content,
          inputAppendHeight,
          // handleBlur,
          handleInput,
          handleSendMessage,
          handleKeyPress,
          handleMoveCaretToEnd,
        },
      },
      ref,
    ) => {
      const inputRef = useRef<HTMLDivElement | null>(null);
      const [loaded, setLoaded] = useState<boolean>(false);

      useEffect(() => {
        if (!loaded) {
          setLoaded(true);
        }
      }, [loaded]);

      useEffect(() => {
        if (loaded && inputRef?.current && content) {
          inputRef.current.innerText = content;
          handleMoveCaretToEnd();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [loaded, inputRef]);

      const handelCancelBubbling = (e: React.FocusEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      return (
        <div className={classNames(className, { 'is-load': loaded, 'is-multiline': inputAppendHeight > 0 })}>
          <div className="editor">
            <div
              contentEditable
              ref={(node) => {
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref !== null) {
                  // eslint-disable-next-line no-param-reassign
                  ref.current = node;
                  inputRef.current = node;
                }
                node?.focus();
              }}
              onFocus={handelCancelBubbling}
              onClick={handelCancelBubbling}
              onInput={handleInput}
              onKeyPress={handleKeyPress}
              placeholder="채팅 입력"
            />
          </div>
          <div className={classNames({ action: true })}>
            <Button
              className={classNames({ 'is-disabled': content.length <= 0 })}
              onClick={(e) => {
                handelCancelBubbling(e);
                content && handleSendMessage();
              }}
            >
              <SendFilled />
            </Button>
          </div>
        </div>
      );
    },
  ),
)`
  width: 100%;
  display: flex;
  align-items: start;
  padding: ${({ theme }) => `0 ${theme.spacing.s16} 0 1.8rem`};
  background-color: ${({ theme }) => theme.light.color.gray50};
  color: ${({ theme }) => theme.light.color.white};
  border-radius: 0.8rem;

  &.show-button {
    width: calc(100% - 8.3rem);
  }

  &.is-load {
    > div.action {
      opacity: 1;
      transition: opacity 500ms;
    }
  }
  &.is-multiline {
    > div {
      &.editor {
        margin: 1.6rem 0;
      }

      &.action {
        margin-top: 1.6rem;
      }
    }
  }

  > div {
    &.editor {
      min-height: 1.8rem;
      max-height: 7.2rem;
      flex: 1 1 auto;
      margin: 1.1rem 0;
      line-height: 1.8rem;

      word-wrap: break-word;
      word-break: break-all;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      > div {
        &:focus {
          outline: none;
        }
      }
    }
    &.action {
      opacity: 0;
      flex-shrink: 1;
      width: 2.4rem;
      height: 2.4rem;
      margin-left: 1.6rem;
      margin-top: 0.8rem;

      > button {
        height: 2.4rem;
        padding: 0;

        &.is-disabled {
          pointer-events: auto;
          & svg *[fill],
          svg *[stroke] {
            color: ${({ theme }) => theme.light.color.gray50Dark};
          }
        }
      }
    }
  }

  [contenteditable][placeholder]:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: ${({ theme }) => theme.light.color.gray50Dark};
    background-color: transparent;
  }
`;
