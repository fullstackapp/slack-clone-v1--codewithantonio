import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { Copy, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { api } from '../../../../convex/_generated/api';

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
  const [code, setCode] = useState(joinCode);
  const workspaceId = useWorkspaceId();
  const inviteLink = `${window.location.origin}/join/${workspaceId}`;

  const { mutate: updateJoinCode, isPending: updateJoinCodeIsPending } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.newJoinCode),
    });

  const handleCopy = (inputValue: string, label: string) => {
    navigator.clipboard
      .writeText(inputValue)
      .then(() => toast.success(`${label} copied to the clipboard`));
  };

  const handleUpdateJoinCode = () => {
    updateJoinCode(
      { id: workspaceId },
      {
        onSuccess: () => {
          setCode(joinCode);
          toast.success('Join code regenerated');
        },
        onError: () => {
          toast.error('Failed to regenerate join code');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Invite people to ${name}`}</DialogTitle>
          <DialogDescription>
            Use this link and code to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className='mt-3 flex flex-col gap-y-6'>
          <div className='flex items-center space-x-2'>
            <div className='flex w-full flex-col gap-y-2'>
              <Label htmlFor='code'>
                1. Share the link to the invitation page of your workspace
              </Label>
              <div className='flex items-center space-x-2'>
                <Input
                  id='link'
                  defaultValue={inviteLink}
                  readOnly
                  className='flex flex-1 text-sm'
                />
                <Hint label='Copy' side='top' align='end'>
                  <Button
                    variant={'ghost'}
                    size='sm'
                    onClick={() => handleCopy(inviteLink, 'Invite link')}>
                    <Copy className='size-4' />
                  </Button>
                </Hint>
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex w-full flex-col gap-y-2'>
              <Label htmlFor='code'>
                2. Сopy the code and paste it on the invitation page
              </Label>
              <div className='flex items-center space-x-2'>
                <Input
                  id='code'
                  value={code}
                  readOnly
                  className='flex flex-1 text-center text-xl font-bold uppercase tracking-wide'
                  disabled={updateJoinCodeIsPending}
                />
                <Hint label='Copy' side='top' align='end'>
                  <Button
                    variant={'ghost'}
                    size='sm'
                    onClick={() => handleCopy(joinCode, 'Code')}
                    disabled={updateJoinCodeIsPending}>
                    <Copy className='size-4' />
                  </Button>
                </Hint>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className='mr-[48px] flex w-full items-center justify-center'>
            <Button
              variant={'outline'}
              onClick={handleUpdateJoinCode}
              disabled={updateJoinCodeIsPending}>
              <RefreshCcw className='mr-2 size-4' />
              Generate new code
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
