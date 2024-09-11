# [drawer](https://rxc.atlassian.net/browse/FE-1919)
  * [PUI리스트](../README.md)
  * [Archived History](https://www.notion.so/rxc/Drawer-28e9135c489e487b9a2360f79ca5d0cb?pvs=4)

## Changelog
### [2024.09.05](https://rxc.atlassian.net/browse/FE-4914)
#### Changed
  * `DrawerV2` drag-handle-bar 에 직접 적용된 background 제거
  * `DrawerV2` Stylelint 적용

### [2024.04.12](https://rxc.atlassian.net/browse/FE-4444)
#### Fixed
  * `DrawerV2` 2024.04.11 임시 수정 버전에서 IOS 쌓임 맥락 버그로 transform 값으로 쌓임 맥락 추가하도록 수정

### [2024.04.11](https://rxc.atlassian.net/browse/FE-4444)
#### Fixed
  * `DrawerV2` IOS에서 상단 TopBar background 적용되지 않는 이슈 수정

### [2024.03.29](https://rxc.atlassian.net/browse/FE-4402)
#### Added
  * `DrawerV2`상단 TopBar Blur 효과 제거 prop 추가

### [2024.01.10](https://rxc.atlassian.net/browse/FE-3804)
#### Added
  * 수직 스크롤 제어를 위한 verticalScroll prop 추가
  * inner content 영역 내 maxHeight 설정 및 inner scroll 표현으로 인한 Drawer 스크롤 미표현 케이스 대응
  
### [2024.01.04](https://rxc.atlassian.net/browse/FE-3953)
#### Changed
  * `useDrawerCoreDragging` Half View 에서 closeConfirm 노출 퍼센트 조건 수정
#### Fixed
  * `useDrawer` history goBack() 시 다른 페이지로 이동하는 이슈가 발생해 replace 로 대체

### [2023.12.22](https://rxc.atlassian.net/browse/FE-3834)
#### Changed
  * `useDrawer` Hash 조건 (ios safari) 제거 및 popstate 리스너 추가
  * `DrawerV2`  상단 커스텀 액션 위한 toolbarSuffix prop 추가

### [2023.12.18](https://rxc.atlassian.net/browse/FE-3834)
#### Changed
  * `userDrawerCoreDragging` disableBackDropClose props 값을 ref 로 참조해서 사용

### [2023.12.07](https://rxc.atlassian.net/browse/FE-3834)
#### Changed
  * closeConfirm 실행 조건 추가 및 expandView 에서도 closeConfirm 호출하도록 수정
  * `DrawerV2` DraggingCloseConfirmProps.condition(optional) 추가
  * `useDrawerCore` expandView 에서도 closeConfirm 호출시 위치값 계산을 위해 to props 추가
  * `useDrawerCoreDragging` condition(실행 조건) 호출 조건 추가 및 expandView 에서 closeConfirm 호출

### [2023.11.13](https://rxc.atlassian.net/browse/FE-3841)
#### Fixed
  * `useDrawerCore` preventDefault 조건 체크(cancelable)하여 호출 진행 (모니터링 오류 해결)

### [2023.10.06](https://rxc.atlassian.net/browse/FE-3642)
#### Fixed
  * `DrawerV2` 스크롤시 Drawer 상단 border-radius 덮혀 사라지는 현상 수정
  
### [2023.09.22](https://rxc.atlassian.net/browse/FE-3642)
#### Changed
  * `DrawerV2` 가로스크롤 여부에 따라 overflow 값 조정가능한 Props (horizontalScroll) 추가
#### Fixed
  * `useDrawerCore` Drawer 추가로 open시 overflow 초기화 되는 현상 수정
  * `useDrawerCore` Drawer close시 Drawer open element 수에 따른 overflow 초기화 로직 추가

### [2023.08.03](https://rxc.atlassian.net/browse/FE-3495)
#### Changed
  * `DrawerV2` PDS 고도화 관련 변경 (Font, Color, Spacing, Radius)
  * `DrawerV2` border-radius 중첩코드 삭제
#### Deprecated
  * `Drawer` Drawer.tsx 삭제예정 (DrawerV2를 Drawer로 변경예정)
#### Security
  * webHeader color은 정의가 되어 있지 않아 체크 필요 (자체 구현필요한 지 여부 체크 필요)

### [2023.06.23](https://rxc.atlassian.net/browse/FE-3326)
#### Added
  * PUI 컴포넌트 변경 이력 관리를 위한 `README.md` 파일 생성

### [2022.09.28](https://github.com/rxcompany/fe-mobile/commit/1f3a6e9f24d2d78133d16d85ecd891774309e395)
#### Added
  * `drawer` 컴포넌트 신규 추가 ([#FE-1919](https://rxc.atlassian.net/browse/FE-1919))
