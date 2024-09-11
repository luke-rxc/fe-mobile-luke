# [liveListItem](https://rxc.atlassian.net/browse/FE-1992)
  * [PUI리스트](../README.md)
  * [Archived History](https://www.notion.so/rxc/LiveListItem-686eb1138bda425ea0f8bc18f57d44bd?pvs=4)

## Changelog

### [2024.01.23](https://rxc.atlassian.net/browse/FE-4081)
#### Fixed
  * 알림신청 버튼이 노출되지 않는 버그수정
  
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

### [2023.08.08](https://rxc.atlassian.net/browse/FE-3490)
#### Changed
  * PDS 고도화에 따른 변경된 theme 반영

### [2023.06.23](https://rxc.atlassian.net/browse/FE-3326)
#### Added 
  * PUI 컴포넌트 변경 이력 관리를 위한 `README.md` 파일 생성

### [2022.08.04](https://github.com/rxcompany/fe-mobile/commit/6b4ba5ef64e841d7ffc62d1c4fb14c7d1184388f)
#### Added 
  * `liveListItem` 컴포넌트 신규 추가 ([#FE-1992](https://rxc.atlassian.net/browse/FE-1992))
