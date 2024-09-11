export interface TeaserSchema {
  description: string;
  liveSchedule: LiveSchema;
  hostShowRoom: ShowroomSchema;
  guestShowRoomList?: ShowroomSchema[];
}

export interface ShowroomSchema {
  id: number;
  code: string;
  backgroundColor: string;
  isActive: boolean;
  isFollowed: boolean;
  name: string;
  onAir: boolean;
  primaryImage: ImageSchema;
  textColor: string;
  liveId?: number;
  liveTitle?: string;
  tintColor: string;
}

export interface LiveSchema {
  isFollowed: boolean;
  live: {
    id: number;
    contentsType: 'AUCTION' | 'STANDARD';
    coverImage: ImageSchema;
    livePlayTime: number;
    liveStartDate: string;
    onAir: boolean;
    title: string;
    videoUrl?: string;
  };
}

export interface ImageSchema {
  id: number;
  path: string;
  width?: number;
  height?: number;
  blurHash?: string;
  fileType?: 'IMAGE' | 'LOTTIE';
}
