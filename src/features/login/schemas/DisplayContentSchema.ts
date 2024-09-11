export interface DisplayContentSchema {
  id: number;
  path: string;
  blurHash: string;
  extension: string;
  width: number;
  height: number;
  fileType: string;
  thumbnailImage: {
    id: number;
    path: string;
    width: number;
    height: number;
  } | null;
}
