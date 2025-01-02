import { format } from 'date-fns';
import { toast } from 'sonner';

import { useRemoveMessage } from '@/features/messages/api/use-remove-message';
import { useUpdateMessage } from '@/features/messages/api/use-update-message';
import { useToggleReactions } from '@/features/reactions/api/use-toggle-reactions';
import useConfirm from '@/hooks/use-confirm';
import { usePanel } from '@/hooks/use-panel';
import { cn, createInitials, formatFullTime } from '@/lib/utils';

import { Doc, Id } from '../../convex/_generated/dataModel';
import Editor from './editor';
import Hint from './hint';
import MessageToolbar from './message-toolbar';
import Preview from './preview';
import Reactions from './reactions';
import Thumbnail from './thumbnail';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  body: Doc<'messages'>['body'];
  image: string | undefined | null;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  threadButtonIsHidden?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const Message = ({
  id,
  memberId,
  authorImage,
  authorName,
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  threadButtonIsHidden,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete message',
    'Are you sure?'
  );

  const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();

  const { mutate: updateMessage, isPending: updateMessageIsPending } =
    useUpdateMessage();

  const { mutate: removeMessage, isPending: removeMessageIsPending } =
    useRemoveMessage();

  const { mutate: toggleReaction } = useToggleReactions();

  const isPending = updateMessageIsPending || removeMessageIsPending;
  const avatarFallback = createInitials(authorName);

  const handleReaction = async (emoji: string) => {
    toggleReaction(
      { messageId: id, emoji },
      {
        onError: () => {
          toast.error('Failed to add reaction');
        },
      }
    );
  };

  const handleSubmit = async ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated');
          setEditingId(null);
        },
        onError: () => {
          toast.error('Failed to update message');
        },
      }
    );
  };

  const handleRemove = async () => {
    const isConfirmed = await confirm();
    if (!isConfirmed) {
      return;
    }

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success('Message deleted');
          setEditingId(null);
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError: () => {
          toast.error('Failed to delete message');
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            'group relative flex flex-col gap-2 px-5 py-2 hover:bg-gray-100/60',
            isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
            removeMessageIsPending &&
              'origin-bottom scale-y-0 transform transition-all duration-200'
          )}>
          <div className='relative pl-14'>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className='absolute left-2 top-0 text-xs leading-5 text-muted-foreground opacity-0 hover:underline group-hover:opacity-100'>
                {format(new Date(createdAt), 'hh:mm')}
              </button>
            </Hint>
            {isEditing ? (
              <div className='w-full'>
                <Editor
                  image={null}
                  defaultValue={JSON.parse(body)}
                  onSubmit={handleSubmit}
                  onCancel={() => setEditingId(null)}
                  disabled={isPending}
                  variant='update'
                />
              </div>
            ) : (
              <div className='flex w-full flex-col gap-2'>
                <Preview value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className='text-xs text-muted-foreground'>
                    (edited)
                  </span>
                ) : null}
                <Reactions reactions={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleRemove={handleRemove}
              handleReaction={handleReaction}
              threadButtonIsHidden={threadButtonIsHidden}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          'group relative flex flex-col gap-2 px-5 py-1.5 hover:bg-gray-100/60',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          removeMessageIsPending &&
            'origin-bottom scale-y-0 transform transition-all duration-200'
        )}>
        <div className='flex items-start gap-4'>
          <button>
            <Avatar className='size-10 rounded-md transition hover:opacity-75'>
              <AvatarImage src={authorImage ?? ''} alt={authorName ?? ''} />
              <AvatarFallback className='rounded-md bg-sky-500 text-white'>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className='w-full'>
              <Editor
                image={null}
                defaultValue={JSON.parse(body)}
                onSubmit={handleSubmit}
                onCancel={() => setEditingId(null)}
                disabled={isPending}
                variant='update'
              />
            </div>
          ) : (
            <div className='flex w-full flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <button className='text-sm font-bold text-primary hover:underline'>
                  {authorName}
                </button>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className='text-xs leading-5 text-muted-foreground hover:underline'>
                    {format(new Date(createdAt), 'h:mm a')}
                  </button>
                </Hint>
              </div>
              <Preview value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className='text-xs text-muted-foreground'>(edited)</span>
              ) : null}
              <Reactions reactions={reactions} onChange={handleReaction} />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleRemove={handleRemove}
            handleReaction={handleReaction}
            threadButtonIsHidden={threadButtonIsHidden}
          />
        )}
      </div>
    </>
  );
};

export default Message;
