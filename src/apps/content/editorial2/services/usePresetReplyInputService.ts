import { useForm } from 'react-hook-form';
import { useMutation } from '@hooks/useMutation';
import { postReply } from '../apis';
import { ReplyPageType } from '../constants';
import type { FormFields } from '../models';

/** 댓글 작성 */
export const usePresetReplyInputService = ({ code }: { code: string }) => {
  const method = useForm<FormFields>({
    defaultValues: {
      contents: '',
    },
  });

  const { mutateAsync: handleRegisterReply, isLoading } = useMutation((value: FormFields) =>
    postReply({
      type: ReplyPageType.STORY,
      code,
      value,
    }),
  );

  return {
    method,
    isLoading,
    handleRegisterReply,
  };
};
