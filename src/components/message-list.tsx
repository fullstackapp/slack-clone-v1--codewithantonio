import { useState } from 'react';

import { differenceInMinutes, format } from 'date-fns';
import { Loader } from 'lucide-react';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { UseGetMessagesResponse } from '@/features/messages/api/use-get-messages';
import { formatDateLabel } from '@/lib/utils';

import { Id } from '../../convex/_generated/dataModel';
import ChannelHero from './channel-hero';
import Message from './message';

const TIME_THRESHOLD = 5;
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
  data: UseGetMessagesResponse;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
  variant,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const { data: currentMember } = useCurrentMember();

  const groupedMessagesByDate = data?.reduce(
    (acc, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].unshift(message);

      return acc;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className='messages-scrollbar mb-4 flex flex-1 flex-col-reverse gap-2 overflow-y-auto'>
      {Object.entries(groupedMessagesByDate).map(([key, value]) => (
        <div key={key}>
          <div className='relative my-2 text-center'>
            <hr className='absolute left-0 right-0 top-1/2 border-t border-gray-300' />
            <span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
              {formatDateLabel(key)}
            </span>
          </div>
          {value.map((message, index) => {
            const prevMessage = value[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                threadButtonIsHidden={variant === 'thread'}
                isAuthor={message.memberId === currentMember?._id}
              />
            );
          })}
        </div>
      ))}
      <div
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />

      {isLoadingMore && (
        <div className='relative my-2 text-center'>
          <hr className='absolute left-0 right-0 top-1/2 border-t border-gray-300' />
          <span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
            <Loader className='size-4 animate-spin' />
          </span>
        </div>
      )}
      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationeTime={channelCreationTime} />
      )}
    </div>
  );
};

export default MessageList;
