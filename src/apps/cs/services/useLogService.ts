import { WebLogTypes, AppLogTypes } from '@constants/log';
import { tracking } from '@utils/log';
import { createDebug } from '@utils/debug';
import { LogEventTypes } from '../constants';

const debug = createDebug('services:useLogService');

export const useLogService = () => {
  // 공지사항 > 공지 탭 페이지 뷰
  const logMyNoticeViewNotice = () => {
    debug.log(LogEventTypes.LogMyNoticeViewNotice);

    tracking.logEvent({
      name: LogEventTypes.LogMyNoticeViewNotice,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 공지사항 > 공지 상세 뷰
  const logMyNoticeViewArticle = ({ articleId }: { articleId: number }) => {
    const parameters = {
      notice_article_id: articleId,
    };

    debug.log(LogEventTypes.LogMyNoticeViewArticle.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyNoticeViewArticle,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 공지사항 > 이벤트 탭 페이지 뷰
  const logMyEventViewEvent = () => {
    debug.log(LogEventTypes.LogMyEventViewEvent);

    tracking.logEvent({
      name: LogEventTypes.LogMyEventViewEvent,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 공지사항 > 이벤트 상세 뷰
  const logMyEventViewArticle = ({ articleId }: { articleId: number }) => {
    const parameters = {
      event_article_id: articleId,
    };

    debug.log(LogEventTypes.LogMyEventViewArticle.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyEventViewArticle,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // FAQ 페이지 뷰
  const logMyFaqViewFaq = () => {
    debug.log(LogEventTypes.LogMyFaqViewFaq);

    tracking.logEvent({
      name: LogEventTypes.LogMyFaqViewFaq,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // FAQ 상세 뷰
  const logMyFaqViewArticle = ({ articleId }: { articleId: number }) => {
    const parameters = {
      faq_article_id: articleId,
    };

    debug.log(LogEventTypes.LogMyFaqViewArticle.concat(': %o'), parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyFaqViewArticle,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 문의하기 페이지 뷰
  const logMyQnaViewQna = () => {
    debug.log(LogEventTypes.LogMyQnaViewQna);

    tracking.logEvent({
      name: LogEventTypes.LogMyQnaViewQna,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 전화 상담 신청 탭
  const logMyQnaTabCallRequest = ({ goodsId }: { goodsId?: number }) => {
    const parameters = {
      goods_id: goodsId && `${goodsId}`,
    };

    debug.log(LogEventTypes.LogMyQnaTabCallRequest, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyQnaTabCallRequest,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 전화 상담 철회 탭
  const logMyQnaTabCallCancel = ({ goodsId }: { goodsId?: number }) => {
    const parameters = {
      goods_id: goodsId && `${goodsId}`,
    };

    debug.log(LogEventTypes.LogMyQnaTabCallCancel, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyQnaTabCallCancel,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  // 추가 문의 버튼 탭
  const logMyQnaTabAddComment = ({ goodsId }: { goodsId?: number }) => {
    const parameters = {
      goods_id: goodsId && `${goodsId}`,
    };

    debug.log(LogEventTypes.LogMyQnaTabAddComment, parameters);

    tracking.logEvent({
      name: LogEventTypes.LogMyQnaTabAddComment,
      parameters,
      targets: {
        web: [WebLogTypes.MixPanel],
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
      },
    });
  };

  return {
    logMyNoticeViewNotice,
    logMyNoticeViewArticle,
    logMyEventViewEvent,
    logMyEventViewArticle,
    logMyFaqViewFaq,
    logMyFaqViewArticle,
    logMyQnaViewQna,
    logMyQnaTabCallRequest,
    logMyQnaTabCallCancel,
    logMyQnaTabAddComment,
  };
};
