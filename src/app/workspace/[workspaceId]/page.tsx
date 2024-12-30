'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader, TriangleAlert } from 'lucide-react';

import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const [open, setOpen] = useCreateChannelModal();

  const { data: workspace, isPending: isPendingWorkspace } = useQuery(
    convexQuery(api.workspaces.getById, { id: workspaceId })
  );

  const { data: channels, isPending: isPendingChannels } = useQuery(
    convexQuery(api.channels.get, { workspaceId })
  );

  const { data: currentMember, isPending: isPendingCurrentMember } = useQuery(
    convexQuery(api.members.current, { workspaceId })
  );

  useEffect(() => {
    const channelId = channels?.[0]?._id;
    const isAdmin = currentMember?.role === 'admin';

    if (
      isPendingChannels ||
      isPendingWorkspace ||
      isPendingCurrentMember ||
      !workspace ||
      !currentMember
    ) {
      return;
    }

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channels,
    currentMember,
    currentMember?.role,
    isPendingChannels,
    isPendingCurrentMember,
    isPendingWorkspace,
    open,
    router,
    setOpen,
    workspace,
    workspaceId,
  ]);

  if (isPendingChannels || isPendingWorkspace || isPendingCurrentMember) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader className='size-5 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!workspace || !currentMember) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2'>
        <TriangleAlert className='size-5 text-muted-foreground' />
        <p className='text-sm text-muted-foreground'>Workspace not found</p>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col items-center justify-center gap-2'>
      <TriangleAlert className='size-5 text-muted-foreground' />
      <p className='text-sm text-muted-foreground'>Channel not found</p>
    </div>
  );
};

export default WorkspaceIdPage;
