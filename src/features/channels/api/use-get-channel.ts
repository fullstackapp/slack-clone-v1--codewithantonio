import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';

import { useChannelId } from '@/hooks/use-channel-id';

import { api } from '../../../../convex/_generated/api';

export const useGetChannel = () => {
  const channelId = useChannelId();

  return useQuery(convexQuery(api.channels.getById, { id: channelId }));
};
