/**
 * 쇼룸 Color
 */
export type ShowroomColor = {
  backgroundColor?: string | null;
  contentColor?: string | null;
  tintColor: string;
  textColor: string;
};

/**
 * 쇼룸 분류
 */
export type Showroom = 'NORMAL' | 'PGM' | 'CONCEPT';
