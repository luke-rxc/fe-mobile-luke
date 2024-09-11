# [orderGoodsListItem](https://rxc.atlassian.net/browse/FE-1890)
  * [PUI리스트](../README.md)
  * [Archived History](https://www.notion.so/rxc/OrderGoodsListItem-7c8572499a66467a9fbd62935eaa82bd?pvs=4)

## Changelog

### [2024.08.14](https://rxc.atlassian.net/browse/FE-4815)
#### Fixed
  * 브랜드명 길어질 경우 레이아웃 틀어지는 현상 수정

### [2024.07.15](https://rxc.atlassian.net/browse/FE-4721)
#### Changed
  * v2 수정
    * 상품 수량(quantity) 타입 수정 및 stylelint 적용

### [2024.02.27](https://rxc.atlassian.net/browse/FE-4208)
#### Changed
  * v2 수정
    * 좌측 input 요소를 checkbox와 radio 버튼중에서 선택할 수 있도록 변경

### [2024.02.07](https://rxc.atlassian.net/browse/FE-4205)
#### Changed
  * 라디오버튼 UI 추가
    * 기존 OrderGoodsListItem에서 수정하지 않고 **v2로 신규 컴포넌트**로 생성
    * v2는 기존 로직을 전부 그대로 사용하고 라디오 버튼 UI를 위한 기능만추가

### [2023.12.07](https://rxc.atlassian.net/browse/FE-3908)
#### Changed
  * Option Bar 디자인 구현 방식 변경

### [2023.08.24](https://rxc.atlassian.net/browse/FE-3583)
#### Changed
  * 티켓 날짜 UI에 적용된 폰트 테마 변경
#### Fixed
  * 카운트다운기능을 사용하지 않아도 onTicketExpired 실행되는 버그 수정

### [2023.08.03](https://rxc.atlassian.net/browse/FE-3491)
#### Changed
  * PUI theme 마이그레이션
### [2023.06.23](https://rxc.atlassian.net/browse/FE-3326)
#### Added 
  * PUI 컴포넌트 변경 이력 관리를 위한 `README.md` 파일 생성

### [2022.08.04](https://github.com/rxcompany/fe-mobile/commit/6273dd15f27b1536833c1020834da600565db992)
#### Added 
  * `orderGoodsListItem` 컴포넌트 신규 추가 ([#FE-1890](https://rxc.atlassian.net/browse/FE-1890))
