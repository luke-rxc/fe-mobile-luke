import { InterestFreeCardSchema } from '../schemas';

export type InterestFreeCardModel = Omit<InterestFreeCardSchema, 'cardCompany' | 'dueDate'>;
