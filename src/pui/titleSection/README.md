# [titleSection](https://rxc.atlassian.net/browse/FE-1863)
  * [PUI리스트](../README.md)
  * [Archived History](https://www.notion.so/rxc/TitleSection-4c8542a3b5b14836975c99dcbab20fc1?pvs=4)

## Changelog
### [2023.09.12](https://rxc.atlassian.net/browse/FE-3655)
#### Added
  * subtitle UI/UX 추가
#### Changed
  * **press효과 노출 조건 변경**
    * as-is: props.press가 true이거나 link값이 있으면 press효과 적용
    * to-be: 셀영역의 클릭가능여부(link || onClick || onClickLink)에 따라 press효과 적용
  * **press효과 변경 조건 변경**
    * as-is: cell 전체에 딤드 효과
    * to-be: suffix 요소에만 딤드 효과
#### Deprecated
  * `suffixType`, `press` props 프로퍼티 deprecated

### [2023.08.03](https://rxc.atlassian.net/browse/FE-3499)
#### Changed
  * PDS 고도화(Foundation) 반영

### [2023.06.23](https://rxc.atlassian.net/browse/FE-3326)
#### Added 
  * PUI 컴포넌트 변경 이력 관리를 위한 `README.md` 파일 생성

### [2022.08.04](https://github.com/rxcompany/fe-mobile/commit/85b4b7908466daa3b9ef879c22e62b2f9f9ebe91)
#### Added 
  * `titleSection` 컴포넌트 신규 추가 ([#FE-1863](https://rxc.atlassian.net/browse/FE-1863))