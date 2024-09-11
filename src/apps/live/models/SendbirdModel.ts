import { env } from '@env';
import { toDateFormat } from '@utils/date';
import { AdminMessage, BaseMessage, FileMessage, MessageType, UserMessage } from '@sendbird/chat/message';
import { SendbirdActionType, SendbirdSubActionType } from '../constants';
import { SendbirdMessageDataOrderSchema, SendbirdMessageDataSchema, SendbirdMessageDataUserSchema } from '../schemas';

/**
 * Sendbird 경매 message data user model
 */
export interface SendbirdMessageDataUserModel {
  profileImage: string;
  nickname: string;
}

/**
 * Sendbird 경매 message data order model
 */
export interface SendbirdMessageDataOrderModel {
  id: number;
  paymentDate: number;
}

/**
 * Sendbird 경매 message data model
 */
export interface SendbirdMessageDataModel {
  actionType: SendbirdActionType;
  user?: SendbirdMessageDataUserModel;
  subActionType: SendbirdSubActionType | undefined;
  order?: SendbirdMessageDataOrderModel;
  price?: string;
  actionValue?: string;
  actionIdentifier?: string;
}

export interface SendBirdUserMessageModel extends Omit<UserMessage, 'data'> {
  isAdmin: boolean;
  createdAtText: string;
  updatedAtText: string;
  data: SendbirdMessageDataModel;
}

export interface SendBirdFileMessageModel extends FileMessage {
  createdAtText: string;
  updatedAtText: string;
}

export interface SendBirdAdminMessageModel extends Omit<AdminMessage, 'data'> {
  createdAtText: string;
  updatedAtText: string;
  data: SendbirdMessageDataModel;
}

/**
 * Sendbird Live 경매 정보 model
 */
export interface SendBirdLiveAuctionInfoModel {
  id: number;
  status: string;
  price: number;
  round: number;
}

export type SendBirdMessageType = SendBirdUserMessageModel | SendBirdFileMessageModel | SendBirdAdminMessageModel;

export const toSendbirdUserMessageModelList = (items: Array<BaseMessage>, userId?: string) => {
  return items.map((item) => toSendbirdUserMessageModel(item, userId));
};

export const toSendbirdUserMessageModel = (
  item: BaseMessage,
  userId?: string,
  showRoomName?: string,
): SendBirdMessageType => {
  const convert = {
    ...item,
    createdAtText: toDateFormat(item.createdAt, 'HH:mm'),
    updatedAtText: toDateFormat(item.updatedAt, 'HH:mm'),
    customType: item.customType,
  };

  if (item.messageType === MessageType.FILE) {
    return convert as SendBirdFileMessageModel;
  }

  if (item.messageType === MessageType.ADMIN) {
    return {
      ...convert,
      data: item.data ? toSendbirdMessageDataModel(JSON.parse(item.data)) : undefined,
    } as SendBirdAdminMessageModel;
  }

  if (item.messageType === MessageType.USER) {
    const userMessageItem = item as UserMessage;
    return {
      ...convert,
      isAdmin: userMessageItem.sender.nickname === showRoomName,
      data: item.data ? toSendbirdMessageDataModel(JSON.parse(item.data)) : undefined,
    } as SendBirdUserMessageModel;
  }

  return {
    ...convert,
    isAdmin: false,
    data: item.data ? toSendbirdMessageDataModel(JSON.parse(item.data)) : undefined,
  } as SendBirdUserMessageModel;
};

/**
 * SendbirdMessageDataUserSchema -> SendbirdMessageDataUserModel converter
 */
export const toSendbirdMessageDataUserModel = (item: SendbirdMessageDataUserSchema): SendbirdMessageDataUserModel => {
  return {
    profileImage: `${env.endPoint.cdnUrl}/${item.profile_image}`,
    nickname: item.nickname,
  };
};

/**
 * SendbirdMessageDataOrderSchema -> SendbirdMessageDataOrderModel converter
 */
export const toSendbirdMessageDataOrderModel = (
  item: SendbirdMessageDataOrderSchema,
): SendbirdMessageDataOrderModel => {
  return {
    id: item.id,
    paymentDate: item.payment_date,
  };
};

/**
 * SendbirdMessageDataSchema -> SendbirdMessageDataModel converter
 */
export const toSendbirdMessageDataModel = (item: SendbirdMessageDataSchema): SendbirdMessageDataModel => {
  return {
    actionType: item.action_type,
    user: item.user ? toSendbirdMessageDataUserModel(item.user) : undefined,
    subActionType: item.sub_action_type,
    order: item.order ? toSendbirdMessageDataOrderModel(item.order) : undefined,
    price: item.price ? `${item.price?.toLocaleString()}원` : undefined,
    actionValue: item.action_value ? String(item.action_value) : undefined,
    actionIdentifier: item.action_identifier ? String(item.action_identifier) : undefined,
  };
};

/**
 * json string >
 */
export const toLiveAuctionInfo = (infoString: string): SendBirdLiveAuctionInfoModel => {
  return JSON.parse(infoString);
};
