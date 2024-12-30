'use client';

import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader, TriangleAlert } from 'lucide-react';

import MessageList from '@/components/message-list';
import ChannelHeader from '@/features/channels/components/channel-header';
import ChatInput from '@/features/channels/components/chat-input';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../../../convex/_generated/api';

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { results, status, loadMore } = useGetMessages({
    workspaceId,
    channelId,
  });

  const { data: channel, isPending: isPendingChannel } = useQuery(
    convexQuery(api.channels.getById, { id: channelId })
  );

  const { data: currentMember, isPending: isPendingCurrentMember } = useQuery(
    convexQuery(api.members.current, { workspaceId })
  );

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
