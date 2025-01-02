'use client';

import { Loader, TriangleAlert } from 'lucide-react';

import MessageList from '@/components/message-list';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import ChannelHeader from '@/features/channels/components/channel-header';
import ChatInput from '@/features/channels/components/chat-input';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetMessages } from '@/features/messages/api/use-get-messages';

const ChannelIdPage = () => {
  const { results, status, loadMore } = useGetMessages({});

  const { data: channel, isPending: isPendingChannel } = useGetChannel();

  const { data: currentMember, isPending: isPendingCurrentMember } =
    useCurrentMember();

  if (
    isPendingChannel ||
    isPendingCurrentMember ||
    status === 'LoadingFirstPage'
  ) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader className='size-5 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!channel || !currentMember) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2'>
        <TriangleAlert className='size-5 text-muted-foreground' />
        <p className='text-sm text-muted-foreground'>Channel not found</p>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col'>
      <ChannelHeader
        title={channel.name}
        isAdmin={currentMember.role === 'admin'}
      />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
        variant='channel'
      />
      <ChatInput placeholder={`Write a message in #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
