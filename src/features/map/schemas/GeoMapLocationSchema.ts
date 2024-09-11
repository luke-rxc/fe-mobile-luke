import { FileSchema } from '@schemas/fileSchema';

export interface PlaceSchema {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  address: string;
  mapImage: FileSchema;
  googleLink: string;
}
