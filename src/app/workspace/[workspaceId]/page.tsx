'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Loader, TriangleAlert } from 'lucide-react';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const WorkspaceIdPage = () => {
  const [open, setOpen] = useCreateChannelModal();

  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: workspace, isPending: isPendingWorkspace } = useGetWorkspace();
  const { data: channels, isPending: isPendingChannels } = useGetChannels();
  const { data: currentMember, isPending: isPendingCurrentMember } =
    useCurrentMember();

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
