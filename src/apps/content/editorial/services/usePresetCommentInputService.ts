import { useMutation } from '@hooks/useMutation';
import { useForm } from 'react-hook-form';
import { postComment } from '../apis';
import { CommentPageType } from '../constants';
import type { FormFields } from '../models';

/** 댓글 작성 */
export const usePresetCommentInputService = ({ code }: { code: string }) => {
  const method = useForm<FormFields>({
    defaultValues: {
      contents: '',
    },
  });

  const { mutateAsync: handleRegisterComment, isLoading } = useMutation((value: FormFields) =>
    postComment({
      type: CommentPageType.STORY,
      code,
      value,
    }),
  );

  return {
    method,
    isLoading,
    handleRegisterComment,
  };
};
