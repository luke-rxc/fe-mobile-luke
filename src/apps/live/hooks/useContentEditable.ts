import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';

export type ReturnTypeUseContentEditable = ReturnType<typeof useContentEditable>;

interface Props {
  maxLength?: number;
  handleSubmitMessage: (message: string) => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

const textHeight = 18;
const maxMultiline = 4;

/**
 * content editable 관련 hook
 */
export const useContentEditable = ({ maxLength = 75, handleSubmitMessage, handleFocus, handleBlur }: Props) => {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<string>('');
  const [inputAppendHeight, setInputAppendHeight] = useState<number>(0);

  /**
   * 포커스 커서 마지막으로 이동
   */
  const moveCaretToEnd = () => {
    const el = inputRef.current;
    const range = document.createRange();
    const sel = window.getSelection();
    if (el && range && sel && el.childNodes.length > 0) {
      const countElement: number = el.childNodes.length - 1;
      range.setStart(
        el.childNodes[countElement],
        el.childNodes[countElement] ? (el.childNodes[countElement].textContent || '').length : 0,
      );
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  /**
   * onInput 처리
   */
  const handleInput = (event: ChangeEvent<HTMLDivElement>) => {
    const height = event.target.getBoundingClientRect().height - textHeight;

    if (height > textHeight * (maxMultiline - 1) || maxLength < event.target.innerText.length) {
      if (inputRef.current) {
        inputRef.current.innerText = content;
        moveCaretToEnd();
      }
    } else {
      setInputAppendHeight((prev) => {
        if (prev !== Math.max(0, height)) {
          return height;
        }

        return prev;
      });

      if (inputRef.current && event.target.textContent === '') {
        inputRef.current.innerHTML = '';
      }
      setContent(event.target.innerText);
    }
  };

  /**
   * content update
   */
  const handleUpdateContent = (newContent: string) => {
    if (inputRef.current) {
      inputRef.current.innerText = newContent;
      setContent(newContent);
    }
  };

  /**
   * focus 처리
   */
  const handleFocusInput = () => {
    handleFocus();
  };

  /**
   * blur 처리
   */
  const handleBlurInput = () => {
    handleBlur();
  };

  /**
   * message send 처리
   */
  const handleSendMessage = () => {
    if (!content) {
      return;
    }

    handleSubmitMessage(content);
    handleBlurInput();
    handleUpdateContent('');
    setInputAppendHeight(0);
  };

  /**
   * 엔터키 처리시 message send 처리
   */
  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    setContent('');

    return () => {
      setContent('');
      setInputAppendHeight(0);
    };
  }, []);

  return {
    content,
    inputRef,
    inputAppendHeight,
    handleUpdateContent,
    handleInput,
    handleSendMessage,
    handleKeyPress,
    handleMoveCaretToEnd: moveCaretToEnd,
    handleFocus: handleFocusInput,
    handleBlur: handleBlurInput,
  };
};
