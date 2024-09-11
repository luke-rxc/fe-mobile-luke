import { SendbirdActionType, SendbirdSubActionType } from '../constants';

/**
 * Sendbird 경매 message data user schema
 */
export interface SendbirdMessageDataUserSchema {
  profile_image: string;
  nickname: string;
}

/**
 * Sendbird 경매 message data order schema
 */
export interface SendbirdMessageDataOrderSchema {
  id: number;
  payment_date: number;
}

/**
 * Sendbird 경매 message data schema
 */
export interface SendbirdMessageDataSchema {
  action_type: SendbirdActionType;
  user?: SendbirdMessageDataUserSchema;
  sub_action_type: SendbirdSubActionType | undefined;
  order?: SendbirdMessageDataOrderSchema;
  price?: number;
  action_value?: string;
  action_identifier?: string;
}
