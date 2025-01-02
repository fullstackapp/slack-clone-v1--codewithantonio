import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetMessageProps {
  messageId: Id<'messages'>;
}

export const useGetMessage = ({ messageId }: UseGetMessageProps) => {
  const workspaceId = useWorkspaceId();
  return useQuery(
    convexQuery(api.messages.getById, { id: messageId, workspaceId })
  );
};
