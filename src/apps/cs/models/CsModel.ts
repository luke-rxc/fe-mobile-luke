import { format } from 'date-fns';
import { getImageLink } from '@utils/link';
import type { QnaListItemProps, QnaDetailProps, QnaRegisterFormProps } from '../components';
import { FieldIds, OutgoingCallStatus, TicketStatusGroup, TicketStatusGroupLabel } from '../constants';
import type {
  ArticleListItemSchema,
  ArticleListSchema,
  ArticleDetailSchema,
  QnaListSchema,
  QnaDetailSchema,
  QnaFieldsSchema,
} from '../schemas';
import { getTicketStatusGroup, toRelativeTime } from '../utils';

export type ArticleListModel = Array<
  Omit<ArticleListItemSchema, 'id'> & {
    // 게시글 아이디
    articleId: number;
    // 작성일시
    relativeTime: string;
  }
>;

export const toArticleListModel = ({ content = [] }: ArticleListSchema): ArticleListModel => {
  return content.map(({ id: articleId, createdAt, ...rest }) => ({
    articleId,
    createdAt,
    relativeTime: toRelativeTime(createdAt),
    ...rest,
  }));
};

export type ArticleDetailModel = Omit<ArticleDetailSchema, 'body'> & {
  // 작성일자
  createdDate: string;
  // 내용
  body: string;
};

export const toArticleDetailModel = (article: ArticleDetailSchema): ArticleDetailModel => {
  const { createdAt, body, ...rest } = article;

  return {
    createdDate: format(createdAt, 'yyyy년 M월 d일'),
    body,
    createdAt,
    ...rest,
  };
};

export type QnaListModel = QnaListItemProps[];

export const toQnaListModel = (requests: QnaListSchema): QnaListModel => {
  return requests.map(({ id: requestId, subject: title, status, createdAt, updatedAt }) => {
    // 티켓 상태 그룹
    const ticketStatusGroup = getTicketStatusGroup(status);

    return {
      requestId,
      title,
      status: ticketStatusGroup,
      statusLabel: TicketStatusGroupLabel[ticketStatusGroup],
      relativeTime: toRelativeTime(updatedAt ?? createdAt),
    };
  });
};

export type QnaDetailModel = QnaDetailProps & {
  'data-log-goods-id'?: number;
};

export const toQnaDetailModel = (request: QnaDetailSchema): QnaDetailModel => {
  const { subject: title, status, createdAt, updatedAt, goods, comments, requesterId, customFields } = request;

  // 상품정보
  const goodsInfo: QnaDetailModel['goodsInfo'] = goods && {
    image: {
      src: getImageLink(goods.primaryImage.path),
      blurHash: goods.primaryImage.blurHash,
    },
    goodsName: goods.name,
  };

  // 문의 및 답변 코멘트를 그룹핑하며, 최근 문의 기준으로 내림차순 정렬 후 평탄화
  const convertedComments = comments
    .reduce<Array<QnaDetailModel['comments']>>((acc, comment) => {
      const converted: QnaDetailModel['comments'][0] = {
        commentId: comment.id,
        manager: requesterId !== comment.authorId,
        date: toRelativeTime(comment.createdAt),
        content: comment.htmlBody,
        attachments: comment.attachments.map(({ fileName, mappedContentUrl }) => ({ fileName, url: mappedContentUrl })),
      };

      if (!converted.manager) {
        // 문의글 내림차순 추가
        acc.unshift([{ ...converted }]);
      } else {
        const [first] = acc;

        // 답변글 오름차순 추가
        first && first.push({ ...converted });
      }

      return acc;
    }, [])
    .flat();

  // 티켓 상태 그룹
  const ticketStatusGroup = getTicketStatusGroup(status);

  // 유선 상담 상태 커스텀 필드 조회
  const outgoingCallField = customFields.find(({ id }) => id === FieldIds.OUTGOING_CALL_STATUS);
  // 유선 상담 상태
  const outgoingCallStatus = (outgoingCallField?.value?.toUpperCase() ?? OutgoingCallStatus.NONE) as OutgoingCallStatus;

  return {
    title,
    status: ticketStatusGroup,
    statusLabel: TicketStatusGroupLabel[ticketStatusGroup],
    relativeTime: toRelativeTime(updatedAt ?? createdAt),
    goodsInfo,
    comments: convertedComments,
    inquiryable: ticketStatusGroup === TicketStatusGroup.COMPLETE,
    outgoingCallStatus,
    'data-log-goods-id': goods?.id,
  };
};

export type QnaFieldsModel = QnaRegisterFormProps['inquiryFields'];

export const toQnaFieldsModel = (fields: QnaFieldsSchema): QnaFieldsModel => {
  return fields.options.map(({ name, value }) => {
    // 2단 옵션에 대한 처리
    const [first, second] = name.split('::');

    return {
      name: second ?? first,
      value,
    };
  });
};
