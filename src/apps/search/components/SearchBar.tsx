import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useUpdateEffect } from 'react-use';
import styled, { createGlobalStyle } from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import escapeRegExp from 'lodash/escapeRegExp';
import classnames from 'classnames';
import { Back, Close, Search } from '@pui/icon';
import { toDateFormat } from '@utils/date';

// TODO: iOS 버그로 수정 필요
const DisableBodyScroll = createGlobalStyle`
  body {
    overflow: hidden !important;
    /* 터치가 되지 않는 경우 발생하여 주석 처리 */
    /* pointer-events: none !important; */
  }
`;

export interface SearchBarProps {
  className?: string;
  // 검색어 초기값
  initQuery?: string;
  // 포커스 초기값
  autoFocus?: boolean;
  // 뒤로가기 버튼 클릭 이벤트
  onClickBack?: () => void;
  // 키워드 변경 이벤트
  onChangeKeyword?: (keyword: string) => void;
  // 키워드 검색 Submit
  onSubmit?: (keyword: string) => void;
  // 자동완성 데이터
  autoComplete?: {
    // 자동완성 키워드
    keyword: string;
    // 자동완성 목록
    list: Array<{
      id: string;
      keyword: string;
      date?: number;
    }>;
  };
}

const SearchBarComponent = forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      className,
      initQuery = '',
      autoFocus = false,
      onClickBack: handleClickBack,
      onChangeKeyword,
      onSubmit,
      autoComplete,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const clearRef = useRef<HTMLButtonElement | null>(null);
    const transitionTarget = useRef<HTMLDivElement>(null);
    const delay = useRef<number | undefined | void>();

    // 검색어
    const [query, setQuery] = useState('');
    // 검색어 삭제 버튼 숨김 여부
    const [hideClear, setHideClear] = useState(!initQuery);
    // 검색어 입력 포커스 여부
    const [focused, setFocused] = useState(autoFocus);
    // 자동완성 open 여부
    const [opened, setOpened] = useState(false);
    // 자동완성 display 여부
    const [displayed, setDisplayed] = useState(false);

    // root 컴포넌트 className
    const classNames = classnames(className, { 'is-open': opened, 'is-display': displayed });

    /**
     * 검색어 입력 focus handler
     */
    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;

      setFocused(true);
      setQuery(keyword);
    };

    /**
     * 검색어 입력 change handler
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;

      setHideClear(keyword.length < 1);
      setQuery(keyword);
    };

    /**
     * 검색어 삭제 handler
     */
    const handleClear = () => {
      if (!inputRef.current) {
        return;
      }

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;

      // input clear
      nativeInputValueSetter?.call(inputRef.current, '');

      // input onchange trigger
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));

      // input focus
      inputRef.current.focus();
    };

    /**
     * 검색어 Submit handler
     */
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFocused(false);
      onSubmit?.(query);
    };

    /**
     * 자동완성 Close handler
     */
    const handleCloseAutocomplete = () => {
      setFocused(false);
      setOpened(false);
    };

    /**
     * 자동완성 Click handler
     */
    const handleClick = (keyword: string) => {
      if (inputRef.current) {
        inputRef.current.value = keyword;
      }
      setFocused(false);
      onSubmit?.(keyword);

      // Opacity 효과 사용하지 않기 위한 처리
      setDisplayed(false);
    };

    /**
     * 자동완성 Close Transition End Callback
     */
    const handleTransitionEnd = useCallback(
      (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== transitionTarget.current || e.propertyName !== 'opacity') {
          return;
        }

        if (!opened && window.getComputedStyle(e.target as unknown as Element).opacity === '0') {
          setDisplayed(false);
        }
      },
      [opened],
    );

    /**
     * 검색어 입력 외 Touch시 Blur 처리 (키패드 hide)
     */
    const handleTouchBlur = (e: TouchEvent) => {
      e.target !== inputRef.current && inputRef.current?.blur();
    };

    /**
     * 주소창 활성 여부에 따른 height 100vh 이슈 대응
     */
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    /**
     * Initialize
     */
    useEffect(() => {
      if (inputRef.current) {
        // 검색어 초기값
        inputRef.current.value = initQuery;
        // 검색바 focus
        autoFocus && inputRef.current.focus();
      }

      handleResize();
      window.addEventListener('resize', handleResize);
      document.addEventListener('touchstart', handleTouchBlur);

      return () => {
        inputRef.current = null;
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('touchstart', handleTouchBlur);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 자동완성 및 포커스 변경시 처리
     */
    useEffect(() => {
      focused || inputRef.current?.blur();

      const isOpen = !isEmpty(autoComplete?.list) && focused && !!inputRef.current?.value;

      /* eslint-disable @typescript-eslint/no-unused-expressions */
      isOpen
        ? window.requestAnimationFrame(() => {
            flushSync(() => setDisplayed(true));
            window.requestAnimationFrame(() => {
              flushSync(() => setOpened(true));
            });
          })
        : window.requestAnimationFrame(() => {
            flushSync(() => setOpened(false));
          });
      /* eslint-enable @typescript-eslint/no-unused-expressions */

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoComplete?.keyword, focused]);

    /**
     * 검색어 변경시 처리
     */
    useUpdateEffect(() => {
      delay.current && window.clearTimeout(delay.current);
      delay.current = window.setTimeout(() => {
        onChangeKeyword?.(query);
      }, 200);
    }, [query]);

    return (
      <div ref={ref} className={classNames}>
        {opened && <DisableBodyScroll />}
        <div
          className="searchbar-dimmed"
          ref={transitionTarget}
          onTransitionEnd={handleTransitionEnd}
          onClick={handleCloseAutocomplete}
        />

        {/* 검색바 */}
        <form action="" onSubmit={handleSubmit}>
          <header className="searchbar">
            <div className="searchbar-prefix-box">
              <button className="btn-back" type="button" onClick={handleClickBack}>
                <Back />
              </button>
            </div>
            <div className="searchbar-input-box">
              <input
                ref={inputRef}
                type="search"
                className="searchbar-input"
                placeholder="검색"
                maxLength={100}
                onFocus={handleFocus}
                onChange={handleChange}
              />
              <button
                ref={clearRef}
                className={classnames('btn-clear', { 'is-hide': hideClear })}
                type="button"
                onClick={handleClear}
              >
                <Close size="2.4rem" color="gray20" />
              </button>
            </div>
          </header>
        </form>

        {/* 자동완성 */}
        <div className="autocomplete">
          <div className="autocomplete-list">
            {autoComplete?.list.map(({ id, keyword, date }) => (
              <button
                key={id}
                className="autocomplete-item"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(keyword);
                }}
              >
                <div className="pressed-dimmed" />
                <span className="search-icon">
                  <Search size="2.4rem" />
                </span>
                <span className="search-text-wrapper">
                  <span
                    className="text"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      // 매칭된 검색 키워드 강조 처리
                      __html: keyword.replace(
                        // 특수문자 escape 처리된 정규 표현식
                        new RegExp(escapeRegExp(autoComplete.keyword), 'gi'),
                        `<em>${autoComplete.keyword}</em>`,
                      ),
                    }}
                  />
                  {date && <span className="date">{toDateFormat(date, 'M. d')}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

export const SearchBar = styled(SearchBarComponent)`
  /* searchbar height */
  --searchbar-height: 5.6rem;
  /* transition duration */
  --transition-duration: 400ms;

  height: var(--searchbar-height);

  .searchbar-dimmed {
    ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0, r: 0, b: 0 })};
    ${({ theme }) => theme.mixin.z('header', -2)};
    display: none;
    background: #000;
    opacity: 0;
    transition: opacity var(--transition-duration);

    .is-open& {
      opacity: 0.4;
      transition: opacity var(--transition-duration);
    }
    .is-display& {
      display: block;
    }
  }

  .searchbar {
    ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
    ${({ theme }) => theme.mixin.z('header')};
    display: flex;
    width: 100%;
    height: var(--searchbar-height);
    padding: 0.4rem;
    border-bottom: 0.05rem solid ${({ theme }) => theme.color.gray8};
    background: ${({ theme }) => theme.color.surface};
  }

  .searchbar-prefix-box {
    display: flex;
    margin-right: 0.4rem;

    .btn-back {
      display: flex;
      width: 4.8rem;
      height: 4.8rem;
      align-items: center;
      justify-content: center;
    }
  }

  .searchbar-input-box {
    display: flex;
    flex-grow: 1;

    .searchbar-input {
      width: 100%;
      font: ${({ theme }) => theme.fontType.t15};
      border: 0;
      color: ${({ theme }) => theme.color.black};
      outline: none;
      caret-color: ${({ theme }) => theme.color.tint};

      &::placeholder {
        color: ${({ theme }) => theme.color.gray20};
      }

      /* IE */
      &::-ms-clear,
      &::-ms-reveal {
        display: none;
      }
      /* Chrome */
      &::-webkit-search-decoration,
      &::-webkit-search-cancel-button,
      &::-webkit-search-results-button,
      &::-webkit-search-results-decoration {
        display: none;
      }
    }

    .btn-clear {
      display: flex;
      width: 4.8rem;
      height: 4.8rem;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.is-hide {
        display: none;
      }
    }
  }

  .autocomplete {
    ${({ theme }) => theme.mixin.fixed({ t: 'var(--searchbar-height)', l: 0 })};
    ${({ theme }) => theme.mixin.z('header', -1)};
    display: none;
    width: 100%;
    background: ${({ theme }) => theme.color.surface};

    opacity: 0;
    transition: opacity var(--transition-duration);

    .is-open& {
      opacity: 1;
      transition: opacity var(--transition-duration);
    }

    .is-display& {
      display: block;
    }

    &-list {
      ${({ theme }) => theme.mixin.absolute({ t: 0 })};
      display: flex;
      flex-direction: column;
      width: 100%;
      background: ${({ theme }) => theme.color.surface};
      max-height: calc(100vh - var(--searchbar-height)); /* fallback */
      max-height: calc(var(--vh) * 100 - var(--searchbar-height));
      overflow: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    &-item {
      display: flex;
      position: relative;
      width: 100%;

      &:first-child {
        margin-top: 0.8rem;
      }

      &:last-child {
        margin-bottom: 0.8rem;
      }

      .pressed-dimmed {
        ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0, b: 0, l: 0 })};
        background: ${({ theme }) => theme.color.gray3};
        opacity: 0;
        transition: opacity 0.2s;
      }

      // pressed effect
      &:active {
        .pressed-dimmed {
          opacity: 1;
        }
      }
    }

    .search-icon {
      ${({ theme }) => theme.mixin.centerItem()};
      margin: 0.8rem;
      width: 4rem;
      min-width: 4rem;
      height: 4rem;
    }

    .search-text-wrapper {
      display: flex;
      flex-grow: 1;
      height: 100%;
      padding: 1rem 2.4rem 1rem 0;
      color: ${({ theme }) => theme.color.gray50};

      .text {
        width: 100%;
        font: ${({ theme }) => theme.fontType.t15};
        text-align: left;
        overflow: hidden;
        margin-top: 0.8rem;
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 18)}

        /* HTML replace로 인해 className이 아닌 DOM 요소 접근으로 처리 */
        > em {
          color: ${({ theme }) => theme.color.black};
        }
      }

      .date {
        padding-top: 0.8rem;
        width: 4.8rem;
        font: ${({ theme }) => theme.fontType.t12};
        line-height: 1.4rem;
        text-align: right;
      }
    }
  }
`;
