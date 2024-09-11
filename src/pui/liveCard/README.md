# [liveCard](https://rxc.atlassian.net/browse/FE-1993)
  * [PUI리스트](../README.md)
  * [Archived History](https://www.notion.so/rxc/LiveCard-04576de23b014793b61936685cb78e74?pvs=4)

## Changelog

### [2024.04.15](https://rxc.atlassian.net/browse/FE-4450)
#### Changed
  * 캐로셀 컴포넌트 디자인 고도화 작업에 따른 컴포넌트 사이즈 반응형화
    * width: (디바이스 너비 - 80px) / 2
    * 최대 width: 167px;

### [2024.02.01](https://rxc.atlassian.net/browse/FE-4103)
#### Changed
  * LiveCard inView 모션값 변경
    APP Main 피드와 동일하게 뒤에 있는 이미지 모션이 더 크도록 모션수치 변경

### [2024.01.22](https://rxc.atlassian.net/browse/FE-3935)
#### Fixed
  * ios에서 overflow가 제대로 동작하지 않는 버그 수정 (#FE-3935)
  * 버그에 정확한 정확한 원인 파악이 어려워 핵과 동일하게 z-index:1을 추가하여 쌓임맥락을 재설정
  * z-index외에 다른 쌓임맥락을 재설정하는 프로퍼티는 해결되지 않음.

### [2023.12.12](https://rxc.atlassian.net/browse/FE-3923)
#### Changed
  * landingType에 'SCHEDULE_TEASER' 추가
      * 'MODAL' 타입이 'SCHEDULE_TEASER'로 대체되었지만 사이드이펙트를 줄이기 위해 'MODAL'타입 유지
  * web, scheme props 추가
      * 초기와 다르게 랜딩 URL을 api에서 전달해주고 있어 해당값으로 랜딩될수 있도록 로직 변경

### [2023.08.21](https://rxc.atlassian.net/browse/FE-3545)
#### Fixed
  * 처음 알림신청시 로띠 모션이 재생되지 않는 버그 수정
#### Changed
  * 알림신청 로띠 모션의 기준을 props.followed값의 변경이 아닌<br />
    알림신청 버튼을 클릭후 props.followed값이 변경된 경우에만 로띠 모션이 재생되도록 수정

### [2023.08.08](https://rxc.atlassian.net/browse/FE-3490)
#### Changed
  * PDS 고도화에 따른 변경된 theme 반영

### [2023.06.23](https://rxc.atlassian.net/browse/FE-3326)
#### Added
  * PUI 컴포넌트 변경 이력 관리를 위한 `README.md` 파일 생성

### [2022.08.04](https://github.com/rxcompany/fe-mobile/commit/54674a3be51e990659ca847fb454495628dc8990)
#### Added
  * `liveCard` 컴포넌트 신규 추가 ([#FE-1993](https://rxc.atlassian.net/browse/FE-1993))
