import { FileType } from '@constants/file';
import { FileSchema } from '@schemas/fileSchema';

export interface BannerSchema {
  bgColor: string;
  commonBannerType: 'GOODS_LUX_GUARANTEE' | 'ORDER_PAY_REREGISTRATION';
  id: number;
  layer2File?: LayerFileSchema;
  layer2Loop?: boolean;
  layerFile: LayerFileSchema;
  layerLoop: boolean;
  referenceId: number;
  schema: string;
  sortNum: number;
  subTitle: string;
  textColor: string;
  title: string;
  web: string;
}

export type LayerFileSchema = Pick<FileSchema, 'path'> & {
  type: FileType;
  thumbnailImage?: {
    id: number;
    path: string;
    blurHash?: string;
    width: number;
    height: number;
  };
  fileType: string;
};
