import styled from 'styled-components';
import { forwardRef } from 'react';
import { MediaSchema } from '@schemas/mediaSchema';
import { Action } from '@pui/action';
import { Profiles } from '@pui/profiles';
import { Conditional } from '@pui/conditional';
import { Image, ImageProps } from '@pui/image';
import { Icon, VideoFilled } from '@pui/icon';

export interface ReviewCardProps<T extends MediaSchema = MediaSchema> extends React.HTMLAttributes<HTMLDivElement> {
  /** link url */
  link?: string;
  /** review media model */
  media: T;
  /** reviewer name */
  userNickname: string;
  /** reviewer image model */
  userProfileImage: Pick<ImageProps, 'src' | 'lazy'>;
}

const ReviewCardComponent = forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ link, media, userNickname, userProfileImage, ...rest }, ref) => {
    const { fileType, path, blurHash, thumbnailImage } = media;
    const src = fileType === 'VIDEO' ? thumbnailImage?.path || path : path;

    return (
      <div ref={ref} {...rest}>
        <Conditional
          condition={!!link}
          className="review-inner"
          trueExp={<Action is="a" link={link} />}
          falseExp={<div />}
        >
          <span className="review-thumb">
            <Image lazy src={src} blurHash={blurHash} />
          </span>

          <span className="review-info">
            <span className="review-info-profile">
              <Profiles disabledLink size={40} liveId={0} showroomCode="" image={{ lazy: true, ...userProfileImage }} />
            </span>

            <span className="review-info-nickname">{userNickname}</span>

            {fileType === 'VIDEO' && (
              <span className="review-info-icon">
                <VideoFilled />
              </span>
            )}
          </span>
        </Conditional>
      </div>
    );
  },
);

/**
 * ReviewCard
 */
export const ReviewCard = styled(ReviewCardComponent)`
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  width: calc((100vw - 8rem) / 2);
  min-width: 12rem;
  max-width: 16.7rem;
  border-radius: ${({ theme }) => theme.radius.r8};

  .review-inner {
    display: block;
    padding-top: 100%;
    border-radius: inherit;

    &::after {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: ${({ theme }) => theme.color.states.pressedMedia};
      opacity: 0;
      transition: opacity 0.2s;
      content: '';
    }

    &:active::after {
      opacity: 1;
    }
  }

  .review-thumb {
    ${({ theme }) => theme.mixin.center()};
    width: 100%;
    height: 100%;
    border-radius: inherit;

    ${Image} {
      border-radius: inherit;
    }
  }

  .review-info {
    ${({ theme }) => theme.mixin.absolute({ b: 0, r: 0, l: 0 })};
    display: flex;
    z-index: 1;
    align-items: center;
    border-radius: inherit;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);

    &-profile {
      display: block;
      flex-shrink: 0;
    }

    &-nickname {
      ${({ theme }) => theme.mixin.ellipsis()};
      display: block;
      width: 100%;
      margin-left: -0.8rem;
      padding: 1rem 0.8rem;
      color: ${({ theme }) => theme.color.whiteLight};
      font: ${({ theme }) => theme.fontType.mini};
      text-shadow: 0 0.3rem 0.4rem rgba(0, 0, 0, 0.2);
    }

    &-icon {
      display: block;
      flex-shrink: 0;
      margin-left: ${({ theme }) => theme.spacing.s4};
      padding: 1rem 1rem 1rem 0;

      ${Icon} {
        width: 2rem;
        height: 2rem;
        filter: drop-shadow(0 0.4rem 0.8rem rgba(0, 0, 0, 0.16));
        color: ${({ theme }) => theme.color.whiteLight};
        vertical-align: middle;
      }
    }
  }
`;
