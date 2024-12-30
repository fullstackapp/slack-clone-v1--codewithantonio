import { usePaginatedQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetMessagesProps {
  workspaceId: Id<'workspaces'>;
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
  parentMessageId?: Id<'messages'>;
}

export type UseGetMessagesResponse =
  (typeof api.messages.get._returnType)['page'];

const BATCH_SIZE = 20;

export const useGetMessages = ({
  workspaceId,
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
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
