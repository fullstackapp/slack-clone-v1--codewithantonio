import { useState } from 'react';

import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader, TriangleAlert, XIcon } from 'lucide-react';

import Message from '@/components/message';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface ThreadProps {
  messageId: Id<'messages'>;
  onClose: () => void;
}

export default function Thread({ messageId, onClose }: ThreadProps) {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const workspaceId = useWorkspaceId();

  const { data: currentMember, isPending: isPendingCurrentMember } = useQuery(
    convexQuery(api.members.current, { workspaceId })
  );

  const { data: message, isPending: isPendingMessage } = useQuery(
    convexQuery(api.messages.getById, { id: messageId, workspaceId })
  );

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