import { useRouter } from 'next/navigation';

import { Loader, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { createInitials } from '@/lib/utils';

import { useGetWorkspace } from '../api/use-get-workspace';
import { useGetWorkspaces } from '../api/use-get-workspaces';
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal';

const WorkspaceSwitcher = () => {
  const [_open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: workspaces, isPending: isPendingWorkspaces } =
    useGetWorkspaces();
  const { data: workspace, isPending: isPendingWorkspace } = useGetWorkspace();

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace._id !== workspaceId
  );

  const isLoading = isPendingWorkspace || isPendingWorkspaces;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='relative size-9 overflow-hidden bg-[#ababad] text-xl font-semibold text-slate-800 hover:bg-[#ababad]/80'>
          {isLoading ? (
            <Loader className='size-5 shrink-0 animate-spin' />
          ) : (
            createInitials(workspace?.name)
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start' className='w-64'>
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className='cursor-pointer flex-col items-start justify-start capitalize'>
          {workspace?.name}
          <span className='text-xs text-muted-foreground'>
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => {
          return (
            <DropdownMenuItem
              key={workspace._id}
              onClick={() => router.push(`/workspace/${workspace._id}`)}
              className='cursor-pointer overflow-hidden capitalize'>
              <div className='mr-2 flex size-9 shrink-0 items-center justify-center rounded-md bg-[#616061] text-lg text-white'>
                {createInitials(workspace?.name)}
              </div>
              <span className='truncate'>{workspace?.name}</span>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => setOpen(true)}>
          <div className='mr-2 flex size-9 items-center justify-center rounded-md bg-[#f2f2f2] text-lg text-slate-800'>
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
