import { useState } from 'react';

import { Loader, TriangleAlert, XIcon } from 'lucide-react';

import Message from '@/components/message';
import { Button } from '@/components/ui/button';
import { useCurrentMember } from '@/features/members/api/use-current-member';

import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMessage } from '../api/use-get-message';

interface ThreadProps {
  messageId: Id<'messages'>;
  onClose: () => void;
}

export default function Thread({ messageId, onClose }: ThreadProps) {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const { data: currentMember, isPending: isPendingCurrentMember } =
    useCurrentMember();

  const { data: message, isPending: isPendingMessage } = useGetMessage({
    messageId,
  });

  if (isPendingMessage || isPendingCurrentMember) {
    return (
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} size={'iconSm'} variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <Loader className='size-5 animate-spin text-muted-foreground' />
        </div>
      </div>
    );
  }

  if (!message || !currentMember) {
    return (
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} size={'iconSm'} variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex flex-1 flex-col items-center justify-center gap-2'>
          <TriangleAlert className='size-5 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-[49px] items-center justify-between border-b px-4'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} size={'iconSm'} variant='ghost'>
          <XIcon className='size-5 stroke-[1.5]' />
        </Button>
      </div>
      <Message
        id={message._id}
        memberId={message.memberId}
        authorImage={message.user.image}
        authorName={message.user.name}
        isAuthor={message.memberId === currentMember._id}
        reactions={message.reactions}
        body={message.body}
        image={message.image}
        createdAt={message._creationTime}
        updatedAt={message.updatedAt}
        isEditing={editingId === message._id}
        setEditingId={setEditingId}
        threadButtonIsHidden
      />
    </div>
  );
}
