import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from 'lucide-react';

import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';
import SidebarItem from './sidebar-item';
import UserItem from './user-item';
import WorkspaceHeader from './workspace-header';
import WorkspaceSection from './workspace-section';

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [_open, setOpen] = useCreateChannelModal();

  const { data: currentMember, isPending: isPendingCurrentMember } = useQuery(
    convexQuery(api.members.current, { workspaceId })
  );
  const { data: workspace, isPending: isPendingWorkspace } = useQuery(
    convexQuery(api.workspaces.getById, { id: workspaceId })
  );
  const { data: channels, isPending: isPendingChannels } = useQuery(
    convexQuery(api.channels.get, { workspaceId })
  );
  const { data: members, isPending: isPendingMembers } = useQuery(
    convexQuery(api.members.get, { id: workspaceId })
  );

  if (
    isPendingCurrentMember ||
    isPendingWorkspace ||
    isPendingChannels ||
    isPendingMembers
  ) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <Loader className='size-5 animate-spin text-white' />
      </div>
    );
  }

  if (!currentMember || !workspace) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-y-2'>
        <AlertTriangle className='size-5 text-white' />
        <p className='text-sm text-white'>Workspace not found</p>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col'>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={currentMember.role === 'admin'}
      />
      <div className='mt-3 flex flex-col px-2'>
        <SidebarItem label='Threads' icon={MessageSquareText} id='threads' />
        <SidebarItem label='Drafts & Sent ' icon={SendHorizonal} id='drafts' />
      </div>
      <WorkspaceSection
        label='Channels'
        hint='New channel'
        onNew={
          currentMember.role === 'admin' ? () => setOpen(true) : undefined
        }>
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={HashIcon}
            id={item._id}
            variant={item._id === channelId ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label='Direct Messages'
        hint='New direct message'
        onNew={() => {}}>
        {members?.map((item) => (
          <UserItem
            key={item._id}
            label={item.user.name}
            image={item.user.image}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
