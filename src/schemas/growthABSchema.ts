/**
 * AB Test
 * @see https://www.notion.so/rxc/A-B-470f9daf7fb44f50984effe3b1acd745
 */

export interface GrowthABSchema {
  group: 'CONTROL_GROUP' | 'EXPERIMENTAL_GROUP';
  id: number;
  name: string;
  type: 'API' | 'UX';
}
