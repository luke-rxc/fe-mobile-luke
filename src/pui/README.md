# PUI
* [PUI 소개](https://www.notion.so/rxc/PUI-4fe6011efb934808971cbe78f78ef90b?pvs=4)
* [PUI Work Process](https://www.notion.so/rxc/PUI-Work-Process-bb0b2ccdabde4396ac8c01ec8d2dd614?pvs=4)
* [PUI Convention](https://www.notion.so/rxc/PUI-Convention-a8da9aa42c4d434297833fd59a5aa540?pvs=4)
* [PUI Storybook](https://www.notion.so/rxc/PUI-Storybook-8e005c60a5834b60b8cbdcf9f2d10cd2?pvs=4)

## PUI 리스트
### PDS
* [addressCard](./addressCard/README.md)
* [addressListItem](./addressListItem/README.md)
* [banner](./banner/README.md)
* [brandCard](./brandCard/README.md)
* [brandListItemLarge](./brandListItemLarge/README.md)
* [brandListItemMedium](./brandListItemMedium/README.md)
* [button](./button/README.md)
* [buttonText](./buttonText/README.md)
* [checkbox](./checkbox/README.md)
* [chip](./chip/README.md)
* [chips](./chips/README.md)
* [contentCard](./contentCard/README.md)
* [contentCardSmall](./contentCardSmall/README.md)
* [contentListItem](./contentListItem/README.md)
* [countDown](./countDown/README.md)
* [couponListItem](./couponListItem/README.md)
* [creditCard](./creditCard/README.md)
* [creditCardEmpty](./creditCardEmpty/README.md)
* [creditCardListItem](./creditCardListItem/README.md)
* [dialog](./dialog/README.md)
* [divider](./divider/README.md)
* [drawer](./drawer/README.md)
* [eventBanner](./eventBanner/README.md)
* [exception](./exception/README.md)
* [footer](./footer/README.md)
* [goodsCard](./goodsCard/README.md)
* [goodsCardMini](./goodsCardMini/README.md)
* [goodsCardSmall](./goodsCardSmall/README.md)
* [goodsList](./goodsList/README.md)
* [goodsListItem](./goodsListItem/README.md)
* [goodsSmall](./goodsSmall/README.md)
* [icon](./icon/README.md)
* [image](./image/README.md)
* [listItemSelect](./listItemSelect/README.md)
* [listItemTable](./listItemTable/README.md)
* [listItemText](./listItemText/README.md)
* [listItemTitle](./listItemTitle/README.md)
* [liveCard](./liveCard/README.md)
* [liveListItem](./liveListItem/README.md)
* [modal](./modal/README.md)
* [mwebHeader](./mwebHeader/README.md)
* [navigation](./navigation/README.md)
* [orderGoodsListItem](./orderGoodsListItem/README.md)
* [passengerCard](./passengerCard/README.md)
* [paymentList](./paymentList/README.md)
* [pointListItem](./pointListItem/README.md)
* [prizmOnlyTag](./prizmOnlyTag/README.md)
* [profiles](./profiles/README.md)
* [reviewCard](./reviewCard/README.md)
* [radio](./radio/README.md)
* [select](./select/README.md)
* [slot](./slot/README.md)
* [snackbar](./snackbar/README.md)
* [spinner](./spinner/README.md)
* [stepper](./stepper/README.md)
* [switch](./switch/README.md)
* [switchListItem](./switchListItem/README.md)
* [tab](./tab/README.md)
* [tabs](./tabs/README.md)
* [tabsFloating](./tabsFloating/README.md)
* [textfield](./textfield/README.md)
* [titleSection](./titleSection/README.md)
* [titleSub](./titleSub/README.md)
* [toast](./toast/README.md)
* [couponCard](./couponCard/README.md)

### NOT PDS
* [action](./action/README.md)
* [collapse](./collapse/README.md)
* [conditional](./conditional/README.md)
* [InfiniteScroller](./InfiniteScroller/README.md)
* [list](./list/README.md)
* [lottie](./lottie/README.md)
* [meta](./meta/README.md)
* [portal](./portal/README.md)
* [seo](./seo/README.md)
* [svg](./svg/README.md)
* [swiper](./swiper/README.md)
* [video](./video/README.md)

## Changelog 작성 가이드

### 제목
```
### [YYYY.MM.DD](작업 지라 링크)
```

### 변경 유형
```
#### Added 
  * 새로운 기능
#### Changed 
  * 기존 기능의 변경사항
#### Deprecated 
  * 곧 지워질 기능
#### Removed 
  * 지금 지워진 기능
#### Fixed 
  * 버그 픽스
#### Security 
  * 취약점이 있는 경우
#### Etc
  * 문서수정(Readme.md, storybook) 및 오타 수정등의 리펙토링
```

### 예시
```

## Changelog

### [2023.01.03](https://rxc.atlassian.net/browse/FE-0002)
#### Changed
  * window의 scroll 이벤트를 IntersectionObserver API로 변경
  * 변경된 PDS 가이드에 맞춰 디자인 반영
    * 제목 font-size t10 => t16
    * 제목 color tint => gray70

### [2023.01.02](https://rxc.atlassian.net/browse/FE-0001)
#### Etc
  * 오탈자 수정

### [2023.01.01](https://rxc.atlassian.net/browse/FE-0000)
#### Added 
  * `ComponentName` 컴포넌트 신규 추가 (#FE-1914)
```

## 참고사항
* [Changelog 가이드](https://keepachangelog.com/ko/1.0.0/)
* [GitHub Markdown Preview Extension](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview)
