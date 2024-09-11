import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,menu,nav,output,ruby,section,summary,time,mark,audio,video,input,textarea,button,select {
    margin: 0;
    padding: 0;
  }

  html, body {
    font-size: 10px;
    touch-action: pan-y pan-x;
    width: 100%;
  }

  body {
    color: ${({ theme }) => theme.color.black};
    font-family: ${({ theme }) => theme.fontFamily};
    background-color: ${({ theme }) => theme.color.surface};
    line-height: 150%;
  }

  ul, ol, li {
    list-style: none;
  }

  img {
    object-fit: cover;
    object-position: center;
    border: 0;
  }

  em, address {
    font-style: normal;
  }

  input[type="text"],
  input[type="search"],
  input[type="url"],
  input[type="tel"],
  input[type="email"],
  input[type="password"],
  input[type="number"],
  input[type="date"],
  input[type="month"],
  input[type="week"],
  input[type="time"],
  input[type="datetime"],
  input[type="datetime-local"],
  textarea,
  button {
    outline: none;
  }

  input::-ms-clear {
    display: none;
  }

  article,aside,details,figure,footer,header,hr,nav,section,summary {
    display: block
  }

  embed, img, object {
    max-width: 100%
  }

  blockquote,q {
    quotes: none
  }

  blockquote:after,blockquote:before,q:after,q:before {
    content: '';
    content: none
  }

  button,
  input,
  optgroup,
  textarea,
  select {
    background-color: transparent;
    border: 0;
  }


  a {
    text-decoration: none;
  }

  a,
  button {
    color: inherit;
    font-family: inherit;
    cursor: pointer;

    &[disabled] {
      cursor: not-allowed;
    }
  }

  del {
    text-decoration: line-through
  }

  abbr[title],dfn[title] {
    border-bottom: 1px dotted #000;
    cursor: help
  }


  hr {
    height: 1px;
    margin: 1em 0;
    border: 0;
    border-top: 1px solid #ccc
  }

  input,select {
    vertical-align: middle
  }

  pre {
    white-space: pre;
    white-space: pre-wrap;
    white-space: pre-line;
    word-wrap: break-word
  }

  small {
    font-size: 85%
  }

  strong {
    font-weight: 700
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  th {
    font-weight: 700
  }

  td {
    font-weight: 400;
  }

  td,td img {
    vertical-align: top
  }

  sub,sup {
    position: relative;
    font-size: 75%;
    line-height: 0
  }

  sup {
    top: -.5em
  }

  sub {
    bottom: -.25em
  }

  body.body_overflow {
    overflow: hidden;
  }

  body.body_fixed {
    position: fixed;
    width: 100%;
  }

  body.body_fixed::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 90;
    display: block;
    background: #000;
    content: '';
  }

  html.touch-action-manipulation,
  body.touch-action-manipulation {
    touch-action: manipulation;
  }

  html.touch-action-auto,
  body.touch-action-auto {
    touch-action: auto;
  }

  .clearfix:after {
    display: block;
    clear: both;
    content: '';
  }

  .hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
  }
  .globalLayout{
    font-size: 1.6rem;
  }

  #sticky-root {
    ${({ theme }) => theme.mixin.z('header')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
`;

export const AppGlobalStyle = createGlobalStyle`
  * {
    /* 웹뷰에서 모든 스크롤바를 숨김 */
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
      appearance: none;
    }
  }

  html, body {
    /* 웹뷰에서 다 선택이 불가능하게 함 */
    user-select: none;
    /* touch-action: manipulation; */

    /* 롱프레스 시 나오는 팝업을 제어 */
    -webkit-touch-callout: none;

    /* 링크 터치 시 기본 영역 색상을 제어 */
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-overflow-scrolling: touch;
  }

  /** App Cover : normal */
  body.app-cover-normal {
    ${({ theme }) => theme.mixin.safeArea('padding-top')};
    ${({ theme }) => theme.mixin.safeArea('padding-bottom')};

    #sticky-root {
      ${({ theme }) => theme.mixin.safeArea('top')};
    }
  }

  /** App Cover : safe-area-top */
  body.app-cover-safe-area-top {
    ${({ theme }) => theme.mixin.safeArea('padding-top')};

    #sticky-root {
      ${({ theme }) => theme.mixin.safeArea('top')};
    }
  }

  /** App Cover : safe-area-bottom */
  body.app-cover-safe-area-bottom {
    ${({ theme }) => theme.mixin.safeArea('padding-bottom')};
  }

  input,
  select,
  textarea {
    user-select: auto;
  }
`;
