import { ChangeEvent, useRef, useState } from 'react';

import { Editor as EditorType } from '@tiptap/react';
import { toast } from 'sonner';

import Editor from '@/components/editor';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/messages/api/use-generate-upload-url';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Id } from '../../../../convex/_generated/dataModel';

type CreateMessageValuse = {
  body: string;
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  image?: Id<'_storage'>;
};
interface ChatInputProps {
  placeholder?: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [image, setImage] = useState<File | null>(null);

  const [isPending, setIsPending] = useState(false);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const editorRef = useRef<EditorType | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const createMessage = useCreateMessage();

  const generateUploadUrl = useGenerateUploadUrl();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files![0]);
    editorRef.current?.commands.focus();
  };

  const handleImageDelete = () => {
    setImage(null);
    imageRef.current!.value = '';
  };

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);

      const values: CreateMessageValuse = {
        body,
        workspaceId,
        channelId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl.mutateAsync({ workspaceId });
        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage.mutateAsync(values);
      editorRef.current?.commands.clearContent();
      editorRef.current?.commands.focus();
      handleImageDelete();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send message');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='w-full px-5'>
      <Editor
        image={image}
        onDeleteImage={handleImageDelete}
        onUploadImage={handleImageUpload}
        defaultValue={null}
        onSubmit={handleSubmit}
        onCancel={() => {}}
        placeholder={placeholder}
        disabled={isPending}
        editorRef={editorRef}
        imageRef={imageRef}
      />
    </div>
  );
};

export default ChatInput;
