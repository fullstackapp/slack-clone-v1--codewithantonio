import { useState } from 'react';

import { ChevronDown, ListFilter, SquarePen } from 'lucide-react';

import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { createInitials } from '@/lib/utils';

import { Doc } from '../../../../convex/_generated/dataModel';
import InviteModal from './invite-modal';
import PreferenceModal from './preference-modal';

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>;
  isAdmin?: boolean;
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [preferenceModalOpen, setPreferenceModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <>
      <PreferenceModal
        open={preferenceModalOpen}
        setOpen={setPreferenceModalOpen}
        initialValue={workspace.name}
      />
      <InviteModal
        open={inviteModalOpen}
        setOpen={setInviteModalOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <div className='flex h-[49px] items-center justify-between gap-0.5 px-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'transparent'}
              className='w-auto overflow-hidden p-1.5 text-lg font-semibold'
              size={'sm'}>
              <span className='truncate'>{workspace.name}</span>
              <ChevronDown className='ml-1 size-4 shrink-0 text-white' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={'bottom'}
            align={'start'}
            className={'w-64'}>
            <DropdownMenuItem className={'cursor-pointer capitalize'}>
              <div className='relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white'>
                {createInitials(workspace.name)}
              </div>
              <div className='flex flex-col items-start'>
                <p className='font-bold'>{workspace.name}</p>
                <p className='text-xs text-muted-foreground'>
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <Separator />
                <DropdownMenuItem
                  className='cursor-pointer py-2'
                  onClick={() => setInviteModalOpen(true)}>
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer py-2'
                  onClick={() => setPreferenceModalOpen(true)}>
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='flex items-center gap-0.5'>
          <Hint label='Filter conversations' side='bottom'>
            <Button variant={'transparent'} size={'iconSm'}>
              <ListFilter className='size-4' />
            </Button>
          </Hint>
          <Hint label='New message' side='bottom'>
            <Button variant={'transparent'} size={'iconSm'}>
              <SquarePen className='size-4' />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
