import { MessageSquareTextIcon, Pencil, Smile, Trash } from 'lucide-react';

import EmojiPopover from './emoji-popover';
import Hint from './hint';
import { Button } from './ui/button';

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleRemove: () => void;
  handleReaction: (valus: string) => void;
  threadButtonIsHidden?: boolean;
}

const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleRemove,
  threadButtonIsHidden,
  handleReaction,
}: MessageToolbarProps) => {
  return (
    <div className='absolute right-5 top-0'>
      <div className='rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100'>
        <EmojiPopover
          label='Emoji'
          onEmojiSelect={(emoji) => handleReaction(emoji)}>
          <Button variant={'ghost'} size={'iconSm'} disabled={isPending}>
            <Smile className='size-4' />
          </Button>
        </EmojiPopover>
        {!threadButtonIsHidden && (
          <Hint label='Reply'>
            <Button
              variant={'ghost'}
              size={'iconSm'}
              disabled={isPending}
              onClick={handleThread}>
              <MessageSquareTextIcon className='size-4' />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label='Edit'>
              <Button
                variant={'ghost'}
                size={'iconSm'}
                disabled={isPending}
                onClick={handleEdit}>
                <Pencil className='size-4' />
              </Button>
            </Hint>
            <Hint label='Delete'>
              <Button
                variant={'ghost'}
                size={'iconSm'}
                disabled={isPending}
                onClick={handleRemove}>
                <Trash className='size-4' />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageToolbar;
