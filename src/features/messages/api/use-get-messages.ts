import { usePaginatedQuery } from 'convex/react';

import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetMessagesProps {
  conversationId?: Id<'conversations'>;
  parentMessageId?: Id<'messages'>;
}

export type UseGetMessagesResponse =
  (typeof api.messages.get._returnType)['page'];

const BATCH_SIZE = 20;

export const useGetMessages = ({
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId, workspaceId },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
