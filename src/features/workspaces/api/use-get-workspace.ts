import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';

import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';

export const useGetWorkspace = () => {
  const workspaceId = useWorkspaceId();
  return useQuery(convexQuery(api.workspaces.getById, { id: workspaceId }));
};
