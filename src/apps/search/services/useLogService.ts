import { WebLogTypes, AppLogTypes } from '@constants/log';
import { tracking } from '@utils/log';
import { createDebug } from '@utils/debug';
import type { GoodsCardProps } from '@pui/goodsCard';
import get from 'lodash/get';
import { FilterSectionTypes, LogEventTypes, LogEventWebBranchTypes, LogEventWebFacebookTypes } from '../constants';
import { SearchSectionItemProps } from '../components';

const debug = createDebug();

export const useLogService = () => {
  // 최근 검색어 탭 시
  const logTabRecentWord = ({ query }: { query: string }) => {
    const parameters = {
      search_word: query,
    };

    debug.log(LogEventTypes.LogTabRecentWord.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabRecentWord,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 추천 검색어 노출 시
  const logImpressionRecommendWord = ({ query, index }: { query: string; index: number }) => {
    const parameters = {
      search_word: query,
      word_index: index,
    };

    debug.log(LogEventTypes.LogImpressionRecommendWord.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogImpressionRecommendWord,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 추천 검색어 탭 시
  const logTabRecommendWord = ({ query, index }: { query: string; index: number }) => {
    const parameters = {
      search_word: query,
      word_index: index,
    };

    debug.log(LogEventTypes.LogTabRecommendWord.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabRecommendWord,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 검색 메인 > 상품 섹션 노출 시
  const logImpressionSectionGoods = ({ title, items }: SearchSectionItemProps) => {
    const parameters = {
      section_name: title,
      goods_id: items.map((item) => get(item, 'data-log-goods-id')),
      goods_name: items.map((item) => item.goodsName),
    };

    debug.log(LogEventTypes.LogImpressionSectionGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogImpressionSectionGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 검색 메인 > 섹션 내 상품 탭 시
  const logTabSectionGoodsThumbnail = (goodsId: string, goodsName: string, index: number, title: string) => {
    const parameters = {
      section_name: title,
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: index,
    };

    debug.log(LogEventTypes.LogTabSectionGoodsThumbnail.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabSectionGoodsThumbnail,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 최근 본 상품 탭 시
  const logTabRecentGoods = ({ goodsId, goodsName }: GoodsCardProps) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
    };

    debug.log(LogEventTypes.LogTabRecentGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabRecentGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 검색 완료시
  const logViewInResult = ({
    query,
    section,
    goodsStatus,
    brandStatus,
    contentStatus,
    liveStatus,
  }: {
    query: string;
    section: FilterSectionTypes;
    goodsStatus: boolean;
    brandStatus: boolean;
    contentStatus: boolean;
    liveStatus: boolean;
  }) => {
    // default parameters
    const parameters = {
      search_word: query,
      result_goods_status: goodsStatus,
      result_brand_status: brandStatus,
      result_content_status: contentStatus,
      result_live_status: liveStatus,
      result_tab_id: section,
    };

    // branch parameters
    const branchParameters = {
      search_query: query,
    };

    debug.log(LogEventTypes.LogViewInResult.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogViewInResult,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Firebase, AppLogTypes.Prizm],
      },
    });

    tracking.logEvent({
      name: LogEventWebBranchTypes.LogViewInResult,
      parameters: branchParameters,
      targets: {
        web: [WebLogTypes.Branch],
      },
    });

    tracking.logEvent({
      name: LogEventWebFacebookTypes.LogViewInResult,
      targets: {
        web: [WebLogTypes.Facebook],
      },
    });
  };

  // 검색 결과 대상 탭 시 (Goods)
  const logTabInResultGoods = ({
    section,
    goodsId,
    goodsName,
  }: {
    section: FilterSectionTypes;
    goodsId: string;
    goodsName: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      goods_id: goodsId,
      goods_name: goodsName,
    };

    debug.log(LogEventTypes.LogTabInResultGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabInResultGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 검색 결과 대상 탭 시 (Brand)
  const logTabInResultBrand = ({
    section,
    showroomId,
    showroomName,
    liveId,
    onAir,
    goodsId,
    goodsName,
  }: {
    section: FilterSectionTypes;
    showroomId: string;
    showroomName: string;
    liveId?: number;
    onAir: boolean;
    goodsId?: string | number;
    goodsName?: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      showroom_id: showroomId,
      showroom_name: showroomName,
      onair: onAir,
      ...(liveId && { live_id: liveId }),
      ...(goodsId && { goods_id: goodsId, goods_name: goodsName }),
    };

    debug.log(LogEventTypes.LogTabInResultBrand.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabInResultBrand,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 검색 결과 대상 탭 시 (Content)
  const logTabInResultContent = ({
    section,
    contentId,
    contentName,
  }: {
    section: FilterSectionTypes;
    contentId: string | number;
    contentName: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      contents_id: contentId,
      contents_name: contentName,
    };

    debug.log(LogEventTypes.LogTabInResultContent.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabInResultContent,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 검색 결과 대상 탭 시 (Live)
  const logTabInResultSchedule = ({
    section,
    scheduleId,
    scheduleName,
    liveId,
    onAir,
  }: {
    section: FilterSectionTypes;
    scheduleId: string | number;
    scheduleName: string;
    liveId?: string | number;
    onAir: boolean;
  }) => {
    const parameters = {
      result_tab_id: section,
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      onair: onAir,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogTabInResultSchedule.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogTabInResultSchedule,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 검색 결과 브랜드 팔로우 완료
  const logCompleteSectionShowroomFollow = ({
    section,
    showroomId,
    showroomName,
  }: {
    section: FilterSectionTypes;
    showroomId: string | number;
    showroomName: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      showroom_id: showroomId,
      showroom_name: showroomName,
    };

    debug.log(LogEventTypes.LogCompleteSectionShowroomFollow.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogCompleteSectionShowroomFollow,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 검색 결과 브랜드 팔로우 취소 완료
  const logCompleteSectionShowroomUnfollow = ({
    section,
    showroomId,
    showroomName,
  }: {
    section: FilterSectionTypes;
    showroomId: string | number;
    showroomName: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      showroom_id: showroomId,
      showroom_name: showroomName,
    };

    debug.log(LogEventTypes.LogCompleteSectionShowroomUnfollow.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogCompleteSectionShowroomUnfollow,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 검색 결과 라이브 팔로우 완료
  const logCompleteSectionScheduleNotiOptIn = ({
    section,
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    showroomId,
    showroomName,
  }: {
    section: FilterSectionTypes;
    scheduleId: string | number;
    scheduleName: string;
    scheduleIndex: number;
    liveId?: string | number;
    showroomId: string | number;
    showroomName: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      showroom_id: showroomId,
      showroom_name: showroomName,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogCompleteSectionScheduleNotiOptIn.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogCompleteSectionScheduleNotiOptIn,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 검색 결과 라이브 팔로우 취소 완료
  const logCompleteSectionScheduleNotiOptout = ({
    section,
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    showroomId,
    showroomName,
  }: {
    section: FilterSectionTypes;
    scheduleId: string | number;
    scheduleName: string;
    scheduleIndex: number;
    liveId?: string | number;
    showroomId: string | number;
    showroomName: string;
  }) => {
    const parameters = {
      result_tab_id: section,
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      showroom_id: showroomId,
      showroom_name: showroomName,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogCompleteSectionScheduleNotiOptout.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogCompleteSectionScheduleNotiOptout,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 상품 검색 결과 진입
  const logGoodsListViewPage = ({ query }: { query: string }) => {
    const parameters = {
      search_word: query,
    };

    debug.log(LogEventTypes.LogGoodsListViewPage.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListViewPage,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 상품 검색 결과 내 상품 노출
  // * 모웹 노출 로그는 추후 대응 예정
  const logGoodsListImpressionGoods = ({
    goodsId,
    goodsName,
    goodsIndex,
    query,
  }: {
    goodsId: string;
    goodsName: string;
    goodsIndex: number;
    query: string;
  }) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogGoodsListImpressionGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListImpressionGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 상품 검색 결과 내 상품 탭
  const logGoodsListTabGoods = ({
    goodsId,
    goodsName,
    goodsIndex,
    query,
  }: {
    goodsId: string;
    goodsName: string;
    goodsIndex: number;
    query: string;
  }) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogGoodsListTabGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListTabGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 상품 검색 결과 내 필터 선택
  const logGoodsListTabFilter = ({
    categoryName,
    categoryId,
    filterIndex,
    query,
  }: {
    categoryName: string;
    categoryId: string;
    filterIndex: number;
    query: string;
  }) => {
    const parameters = {
      category_name: categoryName,
      category_id: categoryId,
      filter_index: filterIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogGoodsListTabFilter.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListTabFilter,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 상품 검색 결과 내 소팅 선택
  const logGoodsListTabSorting = ({ sortedType, query }: { sortedType: string; query: string }) => {
    const parameters = {
      sorted_type: sortedType,
      search_word: query,
    };

    debug.log(LogEventTypes.LogGoodsListTabSorting.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogGoodsListTabSorting,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 콘텐츠 검색 결과 진입
  const logContentListViewPage = ({ query }: { query: string }) => {
    const parameters = {
      search_word: query,
    };

    debug.log(LogEventTypes.LogContentListViewPage.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogContentListViewPage,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 콘텐츠 검색 결과 내 콘텐츠 노출
  // * 모웹 노출 로그는 추후 대응 예정
  const logContentListImpressionContent = ({
    contentsId,
    contentsName,
    contentsType,
    contentsIndex,
    query,
  }: {
    contentsId: string;
    contentsName: string;
    contentsType: string;
    contentsIndex: number;
    query: string;
  }) => {
    const parameters = {
      contents_id: contentsId,
      contents_name: contentsName,
      contents_type: contentsType,
      contents_index: contentsIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogContentListImpressionContent.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogContentListImpressionContent,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 콘텐츠 검색 결과 내 콘텐츠 탭
  const logContentListTabContent = ({
    contentsId,
    contentsName,
    contentsType,
    contentsIndex,
    query,
  }: {
    contentsId: string;
    contentsName: string;
    contentsType: string;
    contentsIndex: number;
    query: string;
  }) => {
    const parameters = {
      contents_id: contentsId,
      contents_name: contentsName,
      contents_type: contentsType,
      contents_index: contentsIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogContentListTabContent.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogContentListTabContent,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 쇼룸 검색 결과 진입
  const logBrandsListViewPage = ({ query }: { query: string }) => {
    const parameters = {
      search_word: query,
    };

    debug.log(LogEventTypes.LogBrandsListViewPage.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListViewPage,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 쇼룸 검색 결과 내 쇼룸 노출
  // * 모웹 노출 로그는 추후 대응 예정
  const logBrandsListImpressionShowroom = ({
    showroomId,
    showroomName,
    showroomIndex,
    query,
  }: {
    showroomId: string;
    showroomName: string;
    showroomIndex: number;
    query: string;
  }) => {
    const parameters = {
      showroom_id: showroomId,
      showroom_name: showroomName,
      showroom_index: showroomIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogBrandsListImpressionShowroom.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListImpressionShowroom,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 쇼룸 검색 결과 내 쇼룸 탭
  const logBrandsListTabShowroom = ({
    showroomId,
    showroomName,
    showroomIndex,
    liveId,
    onAir,
    query,
  }: {
    showroomId: string;
    showroomName: string;
    showroomIndex: number;
    liveId?: string;
    onAir: boolean;
    query: string;
  }) => {
    const parameters = {
      showroom_id: showroomId,
      showroom_name: showroomName,
      showroom_index: showroomIndex,
      onair: onAir,
      search_word: query,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogBrandsListTabShowroom.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListTabShowroom,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 쇼룸 검색 결과 내 상품 노출
  // * 모웹 노출 로그는 추후 대응 예정
  const logBrandsListImpressionGoods = ({
    goodsId,
    goodsName,
    goodsIndex,
    query,
  }: {
    goodsId: string;
    goodsName: string;
    goodsIndex: number;
    query: string;
  }) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogBrandsListImpressionGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListImpressionGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 쇼룸 검색 결과 내 상품 탭
  const logBrandsListTabGoods = ({
    goodsId,
    goodsName,
    goodsIndex,
    query,
  }: {
    goodsId: string;
    goodsName: string;
    goodsIndex: number;
    query: string;
  }) => {
    const parameters = {
      goods_id: goodsId,
      goods_name: goodsName,
      goods_index: goodsIndex,
      search_word: query,
    };

    debug.log(LogEventTypes.LogBrandsListTabGoods.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListTabGoods,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 쇼룸 검색 결과 내 쇼룸 팔로우 완료
  const logBrandsListCompleteShowroomFollow = ({
    showroomId,
    showroomName,
    query,
  }: {
    showroomId: string;
    showroomName: string;
    query: string;
  }) => {
    const parameters = {
      showroom_id: showroomId,
      showroom_name: showroomName,
      search_word: query,
    };

    debug.log(LogEventTypes.LogBrandsListCompleteShowroomFollow.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListCompleteShowroomFollow,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 쇼룸 검색 결과 내 쇼룸 팔로우 취소
  const logBrandsListCompleteShowroomUnfollow = ({
    showroomId,
    showroomName,
    query,
  }: {
    showroomId: string;
    showroomName: string;
    query: string;
  }) => {
    const parameters = {
      showroom_id: showroomId,
      showroom_name: showroomName,
      search_word: query,
    };

    debug.log(LogEventTypes.LogBrandsListCompleteShowroomUnfollow.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogBrandsListCompleteShowroomUnfollow,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 라이브 검색 결과 진입
  const logLiveListViewPage = ({ query }: { query: string }) => {
    const parameters = {
      search_word: query,
    };

    debug.log(LogEventTypes.LogLiveListViewPage.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogLiveListViewPage,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 라이브 검색 결과 내 편성표 콘텐츠 노출
  // * 모웹 노출 로그는 추후 대응 예정
  const logLiveListImpressionThumbnail = ({
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    landingScheme = '',
    onAir,
    query,
  }: {
    scheduleId: string;
    scheduleName: string;
    scheduleIndex: number;
    liveId?: string;
    // * 모웹에서는 빈값으로 사용, 추후 대응 예정
    landingScheme?: string;
    onAir: boolean;
    query: string;
  }) => {
    const parameters = {
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      landing_scheme: landingScheme,
      onair: onAir,
      search_word: query,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogLiveListImpressionThumbnail.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogLiveListImpressionThumbnail,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 라이브 검색 결과 내 편성표 콘텐츠 탭
  const logLiveListTabThumbnail = ({
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    landingScheme = '',
    onAir,
    query,
  }: {
    scheduleId: string;
    scheduleName: string;
    scheduleIndex: number;
    liveId?: string;
    // * 모웹에서는 빈값으로 사용, 추후 대응 예정
    landingScheme?: string;
    onAir: boolean;
    query: string;
  }) => {
    const parameters = {
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      landing_scheme: landingScheme,
      onair: onAir,
      search_word: query,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogLiveListTabThumbnail.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogLiveListTabThumbnail,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    });
  };

  // 라이브 검색 결과 내 라이브 알림 신청 완료
  const logLiveListCompleteScheduleNotiOptIn = ({
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    showroomId,
    showroomName,
    query,
  }: {
    scheduleId: string;
    scheduleName: string;
    scheduleIndex: number;
    liveId?: string;
    showroomId: string;
    showroomName: string;
    query: string;
  }) => {
    const parameters = {
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      showroom_id: showroomId,
      showroom_name: showroomName,
      search_word: query,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogLiveListCompleteScheduleNotiOptIn.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogLiveListCompleteScheduleNotiOptIn,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 라이브 검색 결과 내 라이브 알림 신청 취소
  const logLiveListCompleteScheduleNotiOptOut = ({
    scheduleId,
    scheduleName,
    scheduleIndex,
    liveId,
    showroomId,
    showroomName,
    query,
  }: {
    scheduleId: string;
    scheduleName: string;
    scheduleIndex: number;
    liveId?: string;
    showroomId: string;
    showroomName: string;
    query: string;
  }) => {
    const parameters = {
      schedule_id: scheduleId,
      schedule_name: scheduleName,
      schedule_index: scheduleIndex,
      showroom_id: showroomId,
      showroom_name: showroomName,
      search_word: query,
      ...(liveId && { live_id: liveId }),
    };

    debug.log(LogEventTypes.LogLiveListCompleteScheduleNotiOptOut.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogLiveListCompleteScheduleNotiOptOut,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  return {
    logTabRecentWord,
    logImpressionRecommendWord,
    logTabRecommendWord,
    logImpressionSectionGoods,
    logTabSectionGoodsThumbnail,
    logTabRecentGoods,
    logViewInResult,
    logTabInResultGoods,
    logTabInResultBrand,
    logTabInResultContent,
    logTabInResultSchedule,
    logCompleteSectionShowroomFollow,
    logCompleteSectionShowroomUnfollow,
    logCompleteSectionScheduleNotiOptIn,
    logCompleteSectionScheduleNotiOptout,
    logGoodsListViewPage,
    logGoodsListImpressionGoods,
    logGoodsListTabGoods,
    logGoodsListTabFilter,
    logGoodsListTabSorting,
    logContentListViewPage,
    logContentListImpressionContent,
    logContentListTabContent,
    logBrandsListViewPage,
    logBrandsListImpressionShowroom,
    logBrandsListTabShowroom,
    logBrandsListImpressionGoods,
    logBrandsListTabGoods,
    logBrandsListCompleteShowroomFollow,
    logBrandsListCompleteShowroomUnfollow,
    logLiveListViewPage,
    logLiveListImpressionThumbnail,
    logLiveListTabThumbnail,
    logLiveListCompleteScheduleNotiOptIn,
    logLiveListCompleteScheduleNotiOptOut,
  };
};
