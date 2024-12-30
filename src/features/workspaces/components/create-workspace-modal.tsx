import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { api } from '../../../../convex/_generated/api';
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal';

export default function CreateWorkspaceModal() {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState('');

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
  });

  const handleClose = () => {
    setOpen(false);
    setName('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(
      { name },
      {
        onSuccess(data) {
          toast.success('Workspace created');
          router.push(`/workspace/${data}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='Workspace name e.g. "Work", "Personal", "Project"'
          />
          <div className='flex justify-end'>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
